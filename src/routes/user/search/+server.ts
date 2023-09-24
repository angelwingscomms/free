import { user_index as index } from '$lib/constants';
import { handle_server_error } from '$lib/util/handle_server_error';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { search } from '$lib/util/redis/search';
import { remote } from '$lib/util/embedding/remote';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { page, text } = await request.json();
		const res = await search({
			index,
			page,
			B: await remote(text, true) as Buffer,
			options: { RETURN: ['name'] }
		});
		return json(res);
	} catch (e) {
		throw handle_server_error(request.url, e);
	}
};
