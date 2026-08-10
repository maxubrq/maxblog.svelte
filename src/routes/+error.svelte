<script lang="ts">
	// Shown outside a locale layout too (a bad prefix), so it reads the locale
	// from the URL rather than context, and falls back to the default.
	import { page } from '$app/state';
	import Headline from '$lib/components/ink/Headline.svelte';
	import Tag from '$lib/components/ink/Tag.svelte';
	import { href, messages, type Lang } from '$lib/i18n';
	import { site } from '$lib/site';

	const lang = $derived(
		((page.params.lang ?? site.defaultLang) as Lang) in messages
			? ((page.params.lang ?? site.defaultLang) as Lang)
			: site.defaultLang
	);
	const t = $derived(messages[lang]);
</script>

<section>
	<Tag on>Error {page.status}</Tag>
	<Headline text={t.error.title} accent={t.error.titleAccent} size={52} />
	<p>{page.error?.message ?? ''}</p>
	<a href={href(lang, '/writing')}>{t.error.back}</a>
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
