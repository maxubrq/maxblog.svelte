<script lang="ts">
	/**
	 * The bookmark: a blue dot in the margin at the exact section where the
	 * reader stopped, with a hard blue rule across the head of that section.
	 *
	 * The nudge at the top of the page *tells* you where you were; this shows
	 * you, in the place itself, so that scrolling past it is a small recognition
	 * rather than a fact you have to hold in your head.
	 *
	 * Ported from the production `ReadingMemoryGutter.tsx`. It measures against
	 * this edition's column and marks the heading by class rather than by
	 * writing inline styles onto an element it does not own.
	 */
	import { useI18n } from '$lib/i18n';
	import { lastSeen, readEntry } from '$lib/reading-memory';

	let { slug }: { slug: string } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t.readingMemory);

	/** The dot sits a little below the heading's own top rule. */
	const DROP = 32;

	let top = $state<number | null>(null);
	let seenAt = $state('');

	$effect(() => {
		const entry = readEntry(slug);
		if (!entry || entry.finished || !entry.sectionId) return;

		const heading = document.getElementById(entry.sectionId);
		const column = document.querySelector<HTMLElement>('.measure');
		if (!heading || !column) return;

		const headingTop = heading.getBoundingClientRect().top + window.scrollY;
		const columnTop = column.getBoundingClientRect().top + window.scrollY;
		top = headingTop - columnTop + DROP;
		seenAt = lastSeen(entry.lastSeenTs, t, i18n.lang);

		// The heading is rendered from the post's markdown, so it is marked by
		// class and unmarked on the way out — nothing of ours stays behind in
		// someone else's element.
		heading.classList.add('memory-resume');
		return () => heading.classList.remove('memory-resume');
	});
</script>

{#if top !== null}
	<div class="mark" style="top:{top}px" aria-hidden="true" title={seenAt}>
		<span class="dot"></span>
		<span class="label">{t.lastHere}</span>
	</div>
{/if}

<style>
	.mark {
		position: absolute;
		left: -36px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		pointer-events: none;
		user-select: none;
	}
	/* The one round thing on the site, and it earns it: this is a pin stuck in a
	   page, not a rule drawn on one (§3 is about the furniture, not the marks). */
	.dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--blue);
		flex-shrink: 0;
	}
	.label {
		font-family: var(--mono);
		font-size: 9px;
		font-weight: 500;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--blue);
		writing-mode: vertical-rl;
		white-space: nowrap;
	}

	/* No room in the margin once the column has the screen to itself. */
	@media (max-width: 900px) {
		.mark {
			display: none;
		}
	}
	@media print {
		.mark {
			display: none;
		}
	}
</style>
