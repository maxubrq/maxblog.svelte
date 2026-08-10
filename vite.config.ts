import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		// Posts live outside src/, so dev has to be allowed to serve content/.
		fs: { allow: ['content'] }
	}
});
