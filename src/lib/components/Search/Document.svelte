<script lang="ts">
	import type { SearchDocument } from '$lib/types';
	import { Button, Link } from 'carbon-components-svelte';
	import { createEventDispatcher } from 'svelte';

	export let document: SearchDocument;

	const dispatch = createEventDispatcher<{ click: string }>();
</script>

<Button kind="ghost" on:click={() => dispatch('click', document.id)}
	>~ {document.value.name ?? ''}</Button
>
