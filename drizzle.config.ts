import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// drizzle-kit runs outside Vite, so `$env/*` is not available here — read the
// same `.env` the dev server does, by hand.
config({ path: '.env' });
config({ path: '.env.local' });

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		// Migrations need a direct connection: pgbouncer in transaction mode
		// cannot run DDL over a pooled one.
		url: process.env.DIRECT_URL ?? process.env.DATABASE_URL!
	},
	// The same four tables the production blog owns. Anything else in the
	// database belongs to another app and must not be dropped by a push.
	tablesFilter: ['reactions', 'page_views', 'section_reach', 'poll_votes']
});
