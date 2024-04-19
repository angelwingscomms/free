<script lang="ts">
	import { Button, InlineLoading, Modal, TextArea } from 'carbon-components-svelte';
	import Search from 'carbon-icons-svelte/lib/Search.svelte';
	import type { SearchDocument } from '$lib/types';
	import axios from 'axios';
	import { notify } from '$lib/util/notify';
	import { onMount } from 'svelte';
	import type { Filters as _Filters } from '$lib/types/filter';
	import SearchPagination from './SearchPagination.svelte';

	export let searched = false,
		text = '',
		route: string,
		f: string,
		// open = false,
		old_search: null | string = null,
		placeholder: string,
		total: number = 0,
		documents: SearchDocument<{ u: string; s: string }>[] = [],
		loading = false,
		page: number = 1;

	$: page_update(page);

	const page_update = (page: number) => {
		if (searched) get(page);
	};

	onMount(() => search_input_ref.focus());

	let search_input_ref: HTMLTextAreaElement;
	const get = async (page: number) => {
		if (!text) return;
		searched = true;
		loading = true;
		try {
			const r = await axios.get(route, { params: { q: text, p: page } });
			({ total, documents, page } = r.data);
			old_search = text;
			searched = true;
		} catch (e: any) {
			notify({
				title: `User search error`,
				subtitle: e.response.data.message ?? undefined,
				kind: 'error'
			});
		}

		loading = false;
	};
</script>

<!-- <Modal
	hasForm
	bind:open
	primaryButtonIcon={Search}
	primaryButtonText="search"
	on:submit={() => {
		get(page);
		open = false;
	}}
	modalHeading="search"
>
	<TextArea rows={3} {placeholder} bind:ref={search_input_ref} bind:value={text} />
</Modal> -->

<div class="input">
	<TextArea rows={3} {placeholder} bind:ref={search_input_ref} bind:value={text} />
	<Button icon={Search} on:click={() => get(page)} />
	<!-- <Button on:click={() => (open = !open)}>run a search</Button> -->
</div>

{#if loading}
	<div class="line line-space">
		<p>Searching</p>
		<InlineLoading />
	</div>
{/if}

{#if searched}
	{#if documents.length}
		<SearchPagination
			{f}
			{route}
			{total}
			on:update={({ detail }) => {
				page_update(detail.page);
			}}
			on:click
			{documents}
			{page}
		/>
	{:else if !loading}
		<div class="line">No results</div>
	{/if}
{/if}

<style lang="sass">
	@use '@carbon/layout'
	.input
		display: flex
		flex-direction: row
	.line-space
		column-gap: layout.$spacing-04
	.line
		display: flex
		align-items: center
		justify-content: center
</style>
