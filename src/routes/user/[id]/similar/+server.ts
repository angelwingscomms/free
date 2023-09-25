import { client } from '$lib/util/redis';
import { error, json } from '@sveltejs/kit';
import { search } from '$lib/util/redis/search';
import { user_index } from '$lib/constants';
import { float32_buffer } from '$lib/util/float32_buffer';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	if (!(await client.exists(params.id))) throw error(404, `User with id ${params.id} not found`);
	return json(
		(
			await search({
				index: user_index,
				page: 1,
				B: float32_buffer(
					((await client.json.get(params.id, { path: '$.v' })) as Array<number[]>)[0]
				),
				options: { RETURN: ['name'] }
			})
		).documents
	);
};
