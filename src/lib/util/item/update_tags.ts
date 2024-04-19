import { tag_id_prefix, tag_index } from '$lib/constants';
import { embed } from '../embedding/embed';
import { escape } from '../escape';
import { client } from '../redis';
import { search } from '../redis/search';

export const update_tags = async (tags: string[]) => {
	for (const t of tags) {
		const res = await search({ count: true, index: tag_index, query: `@t:"${escape(t)}"` });
		if (!res.total)
			client.json.set(`${tag_id_prefix}${await client.incr('last_tag_id')}`, '$', { t, v: await embed(t) });
	}
};
