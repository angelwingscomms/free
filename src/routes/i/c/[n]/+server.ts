import { get_id } from '$lib/util/get_id';
import { client } from '$lib/util/redis';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const id = await get_id();
	await client.json.set(id, '$', { n: params.n, u: [] });
	throw redirect(302, `/i/${id}`);
};
