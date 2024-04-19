import { index, top_level_messages_name } from '$lib/constants';
import { type Message } from '$lib/types/message';
import { client } from '$lib/util/redis';
import { search } from '$lib/util/redis/search';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const res = await search<Message>({
		index: index,
		query: `@t: ${top_level_messages_name}`,
		options: {
			RETURN: ['f', 'd', 'h'],
			SORTBY: { BY: 'd', DIRECTION: 'DESC' }
		}
	});
	const _m = await Promise.all(
		res.documents
			.sort((a, b) => b.value.d - a.value.d)
			.map(async (m) => {
				m.value.uf = ((await client.json.get(m.value.f, { path: 'u' })) as string) || '';
				m.value.cl = ((await client.json.get(m.value.f, { path: 'cl' })) as string) || '';
				return m;
			})
	);
	console.debug('_m', _m);
	return {
		m: _m
	};
};
