// TODO: RENAME TO fitbitStepCountConsumer.js and rename in npm scripts package.json
import Kafka from 'node-rdkafka';
import { fitbitType } from '../eventType.js';
// TODO: uncomment and delete local updateDB() when DB is set up
// import { updateDB } from '../db/updateDB';

async function updateDB(data) {
	console.log('successfully updated DB');
	return Promise.resolve(true);
}

var consumer = new Kafka.KafkaConsumer(
	{
		'group.id': 'kafka',
		'metadata.broker.list': 'localhost:9092'
	},
	{}
);

consumer.connect();

consumer
	.on('ready', () => {
		console.log('consumer ready..');
		consumer.subscribe(['fitbitTest']);
		consumer.consume();
	})
	.on('data', function (data) {
		let serializedData = fitbitType.fromBuffer(data.value);
		console.log(`received message: ${serializedData}`);
		updateDB(serializedData);
	});
