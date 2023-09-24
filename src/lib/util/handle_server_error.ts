import { error } from '@sveltejs/kit';

interface CustomError {
	status: number;
	message: string;
}

export const handle_server_error = (m: string | Request, e?: unknown) => {
	let r: string
	if (typeof m === 'string') {r = m} else {r = `${m.method} ${m.url}`}
	console.error(r, e ?? '');
	return e instanceof Error || e instanceof String ? error(500) : error((e as CustomError)?.status ?? 500, (e as CustomError)?.message ?? undefined);
};
