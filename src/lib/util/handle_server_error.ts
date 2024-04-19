import { error, type NumericRange } from '@sveltejs/kit';

interface CustomError {
	status: NumericRange<400, 599>;
	message: string;
}

export const 	handle_server_error = (m: string | Request, e: unknown) => {
	console.error('--server-error');
	let r: string;
	if (typeof m === 'string') {
		r = m;
	} else {
		r = `${m.method} ${m.url}`;
	}
	console.error(r, e ?? '');
	return e instanceof Error || e instanceof String
		? error(500)
		: error((e as CustomError)?.status ?? 500, (e as CustomError)?.message ?? undefined);
};
