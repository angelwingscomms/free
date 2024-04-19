import { groq } from '../groq';

export const common = async (t: string[]): Promise<string> => {
	const res = await groq.chat.completions.create({
		messages: [
			{
				role: 'user',
				content: `what do the following user profiles have in common? ${JSON.stringify(t)}`
			}
		],
		model: 'mixtral-8x7b-32768'
	});
	return res.choices[0].message.content;
};
