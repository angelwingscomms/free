<script lang="ts">
	import { notify } from '$lib/util/notify';
	import { sanitize_string } from '$lib/util/sanitize';
	import axios from 'axios';
	import { Button, InlineLoading, TextArea, TextInput } from 'carbon-components-svelte';
	import Edit from 'carbon-icons-svelte/lib/Edit.svelte';

	let feedbackText = '',
		text_invalid: boolean,
		text_invalid_text: string,
		loading = false;

	const submitFeedback = async () => {
		loading = true;
		try {
			const t = sanitize_string(feedbackText);
			await axios.post('/feedback', { t });
			notify('Feedback submitted successfully.');
			feedbackText = ''; // Clear the text area after submission if desired.
		} catch (e: any) {
			console.error('Feedback submission error', e);
			if (e === 'timeout') {
				text_invalid_text = 'Use less text';
				text_invalid = true;
			} else {
				notify({
					kind: 'error',
					title: 'Feedback submission error',
					timeout: 4320,
					subtitle: e.response.data.message ? e.response.data.message : e.toString() || undefined
				});
			}
		}
		loading = false;
	};
</script>

<div>
	<h5>Suggest improvements for this platform or make any complaints</h5>

	<TextArea
		invalidText={text_invalid_text}
		invalid={text_invalid}
		bind:value={feedbackText}
		labelText="Feedback"
	/>

	<Button icon={loading ? InlineLoading : Edit} on:click={submitFeedback}>Submit Feedback</Button>
</div>
