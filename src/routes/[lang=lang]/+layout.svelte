<script lang="ts">
	// InkChrome (§7): 3-col header · body · footer triplet — in the active locale.
	import { page } from '$app/state';
	import DisplaySettings from '$lib/components/chrome/DisplaySettings.svelte';
	import SearchButton from '$lib/components/chrome/SearchButton.svelte';
	import { LANG_COOKIE, LANG_COOKIE_MAX_AGE, href, setI18n, swapLocale } from '$lib/i18n';
	import { reading as prefs } from '$lib/reading.svelte';
	import { search, searchHotkey } from '$lib/search.svelte';
	import { site } from '$lib/site';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	// A getter, because this layout instance survives /en → /vi navigation.
	const i18n = setI18n(() => data.lang);

	/**
	 * Three doors (DESIGN.md §5.1). The archive is the home page; Glossary,
	 * Resources and the Reading Room are reached from the footer and from the
	 * essays that point at them — they are the appendix, not the front door.
	 */
	const nav = $derived([
		{ path: '', key: 'writing', label: i18n.t.nav.writing },
		{ path: '/topics', key: 'topics', label: i18n.t.nav.topics },
		{ path: '/about', key: 'about', label: i18n.t.nav.about }
	]);

	// The locale root and every essay count as writing — the root *is* the
	// archive. Topics covers the series too: an arc is a topic with an order.
	const current = $derived.by(() => {
		const p = page.url.pathname.replace(/^\/(en|vi)/, '') || '/';
		if (p === '/' || p.startsWith('/writing')) return 'writing';
		if (p.startsWith('/topics') || p.startsWith('/series')) return 'topics';
		if (p.startsWith('/about')) return 'about';
		return '';
	});

	/**
	 * On an essay the header steps aside while you read down and comes back the
	 * moment you scroll up (DESIGN.md §8): 56px is 7% of a phone screen, and it
	 * is not what anyone is reading. Everywhere else it stays.
	 */
	const reading = $derived(!!page.data.meta);
	let tucked = $state(false);
	let lastY = 0;
	function onScroll() {
		const y = window.scrollY;
		if (Math.abs(y - lastY) < 6) return;
		tucked = reading && y > lastY && y > 120;
		lastY = y;
	}

	// On an article, the switch goes to that essay's translation (a different
	// slug); everywhere else the same page in the other locale.
	//
	// An essay with no twin is the third case, and it is not hypothetical: an
	// article's URL exists only under the locale it is written in, so swapping
	// the prefix builds a page that was never prerendered. The switcher offers
	// the other locale's archive instead — the reader still gets there, and the
	// build no longer follows a link to a 404.
	const switchHref = $derived.by(() => {
		if (page.data.translation) return href(i18n.other, `/writing/${page.data.translation.slug}`);
		if (page.data.meta) return href(i18n.other);
		return swapLocale(page.url.pathname, i18n.other);
	});

	/** Only a real translation is an alternate; the archive is a way out, not one. */
	const alternate = $derived(page.data.meta && !page.data.translation ? null : switchHref);


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
	$effect(() => prefs.hydrate());
</script>

<svelte:head>
	<link rel="canonical" href={site.url + page.url.pathname} />
	<link rel="alternate" hreflang={data.lang} href={site.url + page.url.pathname} />
	{#if alternate}
		<link rel="alternate" hreflang={i18n.other} href={site.url + alternate} />
	{/if}
	<link
		rel="alternate"
		type="application/rss+xml"
		href={href(data.lang, '/feed.xml')}
		title={site.name}
	/>
</svelte:head>

<svelte:window onkeydown={searchHotkey} onscroll={onScroll} />

<div class="root">
	<header class:tucked>
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
		<div class="tools">
			<SearchButton />
			<a
				class="locale"
				href={switchHref}
				hreflang={i18n.other}
				rel="alternate"
				aria-label={i18n.t.locale.switch}
				title={i18n.t.locale.switch}>{i18n.t.locale.code}</a
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
		<span>{site.copyright} {site.name}</span>
		<a href={href(data.lang, '/glossary')}>{i18n.t.nav.glossary}</a>
		<a href={href(data.lang, '/resources')}>{i18n.t.nav.resources}</a>
		<a href={href(data.lang, '/reading-room')}>{i18n.t.nav.readingRoom}</a>
		<a href={href(data.lang, '/about')}>{i18n.t.nav.about}</a>
		<a href={href(data.lang, '/feed.xml')}>{i18n.t.footer.rss}</a>
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

	/* One row, 56px, on a 1.5px rule: wordmark · nav · tools (DESIGN.md §8).
	   Sticky on solid paper, so the rule stays the site's top edge. */
	header {
		position: sticky;
		top: 0;
		z-index: 50;
		display: flex;
		align-items: center;
		gap: var(--s-3);
		height: 56px;
		padding: 0 var(--pad-chrome);
		background: var(--paper);
		border-bottom: 1.5px solid var(--rule-hard);
		transition: transform 0.2s ease;
	}
	header.tucked {
		transform: translateY(-100%);
	}
	@media (prefers-reduced-motion: reduce) {
		header {
			transition: none;
		}
	}

	.wordmark {
		font-family: var(--body);
		font-weight: 600;
		font-size: var(--t-body);
		color: var(--ink);
		text-decoration: none;
		white-space: nowrap;
	}
	.wordmark:hover {
		text-decoration: none;
	}
	.dot {
		color: var(--blue);
	}

	nav {
		display: flex;
		align-items: center;
		gap: var(--s-2);
		flex: 1;
		min-width: 0;
	}
	.navlink {
		position: relative;
		font-size: var(--t-meta);
		font-weight: 500;
		white-space: nowrap;
		color: var(--muted);
		text-decoration: none;
		padding: 4px 0;
	}
	.navlink:hover {
		color: var(--blue);
		text-decoration: none;
	}
	.active {
		color: var(--ink);
	}
	.active::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		bottom: -2px;
		height: 1.5px;
		background: var(--blue);
	}

	.tools {
		display: flex;
		align-items: center;
		gap: var(--s-1);
	}
	.locale {
		display: grid;
		place-items: center;
		min-width: 32px;
		height: 32px;
		font-size: var(--t-meta);
		font-weight: 500;
		color: var(--muted);
		text-decoration: none;
	}
	.locale:hover {
		color: var(--blue);
		text-decoration: none;
	}

	main {
		flex: 1;
	}

	/* One row of words, full bleed like the header (DESIGN.md §7.8). */
	footer {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s-1) var(--s-2);
		padding: var(--s-2) var(--pad-chrome) var(--s-3);
		border-top: 1.5px solid var(--rule-hard);
		font-size: var(--t-meta);
		color: var(--muted);
	}
	footer a {
		color: var(--muted);
	}
	footer a:hover {
		color: var(--blue);
	}

	@media (max-width: 860px) {
		header {
			gap: var(--s-2);
			padding: 0 var(--s-2);
		}
		.wordmark {
			font-size: var(--t-meta);
		}
		nav {
			gap: 12px;
		}
		footer {
			padding: var(--s-2) var(--s-2) 80px;
		}
	}
</style>
