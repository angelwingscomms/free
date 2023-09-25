<script lang="ts">
	import { Button, Row, Column, Modal } from 'carbon-components-svelte';
	import { page } from '$app/stores';
	import Search from '$lib/components/Search/Search.svelte';
</script>

<Row>
	<Column>
		<div class="all">
			{#if $page.data.session?.user}
				<Button kind="ghost" size="small" href="/edit">Edit Profile</Button>
			{:else}
				<Button size="small" href="/auth">Login</Button>
			{/if}
			<Search placeholder="Search users" route="user" />
		</div>
	</Column>
</Row>

<style lang="sass">
	.all
		display: flex
		flex-direction: column
		row-gap: 1rem
</style>
