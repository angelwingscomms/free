import { index } from '$lib/constants';
import { embed_buffer } from '$lib/util/embed/embed';
import { handle_server_error } from '$lib/util/handle_server_error';
import { resolve_tags } from '$lib/util/item/resolve_tags';
import { search, type SearchParams } from '$lib/util/redis/search';
import { json, type RequestHandler } from '@sveltejs/kit';
import type { SearchOptions } from 'redis';

export const GET: RequestHandler = async ({ request, url }) => {
	try {
		const q = url.searchParams.get('q');
		const s = url.searchParams.get('s');
		const p = url.searchParams.get('p');
		const e = url.searchParams.get('e');
		const u = url.searchParams.get('u');

		let query = '@k:"i"';
		if (u) query += ` @u:"${u}"`;

		const options: SearchOptions = { RETURN: ['n', 'i', 'p'] };
		if (s) {
			if (s == 'sl') options.SORTBY = { BY: 'p', DIRECTION: 'ASC' };
			if (s == 'sh') options.SORTBY = { BY: 'p', DIRECTION: 'DESC' };
		}
		const page = p ? (isNaN(Number(p)) ? 0 : Number(p)) : 0;
		const params: SearchParams = {
			query,
			index: index,
			page,
			options
		};
		if (q) {
			if (e)
				query += `@tags: { ${(await resolve_tags(q)).map((t) => t.replaceAll('|', '\\|')).join(' | ')}}`;
			params.B = await embed_buffer(q);
		}

		const res = await search(params);
		return json(res);
	} catch (e) {
		throw handle_server_error(request, e);
	}
};
