<script lang="ts">
	// "If you remember one sentence" — the author's pick, in blue DISPLAY (§7).
	//
	// Both labels come from the catalogue rather than from here: the plate is
	// also exported to MDX (`$lib/mdx`), so a post can drop it in with nothing
	// but a sentence, and it must still speak the locale it is standing in.
	import Tag from '../ink/Tag.svelte';
	import { useI18n } from '$lib/i18n';

	let { sentence, attribution }: { sentence: string; attribution?: string } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t.article);
</script>

<div class="plate">
	<div class="head">
		<Tag on>{t.oneSentence}</Tag>
		<Tag>{attribution ?? t.authorsPick}</Tag>
	</div>
	<p>{sentence}</p>
</div>

<style>
	.plate {
		border: 1.5px solid var(--rule-hard);
		margin: 38px 0 34px;
	}
	.head {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		padding: 10px 16px;
		border-bottom: 1px solid var(--rule);
	}
	p {
		font-family: var(--display);
		font-weight: 500;
		font-size: 27px;
		line-height: 1.15;
		letter-spacing: -0.02em;
		text-transform: lowercase;
		color: var(--blue);
		margin: 0;
		padding: 26px 22px;
		text-wrap: pretty;
	}
	@media (max-width: 720px) {
		p {
			font-size: 22px;
			padding: 20px 16px;
		}
	}
</style>
