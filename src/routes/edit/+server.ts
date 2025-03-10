import { handle_server_error } from '$lib/util/handle_server_error';
import { client } from '$lib/util/redis';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { embed_user } from '$lib/util/user/embed_user';
import { sanitize_string } from '$lib/util/sanitize';

export const DELETE: RequestHandler = async ({ request, locals }) => {
	try {
		const user = locals.user;
		if (!user) throw redirect(303, '/auth');
		if (!(await client.exists(user))) {
			handle_server_error(request.url, {
				message: `did not - but expected to - find user with id: ${user}`,
				status: 404
			});
		}
		await client.del(user);
		return new Response();
	} catch (e) {
		throw handle_server_error(`${request.method} ${request.url}`, e);
	}
};

export const PUT: RequestHandler = async ({ request, locals }) => {
	try {
		const user = locals.user;
		if (!user) throw redirect(303, '/auth');
		if (!(await client.exists(user))) {
			handle_server_error(request.url, {
				message: `did not find user with id: ${user}`,
				status: 404
			});
		}
		let { c, t, h, u, e, x, ch, cl } = await request.json();
		const v = await embed_user({
			...(u && { username: u }),
			...(t && { user_description: t }),
			...(c && { contact_details: c })
		});
		u = sanitize_string(u);
		e = sanitize_string(e);
		c = sanitize_string(c);
		ch = sanitize_string(ch);
		cl = sanitize_string(cl);
		x = sanitize_string(x);
		t = sanitize_string(t);
		h = sanitize_string(h);
		client.json.set(user, '$.u', u);
		client.json.set(user, '$.e', e);
		client.json.set(user, '$.x', x);
		client.json.set(user, '$.c', c);
		client.json.set(user, '$.t', t);
		client.json.set(user, '$.ch', ch);
		client.json.set(user, '$.cl', cl);
		client.json.set(user, '$.h', h);
		client.json.set(user, '$.v', v);
		return new Response();
	} catch (e) {
		throw handle_server_error(request.url, e);
	}
};
