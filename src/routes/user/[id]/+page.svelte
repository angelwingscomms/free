<script lang="ts">
	import { Column, Row } from 'carbon-components-svelte';
	import type { PageData } from './$types';
	import User from '$lib/components/User/User.svelte';
	export let data: PageData;
</script>

<Row>
	<Column>
		<User name={data.name} html={data.html} id={data.id} />
	</Column>
</Row>