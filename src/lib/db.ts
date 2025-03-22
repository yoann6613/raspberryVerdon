import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI as string);
let db: Db;

export async function connectDB(): Promise<Db> {
    if (!db) {
        await client.connect();
        db = client.db(process.env.DB_NAME);
    }
    return db;
}
