// InkToctou.jsx — a long-form "free" piece: TOCTOU / khoảng cách giữa biết và làm.
// Article type: free (full-bleed, scroll-driven, off the reading column) with
// four integrated instruments from InkToctouParts.jsx. TED-Ed structure:
// mystery → investigation (4 layers) → reveal → reframe.

const { useState: useT2, useRef: useR2, useEffect: useE2 } = React;

function TStep({ children, idx, active, onActive }) {
  const ref = useR2(null);
  useE2(() => {
    function check() {
      const el = ref.current; if (!el) return;
      const sc = el.closest('[data-toc-scroller]'); if (!sc) return;
      const sr = sc.getBoundingClientRect(), r = el.getBoundingClientRect();
      const c = sr.top + sr.height * 0.5;
      if (r.top < c && r.bottom > c) onActive(idx);
    }
    const sc = ref.current?.closest('[data-toc-scroller]');
    sc && sc.addEventListener('scroll', check); check();
    return () => sc && sc.removeEventListener('scroll', check);
  }, [idx, onActive]);
  return (
    <div ref={ref} style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', opacity: active ? 1 : 0.3, transition: 'opacity .3s ease' }}>
      <div style={{ background: INK.paper, border: `1.5px solid ${INK.ruleHard}`, padding: '20px 22px', maxWidth: 420 }}>{children}</div>
    </div>
  );
}

function InkToctou() {
  const scRef = useR2(null);
  const [step, setStep] = useT2(0);

  return (
    <InkChrome current="writing" foot="maxubrq.space / free · tech">
      <div data-toc-scroller ref={scRef} className="ink-scroll"
        style={{ height: 860, overflowY: 'auto', position: 'relative', scrollBehavior: 'smooth' }}>

        {/* ── COVER ── */}
        <section style={{ minHeight: 860, background: INK.blue, color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 7%', position: 'relative' }}>
          <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.8, marginBottom: 22 }}>maxubrq · một bài đọc dạng free · tech · 18 phút</div>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(46px,8.4vw,112px)', lineHeight: 0.9, letterSpacing: '-0.05em', margin: 0, textTransform: 'lowercase' }}>
            khoảng cách<br />giữa biết<br />và làm.
          </h1>
          <p style={{ fontFamily: BODY, fontSize: 20, lineHeight: 1.6, maxWidth: '50ch', marginTop: 30, opacity: 0.93 }}>
            Ngày 19 tháng 10 năm 2025, một nửa internet ngừng hoạt động trong mười lăm tiếng. Mọi bước kiểm tra
            trong hệ thống gây ra nó đều trả về đúng.
          </p>
          <div style={{ display: 'flex', gap: 40, marginTop: 44, borderTop: '1.5px solid rgba(255,255,255,.4)', paddingTop: 18, maxWidth: 620 }}>
            {[['113', 'dịch vụ AWS gián đoạn'], ['15h', 'để khôi phục hoàn toàn'], ['18′', 'khe hở giữa kiểm tra và hành động']].map(([a, b], i) => (
              <div key={i}>
                <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 40, letterSpacing: '-0.04em', lineHeight: 1 }}>{a}</div>
                <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', opacity: 0.8, marginTop: 6, maxWidth: '18ch' }}>{b}</div>
              </div>
            ))}
          </div>
          <div style={{ position: 'absolute', bottom: 28, left: '7%', fontFamily: MONO, fontSize: 11, letterSpacing: '0.15em', opacity: 0.75 }}>▽ cuộn để đọc · bài có bốn dụng cụ tương tác</div>
        </section>

        {/* ── 01 · MYSTERY ── */}
        <section style={{ padding: '92px 7% 40px' }}>
          <Kicker n="01">vết nứt</Kicker>
          <div style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 56, alignItems: 'start' }}>
            <div>
              <SectionTitle w="17ch">mọi thứ đều đúng, và nó vẫn sập.</SectionTitle>
              <P>Lúc 11 giờ 48 phút tối giờ PDT ngày 19 tháng 10, khách hàng của AWS bắt đầu thấy tỷ lệ lỗi API
                của DynamoDB tăng vọt ở khu vực US-EAST-1. Không có ai tấn công. Không có đĩa cứng nào cháy,
                không có cáp biển nào đứt, không có ai gõ nhầm một lệnh xoá. Phần mềm chạy đúng như những gì
                nó được viết ra để chạy.</P>
              <P>Điều làm mình dừng lại khi đọc báo cáo hậu sự cố không phải quy mô, mà là hình dạng của lỗi.
                Hệ thống có một cơ chế kiểm soát phiên bản, gắn số phiên bản vào mỗi bản cập nhật, đúng với
                mục đích ngăn dữ liệu cũ ghi đè lên dữ liệu mới. Cơ chế đó không hỏng. Nó đã kiểm tra, và nó
                đã kiểm tra đúng. Chỉ có điều nó kiểm tra lúc 11 giờ 30, còn nó hành động lúc 11 giờ 48.</P>
              <P>Mười tám phút. Trong mười tám phút đó, câu trả lời mà nó nhận được ở bước kiểm tra đã hết hạn,
                nhưng không có gì trong hệ thống báo cho nó biết điều đó. Một sự thật cũ vẫn được cầm trên tay
                như thể nó còn mới.</P>
              <P>Câu hỏi mà mình không trả lời được ngay, và cũng là lý do bài này tồn tại: nếu mọi bước kiểm
                tra đều trả về đúng, thì cái gì đã sai. Không phải logic, vì logic chạy đúng. Không phải dữ
                liệu, vì dữ liệu lúc được đọc là chính xác. Cái sai nằm ở chỗ mà hầu hết chúng ta không nghĩ
                là một chỗ: khoảng trống giữa hai dòng lệnh.</P>
            </div>
            <div style={{ display: 'grid', gap: 26, paddingTop: 8 }}>
              <Sidenote n="01">Báo cáo chính thức của Amazon về sự cố US-EAST-1 ngày 19 tháng 10 năm 2025,
                aws.amazon.com/message/101925. Các mốc thời gian trong bài lấy từ bản báo cáo này.</Sidenote>
              <Sidenote n="02">Lớp lỗi này có tên riêng và có số hiệu: CWE-367, Time-of-check Time-of-use.
                Nó đã nằm trong danh mục lỗi phần mềm từ trước khi phần lớn hạ tầng đám mây hiện nay được viết ra.</Sidenote>
              <div style={{ border: `1.5px solid ${INK.ruleHard}`, padding: '16px 18px', background: INK.paper2 }}>
                <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: INK.blue, marginBottom: 8 }}>thuật ngữ</div>
                <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em', marginBottom: 8 }}>TOCTOU</div>
                <div style={{ fontFamily: BODY, fontSize: 13.5, lineHeight: 1.6, color: INK.ink }}>Time-of-check to time-of-use.
                  Chương trình kiểm tra một điều kiện, rồi sau đó dùng tài nguyên ấy, với giả định rằng không
                  có gì thay đổi ở giữa. Đó không phải lỗi logic. Đó là lỗi trong một giả định về thời gian.</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── instrument 1 ── */}
        <section style={{ padding: '30px 7% 90px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 48, alignItems: 'end' }}>
            <GapRuler />
            <div>
              <P size={17} w="34ch">Khe hở này không phải một khuyết điểm của cách viết code. Nó là hệ quả của
                việc hai thao tác riêng biệt thì phải xảy ra vào hai thời điểm riêng biệt. Bạn có thể làm nó
                nhỏ đi. Bạn không thể làm nó biến mất bằng cách viết cẩn thận hơn.</P>
              <P size={17} w="34ch" style={{ marginBottom: 0 }}>Kéo thanh trượt về tận cùng bên trái để thấy
                cách duy nhất đóng được nó, và giữ hình ảnh đó lại. Toàn bộ phần còn lại của bài là các biến
                thể của cùng một động tác ấy.</P>
            </div>
          </div>
        </section>

        {/* ── 02 · LAYER 1 ── */}
        <section style={{ padding: '80px 7%', borderTop: `1.5px solid ${INK.ruleHard}`, background: INK.paper2 }}>
          <Kicker n="02">tầng thứ nhất</Kicker>
          <SectionTitle w="22ch">một cái tên không phải là một thứ.</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>
            <div>
              <P>Dạng cổ điển nhất của lỗi này sống trong hệ điều hành, và nó cũ hơn phần lớn chúng ta trong
                nghề. Một chương trình chạy với quyền cao cần đọc một file do người dùng chỉ định. Nó làm điều
                hợp lý: kiểm tra trước, xem file đó có phải symlink không, người dùng có quyền đọc không. Nếu
                mọi thứ ổn, nó mở file ra và đọc.</P>
              <P>Vấn đề nằm ở chỗ pathname không phải là một tham chiếu ổn định đến một object cụ thể. Nó là
                một câu hỏi mà hệ thống file trả lời lại mỗi lần bạn hỏi, và câu trả lời có thể khác nhau giữa
                hai lần hỏi cách nhau vài micro giây. Bước kiểm tra hỏi một lần và nhận được câu trả lời đúng.
                Bước mở file hỏi lại lần nữa, và lần này ai đó đã kịp đổi câu trả lời.</P>
              <P>Kẻ tấn công có quyền truy cập cục bộ chỉ cần thay file gốc bằng một symlink trỏ tới
                /etc/shadow, đúng vào giữa hai lời gọi. Bước kiểm tra đã pass, trên một object mà đến lúc mở
                thì không còn là object đó nữa. Chương trình đặc quyền tự tay đọc file mật khẩu và đưa ra
                ngoài, mà không vi phạm bất kỳ dòng logic nào nó được viết.</P>
              <P style={{ marginBottom: 0 }}>Điều đáng chú ý là phản xạ đầu tiên của gần như tất cả mọi người
                khi thấy lỗi này: thêm một bước kiểm tra nữa. Kiểm tra ngay trước khi mở. Kiểm tra lại sau khi
                mở. Mỗi lần thêm, khe hở nhỏ lại một chút, và mỗi lần thêm, nó vẫn còn đó. Bạn đang đuổi theo
                một khoảng cách bằng cách chia đôi nó.</P>
            </div>
            <div style={{ display: 'grid', gap: 22 }}>
              <CodePlate title="python · lỗi kinh điển" mark="bad" lines={[
                '# CHECK',
                'if not os.path.islink(path) \\',
                '   and os.access(path, os.R_OK):',
                '!    # kẻ tấn công tráo file thành symlink',
                '!    # trỏ vào /etc/shadow ngay tại dòng này',
                '',
                '    # USE',
                '    with open(path) as f:',
                '        return f.read()',
              ]} />
              <Sidenote n="03">Hướng dẫn khắc phục theo CWE-367 mô tả cùng một khuôn mẫu này ở nhiều ngôn ngữ:
                dipsylala.github.io/FlawFixingGuidance/CWE-367.</Sidenote>
              <PullQuote mark="tầng thứ nhất">Bước kiểm tra không sai. Nó chỉ trả lời một câu hỏi về quá khứ, và
                được đọc như một câu trả lời về hiện tại.</PullQuote>
            </div>
          </div>
        </section>

        {/* ── 03 · LAYER 2 + instrument 2 ── */}
        <section style={{ padding: '80px 7%' }}>
          <Kicker n="03">tầng thứ hai</Kicker>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: 56, alignItems: 'start' }}>
            <div>
              <SectionTitle w="16ch">không cần kẻ tấn công nào cả.</SectionTitle>
              <P size={17.5} w="40ch">Nếu bạn vừa đọc phần trên và nghĩ đây là chuyện bảo mật, thì đây là chỗ
                mọi thứ mở rộng ra. Không cần ai cố ý phá hoại. Chỉ cần hai người cùng làm một việc hợp lệ,
                cùng lúc.</P>
              <P size={17.5} w="40ch">Bên phải là một tài khoản có một triệu đồng, và hai lệnh rút tám trăm
                nghìn. Bạn là người quyết định thứ tự. Nếu bạn cho một bên chạy hết ba bước rồi mới đến bên
                kia, không có gì xảy ra: bên thứ hai đọc số dư mới và bị từ chối, đúng như thiết kế.</P>
              <P size={17.5} w="40ch">Hãy thử xen kẽ. Cho cả hai đọc số dư trước, rồi mới cho từng bên kiểm
                tra và trừ tiền. Cả hai đều thấy một triệu. Cả hai đều kết luận là đủ. Cả hai đều đi qua bước
                kiểm tra một cách hoàn toàn hợp lệ, và tài khoản kết thúc ở âm sáu trăm nghìn.</P>
              <P size={17.5} w="40ch" style={{ marginBottom: 0 }}>Không có bước nào trong sáu bước đó là sai.
                Cái sai là thứ tự, và thứ tự thì không phải một thứ được viết trong code.</P>
            </div>
            <Interleave />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 40, marginTop: 70, borderTop: `1.5px solid ${INK.ruleHard}`, paddingTop: 30 }}>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: INK.blue, marginBottom: 10 }}>cùng một hình dạng · đặt chỗ</div>
              <P size={16} w="100%" style={{ marginBottom: 0 }}>Hai người cùng thấy còn một ghế trống, cùng bấm
                đặt, cả hai cùng nhận được xác nhận. Overbooking của hàng không, của rạp phim, của nhà hàng
                đều là cùng một lỗi này, chỉ khác là ngành hàng không đã học cách sống chung với nó và gọi đó
                là chính sách.</P>
            </div>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: INK.blue, marginBottom: 10 }}>cùng một hình dạng · ngân sách</div>
              <P size={16} w="100%" style={{ marginBottom: 0 }}>Một phòng ban kiểm tra ngân sách chung, thấy
                còn, và bắt đầu quy trình duyệt chi kéo dài ba tuần. Giữa lúc duyệt và lúc chi, một phòng khác
                đã tiêu hết phần chung ấy. Không ai gian dối. Con số lúc kiểm tra là con số thật.</P>
            </div>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: INK.blue, marginBottom: 10 }}>cùng một hình dạng · lời hứa</div>
              <P size={16} w="100%" style={{ marginBottom: 0 }}>Lúc hứa thì đúng là có ý đó thật. Hoàn cảnh đổi
                trước khi đến lúc thực hiện. Phần lớn lời hứa bị phá vỡ không phải vì người hứa nói dối ở thời
                điểm kiểm tra, mà vì có một độ trễ giữa cam kết và hành động, và không ai xác thực lại ở phút
                cuối.</P>
            </div>
          </div>
        </section>

        {/* ── 04 · THE AWS STICKY STAGE ── */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: `1.5px solid ${INK.ruleHard}`, borderBottom: `1.5px solid ${INK.ruleHard}` }}>
          <div style={{ position: 'sticky', top: 0, height: 860, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 4% 0 7%', borderRight: `1.5px solid ${INK.ruleHard}` }}>
            <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: INK.muted, marginBottom: 16 }}>04 · dựng lại sự cố · bước {step + 1} / 4</div>
            <AwsStage step={step} />
          </div>
          <div style={{ padding: '0 7% 0 4%' }}>
            <TStep idx={0} active={step === 0} onActive={setStep}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 25, letterSpacing: '-0.02em', lineHeight: 1.12, color: INK.blue, marginBottom: 10 }}>hai bộ phận, cố tình tách rời nhau</div>
              <P size={16} w="100%" style={{ marginBottom: 0 }}>Một bên là DNS Planner, theo dõi sức khoẻ và
                năng lực của các load balancer, rồi định kỳ tạo ra kế hoạch DNS mới cho từng endpoint. Bên kia
                là DNS Enactor, chạy độc lập và dư thừa trên ba vùng khả dụng, có nhiệm vụ áp dụng kế hoạch
                đó. Tách rời là chủ ý, để một vùng chết thì hai vùng còn lại vẫn làm việc.</P>
            </TStep>
            <TStep idx={1} active={step === 1} onActive={setStep}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 25, letterSpacing: '-0.02em', lineHeight: 1.12, color: INK.blue, marginBottom: 10 }}>một enactor chậm bất thường</div>
              <P size={16} w="100%" style={{ marginBottom: 0 }}>Enactor ở vùng thứ nhất nhận kế hoạch v87, kiểm
                tra rằng đó là bản mới nhất, và bắt đầu áp dụng. Lần này nó chậm hơn thường lệ rất nhiều.
                Trong lúc nó còn đang chạy, Planner đã phát tiếp v88 và v89. Enactor ở vùng thứ hai áp xong
                v89, rồi làm nốt việc dọn dẹp các kế hoạch cũ.</P>
            </TStep>
            <TStep idx={2} active={step === 2} onActive={setStep}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 25, letterSpacing: '-0.02em', lineHeight: 1.12, color: INK.blue, marginBottom: 10 }}>cũ ghi đè lên mới</div>
              <P size={16} w="100%" style={{ marginBottom: 0 }}>Enactor chậm hoàn thành công việc của nó và ghi
                v87 lên bản ghi đang sống, đè mất v89. Cơ chế phiên bản đã làm đúng việc: nó kiểm tra rằng v87
                là mới nhất. Chỉ có điều nó kiểm tra điều đó mười tám phút trước, và không kiểm tra lại lần
                nào nữa trước khi ghi.</P>
            </TStep>
            <TStep idx={3} active={step === 3} onActive={setStep}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 25, letterSpacing: '-0.02em', lineHeight: 1.12, color: INK.blue, marginBottom: 10 }}>rồi bản dọn dẹp xoá nốt phần còn lại</div>
              <P size={16} w="100%" style={{ marginBottom: 0 }}>Bản ghi đang sống bây giờ trỏ tới một kế hoạch
                đã bị đánh dấu là cũ. Tiến trình dọn dẹp làm đúng nhiệm vụ và xoá nó đi. Kết quả là endpoint
                của DynamoDB ở US-EAST-1 không còn bản ghi nào để phân giải. Không hệ thống tự động nào có thể
                tự sửa trạng thái này, vì mọi thành phần đều đang làm đúng phần việc của mình. Cần người vào
                bằng tay. 113 dịch vụ chịu ảnh hưởng, mười lăm tiếng để khôi phục.</P>
            </TStep>
          </div>
        </section>

        {/* ── FULL-BLEED PULL ── */}
        <section style={{ minHeight: 560, background: INK.ink, color: '#fff', display: 'grid', gridTemplateColumns: '1.4fr 1fr', alignItems: 'center', padding: '0 7%', gap: 60 }}>
          <blockquote style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 500, fontSize: 'clamp(28px,4.4vw,56px)', lineHeight: 1.08, letterSpacing: '-0.03em', textTransform: 'lowercase', maxWidth: '24ch' }}>
            đừng chỉ xác thực một lần ở đầu một quy trình kéo dài nhiều giờ. việc kiểm tra lúc 11 giờ 30 đã
            <span style={{ color: INK.blue, background: '#fff', padding: '0 .1em' }}>vô nghĩa</span> vào lúc 11 giờ 48.
          </blockquote>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', marginBottom: 12 }}>bài học rút ra từ sự cố</div>
            <p style={{ fontFamily: BODY, fontSize: 16, lineHeight: 1.65, color: 'rgba(255,255,255,.85)', maxWidth: '36ch', margin: 0 }}>
              Câu này gần như là định nghĩa của TOCTOU, viết bằng ngôn ngữ của người vận hành thật, sau một
              đêm không ngủ. Nó không nói về mã nguồn. Nó nói về thời hạn sử dụng của một sự thật.
            </p>
          </div>
        </section>

        {/* ── 05 · LAYER 3 · AI AGENTS ── */}
        <section style={{ padding: '84px 7%' }}>
          <Kicker n="05">tầng thứ ba</Kicker>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 56, alignItems: 'start' }}>
            <div>
              <SectionTitle w="14ch">lỗi cũ, tầng trừu tượng mới.</SectionTitle>
              <Sidenote n="04">TOCTOU-Bench, một bộ đánh giá lỗi TOCTOU trong agent do LLM vận hành:
                arxiv.org/pdf/2508.17155. Nghiên cứu về cùng lớp lỗi trong agent điều khiển browser:
                arxiv.org/pdf/2603.00476.</Sidenote>
            </div>
            <div>
              <P>Nếu bài này viết năm 2015, nó sẽ kết thúc ở phần trên. Chuyện thú vị là lớp lỗi này vừa mọc
                lại ở một chỗ mà gần như chưa ai kịp gọi đúng tên nó.</P>
              <P>Một AI agent làm việc bằng cách gọi tool nhiều lượt. Nó đọc một file cấu hình, xem xét nội
                dung, kết luận rằng file an toàn, rồi ở lượt sau nó thực thi hoặc gửi nội dung đó đi. Giữa hai
                lượt gọi tool ấy không có gì bảo đảm tính nguyên tử. Không có khoá, không có transaction,
                không có ai đảm bảo rằng thứ nó vừa đọc vẫn là thứ nó sắp dùng.</P>
              <P>Nghiên cứu gần đây chỉ ra chính xác điều đó: lỗi xảy ra khi agent xác thực một trạng thái bên
                ngoài, một file hoặc một phản hồi API, mà trạng thái ấy bị chỉnh sửa trước khi được sử dụng.
                Kịch bản tấn công không có gì mới lạ: tráo file cấu hình độc hại vào giữa hai lượt, hoặc chèn
                payload vào phản hồi mà agent đã kiểm duyệt xong.</P>
              <P>Mình thấy chỗ này đáng chú ý vì tính chất lặp lại của nó. Các lập trình viên Unix đã vật lộn
                với đúng khuôn mẫu này từ thập niên 1990, và lời giải đã được viết ra rất rõ ràng: đừng kiểm
                tra cái tên, hãy giữ lấy tham chiếu. Nhưng lời giải ấy được diễn đạt bằng từ vựng của file
                descriptor, nên khi khoảng hở tái sinh ở tầng của tool-call và ngữ cảnh hội thoại, không ai
                nhận ra người quen.</P>
              <P style={{ marginBottom: 0 }}>Một agent lập luận rất tốt vẫn có thể sai vì một lý do không liên
                quan gì đến chất lượng lập luận. Nó lập luận trên một ảnh chụp, và hành động trên thế giới.</P>
            </div>
          </div>
        </section>

        {/* ── 06 · REVEAL ── */}
        <section style={{ padding: '84px 7% 70px', background: INK.paper2, borderTop: `1.5px solid ${INK.ruleHard}`, borderBottom: `1.5px solid ${INK.ruleHard}` }}>
          <Kicker n="06">chỗ câu hỏi đổi hình</Kicker>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 60, alignItems: 'start' }}>
            <div>
              <SectionTitle w="20ch">có một chỉ thị CPU đã trả lời chuyện này từ lâu.</SectionTitle>
              <P>Compare-and-swap là một chỉ thị nguyên tử ở cấp CPU. Nó nhận vào giá trị mà bạn tin là đang có
                ở đó, và giá trị bạn muốn ghi. Nếu ô nhớ vẫn đúng bằng giá trị bạn tin, nó ghi. Nếu không, nó
                thất bại và trả lại cho bạn quyền quyết định. Kiểm tra và cập nhật xảy ra trong một thao tác
                duy nhất, nên không có race condition nào chen vào được, không phải vì hệ thống chặn kịp, mà vì
                không tồn tại khoảng giữa để chen.</P>
              <P>Đây là chỗ câu hỏi ban đầu của mình đổi hình dạng. Mình đã hỏi sai. Câu hỏi không phải làm sao
                kiểm tra cho chắc. Càng không phải kiểm tra bao nhiêu lần là đủ, vì với bất kỳ số lần nào,
                khoảng hở cuối cùng vẫn còn nguyên ở đó, nằm giữa lần kiểm tra chót và hành động.</P>
              <P>Câu hỏi đúng là: giữa lúc biết và lúc làm, có ai khác kịp làm gì không. Và nếu có, thì cách
                duy nhất là không để tồn tại một khoảng giữa nào cả.</P>
              <P style={{ marginBottom: 0 }}>Nói cách khác, mọi bước kiểm tra đều là một phát biểu về quá khứ.
                Điều chúng ta không bao giờ viết ra khi kiểm tra, là phát biểu ấy còn hiệu lực trong bao lâu.
                Với một biến trong bộ nhớ, hiệu lực có thể là vài nano giây. Với một quy trình duyệt chi, là ba
                tuần. Với một lời hứa, không ai biết. Toàn bộ TOCTOU nằm trong khoảng cách giữa thời hạn thật
                của một sự thật và thời hạn mà hệ thống ngầm giả định.</P>
            </div>
            <div style={{ paddingTop: 10 }}>
              <PullQuote mark="reveal">TOCTOU không sửa được bằng cách kiểm tra kỹ hơn. Nó chỉ hết khi khoảng cách
                giữa biết và làm bằng không.</PullQuote>
              <div style={{ border: `1.5px solid ${INK.ruleHard}`, background: INK.paper, padding: '16px 18px' }}>
                <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: INK.blue, marginBottom: 8 }}>một câu thần chú</div>
                <div style={{ fontFamily: BODY, fontSize: 14.5, lineHeight: 1.65, color: INK.ink }}>Nếu bạn chỉ giữ
                  lại một thứ từ bài này, hãy giữ câu hỏi này để hỏi trong mọi code review: giữa dòng kiểm tra
                  và dòng hành động, ai khác có thể xen vào. Nếu câu trả lời không phải là không ai, thì bạn
                  chưa sửa gì cả.</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 07 · FIXES BY LAYER ── */}
        <section style={{ padding: '80px 7%' }}>
          <Kicker n="07">gộp hai bước thành một</Kicker>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 56, alignItems: 'start', marginBottom: 34 }}>
            <SectionTitle w="18ch">cùng một động tác, ba tầng hệ thống.</SectionTitle>
            <P size={17}>Ba tầng dưới đây trông rất khác nhau về từ vựng, và giống nhau tuyệt đối về hình dạng
              lời giải. Bấm từng tầng để so hai cột.</P>
          </div>
          <FixPlates />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 40, marginTop: 48 }}>
            <P size={16} w="100%">Ở tầng hệ điều hành, lời giải là ngừng nói về cái tên. Mở file một lần, giữ
              lấy descriptor, và làm mọi thao tác sau đó trên chính descriptor ấy. Cái tên có thể bị tráo bao
              nhiêu lần cũng được, vì không còn ai hỏi nó nữa.</P>
            <P size={16} w="100%">Ở tầng cơ sở dữ liệu, lời giải là đừng đọc ở một giao dịch rồi ghi ở một giao
              dịch khác. Khoá bi quan bằng SELECT FOR UPDATE, hoặc khoá lạc quan bằng số phiên bản: ghi chỉ
              thành công khi phiên bản chưa đổi kể từ lúc đọc.</P>
            <P size={16} w="100%">Ở tầng phân tán, lời giải là đặt tính nguyên tử ngay tại chỗ trạng thái đổi.
                Compare-and-swap, fencing token để chặn một leader đã bị phế truất, quorum để bắt đa số đồng ý
                trước khi trạng thái được đổi. Cùng một ý, ba quy mô.</P>
          </div>
        </section>

        {/* ── 08 · REFRAME ── */}
        <section style={{ minHeight: 620, background: INK.blue, color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 7%' }}>
          <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.75, marginBottom: 26 }}>08 · để lại</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
            <div>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(32px,4.4vw,58px)', lineHeight: 1.02, letterSpacing: '-0.04em', margin: '0 0 28px', textTransform: 'lowercase', maxWidth: '18ch' }}>
                mọi quyết định đều dựa trên một ảnh chụp.
              </h2>
              <p style={{ fontFamily: BODY, fontSize: 18.5, lineHeight: 1.7, maxWidth: '44ch', opacity: 0.93, margin: '0 0 22px' }}>
                Càng nhiều bên tham gia, độ trễ giữa quan sát và hành động càng dài, và ảnh chụp càng cũ vào
                đúng lúc nó được dùng. Đó là lý do các tổ chức lớn ra quyết định chậm mà vẫn sai, trong khi
                từng bước trong quy trình đều được thực hiện đúng.
              </p>
              <p style={{ fontFamily: BODY, fontSize: 18.5, lineHeight: 1.7, maxWidth: '44ch', opacity: 0.93, margin: 0 }}>
                Câu hỏi mà mình mang ra khỏi bài này không phải là câu hỏi về code. Nó là: mình đang tin điều
                gì là đúng, chỉ vì nó đã đúng vào lúc mình kiểm tra.
              </p>
            </div>
            <div style={{ borderLeft: '1.5px solid rgba(255,255,255,.4)', paddingLeft: 30 }}>
              <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.7, marginBottom: 14 }}>câu để nhớ</div>
              <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 26, lineHeight: 1.24, letterSpacing: '-0.02em', maxWidth: '22ch' }}>
                Mỗi lần kiểm tra là một phát biểu về quá khứ. Điều không ai viết ra là nó còn đúng trong bao lâu.
              </div>
              <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.7, marginTop: 18 }}>từ · khoảng cách giữa biết và làm</div>
            </div>
          </div>
        </section>

        {/* ── SOURCES ── */}
        <section style={{ padding: '64px 7% 80px' }}>
          <Kicker n="09">đọc thêm</Kicker>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0 56px' }}>
            {[
              ['Báo cáo chính thức của Amazon về sự cố US-EAST-1', 'aws.amazon.com/message/101925'],
              ['Bài nền tảng, dễ vào nhất cho khái niệm', 'deepstrike.io/blog/what-is-time-of-check-time-of-use-toctou'],
              ['Hướng dẫn khắc phục theo CWE-367', 'dipsylala.github.io/FlawFixingGuidance/CWE-367'],
              ['TOCTOU-Bench, lớp lỗi này trong agent LLM', 'arxiv.org/pdf/2508.17155'],
              ['TOCTOU trong agent điều khiển browser', 'arxiv.org/pdf/2603.00476'],
            ].map(([t, u], i) => (
              <a key={i} href="#" style={{ display: 'grid', gridTemplateColumns: '30px 1fr', gap: 16, padding: '16px 0', borderTop: `1px solid ${INK.rule}`, color: INK.ink, textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = INK.blue}
                onMouseLeave={e => e.currentTarget.style.color = INK.ink}>
                <span style={{ fontFamily: MONO, fontSize: 12, color: INK.faint }}>{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <span style={{ fontFamily: DISPLAY, fontSize: 18, fontWeight: 500, letterSpacing: '-0.02em', display: 'block' }}>{t}</span>
                  <span style={{ fontFamily: MONO, fontSize: 11.5, color: INK.muted, display: 'block', marginTop: 4 }}>{u}</span>
                </span>
              </a>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 44 }}>
            <button onClick={() => scRef.current && scRef.current.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: '0.1em', textTransform: 'uppercase', border: `1.5px solid ${INK.ruleHard}`, padding: '13px 20px', background: INK.paper, color: INK.ink, cursor: 'pointer' }}>↑ về đầu bài</button>
            <a href="#" style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: '0.1em', textTransform: 'uppercase', border: `1.5px solid ${INK.ruleHard}`, padding: '13px 20px', color: INK.ink, textDecoration: 'none' }}>lưu vào commonplace</a>
          </div>
        </section>
      </div>
    </InkChrome>
  );
}

Object.assign(window, { InkToctou });
