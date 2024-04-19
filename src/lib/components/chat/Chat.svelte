<script lang="ts">
	import Interface from '$lib/components/chat/Interface.svelte';
	import axios from 'axios';
	import ably from 'ably';
	import { message_index } from '$lib/constants';
	import { onMount } from 'svelte';
	import { to_html } from '$lib/util/markdown/parse';
	import { page } from '$app/stores';
	import { v4 } from 'uuid';

	export let route: string,
		loading = false,
		name: string,
		text = '',
		messages = $page.data.m,
		success = true;
	let message_input_ref: HTMLTextAreaElement;
	onMount(async () => {
		const realtime = new ably.Realtime({ authUrl: `/ably?i=${$page.data.id}` });
		// realtime.auth.requestToken((await axios.get(`/ably?i=${$page.data.id}`)).data);
		const channel = realtime.channels.get(message_index);

		// realtime.connection.once('connected', () => {

		// })

		channel.subscribe(name, (m) => {
			console.debug('got --', m)
			messages = [m.data, ...messages];
		});
	});

	const send = async ({ detail }: { detail: { c: string; d: number } }) => {
		if (loading) return;
		loading = true;
		message_input_ref.disabled = true;
		await axios.post(route, { ...detail, h: await to_html(detail.c), _id: v4() });
		text = '';
		message_input_ref.disabled = false;
		loading = false;
	};
</script>

<Interface
	{loading}
	{route}
	bind:text
	u={$page.data.user}
	bind:messages
	bind:success
	send_on_enter={true}
	bind:message_input_ref
	on:send={send}
/>
