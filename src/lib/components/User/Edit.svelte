<script lang="ts">
	import { page } from '$app/stores';
	import OnEnter from '$lib/components/OnEnter.svelte';
	import { to_html } from '$lib/util/markdown/parse';
	// import { parse } from '$lib/util/markdown/parse/web';
	import { notify } from '$lib/util/notify';
	import { sanitize_object, sanitize_string } from '$lib/util/sanitize';
	import { signOut } from '@auth/sveltekit/client';
	import axios from 'axios';
	import { Button, ButtonSet, InlineLoading, TextArea, TextInput, Toggle } from 'carbon-components-svelte';
	import Save from 'carbon-icons-svelte/lib/Save.svelte';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import { createEventDispatcher } from 'svelte';
	let username = $page.data.u,
		contact = $page.data.c,
		email = $page.data.e,
		text = $page.data.t,
		cl = $page.data.cl,
		x = !!$page.data.x,
		ch = $page.data.ch,
		text_invalid: boolean,
		text_invalid_text: string,
		edit_loading = false,
		delete_loading = false;

	const dispatch = createEventDispatcher<{ save: { username: string; html: string } }>();

	const del = async () => {
		if (delete_loading) return;
		delete_loading = true;
		try {
			await axios.delete('/edit');
			notify('Profile deleted');
			signOut();
		} catch (e: any) {
			console.error('delete error', e);
			notify({
				kind: 'error',
				title: 'Delete error',
				subtitle: e.response.data.message ? e.response.data.message : undefined
			});
		}
		delete_loading = false;
	};

	const save = async () => {
		if (edit_loading) return;
		edit_loading = true;
		try {
			let payload = sanitize_object({ c: contact, u: username, t: text, e: email, x: Number(x), cl });
			const html = await to_html(payload.t as string); //TODO-replace with web-worker version
			payload.h = sanitize_string(html);
			payload.ch = sanitize_string(await to_html(contact))
			await axios.put(`/edit`, payload);
			dispatch('save', { username, html: payload.h as string }); //TODO-review payload.h as string
			notify('Saved');
		} catch (e: any) {
			console.error('save error', e);
			if (e === 'timeout') {
				text_invalid_text = 'Use less text';
				text_invalid = true;
			} else {
				notify({
					kind: 'error',
					title: 'Save error',
					subtitle: e.response.data.message ? e.response.data.message : e.toString() || undefined
				});
			}
		}
		edit_loading = false;
	};
</script>

<OnEnter ctrl on:enter={save} />

<div class="input">
	<TextInput labelText="username" bind:value={username} />
	<TextInput labelText="email" bind:value={email} />
	<TextArea labelText="Contact details" helperText="You can paste links to your socials here" bind:value={contact} rows={3} />
	<TextArea
		rows={15}
		labelText="List your likes and dislikes, interests and hobbies and favorite stuff, like favorite movies, music and TV shows"
		helperText="you can create a description of yourself with a lot of detail to allow people find you easily"
		placeholder="you can describe yourself in detail, asl, your likes and dislikes your personality, your beliefs, your hobbies, likes and dislikes, your experiences..."
		invalid={text_invalid}
		invalidText={text_invalid_text}
		bind:value={text}
	/>
	<div>
		<label for="color">Color</label>
		<input bind:value={cl} name="color" type="color">
	</div>
	<Toggle bind:toggled={x} labelText="Hide your bio on your profile page" />
</div>
<ButtonSet stacked>
	<Button disabled={edit_loading} icon={edit_loading ? InlineLoading : Save} on:click={save}
		>Save</Button
	>
	<Button disabled={delete_loading} icon={delete_loading ? InlineLoading : TrashCan} on:click={del}
		>Delete Profile</Button
	>
</ButtonSet>

<style lang="sass">
	@use "@carbon/layout"
	.input
		display: flex
		flex-direction: column
		row-gap: layout.$spacing-06
</style>
