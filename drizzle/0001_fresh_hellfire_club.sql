-- `poll_votes` was added to the production schema with `drizzle-kit push`, so
-- no migration ever recorded it: the 0000 snapshot has only three tables. This
-- migration closes that gap so a fresh database can be built from history
-- alone. IF NOT EXISTS because the existing database already has the table —
-- there, this migration is a no-op, not a failure.
CREATE TABLE IF NOT EXISTS "poll_votes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"poll_id" text NOT NULL,
	"option_id" text NOT NULL,
	"session_id" text NOT NULL,
	"locale" text,
	CONSTRAINT "poll_votes_poll_id_session_id_unique" UNIQUE("poll_id","session_id")
);
