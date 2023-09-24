<script lang="ts">
	import Edit from 'carbon-icons-svelte/lib/Edit.svelte';
	import { Button, Row, Column } from 'carbon-components-svelte';
	import { page } from '$app/stores';
	import Search from '$lib/components/Search/Search.svelte';
</script>

<Row>
	<Column>
		<div class="all">
			{#if $page.data.session?.user}
				<Button href="/edit" icon={Edit}>Edit Profile</Button>
			{:else}
				<Button href="/auth">Login</Button>
			{/if}
			<Search placeholder='Search users' route="/user/search" />
		</div>
	</Column>
</Row>

<style lang="sass">
	.all
		display: flex
		flex-direction: column
		row-gap: 1rem
</style>
