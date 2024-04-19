import { Worker } from 'worker_threads';
import { parse_timeout } from '.';

export const parse = (text: string, timeout_ms = parse_timeout): Promise<string> =>
	new Promise((resolve, reject) => {
		const worker = new Worker(new URL('$lib/util/markdown/parse/node_worker.js', import.meta.url));
		const timeout = setTimeout(() => {
			worker.terminate();
			reject('timeout');
		}, timeout_ms);

		worker.on('message', (e) => {
			clearTimeout(timeout);
			resolve(e.data);
			worker.terminate();
		});

		worker.postMessage(text);
	});
