<script>
	import sunLogo from "../../../assets/svg/sun.svg";
	import zapLogo from "../../../assets/svg/zap.svg";

	export let questionSearch;
	const LANDING_TEMPLATE = [
		{
			logo: sunLogo,
			name: "Examples",
			clickable: true,
			content: [
				"What is the message effectiveness of '72% of treatment-resistant hypertension patients achieved target BP with [Product] in 8 weeks in [CT Acronym] trial'?",
				"Score the message '[Product]: Once-daily 45mg oral tablet, no dose adjustment needed for mild-moderate hepatic impairment'",
				"Predict the scores of '[Product] Support Program offers eligible patients financial assistance, nurse navigators, and educational resources'",
			],
		},
		{
			logo: zapLogo,
			name: "Capabilities",
			clickable: false,
			content: [
				"Predicts Message score using ZoomRx Message Benchmarks",
				"Provides feedback on given message to improve the effectiveness"
			],
		},
	];
</script>

<div class="landing">
	{#each LANDING_TEMPLATE as template}
		<div class="landing__container">
			<div class="landing__header">
				<span class="landing__logo">
					<img src={template.logo} alt={template.name} />
				</span>
				{template.name}
			</div>
			{#each template.content as text}
				<button
					class="landing__text"
					class:landing__text--clickable={template.clickable}
					on:click={() => {
						if (template.clickable) {
							questionSearch = text;
						}
					}}
				>
					{text}{template.clickable ? " →" : ""}
				</button>
			{/each}
		</div>
	{/each}
</div>

<style src="./style.scss"></style>
