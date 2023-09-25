<script lang="ts">
	import { Row, Column } from 'carbon-components-svelte';
	import Search from '$lib/components/Search/Search.svelte';
</script>

<Row>
	<Column>
		<div class="all">
			<Search route="feedback" placeholder="Search all feedback" />
		</div>
	</Column>
</Row>

<style lang="sass">
	.all
		display: flex
		flex-direction: column
		row-gap: 1rem
</style>