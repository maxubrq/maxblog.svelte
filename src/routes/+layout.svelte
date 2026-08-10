<script lang="ts">
	// InkChrome (§7): 3-col header · scroll body · footer triplet.
	import 'katex/dist/katex.min.css';
	import '../app.css';
	import { page } from '$app/state';
	import Tag from '$lib/components/ink/Tag.svelte';
	import { site } from '$lib/site';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const nav = [
		{ href: '/writing', key: 'writing', label: 'Writing' },
		{ href: '/topics', key: 'topics', label: 'Topics' },
		{ href: '/about', key: 'about', label: 'About the author' }
	];

	// `/` counts as writing — the home page *is* the index.
	const current = $derived.by(() => {
		const p = page.url.pathname;
		if (p === '/' || p.startsWith('/writing')) return 'writing';
		if (p.startsWith('/topics')) return 'topics';
		if (p.startsWith('/about')) return 'about';
		return '';
	});

	const foot = $derived(page.data.foot ?? site.domain);
</script>

<div class="root">
	<header>
		<a class="wordmark" href="/">{site.name}<span class="dot">.</span></a>
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
			<Tag>{site.volume}</Tag>
			<a class="glyph" href="/writing" aria-label="Search the index">⌕</a>
		</div>
	</header>

	<main>
		{@render children()}
	</main>

	<footer>
		<Tag>{foot}</Tag>
		<Tag>{site.tagline}</Tag>
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

	@media (max-width: 860px) {
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
