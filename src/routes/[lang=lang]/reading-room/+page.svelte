<script lang="ts">
	/**
	 * The reading room — everything you have made by reading, on one page.
	 *
	 * **Deliberately unlike production**, where this is a hub: six doors with
	 * counts printed on them, each leading to its own page. A door that only
	 * says how many things are behind it makes the reader click to find out what
	 * they are, and the room is the reader's own — there is nothing here to
	 * tease. So the rooms are sections, shown one after another, and the page is
	 * the whole of it. `/shelf` does not exist as a URL in this edition; the
	 * shelf is a section of this page.
	 *
	 * The room is empty on the server, on purpose: the catalogue arrives from
	 * the loader so a spine can carry a live title, but *which* pieces you
	 * finished is read out of your own device after mount. Nothing about a
	 * reader is ever rendered on a server, which is what lets the page stay
	 * prerendered static HTML like every other.
	 *
	 * The constellation is the next section to land here.
	 */
	import Headline from '$lib/components/ink/Headline.svelte';
	import Tag from '$lib/components/ink/Tag.svelte';
	import { href, useI18n } from '$lib/i18n';
	import { site } from '$lib/site';
	import { readShelf, toneOf, type Spine } from '$lib/shelf';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t);

	/**
	 * `null` until the device has been asked — which is not the same as "empty",
	 * and the difference is the whole of the empty state. Rendering "your shelf
	 * is still empty" during the first frame would tell a reader with a full
	 * shelf that they have read nothing.
	 */
	let spines = $state<Spine[] | null>(null);
	$effect(() => {
		spines = readShelf(data.sources);
	});

	const empty = $derived(spines !== null && spines.length === 0);
</script>

<svelte:head>
	<title>{t.readingRoom.titleLead} {t.readingRoom.titleAccent} — {site.name}</title>
	<meta name="description" content={t.readingRoom.description} />
</svelte:head>

<section class="masthead">
	<div class="row">
		<Tag on>{t.nav.readingRoom}</Tag>
		<Tag>{t.readingRoom.privateTag}</Tag>
	</div>
	<!-- An underline rather than the scribble, and not for variety. The scribble
	     is an ellipse of fixed proportions, so it only wraps an accent of about
	     the width it was tuned for; this headline's accent is "room." in one
	     locale and "đọc." in the other, and one geometry strikes through one of
	     them whichever way it is set. An underline hangs off the baseline, so a
	     width that is a little wrong over- or under-runs the word rather than
	     crossing it. -->
	<Headline
		text="{t.readingRoom.titleLead} {t.readingRoom.titleAccent}"
		accent={t.readingRoom.titleAccent}
		mark="underline"
		size={78}
		markWidth={200}
	/>
	<p class="deck">{t.readingRoom.description}</p>
</section>

<!-- ── The read shelf ──────────────────────────────────────────────────── -->
<section class="shelf-section">
	<div class="section-head">
		<h2>{t.shelf.sectionLabel}</h2>
		<Tag>{t.shelf.finishedOnly}</Tag>
	</div>
	<p class="section-deck">{t.shelf.description}</p>

	{#if empty}
		<div class="empty">
			<p class="empty-title">{t.shelf.emptyTitle}</p>
			<p class="empty-body">{t.shelf.emptyBody}</p>
		</div>
	{:else if spines}
		<div class="shelf-row">
			{#each spines as spine (spine.slug)}
				{@const hair = spine.light ? 'var(--rule)' : 'rgba(255,255,255,0.35)'}
				<!--
					One spine, set the way a bound book is set: a band of hairlines at
					the head, the title running bottom-to-top, the monogram at the foot.

					The design left a spine inert. Here it is a link — a book on a shelf
					is a thing you can take down again, and every other title on this
					site is reachable from where it is named.
				-->
				<a
					class="spine"
					class:light={spine.light}
					href={href(i18n.lang, `/writing/${spine.slug}`)}
					title={spine.title}
					style:width="{spine.width}px"
					style:height="{spine.height}px"
					style:background={spine.light ? 'var(--paper2)' : toneOf(spine.topic)}
					style:color={spine.light ? 'var(--ink)' : 'var(--paper)'}
					style:--hair={hair}
				>
					<span class="band" aria-hidden="true"></span>
					<span class="running" style:font-size="{spine.width > 60 ? 17 : 15}px"
						>{spine.title}</span
					>
					<span class="foot" aria-hidden="true">
						<span class="foot-rule"></span>
						<span class="monogram">{t.shelf.monogram}</span>
					</span>
				</a>
			{/each}
		</div>
		<!-- The plank the row rests on. -->
		<div class="plank" aria-hidden="true"></div>
		<div class="plank-edge" aria-hidden="true"></div>
	{/if}
</section>

<!-- One explanation, for the whole room rather than per section: how any of
     this got here and where it lives. It runs the full width because it closes
     the page — a measure would make it look like another section's aside. -->
<section class="room-foot">
	<p>{t.readingRoom.colophon}</p>
</section>

<style>
	.masthead {
		padding: 44px var(--pad-chrome) 32px;
		border-bottom: 1.5px solid var(--rule-hard);
	}
	.row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
		flex-wrap: wrap;
		margin-bottom: 14px;
	}
	.deck {
		margin: 22px 0 0;
		font-size: 16.5px;
		line-height: 1.55;
		color: var(--muted);
		max-width: 58ch;
	}

	.shelf-section {
		/* The section used to end on its own colophon; without one it has to
		   carry its own foot, or the plank runs straight into the closing line. */
		padding: 34px var(--pad-chrome) 10px;
	}
	.section-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		flex-wrap: wrap;
	}
	.section-head h2 {
		margin: 0;
		font-family: var(--display);
		font-weight: 700;
		font-size: 26px;
		letter-spacing: -0.03em;
		text-transform: lowercase;
	}
	.section-deck {
		margin: 12px 0 0;
		font-style: italic;
		font-size: 15px;
		line-height: 1.55;
		color: var(--muted);
		max-width: 58ch;
	}

	.shelf-row {
		display: flex;
		align-items: flex-end;
		gap: 4px;
		min-height: 400px;
		overflow-x: auto;
		padding-bottom: 2px;
		margin-top: 40px;
	}

	.spine {
		align-self: flex-end;
		flex-shrink: 0;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border: none;
		/* The roundness of a bound board, faked with light rather than radius —
		   `border-radius: 0` is global and a spine is still a rectangle. */
		box-shadow:
			inset -6px 0 12px rgba(0, 0, 0, 0.16),
			inset 4px 0 6px rgba(255, 255, 255, 0.06);
		transition: transform 0.18s ease;
	}
	.spine.light {
		border: 1.5px solid var(--rule-hard);
		box-shadow: inset -6px 0 12px rgba(0, 0, 0, 0.06);
	}
	.spine:hover,
	.spine:focus-visible {
		transform: translateY(-8px);
		text-decoration: none;
	}
	.spine:focus-visible {
		outline: 2px solid var(--blue);
		outline-offset: 3px;
	}

	/* Two hairlines, like the bands on a bound spine. */
	.band {
		border-top: 1px solid var(--hair);
		border-bottom: 1px solid var(--hair);
		height: 16px;
		margin: 18px 7px 0;
	}
	.running {
		writing-mode: vertical-rl;
		transform: rotate(180deg);
		margin: 0 auto;
		font-family: var(--display);
		font-weight: 600;
		letter-spacing: -0.01em;
		text-transform: lowercase;
		line-height: 1.05;
		text-align: left;
		overflow: hidden;
		flex: 1;
		padding: 4px 0;
	}
	.foot {
		margin: 0 7px 16px;
	}
	.foot-rule {
		display: block;
		border-top: 1px solid var(--hair);
		margin-bottom: 10px;
	}
	.monogram {
		writing-mode: vertical-rl;
		transform: rotate(180deg);
		margin: 0 auto;
		display: block;
		width: fit-content;
		font-family: var(--mono);
		font-size: 8.5px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		opacity: 0.7;
	}

	.plank {
		height: 16px;
		background: var(--ink);
		margin-top: -1px;
	}
	.plank-edge {
		height: 8px;
		background: var(--blue);
	}

	.empty {
		padding: 80px 0;
		text-align: center;
	}
	.empty-title {
		font-family: var(--display);
		font-weight: 500;
		font-size: 22px;
		text-transform: lowercase;
		margin: 0 0 10px;
	}
	.empty-body {
		font-size: 14px;
		color: var(--muted);
		margin: 0;
	}

	/* No measure: this line runs the width of the page, because it closes the
	   room rather than belonging to anything above it. */
	.room-foot {
		padding: 34px var(--pad-chrome) 80px;
	}
	.room-foot p {
		margin: 0;
		padding-top: 16px;
		border-top: 1.5px solid var(--rule-hard);
		font-family: var(--mono);
		font-size: 11.5px;
		line-height: 1.6;
		color: var(--muted);
	}

	@media (max-width: 700px) {
		.masthead,
		.shelf-section,
		.room-foot {
			padding-left: 18px;
			padding-right: 18px;
		}
	}

	/**
	 * Print: a shelf you can put on a real wall. The row cannot scroll on paper,
	 * so it wraps into stacked shelves instead of being guillotined at the
	 * margin, and the ink goes black — a blue plank costs a colour cartridge to
	 * say nothing the rule does not.
	 */
	@media print {
		.shelf-row {
			overflow-x: visible;
			flex-wrap: wrap;
			min-height: 0;
			row-gap: 26px;
		}
		.plank-edge {
			background: var(--ink);
		}
		.masthead,
		.shelf-section,
		.room-foot {
			padding-left: 0;
			padding-right: 0;
		}
	}
</style>
