<script lang="ts">
	export let open: boolean,
		restart_modal,
		name_label: string,
		show_name_edit: boolean,
		hide_parameters: boolean,
		name: string,
		description_label: string,
		description_error: boolean,
		description_error_text: string,
		disable_description_edit: boolean,
		// description: string,
		parameters: ChatCompletionCreateParamsNonStreaming;

	import Download from 'carbon-icons-svelte/lib/Download.svelte';
	import Restart from 'carbon-icons-svelte/lib/Restart.svelte';
	import {
		Modal,
		ButtonSet,
		Button,
		TextInput,
		TextArea,
		NumberInput,
		Toggle
	} from 'carbon-components-svelte';

	import { createEventDispatcher } from 'svelte';
	import { send_on_enter } from './store';
	import type { ChatCompletionCreateParamsNonStreaming } from 'groq-sdk/resources/chat/completions.mjs';
	const dispatch =
		createEventDispatcher();
</script>

<Modal
	bind:open
	modalHeading=""
	passiveModal
	hasForm
>
	<div class="rows">
		<div class="in_modal">
			<ButtonSet>
				<Button
					size="field"
					on:click={() =>
						dispatch('download')}
					iconDescription="Download chat"
					icon={Download}
					>Download chat</Button
				>
				<Button
					size="field"
					on:click={() =>
						{restart_modal = true; open = false}}
					iconDescription="Restart chat"
					icon={Restart}
					>Restart chat</Button
				>
			</ButtonSet>
			{#if show_name_edit}
				<TextInput
					labelText={name_label}
					disabled={show_name_edit}
					bind:value={name}
				/>
			{/if}
			<TextArea
				labelText={description_label}
				invalid={description_error}
				disabled={disable_description_edit}
				invalidText={description_error_text}
				rows={1}
				on:input={() =>
					(description_error = false)}
				bind:value={parameters.messages[0].content}
			/>
		</div>
		{#if !hide_parameters}
			<div class="header-content">
				<p>
					OpenAI Completions
					Parameters
				</p>
				<div class="in_modal">
					<NumberInput
						label="temperature"
						min={0}
						max={2}
						hideSteppers
						bind:value={parameters.temperature}
					/>
					<NumberInput
						label="top_p"
						min={0}
						max={2}
						hideSteppers
						bind:value={parameters.top_p}
					/>
					<NumberInput
						label="frequency_penalty"
						min={-2.0}
						max={2.0}
						hideSteppers
						bind:value={parameters.frequency_penalty}
					/>
					<NumberInput
						label="presence_penalty"
						min={-2.0}
						max={2.0}
						hideSteppers
						bind:value={parameters.presence_penalty}
					/>
				</div>
			</div>
		{/if}
		<div class="header-content">
			<p>Options</p>
			<div>
				<Toggle
					bind:toggled={$send_on_enter}
					labelA="The enter key will create a new line, instead of sending the message"
					labelB="The enter key will send the message, instead of creating a new line"
					labelText="What the Enter key does while the message input is focused (pressing the 'Ctrl' key with the 'Enter' key overrides this, and sends the message)"
				/>
			</div>
		</div>
	</div>
</Modal>

<style lang="sass">
	@use '@carbon/layout'

	.in_modal
		display: flex
		flex-direction: column
		row-gap: layout.$spacing-05
	.header-content
		display: flex
		flex-direction: column
		row-gap: layout.$spacing-02
	.rows
		display: flex
		flex-direction: column
		row-gap: layout.$spacing-07
</style>
