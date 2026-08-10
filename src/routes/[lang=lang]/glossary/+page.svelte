<script lang="ts">
	// Glossary — placeholder room; see Placeholder.svelte.
	import Placeholder from '$lib/components/chrome/Placeholder.svelte';
	import { useI18n } from '$lib/i18n';

	const i18n = useI18n();
</script>

<Placeholder name={i18n.t.nav.glossary} />
