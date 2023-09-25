<script lang='ts'>
	import SearchPagination from "$lib/components/Search/SearchPagination.svelte";
	import type { SearchDocument } from "$lib/types";
    export let documents: SearchDocument[]

</script>
<SearchPagination route='/user' {documents} />