import * as ytdl from 'ytdl-core';
import * as Discord from 'discord.js';
import { prefix, token } from "./config.json";
import path from 'path';
import fs from 'fs';
import Command from './command';

class MusicBot {
	private client: Discord.Client;
	private token: string;
	private commands: Discord.Collection<string, Command>;
	constructor(token: string, prefix: string) {
		this.commands = new Discord.Collection();
		this.client = new Discord.Client();
		this.token = token;
	}
	private async setupCommands(): Promise<void> {
		const commandFiles: string[] = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const command_path: string = `./commands/${file}`;
			const command: Command = await import(command_path);
			this.commands.set(command.name, command);
			console.log(`Se ha agregado el comando: ${command.name}`);
		}
	}
	public async start(): Promise<void> {
		await this.setupCommands();
		const result = await this.client.login(this.token);
		console.log(result);
	}
	public Client(): Discord.Client {
		return this.client;
	}
	public Commands(): Discord.Collection<string, Command> {
		return this.commands;
	}
}

const _bot = new MusicBot(token, prefix);
_bot.Client().once('ready', () => {
	console.log('El bot está listo');
	_bot.Client().user?.setActivity(`MEZCLANDO MUSICA CHORA`, {
		type: 'WATCHING'
	});
});
_bot.Client().on('message', (message: Discord.Message) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift()?.toLowerCase();

	if (command !== undefined) {
		if (!_bot.Commands().has(command)) return;
	} else return;

	try {
		const cmd: Command | undefined = _bot.Commands().get(command);
		if (cmd !== undefined) cmd.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('Hubo un error al ejectura el comando!');
	}

});
_bot.start();