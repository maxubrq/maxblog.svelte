<script lang="ts">
	/**
	 * About, as the colophon of the publication (DIGITAL_EDITORIAL_DESIGN.md §8).
	 * On the page grid: the statement at display size; the portrait in the
	 * margin beside the introduction; then each block with its label hung in the
	 * margin — what I write about, the vault, elsewhere — and the colophon last,
	 * where a book keeps it.
	 */
	import { href, useI18n } from '$lib/i18n';
	import { AUTHOR_PORTRAIT, cloudinary, srcsetFor } from '$lib/images';
	import { site } from '$lib/site';
	import { TOPICS_ORDER, TOPIC_CONTENT, getTopicLocale } from '$lib/topics';

	const i18n = useI18n();
	const t = $derived(i18n.t);

	// The rooms in the reader's locale — the same taglines the hub prints.
	const rooms = $derived(
		TOPICS_ORDER.map((id) => ({ id, ...getTopicLocale(TOPIC_CONTENT[id], i18n.lang) }))
	);

	const colophon = $derived(
		[
			[t.about.metaWho, site.author],
			[t.about.metaSince, '2024'],
			[t.about.metaCadence, t.about.metaCadenceVal],
			[t.about.metaType, t.about.metaTypeVal],
			[t.about.metaGrid, t.about.metaGridVal],
			[t.about.metaColour, t.about.metaColourVal]
		] as [string, string][]
	);
</script>

<svelte:head>
	<title>{t.nav.about} — {site.name}</title>
	<meta name="description" content={t.about.heading} />
</svelte:head>

<!-- The opener: one statement, the page's one display line. -->
<header class="grid opener">
	<p class="hang g-margin label">{t.nav.about}</p>
	<h1 class="display g-wide">{t.about.heading}</h1>
	<div class="g-spread g-rule"></div>
</header>

<!-- The portrait in the margin, whole — a face is not a strip — beside the
     introduction in the text column. -->
<section class="grid block intro">
	<div class="g-margin portrait ink-screen">
		<img
			class="fill"
			src={cloudinary(AUTHOR_PORTRAIT, { width: 560, halftone: 'fine' })}
			srcset={srcsetFor(AUTHOR_PORTRAIT, { halftone: 'fine' })}
			sizes="(min-width: 1280px) 280px, 100vw"
			alt=""
			decoding="async"
		/>
	</div>
	<div class="g-text prose-ish">
		<!-- The catalog carries a <strong> in the bio; the strings are ours, not input. -->
		<p>{@html t.about.bio1}</p>
		<p>{@html t.about.bio2}</p>
	</div>
</section>

<section class="grid block ruled">
	<h2 class="hang g-margin">{t.about.topicsHeading}</h2>
	<ul class="g-text subjects">
		{#each rooms as room (room.id)}
			<li>
				<a href={href(i18n.lang, `/topics/${room.id}`)}>
					<span class="name">{room.name}</span>
					<span class="blurb">{room.tagline}</span>
				</a>
			</li>
		{/each}
	</ul>
</section>

<!-- The vault: the only way in, which is the point — a private cabinet with a
     menu entry is not private, it is a section. -->
<section class="grid block ruled">
	<h2 class="hang g-margin">{t.about.vaultLabel}</h2>
	<div class="g-text">
		<p class="blurb-body">{t.about.vaultBlurb}</p>
		<a class="enter" href={href(i18n.lang, '/vault')}>{t.about.vaultEnter}</a>
	</div>
</section>

<section class="grid block ruled">
	<h2 class="hang g-margin">{t.about.elsewhereHeading}</h2>
	<dl class="g-text table">
		{#each site.elsewhere as [key, value, url] (key)}
			<div>
				<dt>{key}</dt>
				<dd><a href={url.startsWith('/') ? href(i18n.lang, url) : url}>{value}</a></dd>
			</div>
		{/each}
	</dl>
</section>

<!-- The colophon, last, as in a book. -->
<section class="grid block ruled end">
	<h2 class="hang g-margin">{t.about.colophon}</h2>
	<div class="g-text">
		<dl class="table">
			{#each colophon as [key, value] (key)}
				<div>
					<dt>{key}</dt>
					<dd>{value}</dd>
				</div>
			{/each}
		</dl>
		<p class="credit">{t.about.credit}</p>
		<p class="credit">{t.about.farewell}</p>
	</div>
</section>

<style>
	.opener {
		align-items: baseline;
		padding-top: var(--s-4);
	}
	.opener .label {
		grid-row: 1;
	}
	.opener h1 {
		grid-row: 1;
	}
	.opener > .g-rule {
		margin-top: var(--s-3);
	}

	.block {
		padding-top: var(--s-3);
		align-items: start;
	}
	.block > * {
		grid-row: 1;
	}
	.ruled {
		margin-top: var(--s-3);
	}
	.ruled::before {
		content: '';
		grid-column: 1 / 11;
		grid-row: 1;
		margin-top: calc(var(--s-3) * -1);
		border-top: 1.5px solid var(--rule-hard);
	}
	.end {
		padding-bottom: var(--s-4);
	}

	.portrait {
		aspect-ratio: 4 / 5;
	}
	.prose-ish p {
		margin: 0 0 1em;
	}

	.subjects {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--s-2) var(--s-3);
	}
	.subjects a {
		display: grid;
		gap: 2px;
		color: var(--ink);
		text-decoration: none;
	}
	.subjects a:hover .name {
		color: var(--blue);
	}
	.name {
		font-weight: 600;
	}
	.blurb {
		color: var(--muted);
	}

	.blurb-body {
		margin: 0 0 var(--s-1);
	}

	.table {
		margin: 0;
	}
	.table div {
		display: grid;
		grid-template-columns: 9em 1fr;
		gap: var(--s-2);
		padding: var(--s-1) 0;
		border-top: 1px solid var(--rule);
	}
	.table div:first-child {
		border-top: none;
		padding-top: 0;
	}
	dt {
		font-size: var(--t-meta);
		color: var(--muted);
		padding-top: 0.25em;
	}
	dd {
		margin: 0;
	}
	.credit {
		font-size: var(--t-meta);
		color: var(--muted);
		margin: var(--s-2) 0 0;
		max-width: 60ch;
	}

	@media (max-width: 1279px) {
		.opener .label,
		.opener h1,
		.block > * {
			grid-row: auto;
		}
		.ruled::before {
			grid-column: 1 / -1;
		}
		.block > .hang {
			margin-bottom: var(--s-2);
		}
		.portrait {
			max-width: 280px;
			margin-bottom: var(--s-3);
		}
	}
	@media (max-width: 900px) {
		.opener {
			padding-top: var(--s-3);
		}
		.subjects {
			grid-template-columns: 1fr;
		}
	}
</style>
