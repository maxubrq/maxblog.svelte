<script lang="ts">
	// "If you remember one sentence" — the author's pick, in blue DISPLAY (§7).
	import Tag from '../ink/Tag.svelte';

	let { sentence, attribution = "the author’s pick" }: { sentence: string; attribution?: string } =
		$props();
</script>

<div class="plate">
	<div class="head">
		<Tag on>If you remember one sentence</Tag>
		<Tag>{attribution}</Tag>
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
