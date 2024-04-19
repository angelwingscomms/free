<script lang="ts">
	export let messages: SearchDocument<_Message>[] = [],
		u: string,
		text = '',
		// name = 'Partner',
		// name_label = 'Name',
		// used to indicate when the last message has been succesfully sent
		success: boolean,
		search_open = false,
		chat_container: HTMLElement | undefined = undefined,
		restart_modal = false,
		route: string,
		// hide_parameters = false,
		// show_name_edit = false,
		// disable_description_edit = false,
		// description = '',
		more_open = false,
		// search_modal = false,
		// description_label = 'Description',
		// description_error_text = 'You may not send messages without setting description',
		// send_without_content = false,
		// send_without_description = false,
		content_error = false,
		send_on_enter: boolean,
		content_error_text = 'You may not send an empty message',
		message_input_ref: HTMLTextAreaElement,
		// run: (m: ChatCompletionUserMessageParam) => void,
		loading = false;

	import { Button, InlineLoading, TextArea, Modal, Row, Column } from 'carbon-components-svelte';
	import { onMount } from 'svelte';
	import Message from './Message.svelte';
	import { type Message as _Message } from '$lib/types/message';
	import Input from './Input.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { SearchDocument } from '$lib/types';
	import { page } from '$app/stores';
	import Search from '../Search/Search.svelte';
	// import More from './More.svelte';

	const dispatch = createEventDispatcher();

	$: can_send = !loading;

	onMount(() => {
		message_input_ref.classList.add('no-scrollbar');
	});

	let description_error = false;

	// const delete_message = (id: number) => {
	// 	messages = [...messages.filter((m) => m.id !== id)];
	// };

	const send = async ({ detail }: { detail: { c: string; d: number } }) => {
		// if (!send_without_description && !description) {
		// 	description_error = true;
		// 	dispatch('send_attempt_without_description');
		// 	return;
		// } else if (!send_without_content && !text) {
		// 	content_error = true;
		// 	return;
		// }
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

<Modal bind:open={search_open} passiveModal hasForm hasScrollingContent>
	<Search placeholder="Search" f="h" {route} />
</Modal>

<!-- <More
	bind:open={more_open}
	bind:restart_modal
	{name_label}
	{show_name_edit}
	{hide_parameters}
	bind:send_on_enter
	bind:name
	{description_label}
	{description_error}
	{description_error_text}
	{disable_description_edit}
	bind:description
	bind:parameters
/> -->

<Row>
	<Column>
		<div class="all">
			{#if $page.data.user}
				<Input
					{route}
					on:send={send}
					bind:search_open
					bind:send_on_enter
					bind:success
					bind:can_send
					bind:loading
					bind:content_error
					bind:content_error_text
					bind:more_open
					bind:text
					bind:message_input_ref
				/>
			{/if}
			<div bind:this={chat_container} class="messages">
				{#each messages as message}
					<Message {u} {message} />
					<!-- <Message {u} on:delete_message={({ detail }) => delete_message(detail)} {message} /> -->
				{/each}
			</div>
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
