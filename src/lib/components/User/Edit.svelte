<script lang="ts">
	import { page } from '$app/stores';
	import OnEnter from '$lib/components/OnEnter.svelte';
	import { parse } from '$lib/util/markdown/parse/web';
	import { notify } from '$lib/util/notify';
	import { sanitize_object, sanitize_string } from '$lib/util/sanitize';
	import { signOut } from '@auth/sveltekit/client';
	import axios from 'axios';
	import {
		Button,
		ButtonSet,
		FluidForm,
		InlineLoading,
		TextArea,
		TextInput
	} from 'carbon-components-svelte';
	import Edit from 'carbon-icons-svelte/lib/Edit.svelte';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import { createEventDispatcher } from 'svelte';
	let name = $page.data.name,
		text = $page.data.text,
		text_invalid: boolean,
		text_invalid_text: string,
		edit_loading = false,
		delete_loading = false;

	const dispatch = createEventDispatcher<{ save: undefined }>();

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
			let payload = sanitize_object({ name, text });
			const html = await parse(payload.text as string);
			payload.html = sanitize_string(html);
			await axios.put(`/edit`, payload);
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
		dispatch('save');
		edit_loading = false;
	};
</script>

<OnEnter on:enter={save} />

<FluidForm>
	<TextInput bind:value={name} labelText="Name" />
	<TextArea
		rows={15}
		placeholder="Description. Use markdown if you want"
		invalid={text_invalid}
		invalidText={text_invalid_text}
		bind:value={text}
	/>
</FluidForm>
<ButtonSet stacked>
	<Button disabled={edit_loading} icon={edit_loading ? InlineLoading : Edit} on:click={save}
		>Save</Button
	>
	<Button disabled={delete_loading} icon={delete_loading ? InlineLoading : TrashCan} on:click={del}
		>Delete Profile</Button
	>
</ButtonSet>
