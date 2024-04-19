import { client } from '$lib/util/redis';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const c = await client.json.get(params.id, { path: ['p', 'n'] });
	if (!c) throw error(404, `character {$params.id} not found`);
	return c;
};
