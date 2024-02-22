import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const n = !!url.searchParams.get('n');
    console.log('auth n', n)
	return { n };
};
