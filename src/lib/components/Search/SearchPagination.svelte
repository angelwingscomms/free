<script lang="ts">
	import type { SearchDocument } from '$lib/types';
	import { ButtonSet, Loading, Pagination } from 'carbon-components-svelte';
	import { items_per_page } from '$lib/constants';
	import Document from './Document.svelte';

	export let route: string, page: number = 1,
		documents: SearchDocument[],
		total = documents.length;

	let loading = false;
</script>

{#if loading}
	<Loading />
{:else}
	<ButtonSet stacked>
		{#each documents as document}
			<Document {route} on:click {document} />
		{/each}
	</ButtonSet>
{/if}

{#if total > items_per_page}
	<Pagination on:update pageSizeInputDisabled pageSize={7} totalItems={total} {page} />
{/if}
