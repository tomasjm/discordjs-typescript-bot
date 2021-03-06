import { Message } from '../interfaces/discord';
import {Command} from '../interfaces/command';
import data from "../data";
const cmd: Command = {
	name: 'ping',
	description: 'Ping!',
	execute(message: Message, args: string[] = []) {
		message.channel.send('Pong');
	}
}
module.exports = cmd;