import adapter from '@sveltejs/adapter-vercel';
import { mdsvex } from 'mdsvex';
import { fileURLToPath } from 'node:url';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import rehypeSlug from 'rehype-slug';
import { injectComponents } from './src/lib/content/inject-components.js';
import { readingTime } from './src/lib/content/reading-time.js';
import { remarkGlossary } from './src/lib/content/remark-glossary.js';
import { remarkResources } from './src/lib/content/remark-resources.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// `.mdx` files in content/ are markdown + Svelte components, via mdsvex.
	// Same extension as the production blog, so posts migrate without renaming.
	extensions: ['.svelte', '.mdx'],
	preprocess: [
		// Order matters: inject the kit's imports into the raw markdown first,
		// then let mdsvex compile the file.
		injectComponents(),
		mdsvex({
			extensions: ['.mdx'],
			// Absolute — mdsvex resolves a relative layout against each post's own dir.
			layout: { _: fileURLToPath(new URL('./src/lib/content/PostBody.svelte', import.meta.url)) },
			// mdsvex bundles remark-parse 8, so tables come for free and the math
			// plugins must be the pre-micromark generation (remark-math 3 /
			// rehype-katex 4). `$x$` and `$$…$$` are rendered at build time, so no
			// KaTeX JS ships to the reader — only its stylesheet.
			// remarkResources runs after remarkGlossary so a citation is never
			// marked inside a <Term> that the glossary pass just created; and
			// readingTime runs first, on the prose as the author wrote it.
			remarkPlugins: [readingTime, remarkMath, remarkGlossary, remarkResources],
			// rehype-slug gives every heading the `id` the search index points at
			// (github-slugger's rule; the corpus runs the same slugger, so the two
			// cannot drift). It goes before KaTeX so a heading with math slugs off
			// the source text rather than the <span class="katex"> tree.
			rehypePlugins: [rehypeSlug, [rehypeKatex, { strict: false, output: 'html' }]]
		})
	],
	kit: {
		// Everything is prerendered, so nothing actually runs on Vercel's runtime —
		// pinning it just keeps local builds off the host's Node version.
		adapter: adapter({ runtime: 'nodejs22.x' }),
		prerender: {
			handleHttpError: 'fail'
		},
		alias: {
			$content: 'content'
		}
	}
};

export default config;
