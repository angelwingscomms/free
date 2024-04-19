<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

{#if data.i}
	<p>You are a member</p>
{/if}
<p>Name: {data.n}</p>
<p>Number of members: {data.a}</p>
<p>What members have in common:</p>
<p>{data.c}</p>
