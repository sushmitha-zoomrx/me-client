<script>
	import { getContext } from 'svelte';
	import FeedbackDialog from '@components/Feedback/FeedbackDialog/FeedbackDialog.svelte';
	import like from '../../../assets/svg/like.svg';
	import dislike from '../../../assets/svg/dislike.svg';
	import { FEEDBACK_KEYS } from '@utils/constants';

	const { open } = getContext('conversation-feedback-model');

	export let conversation;
	export let submitFeedback;
	export let conversationIndex;

	let feedback = {};

	function getFeedback(value) {
		feedback = { rating: value };
		open(
			FeedbackDialog,
			{
				feedback: feedback,
			},
			{
				closeButton: false,
				classContent: 'feedback-modal-content',
				classWindow: 'feedback-modal-window',
			},
			{
				onClose: onSubmitFeedback,
			}
		);
	}

	async function onSubmitFeedback() {
		conversation = { ...conversation, feedback: feedback };
		submitFeedback(conversation, feedback, conversationIndex)
	}
</script>

<div class="conversation-feedback">
	{#if conversation?.feedback?.rating}
		{#if conversation.feedback.rating === FEEDBACK_KEYS['THUMBS_UP']}
			<img src={like} alt="like button" />
		{:else}
			<img src={dislike} alt="dislike button" />
		{/if}
	{:else}
		<button on:click={() => getFeedback(FEEDBACK_KEYS['THUMBS_UP'])}>
			<img src={like} alt="like button" />
		</button>
		<button on:click={() => getFeedback(FEEDBACK_KEYS['THUMBS_DOWN'])}>
			<img src={dislike} alt="dislike button" />
		</button>
	{/if}
</div>

<style src="./style.scss"></style>
