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
		colophon: 'A living document. Last updated the day I last used a new word.'
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
		colophon: 'Một tài liệu sống. Cập nhật lần cuối vào ngày mình dùng một từ mới.'
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
