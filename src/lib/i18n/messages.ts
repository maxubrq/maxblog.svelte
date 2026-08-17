/**
 * UI strings, one catalog per locale. Content strings live in the posts; this
 * file is only the chrome and the fixed pages.
 *
 * Most values are lifted verbatim from the production blog's
 * `messages/{en,vi}.json` so both editions say the same thing. Keys marked
 * "ink" are additions this edition needs (accent words for the hand-drawn
 * marks, the footer triplet), and are not in the production catalog.
 */

export const langs = ['en', 'vi'] as const;
export type Lang = (typeof langs)[number];

const en = {
	nav: {
		writing: 'Writing',
		topics: 'Topics',
		series: 'Series',
		glossary: 'Glossary',
		resources: 'Resources',
		readingRoom: 'Reading Room',
		about: 'About the Author'
	},
	locale: {
		/** Label of the *other* locale — what the switcher offers. */
		switch: 'Tiếng Việt',
		self: 'English'
	},
	footer: {
		tagline: 'A notebook, kept in public · est. 2024',
		search: 'Search the index',
		readersSky: "the reader's sky"
	},
	search: {
		label: 'search',
		open: 'Open search',
		hint: 'Search (⌘K)',
		placeholder: 'search essays, sections, passages…',
		close: 'esc to close',
		loading: 'opening the index…',
		failed: 'The index could not be loaded. Try again in a moment.',
		scope: 'Scope',
		all: 'All',
		posts: 'Essays',
		sections: 'Sections',
		passages: 'Passages',
		filterTopic: 'Filter by topic',
		startTyping: 'Start typing, or try',
		allPosts: 'Everything filed',
		nothingFound: 'nothing found for “{q}”.',
		clear: 'clear the query →',
		result: 'result',
		results: 'results',
		essay: 'Essay',
		section: 'Section',
		passage: 'Passage',
		inPost: 'in “{title}”',
		fromPost: 'from “{title}”',
		navigate: 'navigate',
		openResult: 'open',
		reopen: 'reopen anywhere',
		closeKey: 'close',
		typeToSearch: 'Type to search the index'
	},
	/** Display settings — the one dropdown in the header's right slot. */
	reading: {
		displaySettings: 'Display settings',
		theme: 'theme',
		themeDay: 'Day',
		themeDusk: 'Dusk',
		themeNight: 'Night',
		sidenotes: 'notes',
		layoutSingle: 'Inline',
		layoutSidenote: 'Margin',
		framing: 'interactive framing',
		framingRule: 'Hair rule',
		framingBleed: 'Full bleed',
		framingCard: 'Inset card',
		mode: 'reading mode', // ink
		modeStudy: 'Study', // ink
		modeFlow: 'Flow', // ink
		inArticle: 'in the article', // ink
		cursor: 'Reading cursor', // ink
		timeLeft: 'Minutes left', // ink
		allPreferences: 'All reading preferences',
		dropdownHint: 'Type size and measure live there.',

		/* The /reading page. Lifted from the production blog's messages/en.json,
		   except where this edition differs — see `flowModeHint` and
		   `measureHint`, which would otherwise describe a page that is not this
		   one. */
		label: 'Preferences',
		deviceOnly: 'saved to this device only',
		headingLead: 'read it',
		headingAccent: 'your way.',
		intro:
			'Every control changes the sample beside it the moment you touch it — nothing is applied blind. The defaults are deliberately gentle; the site never nudges you toward more reading.',
		sectionPage: 'the page',
		textSize: 'text size',
		textSizeHint: '16 to 26px. Never below the readable threshold.',
		lineSpacing: 'line spacing',
		lineSpacingHint:
			'Leading set by the height of Vietnamese diacritics, not by the Latin default.',
		spacingTight: 'Tight',
		spacingNormal: 'Normal',
		spacingAiry: 'Airy',
		measure: 'measure',
		// ink — the steps here are column widths, not characters per line.
		measureHint: 'How wide the column of text runs. Short lines read faster and slip less.',
		typeface: 'typeface',
		typefaceHint: 'Grotesque for the screen, or a serif for long reading.',
		typefaceSans: 'Sans',
		typefaceSerif: 'Serif',
		sectionLight: 'light',
		themeHint: 'Day, dusk, night — paper and contrast change with it.',
		themeAuto: 'theme by time of day',
		themeAutoHint:
			'The page warms toward evening and softens its contrast at night, following your clock.',
		sectionReading: 'reading',
		flowMode: 'flow mode',
		// ink — production's flow hides the navigation and the footer too; this
		// edition keeps its chrome and clears the opening of the essay.
		flowModeHint:
			'Clears the way in — no tag row, no deck, no reading contract — and gives the column a little more room. For when you have already decided to read.',
		rulerHint:
			'The passage you are on holds full contrast, the rest fall back by a breath. It fades when you stop moving.',
		timeLeftHint:
			'Shows “N min left” beside the contents. The fore-edge in the gutter always shows the weight left; this adds the estimate in minutes back.',
		sectionArticle: 'the article page',
		sidenotesHint: 'Notes out in the margin on wide screens, or inline in a single column.',
		framingHint: 'How diagrams and interactive figures sit in the column.',
		livePreview: 'Live preview',
		previewStudy: 'standard view',
		previewFlow: 'flow mode · chrome hidden',
		previewLines: [
			'A reading ruler is the rare interface element whose success is measured',
			'by how little you notice it. The row you are on holds full contrast, and',
			'everything else falls back by a breath — a band of attention, not a line',
			'laid across the page. On a long paragraph, that is enough to keep the eye',
			'from slipping, the one failure that makes you read a sentence twice.'
		],
		savedNote: 'Saved on this device as you go.',
		reset: 'Defaults'
	},
	/** Where you stopped, per essay — see $lib/reading-memory. */
	readingMemory: {
		youWereHere: 'you were here',
		about: 'about',
		minute: 'minute',
		minutes: 'minutes',
		fromEnd: 'from the end',
		resumeReading: 'resume reading →',
		dismiss: 'dismiss', // ink
		lastHere: 'last here', // ink
		pickUpTitle: 'Pick up where you left off',
		whereYouWereLabel: 'where you were',
		clearMemory: 'clear memory',
		resumeShort: 'resume →',
		minLeftShort: 'min left',
		/* The relative clock. Production keeps these inside the function that
		   formats them, having nowhere else to put two languages; here they are
		   catalogue strings like any other the reader sees. */
		justNow: 'just now', // ink
		minutesAgo: '{n} min ago', // ink
		hoursAgo: '{n} hr ago', // ink
		today: 'today', // ink
		yesterday: 'yesterday', // ink
		weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], // ink
		morning: 'morning', // ink
		afternoon: 'afternoon', // ink
		evening: 'evening' // ink
	},
	/**
	 * The mark — see `ReaderMarks` and `maxubrq/project/pages/InkMarks.jsx`.
	 * The five words are the gesture vocabulary; the hints exist because a
	 * reader has never met them before and a tooltip is not an explanation.
	 */
	marks: {
		pickOne: 'pick a gesture — every mark is private first',
		/* An open draft can move the sentence a mark was made on. The mark is
		   then reported rather than dropped — see `ReaderMarks`. */
		fuzzyTitle: 'marks whose sentence has since been rewritten',
		fuzzyAt: 'made at {r}',
		labels: {
			keep: 'keep',
			dissent: 'dissent',
			snag: 'snag',
			ask: 'ask',
			note: 'note'
		},
		hints: {
			keep: 'a sentence worth carrying out of the essay',
			dissent: 'the same gesture, sign reversed — I do not believe this',
			snag: 'an anchor to come back to, not a place to leave',
			ask: 'a question pinned to the passage',
			note: 'for the author, privately'
		},
		notePlaceholder: 'Your note…',
		reachAuthor: 'goes to the author · not counted',
		cancel: 'Cancel',
		send: 'Send',
		sent: 'Sent ✓'
	},
	/** Series — see `$lib/series` and maxubrq/project/pages/InkSeries.jsx. */
	series: {
		label: 'Series',
		titleLead: 'the',
		titleAccent: 'series.',
		description:
			'Pieces that only fully land in order. Read them apart or together; the site carries the thread between them.',
		count: '{n} on the shelf',
		emptyTitle: 'no arc is finished yet.',
		emptyBody:
			'A series is described here before it is written, so the shape can be promised whole. Nothing is far enough along to promise, so the shelf is empty rather than half-built.',
		stateInProgress: 'in progress',
		stateComplete: 'complete',
		writtenOf: '{n} of {total} written',
		writtenOpen: '{n} written',
		movements: '● {n} movements',
		openEnded: '● open-ended',
		theArc: 'the arc · where you are',
		movement: 'movement {n}',
		movementOf: 'movement {n} of {total}',
		stateRead: 'read',
		stateHere: 'you are here',
		stateAhead: 'ahead',
		min: 'min',
		unwritten: 'not written yet',
		fullArc: '◔ full arc',
		arcCost: '{min} min · {n} movements',
		readIt: 'read it',
		inOrder: 'in order, the first time',
		you: 'you',
		youAre: '{read} of {total} min in',
		bridge: 'the bridge · {from} → {to}',
		carryThisIn: 'carry this in',
		whereYouLeftOff: 'where you left off',
		holdThisGoingIn: 'hold this going in',
		enterMovement: 'enter movement {n} →',
		threadsLabel: 'threads that recur · which movements they run through',
		whySeries: 'why a series, not several posts'
	},
	/** The card behind an outbound link — see `LinkPreview`. */
	linkPreview: {
		loading: 'looking…',
		external: 'external link',
		open: 'open ↗'
	},
	glossary: {
		indexLabel: 'Reference / site dictionary',
		titleLead: 'the',
		titleAccent: 'glossary.',
		description:
			'Technical words, loanwords, half-technical metaphors. Every term marked in an essay collects here, with the sentences where I first used it.',
		searchPlaceholder: 'Search terms or definitions…',
		azLabel: 'A — Z / all terms',
		usesLabel: 'uses',
		entry: 'entry',
		entries: 'entries',
		noEntries: 'No entries match.',
		appearsIn: 'Appears in',
		appearsInCount: 'appears in {count} {essays}',
		essay: 'essay',
		essays: 'essays',
		inDetail: 'in detail',
		fullEntry: 'full entry →',
		termTag: 'term',
		demoLabel: 'How a mark reads inline',
		demoLead: 'Hover a marked term such as',
		demoTail:
			'while you read, and its card opens right there — no leaving the sentence.',
		filterAll: 'All',
		topicScience: 'Science',
		topicSoftware: 'Software',
		topicPhilosophy: 'Philosophy',
		topicArt: 'Art',
		colophon: 'A living document. Last updated the day I last used a new word.',
		postHeading: 'Words',
		postSubhead: 'marked in this piece',
		fullGlossaryPre: 'The whole dictionary lives',
		fullGlossaryLink: 'here'
	},
	resources: {
		indexLabel: 'Reference / cited works',
		titleLead: 'the',
		titleAccent: 'resources.',
		description:
			'Every book, paper, standard, and idea mentioned across the writing — with a note on why each one is here.',
		searchPlaceholder: 'Search titles, authors, notes…',
		topicsLabel: 'Topics',
		resource: 'resource',
		resources: 'resources',
		noResources: 'Nothing here yet under this filter.',
		appearsIn: 'Appears in',
		citedInCount: 'cited in {count} {essays}',
		essay: 'essay',
		essays: 'essays',
		fullEntry: 'full entry →',
		sourceTag: 'source',
		demoLabel: 'How a citation reads inline',
		demoLead: 'The idea comes from',
		demoTail: ', and the numeral takes you to the full entry at the foot of the essay.',
		filterAll: 'All',
		openLink: 'open ↗',
		colophon: 'Updated as the writing grows.',
		postHeading: 'Sources',
		postSubhead: 'cited in this piece',
		fullResourcesPre: 'The full list lives',
		fullResourcesLink: 'here',
		types: {
			book: 'Book',
			paper: 'Paper',
			article: 'Article',
			documentation: 'Documentation',
			standard: 'Standard',
			report: 'Report',
			talk: 'Talk'
		},
		resourceTopics: {
			Philosophy: 'Philosophy',
			Science: 'Science',
			Software: 'Software'
		}
	},
	/** Rooms that exist in the nav but are not written yet. */
	placeholder: {
		label: 'Not yet built',
		title: 'this room is still being built.',
		titleAccent: 'built.', // ink
		body: 'It has a door in the nav so the shape of the site is honest, but nothing is filed here yet. Come back — or read what is already written.',
		back: '← back to the archive'
	},
	home: {
		tagline: 'A notebook · est. 2024',
		mastheadIndex: '',
		headline: 'writing, mostly about things that take a while.',
		headlineAccent: 'while.', // ink
		description:
			'Essays on science, technology, philosophy, and art — often with something you can play with. Updated roughly monthly, or when I have something to say.',
		latestLabel: 'Latest',
		interactive: 'Interactive',
		readEssay: 'read the essay',
		archiveRecent: 'Archive / recent',
		allEssays: 'all essays →',
		coverPlate: 'cyanotype plate'
	},
	writing: {
		label: 'Writing',
		title: 'everything, in order of when.',
		titleAccent: 'when.', // ink
		filterAll: 'All',
		essay: 'essay',
		essays: 'essays',
		empty: 'nothing filed under {topic} yet'
	},
	topics: {
		hubIndex: 'Index of subjects',
		hubTitle: 'pick a door.',
		hubTitleAccent: 'door.', // ink
		doorways: 'doorways',
		topicLabel: 'Topic',
		essay: 'essay',
		essays: 'essays',
		empty: 'nothing filed here yet',
		/* The room, as opposed to the shelf — see $lib/topics. */
		editorNote: "Editor's note",
		readThree: 'if you read three',
		handPicked: 'hand-picked',
		forthcoming: 'forthcoming',
		min: 'min',
		scratchpadLabel: 'Scratchpad',
		scratchpadTitle: 'what i am chewing on',
		updatedNote: 'no dates, no promises',
		kindQuestion: 'Question',
		kindDraft: 'Draft',
		kindReading: 'Reading',
		/* Two headings for one list: 'also' only makes sense when the hand-picked
		   three stand above it. With no starters, the tail is simply the room. */
		alsoIn: 'also filed under {name}',
		filedIn: 'filed under {name}',
		everyEssay: 'every essay →'
	},
	article: {
		author: 'Author',
		published: 'Published',
		reading: 'Reading',
		minutes: 'minutes',
		section: 'Section',
		chapter: 'Chapter',
		coord: 'Coord',
		draft: 'Draft — unlisted',
		interactive: 'Interactive',
		filedUnder: 'Filed under',
		series: 'Series',
		license: 'License',
		words: 'Words',
		oneSentence: 'If you remember one sentence',
		authorsPick: 'the author’s pick',
		neighborhood: 'in this neighborhood',
		handPicked: 'hand-picked, by me',
		readInOther: 'đọc bản tiếng việt →',
		contents: 'Contents',
		openContents: 'open the contents',
		closeContents: 'close the contents',
		/** The two ends of the fore-edge: what is behind you, what is ahead. */
		read: 'read', // ink
		left: 'left', // ink
		minLeft: '{n} min left',
		nearlyDone: 'nearly done',
		total: 'Total',
		min: 'min'
	},
	/**
	 * The open draft (ink). The English is a translation of the design, which was
	 * written in Vietnamese — the register to keep is plain and unadvertised: a
	 * piece left out in the open, not a teaser for one.
	 */
	openDraft: {
		flagNow: 'Open draft · still being written',
		flagPast: 'Open draft · a version that has passed',
		bodyNow:
			'This piece is not finished. It is here because writing in the dark too long is how I start fooling myself. You can read it, but what you are reading is breathing.',
		bodyPast:
			'You are standing at an older moment of this piece. The words here were real words once — they are only no longer the current ones.',
		whereItStands: 'where the piece stands',
		settled: 'settled',
		editing: 'being written',
		notes: 'still notes',
		started: 'started',
		edits: 'times edited',
		lengthNow: 'length now',
		wordsN: '~{n} words',
		finishBy: 'finish by',
		noPromise: 'no promise',
		pull: 'Pull the piece back to a moment',
		railCount: '{edits} edits · {saved} saved',
		/* The newest stop is labelled "now" rather than by its id: the live prose
		   can be an edit or two past the last save the author annotated. */
		now: 'now',
		notedThen: 'noted while editing',
		noNote: 'no note pinned to this save',
		backToNow: 'back to now →',
		scarsOn: 'scar layer · on',
		scarsOff: 'scar layer · off',
		/* `{struck}` and `{added}` are drawn as samples of the layer itself, not
		   printed as words — see `OpenDraftHead`. */
		scarsExplainOn: 'Sentences {struck} and sentences {added} are both showing at {r}.',
		scarsExplainOff: 'Only the text of {r}. The scars are still there, just not shown.',
		struck: 'struck',
		added: 'newly added',
		unwritten: 'not written yet',
		asAt: 'as at {r}',
		lastTouched: 'last touched {ago}',
		/** Beside a row in the archive — short, because the row is one line. */
		indexMark: 'still being written',
		revisionOf: 'version {r} of {total}'
	},
	/** The letter box the apparatus ends on — see `ReflectionPrompt`. */
	/**
	 * The two video plates (ink). Neither player exists in the design project —
	 * the chrome is `DiagramPlate`'s, so a video reads as a figure in the essay.
	 */
	video: {
		mux: 'Video',
		youtube: 'Video · YouTube',
		play: 'play',
		pause: 'pause',
		mute: 'mute',
		unmute: 'unmute',
		/** The sound key's own face — a word, not an icon. */
		soundOn: 'sound',
		soundOff: 'muted',
		seek: 'move through the video',
		fullscreen: 'full screen',
		loading: 'loading…',
		failed: 'this video could not be loaded',
		/** Said on the plate before the embed is built — see `YouTubeVideo`. */
		notLoaded: 'not loaded yet',
		facadePlay: 'play on youtube',
		facadeNote:
			'Nothing has been asked of YouTube yet. Press play and the player loads from youtube-nocookie.com.',
		loadedFrom: 'Playing from youtube-nocookie.com.',
		watchOn: 'open on youtube →'
	},
	reflection: {
		label: 'a quiet word to the author',
		/** One per essay, picked by its slug — production's three questions. */
		prompts: [
			'What did you take away from this?',
			'Did anything here change how you think about the problem?',
			'What question does this leave you with?'
		],
		placeholder: 'Your thoughts, private, and only for the author.',
		privacy: 'not published · never shown to other readers',
		send: 'Send',
		sending: 'Sending…',
		sent: 'Received. Only the author will read this. — Thank you.',
		failed: 'It did not get through — try again in a moment.'
	},
	/**
	 * The three live figures of the float essay. Lifted verbatim from the
	 * production catalog (`floatBuilder`, `floatExplorer`), so both editions
	 * explain float32 in the same words; `floatVsFixed` is new here, because
	 * production wrote that figure's Vietnamese into the component itself and
	 * this edition has to say it in English too. The `<m> <ms> <me> <mm> <b> <i>
	 * <sup>` tags are the rich-message markup — see `interactive/rich.ts`.
	 */
	floatBuilder: {
		label: 'By hand · float32',
		zeroTitle: 'Special value: zero',
		zeroBody:
			'0 has no normalised form — there is no leading 1 bit. The standard reserves <m>exponent = 0</m> and <m>mantissa = 0</m> for it. The sign bit is still there, so both <m>+0</m> and <m>-0</m> exist.',
		infTitle: 'Special value: infinity',
		infBody:
			'Infinity uses an all-ones exponent (<m>255</m>) with a mantissa of <m>0</m>. The sign says whether it is <m>+∞</m> or <m>−∞</m>. There are no significant digits to store.',
		nanTitle: 'Special value: NaN',
		nanBody:
			'NaN (Not a Number) also uses an all-ones exponent (<m>255</m>), but with a <b>non-zero</b> mantissa. Those mantissa bits are the payload — unconstrained, so millions of different bit patterns are all NaN.',
		step1Title: 'Split off the sign',
		step1Body:
			'{signWord} → sign bit = <ms>{signBit}</ms>. From here on we work with <m>|{num}| = {abs}</m>.',
		signNegative: 'A negative number',
		signPositive: 'A positive number',
		step2Title: 'Convert to binary',
		step2Body:
			'Integer part: <m>{int} = {intBits}₂</m>. Fractional part: double it repeatedly → <m>0.{frac}{ell}</m>. Put back together: <m>{intBits}.{frac}{ell}₂</m>{note}.',
		step2Truncated: ' (the sequence never terminates — this is the seed of the error)',
		step3Title: 'Normalise to 1.f × 2ᵉ',
		step3Body:
			'Shift the point until exactly one <m>1</m> stands to its left: <m>1.{sig}{ell} × 2<sup>{e}</sup></m>. The true exponent is <me>e = {e}</me>. That leading <m>1</m> is the <i>hidden bit</i> — it is always there, so it is never stored.',
		step4Title: 'Add the exponent bias',
		step4Body:
			'To store a signed exponent without a sign bit of its own, add the bias <m>127</m>. <me>E = {e} + 127 = {expBits} = {expBin}₂</me>.',
		step5Title: 'Truncate and round to 23 mantissa bits',
		step5Body:
			'Take the first 23 bits after the point of the significand, rounding the last one: <mm>{mantBin}</mm>',
		step6Title: 'Assemble the 32 bits',
		storedLabel: 'What is actually stored',
		errorLine: 'You asked for <b>{asked}</b>, the machine stored <b>{stored}</b>. Error {err}.',
		exactLine: 'Exact — this value is representable with nothing left over.',
		keySign: 'sign',
		keyExp: 'exponent',
		keyMant: 'mantissa'
	},
	floatExplorer: {
		fieldSign: 'sign',
		fieldExp: 'exponent  (8 bits)',
		fieldMant: 'mantissa  (23 bits)',
		panelSign: 'Sign',
		panelExp: 'Exponent',
		panelMant: 'Mantissa',
		bitN: 'bit {n}',
		bitIsSign: 'sign',
		bitIsExp: 'exponent bit {n}',
		bitIsMant: 'mantissa bit {n}',
		tabAnatomy: 'field anatomy',
		tabFraction: 'binary fraction',
		signPositive: '0  →  positive  (+1)',
		signNegative: '1  →  negative  (−1)',
		specialZero: '{bits}  (special: represents ±0)',
		specialSubnormal: '{bits}  (special: exponent treated as −126)',
		specialInfNan: '{bits}  (special: signals ∞ or NaN)',
		nanPayload: 'NaN payload ({n})',
		noSignificantBits: '0  (no significant bits)',
		reconstructedAs: 'Reconstructed as',
		representationError: 'Representation error',
		noErrorSpecial: 'No error — special value.',
		exactValue: 'Exact — this value is representable.',
		asked: 'asked',
		got: 'got',
		gapUnavoidable: 'The gap is unavoidable.',
		fractionSpecial: 'This is a special value — no fractional part to convert.',
		fractionInteger:
			'{n} has no fractional part, so its binary representation is finite and exact (for this integer range).',
		algorithm:
			'Algorithm: multiply the fraction by 2. Take the integer part as the next binary digit. Repeat with the remainder.',
		algorithmRepeat:
			' When a value recurs, the sequence repeats forever — the number cannot be stored exactly.',
		colStep: 'Step',
		colValue: 'Value',
		colBit: 'Bit',
		cycleStarts: '⟲ cycle starts — repeats forever',
		cutoff: '← 23-bit mantissa cutoff here',
		repeatNote:
			'The fractional part of {n} repeats in binary, just as 1/3 repeats in decimal. The mantissa stores only 23 bits of an infinite sequence — then rounds. That rounding is the error.',
		spec: 'IEEE 754-2008 single precision'
	},
	floatVsFixed: {
		label: 'Spacing (ULP): fixed-point Q16.16 and float32',
		around: 'Values around',
		axis: 'representable value (log scale)',
		tie: 'even at 128',
		legendFixed: 'fixed-point Q16.16 — flat',
		legendFloat: 'float32 — a staircase',
		readAround: 'Around',
		readFloat: 'float32 is spaced',
		readFixed: 'and fixed-point',
		finer: 'finer',
		coarser: 'coarser',
		readRatio: 'float32 is about {ratio} {word}.',
		outOfRange:
			'out of range. Q16.16 stops at 65,536, so at this magnitude it has nothing to compare with.'
	},
	weather: {
		readTime: '◔ read time',
		oneSitting: 'one sitting',
		load: 'load',
		needFirst: 'need first',
		bestWhen: 'best when',
		honest: 'honest ↴'
	},
	about: {
		label: 'About / colophon',
		heading: 'a notebook, kept in public.',
		headingAccent: 'public', // ink
		portraitPlate: 'portrait plate',
		metaWho: 'Who',
		metaSince: 'Since',
		metaCadence: 'Cadence',
		metaCadenceVal: '~monthly',
		metaType: 'Type',
		metaTypeVal: 'Space Grotesk / Plex',
		bio1: "I'm <strong>maxubrq</strong>. I write here about things that feel worth thinking about slowly: a physics problem that stuck with me, a piece of software I finally understood, a painting I kept coming back to, a sentence that would not leave me alone.",
		bio2: 'Some of these essays come with a thing you can play with — a small simulation, a diagram that responds to a slider, a figure that recomputes itself. I think of writing and interaction as the same craft: both are attempts to hand someone a thought in a form they can turn over.',
		topicsHeading: 'what i write about',
		elsewhereHeading: 'elsewhere',
		farewell: 'Thanks for stopping by.',
		/* The doorway to the vault — the only way in, which is the point. */
		vaultTagLeft: 'Not in the menu',
		vaultTagRight: 'reached only from here',
		vaultTitle: 'the vault →',
		vaultBlurb:
			'A private cabinet — the books, records, papers, films and objects that belong to me, each with a line on why. A quieter room off this page.'
	},
	/**
	 * The vault — reached only from /about, so it has no nav string. Lifted from
	 * production's messages/en.json; `addedCount` and `collapsed` drop ICU plural
	 * syntax, which this catalogue has no formatter for, and say the same thing.
	 */
	/**
	 * The reading room. Production's is a *hub* — six doors, each to its own
	 * page, and counts printed on the doors. This edition shows the rooms
	 * themselves, one after another on a single page, so there is nothing to
	 * click through and none of production's door/blurb/count strings apply.
	 * Only the masthead and the colophon are lifted; the rest is this edition's.
	 */
	readingRoom: {
		privateTag: 'private · stays on this device',
		titleLead: 'the reading',
		titleAccent: 'room.',
		description:
			'Everything you have made by reading, kept together on one page.',
		colophon:
			'Everything on this page is computed in your browser from what you have read; none of it is sent anywhere, and clearing your site data ends it. Only you can see this room.'
	},
	/**
	 * The constellation — a section of the reading room, not its own page.
	 * Production's `layerConcepts` / `legendConcept` / `tallyConcepts` are not
	 * here: that layer is absent for now, see the README.
	 */
	constellation: {
		plate: 'Plate XII',
		title: "the reader's sky",
		subtitle: "this chart exists only because you've been here",
		sectionDeck:
			'Every essay you have opened, drawn as a star and joined in the order you read them. No two readers get the same sky, and this one was drawn here, from what is on this device.',
		emptyTitle: 'your sky is still dark.',
		emptyBody:
			'Read an essay to the end and a star will appear here — this chart is drawn from your own reading.',
		layerDomains: 'domains',
		legendOrder: 'your reading order',
		legendCitation: 'citation between essays',
		legendRead: 'read',
		legendAhead: 'cited · still ahead'
	},
	/* The read shelf — a section of the reading room, not its own page. */
	shelf: {
		sectionLabel: 'The read shelf',
		finishedOnly: 'finished only',
		description:
			'Everything you finished. Each piece you carried to the last line becomes a spine, set the way a bound book is set.',
		monogram: 'maxubrq',
		emptyTitle: 'your shelf is still empty.',
		emptyBody:
			'Carry one piece all the way to the last line and its spine appears here. Opening a piece puts nothing on the shelf.'
	},
	vault: {
		backToAbout: '← about the author',
		countLabel: '{count} things · by year acquired',
		titleLead: 'the',
		titleAccent: 'vault',
		description:
			'A cabinet of things that belong to me — books, records, papers, films, courses, a few places — laid out in the order they entered my life, not by kind. Each kept because it changed the way I think. One line on why, in my own words.',
		filterAll: 'All',
		media: {
			Books: 'Books',
			Music: 'Music',
			Papers: 'Papers',
			Films: 'Films',
			Objects: 'Objects',
			Course: 'Course',
			Experience: 'Experience'
		},
		made: 'made {year}',
		addedCount: '{count} added',
		expand: 'open +',
		collapse: 'fold −',
		collapsed: '{count} kept this year — click to open',
		empty: 'Nothing of that kind in here yet.',
		colophon:
			'Kept privately, shared quietly. No ratings, no affiliate links, no “buy” button. Dated by when it reached me, not when it was made. Older years fold away — click to open. — Còn giữ, tức là còn quan trọng.'
	},
	/**
	 * ink — a 404 is an editorial event, not an error screen: say plainly what
	 * happened, then hand the reader real doorways. The `lost` block is the 404
	 * only; the three keys above it serve any status.
	 */
	error: {
		title: 'this page is not in the index.',
		titleAccent: 'not', // ink
		back: '← back to the archive',
		status: 'HTTP {status}',
		lost: {
			title: 'this page is not here any more',
			titleAccent: 'here',
			lede: 'The link you opened does not point at an essay. It may have been renamed, folded into a series, or never existed outside a mistyped URL.',
			doors: 'somewhere you might have meant',
			doorWriting: 'Everything, newest first',
			doorWritingMeta: 'the index',
			doorSeries: 'Essays that belong together',
			doorSeriesMeta: 'in order',
			doorRoom: 'Marks and the sentences you kept',
			doorRoomMeta: 'private',
			home: '← back to the front page',
			hint: 'or ⌘K on any page to search the whole index',
			alt: 'a black cat holding a hand-lettered sign reading PAGE NOT FOUND'
		}
	}
};

/** The Vietnamese catalog must have exactly the same shape. */
const vi: typeof en = {
	nav: {
		writing: 'Bài viết',
		topics: 'Chủ đề',
		series: 'Tuyển tập',
		glossary: 'Thuật ngữ',
		resources: 'Tài nguyên',
		readingRoom: 'Phòng đọc',
		about: 'Về tác giả'
	},
	locale: {
		switch: 'English',
		self: 'Tiếng Việt'
	},
	footer: {
		tagline: 'Một cuốn sổ tay công khai · est. 2024',
		search: 'Tìm trong mục lục',
		readersSky: 'bầu trời của người đọc'
	},
	search: {
		label: 'tìm',
		open: 'Mở tìm kiếm',
		hint: 'Tìm kiếm (⌘K)',
		placeholder: 'tìm bài viết, mục, đoạn văn…',
		close: 'esc để đóng',
		loading: 'đang mở mục lục…',
		failed: 'Không tải được mục lục. Thử lại sau giây lát.',
		scope: 'Phạm vi',
		all: 'Tất cả',
		posts: 'Bài viết',
		sections: 'Mục',
		passages: 'Đoạn văn',
		filterTopic: 'Lọc theo chủ đề',
		startTyping: 'Gõ để tìm, hoặc thử',
		allPosts: 'Toàn bộ mục lục',
		nothingFound: 'không tìm thấy gì cho “{q}”.',
		clear: 'xoá từ khoá →',
		result: 'kết quả',
		results: 'kết quả',
		essay: 'Bài viết',
		section: 'Mục',
		passage: 'Đoạn văn',
		inPost: 'trong “{title}”',
		fromPost: 'từ “{title}”',
		navigate: 'di chuyển',
		openResult: 'mở',
		reopen: 'mở lại ở bất kỳ đâu',
		closeKey: 'đóng',
		typeToSearch: 'Gõ để tìm trong mục lục'
	},
	reading: {
		displaySettings: 'Tùy chỉnh hiển thị',
		theme: 'nền',
		themeDay: 'Ngày',
		themeDusk: 'Chạng vạng',
		themeNight: 'Đêm',
		sidenotes: 'ghi chú lề',
		layoutSingle: 'Trong cột',
		layoutSidenote: 'Ngoài lề',
		framing: 'khung hình tương tác',
		framingRule: 'Kẻ mảnh',
		framingBleed: 'Tràn lề',
		framingCard: 'Khối nền',
		mode: 'lối đọc',
		modeStudy: 'Nghiền ngẫm',
		modeFlow: 'Một mạch',
		inArticle: 'trong bài',
		cursor: 'Con trỏ đọc',
		timeLeft: 'Số phút còn lại',
		allPreferences: 'Toàn bộ tùy chỉnh đọc',
		dropdownHint: 'Cỡ chữ và độ dài dòng nằm ở đó.',

		label: 'Tùy chỉnh',
		deviceOnly: 'chỉ lưu trên thiết bị này',
		headingLead: 'đọc theo',
		headingAccent: 'cách của bạn.',
		intro:
			'Mọi nút bấm đổi ngay mẫu chữ bên cạnh — không có gì được áp dụng mù. Mặc định cố ý nhẹ nhàng; trang này không bao giờ thúc bạn đọc thêm.',
		sectionPage: 'trang chữ',
		textSize: 'cỡ chữ',
		textSizeHint: 'Từ 16 đến 26px. Không bao giờ dưới ngưỡng đọc được.',
		lineSpacing: 'khoảng dòng',
		lineSpacingHint:
			'Khoảng dòng chọn theo chiều cao dấu tiếng Việt, không theo mặc định Latin.',
		spacingTight: 'Chặt',
		spacingNormal: 'Vừa',
		spacingAiry: 'Thoáng',
		measure: 'độ dài dòng',
		measureHint: 'Cột chữ rộng tới đâu. Dòng ngắn đọc nhanh hơn, ít tụt dòng.',
		typeface: 'kiểu chữ',
		typefaceHint: 'Grotesque cho màn hình, hay serif cho đọc dài.',
		typefaceSans: 'Sans',
		typefaceSerif: 'Serif',
		sectionLight: 'ánh sáng',
		themeHint: 'Ngày, chạng vạng, đêm — nền và tương phản đổi theo.',
		themeAuto: 'nền theo thời khắc',
		themeAutoHint:
			'Trang tự ấm dần về chiều và dịu tương phản về đêm, theo giờ trên máy bạn.',
		sectionReading: 'khi đọc',
		flowMode: 'chế độ dòng chảy',
		flowModeHint:
			'Dọn quang lối vào — bỏ hàng thẻ, bỏ sapo, bỏ bản giao kèo đọc — và nới cột chữ rộng thêm chút. Dành cho lúc bạn đã quyết định đọc rồi.',
		rulerHint:
			'Đoạn đang đọc giữ tương phản đầy, phần còn lại lùi nhẹ. Tự mờ khi bạn đứng yên.',
		timeLeftHint:
			'Hiện “còn N phút” cạnh mục lục. Cạnh sách trong gutter luôn cho bạn thấy sức nặng còn lại; đây là phần ước lượng bằng phút, thêm vào nếu bạn muốn.',
		sectionArticle: 'trang bài viết',
		sidenotesHint: 'Ghi chú nằm ngoài lề trên màn hình rộng, hoặc chen giữa cột chữ.',
		framingHint: 'Cách biểu đồ và hình tương tác nằm trong cột chữ.',
		livePreview: 'Xem trực tiếp',
		previewStudy: 'chế độ thường',
		previewFlow: 'dòng chảy · đã ẩn khung',
		previewLines: [
			'Con trỏ đọc là thứ giao diện hiếm hoi mà thành công của nó được đo bằng',
			'việc bạn để ý đến nó ít tới đâu. Dòng bạn đang đọc giữ tương phản đầy,',
			'phần còn lại lùi lại một hơi thở — một dải chú ý, không phải một vạch kẻ',
			'ngang trang giấy. Với một đoạn dài, chừng đó là đủ để mắt không trượt dòng,',
			'cái lỗi duy nhất khiến bạn đọc lại một câu và mất mạch.'
		],
		savedNote: 'Tự lưu trên thiết bị này.',
		reset: 'Mặc định'
	},
	readingMemory: {
		youWereHere: 'bạn đã đọc đến đây',
		about: 'còn khoảng',
		minute: 'phút',
		minutes: 'phút',
		fromEnd: 'nữa là hết',
		resumeReading: 'đọc tiếp →',
		dismiss: 'bỏ qua',
		lastHere: 'dừng ở đây',
		pickUpTitle: 'Tiếp tục nơi đã dừng',
		whereYouWereLabel: 'bạn đã ở đây',
		clearMemory: 'xóa',
		resumeShort: 'tiếp →',
		minLeftShort: 'phút còn lại',
		justNow: 'vừa xong',
		minutesAgo: '{n} phút trước',
		hoursAgo: '{n} giờ trước',
		today: 'hôm nay',
		yesterday: 'hôm qua',
		weekdays: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
		morning: 'buổi sáng',
		afternoon: 'buổi chiều',
		evening: 'buổi tối'
	},
	marks: {
		pickOne: 'chọn một cử chỉ — mọi dấu đều riêng tư trước',
		fuzzyTitle: 'những dấu mà câu của nó đã bị viết lại',
		fuzzyAt: 'đánh ở {r}',
		labels: {
			keep: 'giữ',
			dissent: 'không tin',
			snag: 'vấp',
			ask: 'hỏi',
			note: 'nhắn'
		},
		hints: {
			keep: 'câu đáng mang ra khỏi bài',
			dissent: 'song sinh ngược dấu của giữ — mình không tin câu này',
			snag: 'neo để quay lại, không phải chỗ để bỏ đi',
			ask: 'một câu hỏi để ở lề',
			note: 'gửi riêng cho tác giả'
		},
		notePlaceholder: 'Ghi chú của bạn…',
		reachAuthor: 'gửi tới tác giả · không thống kê',
		cancel: 'Hủy',
		send: 'Gửi',
		sent: 'Đã gửi ✓'
	},
	series: {
		label: 'Tuyển tập',
		titleLead: 'các',
		titleAccent: 'tuyển tập.',
		description:
			'Những bài chỉ trọn vẹn khi đọc đúng thứ tự. Đọc rời hay đọc liền đều được; trang này như sợi chỉ nối giữa chúng.',
		count: '{n} trên kệ',
		emptyTitle: 'chưa có tuyển tập nào cả',
		emptyBody:
			'Một tuyển tập được mô tả ở đây trước khi được viết, thường sẽ như là một lời hứa với bản thân mình. Chưa cái nào đủ xa để hứa.',
		stateInProgress: 'đang viết',
		stateComplete: 'đã trọn',
		writtenOf: 'đã viết {n} trên {total}',
		writtenOpen: 'đã viết {n}',
		movements: '● {n} chương',
		openEnded: '● chưa định số',
		theArc: 'vòng cung · bạn đang ở đâu',
		movement: 'chương {n}',
		movementOf: 'chương {n} trên {total}',
		stateRead: 'đã đọc',
		stateHere: 'bạn đang ở đây',
		stateAhead: 'phía trước',
		min: 'phút',
		unwritten: 'chưa viết',
		fullArc: '◔ trọn vòng cung',
		arcCost: '{min} phút · {n} chương',
		readIt: 'cách đọc',
		inOrder: 'theo thứ tự, ở lần đầu',
		you: 'bạn',
		youAre: 'đã đi {read} trên {total} phút',
		bridge: 'nhịp cầu · {from} → {to}',
		carryThisIn: 'mang theo cái này',
		whereYouLeftOff: 'chỗ bạn dừng lại',
		holdThisGoingIn: 'giữ điều này khi bước vào',
		enterMovement: 'vào chương {n} →',
		threadsLabel: 'những sợi chỉ lặp lại · chạy qua các chương nào',
		whySeries: 'vì sao là một tuyển tập, không phải vài bài rời'
	},
	linkPreview: {
		loading: 'đang xem…',
		external: 'liên kết ngoài',
		open: 'mở ↗'
	},
	glossary: {
		indexLabel: 'Tham khảo / từ điển của trang',
		titleLead: 'từ',
		titleAccent: 'điển.',
		description:
			'Các từ kỹ thuật, từ mượn, những ẩn dụ. Mọi thuật ngữ được đánh dấu trong một bài viết đều về đây, kèm câu văn nơi mình dùng nó lần đầu.',
		searchPlaceholder: 'Tìm thuật ngữ hoặc định nghĩa…',
		azLabel: 'A — Z / mọi thuật ngữ',
		usesLabel: 'lần dùng',
		entry: 'mục',
		entries: 'mục',
		noEntries: 'Không có mục nào phù hợp.',
		appearsIn: 'Xuất hiện trong',
		appearsInCount: 'xuất hiện trong {count} {essays}',
		essay: 'bài viết',
		essays: 'bài viết',
		inDetail: 'chi tiết',
		fullEntry: 'xem đầy đủ →',
		termTag: 'thuật ngữ',
		demoLabel: 'Một thuật ngữ được đánh dấu trông thế nào',
		demoLead: 'Rê chuột lên một thuật ngữ được đánh dấu, ví dụ',
		demoTail:
			'khi đang đọc, thẻ định nghĩa sẽ mở ngay tại chỗ — không phải rời khỏi câu văn.',
		filterAll: 'Tất cả',
		topicScience: 'Khoa học',
		topicSoftware: 'Phần mềm',
		topicPhilosophy: 'Triết học',
		topicArt: 'Nghệ thuật',
		colophon: 'Một tài liệu sống. Cập nhật lần cuối vào ngày mình dùng một từ mới.',
		postHeading: 'Thuật ngữ',
		postSubhead: 'được đánh dấu trong bài',
		fullGlossaryPre: 'Toàn bộ từ điển ở',
		fullGlossaryLink: 'đây'
	},
	resources: {
		indexLabel: 'Tham khảo / tài liệu trích dẫn',
		titleLead: '',
		titleAccent: 'tài liệu.',
		description:
			'Mọi cuốn sách, bài báo, tiêu chuẩn, và ý tưởng được đề cập trong các bài viết, cùng ghi chú về lý do mỗi tài liệu xuất hiện ở đây.',
		searchPlaceholder: 'Tìm tiêu đề, tác giả, ghi chú…',
		topicsLabel: 'Chủ đề',
		resource: 'tài liệu',
		resources: 'tài liệu',
		noResources: 'Chưa có tài liệu nào khớp bộ lọc này.',
		appearsIn: 'Xuất hiện trong',
		citedInCount: 'được trích trong {count} {essays}',
		essay: 'bài viết',
		essays: 'bài viết',
		fullEntry: 'xem đầy đủ →',
		sourceTag: 'nguồn',
		demoLabel: 'Một trích dẫn trong bài trông thế nào',
		demoLead: 'Ý này đến từ',
		demoTail: ', và con số đưa bạn xuống mục nguồn ở cuối bài.',
		filterAll: 'Tất cả',
		openLink: 'mở ↗',
		colophon: 'Được cập nhật khi có thêm bài viết mới.',
		postHeading: 'Nguồn tham khảo',
		postSubhead: 'được trích dẫn trong bài',
		fullResourcesPre: 'Danh sách đầy đủ ở',
		fullResourcesLink: 'đây',
		types: {
			book: 'Sách',
			paper: 'Bài báo',
			article: 'Bài viết',
			documentation: 'Tài liệu kỹ thuật',
			standard: 'Tiêu chuẩn',
			report: 'Báo cáo',
			talk: 'Bài nói'
		},
		resourceTopics: {
			Philosophy: 'Triết học',
			Science: 'Khoa học',
			Software: 'Phần mềm'
		}
	},
	placeholder: {
		label: 'Chưa dựng xong',
		title: 'căn phòng này vẫn đang được dựng.',
		titleAccent: 'đang được dựng.',
		body: 'Nó đã có một cánh cửa trên thanh điều hướng để hình dáng của trang là thật, nhưng chưa có gì được xếp vào đây. Hãy quay lại sau — hoặc đọc những gì đã viết.',
		back: '← về lưu trữ'
	},
	home: {
		tagline: 'est. 2026',
		mastheadIndex: '',
		headline: 'viết về những điều bản thân mình cảm thấy thú vị.',
		headlineAccent: 'thú vị.',
		description:
			'Các bài viết về khoa học, công nghệ, triết học và nghệ thuật, có thể kèm theo thứ gì đó có thể tương tác.',
		latestLabel: 'Mới nhất',
		interactive: 'Tương tác',
		readEssay: 'đọc bài viết',
		archiveRecent: 'Lưu trữ / gần đây',
		allEssays: 'tất cả bài viết →',
		coverPlate: 'bản cyanotype'
	},
	writing: {
		label: 'Bài viết',
		title: 'tất cả bài viết, theo thứ tự thời gian.',
		titleAccent: 'thời gian.',
		filterAll: 'Tất cả',
		essay: 'bài viết',
		essays: 'bài viết',
		empty: 'chưa có bài nào trong {topic}'
	},
	topics: {
		hubIndex: 'Mục lục chủ đề',
		hubTitle: 'chọn một cánh cửa.',
		hubTitleAccent: 'cánh cửa.',
		doorways: 'cánh cửa',
		topicLabel: 'Chủ đề',
		essay: 'bài viết',
		essays: 'bài viết',
		empty: 'chưa có bài nào ở đây',
		editorNote: 'Lời người biên tập',
		readThree: 'nếu chỉ đọc ba bài',
		handPicked: 'tuyển chọn',
		forthcoming: 'sắp có',
		min: 'phút',
		scratchpadLabel: 'Sổ nháp',
		scratchpadTitle: 'những gì mình đang nghĩ',
		updatedNote: 'không hạn, không hứa',
		kindQuestion: 'Câu hỏi',
		kindDraft: 'Bản nháp',
		kindReading: 'Đang đọc',
		alsoIn: 'cũng thuộc {name}',
		filedIn: 'thuộc {name}',
		everyEssay: 'tất cả bài viết →'
	},
	article: {
		author: 'Tác giả',
		published: 'Đăng ngày',
		reading: 'Thời gian đọc',
		minutes: 'phút',
		section: 'Phần',
		chapter: 'Chương',
		coord: 'Toạ độ',
		draft: 'Nháp — chưa công bố',
		interactive: 'Tương tác',
		filedUnder: 'Thuộc chủ đề',
		series: 'Tuyển tập',
		license: 'Giấy phép',
		words: 'Số chữ',
		oneSentence: 'Nếu chỉ nhớ một câu',
		authorsPick: 'lựa chọn của tác giả',
		neighborhood: 'những bài lân cận',
		handPicked: 'mình tự chọn',
		readInOther: 'read in english →',
		contents: 'Mục lục',
		openContents: 'mở mục lục',
		closeContents: 'đóng mục lục',
		read: 'đã đọc',
		left: 'còn lại',
		minLeft: 'còn {n} phút',
		nearlyDone: 'sắp xong',
		total: 'Tổng',
		min: 'phút'
	},
	/** Bản nháp lộ thiên — nguyên văn của design (`pages/InkDraft.jsx`). */
	openDraft: {
		flagNow: 'Bản nháp lộ thiên · đang còn sửa',
		flagPast: 'Bản nháp lộ thiên · một bản đã qua',
		bodyNow:
			'Bài này chưa xong. Nó nằm đây vì viết trong bóng tối lâu quá thì mình bắt đầu tự lừa mình. Bạn đọc được, nhưng đọc một thứ đang thở.',
		bodyPast:
			'Bạn đang đứng ở một thời điểm cũ của bài. Chữ ở đây từng là chữ thật — nó chỉ không còn là chữ hiện tại.',
		whereItStands: 'bài đang ở đâu',
		settled: 'đã yên',
		editing: 'đang sửa',
		notes: 'mới là ghi chú',
		started: 'bắt đầu',
		edits: 'số lần sửa',
		lengthNow: 'dài lúc này',
		wordsN: '~{n} từ',
		finishBy: 'dự tính xong',
		noPromise: 'chưa hứa',
		pull: 'Kéo bài về một thời điểm',
		railCount: '{edits} lần sửa · {saved} bản được lưu',
		now: 'hiện tại',
		notedThen: 'ghi lúc sửa',
		noNote: 'không ghi chú gì ở bản này',
		backToNow: 'về hiện tại →',
		scarsOn: 'lớp vết sửa · đang bật',
		scarsOff: 'lớp vết sửa · đang tắt',
		scarsExplainOn: 'Câu {struck} và câu {added} ở bản {r} đều đang hiện.',
		scarsExplainOff: 'Chỉ còn văn bản của bản {r}. Vết sửa vẫn nằm đó, chỉ là không hiện.',
		struck: 'bị gạch',
		added: 'mới thêm',
		unwritten: 'chưa viết',
		asAt: 'như ở {r}',
		lastTouched: 'chạm lần cuối {ago}',
		indexMark: 'đang còn sửa',
		revisionOf: 'bản {r} trong {total}'
	},
	video: {
		mux: 'Video',
		youtube: 'Video · YouTube',
		play: 'phát',
		pause: 'tạm dừng',
		mute: 'tắt tiếng',
		unmute: 'bật tiếng',
		soundOn: 'có tiếng',
		soundOff: 'đã tắt',
		seek: 'di chuyển trong video',
		fullscreen: 'toàn màn hình',
		loading: 'đang tải…',
		failed: 'không tải được video này',
		notLoaded: 'chưa tải',
		facadePlay: 'phát trên youtube',
		facadeNote:
			'Chưa có gì được hỏi tới YouTube. Bấm phát thì player mới tải từ youtube-nocookie.com.',
		loadedFrom: 'Đang phát từ youtube-nocookie.com.',
		watchOn: 'mở trên youtube →'
	},
	reflection: {
		label: 'một lời riêng cho tác giả',
		prompts: [
			'Bạn mang được gì ra khỏi bài này?',
			'Có gì ở đây làm bạn nghĩ khác đi về vấn đề không?',
			'Bài này để lại cho bạn câu hỏi nào?'
		],
		placeholder: 'Điều bạn nghĩ, chỉ có tác giả đọc được.',
		privacy: 'không đăng · không hiện cho người đọc khác',
		send: 'Gửi',
		sending: 'Đang gửi…',
		sent: 'Đã nhận. Chỉ tác giả đọc điều này. — Cảm ơn bạn.',
		failed: 'Chưa gửi được — thử lại sau một lát nhé.'
	},
	floatBuilder: {
		label: 'Tính tay · float32',
		zeroTitle: 'Giá trị đặc biệt: số không',
		zeroBody:
			'0 không có dạng chuẩn hóa — không có bit dẫn đầu là 1. Tiêu chuẩn dành riêng cho nó <m>exponent = 0</m> và <m>mantissa = 0</m>. Bit dấu vẫn còn, nên tồn tại cả <m>+0</m> và <m>-0</m>.',
		infTitle: 'Giá trị đặc biệt: vô cực',
		infBody:
			'Vô cực dùng exponent toàn 1 (<m>255</m>) và mantissa <m>0</m>. Dấu cho biết đó là <m>+∞</m> hay <m>−∞</m>. Không có chữ số có nghĩa nào để lưu.',
		nanTitle: 'Giá trị đặc biệt: NaN',
		nanBody:
			'NaN (Not a Number) cũng dùng exponent toàn 1 (<m>255</m>) nhưng mantissa <b>khác 0</b>. Phần mantissa đó là payload — tự do, nên có hàng triệu mẫu bit khác nhau đều là NaN.',
		step1Title: 'Tách dấu',
		step1Body:
			'{signWord} → bit dấu = <ms>{signBit}</ms>. Từ giờ làm việc với <m>|{num}| = {abs}</m>.',
		signNegative: 'Số âm',
		signPositive: 'Số dương',
		step2Title: 'Đổi sang nhị phân',
		step2Body:
			'Phần nguyên: <m>{int} = {intBits}₂</m>. Phần thập phân: nhân đôi liên tục → <m>0.{frac}{ell}</m>. Ghép lại: <m>{intBits}.{frac}{ell}₂</m>{note}.',
		step2Truncated: ' (chuỗi không bao giờ kết thúc — đây là mầm của sai số)',
		step3Title: 'Chuẩn hóa về 1.f × 2ᵉ',
		step3Body:
			'Dời dấu phẩy tới khi bên trái chỉ còn đúng một chữ số <m>1</m>: <m>1.{sig}{ell} × 2<sup>{e}</sup></m>. Số mũ thật là <me>e = {e}</me>. Bit <m>1</m> dẫn đầu đó là <i>bit ẩn</i> — luôn có nên không bao giờ phải lưu.',
		step4Title: 'Cộng bias cho số mũ',
		step4Body:
			'Để lưu số mũ có dấu mà không cần một bit dấu riêng, ta cộng bias <m>127</m>. <me>E = {e} + 127 = {expBits} = {expBin}₂</me>.',
		step5Title: 'Cắt và làm tròn về 23 bit mantissa',
		step5Body:
			'Lấy 23 bit đầu sau dấu phẩy của phần định trị, làm tròn bit cuối: <mm>{mantBin}</mm>',
		step6Title: 'Ráp 32 bit',
		storedLabel: 'Giá trị thực sự được lưu',
		errorLine: 'Bạn hỏi <b>{asked}</b>, máy lưu <b>{stored}</b>. Sai số {err}.',
		exactLine: 'Chính xác — giá trị này biểu diễn được tròn trịa.',
		keySign: 'dấu',
		keyExp: 'số mũ',
		keyMant: 'phần định trị'
	},
	floatExplorer: {
		fieldSign: 'dấu',
		fieldExp: 'số mũ  (8 bit)',
		fieldMant: 'phần định trị  (23 bit)',
		panelSign: 'Dấu',
		panelExp: 'Số mũ',
		panelMant: 'Phần định trị',
		bitN: 'bit {n}',
		bitIsSign: 'dấu',
		bitIsExp: 'bit số mũ {n}',
		bitIsMant: 'bit định trị {n}',
		tabAnatomy: 'giải phẫu các trường',
		tabFraction: 'phân số nhị phân',
		signPositive: '0  →  dương  (+1)',
		signNegative: '1  →  âm  (−1)',
		specialZero: '{bits}  (đặc biệt: biểu diễn ±0)',
		specialSubnormal: '{bits}  (đặc biệt: số mũ được coi là −126)',
		specialInfNan: '{bits}  (đặc biệt: báo hiệu ∞ hoặc NaN)',
		nanPayload: 'Tải trọng NaN ({n})',
		noSignificantBits: '0  (không có bit có nghĩa)',
		reconstructedAs: 'Dựng lại thành',
		representationError: 'Sai số biểu diễn',
		noErrorSpecial: 'Không có sai số — đây là giá trị đặc biệt.',
		exactValue: 'Chính xác — giá trị này biểu diễn được.',
		asked: 'bạn gõ',
		got: 'máy lưu',
		gapUnavoidable: 'Khoảng cách này không tránh được.',
		fractionSpecial: 'Đây là giá trị đặc biệt — không có phần thập phân để chuyển đổi.',
		fractionInteger:
			'{n} không có phần thập phân, nên biểu diễn nhị phân của nó hữu hạn và chính xác (trong khoảng số nguyên này).',
		algorithm:
			'Thuật toán: nhân phần thập phân với 2. Lấy phần nguyên làm chữ số nhị phân tiếp theo. Lặp lại với phần dư.',
		algorithmRepeat:
			' Khi một giá trị lặp lại, dãy số sẽ lặp mãi mãi — con số không thể lưu chính xác được.',
		colStep: 'Bước',
		colValue: 'Giá trị',
		colBit: 'Bit',
		cycleStarts: '⟲ chu kỳ bắt đầu — lặp mãi mãi',
		cutoff: '← cắt ở 23 bit định trị',
		repeatNote:
			'Phần thập phân của {n} lặp vô hạn trong hệ nhị phân, y như 1/3 lặp trong hệ thập phân. Phần định trị chỉ lưu 23 bit của một dãy vô hạn — rồi làm tròn. Chính chỗ làm tròn đó là sai số.',
		spec: 'IEEE 754-2008 độ chính xác đơn'
	},
	floatVsFixed: {
		label: 'Khoảng cách (ULP): fixed-point Q16.16 và float32',
		around: 'Giá trị quanh',
		axis: 'giá trị được biểu diễn (trục log)',
		tie: 'hòa tại 128',
		legendFixed: 'fixed-point Q16.16 — phẳng',
		legendFloat: 'float32 — bậc thang',
		readAround: 'Ở quanh',
		readFloat: 'khoảng cách của float32 là',
		readFixed: 'còn của fixed-point là',
		finer: 'mịn hơn',
		coarser: 'thô hơn',
		readRatio: 'float32 {word} khoảng {ratio}.',
		outOfRange: 'ngoài dải. Q16.16 dừng ở 65.536, nên ở độ lớn này nó không có gì để so.'
	},
	weather: {
		readTime: '◔ thời gian đọc',
		oneSitting: 'một lượt',
		load: 'độ nặng',
		needFirst: 'cần biết trước',
		bestWhen: 'đọc khi',
		honest: 'nói thật ↴'
	},
	about: {
		label: 'Giới thiệu / colophon',
		heading: 'một cuốn sổ tay, giữ nơi công khai.',
		headingAccent: 'công khai',
		portraitPlate: 'bản chân dung',
		metaWho: 'Là ai',
		metaSince: 'Từ',
		metaCadence: 'Nhịp',
		metaCadenceVal: '~hàng tháng',
		metaType: 'Chữ',
		metaTypeVal: 'Space Grotesk / Plex',
		bio1: 'Hi! Mình là <strong>maxubrq</strong>. Mình viết ở đây về những điều cảm thấy thú vị đó có thể là một bài toán vật lý, một đoạn code, một bức tranh hoặc là một câu văn.',
		bio2: 'Một số bài viết sẽ có đính kèm ví dụ tương tác.',
		topicsHeading: 'mình viết về gì',
		elsewhereHeading: 'ở nơi khác',
		farewell: 'Cảm ơn bạn đã ghé qua.',
		vaultTagLeft: 'Không có trong menu',
		vaultTagRight: 'chỉ vào được từ đây',
		vaultTitle: 'căn hầm →',
		vaultBlurb:
			'Một tủ đồ riêng, là những cuốn sách, đĩa nhạc, bài báo, bộ phim và vài món đồ thuộc về mình, mỗi thứ kèm một dòng lý do.'
	},
	readingRoom: {
		privateTag: 'riêng tư · chỉ nằm trên máy này',
		titleLead: 'căn phòng',
		titleAccent: 'đọc.',
		description:
			'Mọi thứ bạn tạo ra bằng việc đọc, gom lại, tạo thành phòng đọc của riêng bạn.',
		colophon:
			'Mọi thứ trên trang này được tính ngay trong trình duyệt của bạn từ những gì bạn đã đọc; không có gì rời khỏi máy, và xóa dữ liệu trang là hết. Chỉ mình bạn có thể thấy căn phòng này.'
	},
	constellation: {
		plate: 'Bản khắc XII',
		title: 'bầu trời của người đọc',
		subtitle: 'bản đồ này tồn tại chỉ vì bạn đã từng ghé qua',
		sectionDeck:
			'Mỗi bài bạn từng mở ra được vẽ thành một ngôi sao, nối lại theo thứ tự bạn đã đọc. Không hai người đọc nào có cùng một bầu trời, và bầu trời này được vẽ ngay tại đây, từ những gì nằm trên máy bạn.',
		emptyTitle: 'bầu trời của bạn vẫn còn tối.',
		emptyBody:
			'Đọc trọn một bài và một ngôi sao sẽ hiện ra ở đây — bản đồ này được vẽ từ chính việc đọc của bạn.',
		layerDomains: 'lĩnh vực',
		legendOrder: 'thứ tự bạn đã đọc',
		legendCitation: 'trích dẫn giữa các bài',
		legendRead: 'đã đọc',
		legendAhead: 'được trích · còn ở phía trước'
	},
	shelf: {
		sectionLabel: 'Kệ đã đọc',
		finishedOnly: 'chỉ những bài đã đọc hết',
		description:
			'Mọi thứ bạn đã đọc hết. Mỗi bài bạn mang được tới dòng cuối cùng trở thành một cái gáy sách.',
		monogram: 'maxubrq',
		emptyTitle: 'kệ của bạn vẫn còn trống.',
		emptyBody:
			'Mang một bài đi tới dòng cuối cùng thì gáy sách của nó hiện ra ở đây. Chỉ mở bài ra thì không có gì được đặt lên kệ.'
	},
	vault: {
		backToAbout: '← về tác giả',
		countLabel: '{count} món · xếp theo năm nhận được',
		titleLead: 'căn',
		titleAccent: 'hầm',
		description:
			'Một tủ đồ của riêng mình: sách, đĩa nhạc, bài báo, phim, khóa học, vài nơi chốn. Sắp xếp theo thứ tự chúng bước vào đời mình. Mỗi thứ được giữ lại vì nó đã đổi cách mình nghĩ một chút hoặc nhiều chút. Một dòng lý do ngắn bằng lời của mình.',
		filterAll: 'Tất cả',
		media: {
			Books: 'Sách',
			Music: 'Nhạc',
			Papers: 'Bài báo',
			Films: 'Phim',
			Objects: 'Đồ vật',
			Course: 'Khóa học',
			Experience: 'Trải nghiệm'
		},
		made: 'làm năm {year}',
		addedCount: 'thêm {count} món',
		expand: 'mở +',
		collapse: 'thu gọn −',
		collapsed: 'giữ lại {count} món trong năm này — bấm để mở',
		empty: 'Chưa có món nào thuộc loại này.',
		colophon:
			'Giữ riêng, chia sẻ khẽ. Không chấm điểm, không link tiếp thị, không nút “mua”. Ghi theo năm nó đến tay mình, không phải năm nó ra đời. Những năm cũ được gấp lại — bấm để mở. — Còn giữ, tức là còn quan trọng.'
	},
	error: {
		title: 'trang này không có trong mục lục.',
		titleAccent: 'không',
		back: '← về lưu trữ',
		status: 'HTTP {status}',
		lost: {
			title: 'trang này không còn ở đây',
			titleAccent: 'ở đây',
			lede: 'Đường dẫn bạn vừa mở không trỏ tới bài nào cả. Có thể bài đã được đổi tên, gộp vào một tuyển tập, hoặc chưa từng tồn tại ngoài một cái link gõ sai.',
			doors: 'những nơi có thể bạn quan tâm',
			doorWriting: 'Toàn bộ, mới nhất trước',
			doorWritingMeta: 'mục lục',
			doorSeries: 'Những bài thuộc về nhau',
			doorSeriesMeta: 'theo thứ tự',
			doorRoom: 'Marks và những câu bạn đã giữ',
			doorRoomMeta: 'riêng tư',
			home: '← về trang chủ',
			hint: 'hoặc ⌘K ở bất kỳ trang nào để tìm trong toàn bộ mục lục',
			alt: 'một con mèo đen cầm tấm biển viết tay PAGE NOT FOUND'
		}
	}
};

export type Messages = typeof en;

export const messages: Record<Lang, Messages> = { en, vi };

/** `fill('{count} essays', { count: 3 })` → `3 essays`. */
export function fill(template: string, values: Record<string, string | number>) {
	return template.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? `{${k}}`));
}
