# SFIM_FEATURESET — maximizing the act of *reading*

_Đề xuất tính năng cho maxubrq, soi qua SFIM (Stratified Feature Impact
Model). Phạm vi: toàn bộ vòng đời của một lần đọc — **trước · trong · sau**.
Mỗi món ghi: cơ chế · tầng SFIM · diagnostic test · defense (chống trôi về
trò rẻ tiền). Tier = **cơ chế tạo giá trị**, không phải độ hoành tráng._

_Nguyên tắc nền: reading comes first; interactions live *inside* the page
frame; private by default — counts, never names. Mọi món dưới đây phải sống
được trong Ink Edition (hairline grid, một màu blue, MONO fine-print,
rectangle, hover = colour flip)._

---

## ★ Flagship — cái vòng đóng khung (nối cả ba phase)

**The Bracketed Question.** Một **câu hỏi được gieo trước khi đọc** → nằm ở
lề suốt lúc đọc → **reader trả lời một dòng ở cuối** → **câu hỏi + câu trả
lời của chính bạn hiện lại lần sau khi quay lại bài**.

- **Cơ chế:** đóng khung nhận thức (framing) + so-sánh-với-chính-mình theo
  thời gian. Nó không thưởng dopamine; nó cho reader thấy *mình đã nghĩ khác
  đi*.
- **Tier: T5 Transformative.** Đo được thay đổi trong chính người đọc qua
  thời gian, ngoài phạm vi một lần đọc.
- **Diagnostic:** reader quay lại bài cũ *để đọc lại câu trả lời của mình*,
  không phải để đọc lại bài?
- **Defense:** một câu hỏi mỗi bài, do tác giả gieo. Không phải quiz, không
  điểm, không đúng/sai. Câu trả lời riêng tư mặc định.

> Khuyến nghị dựng đầu tiên nếu mục tiêu là "đọc" theo nghĩa rộng nhất.

---

## TRƯỚC — đặt kỳ vọng & tâm thế

### ★ Thời tiết của bài — T2 → T3  ✓ resolved (m0033)
Khối MONO trung thực ngay đầu: mất bao lâu, độ khó, cần biết gì trước, "đọc
khi bạn đang ở tâm trạng X". Không phải tag — là *hợp đồng đọc*.
- *Cơ chế:* hạ bất định trước khi cam kết.
- *Diagnostic:* tỉ lệ bắt-đầu-rồi-đọc-hết tăng?
- *Defense:* trung thực kể cả khi bất lợi ("bài này sẽ làm bạn khó chịu").

**CHỐT THIẾT KẾ — hai hình thức.** Tính năng tồn tại để *chuẩn bị trước khi
đọc*, nên nó phải xuất hiện ở cả nơi quyết-định-đọc (listing/home) lẫn nơi
bắt-đầu-đọc (đầu bài). Không dùng bảng 6 dòng — nhùng khi đọc.

*Hình thức A — strip đầu bài (`WeatherStrip`).* Khối viền `--ruleHard`, gồm:
- Một hàng *chip mono* nằm ngang, ngăn nhau bằng hairline dọc: `read time`
  (kèm ước lượng "one sitting / chia nhỏ được"), `load` (thang **ô vuông
  1–5**, KHÔNG phải số "4/5"), `need first`, `best when`. Wrap xuống hàng khi
  hẹp (`flex-wrap`, `row-gap`).
- Một *dòng warning* nền `--blue`, chữ trắng, prefix "honest ↴": câu trung
  thực nhất về bài, kể cả bất lợi. Một dòng, không phải ô cảnh báo đỏ — sự
  trung thực in bình thản, không báo động.

*Hình thức B — một dòng trên listing (`WeatherLine`).* Gắn dưới mỗi tiêu đề
bài ở home/index/topic: `◔ {time} · load {ô vuông nhỏ} · {when} [· ⚠ {warn}]`.
MONO, `--muted`, warning `--blue`. Warning là optional. Mục đích: đọc-đúng-người
ngay từ listing, giảm click nhầm.

*Data shape (mỗi bài).* `{ time, oneSitting:bool, load:1..5, needFirst,
bestWhen, warn:string|null }`. `warn=null` → không hiện dòng warning / cảnh báo.
`load` render bằng component `Load({n,of:5,small})` (ô đầy = `--blue`, ô rỗng =
viền `--rule`). Không bao giờ in con số cho `load` hay `time%`.

*Nguyên tắc thực thi.* (1) Cùng nguồn data cho A và B — viết một `weather`
object cạnh frontmatter bài, cả hai form đọc từ đó. (2) `time` là ước lượng
người viết tự đặt, không phải máy đếm chữ chia tốc độ. (3) Warning do tác giả
viết tay cho từng bài; nếu bài không có gì để cảnh báo, để `null` — không bịa.
(4) Không icon cảm xúc; chỉ MONO + ô vuông + `◔`/`⚠`. *Demo sống:* artboard
"Lab — thời tiết của bài" (2 forms).

### ★ Hẹn giờ đọc, không phải bookmark — T5
Thay vì "save" (nghĩa địa lưu-để-không-đọc), đặt một *cuộc hẹn* với bài vào
giờ thật.
- *Cơ chế:* đổi hành vi từ tích trữ vô hạn → đọc có lịch.
- *Diagnostic:* bài đã hẹn có completion cao hơn hẳn bài chỉ-save?
- *Defense:* không nhắc nhở dồn dập; một lời mời lặng, bỏ lỡ thì thôi.

### Cửa vào theo tâm trạng — T3 → T4
Vào kho không chỉ bằng chủ đề mà bằng *mình đang muốn gì*: "cần yên", "muốn
bị thách thức", "10 phút trống", "khó ngủ". Doorway flip xanh như topic hub.
- *Cơ chế:* khớp bài với trạng thái, không với danh mục.
- *Defense:* mood là của reader, không phải mood do site áp đặt.

### Độ ồn cần thiết — T1 → T2
Một dòng MONO: bài này cần yên tĩnh cỡ nào (đọc lướt được / cần tập trung /
cần giấy bút). Chuẩn bị môi trường trước khi vào.

### Cold open — T3 (thuần thẩm mỹ/biên tập)
Cho phép một số bài mở bằng câu đầu tiên, không title/ảnh — reader rơi thẳng
vào giọng văn. Title xuất hiện muộn ở lề.

### Bản nháp lộ thiên — T4 (identity tác giả)
Đánh dấu bài đang còn sửa; reader thấy nó *thở*, thấy vết biên tập. "A
notebook, kept in public" đúng nghĩa đen.
- *Defense:* không phải "coming soon" câu view — là sự thành thật về quá trình.

---

## TRONG — chính hành vi đọc

### ★ Chế độ một dòng sáng — T2
Focus sâu: đoạn đang đọc giữ nguyên, phần còn lại mờ về `--faint`. Hard-cut,
không animation.
- *Cơ chế:* giảm tải thị giác ngoại vi.

### ★ Dấu "mình lạc ở đây" — T3 + tín hiệu tác giả (riêng tư)  ✓ gộp vào The Mark (m0016, gesture `snag`)
Reader đánh dấu câu làm mất mạch. Với reader: cái neo để quay lại. Với tác
giả: bản đồ chỗ người ta vấp. Counts only.
- *Diagnostic:* reader dùng nó để quay lại đúng chỗ, không chỉ bỏ đi?

### Nhịp thở cuối mục — T3
Một beat dừng có chủ đích giữa các `❧` — khoảng lặng thiết kế, không phải
khoảng trắng ngẫu nhiên. Có thể là một dòng MONO lặng: "dừng một nhịp".

### Sức nặng còn lại, không phải % — T2 (anti-gamification)  ✓ resolved (m0033)
Bỏ progress bar. Thay bằng *độ dày còn lại* như gáy sách trong gutter — bạn
*cảm* được còn bao nhiêu, không *đếm*.
- *Defense:* không con số, không "80% done" thúc giục.

**CHỐT THIẾT KẾ — cạnh sách (fore-edge) trong gutter.** Một cột hẹp (~86px)
bên trái cột chữ, vẽ cạnh cuốn sách như một *chồng leaves* (hairline ngang xếp
chồng). Tổng số leaves = `LEAVES`, map theo độ dài thật của bài (số đoạn hoặc
số "màn"), không cố định.

*Ba lớp trong gutter, từ trên xuống:*
1. *Dải "read"* — `readLeaves = round(p * LEAVES)` leaves nén sát (gap ~0.5px,
   màu `--rule` mờ). Phần đã đọc, gọn lại như trang đã lật sang tay trái.
2. *Vạch đọc* — một thanh `--blue` dày ~2.5px = chỗ bạn đang đứng.
3. *Khối "còn lại"* — `LEAVES − readLeaves` leaves màu `--ruleHard`, gap rộng
   hơn (~3px) nên *cảm giác dày/nặng*. Đây là thứ mắt đọc: khối càng cao =
   còn càng nhiều.

*Cơ chế.* `p` = tỉ lệ cuộn (`scrollTop / (scrollHeight − clientHeight)`), chỉ
0..1, **chỉ dùng để vẽ độ dày — KHÔNG BAO GIỜ render ra chữ số / %.** Đọc tới
đâu, leaves dồn từ khối dưới lên dải trên: trao sức nặng từ tay phải qua trái,
giống sách thật.

*Nguyên tắc thực thi.* (1) Không text %, không "còn 3 phút", không tooltip đếm.
(2) Nhãn dọc duy nhất được phép: "read" (`--faint`) trên, "còn lại" (`--blue`)
dưới — chữ, không số. (3) Khi hết bài: khối "còn lại" cạn, bài kết thúc *lặng*,
KHÔNG bắn completion/streak/animation ăn mừng. (4) Chỉ hiện trong flow/reading
view; gutter ẩn ở listing. (5) Cân nhắc `prefers-reduced-motion`: bỏ transition,
chỉ đổi chiều cao khối. *Demo sống:* artboard "Lab — sức nặng còn lại".

### Con trỏ đọc — T2  ✓ resolved: dải sáng
Một "thước đọc" bám dòng đang đọc trong flow mode, giúp mắt không tụt dòng ở
đoạn dài. **Chốt thiết kế (m0020): dải sáng, không phải đường kẻ.** Dòng đang
đọc giữ tương phản đầy; các dòng khác lùi ~32% opacity — không có vật thể lạ đè
lên chữ. Neo vào dòng gần tâm viewport (không chạy theo tốc độ cuộn). Đứng yên
~1.4s → tự mờ; di chuyển → hiện lại. Opt-in, không có gì để tắt thủ công.
(Hairline lề bút chì là biến thể phụ cho ai muốn mốc rõ hơn.) *Demo sống:*
artboard "Lab — con trỏ đọc".

### Type thở theo thời khắc — T5 (vô hình)
Cỡ/tương phản/ấm-lạnh của chữ tự điều chỉnh theo giờ trong ngày và ánh sáng
môi trường (đêm → dịu, cắt halation). Không hỏi, không toggle — chỉ cảm nhận.
- *Diagnostic:* reader đọc buổi tối lâu hơn mà không mỏi?

### Lớp đọc-lại — T5
Khi quay lại một bài đã đọc, các câu *bạn từng gạch chân* nổi lại mờ mờ. Lần
đọc thứ hai là một lớp chồng lên lần đầu, không phải bắt đầu lại.
- *Cơ chế:* đổi mental model "đọc lại = đọc từ đầu" → "đọc lại = đối thoại với
  chính mình lần trước".

### Tạm dừng có chủ đích — T3 → T5
Ở một điểm ngoặt của bài, một hard-stop mời reader *nhìn ra chỗ khác 20 giây*
trước khi tiết lộ đoạn sau. Bounded bởi `2px solid --blue` top rule.
- *Defense:* tác giả đặt, hiếm, chỉ ở chỗ đáng — không phải chặn câu view.

### Nhấn nhá của tác giả — T3
Marks do tác giả gieo trong văn: "đọc chậm câu này", "câu này là bản lề".
Khác glossary — đây là *chỉ dẫn nhịp đọc*, không phải định nghĩa.

---

## SAU — củng cố & mang đi

### ★ Câu bạn sẽ quên — T5 (mạnh nhất tầng sau)
Vài ngày sau khi đọc xong, một tấm card lặng lẽ trả lại *một câu cốt lõi*
(spaced repetition), typeset như essay, không notification ồn.
- *Cơ chế:* biến việc đọc thành việc nhớ — thay đổi hành vi ngoài site.
- *Diagnostic:* reader nói "mình vẫn nhớ ý đó" sau 30 ngày?
- *Defense:* một câu, một lần, không streak, không nhắc nếu bỏ qua.

### ★ Commonplace của riêng bạn — T4 → T5  ✓ resolved (m0045)
Mọi câu gạch chân tự gom thành cuốn sổ trích typeset đúng Ink Edition, in
được. Không stats — là *chân dung cách bạn đọc*.
- *Defense:* không chronology, không count trên tiêu đề; câu của reader dẫn.

**CHỐT THIẾT KẾ.** Trang sổ trích, câu của reader dẫn (typeset font display cỡ
lớn), nguồn chỉ thì thầm bên dưới dạng MONO. Không ngày trên trang, không tally
trên tiêu đề. Gom theo *thread* (khía cạnh cách đọc), không theo thời gian.

*Data — một highlight.* `{ id, text, postId, postTitle, by, thread, ts }`. `ts`
chỉ để sort nội bộ trong một thread (mới nhất trước), KHÔNG hiển thị. Nguồn của
`highlight` chính là cử chỉ "đánh dấu bằng cách gạch" (T2, Batch III) — bôi chọn
câu → lưu vào store local.

*Nhóm theo thread — không ML.* `thread = post.tag`. Tái dùng taxonomy tác giả
đã có trong Constellation: mỗi post mang `t` (sci/phi/art/sw) và optional
`witness`. Ba mức:
1. **Nền (làm ngay):** thread = nhãn chủ đề của bài chứa câu. Deterministic,
   in lại y hệt mỗi lần. `groupBy(highlights, h => postIndex[h.postId].t)`.
2. **Lớp phụ:** *witness-kinship* — câu mang cùng `witness` tag (nhiều người
   cùng đánh dấu) cụm thành thread liên-bài, dù khác chủ đề.
3. **Để dành:** embedding ngữ nghĩa cho thread "tự nổi" — non-deterministic,
   chỉ thêm khi thực sự cần; không thay (1) làm mặc định.
Nhãn thread ("on memory & forgetting") = câu epigram tác giả đặt cho mỗi
tag/witness, không phải máy sinh.

*Store.* `localStorage['maxubrq.highlights']` = mảng highlight objects. Không
tài khoản, không sync, không server. Xoá được từng câu.

*Export (đã dựng).* Hàm `toMarkdown(kind)`:
- **Obsidian:** YAML frontmatter (`title`, `source`, `tags`) + mỗi câu là
  blockquote, nguồn là `[[wiki-link]]` → nối vào graph của họ.
- **Notion / plain md:** không frontmatter, nguồn in *nghiêng*. Dán thẳng vào
  Notion giữ nguyên blockquote.
Xuất `.md` (Blob download) hoặc copy clipboard. Mở rộng sau: JSON thô, và
`.csv` (text,source,thread) cho ai muốn tự xử lý.

*Nguyên tắc thực thi.* (1) Câu dẫn, nguồn thì thầm — không đảo. (2) Không
ngày/không count trên trang; tally (nếu cần) sống ở Reading Room. (3) In được:
layout trang giấy sạch, không chrome. (4) Chỉ đọc từ store local; rỗng → trạng
thái "chưa có câu nào — gạch chân câu đầu tiên đi". *Demo sống:* artboard
"Commonplace book".

### ★ The Reading Room — gom mọi thứ reader-owned — T4 → T5  ✓ resolved (m0045)
Một *mái nhà riêng tư* duy nhất chứa mọi thứ người đọc tạo ra bằng việc đọc:
constellation (bản đồ đã đọc), commonplace (câu đã giữ), sổ hiểu lầm, cuộc hẹn
đọc, kệ-đã-đọc. Không phải dashboard/analytics — là một *căn phòng*.

*Truy cập — giống Vault, KHÔNG lên global nav.* Vào từ (a) một cửa trên trang
"About the author", và (b) một monogram bền ở góc (tùy chọn). Lý do: đây là
không gian cá nhân, không phải mục điều hướng công cộng. Vault = đồ của **tác
giả**; Reading Room = đồ của **người đọc** — hai cửa riêng biệt cạnh nhau trên
About.

*Cấu trúc — hub gồm các "cửa".* Mỗi panel là một `<a>` dẫn tới trang đầy đủ của
nó (`#ink-constellation`, `#ink-commonplace`, …). Hub chỉ *preview + đếm nhẹ*.
Panel "constellation" chiếm 2 cột, nền `--blue` (mỏ neo thị giác); còn lại 1 cột.

*Counts sống Ở ĐÂY, không ở trang con.* Nguyên tắc: trang commonplace/
constellation dẫn bằng *nội dung* (câu, sao), mọi con số ("9 marks · 3 threads",
"12/32 lit") chỉ xuất hiện trong Reading Room. Giữ trang con khỏi biến thành
bảng điểm.

*Tính toán — local, dẫn xuất.* Mọi số/preview compute trên máy từ hai store:
`maxubrq.highlights` (commonplace) và `maxubrq.reading` (trạng thái đọc từng
post: finished/half/unread, thứ tự đọc — cùng nguồn Constellation dùng). Không
upload, không tài khoản. Cửa nào chưa có dữ liệu → panel hiện lời mời, không số 0
trơ trọi.

*Nguyên tắc thực thi.* (1) Một nguồn sự thật cho mỗi loại (highlights, reading
state) — Constellation, Commonplace, Reading Room cùng đọc từ đó, không nhân
bản. (2) Off-menu tuyệt đối; chỉ vào từ About + monogram. (3) Panel là cửa, không
nhồi nội dung đầy đủ vào hub. (4) Ngôn ngữ "yours, not mine / stays on your
device" nhắc quyền riêng tư ngay trên bề mặt. *Demo sống:* artboard "The Reading
Room".

### "Chỗ này để lại cho bạn điều gì" — anti-recommend, T3
Không phải "bài liên quan" (engagement). Một bước tiếp trung thực *duy nhất*,
hoặc lời mời *nghỉ*.
- *Defense:* thà mời nghỉ còn hơn giữ chân bằng feed vô hạn.

### Thư gửi bạn-của-6-tháng-sau — T5
Cuối bài, reader viết vài dòng cho chính mình tương lai; site gửi lại đúng
hẹn. Bài đọc trở thành một mốc thời gian cá nhân.
- *Diagnostic:* reader viết thư dài hơn một câu recommend?

### Dư âm — T3
Một closing lặng: hình ảnh cốt lõi của bài như một cyanotype plate để ngồi
với nó một nhịp, trước khi rời trang. Không CTA.

### Kệ-đã-đọc như một vật — T4
### Kệ-đã-đọc như một vật — T4  ✓ resolved (m0051)
Những bài đã *đọc hết* (không phải đã mở) gom thành một object in được, typeset
như gáy sách. Chỉ finished, counts-free.
- *Defense:* mở-ra không tính; chỉ đọc-hết mới lên kệ.

**CHỐT THIẾT KẾ — một hàng gáy sách trên tấm ván.** Mỗi bài `finished === true`
thành một *spine* dựng đứng: tiêu đề chạy dọc (writing-mode vertical, bottom→
top), hairline band trên/dưới như sách đóng gáy, monogram tác giả ở chân. Cả
hàng đứng trên một tấm ván (dải `--ink` + line `--blue`). In được thành vật.

*Nguồn dữ liệu.* Lọc từ `maxubrq.reading` (store chung với Constellation/Reading
Room) nơi `finished === true`. **Chỉ finished** — `half`/`unread`/mở-ra-rồi-thoát
KHÔNG lên kệ. Đây là defense cốt lõi: spine xuất hiện đúng khoảnh khắc chạm dòng
cuối, không phải khi mở, không phải ở mốc %.

*Kích thước = dẫn xuất, deterministic.* `seed = title.length + i*7`. Chiều cao
`300 + (seed%5)*22`; bề rộng `46 + (min%4)*7 + (seed%3)*4` (dài hơn → dày hơn).
Màu theo chủ đề: sci=`--blue`, phi=`--ink`, art=`--blueDeep`, sw=than; ~1/3 gáy
màu kem (`seed%3===0`) xen vào cho nhịp. Cùng một corpus → cùng một kệ mỗi lần
(không random runtime), nên bản in ổn định.

*Nguyên tắc thực thi.* (1) Không số/rating/ngày trên board — counts-free tuyệt
đối; tally (nếu có) sống ở Reading Room. (2) `finished` là cờ nhị phân do việc
chạm-dòng-cuối đặt, không suy ra từ scroll %. (3) In được: hàng gáy + ván là một
object sạch, không chrome. (4) Rỗng → "kệ chưa có cuốn nào — đọc hết bài đầu tiên
đi", không kệ trống phô số 0. (5) `prefers-reduced-motion`: bỏ hiệu ứng nhấc gáy
khi hover. *Demo sống:* artboard "Read shelf". *Cửa vào:* Reading Room →
`#ink-shelf`.

---

## Xuyên suốt — hệ nền (system-level)

### ★ Đọc một series — trải nghiệm nhiều phần  ✓ resolved (m0066)
Các tính năng trước tối ưu cho *một bài*. Series là một *hợp đồng lớn hơn* và có
bốn khoảng trống riêng theo trước-trong-sau:
- **Trước:** thấy hình dạng cả *arc*, tổng thời gian thật (Σ weather các phần),
  thứ tự, nên bắt đầu từ đâu.
- **Trong:** biết *mình ở đâu* trong cả cung; mang ngữ cảnh giữa các phần đọc
  cách nhau nhiều ngày; các *motif* lặp xuyên phần.
- **Sau mỗi phần:** một *cây cầu* thật — không phải nút "next", mà lời bàn giao
  "giữ điều này khi vào phần sau".
- **Sau cả series:** trang *synthesis* — cả cung cộng lại thành gì, bằng câu
  reader đã giữ.

**CHỐT THIẾT KẾ — bốn thành phần.**
1. *Hợp đồng cả cung* (masthead). Σ thời gian + "~N sittings", đường cong độ khó
   ("builds 2→4→down"), thứ tự khuyến nghị, tiến độ của reader (đọc X/Y phút).
   Là "thời tiết" ở cấp series.
2. *The arc* (cột dọc). Mỗi phần một node: `read`=mực đầy, `current`=xanh "you
   are here", `ahead`=viền mờ (opacity ~0.72). Thread nối giữa node tô xanh dần
   theo tiến độ. Phần `ahead` KHÔNG khoá — chỉ mờ, vẫn mở được.
3. *The bridge* (giữa hai phần). Khối 2 cột: "where you left off" (câu reader
   dừng / câu chốt phần trước) ĐỐI CHIẾU "hold this going in" (điều cần mang
   sang) + một lối vào phần kế. Thay hoàn toàn CTA "next".
4. *Recurring threads*. Các motif chạy xuyên phần; thanh nhỏ cho biết motif nào
   qua movement nào; motif reader đang-ở-trong tô xanh. Đây là thứ giữ phần đọc
   sau 3 tuần vẫn "đáp" đúng chỗ.

*Data shape.* Series: `{ id, title, parts:[postId], threads:[{label, parts:[n]}],
difficultyArc }`. Mỗi post: `series: seriesId`, `part: n`. Trạng thái phần
(`read/current/ahead`) DẪN XUẤT từ `maxubrq.reading` (cùng store Constellation/
Shelf) — không lưu riêng. `current` = phần chưa finished có `part` nhỏ nhất.

*Cây cầu — nguồn nội dung.* "where you left off" = câu highlight cuối của reader
ở phần trước, fallback = câu chốt tác giả đánh dấu. "hold this going in" = một
dòng bàn giao tác giả viết tay cho từng cặp phần (`bridge[n→n+1]`). Không máy
tóm tắt.

*Nguyên tắc thực thi.* (1) Phần trước KHÔNG khoá phần sau — series là lời mời
theo thứ tự, không phải cửa có khoá. (2) Không %/streak cả cung; tiến độ là thời
gian-đã-đọc + node trạng thái, không thanh phần trăm. (3) Bridge thay "next" ở
MỌI nơi trong series — đây là chỗ chống-engagement-bẫy. (4) Đọc rời từng phần
vẫn hoạt động; series chỉ *thêm* thread + bridge, không bắt buộc tuyến tính. (5)
Finish cả N phần → mở trang synthesis (câu reader đã giữ, gom theo thread series).
*Demo sống:* artboard "Series — a reading in five movements".

### ★ Dạng bài: Flow vs Free — hạ tầng trình bày  ✓ resolved (m0057)
Mỗi bài khai báo một *reading type* quyết định khung trình bày. Ba dạng:
- **`standard`** — bài trong cột editorial mặc định (chrome đầy đủ, nav, footer).
- **`flow`** — vẫn có cấu trúc, nhưng chrome ẩn để tập trung: flow mode + con trỏ
  đọc (dải sáng) + sức nặng còn lại. Là *cùng nội dung*, ít nhiễu hơn.
- **`free`** — full-bleed, scroll-driven, KHÔNG cột/không luật. Tác giả tự do
  dựng scrollytelling (sticky graphic biến đổi theo scroll, panel full-bleed,
  typo khổ lớn, chuyển động riêng). Tham chiếu: pudding.cool. Dùng khi *ý tưởng
  cần cả màn hình và motion của riêng nó* — phần lớn bài KHÔNG cần.

**Ranh giới Flow ≠ Free (quan trọng).** Flow = tối giản-hóa một bài có cấu trúc
để đọc sâu; luật đọc (cột, typo, con trỏ, sức nặng) VẪN áp. Free = phá luật; bài
tự định nghĩa layout + animation riêng, các reading-instrument tiêu chuẩn (con
trỏ, sức nặng, một-dòng-sáng) TẮT vì chúng giả định một cột chữ.

*Khai báo (frontmatter).* `type: standard | flow | free` (mặc định `standard`).
Với `free`, thêm `freeEntry` (component/entry của scrollytelling) — mỗi bài Free
là một module riêng, không dùng renderer bài thường. Router đọc `type` → chọn
shell: standard/flow dùng ArticlePage; free mount thẳng component full-bleed của
bài, chỉ giữ InkChrome tối thiểu (hoặc bỏ hẳn).

*Kỹ thuật scrollytelling (khuôn Free).* (1) Một scroll container riêng
(`data-scroller`); (2) *sticky stage* `position:sticky; top:0` giữ graphic khi
các *step* cuộn qua; (3) `onScroll` tính `t` (0..1 tiến trình trong section) để
lái graphic vẽ dần, + step-active khi step chạm tâm viewport; (4) panel full-bleed
xen giữa các stage cho nhịp. Reduced-motion: graphic hiện thẳng trạng thái cuối,
bỏ vẽ-theo-scroll.

*Nguyên tắc thực thi.* (1) Free là *ngoại lệ có chủ đích*, không phải mặc định —
đắt để làm, dành cho bài xứng đáng. (2) Vẫn giữ palette + type ink (Free tự do
layout, KHÔNG tự do đổi thương hiệu). (3) Có escape: luôn có "↑ back to top" và
lối ra; đừng bẫy người đọc trong scroll vô tận. (4) Đọc-hết một bài Free vẫn tính
`finished` (lên Read shelf) khi chạm section cuối. (5) Weather/commonplace vẫn
áp: bài Free vẫn có "thời tiết", câu vẫn gạch chân được nếu có đoạn văn thường.
*Demo sống:* artboard "Free — the shape of forgetting".

### ★ The Mark — một nguyên thuỷ cho mọi tương tác của người đọc  ✓ resolved (m0016)
Mọi hành vi người đọc tác động lên văn bản (gạch chân, phản đối, đánh dấu chỗ
vấp, hỏi, nhắn tác giả, ghi điều mình tin) **là cùng một thứ**: một *dấu*. Không
phải nút cảm xúc. Cử chỉ của một người viết vào lề cuốn sách mình đang đọc.
Entry này **thay thế** reaction bar cũ (`❤ ✦ ?` + note) và **gộp** ba entry rời
trước đó: "dấu mình lạc ở đây" (TRONG), "dấu mình không tin câu này" (Batch V),
"điều mình từng tin ở đây" (Batch V).
- *Test:* reader dùng ≥2 cử chỉ khác nhau trong một bài? Nếu chỉ dùng `keep`,
  bốn cử chỉ kia là trang trí — cắt.
- *Defense:* mặc định riêng tư; không cử chỉ nào công khai; không đếm trước mặt
  người đọc; chỉ `note` rời khỏi máy họ.
- *Diagnostic:* dấu có được *quay lại* không, hay chỉ được tạo ra rồi bỏ đó?

**CHỐT THIẾT KẾ — vì sao gộp.** Trước đây mỗi tính năng sau-đọc tự định nghĩa
lưu trữ riêng (highlights, snag list, dissent, reflection). Bảy luồng dữ liệu cho
một hành vi duy nhất là *chọn một đoạn và nói gì đó về nó*. Gộp lại: **một record
shape, nhiều đầu ra**. Thêm một tính năng sau-đọc không cần thêm store mới, chỉ
cần đọc lọc theo `gesture`.

*Bảng cử chỉ.* Năm cử chỉ neo vào **đoạn văn**, một neo vào **cả bài**, một là
tín hiệu **thụ động** (không có nút):

| gesture | nghĩa | ký hiệu trên trang | nuôi |
|---|---|---|---|
| `keep` | giữ câu này | gạch chân 2px `--blue` | commonplace · ấn bản in · câu bạn sẽ quên · trích dẫn mang gốc |
| `dissent` | mình không tin câu này | gạch đôi `--ink` + nền xám nhạt | sổ bất đồng · độ tự tin tác giả · lớp phản biện |
| `snag` | mình lạc ở đây | gạch chấm `--muted` | sổ hiểu lầm · bản đồ chỗ vấp · mỏ neo diễn giải lại |
| `ask` | một câu hỏi để ở lề | gạch mảnh + wash xanh | những câu hỏi tôi mang theo · margin question · dialogue |
| `note` | gửi riêng cho tác giả | thanh xanh 3px bên trái | hộp thư tác giả (không thống kê) |
| `belief` | điều mình đang tin sau khi đọc | không đánh dấu trong văn (neo cả bài) | điều mình từng tin ở đây · hạn dùng · đọc lại theo mùa |
| `dwell` | chỗ dừng lâu bất thường | vô hình | lề tự thở · tốc độ trung thực · hồ sơ nhịp đọc |

*Ký hiệu là chữ viết tay, không phải border CSS.* **Chốt (m0020): vết trên trang
được *vẽ* bằng rough.js**, không phải `border-bottom`. Lý do: art direction Ink
Edition vốn có scribble/underline vẽ tay; một dấu do người đọc đặt xuống phải
trông như mực họ vừa kéo, không như một thuộc tính CSS. Cơ chế:
- Một `<svg class="mk-layer">` phủ tuyệt đối lên cột chữ (`pointer-events:none`,
  `overflow:visible`). Với mỗi dấu, đo `span.getClientRects()` (nhiều rect nếu
  câu xuống dòng), quy về toạ độ cục bộ **chia cho hệ số zoom của canvas**
  (`box.width / scope.offsetWidth`) rồi vẽ.
- Nét theo cử chỉ: `keep` một gạch tay `--blue`; `dissent` gạch đôi `--ink` + nét
  chéo hất lên ở cuối; `snag` đường lượn sóng `--muted` (mảng điểm zigzag qua
  `rc.curve`); `ask` gạch mảnh + vòng ellipse nguệch quanh số hiệu; `note` ngoặc
  vuông dọc ở **mép trái đoạn văn** (không phải mép vùng bôi đen — nếu neo vào
  selection thì ngoặc rơi vào giữa dòng chữ).
- `seed = n*137+7` theo số thứ tự dấu → **không dấu nào giống dấu nào**, nhưng
  vẽ lại bao nhiêu lần cũng ra đúng hình cũ (deterministic, in được).
- **Nét chạy ra dần** khi vừa đặt: `stroke-dasharray = getTotalLength()` +
  keyframe `mk-draw`, thời lượng theo độ dài nét (tối đa 0.62s). Chỉ animate dấu
  *mới*; dấu cũ vẽ lại thì hiện ngay (`drawn` ref giữ set id đã vẽ).
- Rê chuột một dòng trong sổ dấu → nét tương ứng trên trang dày lên (`emph`).
- Vẽ lại khi `resize` và một lần sau 300ms cho font settle.
- **Glyph trong mark bar và bảng cử chỉ vẫn là stroke SVG sắc nét**, không rough.
  Chỉ *vết của người đọc* mới nguệch tay — giao diện thì tỉnh táo.

*Data — một dấu.*
```
{ id: 'mk_007',
  article: 'tocttou',
  snapshot: 'v2026-07-12',        // bản dựng bài lúc dấu được tạo
  gesture: 'keep',                // keep|dissent|snag|ask|note|belief|dwell
  block: 'p14',                   // id khối, gợi ý tìm nhanh — KHÔNG phải sự thật
  anchor: { quote, prefix, suffix, start, end },
  body: null,                     // chỉ ask|note|belief có
  at, session,
  phase: 'first-read' | 'reread',
  reach: 'private' | 'author' }   // chỉ note = author
```

*Cơ chế neo — quote-based, không phải offset.* Đây là phần quan trọng nhất và là
chỗ hầu hết hệ annotation hỏng. Lưu `anchor` theo hình dạng W3C
`TextQuoteSelector`: **nguyên văn đoạn được chọn + 24 ký tự ngữ cảnh mỗi bên**.
`start`/`end` chỉ là cache để tìm nhanh, không bao giờ là nguồn sự thật. Khi
resolve trên bản bài hiện tại, chạy ba bậc:
1. **exact** — `indexOf(quote)` tại `start` khớp → gắn thẳng.
2. **fuzzy** — quote không còn ở đúng chỗ nhưng tìm được bằng `prefix`+`suffix`
   (hoặc khớp mờ ~85% ký tự) → gắn lại, im lặng, cập nhật `start`.
3. **orphaned** — không tìm được. **Không giấu, không xoá.** Câu vẫn hiện trong
   sổ dấu, kèm nhãn *"câu này không còn trong bài"* và link tới bản snapshot cũ.

*Vì sao phải mang snapshot — đây chính là TOCTOU.* Người đọc gạch chân một câu là
một lần **check**. Tính năng đọc lại dấu đó sáu tháng sau là một lần **use**.
Giữa hai lần đó tác giả có thể đã sửa bài. Trạng thái `orphaned` **không phải
lỗi cần che** — nó là tín hiệu giá trị nhất trong toàn hệ: *bài đã đổi, đúng chỗ
bạn từng quan tâm*. Đó là đầu vào trực tiếp của Batch V (hạn dùng khai báo,
changelog như một lớp, "điều mình từng tin ở đây").

*Store.* `localStorage['maxubrq.marks']` = mảng phẳng. Commonplace đọc
`gesture==='keep'`; sổ hiểu lầm đọc `'snag'`; sổ bất đồng đọc `'dissent'`; trang
câu hỏi đọc `'ask'`. **Bỏ dần `maxubrq.highlights`** — migrate bằng cách map mỗi
highlight cũ thành `{gesture:'keep', anchor:{quote:text}, snapshot:null}`; thiếu
snapshot thì resolve luôn ở bậc fuzzy.

*Phía tác giả — bản đồ, không phải người.* Dashboard chỉ nhận **số đếm theo
section** cho `snag`/`dissent`/`keep`. Không nội dung, không id người đọc, không
quote. Ngoại lệ duy nhất: `note`, thứ vốn được viết để gửi đi. `belief` và
`dwell` không bao giờ rời máy người đọc.

*Glyph.* Vốn từ hiệu đính vẽ bằng stroke SVG 16×16 (gạch, gạch đôi có nét chéo,
đường lượn, dấu hỏi, ngòi bút), không emoji, không màu ngoài `--ink`/`--blue`.
`dissent` và `snag` dùng `--ink` chứ không dùng `--blue` — bất đồng và chỗ vấp
không phải "điểm nhấn thương hiệu".

*Bề mặt.* (a) **Mark bar** nổi khi bôi chọn ≥6 ký tự: nền `--ink`, năm cử chỉ
nằm ngang, mỗi cử chỉ là glyph + nhãn MONO 9px, hover đổi nền `--blue`; một dòng
chú giải tiếng Việt bên dưới đổi theo cử chỉ đang hover. (b) **Vết trên trang**
theo bảng trên + số hiệu superscript MONO 9px. (c) **Sổ dấu** trong lề/cuối bài:
danh sách `nn · glyph · trích câu`, hiện số dấu chứ không hiện điểm. (d) **Dấu
cuối bài** (`belief`): một câu hỏi display, một textarea, nút "ghi dấu" —
không có lời cảm ơn ồn ào.

*Nguyên tắc thực thi.* (1) Một record shape, một store — tính năng mới đọc lọc,
không tạo store mới. (2) Anchor là quote + ngữ cảnh, offset chỉ là cache. (3)
Snapshot bắt buộc trên mọi dấu; thiếu nó thì mọi tính năng thời-gian-dài đều nói
dối. (4) `orphaned` được hiển thị, không bị dọn. (5) Riêng tư là mặc định; chỉ
`note` có `reach:'author'`. (6) Không con số nào hiện trước mặt người đọc trong
lúc đọc — đếm sống ở Reading Room. (7) Cử chỉ thụ động (`dwell`) không bao giờ
có nút và không bao giờ gửi đi. (8) Vết là mực vẽ tay (rough.js, seed cố định),
giao diện là stroke sắc nét — không trộn hai thứ. *Demo sống:* artboard "The
mark".

### Hồ sơ nhịp đọc — T5  ✓ resolved (m0071)
Site học bạn là người đọc buổi sáng / đọc chậm / hay đọc lại, và lặng lẽ
thích ứng (thứ tự gợi ý, độ dài mặc định trang, pacing). Vô hình, cục bộ.

**CHỐT THIẾT KẾ — thiết kế TẤM GƯƠNG, không thiết kế sự thích ứng.** Bản thân
tính năng vô hình (adaptation chạy nền). Thứ cần thiết kế là *đúng một bề mặt
trung thực* để reader soi được site đã suy ra gì, sửa, và tắt. Thiếu bề mặt đó,
"học bạn" thành theo dõi lén. Bề mặt = gương soi + nút sửa, KHÔNG phải dashboard
phân tích.

*Kiến trúc.* Ba lớp:
1. *Signals* (thu, local) → ghi vào `maxubrq.reading`: giờ-trong-ngày mỗi lần
   đọc, tốc độ thật vs độ dài, tỉ lệ đọc-lại, completion theo độ dài, độ dài
   phiên, nhịp cuộn.
2. *Inferences* (suy, mềm) → mỗi trait `{ id, sentence, level:0..3, evidence,
   adapts, state }`. `level` = độ tự tin, HIỂN THỊ BẰNG CHỮ ("a hunch → fairly
   sure → quite sure → certain"), không bao giờ %. `state ∈ {ok, wrong, off}`.
3. *Adaptations* (dùng) → chỉ đọc trait có `state==='ok'` & `level>=1`: đổi thứ
   tự gợi ý, độ dài/độ sâu mặc định, pacing, giờ gợi ý cho "cuộc hẹn đọc".

*Bề mặt gương (đã dựng).* Mỗi trait một câu tiếng người + dòng "because
{evidence}" + dòng "so → {adapts}" + ba nút `that's me / not me / stop using`.
"not me" → gạch câu, ngừng adapt. Trait `level 0` mặc định `off` tới khi đủ bằng
chứng. Trên cùng: *master switch* — tắt là site "quên đã từng để ý", đối xử như
khách lần đầu.

*Nguyên tắc thực thi.* (1) Confidence bằng CHỮ, không số/không %. (2) Mỗi suy
luận phải kèm bằng chứng người-đọc-hiểu-được; không có bằng chứng → không hiện.
(3) Sửa/tắt được ở cả cấp trait lẫn cấp master; tôn trọng ngay lập tức. (4)
Local tuyệt đối — không upload, không score, không so sánh, không ai khác thấy.
(5) Low-confidence thì im (off), không đoán bừa để "có vẻ thông minh". *Truy
cập:* Reading Room → `#ink-profile`. *Demo sống:* artboard "Reading profile".

### Hợp đồng yên tĩnh — T3 → T5
Một công tắc "phiên đọc yên": tắt *toàn bộ* dữ liệu đám đông, nhắc nhở, dấu
hiệu cho cả session. Reader chọn sự vắng mặt.
- *Cơ chế:* trao lại quyền kiểm soát sự chú ý — re-train quan hệ với "arrival".

### Reader typography controls — T2 (nền còn thiếu)
Cỡ chữ / giãn dòng / bề rộng cột + toggle giãn diacritic tiếng Việt. Điều
kiện để mọi món trên đọc dễ hơn.
- *Diagnostic:* cải thiện 10% → reader nhận ra 10%? Có → T2 thật.

### Hiệu chỉnh độ khó — T2 → T4
Bài tự đánh giá độ khó; site khớp với mức reader đã thể hiện. Không gate — chỉ
gợi ý "bạn có thể muốn đọc X trước".

---

## Batch II — mở rộng (ngưỡng · thời gian dài · xã hội-riêng-tư · siêu-nhận-thức)

### TRƯỚC
- **Ngưỡng vào — T5.** Bài dài *từ chối mở* trong khe 2 phút: "cần 25 phút,
  bạn không có đủ bây giờ". Dạy đừng bắt đầu thứ mình sẽ bỏ dở. *Test:* giảm
  mở-rồi-thoát-trong-90-giây?
- **Đọc cùng giờ — T4 → T5.** Bài phát hành đúng một thời khắc; "có N người
  đang đọc cùng bạn ngay bây giờ" (vô danh, counts only). Ritual, không chat.
- **Lời người giới thiệu — T3.** Mỗi bài kèm một dòng *vì sao nên đọc* do
  người thật viết, không phải algo.
- **Đọc theo tồn kho thời gian — T2.** "Bạn còn 12 phút trước lịch tiếp
  theo" → chỉ mời bài *vừa khít*. Không dụ bắt đầu thứ không kịp xong.
- **Bài mở bằng câu cuối — T3.** Cho xem *câu kết* trước, rồi mời đọc để hiểu
  vì sao nó tới đó. Priming ngược.
- **Nghi thức mở — T3 → T5.** Beat lặng bắt buộc (~2s, hairline khép rồi mở)
  trước khi bài hiện — tách "lướt web" khỏi "ngồi đọc".

### TRONG
- **Bản đồ luận điểm ở lề — T2.** Sơ đồ hairline thu nhỏ: bạn đang ở nhánh
  nào của lập luận (bài tech/triết). Austere boxes, không màu.
- **Chú thích trì hoãn — T3.** Footnote chỉ mở *sau khi đọc hết đoạn* — chống
  nhảy cóc phá mạch.
- **Đọc mù / progressive reveal — T3 → T5.** Đoạn sau ẩn tới khi câu hiện tại
  xong. Ép ở-lại-với-một-ý. *Defense:* chỉ bài tác giả đánh dấu, có tắt.
- **Trọng lượng câu — T2.** Câu "nặng" hiện đậm hơn *một micro-nấc* (weight,
  không bold) — mắt tự chậm đúng chỗ.
- **Neo quay-lui không mất chỗ — T2.** "Cửa sổ ký ức" giữ nguyên vị trí đang
  đọc khi tra lại đoạn trên; thả ra là về. Chống lạc chỗ khi cuộn ngược.
- **Chú giải của reader trước — T3 → T4.** Ghi chú vô danh của người đọc
  trước tại đúng câu (opt-in, counts + text ngắn). Như sách cũ có ghi bên lề.
  *Defense:* không reply, không chronology.
- **Mạch cảm xúc — T3.** Ribbon hairline ở gutter: đoạn sắp tới *căng / lặng
  / bước ngoặt*. Tác giả gieo.
- **Đọc-to trong đầu — T5.** Đặt nhịp: từng câu hiện theo tốc độ đọc-thầm tự
  nhiên của bạn (đo cục bộ), tắt cuộn tay. Trị thói lướt.

### SAU
- **Câu hỏi nảy ra — T4 → T5.** Cuối bài hỏi "*câu hỏi nào bài này để lại
  trong bạn?*" → trang "những câu hỏi tôi mang theo" của riêng reader. Bản
  sắc *người đang nghĩ*.
- **Ủ men — T5.** Bài quan trọng khóa nhẹ bình luận/tóm tắt trong 24h: "ngủ
  một đêm đã". *Diagnostic:* chất lượng câu tóm sau 24h so với ngay lập tức?
- **Bản đọc gộp một chủ đề — T4.** Đọc hết 3–4 bài cùng mạch → dệt phần bạn
  gạch chân thành một *tiểu luận của chính bạn*, typeset như essay.
- **Đối thoại hai bài — T4 → T5.** Ghép bài vừa đọc với một bài bạn *từng
  đọc* mâu thuẫn/bổ sung → thấy hai giọng (hoặc chính mình lúc trước) cãi nhau.
- **Bản tóm của chính bạn — T4.** Reader viết một câu tóm; đặt cạnh "one
  sentence" của tác giả; giữ cả hai. Đo khoảng cách điều-muốn-nói vs
  điều-mang-đi.
- **Đọc lại theo mùa — T5.** Đúng một năm sau: "bạn đọc bài này một năm
  trước — đọc lại nhé?" kèm lớp gạch-chân cũ.
- **Thư gửi bạn-của-6-tháng-sau — T5.** _(đã ở phần Sau bên trên; nhắc lại
  như một cặp với "đọc lại theo mùa".)_

### XUYÊN SUỐT
- **Tốc độ trung thực — T3.** Cuộn quá nhanh → hỏi thẳng "lướt hay đọc?", ghi
  thành thật vào receipt. Chống tự-lừa "đã đọc".
- **Chế độ giấy — T5.** Xuất bài thành sheet in đẹp để đọc *rời màn hình*.
  Đổi hành vi screen → giấy.
- **Không-nơi-nào-khác — T5.** Không share button, không footer, không "đọc
  tiếp"; hết bài là hết. Đối nghịch trực tiếp thiết kế giữ-chân.
- **Trí nhớ đọc dài hạn — T5.** Sau một năm, trang lặng "cách đọc của bạn đã
  đổi" — không stats, chỉ những câu bạn từng giữ, xếp cạnh nhau cho *bạn* tự
  thấy.
- **Chế độ khiếm thị / mỏi mắt — T1 → T2.** Đọc bằng tai + tương phản cực cao
  + type khổng lồ, giữ nguyên hairline vocabulary. Thiếu → loại hẳn một nhóm
  reader.

---

## Batch III — mở rộng (cơ thể · quên · ngôn ngữ · lỗi đọc · tái-nhập)

### TRƯỚC
- **Giá nhận thức thật — T2 → T3.** Không chỉ "12 phút" mà *loại* mệt: "bài
  này tốn trí nhớ làm việc" / "tốn cảm xúc" / "đọc lướt được". Reader chọn khi
  còn *đủ pin đúng loại*. *Test:* completion cao hơn khi khớp loại-mệt?
- **Câu mồi của chính bạn — T4 → T5.** Trước khi mở, reader gõ một câu *mình
  đang tin* về chủ đề. Cuối bài câu đó hiện lại để đối chiếu. Priming từ
  chính niềm tin của reader, không phải câu hỏi tác giả. *Test:* reader sửa
  lại câu của mình?
- **Không giới thiệu tác giả — T3 (biên tập).** Vài bài giấu tên/bio tới tận
  cuối: reader gặp *ý* trước khi gặp *thẩm quyền*. Chống đọc-theo-uy-tín.
- **Chọn độ dài của chính bài — T4.** Một bài, ba độ sâu (cốt / thường / có
  chú giải mở rộng) do tác giả dựng sẵn; reader chọn *bây giờ tôi cần bao
  nhiêu*. Không phải TL;DR máy tóm — là ba bản viết tay.

### TRONG
- **Mỏ neo cho chỗ vấp — T3.** Khi reader dừng lâu bất thường ở một câu (đo
  cục bộ), lề lặng lẽ hiện một *cách nói lại* câu đó — không phải định nghĩa,
  là paraphrase. Tắt được. *Defense:* chỉ khi thật sự khựng, không bật bừa.
- **Đọc theo hơi thở — T5 (vô hình).** Ở đoạn tác giả đánh dấu "chậm", nhịp
  hiện chữ khớp một chu kỳ thở ~5.5s. Cơ thể chậm lại thì đầu chậm theo.
  *Test:* nhịp tim/độ mỏi giảm ở đoạn dài? (đo cục bộ, opt-in).
- **Đánh dấu bằng cách gạch, không nút — T2.** Bôi chọn câu = gạch chân ink,
  không popover toolbar. Cử chỉ giống cầm bút thật, không giống app. Giảm ma
  sát giữa *muốn giữ* và *giữ được*.
- **Lề cho bản dịch — T3 → T4 (tiếng Việt).** Bài song ngữ: câu gốc nằm mờ ở
  lề đúng dòng đang đọc; chạm để hiện. Đọc bản dịch mà không mất bản gốc.
- **Chỗ này tôi từng bỏ cuộc — T3 + tín hiệu tác giả.** Nếu lần trước reader
  thoát ở đây, lần này một dấu lặng "bạn dừng ở đây lần trước — đi tiếp nhé".
  Với tác giả: bản đồ vách đá bỏ cuộc. Counts only.
- **Câu dội lại — T3.** Reader chạm hai lần vào một câu để "giữ vang" — nó
  ghim mờ ở đáy màn hình vài đoạn tiếp, rồi tự tan. Giữ một ý trong tầm mắt
  trong lúc đọc tiếp, không cần cuộn lui.

### SAU
- **Đường cong quên — T5.** Thay vì lặp lại cùng một câu (spaced repetition
  cứng), site theo dõi câu nào reader *thật sự* quên (đoán sai khi được nhắc
  mờ) và chỉ trả lại *những câu đó*. Cá nhân hoá theo trí nhớ thật.
- **Bạn đã hiểu sai điều gì — T4 → T5.** Nếu "câu mồi" đầu bài mâu thuẫn với
  điều bài nói, cuối bài chỉ ra *khoảng lệch* một cách lặng — không "sai rồi",
  mà "bạn vào với X, bài nói Y". Học từ chính hiểu lầm của mình.
- **Trích cho một người — T4.** Reader chọn một câu để *gửi tặng đúng một
  người* (không phải share công khai). Đọc để cho đi, không để phát tán.
  *Defense:* một người, một câu, không đếm lượt, không public.
- **Cái bạn không gạch chân — T5.** Sau nhiều bài, trang lặng cho thấy *chủ
  đề reader luôn lướt qua* — vùng mù của chính mình. Chân dung bằng khoảng
  trống, không bằng highlight.
- **Đọc xong để yên — T3.** Nút duy nhất cuối bài là "đóng lại" (không share,
  không tiếp theo) — và nó *chào* reader bằng một dòng lặng. Kết thúc như một
  hành vi có phẩm giá, không phải cụt.

### XUYÊN SUỐT
- **Sổ hiểu lầm — T4 → T5.** Mọi "bạn đã hiểu sai" gom thành một cuốn riêng
  tư: lịch sử các lần mình đọc lệch. Hiếm ai giữ được thứ này — nó là *bản
  sắc người học*, không phải thành tích.
- **Ngân sách chú ý tuần — T3 → T5.** Reader tự đặt "tuần này tôi cho việc
  đọc N giờ"; site *bảo vệ* ngân sách đó (từ chối dụ thêm khi đã hết), không
  phải tối đa hoá. Đối nghịch mọi metric giữ-chân.
- **Không đề xuất khi mệt — T2 → T3.** Nếu tín hiệu cục bộ cho thấy reader
  đang đọc kiệt (lướt nhanh, quay lại nhiều), site *ngừng* mời bài mới thay vì
  đẩy thêm. Thiết kế biết lúc nên im.
- **Diacritic tiếng Việt như chữ nhạng nhất — T1 → T2.** Dấu không bao giờ
  chồng dòng, không cắt; chọn khoảng dòng theo chiều cao dấu, không theo Latin
  mặc định. Thiếu → tiếng Việt luôn đọc như công dân hạng hai.

## Batch IV — sáng tạo & micro-interaction (chạm · sống động · gắn kết)

_Đợt này nghiêng về *cảm giác vật lý* của việc đọc và những vi-tương tác nhỏ
làm trang "sống". Vẫn kỷ luật: cơ chế · tầng · test · defense. Micro-interaction
luôn opt-out được và tôn trọng `prefers-reduced-motion`._

### TRƯỚC
- **Bìa tự se lại theo giờ — T3 (micro).** Ảnh/màu đầu bài dịch nhiệt độ nhẹ
  theo giờ thật của người đọc (sáng mát, tối ấm) — chỉ ~3–5% hue, gần như
  không thấy. *Cơ chế:* khớp bài với thời khắc cơ thể. *Defense:* không đổi
  nội dung, chỉ ánh sáng; tắt được.
- **Câu đầu gõ ra — T2 → T3 (micro).** Dòng đầu tiên của bài "gõ" ra trong
  ~600ms khi vào viewport lần đầu (một lần, không lặp), như ai đó vừa viết
  cho bạn. *Test:* thời gian tới-chữ-đầu-tiên có tăng attention? *Defense:*
  chỉ câu đầu, chỉ lần đầu; reduced-motion → hiện thẳng.
- **Cửa "một câu" — T4.** Trước khi mở, chỉ hiện *một câu* rút từ giữa bài
  (không phải mở đầu, không spoiler) + hai nút: "mở ra" / "để dịp khác". Nếm
  giọng trước khi cam kết. *Defense:* câu do tác giả chọn, không phải máy.

### TRONG
- **Lề tự thở khi bạn dừng — T3 (micro).** Khi mắt dừng lâu ở một đoạn (đo cục
  bộ), lề trắng hai bên *giãn ra ~8px* rất chậm — trang "nhường chỗ" cho suy
  nghĩ. Rời đi thì thu lại. *Cơ chế:* không gian vật lý phản hồi sự chú tâm.
- **Chữ có trọng lực nhẹ — T2 (micro).** Cuộn nhanh → dòng vừa vào hơi trễ
  một nhịp (~40ms stagger) rồi "đậu" xuống; cuộn chậm thì không. Cảm giác chữ
  có khối lượng. *Defense:* cực nhẹ, tắt theo reduced-motion.
- **Dấu ngón tay — T3 → T4.** Chạm/nhấp giữ vào một câu để lại một *vệt mờ ấm*
  ở lề (như dấu ngón tay trên giấy) — không phải highlight, chỉ "tôi đã ở đây".
  Phai dần qua nhiều lần đọc. *Defense:* riêng tư, không đếm, không share.
- **Chú thích nở tại chỗ — T2 (micro).** Chú giải/nguồn không mở popover che
  chữ — nó *đẩy dòng giãn ra* và mọc vào giữa văn bản, đọc xong thu lại. Không
  mất ngữ cảnh, không nhảy trang.
- **Tiếng giấy tùy chọn — T5 (đa giác quan).** Bật được: một *tiếng lật rất
  khẽ* khi sang "màn" trong bài dài, âm lượng gần ngưỡng nghe. Mặc định TẮT.
  *Defense:* opt-in tuyệt đối, một công tắc, không bao giờ tự bật.

### SAU
- **Câu cuối ở lại — T3 → T4 (micro).** Khi chạm dòng cuối, câu kết *giữ lại
  một nhịp* rồi phần còn lại của trang mới lặng xuống — cho câu cuối một khoảng
  vang. Không CTA chen vào khoảnh khắc đó.
- **Dư chấn 3 giây — T4.** Sau khi đọc xong, màn hình *trống trong 3 giây* với
  đúng một câu bạn đã gạch chân, trước khi cho đi tiếp. Ép một nhịp tiêu hoá.
  *Defense:* bỏ qua được bằng một cú chạm; không bắt buộc.
- **Trồng một hạt — T5.** Đọc xong, một hạt/nét mực nhỏ được "trồng" vào một
  *khu vườn cá nhân* lặng — nhiều bài thành một vườn nét mực (không phải điểm,
  không phải cây level-up). Chân dung bằng hình, không bằng số. *Defense:*
  không so sánh, không leaderboard, chỉ mình bạn thấy.

### XUYÊN SUỐT / MICRO
- **Con trỏ biết nó ở đâu — T2 (micro).** Con trỏ chuột đổi hình rất tinh theo
  ngữ cảnh: vùng chữ → dạng "đọc", vùng ảnh → dạng "ngắm", link → mũi tên ink.
  Tín hiệu không lời về việc bạn đang chạm gì.
- **Chuyển trang như lật, không như tải — T3.** Điều hướng giữa bài dùng một
  chuyển cảnh *ngang mảnh* (như lật trang), không fade trắng kiểu web. Giữ ảo
  giác "một cuốn sách", không phải "nhiều tab". *Defense:* nhanh (<250ms), bỏ
  theo reduced-motion.
- **Tiêu đề nhớ bạn — T4 (micro).** Bài đang-đọc-dở, lần sau quay lại, tiêu đề
  trên listing có một *dấu gạch bút chì mờ* ở mép — dấu tay của chính bạn, không
  phải badge "continue". *Defense:* dấu chữ/nét, không số %, không "resume".
- **Đọc đôi — T5 (xã hội-riêng-tư).** Hẹn đọc *cùng lúc* với đúng một người
  (không chat, không con trỏ của nhau) — chỉ biết "có một người khác đang ở
  trong trang này ngay bây giờ". Hiện diện, không tương tác. *Defense:* một
  người, opt-in cả hai phía, không lịch sử, không thấy họ đọc tới đâu.

---

## Batch V — thời hạn của sự thật & đọc phản biện (hết hạn · bất đồng · dấu sửa)

_Đợt này đến từ bài TOCTOU: mọi bài viết là một **ảnh chụp** của điều tác giả tin
vào một thời điểm, và không ai ghi ra nó còn đúng trong bao lâu. Cả batch là một
câu hỏi: nếu văn bản có tuổi, và người đọc có quyền không đồng ý, thì giao diện
phải trông như thế nào._

### TRƯỚC
- **Hạn dùng khai báo — T3 → T4.** Mỗi bài tự khai một *thời hạn hiệu lực* thật
  (bài triết: không hạn; bài về giá cả một dịch vụ: 6 tháng), hiện trong khối
  thời tiết. Không phải "cập nhật lần cuối" — là *dự đoán của tác giả về độ bền
  của chính mình*. *Test:* reader tin bài mới hơn, và tin *đúng chỗ*?
- **Bài này viết trước gì — T2 → T3.** Một dòng MONO: "viết trước khi X xảy ra".
  Đặt bài vào dòng thời gian mà nó không biết. *Defense:* chỉ khi có một sự kiện
  thật làm bài lệch, không tự sinh.
- **Độ tươi theo từng phần — T4.** Không đánh dấu cả bài là cũ; tag hairline ở
  cấp *mục*: phần khái niệm còn nguyên, phần số liệu đã hết hạn. Cũ đi không đều.
- **Bài đã đổi kể từ lần bạn mở dở — T5.** Nếu reader từng bỏ dở, khi quay lại
  site nói thẳng đoạn nào đã bị sửa từ lúc đó. Nối với reading-cursor + memory.

### TRONG
- **Dấu "mình không tin câu này" — T3 → T4.** ✓ gộp vào The Mark (m0016, gesture
  `dissent`). Song sinh của highlight, nhưng
  ngược dấu: gạch *phản đối*. Ký hiệu khác (gạch đôi ink, không phải dải sáng).
  Với reader: chỗ mình còn nợ một suy nghĩ. Với tác giả: counts only.
  *Diagnostic:* reader quay lại chỗ mình phản đối, không chỉ đánh dấu rồi bỏ?
- **Độ chắc của tác giả trên từng luận điểm — T3.** Mỗi claim lớn mang một mức
  nhỏ: `chắc` / `nghĩ vậy` / `đang đoán`. Đọc một bài không còn là đọc một khối
  đồng nhất về độ tự tin. *Defense:* tác giả gieo tay, tối đa vài chỗ mỗi bài.
- **Chứng cứ mở tại chỗ — T2 → T3.** Sidenote nguồn không dẫn ra ngoài mà *mở
  đúng câu được trích* trong lề. Kiểm chứng không tốn một lần rời trang.
- **Link đã chết, nói thật — T2.** Nguồn 404 thì hiện là 404, kèm bản lưu. Thà
  một vết mục lộ thiên hơn một link giả vờ còn sống.
- **Câu đang tranh chấp — T4.** Câu nào bị nhiều reader phản đối nhất hiện một
  vết mờ *sau khi reader đọc xong* (không trước). Đám đông chỉ được nói sau.

### SAU
- **Điều mình từng tin ở đây — T5.** ✓ bề mặt đã chốt trong The Mark (m0016,
  gesture `belief`). Cuối bài, reader ghi một câu về việc mình
  *đang tin gì*; sáu tháng sau site trả lại kèm bản bài đã sửa. Đo chuyển động
  của chính mình, không phải của bài. *Test:* reader đọc lại thư và sửa nó?
- **Sổ đối chất — T4 → T5.** Mọi dấu phản đối gom thành một cuốn riêng tư, song
  sinh với commonplace: một cuốn giữ câu mình đồng ý, một cuốn giữ câu mình
  không. Cả hai đều in được, cùng grid.
- **Diff dành cho người đọc — T4.** Không phải git log. Một bản kể lại: "đoạn về
  Y đã bị viết lại vì mình sai", typeset như văn, không như commit.
- **Bài này đã cũ đi bao nhiêu kể từ lần bạn đọc — T5.** Một dòng lặng khi quay
  lại: bao nhiêu phần đã hết hạn, bao nhiêu còn nguyên.

### XUYÊN SUỐT
- **Changelog là một phần của văn bản — T4 (bản sắc).** Vết sửa không bị nhét
  xuống chân trang; nó nằm trong bài như một lớp có thể bật/tắt. "A notebook,
  kept in public" nghĩa là *cả những chỗ đã gạch*.
- **Không bao giờ sửa lặng — T4 (nguyên tắc).** Mọi sửa nội dung để lại dấu.
  Chỉ sửa chính tả là được im.
- **Hợp đồng hai chiều — T5.** Bài khai thời hạn của mình; reader khai mình đọc
  nó lúc nào. Cả hai được ghi vào receipt, nên một lần đọc luôn có *thời điểm*.

---

## Batch VI — đọc ngoài màn hình (in · nghe · mất mạng · e-ink · trong túi)

_Mọi thứ trên đây giả định một người ngồi trước một màn hình sáng, có mạng, rảnh
tay. Batch này bỏ từng giả định đó ra một lần một. Nguyên tắc: cùng một bài, cùng
một grid, khác vật liệu — không phải một phiên bản rút gọn._

### TRƯỚC
- **Ấn bản một-bài — T4 (bản sắc).** Bất kỳ bài nào cũng in ra được thành một
  *cahier* nhỏ, tự đóng, có bìa xanh và số Nº. Không phải "print stylesheet" —
  là một vật. *Test:* có ai in thật và giữ lại?
- **Gói mang đi — T3 → T4.** Trước một chuyến đi hoặc trước khi mất mạng, reader
  chọn vài bài và site đóng thành một gói đọc offline, kèm chú thích và nguồn đã
  lưu. *Defense:* không tự tải nền, reader chọn tay.
- **Khổ trong túi — T3.** Một chế độ khổ dọc rất hẹp, cỡ lòng bàn tay, cho đọc
  khi đứng, một tay, trên xe. Cột hẹp lại, nhịp đoạn ngắn hơn, chú thích gập vào.
- **Bài này nghe được không — T2.** Khai thật ngay đầu: bài có công thức, sơ đồ,
  code thì *không* nghe được tử tế. Đừng hứa audio cho thứ phải nhìn.

### TRONG
- **Bản đọc-ra-tiếng theo nhịp tác giả — T4 → T5.** Không phải TTS đọc trơn: dấu
  ngắt của tác giả (`❧`, "dừng một nhịp", nhấn nhá) được tôn trọng khi đọc thành
  tiếng. Bài nghe *có nhịp của người viết*. *Diagnostic:* reader nghe hết một bài
  dài mà không tăng tốc lên 2x?
- **Nghe rồi đọc tiếp bằng mắt — T5.** Vị trí đọc là *một* thứ dùng chung giữa
  tai và mắt: nghe trên đường, mở laptop, con trỏ đọc đúng ở câu vừa nghe xong.
- **Chế độ e-ink — T2.** Bỏ toàn bộ chuyển động, dải sáng thành viền, tương phản
  thuần đen trắng, không hover. Grid vẫn nguyên. Máy đọc sách là công dân hạng nhất.
- **Chế độ nắng — T2 (micro).** Ngoài trời: tương phản cực đại, chữ dày hơn một
  nhịp, mọi màu xám bỏ đi. Không phải dark-mode ngược, là *legibility mode*.
- **Mất mạng giữa bài — T2.** Bài đã mở thì đọc được đến hết, kể cả khi mạng
  chết giữa đường. Chú thích, sơ đồ, nguồn đã lưu đi cùng. Không màn hình lỗi.

### SAU
- **Trích dẫn mang gốc theo — T3 → T4.** Copy một đoạn ra ngoài (Slack, Obsidian,
  giấy) thì tự mang theo nguồn, ngày, và *thời hạn hiệu lực* của bài. Câu ra khỏi
  trang mà không mất lịch sử. *Defense:* ngắn gọn, một dòng, không banner quảng cáo.
- **Bưu thiếp một câu — T3.** Một câu đã giữ, typeset đúng Ink Edition, xuất ra
  ảnh/khổ in nhỏ. Vật để gửi, không phải để share lấy tương tác.
- **Kệ in được của tháng — T4.** Commonplace + kệ-đã-đọc gộp thành một tay sách
  mỏng mỗi tháng, đánh số như một tạp chí thật. Nối với Vault.
- **Đọc xong khi không có mạng thì tính sau — T2.** Receipt ghi cục bộ, đồng bộ
  khi có mạng lại, không mất một lần đọc thật nào.

### XUYÊN SUỐT
- **Một bài, nhiều vật liệu — T4 (nguyên tắc).** Màn hình, giấy, tai, e-ink là
  bốn *ấn bản* của cùng một văn bản, không phải bốn mức độ đầy đủ. Cắt gì thì
  phải nói ra.
- **Không có tính năng nào bắt buộc phải online — T2.** Đọc là hành vi mặc định
  offline; mạng chỉ để đồng bộ và để lấy bài mới.
- **In là kiểm tra chất lượng cuối — T4 (kỷ luật).** Nếu một trang in ra trông
  sai, tức là hệ grid đang sai, chỉ màn hình che giúp. In trước khi phát hành.

---

## Bản đồ tầng (đọc-xuống = đòn bẩy tăng)

| Phase | T2 (nền) | T3 (delight) | T4 (bản sắc) | T5 (biến đổi) |
|---|---|---|---|---|
| Trước | thời tiết bài · độ ồn · typography | cold open · cửa-tâm-trạng | bản nháp lộ thiên | hẹn giờ đọc |
| Trong | một-dòng-sáng · con trỏ · sức nặng còn lại | lạc-ở-đây · nhịp thở · nhấn nhá | — | type-thở · lớp đọc-lại · tạm dừng |
| Sau | — | dư âm · anti-recommend | commonplace · kệ-đã-đọc | câu-sẽ-quên · thư-tương-lai |
| Xuyên suốt | typo controls · độ khó | hợp đồng yên tĩnh | ★ the mark | ★ bracketed question · hồ sơ nhịp đọc |

## Kỷ luật SFIM khi build
- **Tier = cơ chế, không phải magnitude.** Một "một-dòng-sáng" làm rất đẹp
  vẫn là T2.
- **Tính năng trôi xuống theo thời gian** (T3 → T1 khi thành kỳ vọng). Giữ
  portfolio T3 luân phiên; đừng tưởng đã "xong".
- **T5 không thiết kế trực tiếp** — hỏi "job đọc nào đang làm kém?" rồi giải
  triệt để. Test bắt buộc: có tác động *ngoài* một lần đọc không?
- **Mọi món có defense** chống trôi về trò rẻ tiền (gamify, engagement bait,
  named social proof). Nếu mất defense → nó tụt tầng.
