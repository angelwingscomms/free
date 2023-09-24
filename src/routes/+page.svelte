<script lang="ts">
	import { Button, Row, Column, Modal } from 'carbon-components-svelte';
	import { page } from '$app/stores';
	import EditIcon from 'carbon-icons-svelte/lib/Edit.svelte'
	import Search from '$lib/components/Search/Search.svelte';
	import Edit from '$lib/components/User/Edit.svelte';

	let edit_open = false;
</script>

{#if $page.data.session?.user}
	<Modal modalHeading="Edit Profile" bind:open={edit_open} passiveModal>
		<Edit on:save={() => edit_open = false} />
	</Modal>
{/if}

<Row>
	<Column>
		<div class="all">
			{#if $page.data.session?.user}
				<Button size="small" on:click={() => edit_open = true} icon={EditIcon}>Edit Profile</Button>
			{:else}
				<Button size="small" href="/auth">Login</Button>
			{/if}
			<Search placeholder="Search users" route="/user/search" />
		</div>
	</Column>
</Row>

<style lang="sass">
	.all
		display: flex
		flex-direction: column
		row-gap: 1rem
</style>
