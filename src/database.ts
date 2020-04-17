import low from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync';
import { IDatabase } from "./interfaces/database";

class Database {
    private database: low.LowdbAsync<IDatabase>;
    private adapter: low.AdapterAsync<IDatabase>;
    private jsonPath: string = 'data.json';
    constructor(databasePath: string | null = null) {
        if (databasePath) {
            this.jsonPath = databasePath;
        }
        this.adapter = new FileAsync<IDatabase>(this.jsonPath);
    }
    public async createConnection(): Promise<void> {
        this.database = await low(this.adapter);
        this.database.defaults({ queue: []}).write();
        console.log('database connected');
    }
    public getConnection(): low.LowdbAsync<IDatabase> {
        return this.database;
    }
}
const db = new Database('queue.json');
export default db;
 