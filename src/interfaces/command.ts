import { Message } from "./discord";

export interface Command {
    name: string;
	description: string;
	execute(message: Message, args: string[]): void;
}

export interface PlayCommand extends Command {
	playSong(message: Message, serverId: number): void;
	checkPermissions?(message: Message): boolean;
  }