<script lang="ts">
	// Archive — everything, in order of when. Filter bar + year sections.
	import FilterBar from '$lib/components/ink/FilterBar.svelte';
	import Headline from '$lib/components/ink/Headline.svelte';
	import IndexRow from '$lib/components/ink/IndexRow.svelte';
	import Tag from '$lib/components/ink/Tag.svelte';
	import { preferLang } from '$lib/content/group';
	import { short, year } from '$lib/format';
	import { site, topics } from '$lib/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let filter = $state('All');
	let lang = $state<'en' | 'vi'>(site.defaultLang);

	const options = ['All', ...topics.map((t) => t.name)];
	// One row per essay; the toggle decides which translation is listed.
	const inLang = $derived(preferLang(data.posts, lang));
	const visible = $derived(filter === 'All' ? inLang : inLang.filter((p) => p.topic === filter));
	const years = $derived([...new Set(visible.map((p) => year(p.date)))]);
</script>

<svelte:head>
	<title>writing — {site.name}</title>
	<meta name="description" content="Every essay, in order of when." />
</svelte:head>

<section class="head">
	<div class="head-row">
		<Tag>Writing / {inLang.length} {inLang.length === 1 ? 'essay' : 'essays'}</Tag>
		<span class="langs">
			{#each ['en', 'vi'] as const as l (l)}
				<button
					type="button"
					class:on={lang === l}
					aria-pressed={lang === l}
					onclick={() => (lang = l)}>{l}</button
				>
			{/each}
		</span>
	</div>
	<Headline text="everything, in order of when." accent="when." size={60} />
</section>

<FilterBar {options} value={filter} onchange={(v) => (filter = v)} />

<section class="list">
	{#each years as y (y)}
		<div class="year">
			<span class="numeral">{y}</span>
			<span class="hair"></span>
		</div>
		<ul>
			{#each visible.filter((p) => year(p.date) === y) as p (p.slug)}
				<li>
					<IndexRow
						href={p.href}
						lead={short(p.date)}
						topic={p.topic}
						title={p.title}
						meta={`${p.reading}′`}
						interactive={p.interactive}
						leadWidth="64px"
					/>
				</li>
			{/each}
		</ul>
	{/each}
	{#if visible.length === 0}
		<p class="empty"><Tag>nothing filed under {filter} yet</Tag></p>
	{/if}
</section>

<style>
	.head {
		padding: 44px var(--pad-chrome) 24px;
		border-bottom: 1.5px solid var(--rule-hard);
	}
	.head :global(h1) {
		margin-top: 14px;
	}
	.head-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 16px;
	}
	.langs {
		display: inline-flex;
		border: 1.5px solid var(--rule-hard);
	}
	.langs button {
		border: none;
		border-right: 1px solid var(--rule);
		background: transparent;
		color: var(--ink);
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		padding: 4px 10px;
		cursor: pointer;
	}
	.langs button:last-child {
		border-right: none;
	}
	.langs button.on {
		background: var(--blue);
		color: var(--on-blue);
	}
	.list {
		padding: 0 var(--pad-chrome) 30px;
	}
	.year {
		display: flex;
		align-items: baseline;
		gap: 16px;
		padding: 26px 0 6px;
	}
	.numeral {
		font-family: var(--display);
		font-weight: 700;
		font-size: 40px;
		letter-spacing: -0.03em;
		color: var(--faint);
		line-height: 1;
	}
	.hair {
		flex: 1;
		height: 1.5px;
		background: var(--rule-hard);
	}
	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.empty {
		padding: 40px 0;
	}
	@media (max-width: 860px) {
		.head,
		.list {
			padding-left: 18px;
			padding-right: 18px;
		}
	}
</style>
