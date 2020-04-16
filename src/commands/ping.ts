import { Message } from 'discord.js';
import Command from '../command';
const cmd: Command = {
	name: 'ping',
	description: 'Ping!',
	execute(message: Message, args: string[] = []) {
		message.channel.send('Pong');
	}
}
module.exports = cmd;