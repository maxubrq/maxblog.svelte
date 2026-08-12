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
	/* The reading surface, and the only place on the site the reader's own type
	   settings apply. The chrome keeps its sizes and its grotesque: a running
	   head set in 26px serif is not what "I want bigger text" means. */
	.prose {
		font-family: var(--reading-font, var(--body));
		font-size: var(--reading-fs, 18px);
		line-height: var(--reading-lh, 1.62);
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

	/* Heading *sizes* are `em` of the prose, so they ride the reader's text
	   size: at 26px body copy a fixed 22px `h3` would be smaller than the
	   paragraph under it, and the hierarchy would invert itself. 1.67em and
	   1.22em are exactly 30px and 22px at the default 18px.

	   Heading *spacing* is `em` on both sides, so the air around a heading
	   scales with it: a new section opens with more room than a sub-point
	   inside one, and that ordering is what tells a reader how deep they just
	   went. The multipliers are large on purpose, and the small headings need
	   the largest of all — `em` is a multiple of the heading's *own* size, so a
	   modest-looking figure collapses on an 11px mono label. That was the
	   original bug here: at 0.6em the `h4` was left with 6.6px of air and sat on
	   its own text while the `h2` got 15px. Check any change to these in px, not
	   in em, or the same trap closes again.

	     h2  2.5em → 75px above · 2em   → 60px below
	     h3  1.9em → 42px above · 1.5em → 33px below
	     h4  3.1em → 34px above · 2.5em → 27px below
	     h5  2.4em → 26px above · 2em   → 22px below */
	.prose :global(h2) {
		font-family: var(--display);
		font-weight: 700;
		font-size: 1.67em;
		letter-spacing: -0.03em;
		line-height: 1.05;
		text-transform: lowercase;
		margin: 2.5em 0 2em 0;
	}
	.prose :global(h3) {
		font-family: var(--display);
		font-weight: 600;
		font-size: 1.22em;
		letter-spacing: -0.02em;
		text-transform: lowercase;
		margin: 1.9em 0 1.5em 0;
	}
	.prose :global(h4) {
		font-family: var(--mono);
		font-weight: 500;
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--muted);
		margin: 3.1em 0 2.5em 0;
	}
	/* An `h5` is rare enough that no post has one yet, but a post that grows one
	   should not fall through to the browser's default serif bold. */
	.prose :global(h5) {
		font-family: var(--mono);
		font-weight: 500;
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--faint);
		margin: 2.4em 0 2em 0;
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

	/* One size down on a phone — but only as the *floor* the reader's own
	   setting starts from, never as a cap on it. */
	@media (max-width: 720px) {
		.prose {
			font-size: var(--reading-fs, 17px);
		}
	}
</style>
