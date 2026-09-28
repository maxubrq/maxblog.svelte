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
				slug: '003-pure-joy-vi',
				title: 'Niềm vui thuần túy và biện minh quá mức (overjustification)',
				locale: 'vi',
			},
		],
	},
	{
		id: 'welch-1947',
		title: "The generalization of 'Student's' problem when several different population variances are involved",
		author: 'Welch, B. L.',
		year: '1947',
		type: 'paper',
		topic: 'Science',
		note: "The correction the sidenote leans on. Student's t-test assumes the two groups share a spread; Welch drops that assumption and pays for it with fractional degrees of freedom, computed from the two variances rather than counted from the two sample sizes. It is the honest default whenever two samples are small and there is no reason to believe their scatter is identical — two quarters of a team's sprints, for instance.",
		url: 'https://doi.org/10.1093/biomet/34.1-2.28',
		vi: {
			note: 'Phép hiệu chỉnh mà phần ghi chú bên lề dựa vào. Kiểm định t của Student giả định hai nhóm có cùng độ phân tán; Welch bỏ giả định đó đi và trả giá bằng bậc tự do lẻ, tính ra từ hai phương sai chứ không đếm từ hai cỡ mẫu. Đây là lựa chọn trung thực mỗi khi hai mẫu đều nhỏ và không có lý do gì để tin rằng chúng tản mát như nhau — chẳng hạn hai quý Sprint của một đội.',
		},
		appearsIn: [
			{
				slug: '004-AI-empowerment-counting-by-SP-vi',
				title: 'Sử dụng StoryPoint để tính tăng trưởng do AI tạo nên được hay không?',
				locale: 'vi',
			},
			{
				slug: '004-AI-empowerment-counting-by-SP-en',
				title: 'Can story points measure the growth AI gives you?',
				locale: 'en',
			},
		],
	},
	{
		id: 'herlihy-wing-linearizability-1990',
		title: 'Linearizability: A Correctness Condition for Concurrent Objects',
		author: 'Herlihy, Maurice P.; Wing, Jeannette M.',
		year: '1990',
		type: 'paper',
		topic: 'Software',
		note: 'The paper that defined the word, and the reason the definition is about a single object. Correctness here is a property of one object\'s history: every operation looks as though it took effect at an instant between its call and its return, and those instants respect real time. Read it once and the confusion with serializability stops being possible — that one is about many objects and no clock.',
		url: 'https://doi.org/10.1145/78969.78972',
		vi: {
			note: 'Bài báo định nghĩa ra chính từ này, và là lý do định nghĩa của nó chỉ nói về một đối tượng. Tính đúng ở đây là một đặc tính của lịch sử thao tác trên một đối tượng: mọi thao tác trông như thể đã xảy ra tại một thời điểm nằm giữa lúc gọi và lúc trả về, và các thời điểm đó tôn trọng thời gian thực. Đọc một lần là chuyện nhầm nó với serializability không còn xảy ra được nữa — cái kia nói về nhiều đối tượng và không có đồng hồ nào.',
		},
		appearsIn: [
			{
				slug: '005-distributed-system-vocabulary-en',
				title: 'The vocabulary of distributed systems',
				locale: 'en',
			},
			{
				slug: '005-distributed-system-vocabulary-vi',
				title: 'Từ vựng trường dùng trong hệ thống phân tán',
				locale: 'vi',
			},
		],
	},
	{
		id: 'papadimitriou-serializability-1979',
		title: 'The serializability of concurrent database updates',
		author: 'Papadimitriou, Christos H.',
		year: '1979',
		type: 'paper',
		topic: 'Software',
		note: 'The other half of the pair, from the database side and eleven years earlier. Serializability asks only that the outcome match *some* serial order of the transactions — which order is not specified and does not have to be the real-time one. That "some" is the whole difference, and it is why strict serializability needs a separate name.',
		url: 'https://doi.org/10.1145/322154.322158',
		vi: {
			note: 'Nửa còn lại của cặp khái niệm, viết từ phía cơ sở dữ liệu và sớm hơn mười một năm. Serializability chỉ yêu cầu kết quả khớp với *một* thứ tự tuần tự nào đó của các giao dịch — thứ tự nào thì không chỉ định, và không nhất thiết phải là thứ tự thời gian thực. Chữ "một nào đó" ấy chính là toàn bộ khác biệt, và là lý do strict serializability phải có một cái tên riêng.',
		},
		appearsIn: [
			{
				slug: '005-distributed-system-vocabulary-en',
				title: 'The vocabulary of distributed systems',
				locale: 'en',
			},
			{
				slug: '005-distributed-system-vocabulary-vi',
				title: 'Từ vựng trường dùng trong hệ thống phân tán',
				locale: 'vi',
			},
		],
	},
	{
		id: 'lamport-time-clocks-1978',
		title: 'Time, Clocks, and the Ordering of Events in a Distributed System',
		author: 'Lamport, Leslie',
		year: '1978',
		type: 'paper',
		topic: 'Software',
		note: 'Where happens-before comes from. The argument is that a distributed system has no global clock to appeal to, so the only ordering you can actually establish is the partial one causality gives you: within a process, across a send and its receive, and transitively. Everything in the causal-consistency row of the table is downstream of this eight-page paper.',
		url: 'https://doi.org/10.1145/359545.359563',
		vi: {
			note: 'Nơi happens-before sinh ra. Lập luận của bài là: một hệ thống phân tán không có đồng hồ toàn cục nào để viện đến, nên thứ tự duy nhất bạn thực sự xác lập được là thứ tự bộ phận mà tính nhân quả cho: trong cùng một tiến trình, qua một lần gửi và lần nhận tương ứng, và bắc cầu. Mọi thứ ở dòng causal consistency trong bảng đều là hậu duệ của tám trang giấy này.',
		},
		appearsIn: [
			{
				slug: '005-distributed-system-vocabulary-en',
				title: 'The vocabulary of distributed systems',
				locale: 'en',
			},
			{
				slug: '005-distributed-system-vocabulary-vi',
				title: 'Từ vựng trường dùng trong hệ thống phân tán',
				locale: 'vi',
			},
		],
	},
	{
		id: 'terry-session-guarantees-1994',
		title: 'Session guarantees for weakly consistent replicated data',
		author: 'Terry, Douglas B.; Demers, Alan J.; Petersen, Karin; Spreitzer, Mike J.; Theimer, Marvin M.; Welch, Brent B.',
		year: '1994',
		type: 'paper',
		topic: 'Software',
		note: 'The four session guarantees, named and separated: read-your-writes, monotonic reads, monotonic writes, writes-follow-reads. This is the paper behind rank 5.5 and behind the claim that most requests for "strong consistency" are really requests for one of these. They are granted per session, which is why they cost a version vector and a sticky route rather than a consensus round.',
		url: 'https://doi.org/10.1109/PDIS.1994.331722',
		vi: {
			note: 'Bốn bảo đảm theo session, được đặt tên và tách bạch: read-your-writes, monotonic reads, monotonic writes, writes-follow-reads. Đây là bài báo nằm sau bậc 5.5, và sau nhận định rằng phần lớn các yêu cầu "nhất quán mạnh" thực chất chỉ là yêu cầu một trong số này. Chúng được cấp theo từng session, nên giá phải trả là một version vector với một đường đi sticky, chứ không phải một vòng đồng thuận.',
		},
		appearsIn: [
			{
				slug: '005-distributed-system-vocabulary-en',
				title: 'The vocabulary of distributed systems',
				locale: 'en',
			},
			{
				slug: '005-distributed-system-vocabulary-vi',
				title: 'Từ vựng trường dùng trong hệ thống phân tán',
				locale: 'vi',
			},
		],
	},
	{
		id: 'shapiro-crdt-2011',
		title: 'Conflict-free Replicated Data Types',
		author: 'Shapiro, Marc; Preguiça, Nuno; Baquero, Carlos; Zawirski, Marek',
		year: '2011',
		type: 'paper',
		topic: 'Software',
		note: 'Where associativity, commutativity and idempotence stop being three separate algebra words and become one engineering result. Make the merge a join on a semilattice and replicas converge without coordination — no leader, no quorum, no rollback. The essay says the semilattice guarantees convergence but not when; this is the paper that proves the first half and is honest about the second.',
		url: 'https://hal.inria.fr/inria-00555588',
		vi: {
			note: 'Nơi tính kết hợp, giao hoán và lũy đẳng thôi là ba từ đại số riêng lẻ và trở thành một kết quả kỹ thuật duy nhất. Biến phép gộp thành phép hợp trên một nửa dàn thì các bản sao hội tụ mà không cần phối hợp — không leader, không quorum, không rollback. Bài viết nói nửa dàn bảo đảm hội tụ nhưng không bảo đảm khi nào; đây là bài báo chứng minh nửa đầu và thẳng thắn về nửa sau.',
		},
		appearsIn: [
			{
				slug: '005-distributed-system-vocabulary-en',
				title: 'The vocabulary of distributed systems',
				locale: 'en',
			},
			{
				slug: '005-distributed-system-vocabulary-vi',
				title: 'Từ vựng trường dùng trong hệ thống phân tán',
				locale: 'vi',
			},
		],
	},
	{
		id: 'hellerstein-alvaro-calm-2020',
		title: 'Keeping CALM: When Distributed Consistency is Easy',
		author: 'Hellerstein, Joseph M.; Alvaro, Peter',
		year: '2020',
		type: 'paper',
		topic: 'Software',
		note: 'The CALM theorem, stated as an if-and-only-if: a program has a coordination-free distributed implementation exactly when its logic is monotonic. What makes it worth reading rather than quoting is the direction people skip — non-monotonicity is not a hint that coordination might help, it is a proof that you cannot avoid it.',
		url: 'https://arxiv.org/abs/1901.01930',
		vi: {
			note: 'Định lý CALM, phát biểu dưới dạng nếu-và-chỉ-nếu: một chương trình có cách hiện thực phân tán không cần phối hợp đúng khi logic của nó là đơn điệu. Cái làm nó đáng đọc chứ không chỉ đáng trích là chiều mà người ta hay bỏ qua — phi đơn điệu không phải một gợi ý rằng phối hợp có thể có ích, nó là một chứng minh rằng bạn không tránh được phối hợp.',
		},
		appearsIn: [
			{
				slug: '005-distributed-system-vocabulary-en',
				title: 'The vocabulary of distributed systems',
				locale: 'en',
			},
			{
				slug: '005-distributed-system-vocabulary-vi',
				title: 'Từ vựng trường dùng trong hệ thống phân tán',
				locale: 'vi',
			},
		],
	},
	{
		id: 'lamport-byzantine-generals-1982',
		title: 'The Byzantine Generals Problem',
		author: 'Lamport, Leslie; Shostak, Robert; Pease, Marshall',
		year: '1982',
		type: 'paper',
		topic: 'Software',
		note: 'Where the 3f + 1 bound comes from, and why it has that shape. The fault being modelled is not a node that stops but a node that lies, differently, to different neighbours — which is why three nodes cannot survive one traitor: the two honest ones cannot tell which of the other two is lying. Reach for this only when the failure really is malicious; ordinary crashes are a cheaper problem.',
		url: 'https://doi.org/10.1145/357172.357176',
		vi: {
			note: 'Nơi biên 3f + 1 sinh ra, và lý do nó có hình dạng như vậy. Lỗi được mô hình hóa ở đây không phải một nút dừng hẳn mà là một nút nói dối, nói khác nhau với từng láng giềng khác nhau — đó là lý do ba nút không sống sót nổi một kẻ phản bội: hai nút trung thực không phân biệt được ai trong hai nút còn lại đang dối. Chỉ nên viện đến bài này khi lỗi thực sự là ác ý; crash thông thường là một bài toán rẻ hơn nhiều.',
		},
		appearsIn: [
			{
				slug: '005-distributed-system-vocabulary-en',
				title: 'The vocabulary of distributed systems',
				locale: 'en',
			},
			{
				slug: '005-distributed-system-vocabulary-vi',
				title: 'Từ vựng trường dùng trong hệ thống phân tán',
				locale: 'vi',
			},
		],
	},
	{
		id: 'corbett-spanner-2013',
		title: 'Spanner: Google’s Globally Distributed Database',
		author: 'Corbett, James C.; Dean, Jeffrey; Epstein, Michael; et al.',
		year: '2013',
		type: 'paper',
		topic: 'Software',
		note: 'The TrueTime entry in the table, in its own words. Spanner does not defeat the clock problem, it bounds and then publishes it: TrueTime returns an interval rather than an instant, and a commit waits out the uncertainty window. That is the honest price of real-time ordering at global scale, and it is paid in latency.',
		url: 'https://doi.org/10.1145/2491245',
		vi: {
			note: 'Ô TrueTime trong bảng, kể bằng chính lời của nó. Spanner không đánh bại bài toán đồng hồ, nó chặn biên rồi công bố cái biên đó: TrueTime trả về một khoảng chứ không phải một thời điểm, và một lần commit phải chờ hết cửa sổ bất định. Đó là cái giá trung thực của việc bảo đảm thứ tự thời gian thực ở quy mô toàn cầu, và nó được trả bằng độ trễ.',
		},
		appearsIn: [
			{
				slug: '005-distributed-system-vocabulary-en',
				title: 'The vocabulary of distributed systems',
				locale: 'en',
			},
			{
				slug: '005-distributed-system-vocabulary-vi',
				title: 'Từ vựng trường dùng trong hệ thống phân tán',
				locale: 'vi',
			},
		],
	},
	{
		id: 'kleppmann-distributed-locking-2016',
		title: 'How to do distributed locking',
		author: 'Martin Kleppmann',
		year: '2016',
		type: 'article',
		topic: 'Software',
		note: 'The clearest statement of why a lease is only half the story. The diagram to remember: a client pauses for GC, its lease expires, it wakes up believing it still holds the lock, and writes. No lock service can prevent this from its own side — only a monotonically increasing fencing token checked at the storage layer can.',
		url: 'https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html',
		vi: {
			note: 'Phát biểu sáng rõ nhất về việc vì sao một lease chỉ là nửa câu chuyện. Hình vẽ cần nhớ: một client dừng vì GC, lease của nó hết hạn, nó tỉnh lại và vẫn tin mình đang giữ khóa, rồi ghi. Không dịch vụ khóa nào ngăn được chuyện này từ phía nó — chỉ một fencing token tăng đơn điệu, được kiểm ở tầng lưu trữ, làm được.',
		},
		appearsIn: [
			{
				slug: '005-distributed-system-vocabulary-en',
				title: 'The vocabulary of distributed systems',
				locale: 'en',
			},
			{
				slug: '005-distributed-system-vocabulary-vi',
				title: 'Từ vựng trường dùng trong hệ thống phân tán',
				locale: 'vi',
			},
		],
	},
	{
		id: 'huang-gray-failure-2017',
		title: 'Gray Failure: The Achilles’ Heel of Cloud-Scale Systems',
		author: 'Huang, Peng; Guo, Chuanxiong; Zhou, Lidong; Lorch, Jacob R.; Dang, Yingnong; Chintalapati, Murali; Yao, Randolph',
		year: '2017',
		type: 'paper',
		topic: 'Software',
		note: 'Names the gap this failure mode lives in: the system observes its own health differently from the way its clients experience it, and gray failure is exactly the region where those two disagree. The useful consequence is that a health check answering for the node rather than for the request is not a detector, and adding more of them does not become one.',
		url: 'https://doi.org/10.1145/3102980.3103005',
		vi: {
			note: 'Đặt tên cho đúng cái khe mà dạng lỗi này sống trong đó: hệ thống tự quan sát sức khỏe của mình theo một cách khác với cách client trải nghiệm nó, và grey failure đúng là vùng mà hai cách đó không khớp nhau. Hệ quả hữu dụng là: một health-check trả lời thay cho nút chứ không trả lời thay cho yêu cầu thì không phải một bộ phát hiện, và thêm bao nhiêu cái nữa cũng không thành.',
		},
		appearsIn: [
			{
				slug: '005-distributed-system-vocabulary-en',
				title: 'The vocabulary of distributed systems',
				locale: 'en',
			},
			{
				slug: '005-distributed-system-vocabulary-vi',
				title: 'Từ vựng trường dùng trong hệ thống phân tán',
				locale: 'vi',
			},
		],
	},
	{
		id: 'aws-static-stability',
		title: 'Static stability using Availability Zones',
		author: 'Amazon Builders’ Library',
		type: 'documentation',
		topic: 'Software',
		note: 'Static stability written up by the people who had to operate it. The rule it argues for is that the data plane must keep serving on whatever it already knows when the control plane is unavailable — which means pre-provisioning capacity you are not using, and refusing to make recovery depend on anything that has to succeed during the incident.',
		url: 'https://aws.amazon.com/builders-library/static-stability-using-availability-zones/',
		vi: {
			note: 'Static stability được viết lại bởi chính những người phải vận hành nó. Nguyên tắc nó bảo vệ là: data plane phải tiếp tục phục vụ bằng những gì nó đã biết khi control plane không dùng được — nghĩa là cấp sẵn phần dung lượng bạn đang không dùng, và từ chối để việc phục hồi phụ thuộc vào bất cứ thứ gì phải thành công ngay trong lúc sự cố.',
		},
		appearsIn: [
			{
				slug: '005-distributed-system-vocabulary-en',
				title: 'The vocabulary of distributed systems',
				locale: 'en',
			},
			{
				slug: '005-distributed-system-vocabulary-vi',
				title: 'Từ vựng trường dùng trong hệ thống phân tán',
				locale: 'vi',
			},
		],
	},
	{
		id: 'kleppmann-ddia',
		title: 'Designing Data-Intensive Applications',
		author: 'Martin Kleppmann',
		year: '2017',
		type: 'book',
		topic: 'Software',
		note: 'The one book to read beside this vocabulary. Chapters 5 and 9 are the long version of the consistency table, and they do the thing a glossary cannot: carry each guarantee through to what it costs in replication, in latency and in what a client is allowed to assume. Where this piece names the confusions, the book works out their consequences.',
		url: 'https://dataintensive.net',
		vi: {
			note: 'Cuốn sách duy nhất nên đọc kèm cùng bảng từ vựng này. Chương 5 và chương 9 chính là bản dài của bảng nhất quán, và chúng làm được điều một cuốn từ điển không làm được: đi theo từng bảo đảm tới cùng, tới cái giá của nó trong sao bản, trong độ trễ, và trong những gì một client được phép giả định. Chỗ bài này đặt tên cho các nhầm lẫn, cuốn sách tính ra hệ quả của chúng.',
		},
		appearsIn: [
			{
				slug: '005-distributed-system-vocabulary-en',
				title: 'The vocabulary of distributed systems',
				locale: 'en',
			},
			{
				slug: '005-distributed-system-vocabulary-vi',
				title: 'Từ vựng trường dùng trong hệ thống phân tán',
				locale: 'vi',
			},
		],
	},
	{
		id: 'tepper-abusive-supervision-2000',
		title: 'Consequences of Abusive Supervision',
		author: 'Tepper, Bennett J.',
		year: '2000',
		type: 'paper',
		topic: 'Science',
		note: 'The paper that gave abusive supervision its measure. Employees under managers who belittled and ridiculed them reported more emotional exhaustion, more conflict between work and home, and lower commitment — and the damage showed up in how they judged themselves, not only in how they felt about the job.',
		url: 'https://doi.org/10.2307/1556375',
		vi: {
			note: 'Bài báo đặt thước đo cho abusive supervision. Những nhân viên làm dưới quyền các quản lý hay hạ thấp, chế giễu họ báo cáo kiệt sức cảm xúc nhiều hơn, xung đột giữa công việc và gia đình nhiều hơn, gắn bó thấp hơn — và thiệt hại hiện ra trong cách họ đánh giá chính mình, không chỉ trong cảm giác về công việc.',
		},
		appearsIn: [
			{
				slug: '007-su-tu-tin-duoc-luu-o-dau-en',
				title: 'Where Confidence Is Stored',
				locale: 'en',
			},
			{
				slug: '007-su-tu-tin-duoc-luu-o-dau-vi',
				title: 'Sự tự tin được lưu ở đâu',
				locale: 'vi',
			},
		],
	},
	{
		id: 'bandura-self-efficacy-1977',
		title: 'Self-efficacy: Toward a unifying theory of behavioral change',
		author: 'Bandura, Albert',
		year: '1977',
		type: 'paper',
		topic: 'Science',
		note: 'Where self-efficacy comes from, not just what it is. Bandura names four sources — doing it yourself, watching someone like you do it, being told you can, and the state of your body while you try — and ranks the first as the strongest. The ranking is the useful part: it says which kind of evidence a person can actually build on.',
		url: 'https://doi.org/10.1037/0033-295X.84.2.191',
		vi: {
			note: 'Self-efficacy đến từ đâu, chứ không chỉ nó là gì. Bandura chỉ ra bốn nguồn — tự mình làm được, thấy người giống mình làm được, được người khác bảo là làm được, và trạng thái cơ thể khi bắt tay vào — và xếp nguồn đầu tiên là mạnh nhất. Chính thứ tự đó là phần hữu ích: nó cho biết loại bằng chứng nào một người thật sự có thể dựa vào.',
		},
		appearsIn: [
			{
				slug: '007-su-tu-tin-duoc-luu-o-dau-en',
				title: 'Where Confidence Is Stored',
				locale: 'en',
			},
			{
				slug: '007-su-tu-tin-duoc-luu-o-dau-vi',
				title: 'Sự tự tin được lưu ở đâu',
				locale: 'vi',
			},
		],
	},
	{
		id: 'bartlett-remembering-1932',
		title: 'Remembering: A Study in Experimental and Social Psychology',
		author: 'Bartlett, Frederic C.',
		year: '1932',
		type: 'book',
		topic: 'Science',
		note: 'The book that argued memory is reconstruction, not retrieval. Bartlett had people retell an unfamiliar folk tale over and over and watched it drift toward what already made sense to them. Every act of remembering is a rebuild from fragments, and the present supplies the glue.',
		vi: {
			note: 'Cuốn sách lập luận rằng trí nhớ là tái dựng chứ không phải truy xuất. Bartlett cho người ta kể lại một câu chuyện dân gian xa lạ nhiều lần và thấy nó trôi dần về phía những gì vốn đã hợp lý với họ. Mỗi lần nhớ là một lần dựng lại từ các mảnh vụn, và hiện tại là thứ lấp vào chỗ trống.',
		},
		appearsIn: [
			{
				slug: '007-su-tu-tin-duoc-luu-o-dau-en',
				title: 'Where Confidence Is Stored',
				locale: 'en',
			},
			{
				slug: '007-su-tu-tin-duoc-luu-o-dau-vi',
				title: 'Sự tự tin được lưu ở đâu',
				locale: 'vi',
			},
		],
	},
	{
		id: 'loftus-palmer-1974',
		title: 'Reconstruction of automobile destruction: An example of the interaction between language and memory',
		author: 'Loftus, Elizabeth F.; Palmer, John C.',
		year: '1974',
		type: 'paper',
		topic: 'Science',
		note: 'The car-crash experiment. People who watched the same film estimated higher speeds when asked how fast the cars "smashed" rather than "hit" each other — and a week later more of them remembered broken glass that was never there. One verb in the question was enough to change the memory.',
		url: 'https://doi.org/10.1016/S0022-5371(74)80011-3',
		vi: {
			note: 'Thí nghiệm va chạm xe. Những người xem cùng một đoạn phim ước lượng tốc độ cao hơn khi được hỏi hai xe "đâm sầm" vào nhau thay vì "va" vào nhau — và một tuần sau, nhiều người trong số đó nhớ ra có kính vỡ, dù trong phim không hề có. Chỉ một động từ trong câu hỏi là đủ để đổi ký ức.',
		},
		appearsIn: [
			{
				slug: '007-su-tu-tin-duoc-luu-o-dau-en',
				title: 'Where Confidence Is Stored',
				locale: 'en',
			},
			{
				slug: '007-su-tu-tin-duoc-luu-o-dau-vi',
				title: 'Sự tự tin được lưu ở đâu',
				locale: 'vi',
			},
		],
	},
	{
		id: 'kahneman-thinking-fast-and-slow',
		title: 'Thinking, Fast and Slow',
		author: 'Kahneman, Daniel',
		year: '2011',
		type: 'book',
		topic: 'Science',
		note: 'Part V is the one this essay leans on: the experiencing self that lives through a period and the remembering self that keeps score of it afterwards, and the peak-end rule by which the second judges the first. The remembering self is the one that fills in a job application.',
		vi: {
			note: 'Phần V là phần bài viết dựa vào: experiencing self sống qua một giai đoạn, còn remembering self chấm điểm nó về sau, bằng quy tắc peak-end. Và remembering self mới là người ngồi điền form ứng tuyển.',
		},
		appearsIn: [
			{
				slug: '007-su-tu-tin-duoc-luu-o-dau-en',
				title: 'Where Confidence Is Stored',
				locale: 'en',
			},
			{
				slug: '007-su-tu-tin-duoc-luu-o-dau-vi',
				title: 'Sự tự tin được lưu ở đâu',
				locale: 'vi',
			},
		],
	},
	{
		id: 'reilly-being-glue',
		title: 'Being Glue',
		author: 'Reilly, Tanya',
		year: '2019',
		type: 'talk',
		topic: 'Software',
		note: 'The talk that named glue work: the reviewing, unblocking, documenting and noticing that makes a team ship, and that a promotion packet cannot see. Its warning is aimed at the people doing it — the work is real, and it will not be counted unless someone makes it legible.',
		url: 'https://noidea.dog/glue',
		vi: {
			note: 'Bài nói đặt tên cho glue work: review, gỡ block, viết tài liệu, nhận ra vấn đề sớm — những việc giúp cả team ship được nhưng hồ sơ thăng tiến thì không nhìn thấy. Lời cảnh báo của nó dành cho chính người làm: việc đó là thật, nhưng sẽ không được tính nếu không ai làm cho nó đọc được.',
		},
		appearsIn: [
			{
				slug: '007-su-tu-tin-duoc-luu-o-dau-en',
				title: 'Where Confidence Is Stored',
				locale: 'en',
			},
			{
				slug: '007-su-tu-tin-duoc-luu-o-dau-vi',
				title: 'Sự tự tin được lưu ở đâu',
				locale: 'vi',
			},
		],
	},
	{
		id: 'scott-seeing-like-a-state',
		title: 'Seeing Like a State: How Certain Schemes to Improve the Human Condition Have Failed',
		author: 'Scott, James C.',
		year: '1998',
		type: 'book',
		topic: 'Philosophy',
		note: 'Where legibility comes from. A state can only manage what it can read — surnames, cadastral maps, standard measures — so it reshapes the world into readable forms and treats whatever resists as absent. Scott writes about forests and villages; the same eye reads a résumé.',
		vi: {
			note: 'Nguồn gốc của khái niệm legibility. Nhà nước chỉ quản lý được những gì nó đọc được — họ tên, bản đồ địa chính, đơn vị đo chuẩn — nên nó nắn thế giới thành những dạng đọc được và coi những gì cưỡng lại là không tồn tại. Scott viết về rừng và làng mạc; con mắt ấy cũng là con mắt đọc một bản CV.',
		},
		appearsIn: [
			{
				slug: '007-su-tu-tin-duoc-luu-o-dau-en',
				title: 'Where Confidence Is Stored',
				locale: 'en',
			},
			{
				slug: '007-su-tu-tin-duoc-luu-o-dau-vi',
				title: 'Sự tự tin được lưu ở đâu',
				locale: 'vi',
			},
		],
	},
	{
		id: 'carney-power-posing-2010',
		title: 'Power posing: Brief nonverbal displays affect neuroendocrine levels and risk tolerance',
		author: 'Carney, Dana R.; Cuddy, Amy J. C.; Yap, Andy J.',
		year: '2010',
		type: 'paper',
		topic: 'Science',
		note: 'The original power-posing claim: two minutes in an expansive posture raised testosterone, lowered cortisol and increased risk-taking. It is cited here as the cautionary case — the hormonal and behavioural effects did not survive replication, and the first author later said publicly that she no longer believes them.',
		url: 'https://doi.org/10.1177/0956797610383437',
		vi: {
			note: 'Tuyên bố gốc về power posing: hai phút trong một tư thế mở rộng làm tăng testosterone, giảm cortisol và tăng mức chấp nhận rủi ro. Nó được dẫn ở đây như một ví dụ cảnh báo — các hiệu ứng về hormone và hành vi không đứng vững khi được lặp lại, và chính tác giả đầu sau đó đã công khai nói bà không còn tin vào chúng.',
		},
		appearsIn: [
			{
				slug: '007-su-tu-tin-duoc-luu-o-dau-en',
				title: 'Where Confidence Is Stored',
				locale: 'en',
			},
			{
				slug: '007-su-tu-tin-duoc-luu-o-dau-vi',
				title: 'Sự tự tin được lưu ở đâu',
				locale: 'vi',
			},
		],
	},
	{
		id: 'ranehill-power-posing-2015',
		title: 'Assessing the robustness of power posing: No effect on hormones and risk tolerance in a large sample of men and women',
		author: 'Ranehill, Eva; Dreber, Anna; Johannesson, Magnus; Leiberg, Susanne; Sul, Sunhae; Weber, Roberto A.',
		year: '2015',
		type: 'paper',
		topic: 'Science',
		note: 'The replication. About two hundred participants instead of forty-two, and no effect on testosterone, cortisol or risk-taking — only people reporting that they felt more powerful. Confidence produced by posture changes how it feels, not what happens.',
		url: 'https://doi.org/10.1177/0956797614553946',
		vi: {
			note: 'Nghiên cứu lặp lại. Khoảng hai trăm người thay vì bốn mươi hai, và không có tác động nào lên testosterone, cortisol hay mức chấp nhận rủi ro — chỉ có việc người tham gia tự báo cáo là thấy mình mạnh mẽ hơn. Sự tự tin sinh ra từ tư thế thay đổi cảm giác, không thay đổi điều thực sự xảy ra.',
		},
		appearsIn: [
			{
				slug: '007-su-tu-tin-duoc-luu-o-dau-en',
				title: 'Where Confidence Is Stored',
				locale: 'en',
			},
			{
				slug: '007-su-tu-tin-duoc-luu-o-dau-vi',
				title: 'Sự tự tin được lưu ở đâu',
				locale: 'vi',
			},
		],
	},
	{
		id: 'bem-self-perception-1972',
		title: 'Self-perception theory',
		author: 'Bem, Daryl J.',
		year: '1972',
		type: 'paper',
		topic: 'Science',
		note: 'The claim that we learn our own attitudes the way we learn other people\'s: by watching what we do. When the inner signal is weak, behaviour is the evidence. It is why a test that could have failed and did not is worth more than any amount of telling yourself you are ready.',
		url: 'https://doi.org/10.1016/S0065-2601(08)60024-6',
		vi: {
			note: 'Luận điểm rằng ta biết thái độ của chính mình theo cách ta biết thái độ của người khác: bằng cách nhìn xem mình làm gì. Khi tín hiệu bên trong yếu, hành vi chính là bằng chứng. Đó là lý do một phép thử có thể thất bại mà không thất bại đáng giá hơn mọi lời tự nhủ rằng mình đã sẵn sàng.',
		},
		appearsIn: [
			{
				slug: '007-su-tu-tin-duoc-luu-o-dau-en',
				title: 'Where Confidence Is Stored',
				locale: 'en',
			},
			{
				slug: '007-su-tu-tin-duoc-luu-o-dau-vi',
				title: 'Sự tự tin được lưu ở đâu',
				locale: 'vi',
			},
		],
	},
	{
		id: 'evans-brag-document-2019',
		title: 'Get your work recognized: write a brag document',
		author: 'Evans, Julia',
		year: '2019',
		type: 'article',
		topic: 'Software',
		note: 'The short, practical version of keeping your own record: one document, updated as you go, listing what you did and why it mattered — including the invisible work. Written for performance reviews, and at least as useful the day you leave.',
		url: 'https://jvns.ca/blog/brag-documents/',
		vi: {
			note: 'Phiên bản ngắn và thực dụng của việc tự giữ hồ sơ cho mình: một tài liệu, cập nhật dần, ghi những gì mình đã làm và vì sao nó quan trọng — kể cả những việc vô hình. Được viết cho kỳ đánh giá hiệu suất, nhưng ít nhất cũng hữu ích như vậy vào ngày bạn rời đi.',
		},
		appearsIn: [
			{
				slug: '007-su-tu-tin-duoc-luu-o-dau-en',
				title: 'Where Confidence Is Stored',
				locale: 'en',
			},
			{
				slug: '007-su-tu-tin-duoc-luu-o-dau-vi',
				title: 'Sự tự tin được lưu ở đâu',
				locale: 'vi',
			},
		],
	},
	{
		id: 'edmondson-psychological-safety-1999',
		title: 'Psychological Safety and Learning Behavior in Work Teams',
		author: 'Edmondson, Amy C.',
		year: '1999',
		type: 'paper',
		topic: 'Science',
		note: 'The study that made psychological safety measurable: teams whose members believed they would not be punished for speaking up asked more questions, admitted more mistakes and learned faster. Safety is what lets people take on the hard work that mastery comes from.',
		url: 'https://doi.org/10.2307/2666999',
		vi: {
			note: 'Nghiên cứu biến psychological safety thành thứ đo được: những team mà thành viên tin rằng mình không bị trừng phạt khi lên tiếng thì hỏi nhiều hơn, nhận lỗi nhiều hơn và học nhanh hơn. An toàn là thứ cho phép người ta nhận những việc khó — nơi mastery được tạo ra.',
		},
		appearsIn: [
			{
				slug: '007-su-tu-tin-duoc-luu-o-dau-en',
				title: 'Where Confidence Is Stored',
				locale: 'en',
			},
			{
				slug: '007-su-tu-tin-duoc-luu-o-dau-vi',
				title: 'Sự tự tin được lưu ở đâu',
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
