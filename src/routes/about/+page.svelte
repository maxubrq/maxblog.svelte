<script lang="ts">
	// About — a notebook, kept in public. Colophon + the four subjects + elsewhere.
	import Headline from '$lib/components/ink/Headline.svelte';
	import Tag from '$lib/components/ink/Tag.svelte';
	import MetaRail from '$lib/components/ink/MetaRail.svelte';
	import { site, topics } from '$lib/site';

	const rail: [string, string][] = [
		['Who', site.author],
		['Since', '2024'],
		['Cadence', '~monthly'],
		['Type', 'Space Grotesk / Plex']
	];
</script>

<svelte:head>
	<title>about — {site.name}</title>
	<meta name="description" content="A notebook, kept in public." />
</svelte:head>

<section class="split">
	<div class="cell">
		<Tag>About / colophon</Tag>
		<Headline text="a notebook, kept in public." accent="public" mark="scribble" size={52} markWidth={210} />
	</div>
	<div class="ink-duo portrait"><span class="label">portrait plate</span></div>
</section>

<section class="body">
	<MetaRail items={rail} />

	<div class="measure">
		<p>
			I'm <strong>{site.author}</strong>. I write here about things that feel worth thinking about
			slowly: a physics problem that stuck with me, a piece of software I finally understood, a
			painting I kept coming back to, a sentence that would not leave me alone.
		</p>
		<p>
			Some essays come with a thing you can play with — a small simulation, a diagram that responds
			to a slider. I think of writing and interaction as the same craft: both are attempts to hand
			someone a thought in a form they can turn over.
		</p>

		<h2>what i write about</h2>
		<ul class="subjects">
			{#each topics as t (t.slug)}
				<li>
					<a href={`/topics/${t.slug}`}><Tag on>{t.name}</Tag></a>
					<div class="blurb">{t.blurb}</div>
				</li>
			{/each}
		</ul>

		<h2>elsewhere</h2>
		<ul class="elsewhere">
			{#each site.elsewhere as [k, v, href] (k)}
				<li>
					<Tag>{k}</Tag>
					<a {href}>{v}</a>
				</li>
			{/each}
		</ul>

		<p class="thanks">Cảm ơn bạn đã ghé qua. — Thanks for stopping by.</p>
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
	strong {
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
