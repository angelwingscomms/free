import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { client } from '$lib/util/redis';

export const load: PageServerLoad = async ({ params, locals, url }) => {
	const i = await client.json.get(params.i, { path: ['n'] });
	if (!i) throw error(404, `${params.i} not found`);
	if (!locals.user) throw redirect(302, `/auth?t=${url.pathname}`)
	if (((await client.json.arrIndex(params.i, 'u', locals.user)) as number) > -1)
		throw redirect(302, `/a/${params.i}`);
	await client.json.arrAppend(params.i, 'u', locals.user);
	throw redirect(302, `/a/${params.i}`);
};
