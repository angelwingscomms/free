<script lang='ts'>
	import SearchPagination from "$lib/components/Search/SearchPagination.svelte";
	import type { PageData } from "./$types";
    export let data: PageData

</script>
<SearchPagination total={data.total} page={data.page} documents={data.documents} />