/**
 * The bibliography entries themselves, plus the reverse index over them.
 *
 * Plain `.js` for the same reason as `glossary.data.js`: the remark plugin that
 * auto-marks citations runs inside `svelte.config.js`, which Node loads without
 * a TypeScript step. `resources.ts` re-exports all of this with its types.
 *
 * @type {import('./resources').Resource[]}
 */
export const RESOURCES = [
	{
		id: 'ieee-754',
		title: 'IEEE Standard for Floating-Point Arithmetic (IEEE 754)',
		author: 'IEEE',
		year: '1985',
		type: 'standard',
		topic: 'Science',
		note: 'The forty-year-old standard that governs every floating-point calculation your hardware will ever perform. The reason 0.1 + 0.2 gives the same wrong answer on every machine on Earth.',
		url: 'https://www.ime.unicamp.br/~biloti/download/ieee_754-1985.pdf',
		vi: {
			note: 'Tiêu chuẩn bốn mươi năm tuổi chi phối mọi phép tính dấu phẩy động mà phần cứng của bạn sẽ từng thực hiện. Lý do vì sao 0.1 + 0.2 cho cùng một đáp án sai trên mọi cỗ máy trên Trái Đất.',
		},
		appearsIn: [
			{
				slug: '001-float-memory-en',
				title: 'Floating point numbers',
				locale: 'en',
			},
			{
				slug: '001-float-memory-vi',
				title: 'Số dấu chấm động (floating point number)',
				locale: 'vi',
			},
		],
	},
	{
		id: 'gao-imtec-92-26',
		title: 'Patriot Missile Defense: Software Problem Led to System Failure (IMTEC-92-26)',
		author: 'U.S. Government Accountability Office',
		year: '1992',
		type: 'report',
		topic: 'Science',
		note: 'The official documentation of the Patriot missile system failure in Dhahran. A floating-point accumulation error in the system clock, compounding over 100 hours of operation, caused a 0.34-second timing gap — enough to miss a Scud.',
		url: 'https://www.gao.gov/assets/imtec-92-26.pdf',
		vi: {
			note: 'Tài liệu chính thức ghi lại thất bại của hệ thống tên lửa Patriot ở Dhahran. Một sai số tích lũy dấu phẩy động trong đồng hồ hệ thống, dồn lại qua 100 giờ vận hành, tạo ra độ lệch 0,34 giây — đủ để trượt một quả Scud.',
		},
		appearsIn: [
			{
				slug: '001-float-memory-en',
				title: 'Floating point numbers',
				locale: 'en',
			},
			{
				slug: '001-float-memory-vi',
				title: 'Số dấu chấm động (floating point number)',
				locale: 'vi',
			},
		],
	},
	{
		id: 'brooks-mythical-man-month',
		title: 'The Mythical Man Month',
		author: 'Frederick P. Brooks Jr.',
		year: '1975',
		type: 'book',
		topic: 'Software',
		note: 'The tar pit of software complexity — all sufficiently complex systems have hidden parts far larger than visible ones. Adding people to a late project makes it later. Still the clearest book about why software is hard.',
		vi: {
			note: 'Vũng lầy của độ phức tạp phần mềm — mọi hệ thống đủ phức tạp đều có phần chìm lớn hơn hẳn phần nổi. Thêm người vào một dự án đang trễ chỉ khiến nó trễ thêm. Vẫn là cuốn sách sáng rõ nhất về việc vì sao làm phần mềm lại khó.',
		},
		appearsIn: [
			{
				slug: '002-seven-years-in-software_en',
				title: 'Seven Years in Software',
				locale: 'en',
			},
			{
				slug: '002-seven-years-in-software_vi',
				title: 'Bảy Năm Trong Ngành Phần Mềm',
				locale: 'vi',
			},
		],
	},
	{
		id: 'sennett-craftsman',
		title: 'The Craftsman',
		author: 'Richard Sennett',
		year: '2008',
		type: 'book',
		topic: 'Software',
		note: 'The philosophical case for craft: doing something well for its own sake. What distinguishes a good craftsman from a long-tenured engineer is not time served but attitude toward the work.',
		vi: {
			note: 'Lập luận triết học cho tay nghề: làm một việc cho thật tốt vì chính nó. Thứ phân biệt một người thợ giỏi với một kỹ sư lâu năm không phải số năm đã phục vụ mà là thái độ với công việc.',
		},
		appearsIn: [
			{
				slug: '002-seven-years-in-software_en',
				title: 'Seven Years in Software',
				locale: 'en',
			},
			{
				slug: '002-seven-years-in-software_vi',
				title: 'Bảy Năm Trong Ngành Phần Mềm',
				locale: 'vi',
			},
		],
	},
	{
		id: 'lepper-overjustification-1973',
		title:
			'Undermining children’s intrinsic interest with extrinsic reward: A test of the “overjustification” hypothesis',
		author: 'Lepper, Mark R.; Greene, David; Nisbett, Richard E.',
		year: '1973',
		type: 'paper',
		topic: 'Science',
		note: 'The experiment that named the effect. Preschoolers who already chose to draw were promised a certificate, surprised with one, or given nothing; two weeks later only the promised group had lost interest. Both rewarded groups held the same certificate, which is what isolates the promise rather than the reward as the thing that did the damage.',
		url: 'https://www.researchgate.net/publication/281453299_Undermining_children\'s_intrinsic_interest_with_extrinsic_reward_A_test_of_the_overjustification_hypothesis',
		vi: {
			note: 'Thí nghiệm đã đặt tên cho hiện tượng. Những đứa trẻ mẫu giáo vốn đã tự chọn vẽ được hứa một tấm giấy khen, được tặng bất ngờ, hoặc không có gì; hai tuần sau chỉ nhóm được hứa là mất hứng thú. Cả hai nhóm có thưởng đều cầm về cùng một tấm giấy khen — đó là chỗ tách bạch được rằng thứ gây hại là lời hứa chứ không phải phần thưởng.',
		},
		appearsIn: [
			{
				slug: '003-pure-jou-vi',
				title: 'Niềm vui thuần túy và biện minh quá mức (overjustification)',
				locale: 'vi',
			},
		],
	},
];

/** id → resource, for the inline `<R>` citation mark. */
export const RESOURCES_BY_ID = Object.fromEntries(RESOURCES.map((r) => [r.id, r]));

/**
 * Reverse index: post slug → the resources that cite it.
 *
 * `appearsIn` already carries the slug, so a post's bibliography is a lookup,
 * not a text scan. Order follows RESOURCES itself (grouped by topic,
 * author-curated), which is what keeps citation numbers stable.
 *
 * @type {Record<string, import('./resources').Resource[]>}
 */
const BY_SLUG = {};
for (const r of RESOURCES) {
	for (const a of r.appearsIn) {
		(BY_SLUG[a.slug] ??= []).push(r);
	}
}

/**
 * The bibliography of one post, in citation order.
 *
 * @param {string} slug
 * @returns {import('./resources').Resource[]}
 */
export function getResourcesForSlug(slug) {
	return BY_SLUG[slug] ?? [];
}
