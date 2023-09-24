import { feedback_id_prefix } from '$lib/constants';
import { remote } from '$lib/util/embedding/remote';
import { handle_server_error } from '$lib/util/handle_server_error';
import { client } from '$lib/util/redis';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { t } = await request.json();
		await client.json.set(
			feedback_id_prefix.concat((await client.incr('last_feedback_id')).toString()),
			'$',
			{
				t,
				v: await remote(t) as number[]
			}
		);
		return new Response(null, { status: 201 });
	} catch (e) {
		throw handle_server_error(request, e);
	}
};