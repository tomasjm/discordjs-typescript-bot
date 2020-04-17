export interface SongItem {
    user_id: number;
    url: string;
}

export interface SongList {
    server_id: number;
    songs: SongItem[];
}

export interface IDatabase {
    queue: SongList[]
}
