import { listPosts } from '$lib/content/posts';
import { site } from '$lib/site';
import type { RequestHandler } from './$types';

export const prerender = true;

const esc = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: RequestHandler = async () => {
	const posts = await listPosts();

	const items = posts
		.map((p) => {
			const url = `${site.url}${p.href}`;
			return `		<item>
			<title>${esc(p.title)}</title>
			<link>${url}</link>
			<guid isPermaLink="true">${url}</guid>
			<pubDate>${new Date(`${p.date}T09:00:00Z`).toUTCString()}</pubDate>
			<category>${esc(p.topic)}</category>
			${p.description || p.subtitle ? `<description>${esc(p.description ?? p.subtitle!)}</description>` : ''}
		</item>`;
		})
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>${esc(site.name)}</title>
		<link>${site.url}</link>
		<description>${esc(site.description)}</description>
		<language>en</language>
		<atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml" />
${items}
	</channel>
</rss>
`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
	});
};
