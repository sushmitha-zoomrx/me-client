<script>
	import { spinner } from './Spinner';
</script>

{#if $spinner}
	<div class="spinner overlay">
		<div class="spinner__inner">
			<div class="uil-ring-css" style="transform:scale(0.34);">
				<div />
			</div>
		</div>
	</div>
{/if}

<style src="./style.scss"></style>
