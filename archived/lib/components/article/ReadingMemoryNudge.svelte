<script lang="ts">
	/**
	 * "You were here" — the one interruption this site allows itself, shown at
	 * the head of an essay you have already started.
	 *
	 * A solid blue band, a sentence naming the place, a way back, and a way to
	 * make it go away. It is dismissed per *session*, not for good: a reader who
	 * closes it has dealt with it for this visit, and one who returns tomorrow
	 * still deserves to be told where they stopped.
	 *
	 * Ported from the production `ReadingMemoryNudge.tsx`.
	 */
	import { useI18n } from '$lib/i18n';
	import { readEntry, type ReadingEntry } from '$lib/reading-memory';

	let { slug }: { slug: string } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t.readingMemory);

	/**
	 * Higher than the store's own floor: 3% is enough to *remember*, but a band
	 * across the top of the page has to earn its place, and "you read two
	 * paragraphs" does not.
	 */
	const MIN_PCT = 0.05;

	let entry = $state<ReadingEntry | null>(null);
	let dismissed = $state(false);

	const dismissKey = $derived(`mem_dismissed_${slug}`);

	$effect(() => {
		try {
			if (sessionStorage.getItem(dismissKey)) {
				dismissed = true;
				return;
			}
		} catch {
			// No session storage: the band shows, and closing it works for as long
			// as the page is open. That is the same promise, kept less durably.
		}
		const stored = readEntry(slug);
		if (stored && !stored.finished && stored.pct > MIN_PCT) entry = stored;
	});

	function dismiss() {
		dismissed = true;
		try {
			sessionStorage.setItem(dismissKey, '1');
		} catch {
			// See above.
		}
	}

	// "§ II · a first model — about 3 minutes from the end". Both halves are
	// optional: an essay with no headings still knows how far in you were.
	const place = $derived(
		entry?.sectionNum
			? `§ ${entry.sectionNum}${entry.sectionTitle ? ` · ${entry.sectionTitle}` : ''}`
			: ''
	);
	const remaining = $derived.by(() => {
		if (!entry || entry.minLeft <= 0) return '';
		const unit = entry.minLeft === 1 ? t.minute : t.minutes;
		const tail = t.fromEnd ? ` ${t.fromEnd}` : '';
		return `${place ? ' — ' : ''}${t.about} ${entry.minLeft} ${unit}${tail}`;
	});
</script>

{#if entry && !dismissed}
	<section class="nudge">
		<div class="said">
			<span class="label">{t.youWereHere}</span>
			<span class="place">{place}{remaining}</span>
		</div>

		<div class="acts">
			{#if entry.sectionId}
				<a href="#{entry.sectionId}">{t.resumeReading}</a>
			{/if}
			<button onclick={dismiss} aria-label={t.dismiss}>✕</button>
		</div>
	</section>
{/if}

<style>
	.nudge {
		margin: 8px 0 30px;
		/* The one place a solid blue field carries running text — it is an
		   interruption, and it should look like one. */
		background: var(--panel-blue);
		color: var(--on-blue);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 18px;
		flex-wrap: wrap;
		padding: 13px 22px;
		animation: nudge-in 0.5s ease;
	}

	.said {
		display: flex;
		align-items: baseline;
		gap: 14px;
		flex-wrap: wrap;
		min-width: 0;
	}
	.label {
		font-family: var(--mono);
		font-size: 10.5px;
		font-weight: 500;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.7);
		line-height: 1;
		white-space: nowrap;
	}
	.place {
		font-family: var(--display);
		font-weight: 500;
		font-size: 16px;
		line-height: 1.25;
		letter-spacing: -0.01em;
	}

	.acts {
		display: flex;
		align-items: center;
		gap: 16px;
	}
	.acts a {
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--on-blue);
		text-decoration: none;
		border-bottom: 2px solid var(--on-blue);
		padding-bottom: 2px;
		white-space: nowrap;
	}
	.acts a:hover {
		text-decoration: none;
	}
	.acts button {
		background: transparent;
		border: none;
		cursor: pointer;
		color: rgba(255, 255, 255, 0.7);
		font-family: var(--mono);
		font-size: 13px;
		line-height: 1;
		padding: 4px;
	}
	.acts button:hover {
		color: var(--on-blue);
	}

	@keyframes nudge-in {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.nudge {
			animation: none;
		}
	}

	/* A band telling you where you stopped has no business on paper. */
	@media print {
		.nudge {
			display: none;
		}
	}
</style>
