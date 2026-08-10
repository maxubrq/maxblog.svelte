<script lang="ts">
	// Hand-drawn wobble underline under an accented word (§5).
	let {
		w = 300,
		left = 0,
		bottom = -10
	}: { w?: number; left?: number; bottom?: number } = $props();
</script>

<svg
	viewBox="0 0 300 22"
	width={w}
	height={(w * 22) / 300}
	fill="none"
	aria-hidden="true"
	style="left:{left}px; bottom:{bottom}px"
>
	<path
		d="M4 14 C70 6 150 4 232 8 C260 9 284 11 296 15 C282 13 250 12 214 13"
		stroke="var(--blue)"
		stroke-width="3"
		stroke-linecap="round"
	/>
</svg>

<style>
	svg {
		position: absolute;
		pointer-events: none;
		overflow: visible;
	}
</style>
