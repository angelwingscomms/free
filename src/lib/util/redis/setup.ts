import { client } from '.';
import { feedback_id_prefix, feedback_index, user_id_prefix, user_index } from '$lib/constants';
import { SchemaFieldTypes, VectorAlgorithms } from 'redis';

export const setup = async () => {
	try {
		await client.ft.dropIndex(feedback_index)
		await client.ft.create(
			feedback_index,
			{
				'$.v': {
					AS: 'v',
					type: SchemaFieldTypes.VECTOR,
					ALGORITHM: VectorAlgorithms.HNSW,
					TYPE: 'FLOAT32',
					DIM: 768,
					DISTANCE_METRIC: 'COSINE'
				},
				'$.text': {
					AS: 'text',
					type: SchemaFieldTypes.TEXT,
					NOINDEX: true
				}
			},
			{
				ON: 'JSON',
				NOFIELDS: true,
				NOOFFSETS: true,
				NOFREQS: true,
				PREFIX: feedback_id_prefix
			}
		);
		// await client.ft.create(
		// 	user_index,
		// 	{
		// 		'$.v': {
		// 			AS: 'v',
		// 			type: SchemaFieldTypes.VECTOR,
		// 			ALGORITHM: VectorAlgorithms.HNSW,
		// 			TYPE: 'FLOAT32',
		// 			DIM: 768,
		// 			DISTANCE_METRIC: 'COSINE'
		// 		},
		// 		'$.email': {
		// 			AS: 'email',
		// 			type: SchemaFieldTypes.TEXT,
		// 			NOINDEX: true
		// 		},
		// 		'$.name': {
		// 			AS: 'name',
		// 			type: SchemaFieldTypes.TEXT,
		// 			NOINDEX: true
		// 		},
		// 	},
		// 	{
		// 		ON: 'JSON',
		// 		PREFIX: user_id_prefix,
		// 		NOHL: true,
		// 		NOFREQS: true,
		// 	}
		// );
	} catch (e) {
		if (e.message !== 'Index already exists') {
			console.error('redis setup error:', e);
		}
	}
};
