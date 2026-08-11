<script lang="ts">
	// About — a notebook, kept in public. Colophon + the subjects + elsewhere.
	import Headline from '$lib/components/ink/Headline.svelte';
	import MetaRail from '$lib/components/ink/MetaRail.svelte';
	import Tag from '$lib/components/ink/Tag.svelte';
	import { href, useI18n } from '$lib/i18n';
	import { AUTHOR_PORTRAIT, cloudinary, srcsetFor } from '$lib/images';
	import { site } from '$lib/site';
	import { TOPICS_ORDER, TOPIC_CONTENT, getTopicLocale } from '$lib/topics';

	const i18n = useI18n();
	const t = $derived(i18n.t);

	// The doorway list, in the reader's locale — the same taglines the hub prints.
	const rooms = $derived(
		TOPICS_ORDER.map((id) => ({ id, ...getTopicLocale(TOPIC_CONTENT[id], i18n.lang) }))
	);

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
	<div class="ink-screen portrait">
		<img
			class="fill"
			src={cloudinary(AUTHOR_PORTRAIT, { width: 1080, halftone: 'fine' })}
			srcset={srcsetFor(AUTHOR_PORTRAIT, { halftone: 'fine' })}
			sizes="(max-width: 860px) 100vw, 50vw"
			alt=""
			decoding="async"
		/>
	</div>
</section>

<section class="body">
	<MetaRail items={rail} />

	<div class="measure">
		<!-- The catalog carries a <strong> in the bio; the strings are ours, not input. -->
		<p>{@html t.about.bio1}</p>
		<p>{@html t.about.bio2}</p>

		<h2>{t.about.topicsHeading}</h2>
		<ul class="subjects">
			{#each rooms as room (room.id)}
				<li>
					<a href={href(i18n.lang, `/topics/${room.id}`)}><Tag on>{room.name}</Tag></a>
					<div class="blurb">{room.tagline}</div>
				</li>
			{/each}
		</ul>

		<!-- The doorway to the vault — the only way in, which is the point. It is
		     kept out of the nav deliberately: a private cabinet with a menu entry
		     is not private, it is a section. -->
		<a class="vault-door" href={href(i18n.lang, '/vault')}>
			<span class="door-head">
				<Tag on>{t.about.vaultTagLeft}</Tag>
				<Tag>{t.about.vaultTagRight}</Tag>
			</span>
			<span class="door-body">
				<span class="door-title">{t.about.vaultTitle}</span>
				<span class="door-blurb">{t.about.vaultBlurb}</span>
			</span>
		</a>

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

	/**
	 * Wider than an essay, and deliberately not tied to `--measure`. That token
	 * is the *reader's* article width (700/820/940 by preference), and letting
	 * it govern here made a colophon obey a setting meant for prose — the page
	 * got narrower because someone chose a narrow measure for reading essays.
	 * The proportions are production's: a 270px rail and the rest, at 90% of the
	 * page, which lands the content around three-quarters of the screen.
	 */
	.body {
		display: grid;
		grid-template-columns: 270px minmax(0, 1.2fr);
		gap: 34px;
		max-width: 90%;
		margin: 0 auto;
		/* The page ends on real air, not on the last rule. */
		padding: 36px var(--pad-measure) 120px;
	}
	.measure {
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

	/* A whole cell that inverts on hover, like a doorway on the topics hub —
	   the page's one invitation, and it should feel like a door. */
	.vault-door {
		display: block;
		margin: 1.6em 0 0;
		border: 1.5px solid var(--rule-hard);
		color: var(--ink);
		transition: background 0.14s ease;
	}
	.vault-door:hover {
		background: var(--panel-blue);
		border-color: var(--panel-blue);
		text-decoration: none;
	}
	.door-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
		flex-wrap: wrap;
		padding: 10px 16px;
		border-bottom: 1px solid var(--rule);
	}
	.door-body {
		display: block;
		padding: 20px 16px 22px;
	}
	.door-title {
		display: block;
		font-family: var(--display);
		font-weight: 700;
		font-size: 30px;
		letter-spacing: -0.03em;
		text-transform: lowercase;
		line-height: 1;
		color: var(--blue);
	}
	.door-blurb {
		display: block;
		font-size: 14px;
		line-height: 1.5;
		color: var(--muted);
		margin-top: 8px;
		max-width: 44ch;
	}
	.vault-door:hover .door-title,
	.vault-door:hover .door-blurb,
	.vault-door:hover :global(.tag) {
		color: var(--on-blue);
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

	/* Qualified by the element, or `.measure p` outranks it and the sign-off
	   prints at 18px like body copy — which is what was happening, and why the
	   margin below used to need `!important` to be heard at all. */
	.measure p.thanks {
		font-family: var(--mono);
		font-size: 12px;
		line-height: 1.6;
		color: var(--muted);
		border-top: 1.5px solid var(--rule-hard);
		padding-top: 16px;
		margin: 30px 0 0;
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
			/* 90% of a phone is two useless 5% gutters. */
			max-width: none;
			padding: 26px 18px 80px;
		}
		.subjects {
			grid-template-columns: 1fr;
		}
	}
</style>
