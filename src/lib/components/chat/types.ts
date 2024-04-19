import type {
	ChatCompletionCreateParamsNonStreaming,
	CompletionCreateParams
} from 'groq-sdk/resources/chat/completions.mjs';

type Id = string;

export interface Parameters {
	model: string;
	prompts: string[];
	suffix?: string;
	max_tokens?: number;
	temperature?: number;
	top_p?: number;
	n?: number;
	stream?: boolean;
	logprobs?: number;
	echo?: boolean;
	stop?: string[];
	presence_penalty?: number;
	frequency_penalty?: number;
	best_of?: number;
	logit_bias?: Record<string, number>;
}

export interface Chat {
	id: Id;
	messages: Id[];
	parameters: ChatCompletionCreateParamsNonStreaming;
}

export interface Description {
	id: Id;
	name: string;
	embedding?: number[];
	text: string;
}

export type Message = CompletionCreateParams.Message & { id?: number };
