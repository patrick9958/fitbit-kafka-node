import Kafka from 'node-rdkafka';
import { petType } from '../eventType.js';

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
		consumer.subscribe(['test']);
		consumer.consume();
	})
	.on('data', function (data) {
		console.log(`received message: ${petType.fromBuffer(data.value)}`);
	});
