<script lang="ts">
	/**
	 * The reading room (DESIGN.md §7.3): what you are reading, and what you
	 * have finished — two lists, newest first, read off this device after
	 * mount. The constellation and the bound-book shelf were cut: with a
	 * handful of essays a sky of four stars is decoration. The previous page is
	 * kept in `archived/routes/reading-room/` for when the archive is thick
	 * enough to try again.
	 */
	import Headline from '$lib/components/ink/Headline.svelte';
	import { href, useI18n } from '$lib/i18n';
	import { entryLang, inProgress, lastSeen, type ReadingEntry } from '$lib/reading-memory';
	import { readShelf, type Spine } from '$lib/shelf';
	import { site } from '$lib/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t);

	// Null until the client has read storage, so the prerendered HTML and the
	// first render agree: the server cannot know what this device remembers.
	let reading = $state<ReadingEntry[] | null>(null);
	let finished = $state<Spine[] | null>(null);
	$effect(() => {
		reading = inProgress();
		finished = readShelf(data.sources).reverse();
	});

	const title = $derived(`${t.readingRoom.titleLead} ${t.readingRoom.titleAccent}`);
</script>

<svelte:head>
	<title>{title} — {site.name}</title>
	<meta name="description" content={t.readingRoom.description} />
</svelte:head>

<div class="sheet">
	<Headline text={title} />
	<p class="deck">{t.readingRoom.description}</p>

	<section class="appendix">
		<h2 class="appendix-head">{t.readingRoom.inProgress}</h2>
		{#if reading && reading.length > 0}
			<ul>
				{#each reading as e (e.slug)}
					<li>
						<a href={href(entryLang(e, i18n.lang), `/writing/${e.slug}`) + (e.sectionId ? `#${e.sectionId}` : '')}>
							<span class="title">{e.title}</span>
							<span class="meta"
								>{Math.round(e.pct * 100)}% · {lastSeen(e.lastSeenTs, t.readingMemory, i18n.lang)}</span
							>
						</a>
					</li>
				{/each}
			</ul>
		{:else if reading}
			<p class="empty">{t.readingRoom.nothingOpen}</p>
		{/if}
	</section>

	<section class="appendix">
		<h2 class="appendix-head">{t.readingRoom.finished}</h2>
		{#if finished && finished.length > 0}
			<ul>
				{#each finished as s (s.slug)}
					<li>
						<a href={href(i18n.lang, `/writing/${s.slug}`)}>
							<span class="title">{s.title}</span>
							<span class="meta">{s.topic}</span>
						</a>
					</li>
				{/each}
			</ul>
		{:else if finished}
			<p class="empty">{t.shelf.emptyBody}</p>
		{/if}
	</section>

	<p class="colophon">{t.readingRoom.colophon}</p>
</div>

<style>
	.deck {
		color: var(--muted);
		margin: var(--s-2) 0 0;
	}
	ul {
		list-style: none;
		margin: var(--s-2) 0 0;
		padding: 0;
	}
	li + li {
		border-top: 1px solid var(--rule);
	}
	a {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: var(--s-2);
		padding: var(--s-2) 0;
		color: var(--ink);
		text-decoration: none;
	}
	a:hover .title {
		color: var(--blue);
	}
	.title {
		font-weight: 600;
	}
	.meta,
	.empty,
	.colophon {
		font-size: var(--t-meta);
		color: var(--muted);
	}
	.meta {
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
	}
	.empty {
		margin: var(--s-2) 0 0;
	}
	.colophon {
		margin: var(--s-4) 0 0;
	}
</style>
