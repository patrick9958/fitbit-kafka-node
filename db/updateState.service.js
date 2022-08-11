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
