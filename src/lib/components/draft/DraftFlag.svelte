<script lang="ts">
	/**
	 * The flag at the head of an open draft — what this page is, said once,
	 * before the reader has spent anything on it.
	 *
	 * It says two different things depending on where the reader is standing,
	 * because being at an old revision is a different fact about the text than
	 * the piece being unfinished. `InkDraft.jsx` makes the same split.
	 */
	import { useI18n } from '$lib/i18n';

	let { travelling = false }: { travelling?: boolean } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t.openDraft);
</script>

<div class="flag">
	<div class="ink-hatch band" aria-hidden="true"></div>
	<div class="say">
		<span class="label">{travelling ? t.flagPast : t.flagNow}</span>
		<p>{travelling ? t.bodyPast : t.bodyNow}</p>
	</div>
</div>

<style>
	.flag {
		display: flex;
		align-items: stretch;
		border: 1.5px solid var(--blue);
	}
	.band {
		width: 46px;
		flex: none;
	}
	.say {
		flex: 1;
		padding: 13px 16px;
		border-left: 1.5px solid var(--blue);
	}
	.label {
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--blue);
		font-weight: 500;
	}
	p {
		margin: 6px 0 0;
		max-width: 56ch;
		font-family: var(--body);
		font-size: 14.5px;
		line-height: 1.55;
		color: var(--ink);
	}

	@media (max-width: 640px) {
		.band {
			width: 22px;
		}
	}
</style>
