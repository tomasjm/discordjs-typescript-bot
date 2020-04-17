import { Message } from '../interfaces/discord';
import {Command} from '../interfaces/command';
import serverData from '../data';
const cmd: Command = {
	name: 'info',
	description: 'info!',
	execute(message: Message, args: string[] = []) {
		console.log(JSON.stringify(serverData.get(parseInt(message.guild!.id))?.queue))
		message.channel.send('Print logs');
	}
}
module.exports = cmd;