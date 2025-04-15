<script>
	import { onDestroy, onMount, tick } from "svelte";
	import sendIcon from "../../../assets/svg/send.svg";

	export let value = "";
	export let placeholder =
		"Type in the instruction for message generation/prediction...";
	export let disableSearchBtn = false;
	export let onClickHandler = () => {};
	export let focusOnLoad = false;
	export let use_llm = true;

	let searchBarElement;

	onMount(() => {
		if (focusOnLoad) {
			searchBarElement.focus();
		}
		searchBarElement.addEventListener("paste", onPasteHandler);
	});
	onDestroy(() => {
		searchBarElement.removeEventListener("paste", onPasteHandler);
	});

	async function onPasteHandler(e) {
		e.preventDefault();
		value = value + e.clipboardData.getData("text/plain");

		await tick();
		let selection = document.getSelection();
		let range = document.createRange();
		range.setStart(
			searchBarElement.childNodes[0],
			searchBarElement.innerText.length
		);
		range.collapse(true);
		selection.removeAllRanges();
		selection.addRange(range);
	}

	function toggleButton() {
		use_llm = !use_llm; // Toggle the external state only
	}
</script>

<section class="search-bar">
	<div class="search-bar__input-container">
		<span
			bind:this={searchBarElement}
			role="textbox"
			tabindex="0"
			contenteditable="true"
			data-ph={placeholder}
			class="search-bar__text"
			bind:textContent={value}
			on:keydown={(e) => {
				if (e.code === "Enter" && !e.shiftKey) {
					e.preventDefault();
					onClickHandler();
				} else if (e.code === "Enter" && e.shiftKey) {
					searchBarElement.value = searchBarElement.value + "\n";
					return false;
				}
			}}
		/>
		<button
			class="search-bar__send"
			on:click={onClickHandler}
			disabled={disableSearchBtn}
		>
			{#if !disableSearchBtn}
				<img class="search-bar__send-img" src={sendIcon} alt="search" />
			{:else}
				<div class="loading">
					<div class="loading__dot-typing" />
				</div>
			{/if}
		</button>
		<label class="toggle-switch" title="Enable Analysis">
			<input
				type="checkbox"
				bind:checked={use_llm}
				on:click={toggleButton}
			/>
			<span class="toggle-slider" />
		</label>
	</div>
</section>

<style src="./style.scss"></style>
