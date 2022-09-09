import mongoose from 'mongoose';
import { config } from '../config/config.js';
import Logging from '../lib/Logging.js';
import { getUserByName, getUserCollection } from './user.service.js';

// export async function connectToDB()
// connect to mongodb
// mongoose
// 	.connect(config.mongo.url)
// 	.then(() => {
// 		Logging.info('connected to mongodb!');
// 	})
// 	.catch((err) => {
// 		Logging.error('unable to connect to mongodb!');
// 		Logging.error(err);
// 	});

export async function updateStepsDB(name, stepCount) {
	console.log('new StepCount: ', stepCount);
	// let user = getUserByName(name);
	let uColl = await getUserCollection();
	uColl.updateOne(
		{
			name: name
		},
		{
			$set: {
				'state.fitbitSteps': {
					stepCount: stepCount,
					updated: new Date()
				}
			}
		}
	);
	console.log('successfully updated DB');
	return Promise.resolve(true);
}

export async function updateAllFitbitTokens(
	id,
	fitbitID,
	accessToken,
	refreshToken
) {
	let uColl = await getUserCollection();
	uColl.updateOne(
		{
			_id: id
		},
		{
			$set: {
				'state.refreshToken': {
					refreshToken: refreshToken,
					updated: new Date()
				},
				'state.accessToken': {
					accessToken: accessToken,
					updated: new Date()
				},
				'state.fitbitID': {
					fitbitID: fitbitID,
					updated: new Date()
				}
			}
		}
	);
	console.log(
		`successfully updated all Fitbit tokens:\nREFRESH_TOKEN: ${refreshToken}\nACCESS_TOKEN: ${accessToken}\nFITBIT_USER_ID: ${fitbitID}`
	);
	return Promise.resolve(true);
}

export async function updateFitbitRefreshToken(name, fitbitID, refreshToken) {
	console.log('new StepCount: ', stepCount);
	// let user = getUserByName(name);
	let uColl = await getUserCollection();
	uColl.updateOne(
		{
			name: name
		},
		{
			$set: {
				'state.refreshToken': {
					refreshToken: refreshToken,
					updated: new Date()
				}
			}
		}
	);
	console.log('successfully updated DB');
	return Promise.resolve(true);
}

export async function updateFitbitAccessToken(name, fitbitID, refreshToken) {
	console.log('new StepCount: ', stepCount);
	// let user = getUserByName(name);
	let uColl = await getUserCollection();
	uColl.updateOne(
		{
			name: name
		},
		{
			$set: {
				'state.accessToken': {
					accessToken: accessToken,
					updated: new Date()
				}
			}
		}
	);
	console.log('successfully updated DB');
	return Promise.resolve(true);
}
