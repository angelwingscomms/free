import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { client } from '$lib/util/redis';
import { user_index } from '$lib/constants';
import { search } from '$lib/util/redis/search';
import { float32_buffer } from '$lib/util/float32_buffer';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!(await client.exists(params.id)))
		throw error(404, `User with id ${params.id} was not found`);
	const { '$.html': html_, '$.name': name_ } = await client.json.get(params.id, {
		path: ['$.html', '$.name']
	});
	const res = { id: params.id, html: html_[0], name: name_[0] };
	if ((await locals.getSession())?.user?.id === params.id) {
		const text_ = await client.json.get(params.id, { path: '$.text' });
		res.text = text_[0];
	}
	const v_ = (await client.json.get(params.id, { path: '$.v' })) as Array<number[]>;
	const similar_res = await search({ index: user_index, page: 1, B: float32_buffer(v_[0]) });
	return {...res, similar: similar_res.documents};
};
