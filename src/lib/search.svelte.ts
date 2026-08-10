/**
 * Whether the search overlay is open. Module-level rune state rather than a
 * context: the trigger lives in the header and the overlay is mounted beside
 * the page, and both are in the same layout — a context would be ceremony for
 * one boolean, and this way any component anywhere can open search.
 *
 * Production wraps the tree in a `SearchProvider`; this is the same thing
 * minus the provider.
 */
class SearchState {
	open = $state(false);

	show() {
		this.open = true;
	}

	hide() {
		this.open = false;
	}

	toggle() {
		this.open = !this.open;
	}
}

export const search = new SearchState();

/** The ⌘K / Ctrl-K binding. Call once, from the locale layout. */
export function searchHotkey(event: KeyboardEvent) {
	if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
		event.preventDefault();
		search.toggle();
	}
}
