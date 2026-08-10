<script lang="ts">
	// Dark plate, MONO, blue prompt tokens. The only dark surface allowed (§1, §7).
	let {
		title = 'terminal · node',
		lines
	}: { title?: string; lines: { prompt?: string; text: string }[] } = $props();
</script>

<div class="term">
	<div class="head">{title}</div>
	<pre>{#each lines as l, i (i)}<span class="line"
			>{#if l.prompt}<span class="prompt">{l.prompt} </span>{/if}{l.text}
</span>{/each}</pre>
</div>

<style>
	.term {
		background: #0d0d11;
		color: #e9e9ec;
		border: 1.5px solid var(--rule-hard);
		margin: 0 0 34px;
	}
	.head {
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(233, 233, 236, 0.5);
		padding: 9px 14px;
		border-bottom: 1px solid rgba(233, 233, 236, 0.18);
	}
	pre {
		margin: 0;
		padding: 14px;
		font-family: var(--mono);
		font-size: 12.5px;
		line-height: 1.7;
		overflow-x: auto;
	}
	.prompt {
		color: #7f88ff;
	}
</style>
