<script lang="ts">
	// InkChrome (§7): 3-col header · body · footer triplet — in the active locale.
	import { page } from '$app/state';
	import Tag from '$lib/components/ink/Tag.svelte';
	import { href, setI18n, swapLocale } from '$lib/i18n';
	import { site } from '$lib/site';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	// A getter, because this layout instance survives /en → /vi navigation.
	const i18n = setI18n(() => data.lang);

	const nav = $derived([
		{ href: href(data.lang, '/writing'), key: 'writing', label: i18n.t.nav.writing },
		{ href: href(data.lang, '/topics'), key: 'topics', label: i18n.t.nav.topics },
		{ href: href(data.lang, '/about'), key: 'about', label: i18n.t.nav.about }
	]);

	// The locale root counts as writing — it *is* the index.
	const current = $derived.by(() => {
		const p = page.url.pathname.replace(/^\/(en|vi)/, '') || '/';
		if (p === '/' || p.startsWith('/writing')) return 'writing';
		if (p.startsWith('/topics')) return 'topics';
		if (p.startsWith('/about')) return 'about';
		return '';
	});

	// On an article, the switch goes to that essay's translation (a different
	// slug); everywhere else the same page in the other locale.
	const switchHref = $derived(
		page.data.translation
			? href(i18n.other, `/writing/${page.data.translation.slug}`)
			: swapLocale(page.url.pathname, i18n.other)
	);

	const foot = $derived(page.data.foot ?? site.domain);
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

<div class="root">
	<header>
		<a class="wordmark" href={href(data.lang)}>{site.name}<span class="dot">.</span></a>
		<nav>
			{#each nav as item (item.key)}
				<a
					href={item.href}
					class="navlink"
					class:active={current === item.key}
					aria-current={current === item.key ? 'page' : undefined}>{item.label}</a
				>
			{/each}
		</nav>
		<div class="slot">
			<a class="locale" href={switchHref} hreflang={i18n.other} rel="alternate"
				>{i18n.t.locale.switch}</a
			>
			<Tag>{site.volume}</Tag>
			<a
				class="glyph"
				href={href(data.lang, '/writing')}
				aria-label={i18n.t.footer.search}>⌕</a
			>
		</div>
	</header>

	<main>
		{@render children()}
	</main>

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

	header {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		padding: 18px var(--pad-chrome);
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

	nav {
		display: flex;
		gap: 22px;
	}
	.navlink {
		font-family: var(--mono);
		font-size: 11.5px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--ink);
		text-decoration: none;
		border-bottom: 2px solid transparent;
		padding-bottom: 2px;
	}
	.navlink:hover {
		color: var(--blue);
		text-decoration: none;
	}
	.active {
		color: var(--blue);
		border-bottom-color: var(--blue);
	}

	.slot {
		justify-self: end;
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.locale {
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		border: 1.5px solid var(--rule-hard);
		color: var(--ink);
		padding: 3px 8px;
		text-decoration: none;
	}
	.locale:hover {
		background: var(--blue);
		border-color: var(--blue);
		color: var(--on-blue);
		text-decoration: none;
	}
	.glyph {
		width: 20px;
		height: 20px;
		border: 1.5px solid var(--ink);
		border-radius: 50%;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-family: var(--mono);
		font-size: 10px;
		color: var(--ink);
		text-decoration: none;
	}
	.glyph:hover {
		border-color: var(--blue);
		color: var(--blue);
		text-decoration: none;
	}

	main {
		flex: 1;
	}

	footer {
		border-top: 1.5px solid var(--rule-hard);
		margin: 0 var(--pad-chrome);
		padding: 16px 0 22px;
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 16px;
	}

	@media (max-width: 940px) {
		header {
			grid-template-columns: 1fr auto;
			row-gap: 12px;
			padding: 14px 18px;
		}
		nav {
			grid-row: 2;
			grid-column: 1 / -1;
			gap: 16px;
			flex-wrap: wrap;
		}
		footer {
			margin: 0 18px;
			flex-direction: column;
			gap: 6px;
		}
	}
</style>
