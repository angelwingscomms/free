<script lang="ts">
	import { notify } from '$lib/util/notify';
	import { parse } from 'marked';
	import { Button, ContextMenu, ContextMenuOption, CopyButton } from 'carbon-components-svelte';
	import Copy from 'carbon-icons-svelte/lib/Copy.svelte';
	import { TrashCan } from 'carbon-icons-svelte';
	import { createEventDispatcher } from 'svelte';
	import type { Message } from './types';
	export let message: Message,
		// hide_system_messages = false,
		show = message.role !== 'system';
	// ? true
	// : message.role === 'system' &&
	//   !hide_system_messages
	// ? true
	// : false;

	let target: HTMLElement,
		menu_open = false;

	const dispatch = createEventDispatcher();

	const copy = () => {
		if (message.content)
			navigator.clipboard.writeText(message.role === 'user' ? message.content : message.content).then(() => {
				notify({
					title: 'Copied to clipboard',
					timeout: 1300
				});
			});
	};
</script>

<!-- <ContextMenu
	bind:open={menu_open}
	target={[target]}
>
	<ContextMenuOption
		on:click={copy}
		labelText="Copy"
		icon={Copy}
	/>
</ContextMenu> -->

{#if show && message.content != null}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="a">
		<div
			bind:this={target}
			on:click={() => (menu_open = true)}
			on:keydown={() => (menu_open = true)}
			class="message"
			class:user={message.role === 'user'}
			class:assistant={message.role === 'assistant'}
		>
			<p class="content">
				{#if message.role === 'user'}
					{message.content}
					<!-- {message.content[0].text} -->
				{:else}
					{@html parse(message.content)}
				{/if}
			</p>
		</div>
		<Button iconDescription="Copy" icon={Copy} on:click={copy} size="small" kind="ghost" />
		<Button iconDescription="Copy" icon={TrashCan} on:click={() => dispatch('delete_message', message.id)} size="small" kind="ghost" />
	</div>
{/if}

<style lang="sass">
	@use '@carbon/type'
	@use '@carbon/colors'
	@use '@carbon/themes'
	@use '@carbon/layout'

	.a
		display: flex
		flex-direction: row
		column-gap: layout.$spacing-05
		// max-width: 100%

	.message
		white-space: pre-wrap
		word-wrap: break-word
		word-break: normal
		width: 74%
		padding: 1rem

	.user
		align-self: flex-end
		background-color: themes.$field-01

	.assistant
		background-color: colors.$blue-60

	.content
		@include type.type-style('body-01')
</style>
