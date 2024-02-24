import * as tf from '@tensorflow/tfjs';
import { message_index } from '$lib/constants';
import { handle_server_error } from '$lib/util/handle_server_error';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { search } from '$lib/util/redis/search';
import { embed, embed_to_buffer } from '$lib/util/embedding/embed';
import type { V } from '$lib/types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { page, text } = await request.json();
		const query_embedding = await embed(text);
		const B = await embed_to_buffer(text);
		const res = await search<{u: string, s: string, v: V}>({
			index: message_index,
			page,
			B,
			options: { RETURN: ['f', 'd', 'h'] }
		});
		res.documents = res.documents.map((d) => {
			d.value.s = (
				(1 - tf.losses.cosineDistance(query_embedding, d.value.v, 0).dataSync()[0]) *
				100
			).toPrecision(2);
			return d;
		});
		return json(res);
	} catch (e) {
		throw handle_server_error(request.url, e);
	}
};
