<script lang="ts">
	import { TextArea, Button, InlineLoading } from 'carbon-components-svelte';
	import { createEventDispatcher } from 'svelte';
	import { send_on_enter } from './store';
	import FileUpload from '../FileUpload.svelte';
	import type { ChatCompletionContentPartImage, ChatCompletionUserMessageParam } from 'openai/resources';
	import { notify } from '$lib/util/notify';
	import { Close, Send, Menu, Upload } from 'carbon-icons-svelte';

	export let // run: (m: ChatCompletionUserMessageParam) => void,
		success: boolean,
		more_open: boolean,
		can_send: boolean,
		loading: boolean,
		content_error: boolean,
		content_error_text: string,
		message_input_ref: HTMLTextAreaElement,
		text: string;

	type Image = ChatCompletionContentPartImage & { id: number };

	let images: Image[] = [],
		next_image_id = 0,
		files_loading = false;

	const keydown = (e: KeyboardEvent) => {
		switch (e.key) {
			case 'Enter':
				if (!$send_on_enter && !e.ctrlKey) return;
				if (can_send && document && document.activeElement === message_input_ref) send();
		}
	};

	const file_to_base64 = (file: File) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.onloadend = () => {
				resolve(reader.result);
			};

			reader.onerror = reject;

			reader.readAsDataURL(file);
		});
	};

	const send = async () => {
		// try {
		// 	await run({ role: 'user', content: [{ type: 'text', text }, ...images.map((i) => ({ type: i.type, image_url: i.image_url }))] });
		// 	images = [];
		// } catch (e) {
		// 	console.error('Request error', e);
		// 	notify({ kind: 'error', title: 'Error', subtitle: e.toString() ?? 'Please retry' });
		// }
		success = false;
		dispatch('send', { role: 'user', content: [{ type: 'text', text }, ...images.map((i) => ({ type: i.type, image_url: i.image_url }))] });
	};

	const dispatch = createEventDispatcher();

	const remove_image = (id: number) => {
		images = [...images.filter((i) => i.id !== id)];
	};

	const update_images = async ({ detail }: { detail: File[] }) => {
		files_loading = true;
		for (let i = 0; i < detail.length; i++) {
			try {
				const base64 = await file_to_base64(detail[i]);
				images = [
					...images,
					{
						id: next_image_id,
						type: 'image_url',
						image_url: {
							url: base64 as string,
							detail: 'high'
						}
					}
				];
				next_image_id++;
			} catch (err) {
				notify({
					kind: 'error',
					title: 'Error occurred while trying to read uploaded file'
				});
			}
		}
		files_loading = false;
	};

	$: if (success) images = [];
</script>

<svelte:window on:keydown={keydown} />

<div class="input">
	{#if images.length}
		<div class="images">
			{#each images as image}
				<div class="image">
					<img class="img" src={image.image_url.url} alt="to be sent as part of the message" />
					<Button on:click={() => remove_image(image.id)} icon={Close} iconDescription="Delete this image" />
				</div>
			{/each}
		</div>
	{/if}
	<div class="text-and-buttons">
		<TextArea
			style="min-width: unset"
			rows={2}
			disabled={loading}
			on:keydown={(e) => {
				if (e.key === 'Enter' && $send_on_enter) e.preventDefault();
			}}
			invalid={content_error}
			invalidText={content_error_text}
			on:input={() => (content_error = false)}
			bind:ref={message_input_ref}
			bind:value={text}
		/>
		<Button disabled={!can_send} size="field" on:click={send} iconDescription={'Send'} icon={loading ? InlineLoading : Send} />
		<!-- <FileUpload
			label={String(images.length)}
			on:change={update_images}
			button={{
				iconDescription: 'Upload images',
				icon: files_loading ? InlineLoading : Upload
			}}
			multiple
		/> -->
		<Button size="field" on:click={() => (more_open = true)} iconDescription="More" icon={Menu} />
	</div>
</div>

<style lang="sass">
	@use '@carbon/layout'
	.text-and-buttons
		max-width: 100%
		display: flex
		flex-grow: 0
		flex-direction: row
	.images
		display: flex
		flex-direction: row
		column-gap: layout.$spacing-06
		width: 100%
		overflow: scroll
	.image
		display: flex
		flex-direction: column
		align-items: center
	.img
		height: 123px
	.input
		display: flex
		flex-direction: column
</style>
