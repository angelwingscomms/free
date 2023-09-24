<script lang="ts">
	import { Button, Row, Column, Modal } from 'carbon-components-svelte';
	import { page } from '$app/stores';
	import EditIcon from 'carbon-icons-svelte/lib/Edit.svelte';
	import Search from '$lib/components/Search/Search.svelte';
	import Edit from '$lib/components/User/Edit.svelte';
	import User from '$lib/components/User/User.svelte';
	import axios from 'axios';
	import { notify } from '$lib/util/notify';

	let edit_open = false,
		user_open = false,
		name: string,
		html: string,
		id: string;

	const show = async (_id: string) => {
		try {
			const res = await axios.get(`/user/${_id}`);
			({ name, html } = res.data);
			id = _id;
			user_open = true;
		} catch (e) {
			notify({
				kind: 'error',
				title: 'Get user error',
				subtitle: e.response.data.message ?? undefined
			});
		}
	};
</script>

{#if $page.data.session?.user}
	<Modal modalHeading="Edit Profile" bind:open={edit_open} passiveModal>
		<Edit on:save={() => (edit_open = false)} />
	</Modal>
{/if}

<Modal modalHeading="User" bind:open={user_open} passiveModal>
	<User {name} {html} {id} />
</Modal>

<Row>
	<Column>
		<div class="all">
			{#if $page.data.session?.user}
				<Button size="small" on:click={() => (edit_open = true)} icon={EditIcon}
					>Edit Profile</Button
				>
			{:else}
				<Button size="small" href="/auth">Login</Button>
			{/if}
			<Search
				on:click={({ detail }) => show(detail)}
				placeholder="Search users"
				route="/user/search"
			/>
		</div>
	</Column>
</Row>

<style lang="sass">
	.all
		display: flex
		flex-direction: column
		row-gap: 1rem
</style>
