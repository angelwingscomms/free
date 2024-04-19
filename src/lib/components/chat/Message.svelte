<script lang="ts">
	import { notify } from '$lib/util/notify';
	import { Button, ContextMenu, ContextMenuOption, CopyButton, truncate } from 'carbon-components-svelte';
	import Copy from 'carbon-icons-svelte/lib/Copy.svelte';
	import { TrashCan } from 'carbon-icons-svelte';
	import { createEventDispatcher } from 'svelte';
	import type { Message } from '$lib/types/message';
	import type { SearchDocument } from '$lib/types';
	export let message: SearchDocument<Message>,
		u: string;
		// hide_system_messages = false,
		// show = true
	// show = message.role !== 'system';
	// ? true
	// : message.role === 'system' &&
	//   !hide_system_messages
	// ? true
	// : false;

	let target: HTMLElement,
		menu_open = false;

	const dispatch = createEventDispatcher();

	const copy = () => {
		if (message.value.c)
			navigator.clipboard.writeText(message.value.c).then(() => {
				notify({
					title: 'message copied to clipboard',
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

<!-- {#if show && message.value.c != null} -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<a href="/m/{message.id}" class="a">
	<div
		bind:this={target}
		on:click={() => (menu_open = true)}
		on:keydown={() => (menu_open = true)}
		style="background-color: {message.value.cl}"
		class="message"
		class:user={message.value.f === u}
		class:r={message.value.t !== u}
	>
		<p class="username">{message.value.uf}</p>
		<p use:truncate class="content">
			{@html message.value.h}
		</p>
	</div>
	<Button iconDescription="Copy" icon={Copy} on:click={copy} size="small" kind="ghost" />
	<!-- <Button iconDescription="Copy" icon={TrashCan} on:click={() => dispatch('delete_message', message.id)} size="small" kind="ghost" /> -->
</a>

<!-- {/if} -->

<style lang="sass">
	@use '@carbon/type'
	@use '@carbon/colors'
	@use '@carbon/themes'

	.a
		display: flex
		flex-direction: row
		column-gap: 1rem
		color: white
		text-decoration: none
		// max-width: 100%

	.username
		@include type.type-style('label-01')

	.message
		white-space: pre-wrap
		word-wrap: break-word
		word-break: normal
		width: 74%
		padding: 1rem

	.user
		align-self: flex-end
		background-color: themes.$field-01

	.r
		background-color: colors.$blue-60

	.content
		color: white !important
		@include type.type-style('body-01')
</style>
