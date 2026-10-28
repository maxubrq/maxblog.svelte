<script lang="ts">
	// "If you remember one sentence" — the author's pick, the first thing after
	// the essay ends (DESIGN.md §6.7). No box and no blue: it is the reward for
	// reaching the end, and it is set like a sentence, in ink, at section size.
	//
	// The label comes from the catalogue rather than from here: the plate is
	// also exported to MDX (`$lib/mdx`), so a post can drop it in with nothing
	// but a sentence, and it must still speak the locale it is standing in.
	import { useI18n } from '$lib/i18n';

	let { sentence, attribution }: { sentence: string; attribution?: string } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t.article);
</script>

<section class="appendix">
	<p class="appendix-head">{t.oneSentence}</p>
	<p class="sentence">{sentence}</p>
	{#if attribution}<p class="by">{attribution}</p>{/if}
</section>

<style>
	.sentence {
		font-family: var(--deck);
		font-weight: 600;
		font-size: var(--t-h2);
		line-height: 1.25;
		color: var(--ink);
		margin: var(--s-2) 0 0;
		text-wrap: pretty;
	}
	.by {
		font-size: var(--t-meta);
		color: var(--muted);
		margin: var(--s-1) 0 0;
	}
</style>
