declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

declare module '*.md' {
	import type { Component } from 'svelte';
	import type { PostMeta } from '$lib/content/posts';

	export const metadata: PostMeta;
	const component: Component;
	export default component;
}

export {};
