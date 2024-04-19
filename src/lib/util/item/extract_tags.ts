import { groq } from "../groq";

const example_tags = ['refurbished', 'black', 'iPhone 8', '8 GB RAM'];
const example_text = 'Refurbished Black iPhone 8 8GB RAM';

export const extract_tags = async (text: string): Promise<string[]> => {
	const res = await groq.chat.completions.create({
		model: 'mixtral-8x7b-32768',
		messages: [
			{
				role: 'user',
				content: `create a JSON list of tags extracted from the following item description: """${text}""". For example ,for the following item description: """${example_text}""", the response would be: ${JSON.stringify(example_tags)}. Let your response ONLY contain the JSON array!`
			}
		]
	});
	return JSON.parse(res.choices[0].message.content as string); //TODO-error-handling
};
