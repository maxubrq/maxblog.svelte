/**
 * The doorways, and what stands behind each one.
 *
 * A topic here is not a filter over the archive — it is a room with an editor
 * in it. Besides the name and the tagline, each carries three things the posts
 * cannot supply: a note on why the room exists, three hand-picked ways in, and
 * a scratchpad of what is being thought about but not yet written. All of it is
 * authored, all of it copied from the production blog (`~/MyApps/maxblog/src/
 * lib/topics.ts`) so both editions say the same thing about the same room.
 *
 * **`id` is not `name`.** The id keys the URL and the frontmatter match and is
 * never translated; the name is what is printed and always is. That separation
 * is what lets `/vi/topics/science` be titled *Khoa học* without a Vietnamese
 * essay having to write `topic: 'Khoa học'` in its frontmatter, and it is the
 * one place this edition changed its mind — the names used to stay English on
 * the grounds that they key the URLs, which conflated the two jobs.
 *
 * The doorway this edition calls `tech` is production's `software`: same room,
 * same writing, and `frontmatterTopics` accepts both spellings so a post moves
 * between the editions without an edit.
 *
 * ## `starters` and `scratchpad` are deliberately empty
 *
 * Every room's arrays are `[]` on purpose, and this is not an unfinished port —
 * the author emptied them, to be filled in once the archive is thick enough to
 * choose from. Both sections say something a four-post site cannot say
 * honestly: *if you read three* is a claim that there were more than three to
 * pick from, and a scratchpad of six drafts beside four published essays
 * advertises a backlog rather than a body of work. The page renders neither
 * section while its array is empty, so a room is masthead · editor's note ·
 * what is filed here, and reads as finished rather than as scaffolding.
 *
 * Production's versions are the text to start from when they do go back in:
 * `~/MyApps/maxblog/src/lib/topics.ts`, three starters and about five
 * scratchpad items per room, each with a `vi` twin. Nothing else has to change
 * — the types, the components and the tail's de-duplication (a starter's essay
 * is not repeated below) are all still here and still wired.
 */

import type { Halftone } from '$lib/images';

export interface TopicStarter {
	/** The roman numeral printed beside it — I · II · III. */
	num: string;
	title: string;
	/** `null` when the essay is not written yet: printed, unlinked, as forthcoming. */
	slug: string | null;
	min: number;
	/** Why *this* one, in the editor's voice. Printed in quotes. */
	why: string;
}

export interface ScratchpadItem {
	kind: 'question' | 'draft' | 'reading';
	text: string;
}

/**
 * How the editor's note is set. A room where the writing is careful reads
 * differently from one where it is loose, and the type says so before the words
 * do — this is the only place in the site where a body size is a property of
 * the *subject* rather than of the reader's settings.
 */
export type TopicTone = 'clinical-warm' | 'plainspoken' | 'literary' | 'sparse';

export interface TopicLocale {
	name: string;
	tagline: string;
	intro: string[];
	starters: TopicStarter[];
	scratchpad: ScratchpadItem[];
}

/**
 * The plate that stands beside the editor's note — the department page of a
 * magazine, which is what a room with an editor in it looks like in print.
 *
 * It exists because the note was the only band on the page that stopped
 * halfway: the masthead above and the list below both run the full width, so
 * the space to its right read as unfinished rather than as margin.
 *
 * **No `alt`, on purpose.** The plate is atmospheric and the note beside it
 * already says what the room is, in the reader's own language — the same
 * reasoning as the 404 cat. That also settles what would otherwise be an
 * awkward question, since an image is not translated but its description
 * would have to be.
 *
 * With no `src` the plate draws its labelled placeholder, the way the unported
 * live figures do: the slot is visibly reserved rather than silently missing.
 * Delete a room's `plate` entirely to take the column back until a picture for
 * it actually exists.
 */
export interface TopicPlate {
	/** A plain Cloudinary delivery URL, no transformations — `$lib/images` adds those. */
	src?: string;
	/** Shown while `src` is unset. Names the picture the room is waiting for. */
	placeholder?: string;
	/**
	 * Screen it to 1-bit dots instead of duotoning it. A halftone reads as
	 * newsprint, which suits a department page; the cyanotype is the default
	 * because it rescues almost any photograph (§6).
	 */
	halftone?: Halftone;
}

export interface TopicData extends TopicLocale {
	/** Keys the URL and the frontmatter match. Never translated. */
	id: string;
	tone: TopicTone;
	/** The `topic` values in frontmatter that file a post into this room. */
	frontmatterTopics: string[];
	/** Not localized — see `TopicPlate`. */
	plate?: TopicPlate;
	vi?: Partial<TopicLocale>;
}

/**
 * One room in one locale, with the English text as the fallback per field —
 * the same contract as `getGlossaryLocale`, so a half-translated room still
 * prints rather than showing gaps.
 */
export function getTopicLocale(data: TopicData, lang: string): TopicLocale {
	const base: TopicLocale = {
		name: data.name,
		tagline: data.tagline,
		intro: data.intro,
		starters: data.starters,
		scratchpad: data.scratchpad
	};
	return lang === 'vi' && data.vi ? { ...base, ...data.vi } : base;
}

export const TONE_STYLES: Record<
	TopicTone,
	{ size: number; lh: number; italic: boolean; align: 'left' | 'center'; maxW: string }
> = {
	'clinical-warm': { size: 18, lh: 1.7, italic: false, align: 'left', maxW: '54ch' },
	plainspoken: { size: 17.5, lh: 1.7, italic: false, align: 'left', maxW: '54ch' },
	literary: { size: 19, lh: 1.75, italic: true, align: 'left', maxW: '48ch' },
	sparse: { size: 21, lh: 1.6, italic: false, align: 'center', maxW: '34ch' }
};

/** The order on the hub, and the numbering that goes with it. */
export const TOPICS_ORDER = ['science', 'tech', 'philosophy', 'art', 'thinking', 'notes'] as const;
export type TopicId = (typeof TOPICS_ORDER)[number];

export const TOPIC_CONTENT: Record<TopicId, TopicData> = {
	science: {
		id: 'science',
		name: 'Science',
		tagline: 'Whatever makes me curious. Math, physics, and everything in between.',
		tone: 'clinical-warm',
		frontmatterTopics: ['Science'],
		plate: {
			src: 'https://res.cloudinary.com/dmsb4anlx/image/upload/v1786432327/maxubrq.space/Science_o5l6b5.png',
			halftone: 'screen'
		},
		intro: [
			"These essays follow curiosity, not a curriculum. The subject might be a pendulum, a prime number, a probability that won't leave me alone, or a process that turns out to be more interesting than it looks. Physics appears most often — it is where my intuition is strongest — but this section is not bounded by it.",
			'I try to stay honest about what I do not know. When I hedge, I hedge deliberately. When I use a technical word, I mean a specific thing; many of them have glossary entries.',
			'If you find a mistake, please tell me. That is how the archive gets better.',
		],
		starters: [],
		scratchpad: [],
		vi: {
			name: 'Khoa học',
			tagline: 'Bất cứ điều gì làm mình tò mò. Toán, lý, và mọi thứ ở giữa.',
			intro: [
				'Những bài viết này đi theo sự tò mò, không phải chương trình học. Chủ đề có thể là một con lắc, một số nguyên tố, một xác suất cứ ám mình mãi, hay một quá trình nào đó thú vị hơn vẻ ngoài. Vật lý xuất hiện nhiều nhất — đó là nơi trực giác của mình mạnh nhất — nhưng phần này không bị giới hạn bởi nó.',
				'Mình cố gắng trung thực về những gì mình không biết. Khi nói không chắc, đó là có chủ ý. Khi dùng một từ kỹ thuật, mình muốn nói một điều cụ thể; nhiều từ trong số đó có mục trong từ điển.',
				'Nếu bạn tìm thấy lỗi sai, xin hãy cho mình biết. Đó là cách lưu trữ trở nên tốt hơn.',
			],
			starters: [],
			scratchpad: [],
		},
	},

	tech: {
		id: 'tech',
		name: 'Tech',
		tagline: 'Two modes: writing to explain, building to ship.',
		tone: 'plainspoken',
		frontmatterTopics: ['Tech', 'Software'],
		plate: { src: 'https://res.cloudinary.com/dmsb4anlx/image/upload/v1786432326/maxubrq.space/Tech_yem2es.png', halftone: 'screen' },
		intro: [
			"I am a Senior Software Engineer working on distributed systems — the coordination problems, the consistency tradeoffs, the things that break in production at 3am. That background shapes what I write about here, but it doesn't limit it.",
			'The content takes two forms. Sometimes it is an explanation: I take something I understand and write it out until someone else can understand it too. Sometimes it is a thing: a library, a tool, a system — something you can actually run. Both are worth making.',
			'Scope is intentionally wide. An algorithm that surprised me, an OSS project I started, a distributed protocol I spent a week reading, a small utility that solved one problem exactly — if it excited me enough to write about it, it is here.',
		],
		starters: [],
		scratchpad: [],
		vi: {
			name: 'Phần mềm',
			tagline: 'Hai chế độ: viết để giải thích, xây dựng để ra mắt.',
			intro: [
				'Mình là Senior Software Engineer làm việc trên các hệ thống phân tán — những bài toán phối hợp, đánh đổi về tính nhất quán, những thứ hỏng lúc 3 giờ sáng. Bối cảnh đó định hình những gì mình viết ở đây, nhưng không giới hạn nó.',
				'Nội dung ở đây có hai dạng. Đôi khi là giải thích: mình lấy thứ gì đó mình hiểu và viết ra cho đến khi người khác có thể hiểu được. Đôi khi là một sản phẩm: một thư viện, một công cụ, một hệ thống — thứ gì đó bạn có thể thực sự chạy được. Cả hai đều đáng làm.',
				'Phạm vi cố ý rộng. Một thuật toán làm mình ngạc nhiên, một dự án OSS mình bắt đầu, một giao thức phân tán mình dành cả tuần để đọc, một tiện ích nhỏ giải quyết đúng một vấn đề — nếu nó đủ thú vị để viết, nó sẽ ở đây.',
			],
			starters: [],
			scratchpad: [],
		},
	},

	philosophy: {
		id: 'philosophy',
		name: 'Philosophy',
		tagline: 'Deep questions. The joy of sitting with them.',
		tone: 'plainspoken',
		frontmatterTopics: ['Philosophy'],
		plate: { src: 'https://res.cloudinary.com/dmsb4anlx/image/upload/v1786432327/maxubrq.space/Philosophy_jyhlh2.png', halftone: 'screen' },
		intro: [
			'I came to philosophy not through a classroom but through questions that would not leave me alone. What does it mean to live well? What do I owe to the present moment? What is left of the self when you strip away its habits? These are not new questions — every tradition has answered them — but the answers keep surprising me.',
			'The schools I return to most: Stoicism, for what it says about control and acceptance; Existentialism, for what it says about freedom and the weight of choosing; the philosophy of the Buddha, for what it says about attention and the nature of suffering. I am not loyal to any of them. The question matters more than the school.',
			'I think philosophy is what happens when curiosity refuses to stay shallow. If you keep asking why — about a proof, a system, a film, a feeling — you eventually arrive somewhere the textbooks call philosophy. These essays are what I found there.',
		],
		starters: [],
		scratchpad: [],
		vi: {
			name: 'Triết học',
			tagline: 'Những câu hỏi sâu sắc. Niềm vui được ngồi với chúng.',
			intro: [
				'Mình đến với triết học không phải qua lớp học mà qua những câu hỏi cứ không chịu rời đi. Sống tốt có nghĩa là gì? Mình nợ khoảnh khắc hiện tại điều gì? Còn lại gì của bản thân khi bạn lột bỏ hết những thói quen? Đây không phải là câu hỏi mới — mọi trường phái đều đã trả lời chúng — nhưng những câu trả lời cứ tiếp tục làm mình ngạc nhiên.',
				'Những trường phái mình hay quay lại nhất: Chủ nghĩa khắc kỷ, vì những gì nó nói về kiểm soát và chấp nhận; Chủ nghĩa hiện sinh, vì những gì nó nói về tự do và sức nặng của việc lựa chọn; triết học nhà Phật, vì những gì nó nói về sự chú ý và bản chất của đau khổ. Mình không trung thành với trường phái nào. Câu hỏi quan trọng hơn trường phái.',
				'Mình nghĩ triết học là những gì xảy ra khi sự tò mò từ chối ở lại nông cạn. Nếu bạn cứ hỏi tại sao — về một chứng minh, một hệ thống, một bộ phim, một cảm xúc — cuối cùng bạn sẽ đến nơi mà sách giáo khoa gọi là triết học. Những bài viết này là những gì mình tìm thấy ở đó.',
			],
			starters: [],
			scratchpad: [],
		},
	},

	art: {
		id: 'art',
		name: 'Art',
		tagline: 'Cinema, literature, music. The arts as a form of thinking.',
		tone: 'plainspoken',
		frontmatterTopics: ['Art'],
		plate: { src: 'https://res.cloudinary.com/dmsb4anlx/image/upload/v1786432326/maxubrq.space/Art_yllp8b.png', halftone: 'screen' },
		intro: [
			'I write about art the way I wish people wrote about it — without assuming you already agree it matters, and without explaining so much that the experience disappears.',
			'The center of gravity here is cinema, the novel, and music. The Agnes Martin essay is here too, and it stays — looking at a painting slowly turns out to be the same discipline as watching a film carefully or sitting with a difficult chord.',
		],
		starters: [],
		scratchpad: [],
		vi: {
			name: 'Nghệ thuật',
			tagline: 'Điện ảnh, văn học, âm nhạc. Nghệ thuật như một cách tư duy.',
			intro: [
				'Mình viết về nghệ thuật theo cách mình muốn được đọc về nó — không giả định rằng bạn đã đồng ý nó quan trọng, và không giải thích quá nhiều đến mức trải nghiệm biến mất.',
				'Trọng tâm ở đây là điện ảnh, tiểu thuyết, và âm nhạc. Bài viết về Agnes Martin cũng ở đây và vẫn còn — nhìn một bức tranh chậm rãi hóa ra là cùng một kỷ luật với xem một bộ phim cẩn thận, hay ngồi với một hợp âm khó.',
			],
			starters: [],
			scratchpad: [],
		},
	},

	thinking: {
		id: 'thinking',
		name: 'Thinking',
		tagline: 'Half-thoughts. Notes from the margins of my own life.',
		tone: 'literary',
		frontmatterTopics: ['Thinking'],
		plate: { src: 'https://res.cloudinary.com/dmsb4anlx/image/upload/v1786432328/maxubrq.space/Thinking_ythle7.png', halftone: 'screen' },
		intro: [
			'Not every thought is about something. Some thoughts are about themselves — about what it feels like to notice them, to follow them, to lose them. This is the place where I keep those.',
			'The pieces here are short, often unfinished, sometimes just a paragraph that was true on a particular afternoon. They do not argue and they do not conclude. They report.',
			'If you came looking for a thesis, you will not find one. If you came looking for company while you sit with your own unfinished thoughts, you might.',
		],
		starters: [],
		scratchpad: [],
		vi: {
			name: 'Suy nghĩ',
			tagline: 'Những ý nghĩ nửa chừng. Ghi chú từ rìa của chính cuộc đời mình.',
			intro: [
				'Không phải ý nghĩ nào cũng về một điều gì đó. Có những ý nghĩ chỉ về chính nó — về cảm giác khi nhận ra nó, đi theo nó, rồi đánh mất nó. Đây là nơi mình giữ những ý nghĩ như thế.',
				'Những bài ở đây ngắn, thường dang dở, đôi khi chỉ là một đoạn văn từng đúng vào một buổi chiều cụ thể. Chúng không tranh luận và không kết luận. Chúng chỉ ghi lại.',
				'Nếu bạn tìm đến đây để có một luận điểm, bạn sẽ không thấy. Nếu bạn tìm đến đây để có người ngồi cùng trong khi bạn ngồi với những ý nghĩ chưa hoàn chỉnh của riêng mình, có thể bạn sẽ thấy.',
			],
			starters: [],
			scratchpad: [],
		},
	},

	notes: {
		id: 'notes',
		name: 'Notes',
		tagline: 'In conversation with what I read.',
		tone: 'plainspoken',
		frontmatterTopics: ['Notes'],
		plate: { src: 'https://res.cloudinary.com/dmsb4anlx/image/upload/v1786432326/maxubrq.space/Notes_djkvly.png', halftone: 'screen' },
		intro: [
			'Some books I read once and put away. Others I argue with for years. The notes here are the second kind — sustained responses to texts that did not let me leave them alone, written in the margin and then expanded outward.',
			'Each note begins with a source: a book, a paper, an essay, sometimes a single line. The form depends on what the source asks for. Some are close readings. Some are objections. Some are simply the act of writing down what I understood, so I can find it again.',
			'Reading is half the conversation. This is my half.',
		],
		starters: [],
		scratchpad: [],
		vi: {
			name: 'Ghi chú',
			tagline: 'Đối thoại với những gì mình đọc.',
			intro: [
				'Có những cuốn sách mình đọc một lần rồi gấp lại. Có những cuốn mình tranh luận cùng suốt nhiều năm. Những ghi chú ở đây là loại thứ hai — phản hồi kéo dài với những văn bản không chịu rời mình, viết bên lề rồi mở rộng ra ngoài lề.',
				'Mỗi ghi chú bắt đầu từ một nguồn: một cuốn sách, một bài báo, một tiểu luận, đôi khi chỉ là một câu. Hình thức tùy thuộc vào nguồn yêu cầu gì. Có cái là đọc kỹ. Có cái là phản đối. Có cái chỉ đơn giản là hành động viết xuống điều mình hiểu, để sau này còn tìm lại.',
				'Đọc là một nửa của cuộc đối thoại. Đây là nửa của mình.',
			],
			starters: [],
			scratchpad: [],
		},
	},
};
