import { getResourcesForSlug } from '../resources.data.js';

/**
 * Auto-mark citations in the prose, the way `remark-glossary` marks terms.
 *
 * What makes this safe where a whole-corpus scan would not be: a citation only
 * ever has to match the handful of sources that already name *this* post in
 * `appearsIn`. A surname like "Brooks" is ambiguous across the library and
 * unambiguous inside one essay — the candidate set does the disambiguating.
 *
 * What counts as a mention, per source:
 *   · the full title, or the part before a colon
 *   · the first author's surname
 *
 * Only the first mention is marked. Ported from the production blog's
 * `remarkResources`; like the glossary plugin it emits `html` nodes rather than
 * MDX JSX nodes, because mdsvex has no JSX. The slug comes from the filename
 * rather than an option — the file *is* the post.
 */

/**
 * Author fields are `Surname, Given` for people and a plain name for
 * organisations. These words mean the field names an organisation, whose last
 * word (`Foundation`, `Office`) is not a surname.
 */
const ORG_WORDS =
	/\b(foundation|services?|engineering|contributors?|project|consortium|committee|institute|labs?|inc\.?|corp\.?|corporation|group|team|authors?|community|association|organization|office|society|board|council|others|eds?\.)\b/i;

/**
 * First author's surname, or null when the field is an organisation.
 *
 * @param {string} author @returns {string | null}
 */
function surnameOf(author) {
	const first = String(author ?? '').split(/;| & /)[0].trim();
	if (!first || ORG_WORDS.test(first)) return null;

	const words = first.split(/\s+/);
	const name = first.includes(',')
		? first.slice(0, first.indexOf(',')).trim()
		: words.length === 1
			? first
			: words.length <= 4
				? words[words.length - 1]
				: '';

	// Too short to be unambiguous, or not a proper noun.
	if (name.length < 4) return null;
	if (name[0] !== name[0].toUpperCase()) return null;
	return name;
}

/** @param {any} r @returns {Array<{ id: string; text: string }>} */
function patternsFor(r) {
	const out = [];
	const title = String(r.title ?? '').trim();
	if (title.length >= 8) out.push({ id: r.id, text: title });

	// `A Theory of X: Something` → also match the main title alone.
	const colon = title.indexOf(':');
	if (colon >= 8) out.push({ id: r.id, text: title.slice(0, colon).trim() });

	const surname = surnameOf(r.author);
	if (surname) out.push({ id: r.id, text: surname });

	return out;
}

const escapeRe = (/** @type {string} */ s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Whole-word across scripts — `\b` is ASCII-only and fails on Vietnamese titles. */
const boundary = (/** @type {string} */ body) => new RegExp(`(?<![\\p{L}\\p{N}])(?:${body})(?![\\p{L}\\p{N}])`, 'giu');

const SKIP_TYPES = new Set(['heading', 'code', 'inlineCode', 'html', 'link', 'linkReference']);

/**
 * `…/content/posts/001-float-memory-en.mdx` → `001-float-memory-en`.
 *
 * @param {string | undefined} filename @returns {string}
 */
export function slugOfFile(filename) {
	if (!filename) return '';
	const base = String(filename).split('/').pop() ?? '';
	return base.replace(/\.mdx$/, '');
}

/**
 * Every `<R>` id in the tree, in document order.
 *
 * Used twice: before marking, to find the ids the author placed by hand (those
 * sources are left alone), and after, to record the order the reader meets them
 * in. Reading order is the only thing the numbering can honestly follow, and
 * this walk is the only place that knows it.
 *
 * @param {any} node
 * @param {string[]} into
 */
function collectMarks(node, into) {
	if (node.type === 'html' && typeof node.value === 'string') {
		for (const m of node.value.matchAll(/<R\s+[^>]*id=["']([^"']+)["']/g)) {
			if (!into.includes(m[1])) into.push(m[1]);
		}
	}
	for (const child of node.children ?? []) collectMarks(child, into);
}

/** @param {any} node @param {RegExp} regex @param {Map<string,string>} idByText @param {Set<string>} seen */
function walk(node, regex, idByText, seen) {
	if (!Array.isArray(node.children)) return;

	for (let i = 0; i < node.children.length; ) {
		const child = node.children[i];

		if (child.type === 'text' && !SKIP_TYPES.has(node.type)) {
			const re = new RegExp(regex.source, regex.flags);
			const match = [...child.value.matchAll(re)].find((m) => {
				const id = idByText.get(m[0].toLowerCase());
				return id && !seen.has(id);
			});

			const id = match && idByText.get(match[0].toLowerCase());
			if (match && id) {
				seen.add(id);
				const end = match.index + match[0].length;
				// The prose keeps the matched words verbatim; the mark is a
				// superscript numeral appended right after them.
				node.children.splice(
					i,
					1,
					{ type: 'text', value: child.value.slice(0, end) },
					{ type: 'html', value: `<R id="${id}" />` },
					{ type: 'text', value: child.value.slice(end) }
				);
				i += 2;
				continue;
			}
		} else if (!SKIP_TYPES.has(child.type)) {
			walk(child, regex, idByText, seen);
		}

		i++;
	}
}

/**
 * Will this post get any citation marks? Used to decide the import.
 *
 * @param {string | undefined} filename @returns {boolean}
 */
export function citesAnything(filename) {
	return getResourcesForSlug(slugOfFile(filename)).length > 0;
}

export function remarkResources() {
	return (/** @type {any} */ tree, /** @type {any} */ file) => {
		const candidates = getResourcesForSlug(slugOfFile(file?.filename ?? file?.path));
		if (candidates.length === 0) return;

		/** @type {string[]} */
		const manual = [];
		collectMarks(tree, manual);
		const seen = new Set(manual);

		const patterns = candidates
			.filter((r) => !seen.has(r.id))
			.flatMap(patternsFor)
			// Longest first, so a full title beats a bare surname.
			.sort((a, b) => b.text.length - a.text.length);

		if (patterns.length > 0) {
			const idByText = new Map(patterns.map((p) => [p.text.toLowerCase(), p.id]));
			walk(tree, boundary(patterns.map((p) => escapeRe(p.text)).join('|')), idByText, seen);
		}

		// Re-read the finished tree rather than trusting the order things were
		// marked in: a hand-placed mark late in the prose must still count as
		// late, and only the tree knows where everything ended up.
		/** @type {string[]} */
		const order = [];
		collectMarks(tree, order);
		if (order.length === 0) return;

		// Onto the post's `metadata`, the same way reading-time.js publishes its
		// count — this is how the numbering reaches <R> and the bibliography.
		const fm = (file.data.fm ??= {});
		fm.citations ??= order;
	};
}
