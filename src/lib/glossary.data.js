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
					slug: '003-pure-joy-vi',
					section: '',
				},
			],
		},
	},

	velocity: {
		term: 'velocity',
		pos: 'noun · agile',
		short:
			'How many story points a team finishes in one sprint — a rate, and therefore a series rather than a single number.',
		long: 'Velocity is measured after the fact, not planned: it is whatever the team actually closed. Because it is a count over a fixed window it fluctuates for reasons that have nothing to do with capability — someone off sick, a story that turned out easier than it looked, a sprint that swallowed an incident. That fluctuation is the reason a quarter is a *series* and not a figure, and the reason any claim about velocity going up has to clear the noise before it means anything.',
		topic: 'Software',
		appearances: [
			{
				title: 'Can story points measure the growth AI gives you?',
				slug: '004-AI-empowerment-counting-by-SP-en',
				section: 'Velocity and the basic arithmetic',
			},
		],
		vi: {
			term: 'velocity',
			pos: 'danh từ · agile',
			short:
				'Số story point một đội hoàn thành trong một Sprint — một tốc độ, nên nó là một chuỗi số chứ không phải một con số.',
			long: 'Velocity được đo sau khi làm xong chứ không phải được lên kế hoạch: nó là những gì đội thực sự đóng lại được. Vì là phép đếm trên một cửa sổ cố định, nó dao động vì những lý do chẳng liên quan gì tới năng lực — một người nghỉ ốm, một Story hoá ra dễ hơn tưởng, một Sprint bị một sự cố nuốt mất. Chính dao động đó khiến một quý là một *chuỗi* chứ không phải một con số, và khiến mọi tuyên bố \"velocity đã tăng\" phải vượt qua được nhiễu trước khi có nghĩa.',
			appearances: [
				{
					title: 'Sử dụng StoryPoint để tính tăng trưởng do AI tạo nên được hay không?',
					slug: '004-AI-empowerment-counting-by-SP-vi',
					section: 'Velocity và các tính toán cơ bản',
				},
			],
		},
	},

	sprint: {
		term: 'sprint',
		pos: 'noun · agile',
		short:
			'The fixed-length window a team plans and delivers in — the unit that turns work into a countable series.',
		long: 'A sprint is short and, crucially, always the same length, which is what makes the counts from different sprints comparable at all. It is also the sample size of every argument built on velocity: a quarter of six sprints is six data points, and six is a small number to reason from. Any question of the form "did we get faster?" is really a question about how many sprints have been observed.',
		topic: 'Software',
		appearances: [
			{
				title: 'Can story points measure the growth AI gives you?',
				slug: '004-AI-empowerment-counting-by-SP-en',
				section: 'Velocity and the basic arithmetic',
			},
		],
		vi: {
			term: 'Sprint',
			pos: 'danh từ · agile',
			short:
				'Cửa sổ thời gian cố định mà đội lên kế hoạch và bàn giao trong đó — đơn vị biến công việc thành một chuỗi đếm được.',
			long: 'Một Sprint thì ngắn, và quan trọng hơn, luôn dài bằng nhau — chính điều đó mới làm cho các con số của những Sprint khác nhau so được với nhau. Nó cũng là cỡ mẫu của mọi lập luận dựng trên velocity: một quý sáu Sprint là sáu điểm dữ liệu, và sáu là một con số nhỏ để suy luận. Mọi câu hỏi dạng \"đội có nhanh hơn không?\" thật ra là câu hỏi đã quan sát được bao nhiêu Sprint.',
			appearances: [
				{
					title: 'Sử dụng StoryPoint để tính tăng trưởng do AI tạo nên được hay không?',
					slug: '004-AI-empowerment-counting-by-SP-vi',
					section: 'Velocity và các tính toán cơ bản',
				},
			],
		},
	},

	'story-point': {
		term: 'story point',
		pos: 'noun · agile',
		short:
			'A unit of estimated effort, agreed by the team rather than measured — relative size, not hours.',
		long: 'Story points are deliberately not a unit of time: the team compares a piece of work against work it has done before and assigns a number, so the scale is local to that team and means nothing across teams. The trouble starts when the number is lifted out of planning, where it does useful work, and into performance measurement, where it becomes a target the same people who assign it can move. Even setting that aside, a points total is a noisy measurement, which is the subject of the essay below.',
		topic: 'Software',
		appearances: [
			{
				title: 'Can story points measure the growth AI gives you?',
				slug: '004-AI-empowerment-counting-by-SP-en',
				section: '',
			},
		],
		vi: {
			term: 'StoryPoint',
			pos: 'danh từ · agile',
			short:
				'Đơn vị ước lượng công sức, do đội tự thống nhất chứ không đo được — kích cỡ tương đối, không phải số giờ.',
			long: 'Story point cố tình không phải đơn vị thời gian: đội so một việc với những việc đã từng làm rồi gán cho nó một con số, nên thang điểm là của riêng đội đó và không có nghĩa gì khi đem so giữa các đội. Rắc rối bắt đầu khi con số này bị nhấc ra khỏi việc lập kế hoạch — chỗ nó có ích — và đặt vào việc đo năng suất, nơi nó thành một chỉ tiêu mà chính những người gán điểm có thể xê dịch. Kể cả bỏ qua chuyện đó, tổng điểm vẫn là một phép đo đầy nhiễu, và đó là nội dung của bài dưới đây.',
			appearances: [
				{
					title: 'Niềm vui thuần túy và biện minh quá mức (overjustification)',
					slug: '003-pure-joy-vi',
					section: '',
				},
				{
					title: 'Sử dụng StoryPoint để tính tăng trưởng do AI tạo nên được hay không?',
					slug: '004-AI-empowerment-counting-by-SP-vi',
					section: '',
				},
			],
		},
	},

	'sample-variance': {
		term: 'sample variance',
		pos: 'noun · statistics',
		short:
			'The average squared distance from the mean, divided by n−1 rather than n because the mean was estimated from the same data.',
		long: 'Squaring is what makes the deviations stop cancelling out, and it is also why the result is in squared units — points squared, which nothing in the world is measured in. That is the only real reason the standard deviation exists: it is the square root, taken to get back to the unit you started in. The n−1 is not a fudge; using n would understate the spread, because the sample mean sits closer to its own data than the true mean does.',
		topic: 'Science',
		appearances: [
			{
				title: 'Can story points measure the growth AI gives you?',
				slug: '004-AI-empowerment-counting-by-SP-en',
				section: 'Velocity and the basic arithmetic',
			},
		],
		vi: {
			term: 'phương sai mẫu',
			pos: 'danh từ · thống kê',
			short:
				'Trung bình bình phương khoảng cách tới giá trị trung bình, chia cho n−1 thay vì n, vì chính giá trị trung bình cũng được ước lượng từ dữ liệu đó.',
			long: 'Bình phương là thứ khiến các độ lệch không triệt tiêu lẫn nhau, và cũng là lý do kết quả mang đơn vị bình phương — point bình phương, thứ chẳng có gì trên đời được đo bằng. Đó là lý do duy nhất khiến độ lệch chuẩn tồn tại: nó là căn bậc hai, lấy để quay về đúng đơn vị ban đầu. Con số n−1 không phải mẹo vặt: nếu chia cho n thì độ phân tán sẽ bị khai thấp, bởi trung bình mẫu nằm gần chính dữ liệu của nó hơn là trung bình thật.',
			appearances: [
				{
					title: 'Sử dụng StoryPoint để tính tăng trưởng do AI tạo nên được hay không?',
					slug: '004-AI-empowerment-counting-by-SP-vi',
					section: 'Velocity và các tính toán cơ bản',
				},
			],
		},
	},

	'sample-standard-deviation': {
		term: 'sample standard deviation',
		pos: 'noun · statistics',
		short:
			'How far a single observation typically falls from the mean, in the same unit as the observations.',
		long: 'It is the square root of the sample variance, and it answers the question the variance cannot: how far off is a normal reading. For the team in the essay below it is 6.23 points against a mean of 40, which says that a sprint landing six points away from average is not an event — it is Tuesday. Everything downstream depends on it: the standard error, the detection threshold, and the number of sprints an experiment needs.',
		topic: 'Science',
		appearances: [
			{
				title: 'Can story points measure the growth AI gives you?',
				slug: '004-AI-empowerment-counting-by-SP-en',
				section: 'Velocity and the basic arithmetic',
			},
		],
		vi: {
			term: 'độ lệch chuẩn mẫu',
			pos: 'danh từ · thống kê',
			short:
				'Một quan sát đơn lẻ thường lệch khỏi trung bình bao xa, tính bằng đúng đơn vị của các quan sát.',
			long: 'Nó là căn bậc hai của phương sai mẫu, và trả lời được câu mà phương sai không trả lời nổi: lệch bao nhiêu thì vẫn là bình thường. Với đội trong bài dưới đây, con số là 6.23 point trên nền trung bình 40, tức một Sprint lệch sáu point khỏi trung bình không phải là biến cố — đó là chuyện thường ngày. Mọi thứ phía sau đều dựa vào nó: sai số chuẩn, ngưỡng phát hiện, và số Sprint mà một phép thử cần.',
			appearances: [
				{
					title: 'Sử dụng StoryPoint để tính tăng trưởng do AI tạo nên được hay không?',
					slug: '004-AI-empowerment-counting-by-SP-vi',
					section: 'Velocity và các tính toán cơ bản',
				},
			],
		},
	},

	'standard-error': {
		term: 'standard error of the mean',
		pos: 'noun · statistics',
		short:
			'How far the *average* of a sample typically falls from the true average — the standard deviation divided by the square root of the sample size.',
		long: 'The distinction from the standard deviation is the one people skip and then get wrong: the standard deviation describes how scattered the individual readings are, while the standard error describes how unreliable their average is. Averaging steadies things, but only as fast as √n — four times the data for half the wobble, which is why measuring a small effect gets expensive so quickly. It is the number that decides whether a difference between two averages means anything.',
		topic: 'Science',
		appearances: [
			{
				title: 'Can story points measure the growth AI gives you?',
				slug: '004-AI-empowerment-counting-by-SP-en',
				section: 'Comparing two series',
			},
		],
		vi: {
			term: 'sai số chuẩn của trung bình',
			pos: 'danh từ · thống kê',
			short:
				'Giá trị *trung bình* của một mẫu thường lệch khỏi trung bình thật bao xa — độ lệch chuẩn chia cho căn bậc hai của cỡ mẫu.',
			long: 'Chỗ khác biệt với độ lệch chuẩn là chỗ người ta hay bỏ qua rồi hiểu sai: độ lệch chuẩn nói các quan sát riêng lẻ tản mát ra sao, còn sai số chuẩn nói cái trung bình của chúng đáng tin tới đâu. Lấy trung bình thì ổn định hơn thật, nhưng chỉ nhanh bằng √n — gấp bốn lần dữ liệu mới giảm được một nửa độ lung lay, và đó là lý do đo một tác động nhỏ đắt lên rất nhanh. Đây chính là con số quyết định chênh lệch giữa hai trung bình có nghĩa gì hay không.',
			appearances: [
				{
					title: 'Sử dụng StoryPoint để tính tăng trưởng do AI tạo nên được hay không?',
					slug: '004-AI-empowerment-counting-by-SP-vi',
					section: 'So sánh hai chuỗi số',
				},
			],
		},
	},

	'coefficient-of-variation': {
		term: 'coefficient of variation',
		pos: 'noun · statistics',
		short:
			'The standard deviation as a fraction of the mean — spread with the unit divided out, so two things measured differently can be compared.',
		long: 'A standard deviation of 6 means nothing until you know whether the mean is 40 or 4,000. Dividing by the mean turns it into a percentage and makes it portable: the team in the essay below runs at about 15%, and that number can be set beside a team scoring on a completely different scale. It is also the term that carries the whole cost of an experiment — the required sample size grows with its *square*, so halving a team\u2019s variability cuts the wait to a quarter.',
		topic: 'Science',
		appearances: [
			{
				title: 'Can story points measure the growth AI gives you?',
				slug: '004-AI-empowerment-counting-by-SP-en',
				section: 'Velocity and the basic arithmetic',
			},
		],
		vi: {
			term: 'hệ số biến thiên',
			pos: 'danh từ · thống kê',
			short:
				'Độ lệch chuẩn tính theo tỉ lệ phần trăm của trung bình — độ phân tán đã bỏ đơn vị đi, nên hai thứ đo bằng thang khác nhau vẫn so được.',
			long: 'Độ lệch chuẩn bằng 6 chẳng nói lên điều gì cho tới khi biết trung bình là 40 hay 4.000. Chia cho trung bình biến nó thành phần trăm và mang đi đâu cũng dùng được: đội trong bài dưới đây dao động khoảng 15%, và con số đó đặt cạnh được một đội chấm điểm trên thang hoàn toàn khác. Nó cũng là thứ gánh toàn bộ chi phí của một phép thử — cỡ mẫu cần thiết tăng theo *bình phương* của nó, nên giảm dao động của đội đi một nửa thì thời gian chờ còn một phần tư.',
			appearances: [
				{
					title: 'Sử dụng StoryPoint để tính tăng trưởng do AI tạo nên được hay không?',
					slug: '004-AI-empowerment-counting-by-SP-vi',
					section: 'Velocity và các tính toán cơ bản',
				},
			],
		},
	},

	'normal-distribution': {
		term: 'normal distribution',
		pos: 'noun · statistics',
		short:
			'The bell-shaped spread that averages tend towards — symmetric, and fully described by a centre and a width.',
		long: 'Its usefulness here is not that velocity is bell-shaped; it is that *averages* are, near enough, almost regardless of what they average. Two numbers then describe the whole picture, and distances read off in widths: about 68% of the bell lies within one width of the centre, 95% within 1.96 of them. That second number is where a detection threshold comes from, and it is the only reason a rule like "under 7 points, say nothing" can be derived rather than guessed.',
		topic: 'Science',
		appearances: [
			{
				title: 'Can story points measure the growth AI gives you?',
				slug: '004-AI-empowerment-counting-by-SP-en',
				section: 'How big does a difference have to be?',
			},
		],
		vi: {
			term: 'phân phối chuẩn',
			pos: 'danh từ · thống kê',
			short:
				'Hình chuông mà các giá trị trung bình có xu hướng tiến về — đối xứng, và được mô tả trọn vẹn bằng một tâm và một độ rộng.',
			long: 'Chỗ hữu dụng của nó ở đây không phải là velocity có hình chuông, mà là *giá trị trung bình* thì gần như luôn có, bất kể nó lấy trung bình của thứ gì. Khi đó hai con số mô tả trọn bức tranh, và khoảng cách được đọc bằng đơn vị độ rộng: khoảng 68% hình chuông nằm trong một độ rộng quanh tâm, 95% nằm trong 1.96 độ rộng. Con số thứ hai chính là nơi ngưỡng phát hiện sinh ra, và là lý do duy nhất khiến một quy tắc kiểu \"dưới 7 point thì đừng nói gì\" có thể suy ra được thay vì đoán.',
			appearances: [
				{
					title: 'Sử dụng StoryPoint để tính tăng trưởng do AI tạo nên được hay không?',
					slug: '004-AI-empowerment-counting-by-SP-vi',
					section: 'Vậy cần bao nhiêu để có thể phát hiện và kết luận được?',
				},
			],
		},
	},

	'type-i-error': {
		term: 'type I error',
		pos: 'noun · statistics',
		short:
			'A false alarm — calling a difference real when nothing changed and the noise simply landed high.',
		long: 'You cannot drive the risk to zero, only choose it: setting it at 5% is what puts the threshold 1.96 widths out from the centre, and demanding 1% pushes the threshold further still. Every threshold is therefore a decision about how often you are willing to be fooled, made before the data arrives. Guarding against this error alone is not enough — pushing the threshold out to be safe makes the opposite mistake more likely.',
		topic: 'Science',
		appearances: [
			{
				title: 'Can story points measure the growth AI gives you?',
				slug: '004-AI-empowerment-counting-by-SP-en',
				section: 'How big does a difference have to be?',
			},
		],
		vi: {
			term: 'sai loại I',
			pos: 'danh từ · thống kê',
			short:
				'Báo động giả — kết luận là có thay đổi thật trong khi chẳng có gì xảy ra, chỉ là nhiễu vô tình rơi cao.',
			long: 'Không thể đưa rủi ro này về 0, chỉ có thể chọn nó: đặt ở mức 5% chính là thứ đẩy ngưỡng ra xa tâm 1.96 độ rộng, còn đòi 1% thì ngưỡng còn xa hơn nữa. Vậy nên mọi ngưỡng đều là một quyết định về việc bạn chấp nhận bị đánh lừa bao nhiêu lần, đưa ra trước khi có dữ liệu. Chỉ đề phòng loại sai này thôi thì chưa đủ — đẩy ngưỡng ra xa cho chắc lại làm loại sai còn lại dễ xảy ra hơn.',
			appearances: [
				{
					title: 'Sử dụng StoryPoint để tính tăng trưởng do AI tạo nên được hay không?',
					slug: '004-AI-empowerment-counting-by-SP-vi',
					section: 'Vậy cần bao nhiêu để có thể phát hiện và kết luận được?',
				},
			],
		},
	},

	'type-ii-error': {
		term: 'type II error',
		pos: 'noun · statistics',
		short:
			'A miss — an improvement that was real, but landed under the threshold because the noise happened to pull it down.',
		long: 'The two errors trade against each other: a threshold set far out to avoid false alarms is exactly a threshold a real effect struggles to clear. An effect sitting precisely on the threshold is caught half the time, which is the uncomfortable fact that makes "we hit the number" so weak a statement. Deciding to catch a real effect 80% of the time — the usual choice — is what pushes the required difference well past the threshold, and with it the amount of data an honest answer needs.',
		topic: 'Science',
		appearances: [
			{
				title: 'Can story points measure the growth AI gives you?',
				slug: '004-AI-empowerment-counting-by-SP-en',
				section: 'How big does a difference have to be?',
			},
		],
		vi: {
			term: 'sai loại II',
			pos: 'danh từ · thống kê',
			short:
				'Bỏ lỡ — cải thiện là thật, nhưng rơi xuống dưới ngưỡng vì nhiễu tình cờ kéo nó xuống.',
			long: 'Hai loại sai đánh đổi lẫn nhau: một ngưỡng đặt thật xa để tránh báo động giả cũng đúng là ngưỡng mà một tác động thật khó lòng vượt qua. Một tác động nằm đúng ngay trên ngưỡng thì chỉ bắt được một nửa số lần — sự thật khó chịu này là thứ làm cho câu \"chúng ta đạt chỉ tiêu rồi\" trở nên yếu ớt. Chọn bắt được tác động thật 80% số lần — lựa chọn thông thường — chính là thứ đẩy mức chênh lệch cần có vượt xa ngưỡng, và kéo theo nó là lượng dữ liệu mà một câu trả lời trung thực đòi hỏi.',
			appearances: [
				{
					title: 'Sử dụng StoryPoint để tính tăng trưởng do AI tạo nên được hay không?',
					slug: '004-AI-empowerment-counting-by-SP-vi',
					section: 'Vậy cần bao nhiêu để có thể phát hiện và kết luận được?',
				},
			],
		},
	},

	/**
	 * The vocabulary of essay 005 — a dictionary entry per term the essay
	 * defines, which is most of its `##` headings. The essay is itself a
	 * glossary, so the division of labour matters: the essay says what the word
	 * means and where it is misused, and `long` here says what follows from that
	 * in a design. `section` is the heading the term is defined under, in each
	 * edition's own wording.
	 *
	 * `vi.term` is set only where the Vietnamese term is a distinctive phrase.
	 * Where the natural gloss is an ordinary Vietnamese word — `an toàn` for
	 * safety, `kết hợp` for associative — it is left unset, so the auto-marking
	 * pass does not underline that word in unrelated prose; the entry still reads
	 * in Vietnamese, it just answers to the English spelling.
	 */

	linearizability: {
		term: 'linearizability',
		pos: 'noun · distributed systems',
		short:
			'The guarantee that every operation on one object appears to take effect at a single instant between its call and its return, in real-time order.',
		long: 'The strongest consistency property you can actually build, and the most over-bought. Two words in the definition carry the cost: *one object*, and *real time*. Because it is per-object, it says nothing about two objects changed together — that is the transactional question, and reaching for linearizability to answer it buys the wrong guarantee at the higher price. Because it respects real time, an acknowledged write must be visible to every later reader, which forces a consensus round or a bounded clock onto the critical path. Most requests that arrive asking for "strong consistency" are satisfied by read-your-writes, which costs a sticky route.',
		topic: 'Software',
		appearances: [
			{
				title: 'The vocabulary of distributed systems',
				slug: '005-distributed-system-vocabulary-en',
				section: 'Linearizability',
			},
		],
		vi: {
			term: 'tính tuyến tính',
			pos: 'danh từ · hệ phân tán',
			short:
				'Bảo đảm rằng mọi thao tác trên một đối tượng đều trông như xảy ra tại một thời điểm duy nhất nằm giữa lúc gọi và lúc trả về, theo đúng thứ tự thời gian thực.',
			long: 'Là tính chất nhất quán mạnh nhất mà bạn thực sự xây được, và cũng là thứ bị mua quá nhiều nhất. Hai chỗ trong định nghĩa gánh toàn bộ cái giá: *một đối tượng*, và *thời gian thực*. Vì nó theo từng đối tượng, nó không nói gì về hai đối tượng cùng đổi một lượt — đó là câu hỏi giao dịch, và viện tới linearizability để trả lời là mua sai bảo đảm với giá đắt hơn. Vì nó tôn trọng thời gian thực, một lần ghi đã xác nhận buộc phải thấy được với mọi người đọc sau đó, thứ đẩy một vòng đồng thuận hoặc một đồng hồ có biên vào đường đi tới hạn. Phần lớn yêu cầu "nhất quán mạnh" thực ra được thỏa bằng read-your-writes, thứ chỉ tốn một đường đi sticky.',
			appearances: [
				{
					title: 'Từ vựng trường dùng trong hệ thống phân tán',
					slug: '005-distributed-system-vocabulary-vi',
					section: 'Linearizability',
				},
			],
		},
	},

	serializability: {
		term: 'serializability',
		pos: 'noun · distributed systems',
		short:
			'The guarantee that concurrent transactions end with the same result as running them one at a time in some serial order — any serial order.',
		long: 'The database half of the pair, and the word "some" is the whole of it. Serializability fixes the *outcome* to a serial order without fixing *which* one, so it never appeals to a clock: two transactions that ran concurrently may be serialised in either direction and both answers are correct. That is why it composes across many objects where linearizability does not, and why it cannot on its own tell you whether a transaction that committed a second ago is visible now. Adding that real-time requirement back is a separate, stronger property with its own name.',
		topic: 'Software',
		appearances: [
			{
				title: 'The vocabulary of distributed systems',
				slug: '005-distributed-system-vocabulary-en',
				section: 'Serializability',
			},
		],
		vi: {
			term: 'tính tuần tự',
			pos: 'danh từ · hệ phân tán',
			short:
				'Bảo đảm rằng các giao dịch đồng thời kết thúc với cùng kết quả như khi chạy lần lượt theo một thứ tự tuần tự nào đó — thứ tự nào cũng được.',
			long: 'Nửa phía cơ sở dữ liệu của cặp khái niệm, và chữ "nào đó" chính là toàn bộ câu chuyện. Serializability chốt *kết quả* vào một thứ tự tuần tự mà không chốt *thứ tự nào*, nên nó không bao giờ phải viện đến đồng hồ: hai giao dịch chạy đồng thời có thể được tuần tự hóa theo chiều nào cũng được và cả hai đáp án đều đúng. Đó là lý do nó ghép được trên nhiều đối tượng, chỗ mà linearizability không làm được, và cũng là lý do một mình nó không cho bạn biết một giao dịch commit một giây trước giờ có thấy được hay chưa. Cộng lại yêu cầu thời gian thực đó là một tính chất khác, mạnh hơn, và có tên riêng.',
			appearances: [
				{
					title: 'Từ vựng trường dùng trong hệ thống phân tán',
					slug: '005-distributed-system-vocabulary-vi',
					section: 'Serializability',
				},
			],
		},
	},

	'strict-serializability': {
		term: 'strict serializability',
		pos: 'noun · distributed systems',
		short:
			'Serializability plus real time: the serial order the system picks must also agree with the order things actually happened in.',
		long: 'The name exists because the two properties it joins are independent, and a system can hold either one alone. Strict serializability is what a reader usually *means* by "the database is consistent": transactions are atomic across many objects, and a commit you have been told about is visible to everything that starts afterwards. It is also the most expensive point on the map, since it inherits the consensus round from the real-time half and the multi-object machinery from the other. Spanner is the reference implementation, and the uncertainty window it waits out is the price printed on the label.',
		topic: 'Software',
		appearances: [
			{
				title: 'The vocabulary of distributed systems',
				slug: '005-distributed-system-vocabulary-en',
				section: 'Strict Serializability',
			},
		],
		vi: {
			pos: 'danh từ · hệ phân tán',
			short:
				'Serializability cộng thời gian thực: thứ tự tuần tự mà hệ thống chọn còn phải khớp với thứ tự mà mọi việc thực sự đã xảy ra.',
			long: 'Cái tên tồn tại vì hai tính chất nó ghép lại là độc lập với nhau, và một hệ thống có thể chỉ giữ một trong hai. Strict serializability là thứ mà người đọc thường *muốn nói* khi bảo "cơ sở dữ liệu này nhất quán": giao dịch là nguyên tử trên nhiều đối tượng, và một lần commit đã được thông báo thì thấy được với mọi thứ bắt đầu sau đó. Nó cũng là điểm đắt nhất trên bản đồ, vì thừa hưởng vòng đồng thuận từ nửa thời gian thực và bộ máy nhiều đối tượng từ nửa còn lại. Spanner là bản hiện thực tham chiếu, và cửa sổ bất định mà nó phải chờ hết chính là cái giá in trên nhãn.',
			appearances: [
				{
					title: 'Từ vựng trường dùng trong hệ thống phân tán',
					slug: '005-distributed-system-vocabulary-vi',
					section: 'Strict Serializability',
				},
			],
		},
	},

	'sequential-consistency': {
		term: 'sequential consistency',
		pos: 'noun · distributed systems',
		short:
			'One global order that every node agrees on and that matches each process’s own program order — but need not match real time.',
		long: 'The row people skip, and the one that shows the map has two axes rather than one. Sequential consistency keeps the single global order and drops only the real-time tie: everyone sees the same sequence, but a write acknowledged a moment ago may sit later in it than a read that began afterwards. That makes it strictly weaker than linearizability and strictly stronger than causal — and it is the reason "causal is sequential minus real time" is wrong. Causal drops the single global order too, which is a different relaxation entirely. Its home is shared-memory models, not databases.',
		topic: 'Software',
		appearances: [
			{
				title: 'The vocabulary of distributed systems',
				slug: '005-distributed-system-vocabulary-en',
				section: 'Telling the consistency models apart, and ranking them',
			},
		],
		vi: {
			pos: 'danh từ · hệ phân tán',
			short:
				'Một thứ tự toàn cục duy nhất mà mọi nút đều thống nhất và khớp với program order của từng tiến trình — nhưng không cần khớp thời gian thực.',
			long: 'Dòng mà người ta hay bỏ qua, và cũng là dòng cho thấy tấm bản đồ này có hai trục chứ không phải một. Sequential consistency giữ nguyên thứ tự toàn cục duy nhất và chỉ bỏ ràng buộc thời gian thực: mọi người thấy cùng một chuỗi, nhưng một lần ghi vừa được xác nhận có thể nằm sau một lần đọc bắt đầu muộn hơn nó. Điều đó làm nó yếu hơn hẳn linearizability và mạnh hơn hẳn causal — và là lý do câu "causal là sequential trừ thời gian thực" là sai. Causal bỏ luôn cả cái thứ tự toàn cục duy nhất, một sự thả lỏng hoàn toàn khác. Chỗ ở của nó là các mô hình shared-memory, không phải cơ sở dữ liệu.',
			appearances: [
				{
					title: 'Từ vựng trường dùng trong hệ thống phân tán',
					slug: '005-distributed-system-vocabulary-vi',
					section: 'Phân biệt và sắp xếp các dạng nhất quán',
				},
			],
		},
	},

	'causal-consistency': {
		term: 'causal consistency',
		pos: 'noun · distributed systems',
		short:
			'Operations that are causally related are seen in the same order everywhere; unrelated ones may be seen in any order, differently at different replicas.',
		long: 'The model that matches how people actually read a system, which is why it is enough for most social products: a reply never appears before the thing it replies to, and nobody notices or cares which of two unrelated posts landed first. What it gives up is the single global order, and that is a real forfeit rather than a technicality — two replicas can disagree about concurrent writes forever and both be correct. The machinery is a version vector or a vector clock per replica, no leader and no quorum round, which is why it survives a partition while linearizability does not.',
		topic: 'Software',
		appearances: [
			{
				title: 'The vocabulary of distributed systems',
				slug: '005-distributed-system-vocabulary-en',
				section: 'Causal Consistency',
			},
		],
		vi: {
			term: 'nhất quán nhân quả',
			pos: 'danh từ · hệ phân tán',
			short:
				'Các thao tác có quan hệ nhân quả được thấy theo cùng một thứ tự ở mọi nơi; các thao tác không liên quan có thể thấy theo thứ tự nào cũng được, và khác nhau ở các bản sao khác nhau.',
			long: 'Mô hình khớp với cách con người thực sự đọc một hệ thống, nên nó đủ cho phần lớn sản phẩm mạng xã hội: một bình luận không bao giờ xuất hiện trước thứ nó bình luận, và không ai để ý hay quan tâm trong hai bài không liên quan thì bài nào về trước. Cái nó nhường lại là thứ tự toàn cục duy nhất, và đây là một sự nhường thật chứ không phải chuyện câu chữ — hai bản sao có thể mãi mãi không đồng ý với nhau về các lần ghi đồng thời mà cả hai vẫn đúng. Bộ máy của nó là version vector hoặc vector clock theo từng bản sao, không leader và không vòng quorum, nên nó sống sót qua một lần phân mảnh mạng trong khi linearizability thì không.',
			appearances: [
				{
					title: 'Từ vựng trường dùng trong hệ thống phân tán',
					slug: '005-distributed-system-vocabulary-vi',
					section: 'Causal Consistency',
				},
			],
		},
	},

	'eventual-consistency': {
		term: 'eventual consistency',
		pos: 'noun · distributed systems',
		short:
			'The promise that if writing stops, every replica converges on the same state — and no promise about anything else.',
		long: 'Read the definition for what it does not say. It does not order the writes on the way there, and it does not bound how long "eventually" is; both are left to the implementation, and both have to be asked about by name rather than assumed to be milliseconds. The conditional matters too: convergence is promised *if writes stop*, and a system under continuous write load has no moment at which the guarantee is testable. It is the right floor for a shopping cart or a like count, and the wrong one for anything a second reader will make a decision on.',
		topic: 'Software',
		appearances: [
			{
				title: 'The vocabulary of distributed systems',
				slug: '005-distributed-system-vocabulary-en',
				section: 'Eventual Consistency',
			},
		],
		vi: {
			term: 'nhất quán cuối cùng',
			pos: 'danh từ · hệ phân tán',
			short:
				'Lời hứa rằng nếu ngừng ghi thì mọi bản sao sẽ hội tụ về cùng một trạng thái — và không hứa gì thêm nữa.',
			long: 'Hãy đọc định nghĩa để thấy nó *không* nói gì. Nó không xếp thứ tự các lần ghi trên đường đi, và nó không chặn biên cho chữ "cuối cùng" là bao lâu; cả hai đều để cho bản hiện thực quyết, và cả hai đều phải hỏi thẳng tên ra chứ đừng mặc định là vài milli giây. Cái điều kiện cũng quan trọng: hội tụ được hứa *nếu ngừng ghi*, còn một hệ thống đang chịu tải ghi liên tục thì không có thời điểm nào để kiểm chứng được bảo đảm đó. Đây là mức sàn đúng cho giỏ hàng hay số lượt thích, và là mức sai cho bất cứ thứ gì mà một người đọc thứ hai sẽ dựa vào để ra quyết định.',
			appearances: [
				{
					title: 'Từ vựng trường dùng trong hệ thống phân tán',
					slug: '005-distributed-system-vocabulary-vi',
					section: 'Eventual Consistency',
				},
			],
		},
	},

	'monotonic-reads': {
		term: 'monotonic reads',
		pos: 'noun · distributed systems',
		short:
			'A session guarantee: once you have read a version of the data, you never read an older one.',
		long: 'The guarantee that stops time going backwards for one reader. Without it, two reads a second apart can land on different replicas and the second can be staler than the first — the refresh that loses the comment you just saw. It is a promise about one session, not about the system, so two clients may still disagree; that narrowness is what makes it cheap. A sticky route to one replica delivers it almost for free, and a per-client version floor delivers it without pinning the route.',
		topic: 'Software',
		appearances: [
			{
				title: 'The vocabulary of distributed systems',
				slug: '005-distributed-system-vocabulary-en',
				section: 'Monotonic Reads / Monotonic Writes',
			},
		],
		vi: {
			term: 'đọc đơn điệu',
			pos: 'danh từ · hệ phân tán',
			short:
				'Một bảo đảm theo session: khi đã đọc được một phiên bản của dữ liệu, bạn không bao giờ đọc lại một phiên bản cũ hơn.',
			long: 'Bảo đảm ngăn thời gian chạy ngược với một người đọc. Không có nó, hai lần đọc cách nhau một giây có thể rơi vào hai bản sao khác nhau và lần sau cũ hơn lần trước — đúng cái lần refresh làm mất đi bình luận bạn vừa thấy. Đây là lời hứa về một session, không phải về cả hệ thống, nên hai client vẫn có thể không khớp nhau; chính sự hẹp đó làm nó rẻ. Một đường đi sticky về một bản sao cho nó gần như miễn phí, còn một mức sàn phiên bản theo từng client cho nó mà không cần ghim đường đi.',
			appearances: [
				{
					title: 'Từ vựng trường dùng trong hệ thống phân tán',
					slug: '005-distributed-system-vocabulary-vi',
					section: 'Monotonic Reads / Monotonic Writes',
				},
			],
		},
	},

	'monotonic-writes': {
		term: 'monotonic writes',
		pos: 'noun · distributed systems',
		short:
			'A session guarantee: your own writes are applied in the order you issued them, never out of order.',
		long: 'The write-side twin, and the one that makes a sequence of edits from one client behave like a sequence rather than a set. Without it, two writes issued in order can reach a replica in the other order and the earlier one wins, so an edit silently reverts to the value before it. Like every session guarantee it is scoped to one writer: it says nothing about interleaving with another client, and buying the per-writer version of the property is far cheaper than buying a global order to get it.',
		topic: 'Software',
		appearances: [
			{
				title: 'The vocabulary of distributed systems',
				slug: '005-distributed-system-vocabulary-en',
				section: 'Monotonic Reads / Monotonic Writes',
			},
		],
		vi: {
			term: 'ghi đơn điệu',
			pos: 'danh từ · hệ phân tán',
			short:
				'Một bảo đảm theo session: các lần ghi của chính bạn được áp dụng theo đúng thứ tự bạn phát ra, không bao giờ đảo.',
			long: 'Người song sinh ở phía ghi, và là thứ làm cho một chuỗi thao tác sửa từ một client hành xử như một chuỗi chứ không phải một tập. Không có nó, hai lần ghi phát ra theo thứ tự có thể tới một bản sao theo thứ tự ngược lại và lần trước thắng, nên một lần sửa âm thầm lùi về giá trị trước đó. Như mọi bảo đảm theo session, nó chỉ có phạm vi trong một người ghi: nó không nói gì về việc xen kẽ với một client khác, và mua phiên bản theo-từng-người-ghi của tính chất này rẻ hơn rất nhiều so với mua một thứ tự toàn cục để có nó.',
			appearances: [
				{
					title: 'Từ vựng trường dùng trong hệ thống phân tán',
					slug: '005-distributed-system-vocabulary-vi',
					section: 'Monotonic Reads / Monotonic Writes',
				},
			],
		},
	},

	'read-your-writes': {
		term: 'read-your-writes',
		pos: 'noun · distributed systems',
		short:
			'A session guarantee: a client that has written something sees its own change on the next read.',
		long: 'The cheapest guarantee with the highest ratio of complaints solved, and the essay puts the number at nine out of ten. Almost every report that reads as "the system is inconsistent" is really this one property missing: the user saved, the page reloaded off a follower replica, and the change was not there. Note what it does not promise — nobody else is guaranteed to see the write yet, and there is no global order. That is the trade that keeps it to a sticky session or a version token in the client rather than a consensus round.',
		topic: 'Software',
		appearances: [
			{
				title: 'The vocabulary of distributed systems',
				slug: '005-distributed-system-vocabulary-en',
				section: 'Read-your-writes',
			},
		],
		vi: {
			pos: 'danh từ · hệ phân tán',
			short:
				'Một bảo đảm theo session: một client vừa ghi thứ gì thì thấy được thay đổi của chính mình ở lần đọc kế tiếp.',
			long: 'Bảo đảm rẻ nhất với tỉ lệ khiếu nại được giải quyết cao nhất, và bài viết đặt con số ở chín trên mười. Gần như mọi báo lỗi đọc lên thành "hệ thống không nhất quán" thực chất chỉ là thiếu đúng tính chất này: người dùng lưu, trang tải lại từ một bản sao follower, và thay đổi không có ở đó. Để ý điều nó *không* hứa — chưa ai khác được bảo đảm là thấy lần ghi đó, và không có thứ tự toàn cục nào. Đó là sự đánh đổi giữ nó ở mức một session sticky hoặc một token phiên bản nằm trong client, chứ không phải một vòng đồng thuận.',
			appearances: [
				{
					title: 'Từ vựng trường dùng trong hệ thống phân tán',
					slug: '005-distributed-system-vocabulary-vi',
					section: 'Read-your-writes',
				},
			],
		},
	},

	'happens-before': {
		term: 'happens-before',
		pos: 'noun · distributed systems',
		short:
			'The partial order causality gives you: within a process, from a send to its receive, and transitively through both.',
		long: 'Lamport’s answer to having no global clock. Notice that the relation is defined by three rules and nothing else, which means most pairs of events in a real system are simply unordered — not simultaneous, not tied, but *concurrent*, with no fact of the matter about which came first. That is the point rather than a gap in the definition: a system that has not exchanged a message has no way to know, and any order you print for such a pair is invented. Every causal mechanism downstream — vector clocks, version vectors, CRDT delivery — is an encoding of exactly these three rules.',
		topic: 'Software',
		appearances: [
			{
				title: 'The vocabulary of distributed systems',
				slug: '005-distributed-system-vocabulary-en',
				section: 'Happens-before',
			},
		],
		vi: {
			pos: 'danh từ · hệ phân tán',
			short:
				'Thứ tự bộ phận mà tính nhân quả cho: trong cùng một tiến trình, từ một lần gửi tới lần nhận tương ứng, và bắc cầu qua cả hai.',
			long: 'Câu trả lời của Lamport cho việc không có đồng hồ toàn cục. Để ý rằng quan hệ này được định nghĩa bằng ba quy tắc và không gì khác, nghĩa là phần lớn các cặp sự kiện trong một hệ thống thật đơn giản là không xếp được thứ tự — không phải đồng thời, không phải bằng nhau, mà là *đồng thời xảy ra (concurrent)*, và không có sự thật nào về việc cái nào trước. Đó là chủ ý chứ không phải một lỗ hở của định nghĩa: một hệ thống chưa trao đổi tin nhắn nào thì không có cách nào biết được, và mọi thứ tự bạn in ra cho một cặp như thế đều là bịa. Mọi cơ chế nhân quả phía sau — vector clock, version vector, CRDT delivery — đều là một cách mã hóa đúng ba quy tắc này.',
			appearances: [
				{
					title: 'Từ vựng trường dùng trong hệ thống phân tán',
					slug: '005-distributed-system-vocabulary-vi',
					section: 'Happens-before',
				},
			],
		},
	},

	quorum: {
		term: 'quorum',
		pos: 'noun · distributed systems',
		short:
			'The minimum number of nodes that must take part in an operation for it to count — usually sized so reads and writes must overlap.',
		long: 'The whole mechanism is the pigeonhole principle wearing a system-design hat: if R + W > N then the read set and the write set cannot be disjoint, so at least one node in every read has seen the newest write. Two things follow that people miss. First, a quorum is not a majority — majority is one convenient way to pick R and W, not the definition, and R=1, W=N is a perfectly good quorum with very different performance. Second, the overlap guarantees a fresh *copy is present*, not that the reader picks it; that still takes versioning or read repair.',
		topic: 'Software',
		appearances: [
			{
				title: 'The vocabulary of distributed systems',
				slug: '005-distributed-system-vocabulary-en',
				section: 'Quorum',
			},
		],
		vi: {
			pos: 'danh từ · hệ phân tán',
			short:
				'Số lượng nút tối thiểu phải tham gia vào một thao tác để nó được tính — thường được chọn sao cho tập đọc và tập ghi buộc phải giao nhau.',
			long: 'Toàn bộ cơ chế chỉ là nguyên lý Dirichlet khoác áo thiết kế hệ thống: nếu R + W > N thì tập đọc và tập ghi không thể rời nhau, nên ít nhất một nút trong mỗi lần đọc đã thấy lần ghi mới nhất. Có hai điều theo sau mà người ta hay bỏ qua. Thứ nhất, quorum không phải đa số — đa số chỉ là một cách tiện để chọn R và W, không phải định nghĩa, và R=1, W=N là một quorum hoàn toàn hợp lệ với đặc tính hiệu năng rất khác. Thứ hai, phần giao bảo đảm rằng *có mặt* một bản sao mới, chứ không bảo đảm người đọc chọn đúng nó; chuyện đó vẫn cần đánh số phiên bản hoặc read repair.',
			appearances: [
				{
					title: 'Từ vựng trường dùng trong hệ thống phân tán',
					slug: '005-distributed-system-vocabulary-vi',
					section: 'Quorum',
				},
			],
		},
	},

	'split-brain': {
		term: 'split-brain',
		pos: 'noun · distributed systems',
		short:
			'The failure where two or more nodes each believe they are the leader, and each accepts writes.',
		long: 'The canonical way a replicated system corrupts itself rather than merely stopping, which is why it is worth more fear than an outage. The trigger is rarely exotic: a network partition cuts the old leader off, or a garbage collection pause freezes it long enough for an election, and it wakes up still believing it holds the role. Nothing the old leader can check about itself detects this — it has no way to know time passed. The fix is therefore never "elect more carefully"; it is to make the storage layer refuse writes carrying a stale fencing token.',
		topic: 'Software',
		appearances: [
			{
				title: 'The vocabulary of distributed systems',
				slug: '005-distributed-system-vocabulary-en',
				section: 'Split-brain',
			},
		],
		vi: {
			pos: 'danh từ · hệ phân tán',
			short:
				'Dạng lỗi khi hai nút hoặc nhiều hơn đều tin mình là leader, và mỗi nút đều nhận ghi.',
			long: 'Đây là cách kinh điển để một hệ thống có sao bản tự làm hỏng dữ liệu của mình thay vì chỉ đơn giản dừng lại, nên nó đáng sợ hơn một lần sập hẳn. Nguyên nhân kích hoạt thường chẳng lạ lùng gì: một lần phân mảnh mạng cắt leader cũ ra, hoặc một lần GC pause đóng băng nó đủ lâu để diễn ra một cuộc bầu chọn, rồi nó tỉnh lại và vẫn tin mình đang giữ vai. Không có gì leader cũ tự kiểm tra được mà phát hiện ra chuyện này — nó không có cách nào biết thời gian đã trôi qua. Vậy nên cách sửa không bao giờ là "bầu chọn cẩn thận hơn"; mà là làm cho tầng lưu trữ từ chối những lần ghi mang theo fencing token đã cũ.',
			appearances: [
				{
					title: 'Từ vựng trường dùng trong hệ thống phân tán',
					slug: '005-distributed-system-vocabulary-vi',
					section: 'Split-brain',
				},
			],
		},
	},

	lease: {
		term: 'lease',
		pos: 'noun · distributed systems',
		short:
			'A permission to act on something, granted with an expiry — a lock with a TTL rather than a lock held until released.',
		long: 'The TTL is there to solve one problem: a holder that dies while holding a plain lock blocks the resource forever, and no third party can safely take it away. An expiry makes the grant self-healing without anyone having to judge whether the holder is really dead. What it does not solve is the holder’s own view of time. A process paused past its expiry has no way to notice, so it wakes up and acts on a lease that has already been reissued — which is why a lease alone is half a design, and the other half lives at the storage layer.',
		topic: 'Software',
		appearances: [
			{
				title: 'The vocabulary of distributed systems',
				slug: '005-distributed-system-vocabulary-en',
				section: 'Lease',
			},
		],
		vi: {
			pos: 'danh từ · hệ phân tán',
			short:
				'Quyền được thao tác lên một thứ, cấp kèm thời điểm hết hạn — một cái khóa có TTL, chứ không phải khóa giữ tới khi nào nhả.',
			long: 'Cái TTL có ở đó để giải một bài toán: một người giữ khóa thường mà chết trong lúc đang giữ thì chặn tài nguyên đó mãi mãi, và không bên thứ ba nào lấy lại được một cách an toàn. Một thời điểm hết hạn làm cho việc cấp quyền tự lành lại mà không cần ai phải phán xét xem người giữ có thật là đã chết hay chưa. Cái nó *không* giải được là cách nhìn thời gian của chính người giữ. Một tiến trình bị dừng quá hạn không có cách nào nhận ra, nên nó tỉnh lại và hành động trên một lease đã được cấp lại cho người khác — đó là lý do một mình lease chỉ là nửa thiết kế, và nửa còn lại nằm ở tầng lưu trữ.',
			appearances: [
				{
					title: 'Từ vựng trường dùng trong hệ thống phân tán',
					slug: '005-distributed-system-vocabulary-vi',
					section: 'Lease',
				},
			],
		},
	},

	'fencing-token': {
		term: 'fencing token',
		pos: 'noun · distributed systems',
		short:
			'A monotonically increasing number handed out with a lease, which the storage layer uses to reject anyone holding an older one.',
		long: 'The other half of the lease, and the reason the pair works where either alone does not. The insight is that the check has to move: the lock service cannot stop a paused client from writing, but the *resource* can refuse a write whose token is below the highest it has seen. Monotonicity is doing all the work — the storage layer needs no clock, no membership view and no opinion about who should be leader, only the ability to compare two integers. This is why "we have a distributed lock" is not yet an answer to split-brain.',
		topic: 'Software',
		appearances: [
			{
				title: 'The vocabulary of distributed systems',
				slug: '005-distributed-system-vocabulary-en',
				section: 'Fencing token',
			},
		],
		vi: {
			pos: 'danh từ · hệ phân tán',
			short:
				'Một con số tăng đơn điệu được cấp kèm với lease, để tầng lưu trữ dùng mà từ chối bất cứ ai đang giữ con số cũ hơn.',
			long: 'Nửa còn lại của lease, và là lý do cặp này hoạt động trong khi từng cái một thì không. Điểm sáng là chỗ kiểm tra phải dịch đi: dịch vụ khóa không ngăn được một client đang bị dừng ghi dữ liệu, nhưng *chính tài nguyên* thì từ chối được một lần ghi có token nhỏ hơn con số lớn nhất nó từng thấy. Tính đơn điệu gánh toàn bộ công việc — tầng lưu trữ không cần đồng hồ, không cần biết thành viên trong cụm, cũng không cần có ý kiến về việc ai nên làm leader, chỉ cần so sánh được hai số nguyên. Đây là lý do câu "bọn mình có khóa phân tán rồi" vẫn chưa phải một câu trả lời cho split-brain.',
			appearances: [
				{
					title: 'Từ vựng trường dùng trong hệ thống phân tán',
					slug: '005-distributed-system-vocabulary-vi',
					section: 'Fencing token',
				},
			],
		},
	},

	idempotent: {
		term: 'idempotent',
		pos: 'adjective · distributed systems',
		short:
			'An operation whose result after many applications is the same as after one.',
		long: 'The property that makes retrying safe, and therefore the property every at-least-once pipeline is silently built on. The test is the operation’s *effect*, not its shape: SET A 5 qualifies and ADD A 5 does not, and no amount of careful retry logic converts the second into the first. The common mistake is to inherit it from a layer that cannot give it — HTTP calls PUT and DELETE idempotent at the protocol level, which says nothing about whether your handler writes a row per call. It is also not commutativity: idempotence is about repetition, commutativity about order, and a system replaying out-of-order messages needs both.',
		topic: 'Software',
		appearances: [
			{
				title: 'The vocabulary of distributed systems',
				slug: '005-distributed-system-vocabulary-en',
				section: 'Idempotent',
			},
		],
		vi: {
			term: 'lũy đẳng',
			pos: 'tính từ · hệ phân tán',
			short:
				'Một thao tác mà kết quả sau khi thực hiện nhiều lần giống hệt như sau khi thực hiện một lần.',
			long: 'Tính chất làm cho việc thử lại trở nên an toàn, và vì thế là tính chất mà mọi đường ống at-least-once âm thầm dựa lên. Phép thử là *hiệu ứng* của thao tác, không phải hình dạng của nó: SET A 5 đạt còn ADD A 5 thì không, và không có lượng logic retry cẩn thận nào biến cái sau thành cái trước. Sai lầm thường gặp là thừa hưởng nó từ một tầng không cho được nó — HTTP gọi PUT và DELETE là idempotent ở mức giao thức, điều đó chẳng nói gì về việc handler của bạn có ghi thêm một dòng mỗi lần gọi hay không. Nó cũng không phải tính giao hoán: lũy đẳng nói về sự lặp lại, giao hoán nói về thứ tự, và một hệ thống phát lại tin nhắn không theo thứ tự thì cần cả hai.',
			appearances: [
				{
					title: 'Từ vựng trường dùng trong hệ thống phân tán',
					slug: '005-distributed-system-vocabulary-vi',
					section: 'Idempotent',
				},
			],
		},
	},

	commutative: {
		term: 'commutative',
		pos: 'adjective · distributed systems',
		short:
			'An operation where the order of application does not change the final result.',
		long: 'The property that lets replicas apply the same set of updates in whatever order they receive them and still agree. Counters and set-unions have it; a multiply mixed in with an add does not, and a single non-commutative operation in the mix is enough to force ordering back onto the system — which means coordination, which means latency and a leader. This is the first of the three properties behind CRDTs, and the one that most often fails quietly: an operation that looks like an increment but reads the current value before writing is not commutative at all.',
		topic: 'Software',
		appearances: [
			{
				title: 'The vocabulary of distributed systems',
				slug: '005-distributed-system-vocabulary-en',
				section: 'Commutative',
			},
		],
		vi: {
			term: 'giao hoán',
			pos: 'tính từ · hệ phân tán',
			short:
				'Một thao tác mà thứ tự thực hiện không làm thay đổi kết quả cuối cùng.',
			long: 'Tính chất cho phép các bản sao áp dụng cùng một tập cập nhật theo thứ tự nào chúng nhận được cũng được mà vẫn đồng ý với nhau. Bộ đếm và phép hợp tập có tính này; một phép nhân trộn lẫn với một phép cộng thì không, và chỉ một thao tác phi giao hoán trong hỗn hợp đó là đủ để buộc thứ tự quay lại với hệ thống — nghĩa là cần phối hợp, nghĩa là độ trễ và một leader. Đây là tính chất đầu tiên trong ba tính chất nằm sau CRDT, và là tính chất hay hỏng một cách im lặng nhất: một thao tác trông như phép tăng nhưng lại đọc giá trị hiện tại trước khi ghi thì hoàn toàn không giao hoán.',
			appearances: [
				{
					title: 'Từ vựng trường dùng trong hệ thống phân tán',
					slug: '005-distributed-system-vocabulary-vi',
					section: 'Commutative',
				},
			],
		},
	},

	associative: {
		term: 'associative',
		pos: 'adjective · distributed systems',
		short:
			'A merge where the grouping does not matter: merging A with B then C equals merging A with the merge of B and C.',
		long: 'The property that makes batching free. If a merge is associative, a replica can fold updates in whatever bundles the network happened to deliver — one at a time, or a thousand at once after a partition heals — and land on the same state, so the sync protocol is allowed to be an implementation detail rather than part of the correctness argument. Associative, commutative and idempotent together give a bounded semilattice, and that structure is the actual theorem behind "converges without coordination": order-free, grouping-free, duplicate-free, in that order.',
		topic: 'Software',
		appearances: [
			{
				title: 'The vocabulary of distributed systems',
				slug: '005-distributed-system-vocabulary-en',
				section: 'Associative',
			},
		],
		vi: {
			pos: 'tính từ · hệ phân tán',
			short:
				'Một phép gộp mà cách nhóm không quan trọng: gộp A với B rồi với C bằng gộp A với kết quả gộp của B và C.',
			long: 'Tính chất làm cho việc gom lô trở nên miễn phí. Nếu một phép gộp có tính kết hợp, một bản sao có thể gấp các cập nhật lại theo bất cứ bó nào mà mạng tình cờ chuyển tới — từng cái một, hay cả nghìn cái một lượt sau khi phân mảnh mạng lành lại — và vẫn về đúng một trạng thái, nên giao thức đồng bộ được phép chỉ là chi tiết hiện thực chứ không phải một phần của lập luận về tính đúng. Kết hợp, giao hoán và lũy đẳng cộng lại cho một nửa dàn có biên, và cấu trúc đó mới là định lý thật nằm sau câu "hội tụ mà không cần phối hợp": không cần thứ tự, không cần cách nhóm, không sợ trùng lặp, theo đúng thứ tự đó.',
			appearances: [
				{
					title: 'Từ vựng trường dùng trong hệ thống phân tán',
					slug: '005-distributed-system-vocabulary-vi',
					section: 'Associative',
				},
			],
		},
	},

	monotonic: {
		term: 'monotonic',
		pos: 'adjective · distributed systems',
		short:
			'A value or state that only ever moves one way — forward, newer, larger — and never revisits or reuses what it has passed.',
		long: 'A small word carrying a large theorem. CALM states the equivalence in both directions: a program has a coordination-free distributed implementation if and only if its logic is monotonic. The direction that changes decisions is the second one — non-monotonic logic does not merely benefit from coordination, it provably requires it, so an operation that has to observe an absence (a count, a minimum, "nobody else has claimed this") is where the latency comes from and no amount of engineering removes it. The practical move is to redesign toward monotone forms, not to optimise the barrier.',
		topic: 'Software',
		appearances: [
			{
				title: 'The vocabulary of distributed systems',
				slug: '005-distributed-system-vocabulary-en',
				section: 'Monotonic',
			},
		],
		vi: {
			pos: 'tính từ · hệ phân tán',
			short:
				'Một giá trị hay trạng thái chỉ đi theo một chiều — về trước, mới hơn, lớn hơn — và không bao giờ quay lại hay dùng lại thứ nó đã đi qua.',
			long: 'Một từ nhỏ chở theo một định lý lớn. CALM phát biểu sự tương đương theo cả hai chiều: một chương trình có cách hiện thực phân tán không cần phối hợp nếu và chỉ nếu logic của nó là đơn điệu. Chiều làm thay đổi quyết định là chiều thứ hai — logic phi đơn điệu không chỉ *được lợi* từ việc phối hợp, nó *chứng minh được* là đòi hỏi phối hợp, nên một thao tác buộc phải quan sát sự vắng mặt (một phép đếm, một giá trị nhỏ nhất, "chưa ai khác giành chỗ này") chính là chỗ độ trễ sinh ra và không lượng kỹ thuật nào bỏ được nó. Nước đi thực tế là thiết kế lại về dạng đơn điệu, không phải tối ưu cái rào chắn.',
			appearances: [
				{
					title: 'Từ vựng trường dùng trong hệ thống phân tán',
					slug: '005-distributed-system-vocabulary-vi',
					section: 'Monotonic',
				},
			],
		},
	},

	'effectively-once': {
		term: 'effectively-once',
		pos: 'noun · distributed systems',
		short:
			'At-least-once delivery plus idempotence at the receiver: the message may arrive twice, but the state changes once.',
		long: 'The honest name for what working systems actually have, and the reason the essay spends its warning on Kafka rather than on theory. End-to-end exactly-once is not a feature to switch on; a sender that cannot tell a lost message from a lost acknowledgement must choose between losing and duplicating, and every real pipeline chooses duplicating. What makes the duplicate harmless is deduplication in the consumer, which means the guarantee lives in your handler and not in the broker. Side effects that leave the system — an email, a third-party charge — each need their own idempotency key, because the broker’s transaction cannot reach them.',
		topic: 'Software',
		appearances: [
			{
				title: 'The vocabulary of distributed systems',
				slug: '005-distributed-system-vocabulary-en',
				section: 'At-least-once / At-most-once / Exactly-once / Effectively-once',
			},
		],
		vi: {
			pos: 'danh từ · hệ phân tán',
			short:
				'Giao nhận at-least-once cộng tính lũy đẳng ở phía nhận: tin nhắn có thể tới hai lần, nhưng trạng thái chỉ đổi một lần.',
			long: 'Cái tên trung thực cho những gì các hệ thống đang chạy được thực sự có, và là lý do bài viết dành lời cảnh báo cho Kafka chứ không cho lý thuyết. Exactly-once đầu-cuối không phải một tính năng để bật lên; một bên gửi không phân biệt được tin nhắn bị mất với phản hồi bị mất thì buộc phải chọn giữa làm mất và làm trùng, và mọi đường ống thật đều chọn làm trùng. Thứ làm cho bản trùng trở nên vô hại là việc khử trùng ở phía consumer, nghĩa là bảo đảm đó nằm trong handler của bạn chứ không nằm trong broker. Những tác dụng phụ đi ra khỏi hệ thống — một email, một lần trừ tiền qua bên thứ ba — mỗi thứ cần khóa lũy đẳng riêng, vì giao dịch của broker không vươn tới được chúng.',
			appearances: [
				{
					title: 'Từ vựng trường dùng trong hệ thống phân tán',
					slug: '005-distributed-system-vocabulary-vi',
					section: 'At-least-once / At-most-once / Exactly-once / Effectively-once',
				},
			],
		},
	},

	'byzantine-fault': {
		term: 'Byzantine fault',
		pos: 'noun · distributed systems',
		short:
			'A node that does not merely stop but lies — and may tell different lies to different neighbours.',
		long: 'The strongest fault model, and the one whose cost is easy to under-read from the formula. N ≥ 3f + 1 says three nodes cannot survive one traitor, and the reason is worth holding onto: the two honest nodes each receive a different story and have no way, from inside, to tell which of the other two is the liar. Everything expensive about BFT protocols follows from needing to distinguish that. The practical point is the diagnostic one — ordinary production failures are crash-stop or grey, not malicious, and paying Byzantine prices for them buys nothing.',
		topic: 'Software',
		appearances: [
			{
				title: 'The vocabulary of distributed systems',
				slug: '005-distributed-system-vocabulary-en',
				section: 'Byzantine',
			},
		],
		vi: {
			pos: 'danh từ · hệ phân tán',
			short:
				'Một nút không chỉ dừng lại mà nói dối — và có thể nói những lời dối khác nhau với những láng giềng khác nhau.',
			long: 'Mô hình lỗi mạnh nhất, và là mô hình mà cái giá của nó rất dễ bị đọc nhẹ đi từ công thức. N ≥ 3f + 1 nói rằng ba nút không sống sót nổi một kẻ phản bội, và lý do đáng nhớ: hai nút trung thực mỗi nút nhận một câu chuyện khác nhau và từ bên trong không có cách nào biết ai trong hai nút còn lại mới là kẻ dối. Mọi thứ đắt đỏ trong các giao thức BFT đều sinh ra từ việc phải phân biệt cho được chuyện đó. Điểm thực dụng là điểm chẩn đoán — lỗi thường gặp trên production là crash-stop hoặc grey, không phải ác ý, và trả giá Byzantine cho chúng thì không mua được gì.',
			appearances: [
				{
					title: 'Từ vựng trường dùng trong hệ thống phân tán',
					slug: '005-distributed-system-vocabulary-vi',
					section: 'Byzantine',
				},
			],
		},
	},

	safety: {
		term: 'safety',
		pos: 'noun · distributed systems',
		short:
			'The class of property saying nothing bad ever happens — the system never enters an incorrect or invalid state.',
		long: 'Half of the pair a system is analysed with, and formally the half that can be violated by a finite prefix of an execution: one bad step is proof, forever. That is what makes safety testable and what makes a counterexample so useful. Its twin is not its opposite, and the two are not a dial to trade between — a system that never does anything wrong because it never does anything satisfies safety completely and is still broken. Both have to hold; any design that claims a trade-off between them has renamed something else.',
		topic: 'Software',
		appearances: [
			{
				title: 'The vocabulary of distributed systems',
				slug: '005-distributed-system-vocabulary-en',
				section: 'Safety / Liveness',
			},
		],
		vi: {
			pos: 'danh từ · hệ phân tán',
			short:
				'Lớp tính chất nói rằng không có gì xấu xảy ra — hệ thống không bao giờ rơi vào một trạng thái sai hoặc không hợp lệ.',
			long: 'Một nửa của cặp dùng để phân tích một hệ thống, và về mặt hình thức là nửa có thể bị vi phạm bởi một đoạn đầu hữu hạn của một lần thực thi: một bước sai là bằng chứng, vĩnh viễn. Đó là điều làm cho safety kiểm chứng được và làm cho một phản ví dụ trở nên hữu dụng. Người song sinh của nó không phải đối nghịch của nó, và hai cái không phải một cái núm để đánh đổi — một hệ thống không bao giờ làm gì sai vì nó không bao giờ làm gì cả thì thỏa mãn safety hoàn toàn mà vẫn là hỏng. Cả hai đều phải đúng; bất cứ thiết kế nào tuyên bố có đánh đổi giữa chúng thì đã gọi sai tên một thứ khác.',
			appearances: [
				{
					title: 'Từ vựng trường dùng trong hệ thống phân tán',
					slug: '005-distributed-system-vocabulary-vi',
					section: 'Safety / Liveness',
				},
			],
		},
	},

	liveness: {
		term: 'liveness',
		pos: 'noun · distributed systems',
		short:
			'The class of property saying something good eventually happens — the system keeps making progress rather than stalling.',
		long: 'The half that cannot be disproved by any finite run: no matter how long you watch nothing happen, "eventually" has not yet failed, which is why liveness is the hard one to test and the easy one to lose. Almost every guarantee with "eventual" in its name is a liveness claim, and almost none of them come with a bound — that missing bound is the same gap the essay flags under eventual consistency. Pair it with safety to read a design honestly: safety says the system will not be wrong, liveness says it will not be useless.',
		topic: 'Software',
		appearances: [
			{
				title: 'The vocabulary of distributed systems',
				slug: '005-distributed-system-vocabulary-en',
				section: 'Safety / Liveness',
			},
		],
		vi: {
			pos: 'danh từ · hệ phân tán',
			short:
				'Lớp tính chất nói rằng cuối cùng sẽ có điều gì tốt xảy ra — hệ thống tiếp tục tiến triển chứ không đứng lại.',
			long: 'Nửa không thể bị phản chứng bởi bất cứ lần chạy hữu hạn nào: bạn ngồi xem bao lâu mà không có gì xảy ra thì chữ "cuối cùng" vẫn chưa sai, nên liveness là nửa khó kiểm chứng và dễ mất. Gần như mọi bảo đảm có chữ "cuối cùng" trong tên đều là một tuyên bố về liveness, và gần như không cái nào kèm theo một cái biên — đúng cái khoảng trống mà bài viết chỉ ra ở phần eventual consistency. Ghép nó với safety để đọc một thiết kế một cách trung thực: safety nói hệ thống sẽ không sai, liveness nói hệ thống sẽ không vô dụng.',
			appearances: [
				{
					title: 'Từ vựng trường dùng trong hệ thống phân tán',
					slug: '005-distributed-system-vocabulary-vi',
					section: 'Safety / Liveness',
				},
			],
		},
	},

	'grey-failure': {
		term: 'grey failure',
		pos: 'noun · distributed systems',
		short:
			'A node that has degraded or is returning errors, but still passes its own health checks.',
		long: 'The failure mode that outlasts the outage it should have been, because every automatic remedy is waiting for a signal that never arrives. The mechanism is a gap in observation: the system judges its own health with a different measurement than the one its clients experience, and grey failure is exactly the region where those two disagree. The design consequence is specific — a health check that answers for the node rather than for the request is not a detector, and adding more such checks does not make one. Measure the thing the caller actually waits on.',
		topic: 'Software',
		appearances: [
			{
				title: 'The vocabulary of distributed systems',
				slug: '005-distributed-system-vocabulary-en',
				section: 'Grey failure',
			},
		],
		vi: {
			pos: 'danh từ · hệ phân tán',
			short:
				'Một nút đã suy giảm hoặc đang trả về lỗi, nhưng vẫn vượt qua chính những bài kiểm tra sức khỏe của nó.',
			long: 'Dạng lỗi sống lâu hơn cả lần sập mà đúng ra nó nên trở thành, vì mọi cơ chế xử lý tự động đều đang chờ một tín hiệu không bao giờ tới. Cơ chế của nó là một khoảng lệch trong quan sát: hệ thống tự phán sức khỏe của mình bằng một phép đo khác với phép đo mà client trải nghiệm, và grey failure đúng là vùng mà hai phép đo đó không khớp. Hệ quả thiết kế rất cụ thể — một health-check trả lời thay cho nút chứ không trả lời thay cho yêu cầu thì không phải một bộ phát hiện, và thêm nhiều cái như thế nữa cũng không thành. Hãy đo đúng thứ mà người gọi thực sự đang phải chờ.',
			appearances: [
				{
					title: 'Từ vựng trường dùng trong hệ thống phân tán',
					slug: '005-distributed-system-vocabulary-vi',
					section: 'Grey failure',
				},
			],
		},
	},

	'static-stability': {
		term: 'static stability',
		pos: 'noun · distributed systems',
		short:
			'The property that the serving path keeps working through an incident without needing the control plane to act.',
		long: 'Stated as a property it sounds mild; stated as a rule it is demanding — the data plane must keep serving on what it already knows, so nothing in the recovery path may depend on something that has to succeed *during* the incident. That rules out scaling up when the failure starts, fetching fresh config, and calling the API that is itself degraded. The price is paid in advance and looks like waste on a normal day: capacity provisioned and not used, state cached before it is needed. That is the shape of the bargain, and it is why the control plane and the data plane have to be independent.',
		topic: 'Software',
		appearances: [
			{
				title: 'The vocabulary of distributed systems',
				slug: '005-distributed-system-vocabulary-en',
				section: 'Static Stability',
			},
		],
		vi: {
			pos: 'danh từ · hệ phân tán',
			short:
				'Tính chất mà đường phục vụ vẫn chạy được suốt một sự cố mà không cần control plane phải làm gì.',
			long: 'Phát biểu như một tính chất thì nghe nhẹ; phát biểu như một nguyên tắc thì rất khắt khe — data plane phải tiếp tục phục vụ bằng những gì nó đã biết, nên không thứ gì trên đường phục hồi được phép phụ thuộc vào một việc phải thành công *ngay trong lúc* sự cố. Điều đó loại bỏ chuyện mở rộng dung lượng khi lỗi vừa xảy ra, chuyện đi lấy cấu hình mới, và chuyện gọi đúng cái API đang suy giảm. Cái giá được trả trước và trông như lãng phí trong một ngày bình thường: dung lượng cấp sẵn mà không dùng, trạng thái cache lại trước khi cần. Đó là hình dạng của thỏa thuận này, và là lý do control plane với data plane buộc phải độc lập với nhau.',
			appearances: [
				{
					title: 'Từ vựng trường dùng trong hệ thống phân tán',
					slug: '005-distributed-system-vocabulary-vi',
					section: 'Static Stability',
				},
			],
		},
	},
};
