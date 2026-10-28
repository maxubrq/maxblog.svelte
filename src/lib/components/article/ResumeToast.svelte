<script lang="ts">
	/**
	 * Back to where you stopped (DESIGN.md §6.3). An essay you have already
	 * started opens at the section you were reading, and one line in the corner
	 * says so — with the way back to the top — then leaves after six seconds.
	 * It takes no room in the column: the essay is not interrupted to tell you
	 * that you were reading it.
	 *
	 * Device-local, like the memory it reads. A link that names a place (`#…`)
	 * wins: a reader who followed one wants that place, not their old one.
	 */
	import { useI18n } from '$lib/i18n';
	import { readEntry } from '$lib/reading-memory';

	let { slug }: { slug: string } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t.readingMemory);

	/** Enough to be worth returning to; two paragraphs are not a place. */
	const MIN_PCT = 0.05;
	const SHOW_MS = 6000;

	let visible = $state(false);

	$effect(() => {
		const entry = readEntry(slug);
		if (!entry || entry.finished || entry.pct <= MIN_PCT || location.hash) return;
		const target = entry.sectionId ? document.getElementById(entry.sectionId) : null;
		if (!target) return;
		target.scrollIntoView({ block: 'start' });
		visible = true;
		const timer = setTimeout(() => (visible = false), SHOW_MS);
		return () => clearTimeout(timer);
	});

	function toTop() {
		window.scrollTo({ top: 0 });
		visible = false;
	}
</script>

{#if visible}
	<div class="toast" role="status">
		<span>{t.resumed}</span>
		<button onclick={toTop}>{t.fromTop}</button>
	</div>
{/if}

<style>
	.toast {
		position: fixed;
		left: var(--s-2);
		bottom: var(--s-2);
		z-index: 70;
		display: flex;
		gap: var(--s-2);
		align-items: baseline;
		padding: var(--s-1) var(--s-2);
		background: var(--paper);
		border: 1.5px solid var(--rule-hard);
		font-size: var(--t-meta);
	}
	button {
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		color: var(--blue);
		font-size: var(--t-meta);
	}
	button:hover {
		text-decoration: underline;
	}
	/* Above the phone's contents bar rather than on it. */
	@media (max-width: 1179px) {
		.toast {
			bottom: 64px;
		}
	}
</style>
