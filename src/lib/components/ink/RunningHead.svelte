<script lang="ts">
	// The vertical rotated folio pinned to a page edge (§4).
	let { text, side = 'right' }: { text: string; side?: 'left' | 'right' } = $props();
</script>

<div class="rail no-print" style={side === 'left' ? 'left:0' : 'right:0'} aria-hidden="true">
	<span>{text}</span>
</div>

<style>
	.rail {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 34px;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}
	span {
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--faint);
		writing-mode: vertical-rl;
		transform: rotate(180deg);
	}
	@media (max-width: 1100px) {
		.rail {
			display: none;
		}
	}
</style>
