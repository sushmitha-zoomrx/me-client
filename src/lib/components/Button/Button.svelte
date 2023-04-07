<script>
	export let type = 'primary';
	export let disabled = false;
	export let className = '';
</script>

<button class="btn btn__{type} {className}" class:disabled {disabled} on:click>
	<slot />
</button>

<style src="./style.scss">
</style>
