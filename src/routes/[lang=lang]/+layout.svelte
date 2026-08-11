<script lang="ts">
	// InkChrome (§7): 3-col header · body · footer triplet — in the active locale.
	import { page } from '$app/state';
	import DisplaySettings from '$lib/components/chrome/DisplaySettings.svelte';
	import SearchButton from '$lib/components/chrome/SearchButton.svelte';
	import Tag from '$lib/components/ink/Tag.svelte';
	import { LANG_COOKIE, LANG_COOKIE_MAX_AGE, href, setI18n, swapLocale } from '$lib/i18n';
	import { reading } from '$lib/reading.svelte';
	import { search, searchHotkey } from '$lib/search.svelte';
	import { site } from '$lib/site';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	// A getter, because this layout instance survives /en → /vi navigation.
	const i18n = setI18n(() => data.lang);

	/**
	 * The seven doors, in the production blog's order. Four of them are still
	 * placeholder rooms — they are in the nav anyway, because the shape of the
	 * site is part of what the header says.
	 */
	const nav = $derived([
		{ path: '/writing', key: 'writing', label: i18n.t.nav.writing },
		{ path: '/topics', key: 'topics', label: i18n.t.nav.topics },
		{ path: '/series', key: 'series', label: i18n.t.nav.series },
		{ path: '/glossary', key: 'glossary', label: i18n.t.nav.glossary },
		{ path: '/resources', key: 'resources', label: i18n.t.nav.resources },
		{ path: '/reading-room', key: 'readingRoom', label: i18n.t.nav.readingRoom },
		{ path: '/about', key: 'about', label: i18n.t.nav.about }
	]);

	// The locale root counts as writing — it *is* the index.
	const current = $derived.by(() => {
		const p = page.url.pathname.replace(/^\/(en|vi)/, '') || '/';
		if (p === '/' || p.startsWith('/writing')) return 'writing';
		const hit = nav.find((n) => n.path !== '/writing' && p.startsWith(n.path));
		return hit?.key ?? '';
	});

	// On an article, the switch goes to that essay's translation (a different
	// slug); everywhere else the same page in the other locale.
	const switchHref = $derived(
		page.data.translation
			? href(i18n.other, `/writing/${page.data.translation.slug}`)
			: swapLocale(page.url.pathname, i18n.other)
	);

	const foot = $derived(page.data.foot ?? site.domain);

	/**
	 * Remember which edition the reader is actually reading, so `/` can send
	 * them back here next time. Written on every locale page, not only when the
	 * switcher is used — arriving on /vi from a link is a choice too.
	 */
	$effect(() => {
		document.cookie = `${LANG_COOKIE}=${data.lang}; Path=/; Max-Age=${LANG_COOKIE_MAX_AGE}; SameSite=Lax`;
	});

	/**
	 * Read the stored preferences once, here, because the layout is the one
	 * thing that wraps every surface editing them — the header dropdown and
	 * `/reading` — and it survives client-side navigation between the two.
	 * The blocking script in `app.html` has already painted them; this is the
	 * store catching up with what the page is showing.
	 */
	$effect(() => reading.hydrate());
</script>

<svelte:head>
	<link rel="canonical" href={site.url + page.url.pathname} />
	<link rel="alternate" hreflang={data.lang} href={site.url + page.url.pathname} />
	<link rel="alternate" hreflang={i18n.other} href={site.url + switchHref} />
	<link
		rel="alternate"
		type="application/rss+xml"
		href={href(data.lang, '/feed.xml')}
		title={site.name}
	/>
</svelte:head>

<svelte:window onkeydown={searchHotkey} />

<div class="root">
	<header>
		<a class="wordmark" href={href(data.lang)}>{site.name}<span class="dot">.</span></a>
		<nav>
			{#each nav as item (item.key)}
				<a
					href={href(data.lang, item.path)}
					class="navlink"
					class:active={current === item.key}
					aria-current={current === item.key ? 'page' : undefined}>{item.label}</a
				>
			{/each}
		</nav>
		<div class="slot">
			<SearchButton />
			<span class="divider"></span>
			<a class="locale" href={switchHref} hreflang={i18n.other} rel="alternate"
				>{i18n.t.locale.switch}</a
			>
			<DisplaySettings />
		</div>
	</header>

	<main>
		{@render children()}
	</main>

	<!-- Loaded on first open, never before: the overlay pulls in MiniSearch, and
	     a reader who never searches should not pay for the engine. -->
	{#if search.open}
		{#await import('$lib/components/chrome/SearchOverlay.svelte') then Overlay}
			<Overlay.default />
		{/await}
	{/if}

	<footer>
		<Tag>{foot}</Tag>
		<Tag>{i18n.t.footer.tagline}</Tag>
		<Tag>{site.copyright}</Tag>
	</footer>
</div>

<style>
	.root {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--paper);
		color: var(--ink);
		position: relative;
	}

	/* 3-slot header on a 1.5px rule: wordmark · centred MONO nav · tools (§7).
	   Sticky, on solid paper, so the rule stays the site's top edge. */
	header {
		position: sticky;
		top: 0;
		z-index: 50;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 20px;
		padding: 18px var(--pad-chrome);
		background: var(--paper);
		border-bottom: 1.5px solid var(--rule-hard);
	}

	.wordmark {
		font-family: var(--display);
		font-weight: 700;
		font-size: 19px;
		letter-spacing: -0.03em;
		color: var(--ink);
		text-decoration: none;
	}
	.wordmark:hover {
		text-decoration: none;
	}
	.dot {
		color: var(--blue);
	}

	/* Hover = colour flip to blue, no motion. Active = blue + blue underline. */
	nav {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 4px;
		flex-wrap: wrap;
	}
	.navlink {
		position: relative;
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		white-space: nowrap;
		color: var(--muted);
		text-decoration: none;
		padding: 4px 8px;
		transition: color 0.12s;
	}
	.navlink:hover {
		color: var(--blue);
		text-decoration: none;
	}
	.active {
		color: var(--blue);
	}
	.active::after {
		content: '';
		position: absolute;
		left: 8px;
		right: 8px;
		bottom: -2px;
		height: 1.5px;
		background: var(--blue);
	}

	.slot {
		justify-self: end;
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.divider {
		width: 1px;
		height: 14px;
		background: var(--rule);
		margin: 0 2px;
	}
	.locale {
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.05em;
		line-height: 1;
		color: var(--muted);
		padding: 4px 8px;
		text-decoration: none;
		transition: color 0.15s;
	}
	.locale:hover {
		color: var(--blue);
		text-decoration: none;
	}

	main {
		flex: 1;
	}

	/* Full-bleed, like the header: the inset is padding, not margin, so the rule
	   runs the whole width of the screen instead of stopping at the measure. */
	footer {
		border-top: 1.5px solid var(--rule-hard);
		padding: 16px var(--pad-chrome) 22px;
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 16px;
	}

	/* Seven doors plus three tools need the width; below it the nav drops to its
	   own row, left-aligned, and the rule still closes the header. */
	@media (max-width: 1180px) {
		header {
			grid-template-columns: 1fr auto;
			row-gap: 12px;
			padding: 14px 18px;
		}
		nav {
			grid-row: 2;
			grid-column: 1 / -1;
			justify-content: flex-start;
			gap: 2px;
			margin-left: -8px;
		}
		footer {
			padding: 16px 18px 22px;
			flex-direction: column;
			gap: 6px;
		}
	}
</style>
