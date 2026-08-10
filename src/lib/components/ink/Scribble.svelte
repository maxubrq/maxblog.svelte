<script lang="ts">
	// A rough ~1.2-loop ellipse lassoing one word (§5). Never more than one per headline.
	let { w = 360, h = 130, left = 0, top = 0 }: { w?: number; h?: number; left?: number; top?: number } =
		$props();
</script>

<svg
	viewBox="0 0 360 130"
	width={w}
	height={h}
	fill="none"
	aria-hidden="true"
	style="left:{left}px; top:{top}px"
>
	<path
		d="M52 74 C40 40 118 22 196 24 C286 26 342 44 340 72 C338 100 250 116 158 112 C74 108 22 96 30 62 C36 38 108 26 190 28 C264 30 320 42 326 62"
		stroke="var(--blue)"
		stroke-width="2.4"
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
