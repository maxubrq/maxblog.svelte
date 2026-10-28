<script lang="ts">
	// mdsvex layout — wraps the markdown body of every post in the prose measure.
	// Element styling lives here (h2/p/ul/code…) so posts stay plain markdown.
	import type { Snippet } from 'svelte';

	// A draft can be frontmatter only; mdsvex then passes no body at all.
	let { children }: { children?: Snippet } = $props();
</script>

<div class="prose">
	{@render children?.()}
</div>

<style>
	/* The reading surface, and the only place on the site the reader's own
	   text size applies (A− / A+ in the header). The chrome keeps its sizes. */
	.prose {
		font-family: var(--body);
		font-size: var(--reading-fs, var(--t-body));
		line-height: 1.62;
		counter-reset: section;
	}

	/* ── Page furniture (DIGITAL_EDITORIAL_DESIGN.md §4) ──────────────── */

	/* The section number, as a 13px label on its own line above each h2: `01`,
	   `02`… — the same count the running head and the contents in the margin
	   read out, since the contents are the essay's h2s and nothing else. It
	   was specified to hang in the margin column, but that column is where the
	   sticky contents ride, and the two collided; above the head it can never
	   collide with anything. */
	.prose :global(h2) {
		counter-increment: section;
	}
	.prose :global(h2)::before {
		content: counter(section, decimal-leading-zero);
		display: block;
		margin-bottom: 0.3em;
		font-family: var(--body);
		font-size: 13px;
		font-weight: 400;
		line-height: 1.4;
		color: var(--muted);
		font-variant-numeric: tabular-nums;
	}

	/* The end mark: an 8px square of ink-blue at the end of the last line,
	   in the line, where a magazine prints "END". Drawn, because the text
	   face has no ■. Only when a paragraph really is the last thing — an
	   essay that ends on a figure ends on the figure. */
	.prose > :global(p:last-child)::after {
		content: '';
		display: inline-block;
		width: 0.45em;
		height: 0.45em;
		margin-left: 0.4em;
		background: var(--blue);
		vertical-align: 0.05em;
	}


	/* Nothing in the prose reaches left of the text column. Beside the essay
	   the grid's margin column belongs to the sticky contents (ContentsRail);
	   a pull quote hung into it and the section numbers once did, and both
	   slid under the list. Reach right, into the outer column, if anything
	   must (sidenotes do). */

	/* mdsvex output is not scoped to this component, hence :global. */
	.prose :global(p) {
		margin: 0 0 1.4em;
		text-wrap: pretty;
	}

	/* Heading sizes are `em` of the prose so they ride the reader's text size;
	   at the default 18px they land exactly on the scale (DESIGN.md §3.2):
	   h2 1.444em = 26px (Deck), h3 / h4 1em = 18px, set apart by weight alone.

	   The air is set in px-equivalents of the body line (29px): two lines above
	   a section head, half a line under it, so the head reads as the top of
	   what follows rather than the end of what came before. Check changes in
	   px, not em: em is a multiple of the heading's *own* size.

	     h2  2.23em → 58px above · 0.56em → 14px below
	     h3  1.6em  → 29px above · 0.4em  → 7px below */
	.prose :global(h2) {
		font-family: var(--deck);
		font-weight: 600;
		font-size: 1.444em;
		line-height: 1.25;
		margin: 2.23em 0 0.56em 0;
	}
	.prose :global(h3),
	.prose :global(h4),
	.prose :global(h5) {
		font-family: var(--body);
		font-weight: 600;
		font-size: 1em;
		line-height: 1.62;
		margin: 1.6em 0 0.4em 0;
	}
	/* Below h3 there is no new size to give, only a quieter voice. */
	.prose :global(h4),
	.prose :global(h5) {
		color: var(--muted);
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
		color: var(--muted);
	}

	/* Weight *and* colour: `--ink-strong` is `inherit` on paper, so this is the
	   same 600 it always was there, and only the ink themes lift it clear of the
	   body text. See the token's note in app.css. */
	.prose :global(strong) {
		font-weight: 600;
		color: var(--ink-strong);
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
		font-size: var(--t-meta);
		line-height: 1.66;
		padding: var(--s-2);
		margin: 0 0 var(--s-3);
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
		color: var(--muted);
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

	/* Prose cells wrap: a table of sentences has to fit the column, and only a
	   table that still cannot (many short columns) scrolls in its own box —
	   the page never scrolls sideways either way. */
	.prose :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 0 0 var(--s-3);
		display: block;
		overflow-x: auto;
	}
	.prose :global(th),
	.prose :global(td) {
		white-space: normal;
		overflow-wrap: break-word;
	}
	.prose :global(th) {
		font-weight: 600;
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
</style>
