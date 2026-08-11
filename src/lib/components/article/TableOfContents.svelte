<script lang="ts">
	/**
	 * The contents as a list — the fore-edge spelled out, for when a reader wants
	 * to read the contents rather than feel them.
	 *
	 * Each entry carries its own reading minutes and a hairline gauge of how far
	 * into it the reader has come. What is behind you is struck through and faded;
	 * what is ahead keeps its weight.
	 *
	 * Ported from the production `TableOfContents.tsx`, with one fix: production
	 * runs its own `IntersectionObserver` for the active entry, which only fires
	 * once a heading *crosses* its band — so a reader who opens the contents
	 * without scrolling first sees a list with nothing marked. Here the active
	 * section comes from the article's own scroll measurement, which is also
	 * what the running head and the reading bar say. One answer to "where am I",
	 * given in three places.
	 */
	import type { TocItem } from '$lib/content/posts';
	import { useI18n } from '$lib/i18n';

	interface Props {
		items: TocItem[];
		/** Id of the heading the reader is under, from `reading-progress`. */
		activeSection: string;
		progress: number;
		/** Per-section fraction read, from the article's scroll measurement. */
		sectionProgress?: Record<string, number>;
		/** "N min left" beside the heading — a reader preference. */
		showTimeLeft?: boolean;
		onnavigate?: () => void;
	}

	let {
		items,
		activeSection,
		progress,
		sectionProgress = {},
		showTimeLeft = true,
		onnavigate
	}: Props = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t.article);

	const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

	const activeIdx = $derived(Math.max(0, items.findIndex((item) => item.id === activeSection)));
	const totalMin = $derived(items.reduce((sum, item) => sum + item.readMinutes, 0));

	/**
	 * What is left to read, in minutes: the sections still ahead, plus the part
	 * of the current one the reader has not reached. Interpolating inside the
	 * active section is what keeps the number moving while you read a long one.
	 */
	const minLeft = $derived.by(() => {
		if (items.length === 0) return 0;
		const past = items.slice(0, activeIdx).reduce((sum, item) => sum + item.readMinutes, 0);
		const inActive = items[activeIdx]?.readMinutes ?? 0;
		const span = 1 / items.length;
		const within = Math.min(1, Math.max(0, (progress - activeIdx * span) / span));
		return Math.max(0, Math.round((totalMin - past - within * inActive) * 10) / 10);
	});

	const minLeftLabel = $derived(
		minLeft < 0.4
			? t.nearlyDone
			: minLeft < 1
				? t.minLeft.replace('{n}', '< 1')
				: t.minLeft.replace('{n}', String(Math.round(minLeft)))
	);
</script>

<aside>
	<div class="head">
		<span class="label">{t.contents}</span>
		{#if items.length > 0 && showTimeLeft}
			<span class="left">{minLeftLabel}</span>
		{/if}
	</div>

	<ul>
		{#each items as item, i (item.id)}
			{@const isActive =
				activeSection === item.id || (activeSection === '' && i === 0 && progress < 0.05)}
			{@const isPast = i < activeIdx && activeSection !== ''}
			{@const sp = sectionProgress[item.id] ?? (isPast ? 1 : 0)}
			<li>
				<!-- The gauge only appears once there is something to show; an empty
				     track beside every unread entry is noise. -->
				{#if sp > 0.02}
					<span aria-hidden="true" class="gauge">
						<span
							class="gauge-fill"
							style="height:{Math.round(sp * 100)}%; opacity:{isActive ? 1 : 0.55}"
						></span>
					</span>
				{/if}
				<a
					href="#{item.id}"
					class:active={isActive}
					class:past={isPast}
					onclick={() => onnavigate?.()}
				>
					<span class="num">{ROMAN[i] ?? i + 1}.</span>
					<span class="text">{item.text}</span>
					<span class="min">{item.readMinutes}m</span>
				</a>
			</li>
		{/each}
	</ul>

	{#if items.length > 0}
		<div class="foot">
			<span>{t.total}</span>
			<span class="foot-value">{totalMin} {t.min}</span>
		</div>
	{/if}
</aside>

<style>
	aside {
		font-family: var(--body);
		font-size: 14px;
		width: 100%;
	}

	.head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 14px;
		padding-bottom: 10px;
		border-bottom: 1px solid var(--rule);
	}
	.label {
		font-family: var(--mono);
		text-transform: uppercase;
		letter-spacing: 0.14em;
		font-size: 10.5px;
		color: var(--muted);
	}
	.left {
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.04em;
		color: var(--blue);
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	li {
		position: relative;
	}

	.gauge {
		position: absolute;
		left: -14px;
		top: 4px;
		bottom: 4px;
		width: 2px;
		background: var(--rule);
		overflow: hidden;
	}
	.gauge-fill {
		display: block;
		width: 100%;
		background: var(--blue);
		transition:
			height 0.15s linear,
			opacity 0.2s;
	}

	a {
		color: var(--muted);
		text-decoration: none;
		display: grid;
		grid-template-columns: 22px 1fr auto;
		align-items: baseline;
		gap: 4px;
		line-height: 1.4;
		transition:
			color 0.2s,
			font-weight 0.2s;
	}
	a:hover {
		text-decoration: none;
		color: var(--ink);
	}
	a.active {
		color: var(--blue);
		font-weight: 500;
	}
	a.past {
		opacity: 0.5;
	}

	.num {
		font-family: var(--mono);
		letter-spacing: 0.06em;
		font-size: 10px;
		color: var(--faint);
	}
	a.active .num,
	a.active .min {
		color: var(--blue);
	}
	a.past .text {
		text-decoration: line-through;
		text-decoration-color: var(--rule);
	}
	.min {
		font-family: var(--mono);
		font-variant-numeric: tabular-nums;
		color: var(--muted);
		font-size: 10px;
	}

	.foot {
		margin-top: 16px;
		padding-top: 12px;
		border-top: 1px solid var(--rule);
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		font-family: var(--mono);
		font-size: 10px;
		color: var(--muted);
		text-transform: uppercase;
		letter-spacing: 0.14em;
	}
	.foot-value {
		font-variant-numeric: tabular-nums;
		letter-spacing: 0.04em;
		color: var(--ink);
	}
</style>
