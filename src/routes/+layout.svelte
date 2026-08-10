<script lang="ts">
	// Root shell: stylesheets only. The page chrome lives in [lang]/+layout.svelte
	// so it can speak the active locale.
	import 'katex/dist/katex.min.css';
	import '../app.css';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

{@render children()}
