<script>
	import { getContext } from 'svelte';
	import CheckBox from '@components/CheckBox/CheckBox.svelte';
	import Button from '@components/Button/Button.svelte';
	import ThumbsUp from '../../../../assets/svg/thumbs-up.svg';
	import ThumbsDown from '../../../../assets/svg/thumbs-down.svg';
	import { FEEDBACK_KEYS } from '@utils/constants';

	const { close } = getContext('conversation-feedback-model');
	const tags = [
		{
			id: 'slightly-inaccurate',
			name: 'Slightly inaccurate',
		},
		{
			id: 'inaccurate',
			name: 'Inaccurate',
		},
		{
			id: 'unsatisfactory',
			name: 'Unsatisfactory',
		},
	];

	export let feedback;
</script>

<section class="feedback-dialog">
	<section class="feedback-dialog__header">
		{#if feedback?.rating === FEEDBACK_KEYS['THUMBS_UP']}
			<img src={ThumbsUp} alt="thumbs up" />
		{:else}
			<img src={ThumbsDown} alt="thumbs down" />
		{/if}
		Provide additional feedback
	</section>
	<section class="feedback-dialog__body">
		<textarea
			class="feedback-dialog__body-comment"
			bind:value={feedback.comment}
			placeholder="What would the ideal answer have been?"
		/>
		{#if feedback?.rating === FEEDBACK_KEYS['THUMBS_DOWN']}
			<div class="feedback-dialog__body-tags">
				<CheckBox bind:group={feedback.reasons} options={tags} />
			</div>
		{/if}
	</section>
	<section class="feedback-dialog__footer">
		<div class="feedback-dialog__footer-action">
			<Button type="primary" on:click={close}>Submit Feedback</Button>
		</div>
	</section>
</section>

<style src="./style.scss"></style>
