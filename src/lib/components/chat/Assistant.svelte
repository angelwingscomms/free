<script lang="ts">
	export let hide_parameters = false,
		messages: Message[] = [],
		parameters: ChatCompletionCreateParamsNonStreaming,
		show_name_edit = false,
		disable_description_edit = false;
	import axios from 'axios';
	// import { v4 } from 'uuid';
	import Interface from './Interface.svelte';
	import { download_blob } from '$lib/util';
	import { notify } from '$lib/util/notify';
	import Restart from 'carbon-icons-svelte/lib/Restart.svelte';
	import { OPENAI_API_KEY } from '$lib/store';
	import { create_one } from '$lib/util/image/create_one';
	import type { Message } from './types';
	import type { ChatCompletionCreateParamsNonStreaming, CompletionCreateParams } from 'groq-sdk/resources/chat/completions.mjs';

	let loading = false,
		// id = v4(),
		_content = '',
		more_open = false,
		next_message_id = 0,
		success = false,
		chat_container: HTMLElement,
		name = 'Assistant',
		user = 'You',
		message_input_ref: HTMLTextAreaElement;

	const tools = {
		create_image: create_one
	};

	const download = () => download_blob(new Blob([JSON.stringify(messages)]), `Chat between user ${user} and GPT3.5 AI Assistant ${name}`);

	const restart = () => {
		messages = [];
	};

	const download_then_restart = () => {
		restart();
		download();
	};

	const send = async (message: CompletionCreateParams.Message) => {
		loading = true;
		try {
			let request = parameters;
			request.messages = [
				...request.messages,
				...messages.map((m) => {
					delete m.id;
					return m;
				}),
				message
			];

			const { data: r } = await axios.post('/groq', request);

			console.debug('-r', r);

			const first_choice = r.choices[0];
			if (!first_choice) {
				notify({
					kind: 'error',
					title: 'Please retry'
				});
				return;
			}
			if (!first_choice.message) {
				notify({
					kind: 'error',
					title: 'Please retry'
				});
				return;
			}

			switch (first_choice.finish_reason) {
				case 'stop':
					messages = [
						...messages,
						{
							...message,
							id: next_message_id
						} as Message,
						{
							...first_choice.message,
							name,
							id: next_message_id + 1
						} as Message
					];
					next_message_id += 2;
					chat_container.scrollTop = chat_container.scrollHeight;
					_content = '';
					message_input_ref.focus();
					success = true;
					console.debug(
						'not mid',
						messages.map((m) => m.id)
					);
					break;
			// 	case 'length':
			// 		notify({
			// 			kind: 'warning',
			// 			title: 'Conversation limit reached',
			// 			button: {
			// 				text: 'Restart conversation',
			// 				icon: Restart,
			// 				act: restart
			// 			}
			// 		});
			// 		break;
			// 	case 'tool_calls':
			// 		console.info('tool');
			// 		first_choice.message.tool_calls?.forEach(async (t) => {
			// 			try {
			// 				if (t.function.name === 'create_image') {
			// 					const { data } = await create_one($OPENAI_API_KEY, JSON.parse(t.function.arguments));
			// 					console.info('b64json', data[0].b64_json);
			// 					messages = [
			// 						...messages,
			// 						{
			// 							id: next_message_id,
			// 							role: 'tool',
			// 							content: data[0].b64_json ?? '',
			// 							tool_call_id: t.id
			// 						}
			// 					];
			// 					next_message_id++;
			// 				}
			// 			} catch {
			// 				notify({ kind: 'error', title: 'Encountered an error trying to run the function', subtitle: 'Please retry' });
			// 			}
			// 		});
			// 		break;
			// 	case 'content_filter':
			// 		notify({
			// 			kind: 'warning',
			// 			title: "Content was omitted due to a flag from OpenAI's content filters"
			// 		});
			// 		break;
			// 	case 'function_call':
			}
		} catch (e) {
			console.error(e);
			notify({
				kind: 'error',
				title: e ?? 'Error'
			});
		}
		loading = false;
	};
</script>

<Interface
	bind:name
	bind:text={_content}
	bind:loading
	bind:messages
	bind:message_input_ref
	bind:parameters
	bind:chat_container
	bind:success
	bind:more_open
	name_label="Give the Assistant a name"
	description_label="Tell the Assistant how to behave"
	{hide_parameters}
	{show_name_edit}
	{disable_description_edit}
	on:download={download}
	on:restart={restart}
	on:download_then_restart={download_then_restart}
	on:send={({ detail }) => send(detail)}
	on:send_attempt_without_description={() => (more_open = true)}
	send_without_description={true}
/>
