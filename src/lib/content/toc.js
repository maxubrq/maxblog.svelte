import GithubSlugger from 'github-slugger';
import { WPM, text } from './reading-time.js';

/**
 * remark plugin — the table of contents, computed while the post compiles and
 * written into mdsvex's frontmatter bag (`file.data.fm.toc`), so it rides on
 * the exported `metadata` of every post next to `words` and `reading`.
 *
 * It is the data behind every reading instrument on the article page: the
 * fore-edge draws a section as a *run of leaves* whose length is its reading
 * time, and the drawer, the mobile bar and the running head all read the same
 * list. Which is why `readMinutes` is here and not computed in the browser —
 * the length of a section is a property of the text, not of the viewport.
 *
 * Only `##` becomes an entry (the same cut production makes): an `###` is a
 * turn inside a section, not a station a reader navigates between.
 *
 * **Anchors must not drift.** The ids come from `github-slugger`, fed *every*
 * heading in document order — including the `###`s that never become entries —
 * because that is exactly what `rehype-slug` does to the rendered page, and its
 * duplicate counter has to have seen the same headings in the same order. The
 * search corpus (`search.ts`) holds to the same rule for the same reason.
 *
 * @typedef {{ id: string, text: string, level: 2, readMinutes: number }} TocItem
 */

/**
 * A heading's text the way the *rendered* heading reads it — children
 * concatenated with no separator, which is what `hast-util-to-string` does
 * under rehype-slug. `text()` from reading-time joins with spaces, which is
 * right for counting words and wrong for a slug: `**one**two` must slug as
 * `onetwo`, not `one-two`.
 *
 * @param {any} node @returns {string}
 */
function label(node) {
	if (!node) return '';
	// Raw inline HTML: the tags themselves are not text, whatever they wrap is.
	if (node.type === 'html') return String(node.value ?? '').replace(/<[^>]*>/g, '');
	// `inlineMath` carries the source of the formula; rehype-katex has not run
	// yet, and rehype-slug sees this same string before it does.
	if (typeof node.value === 'string') return node.value;
	if (Array.isArray(node.children)) return node.children.map(label).join('');
	return '';
}

/** @param {any} node @returns {number} */
const words = (node) => text(node).split(/\s+/u).filter(Boolean).length;

export function toc() {
	/** @param {any} tree @param {any} file */
	return (tree, file) => {
		const slugger = new GithubSlugger();
		/** @type {Array<{ id: string, text: string, words: number }>} */
		const items = [];

		for (const node of tree.children ?? []) {
			if (node.type === 'heading') {
				const heading = label(node).trim();
				// Every heading advances the slugger; only `##` opens a section.
				const id = slugger.slug(heading);
				if (node.depth === 2) items.push({ id, text: heading, words: words(node) });
				continue;
			}
			// Everything under the open heading belongs to it. Prose before the
			// first `##` belongs to no section — it is the opening, and the
			// fore-edge starts at the first station.
			if (items.length > 0) items[items.length - 1].words += words(node);
		}

		const fm = (file.data.fm ??= {});
		fm.toc ??= items.map(
			(item) =>
				/** @type {TocItem} */ ({
					id: item.id,
					text: item.text,
					level: 2,
					// A section is never billed at less than a minute: the fore-edge
					// needs a run of leaves it is possible to aim at.
					readMinutes: Math.max(1, Math.ceil(item.words / WPM))
				})
		);
	};
}
