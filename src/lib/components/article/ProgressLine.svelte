<script lang="ts">
	/**
	 * How far through the essay you are: a 2px blue line across the top of the
	 * screen (DESIGN.md §6.4). The one progress instrument on the page — it
	 * replaces the fore-edge, the running head's folio and the "N min left".
	 */
	let { progress }: { progress: number } = $props();
</script>

<div
	class="line"
	role="progressbar"
	aria-hidden="true"
	style="transform: scaleX({Math.min(1, Math.max(0, progress))})"
></div>

<style>
	.line {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: var(--blue);
		transform-origin: 0 50%;
		z-index: 60;
		pointer-events: none;
	}
	@media print {
		.line {
			display: none;
		}
	}
</style>
