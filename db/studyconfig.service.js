import { Collection, ObjectId } from 'mongodb';
import { getDB } from './database.service';
import { promises as fs } from 'fs';
import { ITrigger } from '../models/trigger.interface';
import { config } from '../config/config.js';

let configCollection;

async function getConfigCollection() {
	if (!configCollection) {
		const db = await getDB();
		configCollection = db.collection(config.db.CONFIG_COLLECTION_NAME);
	}
	return configCollection;
}

async function fileExists(path) {
	try {
		await fs.access(path);
		return true;
	} catch {
		return false;
	}
}

async function importTrigger(triggerPath) {
	let trigger = await import(triggerPath);
	return new trigger.default();
}

export async function getTriggers() {
	let cfgColl = await getConfigCollection();
	let triggerDoc = await cfgColl.find({ _id: 'triggers' }).next();
	let triggerNames;
	if (triggerDoc) {
		triggerNames = triggerDoc.triggers;
	}

	let triggerPaths = [process.env.JUSTIN_CORE_PATH, process.env.JUSTIN_APP_PATH];

	let triggerObjects = [];

	// instantiate Triggers
	for (let tName of triggerNames) {
		// look for each trigger in JUSTIN_CORE_PATH, etc.
		for (let tPath of triggerPaths) {
			let tFullPath = tPath + '/src/triggers/' + tName + '.ts';
			if (await fileExists(tFullPath)) {
				//console.log("will try to load trigger", tFullPath);
				triggerObjects.push(await importTrigger(tFullPath));
			} else {
				//console.log("couldn't find trigger:", tFullPath);
			}
		}
	}
	return triggerObjects;
}

export async function clearTriggers() {
	let cfgColl = await getConfigCollection();
	let triggerDoc = await cfgColl.find({ _id: 'triggers' }).next();
	if (triggerDoc) {
		triggerDoc.triggers = [];
		await cfgColl.replaceOne({ _id: 'triggers' }, triggerDoc);
	} else {
		let triggerDocX = {
			_id: 'triggers',
			triggers: []
		};
		await cfgColl.insertOne(triggerDocX); // this actually works, but makes TS mad
	}
}

export async function addTrigger(trigger) {
	let cfgColl = await getConfigCollection();
	let triggerDoc = await cfgColl.find({ _id: 'triggers' }).next();
	if (triggerDoc) {
		triggerDoc.triggers.push(trigger);
		await cfgColl.replaceOne({ _id: 'triggers' }, triggerDoc);
	}
}
