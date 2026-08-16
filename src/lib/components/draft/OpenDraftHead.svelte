<script lang="ts">
	/**
	 * The head of an open draft: the flag, where each section stands, the rail
	 * of revisions, the note the author pinned to the one you are standing at,
	 * and the switch for the scar layer.
	 *
	 * It owns no state — the page does, because the prose below has to change
	 * with it. Everything shown is read from the revision at `index`, including
	 * the section table and the word count: standing at an old save and reading
	 * today's verdict about it would be the one dishonesty this feature exists
	 * to avoid.
	 */
	import Tag from '$lib/components/ink/Tag.svelte';
	import DraftFlag from './DraftFlag.svelte';
	import SectionStates from './SectionStates.svelte';
	import TimeRail from './TimeRail.svelte';
	import type { DraftHistory } from '$lib/drafts';
	import { fill, useI18n } from '$lib/i18n';
	import { lastSeen } from '$lib/reading-memory';

	let {
		history,
		index,
		scars,
		onpick,
		onscars
	}: {
		history: DraftHistory;
		index: number;
		scars: boolean;
		onpick: (i: number) => void;
		onscars: (on: boolean) => void;
	} = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t.openDraft);

	const rev = $derived(history.revisions[index]);
	const travelling = $derived(rev.r !== history.current);
	const ago = $derived(lastSeen(Date.parse(rev.date), i18n.t.readingMemory, i18n.lang));
	const stamp = $derived(
		new Date(rev.date).toLocaleDateString(i18n.lang === 'vi' ? 'vi-VN' : 'en-US', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		})
	);
	/** The legend sentence, cut at its `{struck}` / `{added}` slots. */
	const legend = $derived(
		t.scarsExplainOn.split(/(\{struck\}|\{added\})/).map((part, at) => ({
			at,
			mark: part === '{struck}' ? 'del' : part === '{added}' ? 'ins' : null,
			text: fill(part, { r: rev.r })
		}))
	);
	const started = $derived(
		new Date(history.startedAt).toLocaleDateString(i18n.lang === 'vi' ? 'vi-VN' : 'en-US', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		})
	);
</script>

<section class="head flow-hide">
	<!-- Two columns, one row: what this page is and how to move through it on
	     the left, where the piece stands on the right. One block rather than two
	     stacked ones because the flag alone is short — beside a table of five
	     sections it would leave its column empty for most of its height. -->
	<div class="left">
		<DraftFlag {travelling} />

		<div class="machine">
			<div class="machine-head">
				<Tag on>{t.pull}</Tag>
				<Tag>{fill(t.railCount, { edits: history.edits, saved: history.revisions.length })}</Tag>
			</div>

			<TimeRail {history} {index} {onpick} />

			<div class="note">
				<div class="when">
					<span class="stamp">{rev.r} · {stamp}</span>
					<span class="ago">· {ago}</span>
				</div>
				<p class="said">
					“{rev.note}”
					<span class="said-tag">{t.notedThen}</span>
				</p>
			</div>

			<div class="scars">
				<button class="toggle" class:on={scars} onclick={() => onscars(!scars)}>
					{scars ? t.scarsOn : t.scarsOff}
				</button>
				{#if travelling}
					<button class="back" onclick={() => onpick(history.revisions.length - 1)}>
						{t.backToNow}
					</button>
				{/if}
			</div>

			<p class="scars-say">
				{#if scars}
					<!-- The legend is a sample, not a description: the two words the
					     sentence names are drawn the way the layer draws them. It is split
					     on its own placeholders rather than on the words, so neither
					     locale's phrasing can break it. -->
					{#each legend as piece (piece.at)}
						{#if piece.mark === 'del'}<del>{t.struck}</del>
						{:else if piece.mark === 'ins'}<ins>{t.added}</ins>
						{:else}{piece.text}{/if}
					{/each}
				{:else}
					{fill(t.scarsExplainOff, { r: rev.r })}
				{/if}
			</p>
		</div>
	</div>

	<div class="stands">
		<div class="stands-head">
			<Tag on>{t.whereItStands}</Tag>
			{#if travelling}<Tag>{fill(t.asAt, { r: rev.r })}</Tag>{/if}
		</div>
		<SectionStates sections={rev.sections} />
		<dl class="facts">
			<div><dt><Tag>{t.started}</Tag></dt><dd>{started}</dd></div>
			<div><dt><Tag>{t.edits}</Tag></dt><dd>{rev.n}</dd></div>
			<div>
				<dt><Tag>{t.lengthNow}</Tag></dt>
				<dd>
					{fill(t.wordsN, { n: rev.words.toLocaleString(i18n.lang === 'vi' ? 'vi-VN' : 'en-US') })}
				</dd>
			</div>
			<div><dt><Tag>{t.finishBy}</Tag></dt><dd>{history.promise ?? t.noPromise}</dd></div>
		</dl>
	</div>
</section>

<style>
	.head {
		border-top: 1.5px solid var(--rule-hard);
		padding-top: 24px;
		margin-top: 26px;
		display: grid;
		grid-template-columns: 1fr 380px;
		gap: 44px;
		align-items: start;
	}
	.stands {
		border-left: 1.5px solid var(--rule-hard);
		padding-left: 22px;
	}
	.stands-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
		margin-bottom: 12px;
	}
	.facts {
		margin: 16px 0 0;
		display: grid;
		gap: 7px;
	}
	.facts > div {
		display: flex;
		justify-content: space-between;
		gap: 12px;
	}
	dt,
	dd {
		margin: 0;
	}
	dd {
		font-family: var(--mono);
		font-size: 11px;
		color: var(--ink);
	}

	/* No bottom rule: the title block's own hard rule closes the whole head, and
	   two of them a few pixels apart read as an empty band, not a division. */
	.machine {
		border-top: 1.5px solid var(--rule);
		padding-top: 18px;
		margin-top: 26px;
	}
	.machine-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
	}

	/* One column: the stamp is a caption on the note, not a column beside it —
	   at this width a 150px gutter left the quote too narrow to read. */
	.note {
		border-top: 1px solid var(--rule);
		padding-top: 12px;
	}
	.when {
		display: flex;
		gap: 6px;
		align-items: baseline;
		margin-bottom: 6px;
	}
	.stamp {
		font-family: var(--mono);
		font-size: 12px;
		letter-spacing: 0.08em;
		color: var(--blue);
	}
	.ago {
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.08em;
		color: var(--faint);
	}
	.said {
		margin: 0;
		font-family: var(--body);
		font-size: 15px;
		line-height: 1.55;
		color: var(--ink);
		font-style: italic;
	}
	.said-tag {
		margin-left: 10px;
		font-style: normal;
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--faint);
	}
	.back {
		border: 1.5px solid var(--blue);
		background: transparent;
		color: var(--blue);
		cursor: pointer;
		padding: 8px 14px;
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	.back:hover {
		background: var(--blue);
		color: var(--on-blue);
	}

	.scars {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-top: 16px;
	}
	.toggle {
		flex: none;
		border: 1.5px solid var(--blue);
		background: transparent;
		color: var(--blue);
		cursor: pointer;
		padding: 8px 14px;
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}
	.toggle.on {
		background: var(--panel-blue);
		color: var(--on-blue);
	}
	.scars-say {
		margin: 10px 0 0;
		font-family: var(--body);
		font-size: 14px;
		color: var(--muted);
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

	@media (max-width: 900px) {
		.head {
			grid-template-columns: 1fr;
			gap: 26px;
		}
		.stands {
			border-left: none;
			padding-left: 0;
		}
		.note {
			grid-template-columns: 1fr;
			gap: 10px;
		}
		.back {
			justify-self: start;
		}
		.scars {
			flex-direction: column;
			align-items: flex-start;
			gap: 10px;
		}
	}
</style>
