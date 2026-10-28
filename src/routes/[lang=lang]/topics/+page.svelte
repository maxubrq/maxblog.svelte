<script lang="ts">
	// The hub — the doorways. Hover flips the whole cell to solid blue (§8).
	import Headline from '$lib/components/ink/Headline.svelte';
	import Tag from '$lib/components/ink/Tag.svelte';
	import { href, useI18n } from '$lib/i18n';
	import { site } from '$lib/site';
	import { TOPIC_CONTENT, getTopicLocale } from '$lib/topics';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t);

	// The count is the only thing the server had to work out; the name and the
	// tagline are the room's own, in the reader's locale.
	const doors = $derived(
		data.doorways.map((d) => ({ ...d, ...getTopicLocale(TOPIC_CONTENT[d.id], i18n.lang) }))
	);
</script>

<svelte:head>
	<title>{t.nav.topics} — {site.name}</title>
	<meta name="description" content={t.topics.hubIndex} />
</svelte:head>

<div class="sheet">
<section class="head">
	<Tag>{t.topics.hubIndex} / {data.doorways.length} {t.topics.doorways}</Tag>
	<Headline text={t.topics.hubTitle} />
</section>

<section class="grid">
	<!-- A topic with nothing in it yet is not offered (DESIGN.md §7.4). -->
	{#each doors.filter((d) => d.count > 0) as d (d.id)}
		<a class="door" href={href(i18n.lang, `/topics/${d.id}`)}>
			<h2>{d.name}</h2>
			<p>{d.tagline}</p>
			<Tag>{d.count} {d.count === 1 ? t.topics.essay : t.topics.essays}</Tag>
		</a>
	{/each}
</section>
</div>

<style>
	.head {
		max-width: var(--index-max);
		margin: 0 auto;
		padding: var(--s-3) 0 var(--s-2);
	}
	.head :global(h1) {
		margin-top: var(--s-1);
	}
	.grid {
		max-width: var(--index-max);
		margin: 0 auto;
		padding: 0 0 var(--s-4);
		display: grid;
		grid-template-columns: 1fr 1fr;
		column-gap: var(--s-3);
	}
	/* Hover turns the name blue, as everywhere else — a solid blue cell was
	   louder than anything inside it. */
	.door {
		display: block;
		padding: var(--s-3) 0;
		color: var(--ink);
		text-decoration: none;
		border-top: 1.5px solid var(--rule-hard);
	}
	.door:hover {
		text-decoration: none;
	}
	.door:hover h2 {
		color: var(--blue);
	}
	h2 {
		font-family: var(--display);
		font-weight: 700;
		font-size: var(--t-title);
		line-height: 1.1;
		margin: 0 0 var(--s-1);
	}
	p {
		color: var(--muted);
		margin: 0 0 var(--s-1);
		max-width: 42ch;
	}
	@media (max-width: 860px) {
		.head,
		.grid {
			padding-left: var(--s-2);
			padding-right: var(--s-2);
		}
		.grid {
			grid-template-columns: 1fr;
		}
		h2 {
			font-size: 32px;
		}
	}
</style>
