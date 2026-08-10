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
		allPreferences: 'All reading preferences',
		dropdownHint: 'Type size, measure and the reading cursor live there.'
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
		mastheadIndex: 'Nº 001 / index',
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
		empty: 'nothing filed here yet'
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
		readInOther: 'đọc bản tiếng việt →'
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
		farewell: 'Thanks for stopping by.'
	},
	/** Per-topic blurb, keyed by the topic's canonical (English) name. */
	topicBlurbs: {
		Science: 'Whatever makes me curious — math, physics, and everything in between.',
		Tech: 'Distributed systems, algorithms, OSS — explaining things and shipping them.',
		Philosophy:
			'Stoicism, Existentialism, Buddhist philosophy — and the joy of deep questions.',
		Art: 'Cinema, literature, music. The arts as a form of thinking.',
		Thinking: 'Half-thoughts. Notes from the margins of my own life.',
		Notes: 'In conversation with what I read — books, papers, single lines.'
	},
	error: {
		title: 'this page is not in the index.',
		titleAccent: 'not', // ink
		back: '← back to the archive'
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
		allPreferences: 'Toàn bộ tùy chỉnh đọc',
		dropdownHint: 'Cỡ chữ, độ dài dòng và con trỏ đọc nằm ở đó.'
	},
	placeholder: {
		label: 'Chưa dựng xong',
		title: 'căn phòng này vẫn đang được dựng.',
		titleAccent: 'đang được dựng.',
		body: 'Nó đã có một cánh cửa trên thanh điều hướng để hình dáng của trang là thật, nhưng chưa có gì được xếp vào đây. Hãy quay lại sau — hoặc đọc những gì đã viết.',
		back: '← về lưu trữ'
	},
	home: {
		tagline: 'Một cuốn sổ tay · est. 2024',
		mastheadIndex: 'Nº 001 / index',
		headline: 'viết về những điều bản thân mình cảm thấy thú vị.',
		headlineAccent: 'thú vị.',
		description:
			'Các bài viết về khoa học, công nghệ, triết học và nghệ thuật, thường kèm theo thứ gì đó có thể tương tác.',
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
		empty: 'chưa có bài nào ở đây'
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
		readInOther: 'read in english →'
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
		bio1: 'Mình là <strong>maxubrq</strong>. Mình viết ở đây về những điều cảm thấy thú vị đó có thể là một bài toán vật lý, một đoạn code, một bức tranh hoặc là một câu văn.',
		bio2: 'Một số bài viết sẽ có đính kèm ví dụ tương tác.',
		topicsHeading: 'mình viết về gì',
		elsewhereHeading: 'ở nơi khác',
		farewell: 'Cảm ơn bạn đã ghé qua.'
	},
	topicBlurbs: {
		Science: 'Bất cứ điều gì làm mình tò mò, toán, lý, và mọi thứ ở giữa.',
		Tech: 'Hệ thống phân tán, thuật toán, OSS, có thể là giải thích hoặc build cái gì đó.',
		Philosophy: 'Khắc kỷ, hiện sinh, Phật pháp, và niềm vui của những câu hỏi sâu sắc.',
		Art: 'Điện ảnh, văn học, âm nhạc. Nghệ thuật như một cách tư duy.',
		Thinking: 'Những ý nghĩ nửa chừng. Ghi chú từ rìa của chính cuộc đời mình.',
		Notes: 'Đối thoại với những gì mình đọc — sách, bài báo, đôi khi chỉ một câu.'
	},
	error: {
		title: 'trang này không có trong mục lục.',
		titleAccent: 'không',
		back: '← về lưu trữ'
	}
};

export type Messages = typeof en;

export const messages: Record<Lang, Messages> = { en, vi };

/** `fill('{count} essays', { count: 3 })` → `3 essays`. */
export function fill(template: string, values: Record<string, string | number>) {
	return template.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? `{${k}}`));
}
