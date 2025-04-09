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
	import uploadIcon from "../../assets/svg/upload.svg"; // Import the upload icon
	import LandingPage from "./LandingPage/LandingPage.svelte";
	import {
		CUSTOM_QUESTIONS,
		EXPORT_TABLE_AS_PPT_QUESTION,
	} from "@utils/constants";

	let questionSearch = "";
	let conversations = [];
	let isSearchInprogress = false; // Flag for regular search
	let isCsvUploadInprogress = false; // New flag for CSV upload
	let showScrollToBottom = true;
	const profileConversationColor =
		"hsl(" + Math.random() * 360 + ", 100%, 30%)";
	const mediaQuery = window.matchMedia("(min-width: 768px)");
	let chatContainer;
	let previousScroll = 0;
	let hideScrollBtnTimer;
	let isMobileView = false;
	let showUploadInfo = false; // Add a flag to control the visibility of the upload info
	let csvUploadProgress = ""; // Add a variable to show upload progress

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
		const { responseData } = await post(
			"/messages",
			JSON.stringify({
				question: question,
				email: get(email),
			})
		);
		console.log("Response received");
		console.log(responseData);
		responseData.answer = responseData.data;
		conversations[index][conversations[index].length - 1].response =
			responseData;
		conversations[index][
			conversations[index].length - 1
		].isRenderingComplete = true;
	}

	async function generateResponse(question, index = conversations.length) {
		questionSearch = "";
		if (typeof question !== "string" || question.trim() === "") {
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
			const { responseData } = await post(
				"/messages",
				JSON.stringify({
					question: question,
					email: get(email),
				})
			);
			console.log("Response received");
			console.log(responseData);
			responseData.answer = responseData.data;
			conversations[index][conversations[index].length - 1].response =
				responseData;
			conversations[index][
				conversations[index].length - 1
			].isRenderingComplete = true;
		} catch (error) {
			conversations[index][conversations[index].length - 1].error = true;
			isSearchInprogress = false;
		} finally {
			conversations = conversations;
			await scrollChatContainerToBottom();
			isSearchInprogress = false;
		}
	}

	async function handleFileUpload(event) {
		const file = event.target.files[0];
		if (file) {
			const fileName = file.name;
			conversations.push([
				{ question: `Predict the scores for ${fileName}` },
			]); // Add user message
			const index = conversations.length - 1;
			conversations = conversations; // force update
			await scrollChatContainerToBottom();
			isCsvUploadInprogress = true;
			csvUploadProgress = ".";
			let progressInterval = setInterval(() => {
				csvUploadProgress += ".";
				conversations[
					index
				][0].question = `Predict the scores for ${fileName} ${csvUploadProgress}`;
				conversations = conversations; // force update
			}, 500);

			try {
				const formData = new FormData();
				formData.append("file", file, fileName);
				formData.append("email", get(email));
				const { responseData } = await post(
					"/messages/bulk",
					formData,
					{
						noFormat: true,
					}
				);

				if (responseData.success) {
					clearInterval(progressInterval); // Stop progress dots
					// Handle success (assuming the server returns processed messages)
					console.log("CSV uploaded and processed successfully");
					// Assuming responseData contains the processed CSV data
					if (responseData.processedCsvData) {
						downloadCsv(
							responseData.processedCsvData,
							"processed_data.csv"
						);
						isCsvUploadInprogress = false;
						responseData.answer =
							"The processed file is downloaded.";
						conversations[index][
							conversations[index].length - 1
						].response = responseData;
						conversations[index][
							conversations[index].length - 1
						].isRenderingComplete = true;
					} else {
						console.warn(
							"No processed CSV data received from the server."
						);
						isCsvUploadInprogress = false;
						conversations[index].push({
							response: {
								answer: "No processed CSV data received from the server. Please try again later or contact our support team.",
							},
						}); // Add system message
					}
				} else {
					clearInterval(progressInterval); // Stop progress dots
					// Handle error (e.g., display an error message)
					console.error("CSV upload failed:", responseData.error);
					conversations[index].push({
						error: true,
						response: {
							answer: `CSV upload failed: ${responseData.error}`,
						},
					}); // Add system message
				}
			} catch (error) {
				clearInterval(progressInterval); // Stop progress dots
				console.error("Error uploading CSV:", error);
				conversations[index].push({
					error: true,
					response: { answer: `Error uploading CSV: ${error}` },
				}); // Add system message
				// Handle network errors, etc.
			} finally {
				isCsvUploadInprogress = false; // Re-enable search bar
				csvUploadProgress = ""; // Clear progress dots
				conversations = conversations; // force update
				await scrollChatContainerToBottom();
			}
		}
	}

	function downloadCsv(csvData, filename) {
		const blob = new Blob([csvData], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.setAttribute("href", url);
		a.setAttribute("download", filename);
		a.style.display = "none";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
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
					<label for="csvUpload" class="csv-upload-button">
						<img src={uploadIcon} alt="Upload CSV" />
						<span class="csv-upload-info"
							>(Mandatory Column name: message)</span
						>
						<input
							type="file"
							id="csvUpload"
							accept=".csv"
							style="display: none"
							on:change={handleFileUpload}
						/>
					</label>
					<SearchBar
						focusOnLoad={true}
						bind:value={questionSearch}
						disableSearchBtn={isSearchInprogress ||
							isCsvUploadInprogress}
						onClickHandler={() => generateResponse(questionSearch)}
					/>
					{#if conversations.length > 2 && showScrollToBottom}
						<button
							class="scroll-to-bottom"
							on:click={scrollChatContainerToBottom}
						>
							<img src={arrowDown} alt="scroll to bottom" />
						</button>
					{/if}
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
