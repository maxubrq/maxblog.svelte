/**
 * remark plugin — counts words in a post and writes `words` + `reading`
 * into mdsvex's frontmatter bag (`file.data.fm`), so both land on the
 * exported `metadata` of every .md file. Frontmatter wins if the author
 * set the values by hand.
 *
 * 220 wpm; code blocks are skipped (you don't read a code plate, you study it).
 */

const WPM = 220;

/** @param {any} node @returns {string} */
function text(node) {
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
