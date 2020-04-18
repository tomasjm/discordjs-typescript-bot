import {TextChannel, MessageEmbed } from 'discord.js';
import ytdl from "ytdl-core";
import { PlayCommand } from '../interfaces/command';
import { SongItem } from "../interfaces/database";
import { Message, ServerConnectionInfo } from "../interfaces/discord";
import ServerData from "../data";
import chalk from 'chalk';
/*
  PASOS:

  1- Confirmar permisos [LISTO]
  2- Confirmar que el usuario esté en un canal de voz [LISTO]
  3- Confirmar si es que existe ya un canal de voz registrado, y confirmar que el usuario esté en el mismo canal. [LISTO]

  4- Obtener la canción y agregarla a la playlist [LISTO]
  5- Confirmar si ya se está reproduciendo musica (VoiceConnection) [LISTO]
  6- Si isPlaying = false, generar la nueva conexión si es que no existe y es distinta al canal del usuario. [LISTO]


*/


const cmd: PlayCommand = {
  name: 'play',
  description: 'Reproduce una canción',
  async execute(message: Message, args: string[]) {
    const voiceChannel = message.member?.voice.channel;
    const textChannel = <TextChannel>message.channel;
    if (!voiceChannel) return message.channel.send("Tienes que estar en una sala de voz para escuchar música");
    
    const permissions = voiceChannel.permissionsFor(message.client.user!);
    if (!permissions?.has("CONNECT") || !permissions?.has("SPEAK")) {
      return message.channel.send("No tengo los permisos necesarios para entrar al canal de voz y/o colocar música");
    }
    const serverId: number = parseInt(message.guild!.id);
    let currentServerInfoExists: boolean = ServerData.has(serverId);
    let currentServerInfo: ServerConnectionInfo;
    if (currentServerInfoExists) {
      currentServerInfo = ServerData.get(serverId)!;
      if (currentServerInfo.voiceChannel !== voiceChannel && currentServerInfo.voiceChannel != null) {
        return message.channel.send("Tienes que estar en la misma sala de voz para colocar música"); 
      }
      if (message.guild?.me?.voice.channel == null) {
        // TODO HACER UNA FUNCION DE RESET
        const serverInfo: ServerConnectionInfo = {
          voiceChannel,
          textChannel,
          voiceConnection: null,
          queue: [],
          isPlaying: false
        }
        currentServerInfo = serverInfo;
        ServerData.set(serverId, serverInfo);
      }
    } else {
       // TODO HACER UNA FUNCION DE RESET
      const serverInfo: ServerConnectionInfo = {
        voiceChannel,
        textChannel,
        voiceConnection: null,
        queue: [],
        isPlaying: false
      }
      currentServerInfo = serverInfo;
      ServerData.set(serverId, serverInfo);
    }
      let errorInfo: boolean = false;
      let songItem: SongItem;
      await ytdl.getInfo(args[0], (err, info) => {
        if (err)  {
          errorInfo = true;
          return message.channel.send(`${err.name}: ${err.message}`); 
        }
        songItem = {
          user_id: parseInt(message.member!.id),
          url: info.video_url
        }
        currentServerInfo.queue.push(songItem);
        const messageEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`Se ha agregado una nueva canción`)
        .setAuthor('DJ Pinochet breo', 'https://www.biografiasyvidas.com/biografia/p/fotos/pinochet.jpg')
        .addFields(
            { name: `Titulo`, value: info.title},
            { name: `Url de video`, value: info.video_url},
        )
        .setTimestamp()
        .setFooter('HIGH IQ BRO?');
        message.channel.send(messageEmbed);
      }); 
      if (errorInfo) return;

    if (currentServerInfo.isPlaying) return ServerData.set(serverId, currentServerInfo);

    if (currentServerInfo.voiceConnection) {
      currentServerInfo.isPlaying = true;
      ServerData.set(serverId, currentServerInfo)
      return this.playSong(message, serverId);
    };
    const voiceConnection = await voiceChannel.join();
    if (voiceConnection) {
      currentServerInfo.isPlaying = true;
      currentServerInfo.voiceConnection = voiceConnection;
      ServerData.set(serverId, currentServerInfo);
      this.playSong(message, serverId);
    } else return message.channel.send("Hubo un error al intentar entrar al canal de voz"); 
    

  },
  async playSong(message: Message, serverId: number, replay:boolean = false) {
    let currentServerInfo = ServerData.get(serverId);
    let songList: SongItem[] | undefined = currentServerInfo?.queue;
    if (replay) {
      if (songList?.length != 0) songList?.shift();
      else {
        await currentServerInfo?.voiceConnection!.disconnect();
        return ServerData.delete(serverId)
      }
      currentServerInfo!.queue = songList!;
      ServerData.set(serverId, currentServerInfo!); // Puede ser []
    }
    let currentSong: SongItem = songList![0];
    if (!currentSong) {
      await currentServerInfo?.voiceConnection!.disconnect();
      return ServerData.delete(serverId)
    }
    const dispatcher = currentServerInfo?.voiceConnection!
    .play(ytdl(currentSong.url))
    .on("finish", () => {
      this.playSong(message, serverId, true);
    })
    .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(5 / 5);

  }
}
module.exports = cmd;