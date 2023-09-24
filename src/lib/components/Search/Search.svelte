<script lang="ts">
	import { TextInput, Button, Row, Loading, Modal, InlineLoading } from 'carbon-components-svelte';
	import Search from 'carbon-icons-svelte/lib/Search.svelte';
	import type { SearchDocument } from '$lib/types';
	import axios from 'axios';
	import { notify } from '$lib/util/notify';
	import OnEnter from '$lib/components/OnEnter.svelte';
	import { onMount } from 'svelte';
	import type { Filters as _Filters } from '$lib/types/filter';
	import SearchPagination from './SearchPagination.svelte';

	export let searched = false,
		text = '',
		route: string,
		placeholder: string,
		totalItems: number = 0;
	let loading = false,
		results: SearchDocument<{ name: string }>[] = [],
		page: number = 1;

	$: page_update(page);

	const page_update = (page: number) => {
		if (searched) get(page);
	};

	onMount(() => search_input_ref.focus());

	let search_input_ref: HTMLInputElement;
	const get = async (page: number) => {
		if (!text) return;
		searched = true;
		loading = true;
		try {
			const r = await axios.post(route, { text, page });
			({ total: totalItems, documents: results } = r.data);
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

<OnEnter on:enter={() => get(page)} />

<div class="input">
	<TextInput {placeholder} bind:ref={search_input_ref} bind:value={text} />
	<Button size="field" on:click={() => get(page)} iconDescription="Search" icon={Search} />
</div>

{#if loading}
	<div class="line line-space">
		<p>Searching</p>
		<InlineLoading />
	</div>
{/if}

{#if searched}
	{#if results.length}
		<SearchPagination
			{totalItems}
			on:update={({ detail }) => {
				page_update(detail.page);
			}}
			{results}
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
