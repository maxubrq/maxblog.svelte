<script lang="ts">
	/**
	 * The time machine: every edit as a tick, the saved ones as a taller tick you
	 * can stand on.
	 *
	 * The ticks matter. A rail with only six stops would say the piece was
	 * written in six moves; the short ticks between them are the edits nobody
	 * saved a note for, and printing them is the difference between a version
	 * list and an honest account of how much the thing was handled.
	 *
	 * Keyboard: the buttons are real buttons in document order, so tabbing walks
	 * the history oldest to newest and ← → move between neighbours.
	 */
	import { useI18n } from '$lib/i18n';
	import type { DraftHistory } from '$lib/drafts';

	let {
		history,
		index,
		onpick
	}: { history: DraftHistory; index: number; onpick: (i: number) => void } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t.openDraft);

	const current = $derived(history.revisions[index]);
	/** Percent along the rail. One edit total would divide by zero. */
	const at = (n: number) => (history.edits < 2 ? 100 : ((n - 1) / (history.edits - 1)) * 100);
	const saved = $derived(new Set(history.revisions.map((r) => r.n)));

	const ticks = $derived(Array.from({ length: history.edits }, (_, i) => i + 1));

	/** ← → walk the saves. On the buttons themselves rather than on the group:
	 *  they are what the reader focuses, and a listener on the wrapper would be
	 *  a keyboard handler on something nothing can reach. */
	function onkeydown(event: KeyboardEvent) {
		const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
		if (!step) return;
		const next = index + step;
		if (next < 0 || next >= history.revisions.length) return;
		event.preventDefault();
		onpick(next);
	}
</script>

<div class="rail" role="group" aria-label={t.pull}>
	<div class="ticks">
		{#each ticks as n (n)}
			<span
				class="tick"
				class:saved={saved.has(n)}
				class:passed={n <= current.n}
				style:left="{at(n)}%"
				aria-hidden="true"
			></span>
		{/each}
		<span class="line" aria-hidden="true"></span>
		<span class="line done" style:width="{at(current.n)}%" aria-hidden="true"></span>
		<span class="cursor" style:left="{at(current.n)}%" aria-hidden="true"></span>
	</div>

	<div class="stops">
		{#each history.revisions as rev, i (rev.r)}
			<button
				class="stop"
				class:on={i === index}
				class:last={i === history.revisions.length - 1}
				class:first={i === 0}
				style:left="{at(rev.n)}%"
				aria-current={i === index ? 'true' : undefined}
				onclick={() => onpick(i)}
				{onkeydown}
			>
				{i === history.revisions.length - 1 ? t.now : rev.r}
			</button>
		{/each}
	</div>
</div>

<style>
	.rail {
		position: relative;
		padding-top: 26px;
	}
	.ticks {
		position: relative;
		height: 30px;
	}
	.tick {
		position: absolute;
		top: 12px;
		width: 1.5px;
		height: 8px;
		margin-left: -0.75px;
		background: var(--rule);
		transition: background 0.2s;
	}
	.tick.saved {
		top: 6px;
		height: 18px;
	}
	.tick.passed {
		background: var(--blue);
	}
	.line {
		position: absolute;
		left: 0;
		right: 0;
		top: 24px;
		height: 1.5px;
		background: var(--rule);
	}
	.line.done {
		right: auto;
		background: var(--blue);
		transition: width 0.22s;
	}
	.cursor {
		position: absolute;
		top: 20px;
		width: 9px;
		height: 9px;
		margin-left: -4.5px;
		background: var(--blue);
		transition: left 0.22s;
	}

	.stops {
		position: relative;
		height: 34px;
	}
	.stop {
		position: absolute;
		top: 0;
		transform: translateX(-50%);
		padding: 4px 6px;
		border: none;
		background: transparent;
		cursor: pointer;
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--faint);
		white-space: nowrap;
	}
	/* The two ends pull inside the rail rather than off the page. */
	.stop.first {
		transform: none;
	}
	.stop.last {
		transform: translateX(-100%);
	}
	.stop:hover {
		color: var(--blue);
	}
	.stop.on {
		color: var(--blue);
		font-weight: 500;
	}

	@media (prefers-reduced-motion: reduce) {
		.line.done,
		.cursor,
		.tick {
			transition: none;
		}
	}
</style>
