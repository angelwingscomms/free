<script lang="ts">
	import { Row, Column } from 'carbon-components-svelte';
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
			<Search bind:documents bind:text route="feedback" placeholder="Search all feedback" />
		</div>
	</Column>
</Row>

<style lang="sass">
	.all
		display: flex
		flex-direction: column
		row-gap: 1rem
</style>