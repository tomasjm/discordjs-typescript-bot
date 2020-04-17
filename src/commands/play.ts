import { Message, VoiceConnection } from 'discord.js';
import ytdl from "ytdl-core";
import Command from '../command';
import db, { SongItem, SongList } from '../database';

/*
  TODO: BUSCAR, LISTAR Y ARREGLAR BUGS

  1- A veces no reproduce música
  2- Necesita la URL completa
  3- Si la lista ya existe, no reproduce musica bien, pues, se debe actualizar el VoiceConnection
*/

interface PlayCommand extends Command {
  playSong(serverId: number, voiceConnection: VoiceConnection): void;
  checkPermissions(message: Message): boolean;
}
const cmd: PlayCommand = {
  name: 'play',
  description: 'Reproduce una canción',
  async execute(message: Message, args: string[]) {
    console.log('-------------------- COMANDO PLAY --------------------')
    console.log(args);
    let permissions: boolean = this.checkPermissions(message);
    if (!permissions) return;
    const serverId: number = parseInt(message.guild!.id);
    const requestedSong: string = args[0];
    const userId: number = parseInt(message.author.id);
    console.log(`ServerId: ${serverId}`);
    console.log(`Song: ${requestedSong}`);
    console.log(`UserId: ${userId}`);


    //TODO BUSCAR INFORMACION POR TERMINO
    const songInfo = await ytdl.getInfo(requestedSong); 
    const songItem: SongItem = {
      user_id: userId,
      url: songInfo.video_url
    }
    console.log(`SongItem: ${songItem}`);


    console.log(`Buscando lista para server: ${serverId}`);
    const songList = db.getConnection().get('queue').find({ server_id: serverId }).value();
    console.log(`Lista existente?: ${JSON.stringify(songList)}`)

    const voiceConnection = await message.member?.voice.channel?.join();
    //TODO ESTÁ REPRODUCIENDO
    if (songList) { 
      console.log(`Lista existe, actualizando lista con nueva canción`)
      db.getConnection().get('queue').find({ server_id: serverId }).assign({ server_id: songList.server_id, songs: [...songList.songs, songItem] }).write();

      //TODO NO ESTÁ REPRODUCIENDO
    } else { 
      console.log(`Lista no existe, creando lista con nueva canción`)
      const newSongList: SongList = {
        server_id: serverId,
        songs: [songItem]
      }
      db.getConnection().get('queue').push(newSongList).write();
      console.log('intentando conectar al canal de voz')
      if (voiceConnection) {
        this.playSong(serverId, voiceConnection);
      }
    }
    
    console.log('finished')
  },
  checkPermissions(message: Message): boolean {
    const voiceChannel = message.member?.voice.channel;
    if (!voiceChannel) {
      message.channel.send(
        "Tienes que estar en una sala de voz para escuchar música"
      );
      return false;
    }
    const permissions = voiceChannel.permissionsFor(message.client.user!);
    if (!permissions?.has("CONNECT") || !permissions?.has("SPEAK")) {
      message.channel.send(
        "No tengo los permisos necesarios para entrar al canal de voz y/o colocar música"
      );
      return false;
    }
    return true;
  },
  async playSong(serverId: number, voiceConnection: VoiceConnection) {
    const songList: SongList = db.getConnection().get('queue').find({server_id: serverId}).value();
    const song: SongItem = songList.songs[0];

    if (!song) {
     await voiceConnection.disconnect();
     return;
    }

    const dispatcher = voiceConnection
    .play(ytdl(song.url))
    .on("finish", () => {
      songList.songs.shift();
      db.getConnection().get('queue').find({ server_id: serverId }).assign({ server_id: songList.server_id, songs: [...songList.songs] }).write();
      this.playSong(serverId, voiceConnection);
    })
    .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(5 / 5);

  }
}
module.exports = cmd;