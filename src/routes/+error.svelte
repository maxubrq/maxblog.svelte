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

	// The cat is for 404 only. A 500 is the site's fault, not a wrong turn, and
	// a cartoon apologising for it would be the wrong register.
	const lost = $derived(page.status === 404);
</script>

<section class:with-plate={lost}>
	<div class="said">
		<Tag on>Error {page.status}</Tag>
		<Headline text={t.error.title} accent={t.error.titleAccent} size={52} />
		{#if page.error?.message}
			<p>{page.error.message}</p>
		{/if}
		<a href={href(lang, '/writing')}>{t.error.back}</a>
	</div>

	{#if lost}
		<!-- Decorative: the headline beside it already says this, in the reader's
		     own language, and the sign in the picture only says it in English. -->
		<img src="/media/404-cat.webp" alt="" width="1024" height="1024" />
	{/if}
</section>

<style>
	section {
		padding: 60px var(--pad-chrome) 80px;
		max-width: 780px;
	}
	/* Two columns once there is a picture to place, and only then. */
	.with-plate {
		max-width: var(--index-max);
		display: grid;
		grid-template-columns: 1fr 340px;
		gap: 48px;
		align-items: center;
	}

	.said :global(h1) {
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

	/* The one full-colour image on the site, and it is allowed because it is a
	   drawing rather than a photograph — §6 is about photography, which has to
	   become a cyanotype plate to belong here. It still gets the hard border
	   every plate gets, so it reads as something pasted onto the page. */
	img {
		display: block;
		width: 100%;
		height: auto;
		border: 1.5px solid var(--rule-hard);
	}

	@media (max-width: 860px) {
		.with-plate {
			grid-template-columns: 1fr;
			gap: 32px;
			max-width: 520px;
		}
		/* Below the words: the sentence is the answer, the cat is the consolation. */
		img {
			order: 2;
		}
	}
</style>
