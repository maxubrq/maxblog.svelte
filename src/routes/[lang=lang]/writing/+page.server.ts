import { langs } from '$lib/i18n';
import { redirect } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';

/**
 * The archive moved to the home page (DESIGN.md §10.2). The locale is in the
 * URL, so the answer never varies by reader and a permanent 308 is safe here
 * — unlike `/`, which negotiates the language and must stay a 307.
 *
 * The site is prerendered, so this load runs at build time: adapter-vercel
 * turns the redirect into a real 308 route in `.vercel/output/config.json`
 * (`/en/writing/?` → `/en`), and `vite dev` answers it directly.
 */
export const entries: EntryGenerator = () => langs.map((lang) => ({ lang }));

export const load: PageServerLoad = ({ params }) => {
	redirect(308, `/${params.lang}`);
};
