import adapter from '@sveltejs/adapter-vercel';
import { mdsvex } from 'mdsvex';
import { fileURLToPath } from 'node:url';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { injectComponents } from './src/lib/content/inject-components.js';
import { readingTime } from './src/lib/content/reading-time.js';

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
			remarkPlugins: [remarkMath, readingTime],
			rehypePlugins: [[rehypeKatex, { strict: false, output: 'html' }]]
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
