<script lang="ts">
	export let messages: _Message[] = [],
		text = '',
		name = 'Partner',
		name_label = 'Name',
		parameters: ChatCompletionCreateParamsNonStreaming = {
			// tools: [{
			// 	type: 'function',
			// 	function: {
			// 		name: "create_image",
			// 		description: "Create an image with DALL·E 3",
			// 		parameters: {
			// 			type: 'string',
			// 		}
			// 	}
			// }],
			model: 'mixtral-8x7b-32768',
			messages: []
		},
		success: boolean,
		chat_container: HTMLElement | null = null,
		restart_modal = false,
		hide_parameters = false,
		show_name_edit = false,
		disable_description_edit = false,
		more_open = false,
		description_label = 'Description',
		description_error_text = 'You may not send messages without setting description',
		send_without_content = false,
		send_without_description = false,
		content_error = false,
		content_error_text = 'You may not send an empty message',
		message_input_ref: HTMLTextAreaElement,
		// run: (m: ChatCompletionUserMessageParam) => void,
		loading = false;

	import { Button, InlineLoading, TextArea, Modal, Row, Column } from 'carbon-components-svelte';
	import { onMount } from 'svelte';
	import Message from './Message.svelte';
	import { type Message as _Message } from './types';
	import Input from './Input.svelte';
	import { createEventDispatcher } from 'svelte';
	import More from './More.svelte';
	import { send_on_enter } from './store';
	import type { ChatCompletionCreateParamsNonStreaming, CompletionCreateParams } from 'groq-sdk/resources/chat/completions.mjs';

	const dispatch = createEventDispatcher();

	$: can_send = !loading;

	onMount(() => {
		height = `${(window.innerHeight * 79) / 100}px`;
		message_input_ref.classList.add('no-scrollbar');
	});

	let height = '670px',
		// id = v4(),
		description_error = false;

	const delete_message = (id: number) => {
		messages = [...messages.filter((m) => m.id !== id)];
	};

	const send = async ({ detail }: { detail: CompletionCreateParams.Message }) => {
		if (!send_without_description && !parameters.messages[0].content) {
			description_error = true;
			dispatch('send_attempt_without_description');
			return;
		} else if (!send_without_content && !text) {
			content_error = true;
			return;
		}
		dispatch('send', detail);
		// run(m)
	};
</script>

<Modal modalHeading="Download then restart?" passiveModal bind:open={restart_modal}>
	<p>Download chat first before restarting?</p>
	<!-- <ButtonSet stacked> -->
	<Button
		on:click={() => {
			more_open = false;
			dispatch('download_then_restart');
			restart_modal = false;
		}}>Download then restart</Button
	>
	<Button
		on:click={() => {
			more_open = false;
			dispatch('restart');
			restart_modal = false;
		}}>Restart without downloading</Button
	>
	<!-- </ButtonSet> -->
</Modal>

<More
	bind:open={more_open}
	bind:restart_modal
	{name_label}
	{show_name_edit}
	{hide_parameters}
	bind:name
	{description_label}
	{description_error}
	{description_error_text}
	{disable_description_edit}
	bind:parameters
/>

<Row>
	<Column>
		<div style={`height: calc(100vh - 7rem)`} class="all">
			<div bind:this={chat_container} class="messages">
				{#each messages as message}
					<Message on:delete_message={({ detail }) => delete_message(detail)} {message} />
				{/each}
			</div>
			<Input
				on:send={send}
				bind:success
				bind:can_send
				bind:loading
				bind:content_error
				bind:content_error_text
				bind:more_open
				bind:text
				bind:message_input_ref
			/>
		</div>
	</Column>
</Row>

<style lang="sass">
	@use '@carbon/colors'

	.all
		display: flex
		flex-direction: column
		row-gap: .37rem
	.messages
		display: flex
		flex-grow: 2
		flex-direction: column
		height: 100%
		width: 100%
		overflow-y: scroll
		row-gap: 1rem
		white-space: pre-wrap
	.messages::-webkit-scrollbar
		background-color: colors.$gray-100
		width: 1rem
	.messages::-webkit-scrollbar-thumb
		background-color: colors.$gray-80
	.messages::-webkit-scrollbar-corner, .messages::-webkit-scrollbar:horizontal
		display: none
</style>
