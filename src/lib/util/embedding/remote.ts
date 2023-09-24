import { embed_endpoint } from '$lib/constants';
import { Buffer } from 'node:buffer';

export const remote = async (body: string, b: boolean = false): Promise<number[] | Buffer> => {
	const res = await fetch(embed_endpoint, {
		headers: { 'Content-Type': 'text/plain', ...(b && { b }) },
		body,
		method: 'POST'
	});
	return b ? Buffer.from(await res.arrayBuffer()) : await res.json() as number[];
};
