import { client } from '../redis';
import { extract_tags } from './extract_tags';
import { update_tags } from './update_tags';

export const tagflow = async (id: string, text: string) => {
    const tags = await extract_tags(text)
	await update_tags(tags);
    await client.json.set(id, '$.tags', tags)
};
