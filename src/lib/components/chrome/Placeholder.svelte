<script lang="ts">
	/**
	 * The room that is not built yet.
	 *
	 * Every nav door leads somewhere, even before there is anything behind it —
	 * a door that 404s is worse than a door that says "not yet". Replace the
	 * whole route when the real room arrives; nothing else imports this.
	 */
	import Headline from '$lib/components/ink/Headline.svelte';
	import Tag from '$lib/components/ink/Tag.svelte';
	import { href, useI18n } from '$lib/i18n';
	import { site } from '$lib/site';

	let { name }: { name: string } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t);
</script>

<svelte:head>
	<title>{name.toLowerCase()} — {site.name}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section>
	<Tag on>{name} / {t.placeholder.label}</Tag>
	<Headline text={t.placeholder.title} accent={t.placeholder.titleAccent} size={52} />
	<p>{t.placeholder.body}</p>
	<a href={href(i18n.lang, '/writing')}>{t.placeholder.back}</a>
</section>

<style>
	section {
		padding: 60px var(--pad-chrome) 80px;
		max-width: 780px;
	}
	section :global(h1) {
		margin-top: 14px;
	}
	p {
		font-family: var(--mono);
		font-size: 12.5px;
		line-height: 1.7;
		color: var(--muted);
		margin: 24px 0 20px;
	}
	a {
		font-family: var(--mono);
		font-size: 11.5px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
</style>
