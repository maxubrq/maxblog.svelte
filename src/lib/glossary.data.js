/**
 * The glossary entries themselves.
 *
 * Plain `.js` on purpose: this data is read both by the app and by the remark
 * pass in `svelte.config.js`, and that config is loaded by Node with no
 * TypeScript step — the same reason `reading-time.js` is not `.ts`. The types
 * live next door in `glossary.ts`, which re-exports this; JSDoc keeps checking.
 *
 * @type {import('./glossary').GlossaryTerms}
 */
export const TERMS = {
	flow: {
		term: 'flow',
		pos: 'noun · psychology',
		short:
			'The state of complete absorption in a task — where challenge and skill are matched, time disappears, and the self drops away. Introduced by Mihaly Csikszentmihalyi.',
		long: "From Csikszentmihalyi's Flow: The Psychology of Optimal Experience (1990). Flow is characterized by intense concentration, loss of self-consciousness, and intrinsic reward independent of outcome. Crucially, it requires intrinsic motivation: activities done for external rewards rarely produce it. The state is not relaxation; it requires real challenge matched to real skill — too easy produces boredom, too hard produces anxiety.",
		topic: 'Philosophy',
		appearances: [
			{
				title: 'Seven Years in Software',
				slug: '002-seven-years-in-software_en',
				section: 'Burnout, stress, and mental health',
			},
		],
		vi: {
			pos: 'danh từ · tâm lý học',
			short:
				'Trạng thái hoàn toàn bị hút vào một công việc — khi thách thức và kỹ năng được cân bằng, thời gian biến mất, và bản thân cũng tan biến. Được giới thiệu bởi Mihaly Csikszentmihalyi.',
			long: 'Từ Flow: The Psychology of Optimal Experience (1990) của Csikszentmihalyi. Flow được đặc trưng bởi sự tập trung mãnh liệt, mất ý thức về bản thân, và phần thưởng nội tại độc lập với kết quả. Quan trọng là: flow đòi hỏi động lực nội tại. Những hoạt động làm vì phần thưởng bên ngoài hiếm khi tạo ra nó. Trạng thái này không phải là thư giãn — nó đòi hỏi thách thức thực sự tương xứng với kỹ năng thực sự.',
			appearances: [
				{
					title: 'Bảy Năm Trong Ngành Phần Mềm',
					slug: '002-seven-years-in-software_vi',
					section: 'Burn out, stress và sức khỏe tinh thần',
				},
			],
		},
	},
};
