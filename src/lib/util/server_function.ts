import { handle_server_error } from './handle_server_error';

export const server_function = async(request: Request, f: () => Response): Promise<Response> => {
	try {
		return await f();
	} catch (e) {
		throw handle_server_error(request, e);
	}
};
