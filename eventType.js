import avro from 'avsc';

export const petType = avro.Type.forSchema({
	type: 'record',
	fields: [
		{
			name: 'category',
			type: { type: 'enum', symbols: ['DOG', 'CAT'] }
		},
		{
			name: 'noise',
			type: 'string'
		}
	]
});

export const fitbitType = avro.Type.forValue({
	category: 'stepCount',
	value: '2000'
});

// export const fitbitType = avro.Type.forSchema({
// 	type: 'record',
// 	fields: [
// 		{
// 			name: 'category',
// 			type: 'string'
// 		},
// 		{
// 			name: 'event',
// 			type: 'string'
// 		}
// 	]
// });
