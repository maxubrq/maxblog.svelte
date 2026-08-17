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
	/**
	 * The vocabulary of essay 001. Each of these was checked against the prose
	 * before it was written down: the term is a word the essay actually says, in
	 * both editions, and `section` is the `##` it is first said under. The
	 * dictionary describes the writing; it does not prescribe to it.
	 */
	mantissa: {
		term: 'mantissa',
		pos: 'noun · computer arithmetic',
		short:
			'The significant digits of a floating-point number — the part that carries precision, while the exponent carries range.',
		long: "Also called the significand. In IEEE 754 the mantissa is stored normalised, as a fraction after an implied leading 1, which is why a 23-bit float32 field buys 24 bits of precision: the first bit is never written down because it is never anything else. This is also why precision is a fixed *number of digits* rather than a fixed step size — the mantissa says how many digits, the exponent says where they sit. Doubling a value leaves the mantissa alone and adds one to the exponent, so the gap to the next representable number doubles with it.",
		topic: 'Software',
		appearances: [
			{
				title: 'Floating point numbers',
				slug: '001-float-memory-en',
				section: 'The core problem: an infinite line into a finite number of bits',
			},
		],
		vi: {
			term: 'phần định trị',
			pos: 'danh từ · số học máy tính',
			short:
				'Các chữ số có nghĩa của một số dấu chấm động — phần mang độ chính xác, trong khi số mũ mang dải giá trị.',
			long: 'Còn gọi là significand. Trong IEEE 754, phần định trị được lưu ở dạng đã chuẩn hóa, như phần lẻ đứng sau một bit 1 ngầm định — đó là lý do trường 23 bit của float32 lại cho 24 bit độ chính xác: bit đầu tiên không bao giờ được ghi ra vì nó không bao giờ là gì khác. Đây cũng là lý do độ chính xác là một *số lượng chữ số* cố định chứ không phải một bước nhảy cố định: phần định trị nói có bao nhiêu chữ số, số mũ nói chúng nằm ở đâu. Nhân đôi một giá trị không đụng tới phần định trị mà chỉ cộng một vào số mũ, nên khoảng cách tới số biểu diễn được kế tiếp cũng nhân đôi theo.',
			appearances: [
				{
					title: 'Số dấu chấm động (floating point number)',
					slug: '001-float-memory-vi',
					section: 'Vấn đề cốt lõi: nén một trục số vô hạn vào một số lượng hữu hạn bit',
				},
			],
		},
	},

	bias: {
		term: 'bias',
		pos: 'noun · computer arithmetic',
		short:
			'The fixed offset added to a floating-point exponent before it is stored, so the stored field is always unsigned.',
		long: 'A float32 exponent runs from −126 to +127, and storing a signed number would mean either a sign bit of its own or two’s complement — both of which break ordering. Instead 127 is added first, so the whole range lands in 0…255 and the stored bits rise monotonically with the value. The payoff is that two positive floats can be compared as if they were plain integers, bit pattern against bit pattern, which is why hardware comparison is one instruction. The two ends of the stored range, all-zeros and all-ones, are reserved for the special values.',
		topic: 'Software',
		appearances: [
			{
				title: 'Floating point numbers',
				slug: '001-float-memory-en',
				section: 'The anatomy of a floating-point number',
			},
		],
		vi: {
			pos: 'danh từ · số học máy tính',
			short:
				'Phần bù cố định được cộng vào số mũ trước khi lưu, để trường số mũ luôn là một số không dấu.',
			long: 'Số mũ của float32 chạy từ −126 tới +127, và lưu một số có dấu sẽ cần thêm một bit dấu riêng hoặc dùng bù hai — cả hai đều phá vỡ thứ tự. Thay vào đó, 127 được cộng vào trước, nên toàn bộ dải rơi vào 0…255 và các bit đã lưu tăng đơn điệu theo giá trị. Cái được là hai số thực dương có thể so sánh như hai số nguyên thường, mẫu bit đấu mẫu bit — đó là lý do phần cứng so sánh chỉ bằng một lệnh. Hai đầu của dải lưu trữ, toàn 0 và toàn 1, được dành riêng cho các giá trị đặc biệt.',
			appearances: [
				{
					title: 'Số dấu chấm động (floating point number)',
					slug: '001-float-memory-vi',
					section: 'Cấu trúc của một số dấu chấm động',
				},
			],
		},
	},

	'fixed-point': {
		term: 'fixed-point',
		pos: 'noun · computer arithmetic',
		short:
			'A number format that nails the radix point at one agreed position, so every value carries the same absolute step.',
		long: 'The whole of the format is a convention: the bits are a plain integer, and the reader agrees where the point sits — Q16.16 means sixteen bits of whole part and sixteen of fraction, a step of 2⁻¹⁶ everywhere on the line. That uniformity is the point. Money is counted in fixed-point (or in integer cents) because a cent must weigh the same at ten and at ten million, and a format whose step grows with the value cannot promise that. What it gives up is range: the same bits that buy a constant step near zero run out early at the top.',
		topic: 'Software',
		appearances: [
			{
				title: 'Floating point numbers',
				slug: '001-float-memory-en',
				section: 'The core problem: an infinite line into a finite number of bits',
			},
		],
		vi: {
			pos: 'danh từ · số học máy tính',
			short:
				'Định dạng số cố định dấu chấm ở một vị trí đã thỏa thuận, nên mọi giá trị đều mang cùng một bước nhảy tuyệt đối.',
			long: 'Toàn bộ định dạng chỉ là một quy ước: các bit là một số nguyên bình thường, và người đọc thống nhất với nhau dấu chấm nằm ở đâu — Q16.16 nghĩa là mười sáu bit phần nguyên và mười sáu bit phần lẻ, bước nhảy 2⁻¹⁶ ở mọi nơi trên trục số. Chính sự đồng đều đó là mấu chốt. Tiền tệ được đếm bằng fixed-point (hoặc bằng số nguyên đơn vị xu) vì một xu phải nặng như nhau ở mức mười và ở mức mười triệu, còn một định dạng có bước nhảy phình theo giá trị thì không hứa được điều đó. Cái nó đánh đổi là dải giá trị: cùng số bit ấy, mua được bước nhảy đều ở gần 0 thì hết sạch từ sớm ở phía trên.',
			appearances: [
				{
					title: 'Số dấu chấm động (floating point number)',
					slug: '001-float-memory-vi',
					section: 'Vấn đề cốt lõi: nén một trục số vô hạn vào một số lượng hữu hạn bit',
				},
			],
		},
	},

	ulp: {
		term: 'ULP',
		pos: 'noun · computer arithmetic',
		short:
			'Unit in the last place — the distance from one representable float to the next, and so the resolution of the format at that value.',
		long: 'ULP(v) = 2^(E−p): it depends on the exponent, which is to say on how large the value is. This is the single fact that makes floating-point behave the way it does. Precision is *relative* — the ratio ULP(v)/v is roughly 2^−p everywhere, so a float keeps about the same number of significant digits at 0.001 and at a billion — and it is the right unit for talking about error: "correct to within one ULP" is a claim about the format, while "correct to within 0.0001" is a claim that stops being true as the numbers grow.',
		topic: 'Software',
		appearances: [
			{
				title: 'Floating point numbers',
				slug: '001-float-memory-en',
				section: 'The gaps between floating-point numbers',
			},
		],
		vi: {
			pos: 'danh từ · số học máy tính',
			short:
				'Unit in the last place — khoảng cách từ một số biểu diễn được tới số kế tiếp, tức là độ phân giải của định dạng tại giá trị đó.',
			long: 'ULP(v) = 2^(E−p): nó phụ thuộc vào số mũ, tức là phụ thuộc vào việc giá trị lớn cỡ nào. Đây chính là sự thật duy nhất khiến số dấu chấm động hành xử theo cách của nó. Độ chính xác là *tương đối* — tỉ lệ ULP(v)/v xấp xỉ 2^−p ở mọi nơi, nên một số float giữ được xấp xỉ cùng số chữ số có nghĩa ở 0,001 cũng như ở một tỉ — và đó mới là đơn vị đúng để nói về sai số: "đúng trong phạm vi một ULP" là một phát biểu về định dạng, còn "đúng trong phạm vi 0,0001" là phát biểu sẽ thôi đúng khi các con số lớn lên.',
			appearances: [
				{
					title: 'Số dấu chấm động (floating point number)',
					slug: '001-float-memory-vi',
					section: 'Khoảng cách giữa các số dấu chấm động',
				},
			],
		},
	},

	subnormal: {
		term: 'subnormal',
		pos: 'adjective · computer arithmetic',
		short:
			'A float too small to be normalised, stored with the implied leading 1 dropped — trading precision to reach closer to zero.',
		long: 'Below the smallest normal value the exponent has nowhere left to go, and without subnormals the line would jump straight from that value to zero — a gap larger than the gap between any two neighbours above it. So the all-zero exponent is reserved: the leading 1 is no longer implied, and the mantissa is read as a plain fraction. The numbers reach nearer to zero, and pay for it, losing a bit of precision for every power of two they descend until nothing is left. The property this buys is that a − b == 0 if and only if a == b, which is not true in a format that flushes to zero.',
		topic: 'Software',
		appearances: [
			{
				title: 'Floating point numbers',
				slug: '001-float-memory-en',
				section: 'The gaps between floating-point numbers',
			},
		],
		vi: {
			pos: 'tính từ · số học máy tính',
			short:
				'Số float quá nhỏ để chuẩn hóa, được lưu với bit 1 ngầm định bị bỏ đi — đánh đổi độ chính xác để tiến gần 0 hơn.',
			long: 'Dưới giá trị chuẩn hóa nhỏ nhất, số mũ không còn chỗ để đi nữa, và nếu không có subnormal thì trục số sẽ nhảy thẳng từ giá trị đó về 0 — một khoảng trống lớn hơn khoảng cách giữa bất kỳ hai số liền kề nào ở phía trên. Vì vậy số mũ toàn 0 được dành riêng: bit 1 không còn ngầm định nữa, và phần định trị được đọc như một phân số thường. Các con số với tới gần 0 hơn, và trả giá bằng cách mất dần một bit độ chính xác cho mỗi lũy thừa của hai đi xuống, cho tới khi không còn gì. Cái nó mua được là tính chất a − b == 0 khi và chỉ khi a == b, điều không đúng trong một định dạng làm tròn thẳng về 0.',
			appearances: [
				{
					title: 'Số dấu chấm động (floating point number)',
					slug: '001-float-memory-vi',
					section: 'IEEE 754, các định dạng mở rộng và giá trị đặc biệt',
				},
			],
		},
	},

	nan: {
		term: 'NaN',
		pos: 'noun · computer arithmetic',
		short:
			'Not a Number — the value IEEE 754 returns for an operation with no answer, such as 0/0 or ∞ − ∞.',
		long: 'It is a value, not an error: the operation returns, and the program keeps going. NaN is contagious — every arithmetic operation touching one produces another — so a single meaningless step at the top of a long calculation is still visible at the bottom rather than being quietly absorbed. It is also the one value not equal to itself, and x != x is the honest test for it, because equality with a thing that is not a number cannot be true. That inequality is a consequence of the definition, not a quirk, and it is why a NaN sorts strangely and why a lookup keyed on floats can lose an entry to one.',
		topic: 'Software',
		appearances: [
			{
				title: 'Floating point numbers',
				slug: '001-float-memory-en',
				section: 'IEEE 754, the extended formats, and the special values',
			},
		],
		vi: {
			pos: 'danh từ · số học máy tính',
			short:
				'Not a Number — giá trị mà IEEE 754 trả về cho một phép tính không có câu trả lời, như 0/0 hay ∞ − ∞.',
			long: 'Nó là một giá trị, không phải một lỗi: phép tính vẫn trả về, và chương trình vẫn chạy tiếp. NaN có tính lây lan — mọi phép tính chạm vào nó đều sinh ra một NaN khác — nên một bước vô nghĩa duy nhất ở đầu một chuỗi tính toán dài vẫn còn nhìn thấy được ở cuối, thay vì bị lặng lẽ nuốt mất. Nó cũng là giá trị duy nhất không bằng chính nó, và x != x là phép thử trung thực để nhận ra nó, bởi vì bằng nhau với một thứ không phải là số thì không thể đúng. Bất đẳng thức ấy là hệ quả của định nghĩa chứ không phải một điều kỳ quặc, và đó là lý do một NaN sắp xếp rất lạ, cũng như lý do một bảng tra khóa theo số float có thể mất một mục vì nó.',
			appearances: [
				{
					title: 'Số dấu chấm động (floating point number)',
					slug: '001-float-memory-vi',
					section: 'IEEE 754, các định dạng mở rộng và giá trị đặc biệt',
				},
			],
		},
	},

	/**
	 * The vocabulary of essay 003 â one word, and the essay is named after it.
	 *
	 * `appearances` is empty on the English side and that is the honest state:
	 * the word is defined here, but no English essay says it yet. The Vietnamese
	 * side carries the appearance, with an empty `section` because the piece runs
	 * without `##` headings â there is no station to name, and inventing one
	 * would describe a shape the prose does not have.
	 */
	overjustification: {
		term: 'overjustification',
		pos: 'noun · psychology',
		short:
			'The fading of an interest someone already had, once an external reward is promised for it — the outside reason takes the place of the inside one.',
		long: 'Named by Lepper, Greene and Nisbett in 1973, who took preschoolers already choosing to draw in free play and split them three ways: promised a certificate before drawing, given one unexpectedly afterwards, or given nothing. Two weeks later only the promised group drew less, and drew worse — and since that group and the surprise group both ended up holding the same certificate, the reward is not what did the damage. The promise is. The name is precise in an uncomfortable way: the problem is not too few reasons but too many. Given an external reason good enough to explain the behaviour, the internal one becomes unnecessary, and what is unnecessary fades.',
		topic: 'Science',
		appearances: [],
		vi: {
			term: 'biện minh quá mức',
			pos: 'danh từ · tâm lý học',
			short:
				'Sự nhạt đi của một hứng thú vốn đã có, sau khi người ta hứa một phần thưởng cho nó — lý do bên ngoài chiếm chỗ của lý do bên trong.',
			long: 'Được Lepper, Greene và Nisbett đặt tên năm 1973, từ một thí nghiệm với các bé mẫu giáo vốn đã tự chọn vẽ trong giờ chơi tự do, chia làm ba nhóm: được hứa giấy khen trước khi vẽ, được tặng bất ngờ sau khi vẽ, và không có gì. Hai tuần sau chỉ nhóm được hứa là vẽ ít hẳn đi, và vẽ kém hơn — mà nhóm được hứa với nhóm được tặng bất ngờ đều cầm về cùng một tấm giấy khen, nên thứ gây hại không phải phần thưởng. Là lời hứa. Cái tên chính xác một cách khó chịu: vấn đề không phải thiếu lý do mà là thừa lý do. Có một lý do bên ngoài đủ tốt để giải thích hành vi rồi thì lý do bên trong thành ra không cần thiết nữa, và cái không cần thiết thì mờ dần.',
			appearances: [
				{
					title: 'Niềm vui thuần túy và biện minh quá mức (overjustification)',
					slug: '003-pure-jou-vi',
					section: '',
				},
			],
		},
	},
};
