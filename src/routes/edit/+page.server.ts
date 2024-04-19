import type { PageServerLoad } from './$types';
import { client } from '$lib/util/redis';
import { handle_server_error } from '$lib/util/handle_server_error';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	try {
		const user = await client.json.get(locals.user, { path: ['c', 'u', 't', 'e', 'x'] });
		if (!user) throw error(404, "user not found");
		// if (!user)
		// 	throw handle_server_error(`expected to, but did not, find user with id ${session?.user?.id}`);
		return user;
	} catch (e) {
		throw handle_server_error('--edit-load-server-error', e);
	}
};
