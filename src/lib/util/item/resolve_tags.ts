import { tag_index } from '$lib/constants';
import { search } from '../redis/search';
import { extract_tags } from './extract_tags';

export const resolve_tags = async (text: string): Promise<string[]> => {
	let tags = await extract_tags(text);
    // console.debug('--tags', tags)
	tags = await Promise.all(
		tags.filter(async (t) => {
			const res = await search({ index: tag_index, count: true, query: `@t:"${t}"` });
			return res.total;
		})
	);
	return tags;
};
