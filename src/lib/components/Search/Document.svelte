<script lang="ts">
	import type { SearchDocument } from '$lib/types';
	import { Button } from 'carbon-components-svelte';

	export let route: string, document: SearchDocument;
</script>

<Button kind="ghost" href="/{route}/{document.id}"
	>~ {document.value.name ?? ''}</Button
>
