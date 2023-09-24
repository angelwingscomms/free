<script lang="ts">
	import { Button, Modal } from 'carbon-components-svelte';
	import EditIcon from 'carbon-icons-svelte/lib/Edit.svelte';
	import Edit from '$lib/components/User/Edit.svelte';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import type { SearchDocument } from '$lib/types';
	import SearchPagination from '../Search/SearchPagination.svelte';
	let edit_open = false,
		similar_open = false;
	export let name: string, html: string, id: string, similar: SearchDocument[];
</script>

<Modal modalHeading="Edit Profile" bind:open={edit_open} passiveModal>
	<Edit
		on:save={({ detail }) => {
			({ name, html } = detail);
			edit_open = false;
			invalidateAll();
		}}
	/>
</Modal>

<Modal modalHeading="Similar" bind:open={similar_open} passiveModal>
	<SearchPagination documents={similar} />
</Modal>

<div class="all">
	{#if $page.data.session?.user?.id === id}
		<Button size="small" on:click={() => (edit_open = true)} icon={EditIcon}>Edit Profile</Button>
	{/if}
	<p>~ {name}</p>

	{#if html}
		<p>{@html html}</p>
	{/if}
</div>

<style lang="sass">
	.all
		display: flex
		flex-direction: column
		row-gap: 1rem
</style>
