<script lang="ts">
	/**
	 * The inline glossary mark: dotted blue, hover or click to open a card.
	 * The only element besides print sheets allowed a drop-shadow (§7, §8).
	 *
	 * Give it an `id` and it reads the entry out of `$lib/glossary` in the
	 * active locale — the same entry `/glossary` prints, so a definition is
	 * written once. The loose props stay for a one-off gloss that does not earn
	 * a dictionary entry; `id` wins whenever both are given.
	 *
	 *   <Term id="flow" />                        · from the dictionary
	 *   <Term id="flow">dòng chảy</Term>          · …with the sentence's own wording
	 *   <Term term="widget" def="a small thing" /> · ad-hoc, not in the dictionary
	 */
	import { TERMS, getGlossaryLocale } from '$lib/glossary';
	import { fill, href, useI18n } from '$lib/i18n';
	import type { Snippet } from 'svelte';

	let {
		id = '',
		term = '',
		kind = '',
		def = '',
		count = 0,
		href: link = '',
		children
	}: {
		id?: string;
		term?: string;
		kind?: string;
		def?: string;
		count?: number;
		href?: string;
		children?: Snippet;
	} = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t.glossary);

	const entry = $derived(id ? TERMS[id] : undefined);
	const localized = $derived(entry ? getGlossaryLocale(entry, i18n.lang) : null);

	// Every field: the dictionary first, the loose prop as the fallback.
	const shownTerm = $derived(localized?.term ?? term);
	const shownKind = $derived(localized?.pos ?? kind ?? t.termTag);
	const shownDef = $derived(localized?.short ?? def);
	const uses = $derived(localized ? localized.appearances.length : count);
	const fullEntry = $derived(link || (entry ? href(i18n.lang, '/glossary') : ''));

	let open = $state(false);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span class="wrap" onmouseenter={() => (open = true)} onmouseleave={() => (open = false)}>
	<button type="button" class="mark" aria-expanded={open} onclick={() => (open = !open)}>
		{#if children}{@render children()}{:else}{shownTerm}{/if}
	</button>
	{#if open}
		<span class="pop" role="tooltip">
			<span class="kind">{shownKind}</span>
			<span class="term">{shownTerm}</span>
			<span class="def">{shownDef}</span>
			<span class="foot">
				{#if uses > 0}
					<span class="count"
						>{fill(t.appearsInCount, {
							count: uses,
							essays: uses === 1 ? t.essay : t.essays
						})}</span
					>
				{:else}
					<span class="count"></span>
				{/if}
				{#if fullEntry}<a href={fullEntry}>{t.fullEntry}</a>{/if}
			</span>
		</span>
	{/if}
</span>

<style>
	.wrap {
		position: relative;
	}
	.mark {
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		color: var(--blue);
		font-weight: 500;
		border-bottom: 2px dotted var(--blue);
		cursor: help;
	}
	.pop {
		position: absolute;
		left: 0;
		top: 135%;
		z-index: 20;
		width: 290px;
		display: block;
		border: 1.5px solid var(--rule-hard);
		background: var(--paper);
		padding: 14px 16px;
		box-shadow: 0 10px 30px rgba(13, 13, 17, 0.16);
	}
	.kind {
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--blue);
	}
	.term {
		font-family: var(--display);
		font-weight: 700;
		font-size: 18px;
		letter-spacing: -0.02em;
		text-transform: lowercase;
		display: block;
		margin: 5px 0 7px;
	}
	.def {
		font-family: var(--body);
		font-size: 13px;
		line-height: 1.5;
		color: var(--ink);
		display: block;
	}
	.foot {
		display: flex;
		justify-content: space-between;
		border-top: 1px solid var(--rule);
		margin-top: 10px;
		padding-top: 8px;
	}
	.count,
	.foot a {
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.foot a {
		color: var(--blue);
		text-transform: none;
	}
</style>
