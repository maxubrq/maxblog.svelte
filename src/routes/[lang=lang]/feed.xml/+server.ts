import { listPosts } from '$lib/content/posts';
import { langs, messages, type Lang } from '$lib/i18n';
import { site } from '$lib/site';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => langs.map((lang) => ({ lang }));

const esc = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: RequestHandler = async ({ params }) => {
	const lang = params.lang as Lang;
	// A subscriber asked for the essays. Notes are read in their own room, not
	// pushed into someone's reader — see `TopicData.unlisted`.
	const posts = (await listPosts({ includeUnlisted: false })).filter((p) => p.lang === lang);

	const items = posts
		.map((p) => {
			const url = `${site.url}/${lang}/writing/${p.slug}`;
			const summary = p.description ?? p.subtitle;
			return `		<item>
			<title>${esc(p.title)}</title>
			<link>${url}</link>
			<guid isPermaLink="true">${url}</guid>
			<pubDate>${new Date(`${p.date}T09:00:00Z`).toUTCString()}</pubDate>
			<category>${esc(p.topic)}</category>
			${summary ? `<description>${esc(summary)}</description>` : ''}
		</item>`;
		})
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>${esc(site.name)}</title>
		<link>${site.url}/${lang}</link>
		<description>${esc(messages[lang].home.description)}</description>
		<language>${lang}</language>
		<atom:link href="${site.url}/${lang}/feed.xml" rel="self" type="application/rss+xml" />
${items}
	</channel>
</rss>
`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
	});
};
