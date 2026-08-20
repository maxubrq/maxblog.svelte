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
		appearances: [],
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
		appearances: [],
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
		appearances: [],
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
		appearances: [],
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
		appearances: [],
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
		appearances: [],
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
		appearances: [],
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
		appearances: [],
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
		appearances: [],
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
		appearances: [],
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
};
