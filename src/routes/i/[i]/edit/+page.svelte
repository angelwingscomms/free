<script lang="ts">
	import Edit from '$lib/components/item/Edit.svelte';
	export let data;
</script>

<h3>Edit this item</h3>

<Edit p={data.p} />
