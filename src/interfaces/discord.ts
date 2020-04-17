import Discord from "discord.js";

export interface Message extends Discord.Message {
    server: Map<number,ServerConnectionInfo>;
    
}
export interface SongItem {
    user_id: number;
    url: string;
}
export interface ServerConnectionInfo {
    voiceChannel: Discord.VoiceChannel | undefined | null;
    textChannel: Discord.TextChannel | undefined |  null;
    voiceConnection: Discord.VoiceConnection | undefined |  null;
    queue: SongItem[];
    isPlaying: boolean;
}

