import { Collection, ObjectId } from 'mongodb';
import { getDB } from './database.service';
import { User } from '../models/user.model';
import { config } from '../config.js';

let userCollection;

async function getUserCollection() {
	if (!userCollection) {
		const db = await getDB();
		userCollection = db.collection(config.db.USERS_COLLECTION_NAME);
	}
	return userCollection;
}

// get all users
export async function getAllUsers() {
	let uColl = await getUserCollection();
	let userDocs = await uColl.find({}).toArray();
	let users = userDocs.map((userDoc) => User.fromMongoDoc(userDoc));
	return users; // TODO: turn these into Justin users
}

export async function addUser(user) {
	let uColl = await getUserCollection();
	await uColl.insertOne(user);
}

export async function clearUsers() {
	let uColl = await getUserCollection();
	await uColl.deleteMany({});
}

export async function getUserById(id) {
	let uColl = await getUserCollection();
	let objId = new ObjectId(id);
	let userDoc = await uColl.findOne({ _id: objId });
	// TODO: turn userDoc into a Justin User
	return User.fromMongoDoc(userDoc);
}
