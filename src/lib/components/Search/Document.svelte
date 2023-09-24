<script lang="ts">
	import type {
		SearchDocument
	} from '$lib/types';
	import {
		Link
	} from 'carbon-components-svelte';
	import { createEventDispatcher } from 'svelte';

	export let document: SearchDocument

	const dispatch = createEventDispatcher();
</script>

<div role="button" tabindex="0" on:click on:keydown={() => dispatch('click')} class="document">
	<div class="name">
		<Link href="/user/{document.id}">~ {document.value.name ?? ''}</Link>
	</div>
</div>

<style lang="sass">
	@use '@carbon/layout'
	.name
		width: 74%
	.document 
		display: flex
		align-items: center
		padding: layout.$spacing-04
</style>
