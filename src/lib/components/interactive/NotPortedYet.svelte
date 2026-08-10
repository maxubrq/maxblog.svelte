<script lang="ts">
	// A live figure that exists in the production (React) blog and has not been
	// rewritten in Svelte yet. Keeps the article whole and says so plainly,
	// instead of pretending the figure is there.
	import DiagramPlate from '../tech/DiagramPlate.svelte';

	let { name, hint = 'not ported yet' }: { name: string; hint?: string } = $props();
</script>

<DiagramPlate label="Live figure" {hint} live>
	<div class="ink-hatch stub">
		<span>{name} — to be rewritten in svelte</span>
	</div>
</DiagramPlate>

<style>
	.stub {
		height: 210px;
		position: relative;
		opacity: 0.5;
	}
	.stub span {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--blue);
		background: color-mix(in srgb, var(--paper) 72%, transparent);
	}
</style>
