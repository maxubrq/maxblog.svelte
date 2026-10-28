<script lang="ts">
	/**
	 * "Read on" — the essay you are in the middle of, as one line above the
	 * list (DESIGN.md §7.1). Renders nothing when there is nothing to resume,
	 * which is every first visit.
	 *
	 * The most recent essay only, and a percentage rather than minutes: a short
	 * essay at 72% rounds to "0 min left", which is a number that lies.
	 */
	import { href, useI18n } from '$lib/i18n';
	import { entryLang, inProgress, type ReadingEntry } from '$lib/reading-memory';

	const i18n = useI18n();
	const t = $derived(i18n.t.readingMemory);

	// Empty until the client has read localStorage, so the prerendered HTML and
	// the first render agree: the server cannot know what this device remembers.
	let entry = $state<ReadingEntry | null>(null);

	$effect(() => {
		entry = inProgress()[0] ?? null;
	});

	// The essay's locale, not the reader's: an English essay only exists at /en.
	const link = (e: ReadingEntry) =>
		href(entryLang(e, i18n.lang), `/writing/${e.slug}`) + (e.sectionId ? `#${e.sectionId}` : '');
</script>

{#if entry}
	<a class="line" href={link(entry)}>
		<span class="label">{t.readOn}</span>
		<span class="title">{entry.title}</span>
		<span class="pct">{Math.round(entry.pct * 100)}% →</span>
	</a>
{/if}

<style>
	.line {
		display: flex;
		align-items: baseline;
		gap: var(--s-2);
		padding: var(--s-2) 0;
		border-bottom: 1px solid var(--rule);
		color: var(--ink);
		text-decoration: none;
	}
	.line:hover {
		text-decoration: none;
	}
	.line:hover .title {
		color: var(--blue);
	}
	.label,
	.pct {
		font-size: var(--t-meta);
		color: var(--blue);
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
	}
	.title {
		flex: 1;
		min-width: 0;
		font-weight: 600;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
