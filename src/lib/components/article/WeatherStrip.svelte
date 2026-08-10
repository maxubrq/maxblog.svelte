<script lang="ts">
	// "Thời tiết của bài" — the reading contract at the head of an article.
	// A scannable strip of facts, plus one hand-written honest line (never
	// invented). Difficulty shows as squares; the number is never printed.
	import type { Weather } from '$lib/content/posts';
	import { useI18n } from '$lib/i18n';

	let { weather }: { weather: Weather } = $props();

	const t = $derived(useI18n().t.weather);

	const chips = $derived(
		[
			[
				t.readTime,
				weather.oneSitting ? `${weather.time} · ${t.oneSitting}` : weather.time
			],
			weather.needFirst ? [t.needFirst, weather.needFirst] : null,
			weather.bestWhen ? [t.bestWhen, weather.bestWhen] : null
		].filter(Boolean) as [string, string][]
	);
</script>

<div class="strip">
	<div class="row">
		<div class="chip">
			<div class="k">{chips[0][0]}</div>
			<div class="v">{chips[0][1]}</div>
		</div>
		<div class="chip bordered">
			<div class="k">{t.load}</div>
			<div class="v">
				<span class="load">
					{#each Array(5) as _, i (i)}
						<span class="sq" class:on={i < weather.load}></span>
					{/each}
				</span>
			</div>
		</div>
		{#each chips.slice(1) as [k, v] (k)}
			<div class="chip bordered">
				<div class="k">{k}</div>
				<div class="v wrap">{v}</div>
			</div>
		{/each}
	</div>
	{#if weather.warn}
		<div class="warn">
			<span class="warn-k">{t.honest}</span>
			<span class="warn-v">{weather.warn}</span>
		</div>
	{/if}
</div>

<style>
	.strip {
		border: 1.5px solid var(--rule-hard);
		margin: 0 0 32px;
	}
	.row {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		padding: 13px 0;
		row-gap: 12px;
	}
	.chip {
		padding: 0 16px;
	}
	.bordered {
		border-left: 1px solid var(--rule);
	}
	.k {
		font-family: var(--mono);
		font-size: 9px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--faint);
		margin-bottom: 4px;
	}
	.v {
		font-family: var(--mono);
		font-size: 13px;
		color: var(--ink);
		white-space: nowrap;
	}
	.wrap {
		white-space: normal;
		max-width: 30ch;
		line-height: 1.35;
	}
	.load {
		display: inline-flex;
		gap: 2.5px;
		vertical-align: middle;
	}
	.sq {
		width: 11px;
		height: 11px;
		border: 1.5px solid var(--rule);
	}
	.sq.on {
		background: var(--blue);
		border-color: var(--blue);
	}
	.warn {
		border-top: 1px solid var(--rule);
		padding: 10px 16px;
		background: var(--blue);
		display: flex;
		gap: 10px;
		align-items: baseline;
	}
	.warn-k {
		font-family: var(--mono);
		font-size: 9.5px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--on-blue);
		opacity: 0.85;
		flex-shrink: 0;
	}
	.warn-v {
		font-family: var(--mono);
		font-size: 12.5px;
		line-height: 1.45;
		color: var(--on-blue);
	}
</style>
