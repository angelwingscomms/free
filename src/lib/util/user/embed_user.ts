import { remote } from '../embedding/remote';

export const embed_user = (arg: { name?: string; text?: string }): Promise<number[]> =>
	remote(`${arg.name ? `${arg.name}\n\n` : ''}${arg.text ?? ''}`) as Promise<number[]>;
