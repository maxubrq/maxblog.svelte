<script lang="ts">
	/**
	 * A past revision, rebuilt — and the scar layer over it.
	 *
	 * This stands in for the article's own prose only while the reader is
	 * travelling; the current revision always renders as the real compiled
	 * essay, components and all. What is drawn here is the text as it stood at
	 * that save, marked against the save before it: a struck run is text that
	 * was cut *at this revision* and is still readable, an underlined run
	 * arrived here.
	 *
	 * With the scar layer off, struck runs are not merely dimmed — they are not
	 * rendered, which is exactly what the author would have seen that day.
	 * A paragraph that only lost text collapses to nothing and is dropped, so
	 * the reader is not left with an empty rule.
	 */
	import type { DraftParagraph } from '$lib/drafts';

	let { body, scars }: { body: DraftParagraph[]; scars: boolean } = $props();

	const shown = $derived(
		body.filter(
			(p) => p.kind === 'fleuron' || scars || p.segs.some((s) => s.s !== 'del' && s.t.trim())
		)
	);
	const touched = (p: DraftParagraph) => scars && p.segs.some((s) => s.s);
	/**
	 * A paragraph that arrived whole. Underlining every line of it would be
	 * noise — the rule in the margin already says it is new here, and the
	 * underline exists to point at a run *inside* prose that stayed.
	 */
	const wholly = (p: DraftParagraph) => p.segs.length === 1 && p.segs[0].s === 'ins';
</script>

<div class="revision">
	{#each shown as para, i (i)}
		{#if para.kind === 'fleuron'}
			<p class="fleuron" aria-hidden="true">❧</p>
		{:else}
			{@const tag = para.kind}
			<div class="block" class:touched={touched(para)}>
				<p class:aside={tag === 'aside'} class:quote={tag === 'quote'}>
					{#each para.segs as seg, j (j)}
						{#if seg.s === 'del'}
							{#if scars}<del>{seg.t}</del>{/if}
						{:else if seg.s === 'ins' && scars && !wholly(para)}
							<ins>{seg.t}</ins>
						{:else}
							<span>{seg.t}</span>
						{/if}
					{/each}
				</p>
			</div>
		{/if}
	{/each}
</div>

<style>
	.revision {
		font-family: var(--reading-font, var(--body));
	}
	.block + .block,
	.block + .fleuron {
		margin-top: 22px;
	}
	p {
		margin: 0;
		font-size: 18.5px;
		line-height: 1.72;
		color: var(--ink);
	}

	/* A paragraph the revision touched carries a rule in the margin, so the eye
	   finds the changes without having to read for them. */
	.touched p {
		border-left: 2px solid var(--blue);
		padding-left: 16px;
		margin-left: -18px;
	}

	del {
		text-decoration: line-through;
		text-decoration-color: var(--blue);
		text-decoration-thickness: 1.5px;
		color: var(--faint);
	}
	ins {
		text-decoration: none;
		box-shadow: inset 0 -2px 0 var(--blue);
	}

	.aside {
		font-size: 14.5px;
		line-height: 1.6;
		color: var(--muted);
		border-left: 1.5px solid var(--rule);
		padding-left: 14px;
	}
	.quote {
		font-family: var(--display);
		font-size: 22px;
		line-height: 1.35;
		letter-spacing: -0.02em;
	}
	.fleuron {
		margin: 30px 0;
		text-align: center;
		color: var(--faint);
	}

	@media (max-width: 640px) {
		p {
			font-size: 17px;
		}
		.touched p {
			margin-left: 0;
			padding-left: 12px;
		}
	}
</style>
