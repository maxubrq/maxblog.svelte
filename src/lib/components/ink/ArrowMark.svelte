<script lang="ts">
	// A curved hand-drawn arrow pointing from a CTA to its target (§5).
	let {
		w = 150,
		dir = 'right',
		left = 0,
		top = 0
	}: { w?: number; dir?: 'right' | 'down' | 'left' | 'up'; left?: number; top?: number } = $props();

	const rot = $derived({ right: 0, down: 90, left: 180, up: 270 }[dir]);
</script>

<svg
	viewBox="0 0 160 80"
	width={w}
	height={(w * 80) / 160}
	fill="none"
	aria-hidden="true"
	style="left:{left}px; top:{top}px; transform: rotate({rot}deg)"
>
	<path d="M6 30 C50 10 96 12 138 40" stroke="var(--blue)" stroke-width="2.6" stroke-linecap="round" />
	<path
		d="M118 22 L142 42 L112 52"
		stroke="var(--blue)"
		stroke-width="2.6"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>

<style>
	svg {
		position: absolute;
		pointer-events: none;
		overflow: visible;
	}
</style>
