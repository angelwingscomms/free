<script lang="ts">
	import Item from '$lib/components/item/Entry.svelte';
	import axios from 'axios';
	import { Button, Column, InlineLoading, Row, TextInput, Toggle } from 'carbon-components-svelte';
	import { Search } from 'carbon-icons-svelte';
	import OnEnter from '$lib/components/OnEnter.svelte';
	import type { SearchDocument } from '$lib/types';
	import type { ItemListing } from '$lib/types/item';

	let loading = false,
		e = false;

	export let search=true, params: Record<string, string> = {},
		q: string | null = "", p: number = 0,
		documents: SearchDocument<ItemListing>[] = [];

	export const get = async () => {
		if (loading) return;
		loading = true;
		try {
			const { data } = await axios.get('/i', {
				params: {
					q,
                    p,
					e: e ? '.' : '	',
					...params
				}
			});
			console.info(data);
			({ documents } = data);
		} catch (e) {
			console.error(e);
		}
		loading = false;
	};
</script>

{#if search}
	<OnEnter on:enter={get} />
{/if}

<Row>
	<Column
		><div class="all">
			<slot />
			{#if search}
				<div class="input">
					<TextInput hideLabel placeholder="Search all items" bind:value={q} labelText="Search" />
					<Button
						iconDescription="Search"
						size="field"
						on:click={get}
						icon={loading ? InlineLoading : Search}
					/>
				</div>
				<Toggle bind:toggled={e} labelText="Show only exact results" />
			{/if}
			{#if documents.length}
				<div class="items">
					{#each documents as d}
						<Item id={d.id} p={d.value} />
					{/each}
				</div>{:else if search}
				<p>There seem to be no results for that search</p>
			{/if}
		</div>
	</Column>
</Row>

<style lang="sass">
	@use '@carbon/layout'
	.all
		display: flex
		flex-direction: column
		row-gap: layout.$spacing-03
	.items
		display: flex
		flex-direction: row
		flex-wrap: wrap
		column-gap: layout.$spacing-04
	.input
		display: flex
		flex-direction: row
		align-items: center
</style>
