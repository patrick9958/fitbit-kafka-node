import * as mongo from 'mongodb';
import { config } from '../config/config.js';

let db;

export async function getDB() {
	if (!db) {
		const client = new mongo.MongoClient(config.mongo.url);
		await client.connect();
		db = client.db(config.db.DB_NAME);
	}
	return db;
}
