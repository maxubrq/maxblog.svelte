-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "reactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"post_slug" text NOT NULL,
	"passage" text NOT NULL,
	"reaction" text NOT NULL,
	"note" text,
	"locale" text,
	"session_id" text,
	"read_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "page_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"post_slug" text NOT NULL,
	"session_id" text NOT NULL,
	"locale" text,
	"completed_at" timestamp with time zone,
	CONSTRAINT "page_views_post_slug_session_id_unique" UNIQUE("post_slug","session_id")
);
--> statement-breakpoint
CREATE TABLE "section_reach" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"post_slug" text NOT NULL,
	"section_id" text NOT NULL,
	"session_id" text NOT NULL,
	CONSTRAINT "section_reach_post_slug_section_id_session_id_unique" UNIQUE("post_slug","section_id","session_id")
);

*/