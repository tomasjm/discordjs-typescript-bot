import { Message } from '../interfaces/discord';
import { Command } from '../interfaces/command';
import data from "../data";
import { MessageEmbed } from 'discord.js';
const cmd: Command = {
    name: 'stop',
    description: 'Dejar de reproducir música',
    execute(message: Message, args: string[] = []) {
        const serverInfo = data.get(parseInt(message.guild!.id));
        if (!serverInfo) return message.channel.send("No tengo información de música");
        if (!serverInfo?.voiceConnection || !serverInfo.isPlaying) {
            data.delete(parseInt(message.guild!.id));
            return message.channel.send("No estoy reproduciendo música");
        }
        if (!serverInfo.isPlaying) return
        if (!message.member!.voice.channel)
            return message.channel.send(
                "Debes estar en un canal de voz para detener la música!"
            );

        if (serverInfo!.voiceChannel !== message.member?.voice.channel && serverInfo!.voiceChannel != null) {
            return message.channel.send("Tienes que estar en la misma sala de voz para parar la música");
        }
        if (!serverInfo?.queue || serverInfo.queue.length == 0)
            return message.channel.send("No existe una lista de reproducción para detener");
        let newServerInfo = serverInfo;
        newServerInfo.queue = [];
        data.set(parseInt(message.guild!.id), newServerInfo);
        serverInfo.voiceConnection!.dispatcher.end();
        const messageEmbed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`Utilidades de música`)
        .setAuthor('DJ Pinochet breo', 'https://www.biografiasyvidas.com/biografia/p/fotos/pinochet.jpg')
        .setDescription('Se ha finalizado la reproducción de música')
        .setTimestamp()
        .setFooter('HIGH IQ BRO?');
        return message.channel.send(messageEmbed);
    }
}
module.exports = cmd;