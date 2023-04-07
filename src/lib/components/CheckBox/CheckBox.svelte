<script>
	export let group = [];
	export let options = [];
</script>

<div class="checkbox__list">
	{#each options as option}
		<label class="checkbox">
			<input
				type="checkbox"
				bind:group
				value={option.id || option.name}
				class="checkbox__input"
			/>
			<span class="checkbox__button" />
			<span class="checkbox__label">{option.name}</span>
		</label>
	{/each}
</div>

<style src="./style.scss">
</style>
