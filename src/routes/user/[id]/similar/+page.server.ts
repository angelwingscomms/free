import { user_index } from '$lib/constants';
import { float32_buffer } from '$lib/util/float32_buffer';
import { client } from '$lib/util/redis';
import { search } from '$lib/util/redis/search';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	if (!(await client.exists(params.id))) throw error(404, 'User not found');
	const { '$.v': v_, '$.name': name_ }: { v_: number[][]; name_: string[] } = await client.json.get(
		params.id,
		{ path: ['$.v', '$.name'] }
	);
	return {
		name: name_[0],
		id: params.id,
		d: (
			await search({
				index: user_index,
				page: 1,
				B: float32_buffer(v_[0]),
				options: { RETURN: ['name'] }
			})
		).documents
	};
};
