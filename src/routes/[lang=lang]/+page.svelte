<script lang="ts">
	// Home — masthead + featured cell/plate + recent archive rows.
	import ArrowMark from '$lib/components/ink/ArrowMark.svelte';
	import Headline from '$lib/components/ink/Headline.svelte';
	import IndexRow from '$lib/components/ink/IndexRow.svelte';
	import PickUpWhereYouLeftOff from '$lib/components/home/PickUpWhereYouLeftOff.svelte';
	import Tag from '$lib/components/ink/Tag.svelte';
	import { dots, pad } from '$lib/format';
	import { href, useI18n } from '$lib/i18n';
	import { cloudinary, coverImageFor, srcsetFor } from '$lib/images';
	import { site } from '$lib/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t);
	const cover = $derived(coverImageFor(data.featured?.coverImage));
</script>

<svelte:head>
	<title>{site.name} — {t.footer.tagline}</title>
	<meta name="description" content={t.home.description} />
</svelte:head>

<!-- What you are in the middle of. Renders nothing when there is nothing to
     resume, which is every first visit — so it can stand above the masthead
     without pushing the site down for a reader who has none. -->
<PickUpWhereYouLeftOff />

<!-- Masthead -->
<section class="masthead">
	<div class="labels">
		<Tag>{t.home.tagline}</Tag>
		<Tag>{t.home.mastheadIndex}</Tag>
	</div>
	<Headline
		text={t.home.headline}
		accent={t.home.headlineAccent}
		mark="scribble"
		size={72}
		markWidth={230}
	/>
	<p class="deck">{t.home.description}</p>
</section>

<!-- Featured — the latest essay as a full-bleed division -->
{#if data.featured}
	{@const f = data.featured}
	<section class="featured">
		<a class="cell" href={href(i18n.lang, `/writing/${f.slug}`)}>
			<div class="tags">
				{#if f.interactive}<Tag on>● {t.home.interactive}</Tag>{/if}
				<Tag>{t.home.latestLabel} / {f.topic}</Tag>
			</div>
			<div class="number">01</div>
			<h2>{f.title}</h2>
			{#if f.subtitle || f.description}
				<p>{f.subtitle ?? f.description}</p>
			{/if}
			<span class="cta">
				{t.home.readEssay}
				<ArrowMark left={130} top={-6} w={90} />
			</span>
		</a>
		<!-- Cyanotype plate — the post's cover, or the branded default. -->
		<div class="ink-screen plate">
			<img
				class="fill"
				src={cloudinary(cover, { width: 1080, halftone: 'screen' })}
				srcset={srcsetFor(cover, { halftone: 'screen' })}
				sizes="(max-width: 860px) 100vw, 45vw"
				alt=""
				decoding="async"
			/>
		</div>
	</section>
{/if}

<!-- Recent -->
<section class="recent">
	<div class="head">
		<Tag>{t.home.archiveRecent}</Tag>
		<a class="all" href={href(i18n.lang, '/writing')}>{t.home.allEssays}</a>
	</div>
	<ul>
		{#each data.recent as p, i (p.slug)}
			<li>
				<IndexRow
					href={href(i18n.lang, `/writing/${p.slug}`)}
					lead={pad(i + 2)}
					topic={p.topic}
					title={p.title}
					meta={`${dots(p.date)} · ${p.reading}′`}
					interactive={p.interactive}
				/>
			</li>
		{/each}
	</ul>
</section>

<style>
	.masthead {
		padding: 46px var(--pad-chrome) 38px;
		border-bottom: 1.5px solid var(--rule-hard);
		position: relative;
	}
	.labels {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20px;
	}
	.deck {
		max-width: 54ch;
		font-size: 16px;
		line-height: 1.5;
		color: var(--muted);
		margin: 26px 0 0;
	}

	.featured {
		display: grid;
		grid-template-columns: 1.15fr 1fr;
		border-bottom: 1.5px solid var(--rule-hard);
	}
	.cell {
		padding: 30px 26px 34px var(--pad-chrome);
		border-right: 1.5px solid var(--rule-hard);
		color: var(--ink);
		text-decoration: none;
		position: relative;
	}
	.cell:hover {
		text-decoration: none;
	}
	.cell:hover h2 {
		color: var(--blue);
	}
	.tags {
		display: flex;
		gap: 10px;
		align-items: center;
		margin-bottom: 18px;
	}
	.number {
		font-family: var(--mono);
		font-size: 44px;
		font-weight: 500;
		color: var(--blue);
		line-height: 1;
		letter-spacing: -0.03em;
		margin-bottom: 14px;
	}
	.cell h2 {
		font-family: var(--display);
		font-weight: 700;
		font-size: 34px;
		line-height: 1.02;
		letter-spacing: -0.03em;
		margin: 0 0 14px;
		text-transform: lowercase;
	}
	.cell p {
		font-size: 14.5px;
		line-height: 1.55;
		color: var(--muted);
		margin: 0 0 20px;
		max-width: 46ch;
	}
	.cta {
		position: relative;
		font-family: var(--mono);
		font-size: 11.5px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--blue);
	}

	.plate {
		min-height: 300px;
	}

	.recent {
		padding: 10px var(--pad-chrome) 34px;
	}
	.head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding: 20px 0 6px;
	}
	.all {
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	@media (max-width: 860px) {
		.masthead,
		.recent {
			padding-left: 18px;
			padding-right: 18px;
		}
		.featured {
			grid-template-columns: 1fr;
		}
		.cell {
			border-right: none;
			border-bottom: 1.5px solid var(--rule-hard);
			padding: 24px 18px 28px;
		}
		.plate {
			min-height: 220px;
		}
	}
</style>
