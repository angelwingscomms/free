// import { SvelteKitAuth } from '@auth/sveltekit';
// import Google from '@auth/core/providers/google';
// import Github from '@auth/core/providers/github';
// import {
// 	AUTH_SECRET,
// 	GITHUB_ID,
// 	GITHUB_SECRET,
// 	GOOGLE_CLIENT_ID,
// 	GOOGLE_CLIENT_SECRET
// } from '$env/static/private';
import { sequence } from '@sveltejs/kit/hooks';
import { redirect, type Handle } from '@sveltejs/kit';
import { protected_routes } from '$lib/constants';
// import type { Provider } from '@auth/core/providers';
// import { client } from '$lib/util/redis';
// import { escape_email } from '$lib/util/escape_email';
// import { google } from '$lib/util/user/create/google';
import { check } from '$lib/util/user/auth/check';

const authorization: Handle = async ({ event, resolve }) => {
	if (protected_routes.some((r) => r.test(event.url.pathname)) && !event.locals.user) {
		console.debug('evl', event.locals.user)
		throw redirect(303, `/auth?t=${event.url.pathname}`);
	}
	return resolve(event);
};

export const handle: Handle = sequence(
	async ({ event, resolve }) => {
		const code = event.cookies.get('code');
		if (code) {
			const id = check(code);
			if (id) event.locals.user = id;
		}
		return resolve(event);
	},
	// SvelteKitAuth({
	// 	providers: [
	// 		Github({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
	// 		Google({
	// 			clientId: GOOGLE_CLIENT_ID,
	// 			clientSecret: GOOGLE_CLIENT_SECRET,
	// 			authorization: {
	// 				params: {
	// 					prompt: 'consent',
	// 					access_type: 'offline',
	// 					response_type: 'code'
	// 				}
	// 			}
	// 		}) as Provider
	// 	],
	// 	callbacks: {
	// 		async signIn(arg) {
	// 			google(arg);
	// 			return true;
	// 		},
	// 		async redirect({ url, baseUrl }) {
	// 			if (typeof url.split('/edit')[1] === 'string') return baseUrl;
	// 			const t = url.split('?t=')[1];
	// 			return `${t ? `${baseUrl}${t}` : url}`;
	// 		},
	// 		async session(arg) {
	// 			if (!arg.session) return arg.session;
	// 			const res = await client.ft.search(
	// 				user_index,
	// 				`@email:${escape_email(arg.session?.user?.email as string)}`
	// 			);
	// 			if (!res.total) return arg.session;
	// 			const user_res = res.documents[0];
	// 			if (!user_res) return arg.session;
	// 			return {
	// 				user: {
	// 					id: user_res.id ? String(user_res.id) : undefined,
	// 					name: user_res.value.name ? String(user_res.value.name) : undefined,
	// 					email: user_res.value.email ? String(user_res.value.name) : undefined,
	// 					provider: user_res.value.provider ? String(user_res.value.provider) : undefined
	// 				},
	// 				expires: new Date('9999-12-31').toISOString()
	// 			};
	// 		}
	// 	},
	// 	secret: AUTH_SECRET
	// }),
	authorization
);
