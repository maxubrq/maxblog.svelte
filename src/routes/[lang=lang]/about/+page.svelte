<script lang="ts">
	// About — a notebook, kept in public. Colophon + the subjects + elsewhere.
	import Headline from '$lib/components/ink/Headline.svelte';
	import MetaRail from '$lib/components/ink/MetaRail.svelte';
	import Tag from '$lib/components/ink/Tag.svelte';
	import { href, useI18n } from '$lib/i18n';
	import { site, topics } from '$lib/site';

	const i18n = useI18n();
	const t = $derived(i18n.t);

	const rail = $derived(
		[
			[t.about.metaWho, site.author],
			[t.about.metaSince, '2024'],
			[t.about.metaCadence, t.about.metaCadenceVal],
			[t.about.metaType, t.about.metaTypeVal]
		] as [string, string][]
	);
</script>

<svelte:head>
	<title>{t.nav.about.toLowerCase()} — {site.name}</title>
	<meta name="description" content={t.about.heading} />
</svelte:head>

<section class="split">
	<div class="cell">
		<Tag>{t.about.label}</Tag>
		<Headline
			text={t.about.heading}
			accent={t.about.headingAccent}
			mark="scribble"
			size={52}
			markWidth={210}
		/>
	</div>
	<div class="ink-duo portrait"><span class="label">{t.about.portraitPlate}</span></div>
</section>

<section class="body">
	<MetaRail items={rail} />

	<div class="measure">
		<!-- The catalog carries a <strong> in the bio; the strings are ours, not input. -->
		<p>{@html t.about.bio1}</p>
		<p>{@html t.about.bio2}</p>

		<h2>{t.about.topicsHeading}</h2>
		<ul class="subjects">
			{#each topics as topic (topic.slug)}
				<li>
					<a href={href(i18n.lang, `/topics/${topic.slug}`)}><Tag on>{topic.name}</Tag></a>
					<div class="blurb">
						{t.topicBlurbs[topic.name as keyof typeof t.topicBlurbs] ?? ''}
					</div>
				</li>
			{/each}
		</ul>

		<h2>{t.about.elsewhereHeading}</h2>
		<ul class="elsewhere">
			{#each site.elsewhere as [key, value, url] (key)}
				<li>
					<Tag>{key}</Tag>
					<a href={url.startsWith('/') ? href(i18n.lang, url) : url}>{value}</a>
				</li>
			{/each}
		</ul>

		<p class="thanks">{t.about.farewell}</p>
	</div>
</section>

<style>
	.split {
		display: grid;
		grid-template-columns: 1fr 1fr;
		border-bottom: 1.5px solid var(--rule-hard);
	}
	.cell {
		padding: 46px 26px 40px var(--pad-chrome);
		border-right: 1.5px solid var(--rule-hard);
	}
	.cell :global(h1) {
		margin-top: 14px;
	}
	.portrait {
		min-height: 260px;
	}
	.label {
		position: absolute;
		inset: 0;
		z-index: 3;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #fff;
		opacity: 0.55;
	}

	.body {
		display: grid;
		grid-template-columns: 150px 1fr;
		gap: 34px;
		max-width: 900px;
		margin: 0 auto;
		padding: 36px var(--pad-measure) 20px;
	}
	.measure {
		max-width: var(--measure);
		min-width: 0;
	}
	.measure p {
		font-size: 18px;
		line-height: 1.62;
		margin: 0 0 1.2em;
	}
	.measure p :global(strong) {
		font-weight: 600;
	}
	h2 {
		font-family: var(--display);
		font-weight: 700;
		font-size: 24px;
		letter-spacing: -0.02em;
		text-transform: lowercase;
		margin: 1.4em 0 0.7em;
	}

	.subjects {
		list-style: none;
		padding: 0;
		margin: 0 0 1.6em;
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
	.subjects li {
		border-top: 1.5px solid var(--rule-hard);
		padding: 12px 16px 16px 0;
	}
	.subjects a:hover {
		text-decoration: none;
	}
	.blurb {
		font-size: 14.5px;
		line-height: 1.45;
		margin-top: 6px;
	}

	.elsewhere {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.elsewhere li {
		display: grid;
		grid-template-columns: 110px 1fr;
		gap: 20px;
		padding: 11px 0;
		border-top: 1px solid var(--rule);
	}
	.elsewhere a {
		font-family: var(--mono);
		font-size: 13px;
	}

	.thanks {
		font-family: var(--mono);
		font-size: 12px;
		color: var(--muted);
		border-top: 1.5px solid var(--rule-hard);
		padding-top: 16px;
		margin: 30px 0 0 !important;
	}

	@media (max-width: 860px) {
		.split {
			grid-template-columns: 1fr;
		}
		.cell {
			border-right: none;
			border-bottom: 1.5px solid var(--rule-hard);
			padding: 30px 18px 26px;
		}
		.body {
			grid-template-columns: 1fr;
			gap: 20px;
			padding: 26px 18px 20px;
		}
		.subjects {
			grid-template-columns: 1fr;
		}
	}
</style>
