/**
 * Svelte preprocessor — makes the article kit available inside every `.mdx`
 * file without a per-file import block, the way MDX providers work in React.
 *
 * Runs BEFORE mdsvex (preprocessors run in order), so it edits raw markdown:
 * it prepends an instance `<script>` with the kit imports, or splices the
 * imports into the file's own `<script>` if it already has one. Names the post
 * already defines win, because its own statements come after ours.
 */

const KIT = '$lib/mdx';

/** The tags a post may use with no import. Keep in sync with src/lib/mdx.ts. */
export const KIT_COMPONENTS = [
	'Callout',
	'CodeBlock',
	'DiagramPlate',
	'Figure',
	'Fleuron',
	'FloatBuilder',
	'FloatExplorer',
	'FloatSpacing',
	'FloatVsFixed',
	'Footnote',
	'OneSentence',
	'PullQuote',
	'Sidenote',
	'Term',
	'Terminal',
	'WeatherStrip'
];

const IMPORT_LINE = `import { ${KIT_COMPONENTS.join(', ')} } from '${KIT}';`;

/** @returns {import('svelte/compiler').PreprocessorGroup} */
export function injectComponents({ extensions = ['.mdx'] } = {}) {
	return {
		name: 'inject-mdx-components',
		markup({ content, filename }) {
			if (!filename || !extensions.some((ext) => filename.endsWith(ext))) return;
			// Only inject what the post actually mentions — keeps each post's bundle honest.
			const used = KIT_COMPONENTS.filter((name) =>
				new RegExp(`<${name}[\\s/>]`).test(content)
			);
			if (used.length === 0) return;

			const line = `\timport { ${used.join(', ')} } from '${KIT}';`;
			const openTag = content.match(/<script(?![^>]*\bmodule\b)(?![^>]*context=)[^>]*>/);

			if (openTag && openTag.index !== undefined) {
				const at = openTag.index + openTag[0].length;
				return { code: content.slice(0, at) + `\n${line}` + content.slice(at) };
			}

			// No script of its own: add one AFTER the frontmatter, which mdsvex only
			// recognises at byte 0.
			const fm = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
			const at = fm ? fm[0].length : 0;
			return {
				code: content.slice(0, at) + `<script>\n${line}\n</script>\n\n` + content.slice(at)
			};
		}
	};
}

export { IMPORT_LINE };
