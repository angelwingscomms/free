import { get_id } from '$lib/util/get_id';
import { client } from '$lib/util/redis';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals, url }) => {
	const id = await get_id();
	if (!locals.user) throw redirect(302, `/auth?t=${url.pathname}?n=1`);
	await client.json.set(id, '$', { n: params.n, u: [locals.user] });
	throw redirect(302, `/i/${id}`);
};
