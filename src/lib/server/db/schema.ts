import { pgTable, uuid, text, timestamp, unique } from 'drizzle-orm/pg-core';

export const reactions = pgTable('reactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  postSlug: text('post_slug').notNull(),
  passage: text('passage').notNull(),
  reaction: text('reaction').notNull(),
  note: text('note'),
  locale: text('locale'),
  sessionId: text('session_id'),
  readAt: timestamp('read_at', { withTimezone: true }),
});

// One row per reading session per post
export const pageViews = pgTable(
  'page_views',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    postSlug: text('post_slug').notNull(),
    sessionId: text('session_id').notNull(),
    locale: text('locale'),
    completedAt: timestamp('completed_at', { withTimezone: true }),
  },
  (t) => [unique().on(t.postSlug, t.sessionId)]
);

// One row per section per session — deduped by unique constraint
export const sectionReach = pgTable(
  'section_reach',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    postSlug: text('post_slug').notNull(),
    sectionId: text('section_id').notNull(),
    sessionId: text('session_id').notNull(),
  },
  (t) => [unique().on(t.postSlug, t.sectionId, t.sessionId)]
);

// Generic poll/vote table. One row per session per poll — duplicates blocked
// by unique constraint. Used by interactive components that ask the reader
// to make a choice and want to show aggregate behavior afterward.
export const pollVotes = pgTable(
  'poll_votes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    pollId: text('poll_id').notNull(),
    optionId: text('option_id').notNull(),
    sessionId: text('session_id').notNull(),
    locale: text('locale'),
  },
  (t) => [unique().on(t.pollId, t.sessionId)]
);
