import { escape_email } from '$lib/util/escape_email';
import type { RedisJSON } from '@redis/json/dist//commands';

type Outcome = 'accepted' | 'dismissed';

export interface BeforeInstallPromptEvent extends Event {
	readonly platforms: string[];
	readonly userChoice: Promise<Outcome>;
	prompt(): Promise<{
		outcome: Outcome;
		platform: string;
	}>;
}

export type KeyedObject = { [index: string]: RedisJSON };
export interface SearchDocumentValue {
	[key: string]: string | number | null | Array<SearchDocumentValue> | SearchDocumentValue;
}
export type RedisKey = string;
export type NumberDate = number;

export type Email = string;
export class EscapedEmail {
	value: string;
	constructor(email: string) {
		this.value = escape_email(email);
	}
}

export type V = number[];

export type { SearchResponse } from './SearchResponse';
export type {SearchDocument} from './SearchResponse'
