import { get } from '$lib/util/redis/get';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { client } from '$lib/util/redis';
import { handle_server_error } from '$lib/util/handle_server_error';

export const GET: RequestHandler = async ({ request, params }) => {
	try {
		if (!(await client.exists(params.id))) throw error(404, 'User not found');
		return json(await get<{ name: string; html: string }>(params.id, ['$.name', '$.html']));
	} catch (e) {
		throw handle_server_error(request, e);
	}
};
