import { Message } from '../interfaces/discord';
import { Command } from '../interfaces/command';
import Discord from 'discord.js';
import data from "../data";
const cmd: Command = {
    name: 'list',
    description: 'list!',
    execute(message: Message, args: string[] = []) {
        let serverInfo = data.get(parseInt(message.guild!.id));
        if (!serverInfo) return message.channel.send("No hay información de música");
        const songList = serverInfo.queue.map((song, index) => {
            if (index<=14) {
                return `${index+1}) ${song.url}`;
            }
        });
        const reproductionList: string = songList.join('\n');
        const listEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Lista de reproducción`)
            .setAuthor('DJ Pinochet breo', 'https://www.biografiasyvidas.com/biografia/p/fotos/pinochet.jpg')
            .addFields(
                { name: `Hay ${songList.length} canciones en la lista`, value: reproductionList},
            )
            .setTimestamp()
            .setFooter('HIGH IQ BRO?');

        message.channel.send(listEmbed);
    }
}
module.exports = cmd;