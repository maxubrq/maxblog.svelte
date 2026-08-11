/**
 * Reading memory — where you stopped, per essay, on this device.
 *
 * Device-local, never sent anywhere, and deliberately *not* the same thing as
 * the telemetry in `$lib/session`: that counts readers for the author, this
 * remembers a place for the reader. Nothing here reaches a server.
 *
 * The storage key is production's, so a reader with both editions open picks up
 * in the same place. The shape is production's too — only the link differs
 * (`/writing/{slug}` here, `/posts/{slug}` there), and that is built at the
 * point of use, not stored.
 */

const KEY = 'reading_memory';

/**
 * Below this the reader has not started, they have merely opened the page — and
 * a list of essays you glanced at is not a list of essays you are reading.
 */
export const MIN_PCT = 0.03;
/** At this point the essay counts as read, and drops out of the list. */
export const FINISHED_PCT = 0.95;

export interface ReadingEntry {
	slug: string;
	title: string;
	topic: string;
	/**
	 * The locale the essay is published under. An essay lives at exactly one
	 * locale — `/en/writing/…-en` has no `/vi` URL — so a resume link built from
	 * the *reader's* locale 404s the moment the two differ. Optional because
	 * production writes to this same key without it; `entryLang` falls back.
	 */
	lang?: 'en' | 'vi';
	/** Scroll fraction, 0..1. */
	pct: number;
	/** The `##` the reader was under — the anchor the resume link points at. */
	sectionId: string;
	/** Its roman numeral and title, so the nudge can name the place. */
	sectionNum: string;
	sectionTitle: string;
	minLeft: number;
	totalMin: number;
	lastSeenTs: number;
	finished: boolean;
}

export type ReadingMemory = Record<string, ReadingEntry>;

/**
 * Which locale an entry's essay belongs to. Prefers what the tracker recorded,
 * then the slug's own suffix — the naming contract in `content/posts/` is that
 * a trailing `-en` / `_vi` names the locale — and only then the reader's, which
 * is right for a slug that carries no suffix at all.
 */
export function entryLang(entry: ReadingEntry, fallback: 'en' | 'vi'): 'en' | 'vi' {
	if (entry.lang) return entry.lang;
	const suffix = entry.slug.match(/[-_](en|vi)$/);
	return (suffix?.[1] as 'en' | 'vi') ?? fallback;
}

export function readMemory(): ReadingMemory {
	try {
		const raw = localStorage.getItem(KEY);
		return raw ? (JSON.parse(raw) as ReadingMemory) : {};
	} catch {
		// Private mode, storage disabled, or something else's data under our key.
		return {};
	}
}

export function readEntry(slug: string): ReadingEntry | null {
	return readMemory()[slug] ?? null;
}

export function writeEntry(entry: ReadingEntry) {
	if (entry.pct < MIN_PCT) return;
	try {
		const memory = readMemory();
		memory[entry.slug] = entry;
		localStorage.setItem(KEY, JSON.stringify(memory));
	} catch {
		// A place that cannot be remembered is not worth interrupting anyone over.
	}
}

export function clearEntry(slug: string) {
	try {
		const memory = readMemory();
		delete memory[slug];
		localStorage.setItem(KEY, JSON.stringify(memory));
	} catch {
		// Nothing stored to forget.
	}
}

export function clearMemory() {
	try {
		localStorage.removeItem(KEY);
	} catch {
		// Same.
	}
}

/** The essays still open, most recently read first. */
export function inProgress(memory: ReadingMemory = readMemory()): ReadingEntry[] {
	return Object.values(memory)
		.filter((e) => !e.finished && e.pct >= MIN_PCT)
		.sort((a, b) => b.lastSeenTs - a.lastSeenTs);
}

/**
 * The labels `lastSeen` needs. They live in the i18n catalogue rather than in
 * this module — production hardcodes both languages inside the function, which
 * it has to, having nowhere else to put them; this edition has typed catalogues,
 * and a string the reader sees belongs in one.
 */
export interface LastSeenLabels {
	justNow: string;
	/** `{n} min ago` */
	minutesAgo: string;
	/** `{n} hr ago` */
	hoursAgo: string;
	today: string;
	yesterday: string;
	/** Seven, starting at Sunday. */
	weekdays: readonly string[];
	morning: string;
	afternoon: string;
	evening: string;
}

/**
 * "just now" · "20 min ago" · "yesterday" · "Tue afternoon" · "Apr 14".
 *
 * The scale coarsens as it goes back, because that is how the memory of it
 * works: minutes matter this hour, the day of the week matters this week, and
 * after that only the date.
 */
export function lastSeen(ts: number, labels: LastSeenLabels, lang: 'en' | 'vi' = 'en'): string {
	const diff = Date.now() - ts;
	const minutes = diff / 60_000;
	const hours = diff / 3_600_000;
	const days = diff / 86_400_000;

	if (minutes < 2) return labels.justNow;
	if (minutes < 60) return labels.minutesAgo.replace('{n}', String(Math.round(minutes)));
	if (hours < 5) return labels.hoursAgo.replace('{n}', String(Math.round(hours)));
	if (days < 1) return labels.today;
	if (days < 2) return labels.yesterday;

	const date = new Date(ts);
	if (days < 7) {
		const weekday = labels.weekdays[date.getDay()];
		const hour = date.getHours();
		const partOfDay =
			hour < 12 ? labels.morning : hour < 17 ? labels.afternoon : labels.evening;
		return `${weekday} ${partOfDay}`;
	}

	return date.toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
		month: 'short',
		day: 'numeric'
	});
}
