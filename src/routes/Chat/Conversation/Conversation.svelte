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
		splittedText = conversation?.response?.answer?.split(" ") ?? [];
		if (splittedText.length) {
			isRendering = true;
			await typeWriter();
		} else {
			isRendering = false;
		}
	}
	async function typeWriter(start = 0) {
		const randomSplitValue = Math.floor(Math.random() * 7 + 5) + start;
		const textToRender = splittedText
			.slice(start, randomSplitValue)
			.join(" ");
		start = randomSplitValue;
		if (textToRender) {
			answerText = answerText + " " + textToRender;
			await delay(Math.floor(Math.random() * 1000 + 500));
		}
		if (start <= splittedText.length) {
			await scrollToBottom();
			await typeWriter(start);
		} else {
			await delay(Math.floor(Math.random() * 1000 + 500));
			conversation.isRenderingComplete = true;
			isRendering = false;
			await scrollToBottom();
		}
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
			<div class="dataframe">
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
