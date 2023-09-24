// import { client } from '.';
// import { user_id_prefix, user_index } from '$lib/constants';
// import { SchemaFieldTypes, VectorAlgorithms } from 'redis';

export const setup = async () => {
	// try {
	// 	// for (const k of await client.keys("user_*")) {
	// 	// 	const res = await client.json.get(k, { path: '$.text' })
	// 	// 	console.log(res, res[0])
	// 	// 	const text = res[0] ? res[0] : ''
	// 	// 	client.json.set(k, '$.v', float32_buffer(await xenova(text)))
	// 	// }
	// 	// await client.ft.create(
	// 	// 	'users',
	// 	// 	{
	// 	// 		'$.v': {
	// 	// 			AS: 'v',
	// 	// 			type: SchemaFieldTypes.VECTOR,
	// 	// 			ALGORITHM: VectorAlgorithms.FLAT,
	// 	// 			TYPE: 'FLOAT32',
	// 	// 			DIM: 768,
	// 	// 			DISTANCE_METRIC: 'COSINE'
	// 	// 		},
	// 	// 		'$.email': {
	// 	// 			AS: 'email',
	// 	// 			type: SchemaFieldTypes.TEXT
	// 	// 		},
	// 	// 		'$.name': {
	// 	// 			AS: 'name',
	// 	// 			type: SchemaFieldTypes.TEXT,
	// 	// 		},
	// 	// 		'$.id': {
	// 	// 			AS: 'id',
	// 	// 			type: SchemaFieldTypes.TEXT
	// 	// 		}
	// 	// 	},
	// 	// 	{
	// 	// 		ON: 'JSON',
	// 	// 		PREFIX: user_id_prefix,
	// 	// 		NOHL: true
	// 	// 	}
	// 	// );
	// } catch (e) {
	// 	// if (e.message !== 'Index already exists') {
	// 	console.error('redis setup error:', e);
	// 	// }
	// }
};
