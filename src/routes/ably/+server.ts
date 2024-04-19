import { error, json, text } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import type { RequestHandler } from './$types';
import { ABLY } from '$env/static/private';
import { handle_server_error } from '$lib/util/handle_server_error';
import { ably } from '$lib/util/ably';
import { index } from '$lib/constants';
import { message_name } from '$lib/util/chat/message_name';

export const GET: RequestHandler = async ({ locals, request, url }) => {
	try {
		if (!locals.user) throw error(401);
		const id = url.searchParams.get('i');
		if (!id) throw error(400, 'id query param required');
		const capability_key = `${index}:${message_name(locals.user, id)}`;
		return json(
			await ably.auth.createTokenRequest({
				// capability: { [capability_key]: ['subscribe'] },
				clientId: locals.user
			})
		);
		// const [keyid, key_secret] = ABLY.split('.');
		// console.debug('sas ably');
		// const res = jwt.sign(
		// 	{
		// 		'x-ably-clientId': locals.user
		// 	},
		// 	key_secret,
		// 	{ expiresIn: 3600, keyid }
		// );
		// console.debug('res ably', res);
		// return json(
		// 	{ token: res },
		// 	{
		// 		headers: {
		// 			'Cache-Control': 'private, no-cache, no-store, must-revalidate'
		// 		}
		// 	}
		// );
	} catch (e) {
		throw handle_server_error(`/ably for ${locals.user}`, request);
	}
};
