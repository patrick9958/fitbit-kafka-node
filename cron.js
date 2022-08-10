import * as dotenv from 'dotenv';
import * as userService from './db/users.service.js';
import * as configService from './db/studyconfig.service.js';
import { NoActionDecisionRecord } from './models/noactiondecisionrecord.model.js';
import { User } from './models/user.model';
import { DecisionRecord } from './models/decisionrecord.model.js';
import { addDecisionRecord } from './db/decisionrecords.service.js';

dotenv.config();

// called by cron or by a test runner
export async function doTick(curTime) {
	let users = await userService.getAllUsers();
	let triggers = await configService.getTriggers();
	let decisionRecord;
	console.log('doing tick at', curTime);
	for (let u of users) {
		for (let t of triggers) {
			console.log('running trigger', t, 'for user', u.getName());
			if (!t.shouldRun(u, curTime)) continue; // next trigger
			let diceRoll = Math.random();
			console.log('dice role:', diceRoll);
			if (diceRoll < t.getProbability(u, curTime)) {
				decisionRecord = t.doAction(u, curTime);
			} else {
				decisionRecord = new NoActionDecisionRecord(u, t.getName(), curTime);
				console.log('no action, record:', decisionRecord);
			}
			addDecisionRecord(decisionRecord);
			console.log('ran trigger', t, 'for user', u.getName(), ':', decisionRecord);
		}
	}
}
