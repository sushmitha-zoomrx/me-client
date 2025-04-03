<script>
	import { delay } from "@utils/utility";
	import botLogo from "../../../assets/svg/bot.svg";
	import userLogo from "../../../assets/svg/user.svg";

	export let conversations;
	export let isSearchInprogress = false;
	export let profileColor;
	export let scrollToBottom = async () => {};

	let position = 0;
	let answerText = "";
	let splittedText = [];
	let isRendering = false;

	$: conversation = conversations[position];
	$: {
		isSearchInprogress = isRendering;
	}
	$: if (conversation?.response?.answer && !isRendering) {
		renderAnswer();
	}

	async function renderAnswer() {
		if (conversation.isRenderingComplete) {
			answerText = conversation?.response?.answer || "";
			return;
		}

		// Store the full HTML answer
		const fullAnswer = conversation?.response?.answer || "";

		// Start with empty text and gradually reveal the content
		answerText = "";
		isRendering = true;
		await animateHtmlTyping(fullAnswer);
	}

	async function animateHtmlTyping(fullContent) {
		// Gradually reveal the content in chunks to preserve HTML structure
		const chunkSize = 10; // Characters per chunk
		let currentLength = 0;

		while (currentLength < fullContent.length) {
			// Increase the revealed portion of text
			currentLength = Math.min(currentLength + chunkSize, fullContent.length);
			answerText = fullContent.substring(0, currentLength);

			// Wait a bit between chunks
			await delay(Math.floor(Math.random() * 50 + 30));
			await scrollToBottom();
		}

		await delay(Math.floor(Math.random() * 500 + 200));
		conversation.isRenderingComplete = true;
		isRendering = false;
		await scrollToBottom();
	}
</script>

<section class="conversation">
	<section class="conversation__question">
		<div class="question">
			<div class="question__profile">
				<img src={userLogo} alt="User logo" />
			</div>
			<div class="question__container">
				{conversation.question}
			</div>
		</div>
	</section>
	<section class="conversation__response">
		<div class="conversation__response-inner">
			<div class="conversation__response-profile">
				<img src={botLogo} alt="Bot logo" />
			</div>
			<div class="textbox">
				{#if conversation.response}
					<section class="conversation__response-result">
						{@html answerText}
						{#if !conversation.isRenderingComplete}
							<span class="blinker">▋</span>
						{/if}
					</section>
				{:else if conversation.error}
					<section class="error">
						Error processing your request. Please try again later.
					</section>
				{:else}
					<span class="blinker blinker--initial">▋</span>
				{/if}
			</div>
		</div>
	</section>
</section>

<style src="./style.scss"></style>
