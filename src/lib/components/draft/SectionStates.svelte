<script lang="ts">
	/**
	 * Where each section of the piece stands — **state, never progress**.
	 *
	 * Three words and a filled or empty bar, because the honest thing an author
	 * can say about an unfinished section is what kind of thing it currently is,
	 * not what fraction of it exists. Nothing here computes a percentage, and
	 * the same rule the fore-edge follows applies: no number is ever printed.
	 *
	 * The table is read from the revision the reader is standing at, so
	 * travelling back changes the verdicts along with the prose.
	 */
	import { useI18n } from '$lib/i18n';
	import type { DraftSection } from '$lib/drafts';

	let { sections }: { sections: DraftSection[] } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t.openDraft);
	const word = $derived({ settled: t.settled, editing: t.editing, notes: t.notes });
</script>

<div class="table">
	{#each sections as section (section.label)}
		<div class="row" class:notes={section.state === 'notes'}>
			<span class="label">{section.label}</span>
			<span
				class="bar"
				class:ink-hatch={section.state === 'notes'}
				class:full={section.state === 'settled'}
				aria-hidden="true"
			></span>
			<span class="state">{word[section.state]}</span>
		</div>
	{/each}
</div>

<style>
	.table {
		border-bottom: 1px solid var(--rule);
	}
	.row {
		display: grid;
		grid-template-columns: 1fr 92px minmax(96px, auto);
		align-items: center;
		gap: 14px;
		border-top: 1px solid var(--rule);
		padding: 10px 0;
	}
	.label {
		font-family: var(--body);
		font-size: 15px;
		color: var(--ink);
	}
	.bar {
		height: 9px;
		border: 1.5px solid var(--blue);
		transition: background 0.2s;
	}
	.full {
		background: var(--blue);
	}
	.state {
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--blue);
	}

	/* A section that is still notes steps off the blue entirely: it is not a
	   lesser degree of written, it is a different thing. */
	.notes .label {
		color: var(--muted);
	}
	.notes .bar {
		border-color: var(--faint);
		opacity: 0.55;
	}
	.notes .state {
		color: var(--faint);
	}

	@media (max-width: 480px) {
		.row {
			grid-template-columns: 1fr auto;
			gap: 6px 12px;
		}
		.bar {
			grid-column: 1 / -1;
			order: 3;
		}
	}
</style>
