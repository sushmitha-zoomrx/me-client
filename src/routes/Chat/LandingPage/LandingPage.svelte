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
				"Create 5 messages for Trelegy talking about once daily dosing",
				"Create 5 messages about Opdivo for mDOR of 24.5 months among responders",
				'Predict the score of "Our goal is to help make AMJEVITA onboarding seamless"',
			],
		},
		{
			logo: zapLogo,
			name: "Capabilities",
			clickable: false,
			content: [
				"Predicts Message score using ZoomRx Message Benchmarks",
				"Creates Messages using GPT",
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
