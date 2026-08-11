import { TERMS } from '../glossary.data.js';

/**
 * Auto-mark glossary terms in the prose.
 *
 * The reason the marks exist at all without the author writing them: a term is
 * a *word*, and a word can be recognised. The author writes plain prose; the
 * first mention of each dictionary term picks up a `<Term>` mark, and later
 * mentions are left alone so a page is not a field of dotted underlines.
 *
 * Ported from the production blog's `remarkGlossary`, with one structural
 * difference. That runs under MDX, so it injects `mdxJsxTextElement` nodes;
 * mdsvex has no such node type — a Svelte component in markdown is just inline
 * HTML — so this emits `html` nodes carrying the literal tag instead. The
 * import for `Term` is added by `inject-components.js`, which asks this module
 * what it is going to mark.
 */

/** Every spelling that resolves to an entry: the English term, and the Vietnamese one when it differs. */
const spellings = [];
for (const [id, entry] of Object.entries(TERMS)) {
	spellings.push({ id, term: entry.term });
	const vi = entry.vi?.term;
	if (vi && vi.toLowerCase() !== entry.term.toLowerCase()) spellings.push({ id, term: vi });
}

// Longest first, so `small-angle approximation` wins over `approximation`.
spellings.sort((a, b) => b.term.length - a.term.length);

/** @type {Record<string, string>} */
const idBySpelling = {};
for (const { id, term } of spellings) idBySpelling[term.toLowerCase()] = id;

const escapeRe = (/** @type {string} */ s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * `\b` is ASCII-only, which breaks on Vietnamese terms — `\bgóc\b` will not
 * match inside `một góc nhỏ`. Letter/number lookarounds mean the same thing
 * across scripts.
 */
const PATTERN = spellings.length
	? `(?<![\\p{L}\\p{N}])(?:${spellings.map((s) => escapeRe(s.term)).join('|')})(?![\\p{L}\\p{N}])`
	: null;

/**
 * Does this markdown mention any dictionary term at all? Used to decide the import.
 *
 * @param {string} content
 * @returns {boolean}
 */
export function mentionsTerm(content) {
	return PATTERN ? new RegExp(PATTERN, 'giu').test(content) : false;
}

/** Structures whose text is not running prose. */
const SKIP_TYPES = new Set(['heading', 'code', 'inlineCode', 'html', 'link', 'linkReference']);

/** Marking inside these would nest a mark, or mark something code-like. */
const SKIP_TAGS = /^<\s*\/?\s*(Term|R|CodeBlock|Terminal|pre|code)\b/i;

/** @param {any} node @returns {boolean} */
function skip(node) {
	return SKIP_TYPES.has(node.type);
}

/**
 * Every `<Term>` id in the tree, in document order.
 *
 * The twin of `collectMarks` in `remark-resources`, and used the same two ways:
 * before marking, to find the ids the author placed by hand — those words are
 * spoken for, and the pass must not mark them a second time somewhere else —
 * and after, to record the order the reader meets them in.
 *
 * @param {any} node
 * @param {string[]} into
 */
function collectMarks(node, into) {
	if (node.type === 'html' && typeof node.value === 'string') {
		for (const m of node.value.matchAll(/<Term\s+[^>]*id=["']([^"']+)["']/g)) {
			if (!into.includes(m[1])) into.push(m[1]);
		}
	}
	for (const child of node.children ?? []) collectMarks(child, into);
}

/**
 * Walk the tree, replacing the first mention of each unseen term with
 * text · mark · text. Only the first: after that the reader knows the word.
 *
 * @param {any} node
 * @param {Set<string>} seen
 * @param {string} pattern
 */
function walk(node, seen, pattern) {
	if (!Array.isArray(node.children)) return;

	for (let i = 0; i < node.children.length; ) {
		const child = node.children[i];

		if (child.type === 'text' && !skip(node)) {
			const re = new RegExp(pattern, 'giu');
			const match = [...child.value.matchAll(re)].find((m) => {
				const id = idBySpelling[m[0].toLowerCase()];
				return id && !seen.has(id);
			});

			if (match) {
				const id = idBySpelling[match[0].toLowerCase()];
				seen.add(id);
				const start = match.index;
				const end = start + match[0].length;

				// The matched words stay verbatim, wrapped by the mark, so the
				// sentence still reads exactly as written.
				const replacement = [
					{ type: 'text', value: child.value.slice(0, start) },
					{ type: 'html', value: `<Term id="${id}">` },
					{ type: 'text', value: match[0] },
					{ type: 'html', value: '</Term>' },
					{ type: 'text', value: child.value.slice(end) }
				];
				node.children.splice(i, 1, ...replacement);
				// Resume after the mark; the tail is rescanned for the next term.
				i += 4;
				continue;
			}
		} else if (!skip(child)) {
			walk(child, seen, pattern);
		}

		i++;
	}
}

export function remarkGlossary() {
	return (/** @type {any} */ tree, /** @type {any} */ file) => {
		if (!PATTERN) return;

		/** @type {string[]} */
		const manual = [];
		collectMarks(tree, manual);
		walk(tree, new Set(manual), PATTERN);

		// Re-read the finished tree rather than trusting the order things were
		// marked in: a hand-placed mark late in the prose must still count as
		// late, and only the tree knows where everything ended up.
		/** @type {string[]} */
		const order = [];
		collectMarks(tree, order);
		if (order.length === 0) return;

		// Onto the post's `metadata`, the same way the resources pass publishes
		// `citations` — this is how `GlossaryFootnote` learns what was marked
		// without collecting anything while the page renders.
		const fm = (file.data.fm ??= {});
		fm.terms ??= order;
	};
}

export { SKIP_TAGS };
