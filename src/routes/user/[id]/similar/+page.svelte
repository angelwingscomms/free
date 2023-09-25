<script lang="ts">
	import SearchPagination from "$lib/components/Search/SearchPagination.svelte";
	import type { PageData } from "./$types";
    export let data: PageData
</script>

<p>Similar users to {data.name ? data.name : `user ${data.id}`}</p>
<SearchPagination documents={data.d} />