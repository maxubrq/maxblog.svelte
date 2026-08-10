<script lang="ts">
	// mdsvex layout — wraps the markdown body of every post in the prose measure.
	// Element styling lives here (h2/p/ul/code…) so posts stay plain markdown.
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="prose">
	{@render children()}
</div>

<style>
	.prose {
		font-family: var(--body);
		font-size: 18px;
		line-height: 1.62;
	}

	/* mdsvex output is not scoped to this component, hence :global. */
	.prose :global(p) {
		margin: 0 0 1.4em;
		text-wrap: pretty;
	}

	/* Drop cap on the lead paragraph (§2). */
	.prose :global(> p:first-of-type::first-letter) {
		font-family: var(--display);
		font-weight: 700;
		font-size: 3.1em;
		float: left;
		line-height: 0.78;
		margin: 0.04em 0.12em 0 0;
		color: var(--blue);
	}

	.prose :global(h2) {
		font-family: var(--display);
		font-weight: 700;
		font-size: 30px;
		letter-spacing: -0.03em;
		line-height: 1.05;
		text-transform: lowercase;
		margin: 1.7em 0 0.5em;
	}
	.prose :global(h3) {
		font-family: var(--display);
		font-weight: 600;
		font-size: 22px;
		letter-spacing: -0.02em;
		text-transform: lowercase;
		margin: 1.5em 0 0.45em;
	}
	.prose :global(h4) {
		font-family: var(--mono);
		font-weight: 500;
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--muted);
		margin: 1.8em 0 0.6em;
	}

	.prose :global(ul),
	.prose :global(ol) {
		margin: 0 0 1.4em;
		padding-left: 1.2em;
	}
	.prose :global(li) {
		margin-bottom: 0.5em;
	}
	.prose :global(li::marker) {
		color: var(--blue);
		font-family: var(--mono);
		font-size: 0.85em;
	}

	.prose :global(strong) {
		font-weight: 600;
	}
	.prose :global(em) {
		font-style: italic;
	}

	/* Plain blockquote — the blue panel is <PullQuote>, this is the quieter one.
	   `:not(.pull)` matters: this selector is more specific than a component's
	   own scoped rules, so without the exclusion it would repaint PullQuote's
	   text muted-italic on top of the blue field. */
	.prose :global(blockquote:not(.pull)) {
		margin: 0 0 1.6em;
		padding: 0 0 0 20px;
		border-left: 1.5px solid var(--rule-hard);
		font-style: italic;
		color: var(--muted);
	}

	.prose :global(code) {
		font-family: var(--mono);
		font-size: 0.86em;
		background: var(--paper2);
		border: 1px solid var(--rule);
		padding: 0.1em 0.35em;
	}

	/* A bare fenced block still reads as a plate, without the header row. */
	.prose :global(pre) {
		border: 1.5px solid var(--rule-hard);
		background: transparent;
		font-family: var(--mono);
		font-size: 12.5px;
		line-height: 1.66;
		padding: 16px 14px;
		margin: 0 0 34px;
		overflow-x: auto;
	}
	.prose :global(pre code) {
		background: none;
		border: none;
		padding: 0;
		font-size: inherit;
	}

	/* Highlighter (§7): keywords + numbers blue, strings muted, comments faint.
	   No second hue — the plate is a printed object, not an IDE. */
	.prose :global(.token.keyword),
	.prose :global(.token.number),
	.prose :global(.token.boolean),
	.prose :global(.token.builtin),
	.prose :global(.token.class-name) {
		color: var(--blue);
	}
	.prose :global(.token.string),
	.prose :global(.token.template-string),
	.prose :global(.token.char),
	.prose :global(.token.regex) {
		color: var(--muted);
	}
	.prose :global(.token.comment),
	.prose :global(.token.prolog),
	.prose :global(.token.doctype) {
		color: var(--faint);
		font-style: italic;
	}
	.prose :global(.token.operator),
	.prose :global(.token.punctuation) {
		color: var(--muted);
	}
	.prose :global(.token.function) {
		color: var(--ink);
		font-weight: 500;
	}

	/* KaTeX — rendered at build time. Display math scrolls in its own box
	   rather than pushing the page sideways. */
	.prose :global(.katex-display) {
		overflow-x: auto;
		overflow-y: hidden;
		padding: 6px 0;
		margin: 1.4em 0;
	}
	.prose :global(.katex) {
		font-size: 1.02em;
	}

	/* Wide tables scroll inside their own box — the page never scrolls sideways. */
	.prose :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 0 0 34px;
		font-size: 15px;
		display: block;
		overflow-x: auto;
		white-space: nowrap;
	}
	.prose :global(th) {
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		text-align: left;
		border-bottom: 1.5px solid var(--rule-hard);
		padding: 8px 12px 8px 0;
	}
	.prose :global(td) {
		border-bottom: 1px solid var(--rule);
		padding: 10px 12px 10px 0;
		vertical-align: top;
	}

	.prose :global(img) {
		display: block;
		width: 100%;
		margin: 0 0 8px;
	}

	.prose :global(hr) {
		border-top: 1px solid var(--rule);
	}

	@media (max-width: 720px) {
		.prose {
			font-size: 17px;
		}
	}
</style>
