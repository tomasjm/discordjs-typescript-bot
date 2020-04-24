import { Message } from '../interfaces/discord';
import { Command } from '../interfaces/command';
import data from "../data";
import { MessageEmbed } from 'discord.js';
const cmd: Command = {
    name: 'skip',
    description: 'Adelantar una canción',
    aliases: ['s'],
    execute(message: Message, args: string[] = []) {
        const serverInfo = data.get(parseInt(message.guild!.id));
        if (!serverInfo) return message.channel.send("No tengo información de música");
        if (!serverInfo?.voiceConnection || !serverInfo.isPlaying) {
            let newServerInfo = serverInfo;
            newServerInfo!.isPlaying = false;
            newServerInfo!.voiceChannel = null;
            newServerInfo!.textChannel = null;
            newServerInfo!.voiceConnection = null;
            data.set(parseInt(message.guild!.id), newServerInfo);
            return message.channel.send("No estoy reproduciendo música");
        }
        if (!serverInfo.isPlaying) return
        if (!message.member!.voice.channel)
            return message.channel.send(
                "Debes estar en un canal de voz para adelantar la música!"
            );

        if (serverInfo!.voiceChannel !== message.member?.voice.channel && serverInfo!.voiceChannel != null) {
            return message.channel.send("Tienes que estar en la misma sala de voz para adelantar música");
        }
        if (!serverInfo?.queue || serverInfo.queue.length == 0)
            return message.channel.send("No hay ninguna canción por adelantar");
        serverInfo.voiceConnection!.dispatcher.end();
        const messageEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Utilidades de música`)
            .setAuthor('DJ Pinochet breo', 'https://www.biografiasyvidas.com/biografia/p/fotos/pinochet.jpg')
            .setDescription('Se ha adelantado una canción')
            .setTimestamp()
            .setFooter('HIGH IQ BRO?');
        return message.channel.send(messageEmbed);
    }
}
module.exports = cmd;