<script lang="ts">
	import {
		TextInput,
		PasswordInput,
		InlineLoading,
		Button,
		ButtonSet,
		InlineNotification
	} from 'carbon-components-svelte';
	import { Send } from 'carbon-icons-svelte';
	import { notify } from '$lib/util';
	import { invalidateAll } from '$app/navigation';
	import axios from 'axios';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;

	let n = data.n,
		email_invalid = false,
		error = '',
		loading = false,
		username = '',
		password = '',
		email = '';

	const send = async () => {
		if (n && !email) {
			email_invalid = true;
			return;
		}
		try {
			const res = await axios.post('/auth', { ...(n && { e: email }), u: username, p: password });
			if (res.data) {
				error = res.data;
				return;
			}
			await invalidateAll();
			goto(n ? `/edit${data.t ? `?t=${data.t}` : ''}` : data.t ? data.t : '/');
		} catch {
			notify({ kind: 'error', title: 'An error occured' });
		}
	};

	const go = async () => {
		loading = true;
		await send();
		loading = false;
	};
</script>

{#if error}
	<InlineNotification kind="error" title={error} />
{/if}

{#if n}
	<TextInput
		invalid={email_invalid}
		on:input={() => {
			email_invalid = false;
			error = '';
		}}
		invalidText="Email required"
		required
		bind:value={email}
		labelText="email"
	/>
{/if}
<div class="all">
	<TextInput on:input={() => (error = '')} bind:value={username} labelText="username" />
	<PasswordInput on:input={() => (error = '')} bind:value={password} labelText="password" />
	<ButtonSet stacked>
		<Button icon={loading ? InlineLoading : Send} on:click={go}>go</Button>
		<Button kind="ghost" on:click={() => (n = !n)}>{n ? 'existing user' : 'new User'}</Button>
	</ButtonSet>
</div>

<style lang="sass">
	@use "@carbon/layout"

	.all
		display: flex
		flex-direction: column
		row-gap: layout.$spacing-06
</style>
