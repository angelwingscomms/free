import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import katex from 'marked-katex-extension';
// import bidi from 'marked-bidi';
// import extended_tables from 'marked-extended-tables';
import { mangle } from 'marked-mangle';
import { markedXhtml } from 'marked-xhtml';
import linkify_it from 'marked-linkify-it';
import hljs from 'highlight.js';

// export const marked = new Marked

export const parse_timeout = 12000;
export const options = { breaks: true };
export const extensions = [
	// extended_tables(),
	// bidi(),
	markedHighlight({
		langPrefix: 'hljs language-',
		highlight(code, lang) {
			const language = hljs.getLanguage(lang) ? lang : 'plaintext';
			return hljs.highlight(code, { language }).value;
		}
	}),
	katex({
		throwOnError: false
	}),
	markedXhtml(),
	linkify_it({}, {}),
	mangle(),
	options
];

marked.use(...extensions);

export const to_html = async (text: string): Promise<string> => {
	text = text.replace(/^[\u0020\u0085\u00A0\u1680\u180E\u2000-\u200A\u202F\u205F\u3000\uFEFF]/, '');
	return await marked.parse(text);
};
