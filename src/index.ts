import * as Discord from 'discord.js';
import { prefix, token } from "./config.json";
import fs from 'fs';
import {Command} from './interfaces/command';
// import db from './database';
import chalk from 'chalk';
import { Message, ServerConnectionInfo } from "./interfaces/discord";


class MusicBot {
	private client: Discord.Client;
	private token: string;
	private commands: Discord.Collection<string, Command>;
	constructor(token: string) {
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
			console.log(`Se ha agregado el comando: ${chalk.blue(command.name)}`);
		}
	}
	public async start(): Promise<void> {
		//await db.createConnection();
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

const _bot = new MusicBot(token);

_bot.Client().once('ready', () => {
	console.log('El bot está listo');
	_bot.Client().user?.setActivity(`MEZCLANDO MUSICA CHORA`, {
		type: 'WATCHING'
	});
});
_bot.Client().on('message', (message: Message) => {

	console.log("---------------")
	console.log('Se ha recibido un mensaje')
	
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	console.log('Se ha pasado la validación de comando')
	const args = message.content.slice(prefix.length).split(/ +/);
	console.log(`Argumentos: ${args}`);
	const command = args.shift()?.toLowerCase();
	console.log(`Comando: ${command}`)
	
	if (command == undefined) return

	try {
		const cmd: Command | undefined = _bot.Commands().get(command) || _bot.Commands().find((c: Command) => (c.aliases) ? c.aliases.includes(command) : false);
		if (cmd !== undefined) cmd.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('Hubo un error al ejecutar el comando!');
	}

});
_bot.start();