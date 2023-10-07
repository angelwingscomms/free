<script lang="ts">
	import { Button, Row, Column } from 'carbon-components-svelte';
	import Search from '$lib/components/Search/Search.svelte';
	import type { Snapshot } from './$types';
	import type { SearchDocument } from '$lib/types';

	let documents: SearchDocument[], text: string, searched: boolean;

	export const snapshot: Snapshot = {
		capture: () => ({ documents, text, searched }),
		restore: (v) => ({ documents, text, searched } = v)
	};
</script>

<Row>
	<Column>
		<div class="all">
			<Button kind="ghost" size="small" href="/edit">Edit</Button>
			<Search bind:searched bind:documents bind:text placeholder="Search users" route="user" />
		</div>
	</Column>
</Row>

<style lang="sass">
	.all
		display: flex
		flex-direction: column
		row-gap: 1rem
</style>
