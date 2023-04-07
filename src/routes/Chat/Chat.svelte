<script>
	import { post } from "@utils/api";
	import { get } from "svelte/store";
	import { email } from "@stores/auth.store";
	import SearchBar from "@components/SearchBar/SearchBar.svelte";
	import Conversation from "./Conversation/Conversation.svelte";
	import { onMount, onDestroy, tick } from "svelte";
	import { v4 as uuidv4 } from "uuid";
	import pptxgen from "pptxgenjs";
	import arrowDown from "../../assets/svg/arrow-down.svg";
	import LandingPage from "./LandingPage/LandingPage.svelte";
	import {
		CUSTOM_QUESTIONS,
		EXPORT_TABLE_AS_PPT_QUESTION,
	} from "@utils/constants";

	let questionSearch = "";
	let conversations = [];
	let isSearchInprogress = false;
	let showScrollToBottom = true;
	const profileConversationColor =
		"hsl(" + Math.random() * 360 + ", 100%, 30%)";
	const mediaQuery = window.matchMedia("(min-width: 768px)");
	let chatContainer;
	let previousScroll = 0;
	let hideScrollBtnTimer;
	let isMobileView = false;

	onMount(async () => {
		await scrollChatContainerToBottom();
		handleTabletChange(mediaQuery);
		chatContainer.addEventListener("scroll", toggleShowScrollToBottom);
		mediaQuery.addEventListener("change", handleTabletChange);
	});
	onDestroy(() => {
		chatContainer.removeEventListener("scroll", toggleShowScrollToBottom);
		mediaQuery.removeEventListener("change", handleTabletChange);
	});
	function handleTabletChange(e) {
		isMobileView = !e.matches;
	}
	function toggleShowScrollToBottom() {
		showScrollToBottom = chatContainer.scrollTop > previousScroll;
		previousScroll = chatContainer.scrollTop;
		if (showScrollToBottom) {
			clearTimeout(hideScrollBtnTimer);
			hideScrollBtnTimer = setTimeout(() => {
				showScrollToBottom = false;
			}, 5000);
		}
	}
	async function scrollChatContainerToBottom() {
		await tick();
		chatContainer.scrollTop = chatContainer.scrollHeight;
	}
	async function getResponseFromServer(question, index) {
		console.log("About to hit server as :");
		console.log(get(email));
		const { responseData } = await post("/messages", {
			question: question,
			email: get(email),
		});
		const tableIds = [];
		console.log("Response received");
		console.log(responseData);
		responseData.answer = responseData.data.replaceAll(
			/<table>/g,
			function () {
				const tableId = `table-${uuidv4()}`;
				tableIds.push(tableId);
				return `<table id="${tableId}">`;
			}
		);
		if (tableIds.length) {
			conversations[index][conversations[index].length - 1].tableIds =
				tableIds;
		}
		conversations[index][conversations[index].length - 1].response =
			responseData;
		conversations[index][
			conversations[index].length - 1
		].isRenderingComplete = true;
		isSearchInprogress = false;
	}
	async function getCustomResponse(question, index) {
		if (question.toLowerCase().trim() === EXPORT_TABLE_AS_PPT_QUESTION) {
			await exportHtmlTableAsPPT(index);
		}
	}
	async function exportHtmlTableAsPPT(index) {
		const lastConversation =
			conversations[index - 1][conversations[index - 1].length - 1];
		if (!lastConversation.tableIds || index < 1) {
			conversations[index][conversations[index].length - 1].response = {
				answer: "No tables found in the previous response.",
			};
			return;
		}
		let pptx = new pptxgen();
		lastConversation.tableIds.forEach((tableId) => {
			pptx.tableToSlides(tableId);
		});
		await pptx.writeFile({ fileName: "presentation.pptx" });
		conversations[index][conversations[index].length - 1].response = {
			answer: "Previous response tables are downloaded as PPT.",
		};
	}
	async function generateResponse(question, index = conversations.length) {
		questionSearch = "";
		if (question === "") {
			return;
		}
		/**
		 * if default index then its a new response
		 * else its a re-generated response for same question then
		 * remaining conversations are removed
		 */
		if (index === conversations.length) {
			conversations.push([{ question }]);
		}
		conversations = conversations.slice(0, index + 1);
		await scrollChatContainerToBottom();
		isSearchInprogress = true;
		try {
			if (CUSTOM_QUESTIONS.includes(question.toLowerCase().trim())) {
				await getCustomResponse(question, index);
			} else {
				await getResponseFromServer(question, index);
			}
		} catch (error) {
			conversations[index][conversations[index].length - 1].error = true;
			isSearchInprogress = false;
		} finally {
			conversations = conversations;
			await scrollChatContainerToBottom();
		}
	}
</script>

<main class="chat">
	<header class="chat__header">Messages Effectiveness Score Predictor</header>
	<section class="chat__outer">
		<section class="chat__inner">
			<section class="chat__container" bind:this={chatContainer}>
				{#if conversations.length === 0}
					<LandingPage bind:questionSearch />
				{:else}
					{#each conversations as conversation, i (conversation)}
						<Conversation
							bind:isSearchInprogress
							profileColor={profileConversationColor}
							conversations={conversation}
							scrollToBottom={scrollChatContainerToBottom}
						/>
					{/each}
				{/if}
			</section>
			<footer class="chat__footer">
				<section class="chat__search-bar">
					{#if conversations.length > 2 && showScrollToBottom}
						<button
							class="scroll-to-bottom"
							on:click={scrollChatContainerToBottom}
						>
							<img src={arrowDown} alt="scroll to bottom" />
						</button>
					{/if}
					<SearchBar
						focusOnLoad={true}
						bind:value={questionSearch}
						disableSearchBtn={isSearchInprogress}
						onClickHandler={() => generateResponse(questionSearch)}
					/>
				</section>
				<div class="chat__footer-info">
					To improve its performance, use precise messages with data &
					qualifiers as relevant.
					<a
						href="https://learnmore.zoomrx.com/pet-registration"
						color="#141414"
					>
						Read more>>
					</a>
				</div>
				<div class="chat__footer-info">
					This is a Beta version of the product. Our goal is to help
					build AI systems that could aid in Pharma promotions. Please
					let us know your feedback at
					<a href="https://info@zoomrx.com" color="#141414">
						info@zoomrx.com
					</a>
				</div>
			</footer>
		</section>
	</section>
</main>

<style src="./style.scss"></style>
