<script lang="ts">
	/**
	 * The essays you are in the middle of, at the head of the home page.
	 *
	 * It renders nothing at all when there is nothing to resume, which is the
	 * normal case and the whole reason it can sit above the masthead's own
	 * business: a returning reader is shown their place first, a new one is
	 * shown the site.
	 *
	 * Ported from the production `PickUpWhereYouLeftOff.tsx`, minus its
	 * "see your sky ✦" link — that goes to `/constellation`, a room this edition
	 * has not built.
	 */
	import Tag from '$lib/components/ink/Tag.svelte';
	import { href, useI18n } from '$lib/i18n';
	import {
		clearMemory,
		entryLang,
		inProgress,
		lastSeen,
		type ReadingEntry
	} from '$lib/reading-memory';

	const i18n = useI18n();
	const t = $derived(i18n.t.readingMemory);

	// Empty until the client has read localStorage, so the prerendered HTML and
	// the first render agree: the server cannot know what this device remembers.
	let entries = $state<ReadingEntry[]>([]);

	$effect(() => {
		entries = inProgress();
	});

	function forget() {
		clearMemory();
		entries = [];
	}

	// The essay's locale, not the reader's: a Vietnamese reader resuming an
	// English essay has to land on its /en URL, because that is the only one
	// that exists.
	const link = (entry: ReadingEntry) =>
		href(entryLang(entry, i18n.lang), `/writing/${entry.slug}`) +
		(entry.sectionId ? `#${entry.sectionId}` : '');
</script>

{#if entries.length > 0}
	<section>
		<div class="head">
			<div>
				<Tag on>● {t.whereYouWereLabel}</Tag>
				<h2>{t.pickUpTitle}</h2>
			</div>
			<button onclick={forget}>{t.clearMemory} →</button>
		</div>

		<ul>
			{#each entries as entry (entry.slug)}
				<li>
					<a href={link(entry)}>
						<Tag>{entry.topic}</Tag>

						<span class="what">
							<span class="title">{entry.title}</span>
							{#if entry.sectionNum}
								<span class="where">
									§ {entry.sectionNum}{entry.sectionTitle ? ` · ${entry.sectionTitle}` : ''} ·
									{entry.minLeft}
									{t.minLeftShort}
								</span>
							{/if}
						</span>

						<span class="how-far">
							<span class="bar">
								<span class="track">
									<span class="fill" style="width:{Math.round(entry.pct * 100)}%"></span>
								</span>
								<span class="pct">{Math.round(entry.pct * 100)}%</span>
							</span>
							<span class="when">{lastSeen(entry.lastSeenTs, t, i18n.lang)}</span>
						</span>

						<span class="resume">{t.resumeShort}</span>
					</a>
				</li>
			{/each}
		</ul>
	</section>
{/if}

<style>
	section {
		border-bottom: 1.5px solid var(--rule-hard);
	}

	.head {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 20px;
		padding: 30px var(--pad-chrome) 16px;
	}
	h2 {
		margin: 10px 0 0;
		font-family: var(--display);
		font-weight: 700;
		font-size: 26px;
		line-height: 1;
		letter-spacing: -0.03em;
		text-transform: lowercase;
		color: var(--ink);
	}
	.head button {
		background: transparent;
		border: none;
		cursor: pointer;
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
		padding: 0;
		line-height: 1;
		white-space: nowrap;
	}
	.head button:hover {
		color: var(--blue);
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0 var(--pad-chrome) 26px;
	}
	li a {
		display: grid;
		grid-template-columns: 118px 1fr 170px auto;
		gap: 20px;
		align-items: center;
		padding: 16px 0;
		border-top: 1px solid var(--rule);
		text-decoration: none;
		color: var(--ink);
	}
	li a:hover {
		text-decoration: none;
	}
	li a:hover .title {
		color: var(--blue);
	}

	.what {
		min-width: 0;
	}
	.title {
		display: block;
		font-family: var(--display);
		font-size: 20px;
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1.15;
	}
	.where {
		display: block;
		font-family: var(--mono);
		font-size: 10.5px;
		color: var(--muted);
		margin-top: 4px;
		letter-spacing: 0.02em;
	}

	/* A hairline track with a blue fill — the one meter on the site that prints
	   a percentage, because here the number *is* the point: it is the reader's
	   own progress, asked for, not a score pushed at them mid-essay. */
	.bar {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.track {
		flex: 1;
		height: 4px;
		background: var(--rule);
	}
	.fill {
		display: block;
		height: 100%;
		background: var(--blue);
	}
	.pct {
		font-family: var(--mono);
		font-size: 11px;
		color: var(--blue);
		font-variant-numeric: tabular-nums;
	}
	.when {
		display: block;
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.04em;
		color: var(--faint);
		margin-top: 6px;
	}

	.resume {
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--blue);
		white-space: nowrap;
	}

	@media (max-width: 860px) {
		/* The meter is the first thing to go: the section line already says how
		   far in you were, in the units a reader actually thinks in. */
		li a {
			grid-template-columns: 1fr auto;
			gap: 10px 16px;
		}
		.what {
			grid-column: 1;
		}
		.how-far {
			display: none;
		}
	}
</style>
