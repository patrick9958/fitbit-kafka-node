// TODO: RENAME TO fitbitStepCountConsumer.js and rename in npm scripts package.json
import Kafka from 'node-rdkafka';
import { fitbitType } from '../../eventType.js';
import { updateStepsDB } from '../../db/updateState.service.js';

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
		updateStepsDB(serializedData);
	});
