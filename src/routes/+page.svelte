<script lang="ts">
	import { Button, Row, Column, Modal } from 'carbon-components-svelte';
	import { page } from '$app/stores';
	import Search from '$lib/components/Search/Search.svelte';
	import type { Snapshot } from './$types';
	import type { SearchDocument } from '$lib/types';

	let documents: SearchDocument[], text: string;

	export const snapshot: Snapshot = {
		capture: () => ({ documents, text }),
		restore: (v) => ({ documents, text } = v)
	};
</script>

<Row>
	<Column>
		<div class="all">
			{#if $page.data.session?.user}
				<Button kind="ghost" size="small" href="/edit">Edit Profile</Button>
			{:else}
				<Button size="small" href="/auth">Login</Button>
			{/if}
			<Search bind:documents bind:text placeholder="Search users" route="user" />
		</div>
	</Column>
</Row>

<style lang="sass">
	.all
		display: flex
		flex-direction: column
		row-gap: 1rem
</style>
