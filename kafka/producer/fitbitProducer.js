import Kafka from 'node-rdkafka';
import { fitbitType } from '../../eventType.js';
import { setIntervalAsync } from 'set-interval-async/dynamic/index.js';
import { config } from '../../config/config.js';
import fetch from 'node-fetch';

// TODO: figure out why when I start consumer first, sometimes produced msgs aren't consumed in shell
// TODO: figure out why when I start produced first, sometimes consumed msgs aren't shown in shell
// https://stackoverflow.com/questions/58928487/kafka-consumer-not-consuming-from-beginning
const stream = Kafka.Producer.createWriteStream(
	{
		'metadata.broker.list': 'localhost:9092'
	},
	{},
	{
		topic: 'fitbitTest'
	}
);

stream.on('error', (err) => {
	console.error('Error in our kafka stream');
	console.error(err);
});

function getDateStr(date) {
	let month = (date.getMonth() + 1).toString();
	if (month.length === 1) {
		month = '0' + month;
	}
	let day = date.getDate().toString();
	if (day.length === 1) {
		day = '0' + day;
	}

	return date.getFullYear() + '-' + month + '-' + day;
}

async function sendStepCount(date = null) {
	if (!date) {
		date = new Date();
	}
	let dateStr = getDateStr(date);
	try {
		return fetch(`https://api.fitbit.com/1/user/-/activities/steps/date/${dateStr}/1d/1min.json`, {
			method: 'GET',
			headers: { Authorization: 'Bearer ' + config.fitbit.accessToken }
		})
			.then((res) => res.json())
			.then((jsonRes) => {
				// TODO: add try catch, print error if jsonRes['activities-steps'] is undefined
				let stepCount = jsonRes['activities-steps'][0].value.toString();
				// console.log(stepCount);
				queueStepCountMessage(stepCount);
			})
			.catch((err) => console.log(err));
	} catch (err) {
		console.log(err);
		return 'ERROR';
	}
}

async function queueStepCountMessage(stepCount) {
	const category = 'stepCount';
	let date = new Date('2022-07-18T03:24:00');
	const value = stepCount;
	// const value = await getStepCount();
	const event = { category, value };
	// TODO: use keys on unique users' fitbitID
	let success;
	try {
		success = stream.write(fitbitType.toBuffer(event));
	} catch (err) {
		throw err;
	}
	if (success) {
		console.log(`message queued (${JSON.stringify(event)})`);
	} else {
		console.log('Too many messages in the queue already..');
	}
}

let date = new Date('2022-07-18T03:24:00');
setIntervalAsync(() => {
	sendStepCount(date);
}, 10000);

// console.log('return type: ' + typeof getStepCount(date));
// console.log('toString res: ' + getStepCount(date));
// typeof getStepCount();
