import { Message } from "./discord";

export interface Command {
    name: string;
	description: string;
	aliases?: string[];
	execute(message: Message, args: string[]): void;
}

export interface PlayCommand extends Command {
	playSong(message: Message, serverId: number, replay?: boolean): void;
	searchSongs?(message: Message, args: string[]): Promise<string[] | undefined>;
	checkPermissions?(message: Message): boolean;
  }