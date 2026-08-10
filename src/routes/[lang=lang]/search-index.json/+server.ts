/**
 * The search corpus for one locale, as a static file.
 *
 * Production serves this from an API route that rebuilds per request; nothing
 * runs on a server here, so it is prerendered next to `feed.xml`. The overlay
 * fetches it the first time search is opened — never on first paint — so the
 * index costs a reader who does not search exactly nothing.
 */
import { buildCorpus } from '$lib/content/search';
import { langs, type Lang } from '$lib/i18n';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => langs.map((lang) => ({ lang }));

export const GET: RequestHandler = async ({ params }) => {
	const corpus = await buildCorpus(params.lang as Lang);

	return new Response(JSON.stringify(corpus), {
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			// A build artefact: it only changes when the site is rebuilt.
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
