<script lang="ts">
	/**
	 * The sections that are still only notes, printed as notes.
	 *
	 * The design is blunt about this and so is the component: a section that
	 * does not exist yet is shown as the questions the author has not answered,
	 * never as a heading with "coming soon" under it. If a `notes` section has
	 * nothing written down against it, nothing is printed — an empty admission
	 * is worse than silence.
	 */
	import Tag from '$lib/components/ink/Tag.svelte';
	import type { DraftSection } from '$lib/drafts';
	import { fill, useI18n } from '$lib/i18n';

	let { sections, at, travelling }: { sections: DraftSection[]; at: string; travelling: boolean } =
		$props();

	const i18n = useI18n();
	const t = $derived(i18n.t.openDraft);
	const open = $derived(sections.filter((s) => s.state === 'notes' && s.notes?.length));
</script>

{#each open as section (section.label)}
	<section class="unwritten">
		<div class="head">
			<Tag on>{section.label}</Tag>
			<Tag>{t.unwritten}{travelling ? ` · ${fill(t.asAt, { r: at })}` : ''}</Tag>
		</div>
		<div class="ink-hatch rule" aria-hidden="true"></div>
		<ul>
			{#each section.notes ?? [] as note (note)}
				<li>{note}</li>
			{/each}
		</ul>
	</section>
{/each}

<style>
	.unwritten {
		margin-top: 34px;
		border: 1.5px solid var(--rule);
		padding: 22px 24px;
	}
	.head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
	}
	.rule {
		height: 3px;
		margin: 12px 0 16px;
		opacity: 0.5;
	}
	ul {
		margin: 0;
		padding-left: 20px;
		display: grid;
		gap: 9px;
		font-family: var(--body);
		font-size: 16px;
		line-height: 1.6;
		color: var(--muted);
	}
</style>
