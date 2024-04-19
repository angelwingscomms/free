<script lang="ts">
	import {
		Button,
		ButtonSet,
		Column,
		InlineLoading,
		Row,
		TextArea,
		TextInput,
		// Toggle	
	} from 'carbon-components-svelte';
	import { applyAction, enhance } from '$app/forms';
	// import axios from 'axios';
	import { goto } from '$app/navigation';
	// import { OnEnter } from 'sveltekit-carbon-utils';
	import FileUpload from '$lib/components/FileUpload.svelte';
	import { CenterSquare, Close, Send } from 'carbon-icons-svelte';
	import type { Item } from '$lib/types/item';
	import { notify } from '$lib/util';
	import Images from '../Images.svelte';

	export let p: Item | undefined = undefined,
		images: Image[] = Array.isArray(p?.ii) ? p?.ii.map((src, id) => ({ src, id })) : [],
		images_loading = false;
	let loading = false,
		next_image_id = 0,
		// update_location = false,
		display_image = typeof p?.i === 'number' ? p?.i : 0,
		images_ref: HTMLInputElement,
		image_ref: HTMLInputElement;

	type Image = { id: number; src: string };

	$: console.debug(image_ref?.files);

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

	const update_images = async ({ detail }: { detail: File[] }) => {
		images_loading = true;
		images = [];
		for (let i = 0; i < detail.length; i++) {
			try {
				const base64 = await file_to_base64(detail[i]);
				images = [
					...images,
					{
						id: next_image_id,
						src: base64 as string
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
		images_loading = false;
	};

	const remove_image = (id: number) => {
		images = [...images.filter((i) => i.id !== id)];
	};

	// const send = async () => {
	// try {
	// 	const form = new FormData();
	// 	const { data } = await axios.post('/i', { name, about });
	// 	goto(`/i/id/${data}`);
	// } catch (e) {
	// 	console.error(e);
	// }
	// };
</script>

<Row>
	<Column>
		<form
			enctype="multipart/form-data"
			method="POST"
			use:enhance={() => {
				loading = true;

				return async ({ result }) => {
					loading = false;
					if (result.type === 'redirect') {
						goto(result.location);
					} else {
						await applyAction(result);
					}
				};
			}}
		>
			<div class="form">
				<TextInput maxlength={2160} name="n" value={p?.n ?? ''} labelText="Name" />
				<TextInput maxlength={2160} name="p" value={p?.p ?? ''} labelText="Price" />
				<TextArea
					helperText="Describe the item in detail, so users can easily find it"
					maxlength={2160}
					name="a"
					value={p?.a ?? ''}
					labelText="About this item"
				/>
				<!-- <FileUpload
					loading={image_loading}
					name="i"
					bind:ref={image_ref}
					on:change={() => {
						image_added = true
					}}
					label="{image_added ? 'Change' : 'Add'} display image"
				/> -->
				<!-- {#if images.length}
					<div class="images">
						{#each images as image}
							<div class="image">
								<img class="img" src={image.image_url.url} alt="to be sent as part of the message" />
								<Button
									on:click={() => remove_image(image.id)}
									icon={Close}
									iconDescription="Delete this image"
								/>
							</div>
						{/each}
					</div>
				{/if} -->
				<input type="number" style="display: none;" bind:value={display_image} name="i" />
				<!-- <Toggle
					bind:toggled={update_location}
					labelText="Update this items's geolocation to your current location"
				/> -->
				<Images alt="item" on:x-click={({ detail }) => remove_image(detail)} {images} let:index>
					<Button
						icon={CenterSquare}
						iconDescription="set as display image"
						kind={index === display_image ? 'primary' : 'ghost'}
						on:click={() => (display_image = index)}
					/>
					<!-- <Button
						icon={Close}
						iconDescription="remove this image"
						kind="ghost"
						on:click={() => {
							images_ref.files?.splice(index, 1)
						}}
					/> -->
				</Images>
				<ButtonSet stacked>
					<FileUpload
						loading={images_loading}
						bind:ref={images_ref}
						on:change={update_images}
						name="ii"
						multiple
						label="set images"
					/>
					<Button icon={loading ? InlineLoading : Send} type="submit">submit</Button>
				</ButtonSet>
			</div>
		</form>
	</Column>
</Row>

<style>
	.form {
		display: flex;
		flex-direction: column;
		row-gap: 1rem;
	}
</style>
