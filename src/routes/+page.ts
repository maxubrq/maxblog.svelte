import { site } from '$lib/site';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

// Every real page lives under a locale. `/` is a permanent redirect to the
// default one, prerendered as such.
export const load: PageLoad = () => {
	redirect(308, `/${site.defaultLang}`);
};
