/**
 * remark plugin — counts words in a post and writes `words` + `reading`
 * into mdsvex's frontmatter bag (`file.data.fm`), so both land on the
 * exported `metadata` of every .md file. Frontmatter wins if the author
 * set the values by hand.
 *
 * 220 wpm; code blocks are skipped (you don't read a code plate, you study it).
 */

export const WPM = 220;

/**
 * Every word of a subtree, with the plates left out — you do not *read* a code
 * block, you study it. Exported because `toc.js` has to count words the same
 * way this does; two counters that disagree would put a section's minutes at
 * odds with the post's own.
 *
 * @param {any} node @returns {string}
 */
export function text(node) {
	if (!node) return '';
	if (node.type === 'code' || node.type === 'html') return '';
	if (typeof node.value === 'string') return node.value;
	if (Array.isArray(node.children)) return node.children.map(text).join(' ');
	return '';
}

export function readingTime() {
	/** @param {any} tree @param {any} file */
	return (tree, file) => {
		const words = text(tree).split(/\s+/u).filter(Boolean).length;
		const fm = (file.data.fm ??= {});
		fm.words ??= words;
		fm.reading ??= Math.max(1, Math.round(words / WPM));
	};
}
