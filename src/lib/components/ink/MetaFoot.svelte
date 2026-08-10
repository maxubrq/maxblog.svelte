<script lang="ts">
	// End-of-article grid of [key, value] under a 1.5px hard rule (§7).
	let { items }: { items: [string, string][] } = $props();
</script>

<div class="foot" style="--cols: {items.length}">
	{#each items as [k, v] (k)}
		<div>
			<div class="k">{k}</div>
			<div class="v">{v}</div>
		</div>
	{/each}
</div>

<style>
	.foot {
		display: grid;
		grid-template-columns: repeat(var(--cols), 1fr);
		gap: 24px;
		border-top: 1.5px solid var(--rule-hard);
		padding-top: 12px;
		margin-top: 40px;
	}
	.k {
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		font-weight: 500;
		color: var(--ink);
	}
	.v {
		font-family: var(--mono);
		font-size: 10.5px;
		color: var(--muted);
		margin-top: 3px;
	}
	@media (max-width: 720px) {
		.foot {
			grid-template-columns: 1fr 1fr;
			gap: 16px;
		}
	}
</style>
