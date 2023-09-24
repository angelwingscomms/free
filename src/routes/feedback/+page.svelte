<script lang="ts">
	import { notify } from '$lib/util/notify';
	import axios from 'axios';
	import { Button, InlineLoading, TextArea, TextInput } from 'carbon-components-svelte';
	import Edit from 'carbon-icons-svelte/lib/Edit.svelte';

	let feedbackText = '';
	let loading = false;

	const submitFeedback = async () => {
		loading = true;
		try {
			await axios.post('/feedback', { t: feedbackText });
			notify('Feedback submitted successfully.');
			feedbackText = ''; // Clear the text area after submission if desired.
		} catch (error: any) {
			console.error('Submit feedback error', error);
			notify({ kind: 'error', title: 'Feedback submission error' });
		}
		loading = false;
	};
</script>

<div>
	<h5>Suggest improvements for this platform or make any complaints</h5>

	<TextArea bind:value={feedbackText} labelText="Feedback" />

	<Button icon={loading ? InlineLoading : Edit} on:click={submitFeedback}>
		Submit Feedback
	</Button>
</div>