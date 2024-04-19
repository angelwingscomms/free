import * as tf from '@tensorflow/tfjs';
import { id_prefix, index, top_level_messages_name } from '$lib/constants';
import type { V } from '$lib/types';
import type { Message } from '$lib/types/message';
import { message_channel } from '$lib/util/ably';
import { embed, embed_to_buffer } from '$lib/util/embedding/embed';
// import { message_name } from '$lib/util/chat/message_name';
import { handle_server_error } from '$lib/util/handle_server_error';
import { client } from '$lib/util/redis';
import { search } from '$lib/util/redis/search';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { get_id } from '$lib/util/get_id';

export const GET: RequestHandler = async ({ url, request }) => {
	try {
		let page = Number(url.searchParams.get('p'));
		if (isNaN(page)) page = 0;
		const q = url.searchParams.get('q') || '';
		const t = url.searchParams.get('t') || '';
		console.debug('page, t', page, t);
		const query_embedding = await embed(q);
		const B = await embed_to_buffer(q);
		const res = await search<Message & { s: string; v?: V }>({
			index: index,
			query: `@t: ${top_level_messages_name}`,
			// ...(t && { query: `@t:${top_level_messages_name}` }),
			B,
			page,
			options: {
				RETURN: ['f', 'd', 'h', 'v']
			}
		});
		console.debug('mt', res.total);
		res.documents = await Promise.all(
			res.documents.map(async (m) => {
				m.value.s = (
					(1 - tf.losses.cosineDistance(query_embedding, m.value.v || [], 0).dataSync()[0]) * //hacked v to be or empty array to satisfy type
					100
				).toPrecision(2);
				m.value.uf = ((await client.json.get(m.value.f, { path: 'u' })) as string) || '';
				m.value.cl = ((await client.json.get(m.value.f, { path: 'cl' })) as string) || '';
				delete m.value.v;
				return m;
			})
		);
		return json(res);
	} catch (e) {
		throw handle_server_error(`${e}`, request);
	}
};

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const m = await request.json();
		const message = {
			...m,
			f: locals.user,
			t: 't'
		};
		const id = await get_id();
		await client.json.set(id, '$', message);
		const event = {
			id,
			value: {
				...message,
				uf: (await client.json.get(locals.user, { path: 'u' })) as string,
				cl: (await client.json.get(locals.user, { path: 'cl' })) as string
			}
		};
		message_channel.publish('e', event);
		message_channel.publish('t', event);
		message_channel.publish(locals.user, event);
		// message_channel.publish(message_name(locals.user, locals.user), { id, value: { ...message } });
		return new Response();
	} catch (e) {
		throw handle_server_error(`POST /m error: ${e}`, request);
	}
};
