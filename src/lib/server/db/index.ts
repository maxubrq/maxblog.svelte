/**
 * The Postgres connection. Same database, same schema, same driver as the
 * production blog (`~/MyApps/maxblog/src/db/index.ts`).
 *
 * It lives under `$lib/server/` on purpose: SvelteKit makes it a *build error*
 * to import anything from that directory into code that reaches the browser, so
 * the connection string cannot leak into a client bundle by accident.
 *
 * Lazy, because the rest of the site is prerendered. Building the static pages
 * must not require a database to be reachable — the client is only created the
 * first time an endpoint actually asks for it.
 */
import { env } from '$env/dynamic/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

export { schema };

type Db = ReturnType<typeof drizzle<typeof schema>>;

let instance: Db | null = null;

/** True when a database is configured — endpoints answer 503 rather than crash. */
export function hasDatabase(): boolean {
	return Boolean(env.DATABASE_URL);
}

export function db(): Db {
	if (instance) return instance;

	const url = env.DATABASE_URL;
	if (!url) throw new Error('DATABASE_URL is not set');

	// `prepare: false` — the pooled connection string goes through pgbouncer in
	// transaction mode, which cannot keep prepared statements between checkouts.
	// Migrations use DIRECT_URL instead (see drizzle.config.ts).
	const client = postgres(url, { prepare: false });
	instance = drizzle(client, { schema });
	return instance;
}
