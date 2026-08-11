<script lang="ts">
	/**
	 * What is behind an outbound link, before the reader leaves for it.
	 *
	 * A link in an essay asks the reader to gamble a page-load on a title they
	 * cannot see. The card is the answer: host, title, description — enough to
	 * decide without going. Fetched once per URL on first hover and cached for
	 * the life of the page, so a link mentioned twice costs one request.
	 *
	 * The link itself is never blocked on the fetch. It is a real anchor from
	 * the first paint, and if the endpoint is slow, unreachable, or the site has
	 * no metadata, the card falls back to the bare host — which is still true.
	 */
	import { useI18n } from '$lib/i18n';
	import type { Snippet } from 'svelte';

	let { href, children }: { href: string; children: Snippet } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t.linkPreview);

	interface Preview {
		title: string | null;
		description: string | null;
		hostname: string;
		url: string;
	}

	/**
	 * Module scope, so it is shared by every link on the page and survives a
	 * client-side navigation. A reader hovering the same citation twice asks the
	 * server once.
	 */
	const cache = new Map<string, Preview>();

	let open = $state(false);
	let data = $state<Preview | null>(null);
	let loading = $state(false);
	let flip = $state(false);
	let anchor = $state<HTMLElement | null>(null);

	/** The host, from the URL itself — known without asking anyone. */
	const host = $derived.by(() => {
		try {
			return new URL(href).hostname.replace(/^www\./, '');
		} catch {
			return href;
		}
	});

	const CARD_W = 310;

	function enter() {
		open = true;

		// Flip to the right edge when the card would run off the page — the same
		// rule `Term`'s card follows.
		if (anchor) {
			const box = anchor.getBoundingClientRect();
			flip = box.left + CARD_W > window.innerWidth - 16;
		}

		const hit = cache.get(href);
		if (hit) {
			data = hit;
			return;
		}
		if (loading) return;

		loading = true;
		fetch(`/api/link-preview?url=${encodeURIComponent(href)}`)
			.then((r) => r.json())
			.then((d: Preview) => {
				cache.set(href, d);
				data = d;
			})
			.catch(() => {
				// The card keeps its host line and says nothing it cannot support.
			})
			.finally(() => (loading = false));
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
	class="wrap"
	bind:this={anchor}
	onmouseenter={enter}
	onmouseleave={() => (open = false)}
	onfocusin={enter}
	onfocusout={() => (open = false)}
>
	<a class="link" {href} target="_blank" rel="noopener noreferrer">{@render children()}</a>

	{#if open}
		<span class="card" class:flip role="tooltip">
			<span class="host">{data?.hostname ?? host}</span>

			{#if data?.title}
				<span class="title">{data.title}</span>
			{/if}

			{#if data?.description}
				<span class="desc"
					>{data.description.length > 130
						? data.description.slice(0, 130) + '…'
						: data.description}</span
				>
			{/if}

			{#if !data && loading}
				<span class="desc quiet">{t.loading}</span>
			{:else if data && !data.title && !data.description}
				<!-- No metadata, or the fetch failed. The URL is what is left, and
				     it is not nothing. -->
				<span class="desc quiet">{href.length > 52 ? href.slice(0, 52) + '…' : href}</span>
			{/if}

			<span class="foot">
				<span class="kind">{t.external}</span>
				<span class="open">{t.open}</span>
			</span>
		</span>
	{/if}
</span>

<style>
	.wrap {
		position: relative;
		/* The link and its card are one object: a wrap here keeps the card
		   anchored to the first line when the text breaks. */
		white-space: nowrap;
	}
	/**
	 * Dotted, where a glossary term is dotted and a citation is a numeral: three
	 * kinds of aside, three marks, one blue. `cursor: alias` says "this goes
	 * somewhere else" before the card has had time to.
	 */
	.link {
		color: var(--blue);
		border-bottom: 1px dotted var(--blue);
		padding-bottom: 1px;
		cursor: alias;
		white-space: normal;
	}
	.link:hover {
		text-decoration: none;
		border-bottom-style: solid;
	}

	/* The same sheet as `Term`'s card — hard rule, paper, the one drop-shadow
	   §7/§8 allows. A second floating panel should not invent a second look. */
	.card {
		position: absolute;
		left: 0;
		top: calc(100% + 8px);
		z-index: 50;
		display: block;
		width: 310px;
		white-space: normal;
		background: var(--paper);
		border: 1.5px solid var(--rule-hard);
		border-left: 2px solid var(--blue);
		box-shadow: 0 10px 30px rgba(13, 13, 17, 0.16);
		padding: 13px 15px 11px;
	}
	.card.flip {
		left: auto;
		right: 0;
	}

	.host {
		display: block;
		font-family: var(--mono);
		font-size: 9.5px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--muted);
		margin-bottom: 9px;
	}
	.title {
		display: block;
		font-family: var(--display);
		font-weight: 600;
		font-size: 14.5px;
		line-height: 1.35;
		letter-spacing: -0.01em;
		margin-bottom: 7px;
	}
	.desc {
		display: block;
		font-size: 12.5px;
		line-height: 1.55;
		color: var(--muted);
		margin-bottom: 9px;
	}
	.desc.quiet {
		font-style: italic;
	}

	.foot {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 10px;
		border-top: 1px solid var(--rule);
		padding-top: 8px;
		font-family: var(--mono);
		font-size: 9.5px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}
	.kind {
		color: var(--muted);
	}
	.open {
		color: var(--blue);
	}
</style>
