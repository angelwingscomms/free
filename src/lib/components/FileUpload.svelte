<script lang="ts">
	export let 
		multiple = false,
		label = `Upload file${multiple ? 's' : ''}`,
		button: ButtonProps = {},
		dispatch_empty = false;

	import { Button } from 'carbon-components-svelte';
	import type { ButtonProps } from 'carbon-components-svelte/src/Button/Button.svelte';
	import Upload from 'carbon-icons-svelte/lib/Upload.svelte';
	import { createEventDispatcher } from 'svelte';

	let ref: HTMLInputElement;

	const dispatch = createEventDispatcher();

	const change = async () => {
		if (!ref || !ref.files) return;
		if (ref.files.length < 1 && dispatch_empty) {
			dispatch('change', ref.files);
			return;
		}
		dispatch('change', ref.files);
	};
</script>

<Button icon={Upload} iconDescription={label ?? "Upload file"} {...button} on:click={() => ref.click()}>{#if label}{label}{/if}</Button>
<input style="display: none;" {multiple} on:change={change} type="file" bind:this={ref} />
