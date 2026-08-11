/**
 * The reader's session id — a random uuid in localStorage, and nothing else.
 *
 * It is not an account and not a fingerprint: it exists so the four tables can
 * count *one reader once* (every write is `onConflictDoNothing` against a
 * unique constraint on it), and so a reader who reloads is still one reader.
 * Nothing about the person is derivable from it, and clearing site data ends
 * it for good.
 *
 * The key is production's, so a reader with both editions open is one reader
 * across them too.
 */
const KEY = 'mx_sid';

export function sessionId(): string | null {
	try {
		let id = localStorage.getItem(KEY);
		if (!id) {
			id = crypto.randomUUID();
			localStorage.setItem(KEY, id);
		}
		return id;
	} catch {
		// Private mode, or storage disabled. There is no session to speak of, and
		// an un-deduplicable write is worse than no write — the caller skips.
		return null;
	}
}
