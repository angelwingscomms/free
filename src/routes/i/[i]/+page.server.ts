import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { client } from '$lib/util/redis';
import { common } from '$lib/util/user/common';

export const load: PageServerLoad = async ({ params, locals }) => {
	const i = (await client.json.get(params.i, { path: ['n', 'u'] })) as { n: string; u: string[] };
	if (!i) throw error(404, `${params.i} not found`);

	return {
		n: i.n,
		a: await client.json.arrLen(params.i, '$.u'),
		...(locals.user && { i: await client.json.arrIndex(params.i, '$.u', locals.user) as number > -1 }),
		c: await common([
			...(await Promise.all(
				i.u.map(async (_u) => {
					return (await client.json.get(_u, { path: 't' })) as string;
				})
			))
		])
	};
};
