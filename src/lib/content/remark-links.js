/**
 * Wrap outbound links in `<LinkPreview>`.
 *
 * Production does this in `mdx-components.tsx`, where MDX lets you replace the
 * `a` element with a component. mdsvex has no such map — a markdown link is
 * compiled straight to an `<a>` — so the swap has to happen while the tree is
 * still markdown, the same way `remark-glossary` and `remark-resources` place
 * their marks. Like those, it emits `html` nodes carrying the literal tag,
 * because mdsvex has no JSX node type.
 *
 * **Only outbound links.** An internal link goes somewhere the reader can
 * already see the shape of, and a preview of your own page is a card telling
 * you what you are about to be told. `http:` / `https:` only; anchors, mailto:
 * and relative paths pass through untouched.
 *
 * ## Where it sits in the pipeline
 *
 * After `remarkGlossary` and `remarkResources`, and that ordering is
 * load-bearing. Both of those skip `link` nodes — a term should not pick up a
 * dotted underline inside a link, and a citation numeral should not be planted
 * in one. If this pass ran first, the link's text would no longer be inside a
 * `link` node by the time they walked the tree, and both would happily mark it.
 */

/** @param {string} url @returns {boolean} */
function isExternal(url) {
	return /^https?:\/\//i.test(url ?? '');
}

/**
 * Does this markdown carry an outbound link? Used by `inject-components` to
 * decide the import, before mdsvex has run.
 *
 * @param {string} content
 * @returns {boolean}
 */
export function hasExternalLink(content) {
	// Markdown links, and bare autolinks in angle brackets.
	return /\]\(\s*https?:\/\//i.test(content) || /<https?:\/\/[^>\s]+>/i.test(content);
}

/** Attribute-safe: the URL is authored, but it still ends up inside quotes. */
const escapeAttr = (/** @type {string} */ s) => String(s).replace(/"/g, '&quot;');

/** @param {any} node */
function walk(node) {
	if (!Array.isArray(node.children)) return;

	for (let i = 0; i < node.children.length; i++) {
		const child = node.children[i];

		if (child.type === 'link' && isExternal(child.url)) {
			// The link's own children are kept verbatim — the text may carry
			// emphasis or code, and the preview wraps the link, it does not
			// reformat it.
			node.children.splice(
				i,
				1,
				{ type: 'html', value: `<LinkPreview href="${escapeAttr(child.url)}">` },
				...child.children,
				{ type: 'html', value: '</LinkPreview>' }
			);
			// Skip the tags and the children we just spliced in.
			i += child.children.length + 1;
			continue;
		}

		walk(child);
	}
}

export function remarkLinks() {
	return (/** @type {any} */ tree) => {
		walk(tree);
	};
}
