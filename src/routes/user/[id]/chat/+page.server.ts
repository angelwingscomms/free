import { index } from '$lib/constants';
import { type Message } from '$lib/types/message';
import { client } from '$lib/util/redis';
import { search } from '$lib/util/redis/search';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!(await client.exists(params.id))) throw error(404, 'User not found');
	const res = await search<Message>({
		index: index,
		query: `@f:"${locals.user}" @t:"${params.id}"  | @f:"${params.id}" @t:"${locals.user}"`,
		options: {
			RETURN: ['f', 't', 'd', 'h'],
			SORTBY: { BY: 'd', DIRECTION: 'DESC' }
		}
	});
	return {
		id: params.id,
		m: await Promise.all(
			res.documents
				.sort((a, b) => b.value.d - a.value.d)
				.map(async (m) => {
					m.value.uf = ((await client.json.get(m.value.f, { path: 'u' })) as string) || '';
					m.value.cl = ((await client.json.get(m.value.f, { path: 'cl' })) as string) || '';
					return m;
				})
		)
	};
};
