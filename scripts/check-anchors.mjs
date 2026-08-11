/**
 * Every section anchor in a post's table of contents must exist in the page
 * that was actually rendered. Run it after `pnpm build`:
 *
 *     node scripts/check-anchors.mjs
 *
 * Two independent things compute the same slug and neither can see the other:
 * `rehype-slug` stamps the ids on the rendered headings, and
 * `src/lib/content/toc.js` runs its own `github-slugger` over the markdown to
 * build the contents. If they ever drift, the fore-edge and the drawer point
 * at anchors that scroll nowhere — and nothing else in the build fails.
 *
 * The TOC never reaches the prerendered HTML (the instruments are client-side,
 * and a universal load re-runs in the browser rather than being serialised), so
 * this compiles each post through the same remark passes to read it back.
 */
import fs from 'node:fs';
import path from 'node:path';
import { compile } from 'mdsvex';
import remarkMath from 'remark-math';
import { readingTime } from '../src/lib/content/reading-time.js';
import { toc } from '../src/lib/content/toc.js';

const POSTS = 'content/posts';
const PRERENDERED = '.svelte-kit/output/prerendered/pages';

if (!fs.existsSync(PRERENDERED)) {
	console.error(`No prerendered output at ${PRERENDERED} — run \`pnpm build\` first.`);
	process.exit(2);
}

let broken = 0;

for (const file of fs.readdirSync(POSTS).filter((f) => f.endsWith('.mdx'))) {
	const slug = file.replace(/\.mdx$/, '');
	const source = fs.readFileSync(path.join(POSTS, file), 'utf8');

	const compiled = await compile(source, {
		extensions: ['.mdx'],
		remarkPlugins: [readingTime, remarkMath, toc]
	});
	const metadata = JSON.parse(compiled.code.match(/export const metadata = ([\s\S]*?);\n/)[1]);
	const items = metadata.toc ?? [];
	// A post is published under the locale its own frontmatter names.
	const lang = metadata.lang ?? 'en';

	const page = path.join(PRERENDERED, lang, 'writing', `${slug}.html`);
	if (!fs.existsSync(page)) {
		console.log(`${slug}: no prerendered page (draft?) — skipped`);
		continue;
	}
	const html = fs.readFileSync(page, 'utf8');

	const missing = items.filter((item) => !html.includes(`id="${item.id}"`));
	broken += missing.length;
	console.log(
		`${slug}: ${items.length} sections — ` +
			(missing.length ? `BROKEN: ${missing.map((m) => m.id).join(', ')}` : 'ok')
	);
}

if (broken) {
	console.error(`\n${broken} anchor(s) point at headings that do not exist.`);
	process.exit(1);
}
console.log('\nEvery section anchor resolves.');
