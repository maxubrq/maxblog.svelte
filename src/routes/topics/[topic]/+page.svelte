<script lang="ts">
	// A topic as its own oversized cover, then the essays as two-up cells.
	import Tag from '$lib/components/ink/Tag.svelte';
	import { pad, yearMonth } from '$lib/format';
	import { site } from '$lib/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.topic.name.toLowerCase()} — {site.name}</title>
	<meta name="description" content={data.topic.blurb} />
</svelte:head>

<section class="cover">
	<div class="row">
		<Tag on>Topic {pad(data.index)} / {pad(data.of)}</Tag>
		<Tag>{data.posts.length} {data.posts.length === 1 ? 'essay' : 'essays'}</Tag>
	</div>
	<h1>{data.topic.name}</h1>
	<p>{data.topic.blurb}</p>
</section>

<section class="grid">
	{#each data.posts as p, i (p.slug)}
		<a class="cell" href={p.href}>
			<div class="row">
				<span class="num">{pad(i + 1)}</span>
				<Tag
					>{yearMonth(p.date)} · {p.reading}′{#if p.interactive}<span class="dot"> ●</span>{/if}</Tag
				>
			</div>
			<h3>{p.title}</h3>
			{#if p.subtitle}<p class="deck">{p.subtitle}</p>{/if}
		</a>
	{:else}
		<p class="empty"><Tag>nothing filed here yet</Tag></p>
	{/each}
</section>

<style>
	.cover {
		position: relative;
		padding: 46px var(--pad-chrome) 40px;
		border-bottom: 1.5px solid var(--rule-hard);
	}
	.row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 16px;
	}
	h1 {
		font-family: var(--display);
		font-weight: 700;
		font-size: clamp(52px, 11vw, 108px);
		line-height: 0.9;
		letter-spacing: -0.05em;
		margin: 10px 0 0;
		text-transform: lowercase;
		color: var(--blue);
	}
	.cover p {
		max-width: 52ch;
		font-family: var(--display);
		font-weight: 500;
		font-size: 17px;
		line-height: 1.5;
		color: var(--ink);
		margin: 20px 0 0;
	}

	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
	.cell {
		padding: 24px 24px 30px;
		color: var(--ink);
		text-decoration: none;
		border-right: 1.5px solid var(--rule-hard);
		border-bottom: 1.5px solid var(--rule-hard);
	}
	.cell:nth-child(2n) {
		border-right: none;
	}
	.cell:hover {
		background: var(--paper2);
		text-decoration: none;
	}
	.cell .row {
		margin-bottom: 40px;
	}
	.num {
		font-family: var(--mono);
		font-size: 13px;
		color: var(--faint);
	}
	.dot {
		color: var(--blue);
	}
	h3 {
		font-family: var(--display);
		font-weight: 700;
		font-size: 26px;
		letter-spacing: -0.03em;
		line-height: 1.02;
		margin: 0;
		text-transform: lowercase;
	}
	.deck {
		font-size: 14px;
		line-height: 1.5;
		color: var(--muted);
		margin: 10px 0 0;
		max-width: 42ch;
	}
	.empty {
		padding: 40px var(--pad-chrome);
	}
	@media (max-width: 860px) {
		.cover {
			padding-left: 18px;
			padding-right: 18px;
		}
		.grid {
			grid-template-columns: 1fr;
		}
		.cell {
			border-right: none;
			padding: 20px 18px 26px;
		}
		.cell .row {
			margin-bottom: 24px;
		}
	}
</style>
