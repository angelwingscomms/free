<script lang="ts">
	import { Button, Column, Modal, Row } from 'carbon-components-svelte';
	import type { PageData } from './$types';
	import EditIcon from 'carbon-icons-svelte/lib/Edit.svelte';
	import Edit from '$lib/components/User/Edit.svelte';
	import { invalidateAll } from '$app/navigation';
	export let data: PageData;
	let edit_open = false;
</script>

<Modal modalHeading="Edit Profile" bind:open={edit_open} passiveModal>
	<Edit on:save={() => {edit_open = false; invalidateAll()}} />
</Modal>

<Row>
	<Column>
		<div class="all">
			{#if data.session?.user?.id === data.id}
				<Button size="small" on:click={() => (edit_open = true)} icon={EditIcon}
					>Edit Profile</Button
				>
			{/if}
			<p>~ {data.name}</p>

			{#if data.html}
				<p>{@html data.html}</p>
			{/if}
		</div>
	</Column>
</Row>

<style lang="sass">
	.all
		display: flex
		flex-direction: column
		row-gap: 1rem
</style>
