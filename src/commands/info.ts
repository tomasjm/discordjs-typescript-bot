import Discord from "discord.js";
import { Message } from '../interfaces/discord';
import {Command} from '../interfaces/command';
import data from '../data';
import chalk from "chalk";
const cmd: Command = {
	name: 'info',
	description: 'info!',
	execute(message: Message, args: string[] = []) {
		let serverInfo = data.get(parseInt(message.guild!.id));
        if (!serverInfo) {
        	const listEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Información de reproducción del servidor`)
            .setAuthor('DJ Pinochet breo', 'https://www.biografiasyvidas.com/biografia/p/fotos/pinochet.jpg')
            .addFields(
				{ name: `Server ID:`, value: message.guild!.id},
				{ name: `Voice Channel`, value: undefined},
				{ name: `Text Channel`, value: undefined},
				{ name: 'Voice Connection', value: undefined},
                { name: `Queue`, value: undefined},
            )
            .setTimestamp()
            .setFooter('HIGH IQ BRO?');
			return message.channel.send(listEmbed);
			
		}
		console.log(chalk.green("---- SERVER INFO ----"))
		console.log(`Server ID: ${chalk.cyan(message.guild!.id)}\n`)
		console.log(`Voice Channel: ${chalk.cyan(JSON.stringify(serverInfo.voiceChannel))}\n`)
		console.log(`Text Channel: ${chalk.cyan(JSON.stringify(serverInfo.textChannel))}\n`)
		console.log(`Voice Connection: ${chalk.cyan(typeof(serverInfo.voiceConnection))}\n`)
        const listEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Información de reproducción del servidor`)
            .setAuthor('DJ Pinochet breo', 'https://www.biografiasyvidas.com/biografia/p/fotos/pinochet.jpg')
            .addFields(
				{ name: `Server ID:`, value: message.guild!.id},
				{ name: `Voice Channel`, value: JSON.stringify(serverInfo.voiceChannel)},
				{ name: `Text Channel`, value: JSON.stringify(serverInfo.textChannel)},
				{ name: 'Voice Connection', value: typeof(serverInfo.voiceConnection)}
            )
            .setTimestamp()
            .setFooter('HIGH IQ BRO?');

		message.channel.send(listEmbed);

	}
}
module.exports = cmd;