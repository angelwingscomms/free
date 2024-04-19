import { losses } from '@tensorflow/tfjs';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { client } from '$lib/util/redis';
import type { V } from '$lib/types';
import type { User } from '$lib/types/user';
import { common } from '$lib/util/user/common';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!(await client.exists(params.id)))
		throw error(404, `User with id ${params.id} was not found`);
	const user = (await client.json.get(params.id, {
		path: ['h', 'u', 'v', 'c', 'x', 'ch', 't']
	})) as Pick<User, 'h' | 'u' | 'v' | 'c' | 'x' | 't' | 'ch'>;
	const auth_user = (await client.json.get(locals.user ?? '', { path: ['v', 't'] })) as {
		v: V;
		t: string;
	};
	let s: { s: number; a: string } | undefined = undefined;
	if (auth_user) {
		s = {
			s: Number(
				((1 - losses.cosineDistance(auth_user.v, user.v, 0).dataSync()[0]) * 100).toPrecision(2)
			),
			a: await common([user.t, auth_user.t])
		};
	}
	return { id: params.id, ...(!user.x && user.h && { h: user.h }), ch: user.ch, u: user.u, s };
};
