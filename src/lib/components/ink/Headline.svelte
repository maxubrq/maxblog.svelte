<script lang="ts">
	// The page title — one size (`--t-title`, 32px on a phone), set in Display,
	// in the case it was written in. DESIGN.md §3.2: colour and hand-drawn marks
	// are signals, and a title is not one, so neither lives here any more.
	let {
		text,
		as = 'h1'
	}: {
		text: string;
		as?: 'h1' | 'h2' | 'h3';
	} = $props();
</script>

<svelte:element this={as} class="headline">{text}</svelte:element>

<style>
	.headline {
		font-family: var(--display);
		font-weight: 700;
		font-size: var(--t-title);
		line-height: 1.1;
		margin: 0;
		text-wrap: balance;
	}
	@media (max-width: 780px) {
		.headline {
			font-size: 32px;
		}
	}
</style>
