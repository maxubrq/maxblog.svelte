/**
 * The running head (DIGITAL_EDITORIAL_DESIGN.md §4, decision §12.3): while an
 * essay is being read, the header names the essay and the section you are in,
 * the way a book's running head does.
 *
 * The article page owns the facts — it alone knows the title, the sections and
 * where the reader is — and the layout owns the header, so the two meet here.
 * Module state for the same reason `search.svelte.ts` is: there is one page.
 */
class RunningHead {
	/** The essay's title; empty when the page is not an essay. */
	title = $state('');
	/** 1-based section the reader is in; 0 before the first. */
	section = $state(0);
	/** How many sections the essay has. */
	of = $state(0);
	/** True once the opener has scrolled out of view. */
	scrolled = $state(false);

	/** Shown only on an essay, past its opener. */
	get active() {
		return this.title !== '' && this.scrolled;
	}

	open(title: string, of: number) {
		this.title = title;
		this.of = of;
		this.section = 0;
		this.scrolled = false;
	}
	at(section: number) {
		this.section = section;
	}
	past(scrolled: boolean) {
		this.scrolled = scrolled;
	}
	close() {
		this.title = '';
		this.scrolled = false;
	}
}

export const runningHead = new RunningHead();
