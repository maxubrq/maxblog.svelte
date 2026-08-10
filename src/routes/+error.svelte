<script lang="ts">
	import { page } from '$app/state';
	import Headline from '$lib/components/ink/Headline.svelte';
	import Tag from '$lib/components/ink/Tag.svelte';
</script>

<section>
	<Tag on>Error {page.status}</Tag>
	<Headline text="this page is not in the index." accent="not" size={52} />
	<p>{page.error?.message ?? 'Something is missing.'}</p>
	<a href="/writing">← back to the archive</a>
</section>

<style>
	section {
		padding: 60px var(--pad-chrome) 80px;
		max-width: 780px;
	}
	section :global(h1) {
		margin-top: 14px;
	}
	p {
		font-family: var(--mono);
		font-size: 12.5px;
		color: var(--muted);
		margin: 24px 0 20px;
	}
	a {
		font-family: var(--mono);
		font-size: 11.5px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
</style>
