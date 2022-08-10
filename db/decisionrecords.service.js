import { getDB } from './db.service.js';
import { config } from '../config/config.js';

let drCollection;

async function getDecisionRecordCollection() {
	if (!drCollection) {
		const db = await getDB();
		if (config.db.DECISIONRECORD_COLLECTION_NAME) {
			drCollection = db.collection(config.db.DECISIONRECORD_COLLECTION_NAME);
		}
	}
	return drCollection;
}

export async function addDecisionRecord(decisionRecord) {
	let uColl = await getDecisionRecordCollection();
	await uColl.insertOne(decisionRecord);
}
