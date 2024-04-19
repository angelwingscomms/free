import { client } from '.';
import { id_prefix, index, user_id_prefix, user_index } from '$lib/constants';
import { SchemaFieldTypes, VectorAlgorithms } from 'redis';
import { embed } from '../embedding/embed';
// import { search } from './search';

export const setup = async () => {
	try {
		for (const i of await client.keys(`${id_prefix}*`)) {
			const c = (await client.json.get(i, { path: 'c' })) as string;
			await client.json.set(i, '$.v', await embed(c));
		}
		await client.ft.create(
			index,
			{
				'$.v': {
					AS: 'v',
					type: SchemaFieldTypes.VECTOR,
					ALGORITHM: VectorAlgorithms.FLAT,
					TYPE: 'FLOAT32',
					DIM: 3072,
					DISTANCE_METRIC: 'COSINE'
				},
				'$.f': {
					AS: 'f',
					type: SchemaFieldTypes.TEXT
				},
				'$.t': {
					AS: 't',
					type: SchemaFieldTypes.TEXT
				},
				'$.d': {
					AS: 'd',
					type: SchemaFieldTypes.NUMERIC,
					SORTABLE: true,
					NOINDEX: true
				},
				'$.c': {
					AS: 'c',
					type: SchemaFieldTypes.TEXT,
					NOINDEX: true
				},
				'$.h': {
					AS: 'h',
					type: SchemaFieldTypes.TEXT,
					NOINDEX: true
				}
			},
			{
				ON: 'JSON',
				PREFIX: id_prefix,
				NOHL: true
			}
		);
	} catch (e) {
		console.error(`redis create ${index} error:`, e);
	}

	// create message_index
	try {
		// const res = await search({ index: message_index, query: `@t:"all"` });
		// console.info('rrsd', res.total)
		// res.documents.forEach((d) => {
		// 	client.json.set(d.id, '$.t', 't');
		// });
		// console.info('rrsd done')
		await client.ft.create(
			index,
			{
				'$.v': {
					AS: 'v',
					type: SchemaFieldTypes.VECTOR,
					ALGORITHM: VectorAlgorithms.FLAT,
					TYPE: 'FLOAT32',
					DIM: 3072,
					DISTANCE_METRIC: 'COSINE'
				},
				'$.f': {
					AS: 'f',
					type: SchemaFieldTypes.TEXT
				},
				'$.t': {
					AS: 't',
					type: SchemaFieldTypes.TEXT
				},
				'$.d': {
					AS: 'd',
					type: SchemaFieldTypes.NUMERIC,
					SORTABLE: true,
					NOINDEX: true
				},
				'$.c': {
					AS: 'c',
					type: SchemaFieldTypes.TEXT,
					NOINDEX: true
				},
				'$.h': {
					AS: 'h',
					type: SchemaFieldTypes.TEXT,
					NOINDEX: true
				}
			},
			{
				ON: 'JSON',
				PREFIX: id_prefix,
				NOHL: true
			}
		);
	} catch (e) {
		console.error(`redis create ${index} error:`, e);
	}

	// create user_index
	try {
		// await client.ft.dropIndex(user_index)
		// console.info('index dropped')
		await client.ft.create(
			user_index,
			{
				'$.v': {
					AS: 'v',
					type: SchemaFieldTypes.VECTOR,
					ALGORITHM: VectorAlgorithms.FLAT,
					TYPE: 'FLOAT32',
					DIM: 3072,
					DISTANCE_METRIC: 'COSINE'
				},
				'$.u': {
					AS: 'u',
					type: SchemaFieldTypes.TEXT
				},
				'$.p': {
					AS: 'p',
					type: SchemaFieldTypes.TEXT
				},
				'$.cl': {
					AS: 'cl',
					type: SchemaFieldTypes.TEXT
				}
			},
			{
				ON: 'JSON',
				PREFIX: user_id_prefix,
				NOHL: true
			}
		);
	} catch (e) {
		console.error(`redis create ${user_index} error:`, e);
	}
};
