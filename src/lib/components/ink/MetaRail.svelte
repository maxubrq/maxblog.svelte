<script lang="ts">
	// The margin rail: MONO label over MONO value, under a hard rule (§3).
	let { items }: { items: [string, string][] } = $props();
</script>

<aside>
	<div class="rail">
		{#each items as [k, v] (k)}
			<div class="row">
				<div class="k">{k}</div>
				<div class="v">{v}</div>
			</div>
		{/each}
	</div>
</aside>

<style>
	.rail {
		border-top: 1.5px solid var(--rule-hard);
		padding-top: 10px;
		position: sticky;
		top: 24px;
	}
	.row {
		margin-bottom: 12px;
	}
	.k {
		font-family: var(--mono);
		font-size: 9.5px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.v {
		font-family: var(--mono);
		font-size: 12px;
		color: var(--ink);
		margin-top: 2px;
	}
</style>
