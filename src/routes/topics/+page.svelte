<script lang="ts">
	// The hub — four doorways. Hover flips the whole cell to solid blue (§8).
	import Headline from '$lib/components/ink/Headline.svelte';
	import Tag from '$lib/components/ink/Tag.svelte';
	import { pad } from '$lib/format';
	import { site } from '$lib/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>topics — {site.name}</title>
	<meta name="description" content="Four doorways: science, tech, philosophy, art." />
</svelte:head>

<section class="head">
	<Tag>Topics / {data.doorways.length} doorways</Tag>
	<Headline text="the ways in." accent="in." size={60} />
</section>

<section class="grid">
	{#each data.doorways as t, i (t.slug)}
		<a class="door" href={`/topics/${t.slug}`}>
			<div class="row">
				<span class="num">{pad(i + 1)}</span>
				<Tag>{t.count} {t.count === 1 ? 'essay' : 'essays'}</Tag>
			</div>
			<h2>{t.name}</h2>
			<p>{t.blurb}</p>
		</a>
	{/each}
</section>

<style>
	.head {
		padding: 44px var(--pad-chrome) 24px;
		border-bottom: 1.5px solid var(--rule-hard);
	}
	.head :global(h1) {
		margin-top: 14px;
	}
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
	.door {
		padding: 26px 24px 32px;
		color: var(--ink);
		text-decoration: none;
		border-right: 1.5px solid var(--rule-hard);
		border-bottom: 1.5px solid var(--rule-hard);
	}
	.door:nth-child(2n) {
		border-right: none;
	}
	.door:hover {
		background: var(--blue);
		color: var(--on-blue);
		text-decoration: none;
	}
	.door:hover p,
	.door:hover :global(.tag),
	.door:hover .num {
		color: var(--on-blue);
	}
	.row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 34px;
	}
	.num {
		font-family: var(--mono);
		font-size: 13px;
		color: var(--faint);
	}
	h2 {
		font-family: var(--display);
		font-weight: 700;
		font-size: 46px;
		letter-spacing: -0.04em;
		line-height: 1;
		margin: 0 0 12px;
		text-transform: lowercase;
	}
	p {
		font-size: 14.5px;
		line-height: 1.5;
		color: var(--muted);
		margin: 0;
		max-width: 42ch;
	}
	@media (max-width: 860px) {
		.head {
			padding-left: 18px;
			padding-right: 18px;
		}
		.grid {
			grid-template-columns: 1fr;
		}
		.door {
			border-right: none;
			padding: 22px 18px 26px;
		}
	}
</style>
