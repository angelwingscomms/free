import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { search } from '$lib/util/redis/search';
import { feedback_index as index } from '$lib/constants';
import { remote } from '$lib/util/embedding/remote';
import { handle_server_error } from '$lib/util/handle_server_error';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { text, page } = await request.json();
		return json(await search({ index, B: await remote(text, true), page, query: '*' }));
	} catch (e) {
		throw handle_server_error(request, e);
	}
};