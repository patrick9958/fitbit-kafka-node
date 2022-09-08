import { Collection, ObjectId } from 'mongodb';
import { getDB } from '../db/db.service.js';
import { User } from '../models/user.model.js';
import { config } from '../config/config.js';

// TODO: make all DB ops more safe with
// try-catch blocks, return vals, documentation, and Logging

let userCollection;

export async function getUserCollection() {
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
	console.log(userDocs);
	let users = userDocs.map((userDoc) => User.fromMongoDoc(userDoc));
	return users; // TODO: turn these into Justin users
}

export async function addUser(user) {
	let uColl = await getUserCollection();
	await uColl.insertOne(user);
}

// TODO: make more flexible with timeprefs etc.
export function createNewUser(name, email, hassedPass) {
	const studyParams = {
		studyId: 'justin-example-1',
		cohorts: ['intervention'],
		triggers: ['usertimepref.trigger'],
		enrollmentDate: new Date(),
		phase: 'active'
	};

	const userPrefs = {};

	userPrefs['address'] = {
		postalCode: '48104'
	};

	userPrefs['messageTimePrefs'] = {
		namedTimes: [
			{
				name: 'morning',
				time: new Date(1970, 1, 1, 8, 0)
			},
			{
				name: 'midday',
				time: new Date(1970, 1, 1, 12, 0)
			},
			{
				name: 'afternoon',
				time: new Date(1970, 1, 1, 15, 0)
			},
			{
				name: 'evening',
				time: new Date(1970, 1, 1, 18, 0)
			}
		]
	};

	const userState = {};
	userState['fitbitSteps'] = {
		value: 0,
		updated: new Date()
	};
	return new User(name, email, hassedPass, studyParams, userPrefs, userState);
}

export async function clearUsers() {
	let uColl = await getUserCollection();
	await uColl.deleteMany({});
}

export async function getUserById(id) {
	let uColl = await getUserCollection();
	let objId = new ObjectId(id);
	let userDoc = await uColl.findOne({ _id: objId });
	return userDoc;
	// TODO: turn userDoc into a Justin User
	// return User.fromMongoDoc(userDoc);
}

export async function getUserByEmail(email) {
	let uColl = await getUserCollection();
	let userDoc = await uColl.findOne({ email: email });
	return userDoc;
	// console.log(userDoc);
	// return User.fromMongoDoc(userDoc);
}

export async function getUserByName(name) {
	let uColl = await getUserCollection();
	let userDoc = await uColl.findOne({ name: name });
	return User.fromMongoDoc(userDoc);
}
