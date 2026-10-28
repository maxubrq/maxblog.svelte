# DESIGN.md — maxubrq, bản đọc

Tài liệu giao việc cho người sửa. Hội đồng: **Vignelli** (lưới, chữ, hệ thống, kỷ luật hình thức) và **Reichenstein** (đọc, kiến trúc thông tin, cắt tính năng). Mọi phần về màn hình đều là **ngoại suy** từ nguyên tắc: Vignelli chưa từng thiết kế cho web.

Số liệu đo ngày 2026-10-28:
- Lượt 1: `/en/writing/005-distributed-system-vocabulary-en`, desktop 1512 px, chế độ tối.
- Lượt 2: `/vi/writing/007-su-tu-tin-duoc-luu-o-dau-vi` và `/vi`, desktop 1512 px **và mobile 390 px** (đo trong iframe 390 × 780), chế độ sáng; tương phản đo bằng công thức WCAG trên giá trị token đã tính. Lượt 2 sửa một khẳng định sai của lượt 1 (D10) và thêm D13–D16.

---

## 0. Việc chính

> **Một người mở một bài luận và đọc hết nó, không bị gián đoạn.**

Mọi thứ bên dưới được xét bằng câu này. Thứ gì không giúp đọc, không giúp tìm bài để đọc, hoặc không giúp quay lại bài đang đọc dở thì bỏ, hoặc dời ra khỏi đường đọc.

Phán tổng thể (Vignelli): nền móng đúng. Rule 1,5 px đen đậm, hình chữ nhật, một màu xanh tín hiệu, ảnh halftone một màu: đây là cùng ngôn ngữ với sáu ảnh trong `inspiration/` (RM Neue, Aeonik, RM Pro xanh). **Giữ.** Chỗ hỏng không ở hình thức, mà ở **số lượng**: quá nhiều thứ cùng nói.

Phán tổng thể (Reichenstein): bài viết là sản phẩm, còn trang đang giống một công cụ có 11 cài đặt, 24 cỡ chữ và 15 bộ phận phụ quanh một cột chữ. Dao Thụy Sĩ. Cần dao mổ.

---

## 1. Chẩn đoán, có số

| #   | Đo được                                                                                                                                                                                                                                                     | Vì sao hại người đọc                                                                                                                                                                                                                                                       |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | **24 cỡ chữ khác nhau** trên một trang bài (1, 9, 9.5, 10, 10.5, 11 … 58 px). Trong `src` có 50 chỗ 10 px, 46 chỗ 11 px, 35 chỗ 10.5 px, 15 chỗ 9 px                                                                                                        | Không có thang. Mắt không biết cái nào quan trọng hơn. Vignelli: tối đa hai cỡ mỗi trang.                                                                                                                                                                                  |
| D2  | **Nhãn mono in hoa 9–11 px, giãn chữ 0,14 em** là "công cụ chủ lực" (68 file dùng mono). Tag, nav, "READ TIME", "LOAD", "CHAPTER V", fore-edge                                                                                                              | Dưới 12 px, in hoa, giãn chữ, màu `--muted` trên nền tối: khó đọc nhất ở đúng chỗ người đọc cần định hướng. Tiếng Việt có dấu in hoa mono ở 10 px dễ vỡ.                                                                                                                   |
| D3  | **Ba họ chữ** (Space Grotesk, IBM Plex Sans, IBM Plex Mono) + một tùy chọn serif + KaTeX                                                                                                                                                                    | Ba giọng, ba webfont tải từ Google.                                                                                                                                                                                                                                             |
| D4  | `h1–h4 { text-transform: lowercase }` toàn cục                                                                                                                                                                                                              | Tên riêng và từ viết tắt bị xóa: "Linearizability" thành "linearizability", "AI", "SP", "Seven Years in Software". Danh sách trang chủ viết hoa đúng, tít lại viết thường, nên cùng một bài có hai dạng. Thô tục về nghĩa, tốn thực tế: người đọc không nhận ra thuật ngữ. |
| D5  | **11 tùy chọn đọc**: theme (3) + theme tự động theo giờ, layout, framing (3), mode, ruler, timeLeft, cỡ chữ, giãn dòng, độ rộng cột (3), typeface. Hai nơi để sửa (menu đầu trang và `/reading` 563 dòng)                                                   | Mỗi cài đặt là một quyết định mà tác giả chưa chịu làm. Người đọc blog không muốn cấu hình blog.                                                                                                                                                                           |
| D6  | Cột chữ **820 px ở 18 px ≈ 100 ký tự mỗi dòng** (dòng "Linearizability is a strong consistency property…" dài 103 ký tự)                                                                                                                                    | Quá rộng. Mắt lạc dòng khi quay về đầu dòng tiếp theo. Đích: 65–75 ký tự (≈ 680 px ở 18 px). Tiếng Việt từ ngắn, kiểm bằng bài thật.                                                                                                                                       |
| D7  | Đầu bài, trước chữ đầu tiên: tag row, tít 58 px, phụ đề, rule, **hộp "Thời tiết" 4 ô**, rồi mới tới đoạn đầu. Nếu đã đọc dở: thêm dải xanh "You were here"; nếu thuộc loạt: thêm ribbon                                                                     | Ba đến năm lớp đứng giữa người đọc và câu đầu tiên. Màn hình đầu tiên 795 px cao **không có một dòng thân bài nào**.                                                                                                                                                       |
| D8  | Quanh cột chữ: fore-edge (thanh ~180 vạch + "CONTENTS" xoay dọc + "22 min left"), running head xoay dọc trong số La Mã ở mép phải (`I`, `II`), con trỏ đọc `ReadingRuler` (tắt mặc định), ghim reading-memory bên lề, số hiệu `[01]`, bút đánh dấu rough.js | Năm bộ phận cùng tranh mép màn hình. Số La Mã "folio" là ẩn dụ sách, không phải thông tin: người đọc không dùng nó để làm gì.                                                                                                                                              |
| D9  | Sau bài: OneSentence, Glossary, Bibliography, ReflectionPrompt (hộp thư), Neighbourhood, rồi footer                                                                                                                                                         | Sáu khối, mỗi khối một kiểu khung. Bài kết thúc bằng một dấu ■, rồi tiếp tục thêm sáu thứ.                                                                                                                                                                                 |
| D10 | Nav 7 mục + search + ngôn ngữ + cài đặt = **10 mục** ở đầu trang. Cả 7 trang đều đã có nội dung thật (lượt 2 kiểm: không trang nào còn render `Placeholder`; comment "four of them are still placeholder rooms" trong `+layout.svelte` đã cũ, xóa đi)                                                                            | Blog có 4–5 bài mỗi locale. Mười mục chrome cho năm bài: điều hướng nặng hơn nội dung nó dẫn tới.                                                                                                                                                                                         |
| D11 | Trang chủ: khối "Pick up where you left off" + masthead 72 px + featured + recent. Số "01" 44 px mono xanh trên bài nổi bật, rồi danh sách recent bắt đầu từ "02"                                                                                           | Số thứ tự không mang nghĩa: bài mới nhất không phải "01 của gì". Ba cấp tít (72 / 44 / 34 px) cạnh nhau.                                                                                                                                                                   |
| D12 | Tương phản đo được. Sáng: `--ink` 14,73:1, `--muted` 5,05:1, **`--faint` 2,29:1**. Tối: `--muted` 5,74:1, **`--faint` 3,02:1**. Ngưỡng AA chữ nhỏ là 4,5:1                                                                                                                                                       | Thân bài và `--muted` đạt. `--faint` trượt AA ở cả hai theme, mà nó đang tô chữ (nhãn ô trống của hộp Thời tiết, ô vuông độ khó). Bỏ token này (mục 3.5).                                                                                                                                                                                                                                  |
| D13 | **Mobile 390 px, trang bài:** header cao **126 px** (ba hàng: wordmark + công cụ, rồi nav 7 mục gãy hai dòng), dính trên đầu. Câu đầu thân bài bắt đầu ở **y = 678 px** trên khung 780 px: chỉ thấy khoảng 3 dòng. | 126 px là 16% màn hình bị giữ vĩnh viễn trong suốt bài. Màn hình đầu là chrome, tag, tít, rule, hộp Thời tiết; chữ của bài là thứ cuối cùng. |
| D14 | **Tràn ngang trên mobile:** `scrollWidth` 409 px ở khung 390 px, tức thừa 19 px. Trang chủ thì không (390). | Trang bài lắc ngang khi vuốt. Lỗi thật, không phải gu. Nghi phạm: dải fore-edge ở mép phải hoặc khung `card` lùi −20 px; người sửa xác nhận bằng cách tắt từng cái. |
| D15 | **Thân bài mobile 17 px** (`PostBody.svelte`, `@media (max-width: 720px)`), nhỏ hơn desktop 18 px. | Điện thoại cầm gần hơn, nhưng màn hình nhỏ và đọc trong điều kiện xấu hơn. 17 px vẫn ≥ 16, nhưng mục 6.8 chốt **18** cho mọi khổ: một cỡ thân, không đổi. |
| D16 | **Ba chi tiết trang trí đè lên chữ:** (a) chữ hoa thả màu xanh (drop cap) ở đoạn đầu mọi bài; (b) vòng `scribble` quanh chữ nhấn của masthead đè lên chữ đứng trước ("thấy" bị cắt bởi vòng quanh "thú vị", ở 390 px); (c) "Tail Amplification · 72% · 0 phút còn lại": làm tròn `reading × (1 − progress)` của bài ngắn ra 0 phút trong khi mới đọc 72%. | (a) Màu xanh dùng làm trang trí, trái quy tắc màu 3.1, và với chữ Việt có dấu (Đ, Ở, Ư…) chữ thả là chỗ dễ vỡ. (b) Trang trí che chữ là chữ không đọc được. (c) Một con số nói dối người đọc. |

---

## 2. Nguyên tắc cắt

1. **Mặc định mạnh thay cài đặt.** Mỗi cài đặt phải trả lời được: _vì sao mình không chọn được thay người đọc?_ Nếu không trả lời được, cài đặt đó bị bỏ.
2. **Thang chữ có sẵn, không thêm cỡ lẻ.** Cỡ mới phải được viết vào bảng 3.2 trước khi dùng.
3. **Cấu trúc thông tin trước hình thức.** Bài là chữ thật, xếp theo thứ tự đọc: tít, một câu, thân bài. Mọi thứ khác đứng sau thân bài hoặc ngoài lề, không đứng trước.
4. **Tính năng chưa đủ tốt: giữ lại, không phơi ra.** Tính năng ghi nhớ vị trí, bút đánh dấu, "bầu trời đọc" đều là việc nghiêm túc, nhưng không phải việc chính.
5. **Hiển thị trạng thái thật.** Không có phòng rỗng trong nav. Không có số La Mã.

Luật xung đột (Tiêu chuẩn A10): khi nhận diện hình thức (Vignelli) cản việc đọc (Reichenstein), việc đọc thắng. Ví dụ: chữ in hoa giãn chữ đẹp trên lưới, nhưng 10 px không đọc được, thì bỏ.

---

## 3. Hệ thống

### 3.1 Giữ nguyên (đúng ngôn ngữ, đúng inspiration)

- Rule **1,5 px `--rule-hard`** chia phần lớn; **1 px `--rule`** chia mục. Chữ treo từ rule phía trên.
- Hình chữ nhật, `border-radius: 0`.
- **Một** màu tín hiệu: xanh `#1a24df` (sáng `#7f88ff` ở nền tối). Màu chỉ dùng cho: liên kết, trạng thái đang chọn, dấu tín hiệu. Không dùng cho trang trí, số thứ tự, hay tít.
- Ảnh halftone một màu theo theme (`.ink-screen`).
- Nền giấy `#fafaf7` / mực `#24242c`. Giữ. Kiểm bằng sách: so với một cuốn sách mở cạnh màn hình.
- Chế độ tối giữ cấu trúc, chỉ đổi giá trị (đã làm đúng).

### 3.2 Thang chữ — một bảng, bốn dòng

**Một họ chữ: CDA Independence** (`fonts/CDA Independence/`), thay IBM Plex Sans và Space Grotesk. Mono chỉ cho code: **Monaspace Xenon** (xem 3.2.1), thay IBM Plex Mono (CDA không có mono). Bỏ serif tùy chọn. KaTeX giữ vì toán cần.

**Phán quyết của hội đồng: dùng CDA Independence.** Đã thử trên trình duyệt cạnh IBM Plex Sans, ở 18 px, nền tối, tiếng Anh và tiếng Việt. Lý do, bằng số và bằng phần tử:

1. **Dấu tiếng Việt đủ.** Kiểm bằng `fontTools` trên bốn file (Text, Deck, Display, Variable): không thiếu chữ có dấu nào (hoa và thường, gồm Ơ, Ư, Đ và mọi tổ hợp ắ ằ ẳ ẵ ặ ề ế ể ễ ệ ộ ổ ỗ ờ ớ ở ỡ ợ ừ ứ ử ữ ự). Dấu nằm gọn ở leading 1.62. Đây là điều kiện loại trừ, và nó đạt.
2. **Hẹp hơn Plex khoảng 5%.** Cùng một câu 18 px: Plex 746 px, CDA Text 709 px. Cột 680 px chứa nhiều ký tự hơn (≈ 75), nên mục 3.3 đạt cận trên của đích 65–75; đo lại bằng bài thật.
3. **Có tông riêng mà vẫn đọc được.** Nét loe nhẹ ở đầu và chân nét, lấy từ mặt tiền Dinh Độc Lập. Ở cỡ thân vẫn là sans nhân văn, không sa vào trang trí. Đây là chữ của người Việt cho tiếng Việt, hợp blog song ngữ này hơn một họ Đức (Plex) hay Anh (Space Grotesk). Lý do này về nghĩa (semantics), nặng hơn lý do về gu.
4. **Ba cỡ quang học trong một họ.** `Text` cho thân và nhãn, `Deck` cho tiêu đề phụ, `Display` cho tít lớn: mỗi bậc của thang chữ có một file vẽ riêng cho cỡ của nó.
5. **Giấy phép SIL OFL 1.1** (đọc từ metadata font): được nhúng web và phân phối cùng site. CDA xin được kể lại câu chuyện khi dùng (`README-THANKYOU.txt`); gợi ý một dòng ghi công ở trang About.
6. **Nhẹ và tự chủ.** Năm file `woff2` ≈ 196 KB (38 + 40 + 39 + 40 + 39), tự host. Bỏ được Google Fonts (Space Grotesk 4 độ đậm, Plex Sans 4 độ đậm kèm nghiêng) và hai `preconnect`.

**Điều kiện đi kèm.** Nếu không đạt, quay lại Plex Sans:

- **Display chỉ dùng từ 30 px trở lên** (tít bài, tít trang). Nó khít chữ và nét loe rõ: tốt ở cỡ lớn, nặng ở cỡ nhỏ. Không dùng cho thân hay nhãn.
- **Số thẳng cột.** Chữ số mặc định là tỉ lệ (`0` rộng 632, `1` rộng 313). Chỗ cần thẳng hàng (ngày trong danh sách, phút, số chú thích) thêm `font-variant-numeric: tabular-nums` (font có `tnum`).
- **Thiếu `●` `■` `⌘`.** `●` thay bằng chấm CSS 6 px, `■` đã bỏ (mục 6.7), `⌘K` thay bằng biểu tượng SVG. Mũi tên `→ ← ↑ ↓`, `·`, `—`, `′`, `×`, `≈` có đủ.
- **Phép thử mắt (mục 9, bước 2).** Mình chỉ thử nền tối, một cỡ, một màn hình. **Nền sáng và mobile 375 px chưa đo.**

**Phân vai file (năm file, không hơn):**

| Bậc | File | `font-family` | weight |
| --- | --- | --- | --- |
| meta 13, thân 18 | `CDAIndependenceText-Regular` | `'CDA Independence Text'` | 400 |
| nghiêng trong thân | `CDAIndependenceText-Italic` | cùng họ | 400 italic |
| nhấn mạnh, `h3`, nút | `CDAIndependenceText-SemiBold` | cùng họ | 600 |
| `h2` 26 | `CDAIndependenceDeck-SemiBold` | `'CDA Independence Deck'` | 600 |
| tít 40, tít trang | `CDAIndependenceDisplay-Bold` | `'CDA Independence Display'` | 700 |

- Dùng bản **OTF đổi sang `woff2`**, đặt ở `static/fonts/cda-independence/`, khai báo `@font-face` trong `app.css`, `font-display: swap`, `preload` cho `Text-Regular` và `Display-Bold`.
- **Không dùng bản Variable** (479 KB; trục `wght` 300–900, `slnt` 0–12, `SRFF`): ta cần đúng ba độ đậm.
- Chữ đậm trong thân: một độ đậm (600), bỏ 700. Biến `--ink-strong` (trắng ở nền tối) chỉ giữ nếu 600 không tách nổi khỏi 400; thử trước khi giữ.
- Không tải Light, Medium, Black, ExtraBold hay các bản nghiêng khác.

| Token       | px                 | line-height    | Dùng cho                                                                                                                        |
| ----------- | ------------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `--t-meta`  | **13**             | 1.4            | Mọi nhãn, tag, nav phụ, ngày, thời lượng, chú thích. **Không dưới 13.** Phân cấp bằng độ đậm hoặc màu `--muted`, không bằng cỡ. |
| `--t-body`  | **18**             | 1.62 (≈ 29 px) | Thân bài, mô tả, mục danh sách. Đang là 18 / 1.62: giữ.                                                                         |
| `--t-h2`    | **26**             | 1.25           | Tiêu đề phần trong bài. Weight 600. Một dòng trống phía trên (bằng một dòng thân: 29 px × 2).                                   |
| `--t-title` | **40** (mobile 32) | 1.1            | Tít bài, tít trang chủ, tít trang chỉ mục. Weight 700.                                                                          |

- `h3` trong bài: 18 px, weight 600, không đổi cỡ (đúng Vignelli: tiêu đề phụ cùng cỡ thân, chỉ đậm).
- Tỉ lệ 13 : 18 : 26 : 40 ≈ 1 : 1,4 : 2 : 3. Cho phép, vì bài dài cần ba bậc tiêu đề. Vignelli thì muốn hai cỡ; Reichenstein cho bài dài ba. Quyết: ba cho **trang bài**, hai cho **trang khác** (trang chỉ mục chỉ dùng `meta`, `body`, `title`).
- **Bỏ `text-transform: lowercase`** trên heading. Viết hoa như câu văn bình thường.
- **Bỏ `text-transform: uppercase` + `letter-spacing: 0.14em`** trên Tag, nav, nhãn. Viết thường như câu, 13 px, weight 500. In hoa chỉ giữ cho từ viết tắt.
- Bỏ các cỡ: 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13.5, 14, 14.5, 15, 16, 16.5, 17, 19, 20, 21, 22, 24, 30, 34, 44, 46, 58, 72. Toàn bộ về bốn token ở trên. Việc này làm bằng tìm và thay `font-size` trong `src/` (≈ 250 chỗ), rồi gom vào `app.css`.

### 3.2.1 Mono: Monaspace Xenon (quyết 2026-10-28)

**Phán quyết: dùng Monaspace Xenon cho mọi chỗ mono** (khối code, `code` trong dòng, và chỉ ở đó). File: `fonts/Monaspace Xenon/Monaspace Xenon Var.woff2`. Đã thử cạnh IBM Plex Mono ở 13 px trong khung code và `0.86em` trong câu, nền sáng.

Lý do:

1. **Dấu tiếng Việt đủ** (kiểm bằng `fontTools`, 134 chữ có dấu). Comment tiếng Việt trong code đọc gọn ở 13 px.
2. **Code tách khỏi văn.** Xenon là mono có chân (slab). Thân bài là CDA sans nhân văn, nên một mono có chân cho mắt biết ngay "đây là code", trong khi Plex Mono gần giọng với thân bài sans. Chân của Xenon cũng cùng họ hàng với nét loe của CDA: hai mặt chữ nói cùng một ngôn ngữ, khác vai.
3. **Bỏ phụ thuộc ngoài cuối cùng.** Plex Mono là thứ duy nhất còn tải từ Google Fonts. Đổi sang Xenon tự host thì bỏ được link Google và hai `preconnect`.
4. **Giấy phép SIL OFL 1.1** (đọc từ metadata: GitHub Next). Được nhúng web.

Điều kiện (không đạt thì giữ Plex Mono):

- **Không dùng nguyên file variable.** File gốc 570 KB (trục `wght` 200–800, `wdth` 100–125, `slnt` −11–0, 3818 glyph): gấp ba toàn bộ CDA. _Đã làm:_ tác giả cung cấp bản tĩnh (`fonts/Monaspace Xenon/MonaspaceXenon-*.woff2`, mỗi file ~216 KB). Dùng **Regular và SemiBold**, subset Latin + Latin-1 + Latin Extended-A + Vietnamese (U+1EA0–1EFF, Ơ ơ Ư ư, dấu kết hợp) + dấu câu và mũi tên. Kết quả: **35 KB + 35 KB** (bản tĩnh giữ bảng texture healing dày hơn instance cắt từ variable, nên nặng hơn mức 27 KB đo thử), đủ 134 chữ có dấu. Lệnh: `fontTools.subset` (flavor `woff2`, features `calt ccmp locl kern mark mkmk tnum zero`), đặt ở `static/fonts/monaspace-xenon/MonaspaceXenon-{Regular,SemiBold}.woff2`.
- **Giữ `calt` (texture healing)**: nó là lý do của họ Monaspace, giãn chữ hẹp và chữ rộng trong ô cố định cho màu chữ đều. **Không bật `ss01`–`ss10`** (ligature `!=` → `≠`, `=>` → mũi tên): người đọc blog chép code ra để chạy, và một ký tự trông khác cái họ phải gõ là bất ngờ (A5).
- **Rộng hơn Plex Mono 3%** (80 ký tự 13 px: 645 px so với 624 px). Khung code trong cột 680 px, trừ padding 16 px hai bên, chứa khoảng 100 ký tự. Đủ; dòng dài hơn thì cuộn trong khung như hiện nay.
- **Không có `⌘`**: chỉ dùng trong tooltip của nút tìm, trình duyệt lấy font hệ thống, không sao.
- **Chỉ trong code.** Không dùng Xenon cho nhãn, số liệu hay ngày tháng: đó là việc của CDA Text với `tabular-nums`. Mono làm nhãn là thói quen cũ của bản "ink" mà mục 3.2 đã bỏ.
- Áp cả cho `viz/`, `interactive/`, `tech/` khi các thư mục đó được rà thang chữ (mục 12, lệch 3): chỗ nào đang `var(--mono)` cho nhãn trục thì chuyển sang `var(--body)`, chỗ nào thật là code (`CodeBlock`, `Terminal`) giữ `var(--mono)`.

Token: `--mono: 'Monaspace Xenon', ui-monospace, monospace;` Không đổi gì khác trong component: mọi chỗ đã đọc `var(--mono)`.

### 3.3 Lưới và khoảng cách

- **Đơn vị cơ sở: 29 px** (= line-height thân bài). Mọi khoảng cách dọc là bội của 29 / 2 = 14,5 → làm tròn: **8, 16, 32, 64**. Bỏ mọi `padding` lẻ như 46, 38, 34, 26, 22, 18, 30, 44, 56, 48.
- Desktop: 12 cột, lề ngoài **32 px**, khoảng cột 16 px. Mobile (375 px): 4 cột, lề **16 px**. Hiện đang có `--pad-chrome: 30px`, `--pad-measure: 44px`, mobile `18px`: gộp về hai giá trị.
- **Cột đọc: `max-width: 680px`** (≈ 70 ký tự ở 18 px), căn giữa trên lưới (cột 4–9). Bỏ `--measure` 700 / 820 / 940 px. **Bỏ lựa chọn độ rộng.**
- Chrome (header, danh sách bài) chạy rộng tối đa **1080 px** (đã là `--index-max`).

### 3.4 Token

Tất cả màu, cỡ, khoảng cách ở `:root` trong `app.css`. Quy tắc: **không** `font-size`, `padding`, `margin`, màu thô trong file `.svelte`; chỉ dùng token. Dark mode đổi giá trị token, không đổi cấu trúc (đã đúng).

### 3.5 Màu — rút gọn

- Giấy, mực, `--muted`, `--faint`, rule, xanh. Hết.
- **Bỏ theme `dusk`** (giấy ấm). Còn hai theme: sáng và tối.
- `--viz-*` (clay, gold, moss, plum, red) giữ **chỉ** cho biểu đồ. Không dùng ở chỗ khác.
- `--faint #a7a7ad` (nhạt hơn `--muted`): bỏ. Dùng `--muted` cho mọi chữ phụ; nếu cần nhạt hơn, bỏ chữ đó đi.

---

## 4. Cài đặt: bỏ 9 trên 11

Quy tắc theo mặc định hiện tại (`DEFAULT_PREFS`): theme `light`, layout `sidenote`, framing `card`, mode `study`, ruler `false`, timeLeft `true`, fontSize 18, lineSpacing 1.62, measure `60`, typeface `sans`.

| Cài đặt                      | Quyết                                                           | Mặc định thay thế                                                                      | Lý do                                                                                                                            |
| ---------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| theme: light / dusk / dark   | **Giữ, sửa**: `Hệ thống` (mặc định) · `Sáng` · `Tối`. Bỏ `dusk` | Theo `prefers-color-scheme`                                                            | Người đọc ban đêm cần tối. Hệ điều hành đã biết.                                                                                 |
| themeAuto (theo giờ)         | **Bỏ**                                                          | —                                                                                      | `prefers-color-scheme` làm việc này tốt hơn. Đồng hồ trên máy không biết người đọc đang ở đâu.                                   |
| fontSize                     | **Giữ, một nút**: `A−` `A+` (3 bước: 17 / 18 / 20 px)           | 18                                                                                     | Thị lực khác nhau là có thật. Đây là cài đặt duy nhất khác ngoài theme.                                                          |
| layout: sidenote / single    | **Bỏ**                                                          | Tự động: sidenote khi cột đủ rộng (≥ 1180 px), nội tuyến khi hẹp                       | Tác giả chọn. Màn hình quyết định, không phải người đọc.                                                                         |
| framing: rule / bleed / card | **Bỏ**                                                          | `card` hiện là mặc định. Đổi: **`rule`** (một rule trên, một rule dưới, trong cột đọc) | Bleed phá cột (−80 px) và hỏng trên mobile. Card lùi vào 24 px, làm cột chữ không còn thẳng. Rule giữ nguyên lề trái, đúng lưới. |
| mode: study / flow           | **Bỏ**                                                          | Đường đọc **luôn** là flow: tít, thân bài, hết. Bộ phận phụ nằm sau bài (mục 6)        | Cần cờ để ẩn chỗ thừa nghĩa là chỗ thừa đó không nên có mặt ngay từ đầu.                                                         |
| ruler (con trỏ đọc)          | **Bỏ**                                                          | Tắt (đã tắt mặc định)                                                                  | Làm mờ mọi khối khác khi cuộn: giống chuyển động ăn cắp sự chú ý. Không ai nhờ.                                                  |
| timeLeft                     | **Bỏ cài đặt**                                                  | Hiện **một** số ở đầu bài: "12 phút". Bỏ "N min left" chạy theo cuộn                   | Tính năng đếm ngược trong lúc đọc là áp lực, không phải thông tin.                                                               |
| lineSpacing                  | **Bỏ**                                                          | 1.62                                                                                   | Con số đã đúng.                                                                                                                  |
| measure: 52 / 60 / 72        | **Bỏ**                                                          | 680 px                                                                                 | Xem D6.                                                                                                                          |
| typeface: sans / serif       | **Bỏ**                                                          | CDA Independence Text | Một giọng, mặt chữ Việt. Xem 3.2.                                                                                         |

**Bỏ cả trang `/reading`** (563 dòng, `reading.svelte.ts`, `reading-prefs.ts` rút còn theme + size, khóa localStorage còn hai). Menu cài đặt trong header: một popover hai hàng (Theme · Cỡ chữ). Không có "mở trang khác để cài thêm".

Giữ **tương thích khóa cũ**: đọc khóa localStorage cũ của `theme` và `font-size` một lần để người đã chọn không mất lựa chọn; bỏ các khóa khác, không đọc.

---

## 5. Kiến trúc thông tin

### 5.1 Nav: 7 mục thành 3

Hiện: Writing · Topics · Series · Glossary · Resources · Reading Room · About. (Vault ẩn, Signals không có link.)

Mới, trong header, thứ tự cố định:

1. **Bài viết** (= trang chủ, danh sách toàn bộ)
2. **Chủ đề** (gộp Topics + Series: loạt bài là một dạng chủ đề có thứ tự)
3. **Giới thiệu** (About; chứa liên kết tới Từ điển, Tài liệu, Vault ở chân trang)

Glossary và Resources **không có chỗ trong nav**. Chúng là phụ lục của bài: Term trong bài đã dẫn tới Glossary, Bibliography đã dẫn tới Resources. Giữ trang, **chuyển link xuống footer**.

Reading Room: xem 7.3.

Bên phải header: **Tìm** (`⌘K`), **VI/EN**, **Cài đặt**. Bỏ vạch chia (`.divider`). Ba phần tử, không hơn. Header chỉ 1 hàng, 56 px, không còn "rớt hàng" ở dưới 1180 px: ba mục nav + ba công cụ vừa ở 375 px nếu nav là chữ 13 px (xem mục 8).

### 5.2 Thứ tự thông tin trên mỗi trang

Mỗi trang có **một việc**, và nó đứng trên cùng.

| Trang      | Việc chính                         | Thứ tự                                                                             |
| ---------- | ---------------------------------- | ---------------------------------------------------------------------------------- |
| Trang chủ  | Chọn một bài để đọc, hoặc đọc tiếp | (1) "Đọc tiếp" nếu có, một dòng; (2) danh sách bài                                 |
| Bài        | Đọc                                | (1) tít, (2) một câu phụ đề, (3) dòng meta, (4) thân bài, (5) hết bài, (6) phụ lục |
| Chủ đề     | Duyệt theo chủ đề / loạt           | Danh sách chủ đề, mỗi chủ đề kèm bài                                               |
| Giới thiệu | Biết ai viết                       | Văn bản, rồi liên kết                                                              |

---

## 6. Trang bài: thiết kế lại

### 6.1 Đầu bài (title block)

**Trước** (D7): tag row → tít 58 px → phụ đề → rule → hộp Thời tiết → (dải "You were here") → (ribbon loạt) → thân.

**Sau:**

```
[Chủ đề]  ·  [Chương V / Loạt X]                    13 px, muted
                                                    32 px trống
Tít bài (40 / 1.1, weight 700, viết hoa như câu)
Phụ đề một câu (18, muted)                          16 px trống
12 phút · 22.09.2026 · Đọc bản tiếng Việt →         13 px, muted
———————————————————————————————————————————— rule 1.5 px
Thân bài bắt đầu                                    cách 64 px
```

- Một dòng meta duy nhất. Không hộp. Không "LOAD" bằng bốn ô vuông.
- Màn hình đầu (795 px cao) phải chứa **ít nhất 4 dòng thân bài**. Phép thử: chụp 1512×795, đếm.
- Tag "● interactive" → chữ "tương tác" trong dòng meta, không có tag riêng.
- "Đọc bản tiếng Việt →" là liên kết trong dòng meta, không là một Tag xanh riêng. Chỉ hiện khi có bản dịch thật.

### 6.2 Hộp "Thời tiết" (WeatherStrip)

**Bỏ khỏi đầu bài.** Nội dung của nó hữu ích (cần biết gì trước, đọc lúc nào), nhưng là việc của **tác giả nói trong phụ đề hoặc đoạn mở**, không là một bảng đứng chặn cửa. Nếu một bài cần "đọc trước X", viết một câu trong thân bài, hoặc giữ trường `weather.needFirst` và hiện thành **một dòng meta** ("Cần biết trước: …"). Độ khó 5 ô vuông: bỏ.

### 6.3 Chỗ dừng đọc (reading memory)

- Dải xanh "You were here" **bỏ**. Thay: khi người đọc quay lại bài dở, trình duyệt **tự cuộn** về vị trí cũ, kèm một dòng 13 px ở góc dưới: "Đã quay lại chỗ bạn dừng · Đọc từ đầu". Tự biến mất sau 6 giây. Không chiếm chỗ trong dòng chảy.
- Ghim bên lề (`ReadingMemoryGutter`) **bỏ**. Vị trí đã được cuộn tới, không cần đánh dấu.
- Giữ `PickUpWhereYouLeftOff` trên trang chủ nhưng thu về **một dòng** (mục 7.1).

### 6.4 Mục lục: một công cụ, không ba

Hiện có ba: ForeEdge (thanh vạch bên trái + "CONTENTS" dọc), TocDrawer, MobileReadingBar.

- Desktop ≥ 1180 px: **mục lục chữ thật**, `position: sticky` ở cột trái ngoài cột đọc, 13 px, mỗi mục một dòng, mục hiện tại đậm + màu xanh. Không vạch, không xoay dọc. Chỉ hiện khi bài có ≥ 3 `h2`.
- Dưới 1180 px: **một nút "Mục lục"** ở thanh dưới, mở ngăn kéo (giữ TocDrawer, bỏ ProgressBar trong đó).
- **Bỏ ForeEdge** (rail 180 vạch, flag, band, wash, strip mobile ở mép phải). Đẹp, và là ý tưởng sách độc đáo của blog này, nhưng chữ xoay dọc 9 px không đọc được, và vạch không dẫn đường bằng chữ. Hãy giữ ý tưởng "trọng lượng còn lại" bằng **một thanh 2 px** trên cùng màn hình (tiến độ), màu xanh. Đây là tiến độ chuẩn, người đọc nhận ra ngay.
- **Bỏ RunningHead** (chữ xoay dọc + số La Mã). Tên mục hiện tại đã nằm trong mục lục sticky.
- **Bỏ "folio" La Mã** (`romanize()`, `ROMAN`). Ẩn dụ không mang thông tin.

### 6.5 Thân bài

- Cột 680 px, 18 / 1.62, `--ink` trên `--paper`. Màu thân: `#24242c` trên `#fafaf7` (≈ 14:1) đạt. Chế độ tối: `#d8d8dd` trên `#0d0d11` giữ.
- Căn trái, không justify, không gạch nối tự động (đã đúng).
- `h2` 26 px / 600; một dòng trống trên (58 px), nửa dòng dưới (14 px). Bỏ `lowercase`.
- Danh sách: chấm 6 px đặc, thụt 24 px. Giữ.
- Công thức KaTeX, code, bảng: tối đa rộng bằng cột đọc. **Bỏ `bleed` / `card` framing**.
- Sidenote: chỉ ≥ 1180 px, ở lề phải, 13 px; dưới đó thành chú thích nội tuyến (bấm để mở). Giữ `Sidenote`, `Footnote`, `Term` (glossary inline), `GlossaryFootnote` sẽ vào phụ lục.
- `Callout`, `PullQuote`: một kiểu mỗi loại. PullQuote không tràn khỏi cột.
- `Fleuron` (dấu ❧ ngắt đoạn): **giữ**, vì bài thật đang dùng (bài 007). Màu `--muted`, không xanh; khoảng trên và dưới bằng một dòng thân (29 px). Đây là dấu ngắt của tác giả, không phải trang trí của giao diện.
- **Bỏ chữ hoa thả** (drop cap) ở đoạn đầu (`PostBody.svelte`, `> p:first-of-type::first-letter`). Đoạn đầu chỉ là một đoạn. Lý do: màu xanh dùng làm trang trí (D16a), và chữ thả với dấu tiếng Việt là chỗ dễ vỡ.
- Số `[01]` chú thích: giữ, 13 px, màu `--muted`, không xanh.
- `LinkPreview` (thẻ xem trước khi rê chuột vào link ngoài): **giữ trên desktop**, bỏ trên cảm ứng. Nó hữu ích thật và chỉ hiện khi hover.

### 6.6 Bút đánh dấu của người đọc (ReaderMarks, 857 dòng)

> **Cập nhật theo quyết định 10.1:** tác giả chọn ẩn toàn bộ `ReaderMarks`. Đoạn dưới là đề xuất ban đầu (giữ một cử chỉ); **không áp dụng**.

Năm cử chỉ: dissent, snag, ask, note + gạch bằng rough.js. Hiện sinh ra `.mk-*` và nền màu trong thân bài.

**Quyết: giữ một cử chỉ, bỏ bốn.**

- Giữ **một**: tô sáng (nền `--paper2`, tắt/mở bằng bấm lại). Lưu cục bộ.
- Bỏ: dissent, snag, ask, note, vòng rough.js, số `.mk-idx` trên chữ, và việc ghi lên `/api/react` từ ghi chú.
- Lý do: năm cử chỉ là năm quyết định trong lúc đang đọc. Đọc bị ngắt năm lần. Người đọc nghiêm túc đã có sẵn chức năng bôi đen + sao chép của trình duyệt.
- **Không xóa mã.** Tác giả đã quyết (mục 10): code chuyển vào thư mục `archived/` (xem 10.1 và 10.4).

### 6.7 Cuối bài và phụ lục

**Trước:** ■ → OneSentence → Glossary → Bibliography → ReflectionPrompt → Neighbourhood → footer. Sáu khung, sáu kiểu.

**Sau, theo thứ tự, mỗi mục cách nhau 64 px và cùng một mẫu (rule 1,5 px + tiêu đề `--t-meta` đậm + nội dung):**

1. **Hết bài.** Một rule 1,5 px. Bỏ ■.
2. **Một câu để nhớ** (OneSentence): giữ, nhưng cỡ `--t-h2` (26 px), màu mực (không xanh), không khung, không nền xanh. Đây là phần thưởng cho người đọc đến cuối. Nếu bài không có, không hiện.
3. **Bài tiếp theo** (gộp Neighbourhood + SeriesRibbon): tối đa 3 hàng. Mỗi hàng: tít (18 / 600) + một dòng lý do (13, muted). Nếu thuộc loạt, **bài kế tiếp của loạt đứng đầu**. Bỏ nhãn "hand-picked" (mọi thứ ở đây đều do tay chọn; nói ra là thừa).
4. **Nguồn** (Bibliography): thu gọn mặc định, bấm mở. Một hàng "Nguồn (7)".
5. **Thuật ngữ** (GlossaryFootnote): thu gọn mặc định cùng cách. Hoặc, nếu `Term` trong bài đã có thẻ nổi, **bỏ phần này khỏi cuối bài** (thông tin trùng).
6. **Một lời gửi tác giả** (ReflectionPrompt): bỏ khỏi phần cuối bài; thay bằng một liên kết văn bản "Gửi ý kiến cho tác giả" trong footer, mở một ô nhập. Câu hỏi được chọn theo slug: dùng như placeholder của ô.

### 6.8 Mobile (375 px)

- Lề 16 px. Thân **18** / 1.62, bằng desktop: bỏ luật hạ xuống 17 px trong `PostBody.svelte` (D15).
- Header **một hàng, 56 px** (D13). Ba mục nav + ba công cụ dạng biểu tượng. Trên trang bài, header ẩn khi cuộn xuống, hiện khi cuộn lên (mục 8).
- **Không tràn ngang** (D14): `document.documentElement.scrollWidth === innerWidth` trên mọi trang ở 375 và 390 px. Phép thử bắt buộc ở mục 9.
- Màn hình đầu ở 390 × 844: câu đầu thân bài phải bắt đầu **trên y = 420 px** (hiện 678 px ở khung 780).
- Tít 32 / 1.1.
- Một thanh dưới cùng: `Mục lục` (trái) · `% đã đọc` hoặc không gì (phải). Nếu thanh này không phục vụ điều hướng, bỏ nó và để nút Mục lục nổi.
- Bỏ dải fore-edge 16 px ở mép phải. Thanh tiến độ 2 px trên cùng đã đủ.

---

## 7. Các trang khác

### 7.1 Trang chủ (`[lang]/+page.svelte`, 222 dòng)

Giữ cấu trúc (masthead → nổi bật → gần đây) nhưng đơn giản hóa:

- **Bỏ masthead lớn** ("writing, mostly about things that take a _while_."). 72 px, hai dòng, dấu gạch tay `scribble`, mô tả ba dòng, và hai Tag trên đầu. Đẹp, nhưng người quay lại lần thứ hai phải cuộn qua nó mỗi lần. Thay bằng **một dòng**: tên + một câu (`--t-body`, muted) đứng trên rule: "maxubrq. — Bài viết về những thứ cần thời gian." Câu khẩu hiệu giữ nguyên, nếu tác giả muốn; chỉ hạ cỡ.
- **Bài mới nhất**: một khối với tít (`--t-title`, 40), phụ đề, dòng meta, ảnh halftone nửa phải. **Bỏ số "01"**. Bỏ mũi tên vẽ tay `ArrowMark` và chữ "READ THE ESSAY" (cả khối là liên kết; tít đổi xanh khi hover).
- **Danh sách còn lại**: giữ `IndexRow` (đây là phần đúng nhất của site). Bỏ số `02, 03…`. Mỗi hàng: ngày (13, cột trái cố định) · tít (18) · chủ đề + phút (13, muted, bên phải).
- **PickUpWhereYouLeftOff**: thu về **một dòng**, bỏ số phút còn lại (D16c: nó làm tròn ra "0 phút" khi mới đọc 72%); chỉ giữ phần trăm, đứng **trên** bài mới nhất, chỉ hiện khi có: `Đọc tiếp: Tail latency & tail amplification · 72% →`. Bỏ ô lớn có thanh tiến độ, "CLEAR MEMORY", "Sep 21", "0 min left".
- Trang chủ và `/writing` hiện **gần như trùng nhau**: `/writing` là danh sách + bộ lọc chủ đề, trang chủ là bài mới + danh sách ngắn. Với 4 bài (và vài chục bài sau này), **gộp**: trang chủ **là** `/writing`. Bỏ route `/writing` thành chuyển hướng 308 về `/`.

### 7.2 Danh sách bài (nay là trang chủ)

- Bộ lọc `FilterBar` (6 ô đầy chiều ngang, Tất cả / Science / Tech / Philosophy / Art / Thinking): hiện chiếm một hàng 36 px, ô "All" tô xanh kín. Thay bằng **dòng chữ 13 px** (Tất cả · Khoa học · Công nghệ …), mục đang chọn gạch chân xanh 1,5 px. Không ô, không tô nền.
- Chỉ hiện chủ đề **có bài**. Hiện 6 chủ đề cho 4 bài là nói dối về kích thước của kho.
- Nhóm theo năm (đã có): giữ. Số năm cỡ `--t-title`, muted. Không rule kéo dài ở bên phải.

### 7.3 Reading Room, Vault, Signals

Ba trang "về người đọc / về tác giả" nuôi tính năng đo lường và ghi nhớ.

| Trang                                                                                                  | Quyết                                                                                                                                                             | Lý do                                                                                                                            |
| ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Reading Room** (365 dòng + `ReaderSky` 535 dòng: "chòm sao" các bài đã mở, bằng force simulation d3) | **Gỡ khỏi nav. Giữ trang, đơn giản hóa**: một danh sách "Đã đọc / Đang đọc / Đánh dấu" theo thời gian. Bỏ ReaderSky                                               | Rất đẹp, nhưng một chòm sao bốn ngôi sao là trang trí. Việc chính ("đọc tiếp") đã có ở trang chủ. Khi blog có ≥ 30 bài, thử lại. |
| **Vault** (434 dòng, cabinet riêng, chỉ vào từ About)                                                  | **Giữ nguyên** vị trí, không đụng. Đã là cửa riêng đúng nghĩa                                                                                                     | Không nằm trên đường đọc. Chỉ cần áp thang chữ mới.                                                                              |
| **Signals** (579 dòng, dashboard tác giả, không có link)                                               | **Giữ ngoài giao diện công khai.** Không ở nav, không ở footer. Áp thang chữ mới khi tiện. Dữ liệu dày: **ngoại suy**, cần người có kinh nghiệm dashboard xem lại | Dành cho tác giả.                                                                                                                |

### 7.4 Chủ đề + Loạt (gộp thành `/topics`)

- Mỗi **chủ đề** là một khối: tên (`--t-title`), một câu mô tả, rồi danh sách bài. Bỏ hiệu ứng "hover cả ô đổi sang xanh đặc" (§8 của THEME_MANIFESTO): màu đặc lớn bắt mắt hơn nội dung. Hover = tít đổi xanh, như ở mọi nơi khác.
- **Loạt** (`/series`, `/series/[id]`): là chủ đề **có thứ tự**. Trong trang chủ đề, nếu chủ đề có loạt, hiện loạt trước: "Loạt: <tên loạt> (3 / 8 bài)".
- **Giữ theo ghi nhớ của tác giả**: `starters` và `scratchpad` trong `src/lib/topics.ts` **cố ý rỗng** (quyết định 2026-08-11, chờ kho bài dày hơn). **Không điền lại**. Trạng thái rỗng là trạng thái hoàn chỉnh. "Ghi chú biên tập" và đuôi theo thời gian là đủ cho mỗi phòng. Người sửa không được coi đây là việc port dở dang.
- Mô tả chủ đề rỗng vì chưa có bài: **không hiện** chủ đề đó.

### 7.5 Glossary, Resources

- Hai trang này dùng chung lưới 2 cột `.ink-gloss-*` và đang trình bày "một demo về cách đánh dấu hiện trong bài" ở đầu. **Bỏ demo.** Người tra từ không cần học cách tra từ.
- Một cột, không hai: rule dọc giữa hai cột làm mắt đi zig-zag. Mỗi mục: thuật ngữ (18 / 600) + định nghĩa (18) + chủ đề (13). Mục dài thu gọn bằng `<details>` (đã có).
- Ô tìm kiếm + A–Z (glossary) / theo chủ đề (resources): **giữ cả ô tìm riêng**. _Sửa lúc hiện thực:_ bản trước ghi "`⌘K` đã tìm được cả hai" là sai: chỉ mục ⌘K (`src/lib/content/search.ts`) chỉ có bài, phần và đoạn văn, không có thuật ngữ hay nguồn. Bỏ ô tìm riêng sẽ làm mất chức năng.
- Không còn trong nav; vào bằng footer và bằng liên kết từ bài.

### 7.6 About

- Giữ chân dung duotone (đúng ngôn ngữ ảnh của site), một cột chữ, ba liên kết. Cửa Vault giữ nguyên.
- Tách ra khỏi nav nếu tác giả muốn ẩn danh hơn: **không** đề xuất. Giữ.

### 7.7 Tìm kiếm (SearchOverlay, 780 dòng)

- Giữ `⌘K`. Là tính năng đáng giữ nhất ngoài đọc.
- Overlay: một ô nhập 18 px, kết quả dạng `IndexRow`. **Bỏ** các lọc, nhóm, phím tắt phụ nếu có. Một ô, một danh sách, ↑ ↓ ⏎ Esc.
- Nút "search ⌘K" ở header: thu thành biểu tượng kính lúp trong khung 32 × 32; trên cảm ứng, chữ "Tìm". Không hiện chữ `⌘K` trên Windows/Android.

### 7.8 Chân trang

Hiện: ba Tag (`maxubrq.space / writing`, "a notebook, kept in public · est. 2024", "© 2026") ở 10 px in hoa.

Mới, một hàng 13 px:
`© 2026 maxubrq` · `Từ điển` · `Tài liệu` · `Giới thiệu` · `RSS` · `Gửi ý kiến`

Bỏ câu "kept in public · est. 2024" khỏi footer (đã ở About). Bỏ Tag `{foot}` tùy trang.

### 7.9 Trang lỗi

`+error.svelte`, 393 dòng. Giữ ý tưởng, **thu về**: mã lỗi (`--t-title`), một câu, ba liên kết (về trang chủ · tìm · bài mới nhất). Hiện nhiều hơn mức cần.

---

## 8. Header và nav (thông số)

- Chiều cao 56 px (hiện ~57 px + rule 1,5). Rule dưới 1,5 px. Dính (sticky) trên mọi trang **trừ trang bài**: trên bài, header ẩn khi cuộn xuống, hiện khi cuộn lên. Tiết kiệm 56 px mỗi màn hình đọc, trên điện thoại là 7%.
- Trái: `maxubrq.` (CDA Display Bold 700 nếu ≥ 30 px; ở 18–24 px dùng Text SemiBold 600, thử cả hai). Dấu chấm xanh giữ: đây là dấu nhận diện duy nhất.
- Giữa: nav 3 mục, 13 px / 500, `--muted`; mục hiện tại `--ink` + gạch chân 1,5 px xanh. Bỏ chữ in hoa giãn chữ.
- Phải: Tìm · VI/EN · Cài đặt (biểu tượng `SettingsMark`).
- Mobile: một hàng; nav nằm sau nút "Menu" **không** cần: ba mục + ba công cụ vừa 375 px nếu nav là chữ thường 13 px và công cụ là biểu tượng 32 px. Phép thử: chụp 375 px.

---

## 9. Kiểm tra (phép thử)

Làm xong mỗi bước, chạy các phép thử. Số liệu lấy bằng công cụ, không bằng mắt.

1. **Số cỡ chữ**: trên một trang bài, tập hợp `getComputedStyle(el).fontSize` của mọi lá chữ. Đích: **≤ 5 giá trị** (13, 18, 26, 40 và 16 hoặc 17 nếu có cỡ A− / A+; cộng KaTeX).
2. **Chữ CDA, thử mắt**: 5 người đọc 5 phút thân bài 18 px, sáng và tối, EN và VI, rồi hỏi "mỏi mắt hơn Plex không?". **Số họ chữ**: ≤ 2 họ: CDA Independence (Text / Deck / Display tính là một) và Monaspace Xenon, cộng KaTeX.
3. **Ký tự mỗi dòng** thân bài: 65–75 (EN và VI, đếm trên dòng thực).
4. **Màn hình đầu** (1512 × 795 và 375 × 812): ≥ 4 dòng thân bài, không hộp giữa tít và thân.
5. **Tương phản**: `--muted` trên `--paper` ≥ 4.5 : 1 ở **cả hai** theme, ở 13 px.
6. **Cài đặt**: menu cài đặt có đúng 2 hàng. `localStorage` có đúng 2 khóa của site.
7. **Chạy với người**: đưa bài cho 5 người, bảo "đọc đi", đo: (a) họ có cuộn qua một "bộ phận" nào mà không nói được nó là gì? (b) họ tìm được mục lục không? (c) họ nói lại được bài?
8. **Mười năm**: nếu một chi tiết là "ẩn dụ sách" (La Mã, fore-edge, "bầu trời"), hỏi: người lạ có hiểu không khi bỏ nhãn đi? Nếu không, chi tiết đó là trang trí.
9. **Không tràn ngang**: ở 375 và 390 px, `scrollWidth === innerWidth` trên trang chủ, danh sách, một bài có công thức, một bài có code, `/topics`, `/glossary`. Đo trong iframe nếu cửa sổ trình duyệt không thu nhỏ được.

---

## 10. Quyết định của tác giả (đã chốt)

Bốn điểm hội đồng để mở. Tác giả đã trả lời; người sửa làm theo, không cần hỏi lại.

### 10.1 Fore-edge và ReaderMarks: ẩn render, cất code vào `archived/`
- **Ẩn khỏi giao diện**: bài viết không còn render `ForeEdge` (cả hai biến thể `rail` và `edge`) và `ReaderMarks`.
- **Cất code** vào `archived/` (xem 10.4), không xóa.
- Phạm vi, theo mục 6.4 và 6.6: `ForeEdge.svelte` cùng `foreEdgeSections`, các lớp `.fore-edge-*` trong `app.css`; `ReaderMarks.svelte` cùng các lớp `.mk-*`, `.mk-idx`. Mục 6.6 đề xuất giữ một cử chỉ tô sáng: **tác giả chọn ẩn cả `ReaderMarks`**, nên **không giữ cử chỉ nào**. Bỏ luôn việc ghi ghi chú của mark lên `/api/react`.
- Các bộ phận cùng nhóm đã được liệt vào "bỏ" ở mục 6 (`RunningHead`, folio La Mã, `ReadingMemoryGutter`, `ReadingRuler`) xử lý theo cùng cách nếu người sửa thấy chúng gắn với hai thứ trên. Hỏi tác giả nếu muốn xóa hẳn thay vì cất.
- Hệ quả: mục lục chữ thật (desktop) + ngăn kéo (mobile) + thanh tiến độ 2 px của mục 6.4 là **thứ thay thế**; làm cùng lúc, đừng để bài không có công cụ điều hướng.

### 10.2 Gộp `/writing` vào trang chủ: chuyển hướng
- Tác giả đồng ý: `/[lang]/writing` chuyển hướng về `/[lang]`.
- **Lưu ý cho người sửa:**
  - Route gốc `/` hiện đã là `307` theo ngôn ngữ (xem comment trong `src/routes/+page.server.ts`: 308 cho `/` từng sai vì trình duyệt cache vĩnh viễn). Điều đó **không** áp dụng cho `/[lang]/writing → /[lang]`, vì ngôn ngữ đã cố định trong URL: ở đây dùng `308` được.
  - Toàn site được prerender (`src/routes/+layout.ts`) và deploy bằng `adapter-vercel`. Một `redirect()` trong load của trang prerender không cho `308` thật. Kiểm: nếu cần `308` đúng nghĩa, khai báo trong `vercel.json` (`redirects`), hoặc để SvelteKit sinh trang meta-refresh và chấp nhận. **Xác nhận bằng `curl -I` sau khi build.**
  - Trang chủ phải nhận phần của `/writing`: bộ lọc chủ đề (chỉ chủ đề có bài), nhóm theo năm, **toàn bộ** bài của locale (hiện `recent` chỉ 5 bài). Loader của `[lang]/+page.server.ts` cần trả đủ bài.
  - Cập nhật: `canonical`, mọi `href(lang, '/writing')` (nav, `+error.svelte`, `Placeholder`, trang chủ "all essays", footer), key `current` trong `+layout.svelte`, và `sitemap` / RSS nếu có liệt kê `/writing`. Đường dẫn bài `/[lang]/writing/[slug]` **giữ nguyên**, không đổi.

### 10.3 Chuỗi giao diện: sửa luôn trong `src/lib/i18n/messages.ts`
Tác giả muốn thay đổi chuỗi cùng đợt (nên người sửa làm trong cùng PR với từng bước ở mục 11). Hai việc:

1. **Cắt chuỗi mồ côi** (cả `en` và `vi`) khi bỏ tính năng. Danh sách cần rà, gom theo khóa trong messages:
   - cài đặt đã bỏ: layout, framing, mode (study/flow), ruler, timeLeft, lineSpacing, measure, typeface, themeAuto, theme `dusk`, mọi chuỗi của trang `/reading`;
   - `WeatherStrip` (reading contract, LOAD, need first, best when);
   - `ReadingMemoryNudge`, `ReadingMemoryGutter`;
   - `ForeEdge` (contents xoay dọc, `read`, `left`, `minLeft`, `nearlyDone`), `RunningHead`;
   - `ReaderMarks`, năm cử chỉ;
   - `ReflectionPrompt` (nếu chuyển thành liên kết ở footer, giữ lại phần câu hỏi);
   - `home.mastheadIndex`, "hand-picked", mọi chuỗi chỉ phục vụ số `01`, `ArrowMark`.
   Cách làm: tìm từng khóa bằng `grep` trong `src/`; khóa không còn nơi nào dùng thì xóa, ở **cả hai** locale để hai bản không lệch cấu trúc. Nếu type của messages bắt buộc đối xứng, `pnpm check` sẽ báo.
2. **Chuỗi mới theo thiết kế**: nav 3 mục ("Bài viết", "Chủ đề", "Giới thiệu"), footer ("Từ điển", "Tài liệu", "Giới thiệu", "RSS", "Gửi ý kiến"), dòng "Đọc tiếp", dòng meta của bài, "Đã quay lại chỗ bạn dừng · Đọc từ đầu", nhãn bộ lọc. Viết cả `en` lẫn `vi`, câu thường, không in hoa. Giữ khóa cũ cho đến khi hết chỗ dùng.
- Nhãn trong giao diện viết như câu thường (mục 3.2); không để `.toUpperCase()` hay CSS `uppercase` làm thay.

### 10.4 Xóa hay cất mã: **cất** vào `archived/`
- Vị trí: `archived/` ở **gốc repo** (ngang với `src/`), không để trong `src/`. Lý do: SvelteKit và `svelte-check` chỉ quét `src/`, nên mã cất không bị biên dịch, không làm `pnpm check` lỗi vì import `$lib` mất chỗ, và không vào bundle.
- Cấu trúc: giữ đường dẫn gốc để dễ khôi phục, ví dụ `archived/components/article/ForeEdge.svelte`, `archived/components/article/ReaderMarks.svelte`, `archived/css/fore-edge.css` (cắt từ `app.css`).
- Dùng `git mv`, không sao chép, để lịch sử file đi theo.
- Mỗi thư mục thêm `archived/README.md` một đoạn: cái gì, vì sao cất (DESIGN.md 10.1), ngày, cách khôi phục (chuyển lại vào `src/lib/components/...` và gắn lại trong `writing/[slug]/+page.svelte`).
- Phần cất theo cùng quy tắc: mọi thứ mục 6 và 7 đã đánh dấu "bỏ khỏi giao diện" mà là component hoặc trang riêng (`WeatherStrip`, `ReaderSky`, trang `/reading`, `ReadingRuler`…). **Bỏ khỏi `src/` thì cất, không xóa.** Giữ nguyên **dữ liệu** (khóa `localStorage`, bảng DB) cho đến khi tác giả nói xóa.

---

## 11. Thứ tự làm (đề xuất)

Mỗi bước độc lập, mỗi bước kết thúc bằng phép thử ở mục 9.

1. **Token**: thêm `--t-meta / --t-body / --t-h2 / --t-title`, thang khoảng cách 8 / 16 / 32 / 64, lề 32 / 16. Chưa đổi gì nhìn thấy được.
2. **Chữ**: thay Space Grotesk + Plex Sans bằng CDA Independence (tự host `woff2`, bỏ Google Fonts), bỏ `lowercase`, bỏ in hoa giãn chữ, thay mọi `font-size` bằng token. **Đây là bước đổi nhiều nhất và thấy rõ nhất.**
3. **Cột đọc 680 px**, bỏ `--measure`, `--article-w` và các `data-measure`.
4. **Cài đặt**: rút về theme + cỡ chữ; xóa `/reading`; xóa framing, layout, mode, ruler, timeLeft, lineSpacing, typeface, themeAuto, `dusk`.
5. **Đầu bài**: một dòng meta, bỏ WeatherStrip, SeriesRibbon, ReadingMemoryNudge, ReadingMemoryGutter ở đầu bài.
6. **Mục lục**: sticky bằng chữ ≥ 1180 px, ngăn kéo dưới đó; bỏ ForeEdge, RunningHead, folio; thêm thanh tiến độ 2 px.
7. **Cuối bài**: thứ tự mới ở 6.7, một mẫu khung.
8. **Nav 3 mục**, footer mới, trang chủ gộp `/writing`, FilterBar thành dòng chữ.
9. **Trang phụ**: topics + series gộp, glossary / resources một cột, error thu gọn.
10. **ReaderMarks** ẩn và cất vào `archived/` (không giữ cử chỉ nào, xem 10.1); Reading Room còn danh sách.

Thử trên bài thật bằng cả `en` và `vi` ở mỗi bước. Với 4 bài, mỗi bước kiểm được trong năm phút.

---

## 12. Trạng thái hiện thực (2026-10-28)

Nhánh `design/reader-edition`, chưa commit. `pnpm check`: 0 lỗi, 0 cảnh báo. `pnpm build`: qua; adapter-vercel sinh `308 /en/writing → /en` và `308 /vi/writing → /vi` thật trong `.vercel/output/config.json`.

**Đã làm theo mục 11, bước 1–10.**

| Bước | Kết quả đo |
| --- | --- |
| 1–2 Token, chữ | CDA Independence tự host (5 file `woff2`, 196 KB), bỏ Space Grotesk và Plex Sans khỏi Google Fonts Mono là Monaspace Xenon tự host (3.2.1). **Không còn yêu cầu nào tới Google Fonts** (đo: 0 request). Trang bài 005: cỡ chữ còn **13 / 18 / 26 / 40** (cộng KaTeX), từ 24 cỡ. Họ chữ: CDA Text / Deck / Display + KaTeX. Bỏ `lowercase`, `uppercase`, `letter-spacing` trong 52 file. |
| 3 Cột đọc | 680 px, đo được đúng 680 px. |
| 4 Cài đặt | 11 → 2 (theme Theo máy / Sáng / Tối; cỡ chữ 17 / 18 / 20). Đọc lại khóa cũ `theme` (kể cả `dusk` → sáng) và `font-size`. Trang `/reading` đã cất. |
| 5–7 Trang bài | Đầu bài: một dòng meta, không hộp. Mục lục chữ ở lề (≥ 1180 px, ≥ 3 mục), thanh "Mục lục" ở đáy dưới 1180 px, thanh tiến độ 2 px. Quay lại chỗ dừng bằng `ResumeToast`. Phụ lục một khuôn `.appendix`. |
| 8 Nav, trang chủ | Header một hàng 56 px (mobile 390 px: từ 126 px), nav 3 mục, header ẩn khi cuộn xuống trên trang bài. Trang chủ là danh sách bài; bộ lọc chỉ hiện chủ đề có bài. |
| 9 Trang phụ | Glossary / Resources: bỏ demo, một cột. `/topics`: ẩn chủ đề rỗng, hover đổi màu tít. Trang lỗi: cửa trỏ về `/` và `/topics`. |
| 10 Đánh dấu, Reading Room | ReaderMarks ẩn và cất. Reading Room còn hai danh sách: đang đọc, đã đọc xong. |
| 10.3 Chuỗi | Cắt 33 khóa / nhóm khóa mồ côi ở cả `en` và `vi` (1358 → 1181 dòng). Tiêu đề viết như câu. |
| 10.4 Cất mã | `archived/` có README liệt kê từng file, chỗ cũ và lý do. |

Mobile 390 px, đo lại: câu đầu thân bài bài 007 ở **y = 354 px** (trước: 678). Không tràn ngang ở 375 và 390 px trên 14 trang đã thử (trang chủ, 6 bài, topics, glossary, resources, about, reading-room, vault, 404), sau khi sửa thêm hai lỗi tìm thấy lúc làm: `PullQuote` đặt 1.7em hai lần (chữ 52 px, tràn), và `Tag` không cho xuống dòng ở cỡ 13 px.

**Lệch khỏi thiết kế (có chủ đích, người sửa sau xem lại):**

1. **"Gửi ý kiến"**: không chuyển xuống footer (6.7). `ReflectionPrompt` vẫn ở cuối bài nhưng **thu gọn** thành một dòng mở ra được, vì câu hỏi gắn với từng bài (theo slug) và footer không biết đang ở bài nào.
2. **Reading Room** có link ở footer. Mục 7.8 không liệt kê nó, nhưng gỡ khỏi nav mà không để link nào thì trang thành mồ côi.
3. **`viz/`, `interactive/`, `tech/` chưa áp thang chữ.** Nhãn trục, nút trong biểu đồ, code còn cỡ riêng (9–12 px). Mỗi biểu đồ cần xem từng cái, vì đổi cỡ làm vỡ bố cục SVG. Đây là việc còn lại lớn nhất của mục 3.2.
4. **Chủ đề + Loạt chưa gộp hẳn (7.4)**: `SERIES` trong `src/lib/series.ts` đang rỗng, nên chưa có gì để gộp. `/series` vẫn còn, và nav "Chủ đề" sáng cả khi ở `/series`.
5. **Header ẩn khi cuộn** chỉ trên trang bài, như mục 8.
6. **Không cần `vercel.json`**: adapter-vercel tự sinh 308 cho trang prerender chuyển hướng.

**Chưa đo:** thiết bị thật (Safari iOS, Chrome Android); phép thử mắt CDA với 5 người (mục 9, bước 2); tương phản lại sau khi bỏ `--faint` ở các trang phụ.

---

## 13. Lượt tiếp theo: bản ấn phẩm (2026-10-28)

Tác giả muốn bản đọc mang cảm giác một ấn phẩm (Digital Editorial + Swiss), như các cuốn specimen trong `inspiration/`, mà không mất khả năng đọc. Đặc tả đầy đủ ở **`DIGITAL_EDITORIAL_DESIGN.md`**. Ở đây chỉ ghi các quyết định và chỗ chúng chạm vào tài liệu này.

**Chẩn đoán (E1–E6 bên đó).** Trang chủ, bài viết, chủ đề và About đang dùng **ba lưới khác nhau**: khối 1080 px canh giữa, cột 744 px canh giữa, và chia đôi tràn mép. Lề trái nhảy 341 → 27 → 488 px khi chuyển trang. Trang chủ đề còn cỡ ngoài thang (52,5 và 17,5 px từ `TONE_STYLES`), tít xanh và chữ hoa thả. About để trống nửa trái màn hình, cắt ảnh thành một dải 220 px, và còn hộp viền duy nhất của site. Ngày tháng có ba định dạng.

**Quyết định:**

1. **Một lưới cho mọi trang**: 12 × 72 px, rãnh 32 px (1216 px). Cột lề 1–3, cột chữ 4–10 (**696 px**, thay cho 680 px ở mục 3.3), cột ngoài 11–12 cho sidenote và chú thích. Bất đối xứng có chủ đích.
2. **Thêm một bậc chữ `--t-display` 80 px** (mobile 44), chỉ một lần mỗi trang, trên trang mở. Thang thành 13 / 18 / 26 / 40 / 80. Mục 3.2 vẫn đúng cho trang chữ.
3. **Đồ đạc trang mang thông tin thật**: running head (tên bài + "Mục 3 / 8") khi đang đọc, số hiệu bài `№` (theo từng ngôn ngữ, xem quyết định bên dưới), số mục treo ở cột lề cạnh h2, nhãn khối treo ở cột lề, số hình, dấu kết vuông 8 px trong dòng cuối. Mục 6.4 bỏ folio La Mã vì nó không mang thông tin; các món này mang thông tin, nên không mâu thuẫn. Dấu kết khác ■ đứng riêng mà mục 6.7 đã bỏ: nó nằm trong dòng.
4. **Trang chủ đề**: trang mở đảo màu (nền `--ink`), tên 80 px; bỏ cỡ, leading và căn giữa trong `TONE_STYLES`; bỏ chữ xanh và chữ hoa thả; danh sách bài dùng `IndexRow` của trang chủ. `starters` / `scratchpad` vẫn rỗng (quyết định 2026-08-11).
5. **About thành trang colophon**: câu mở 80 px, ảnh chân dung 4 : 5 trong cột lề (không cắt dải), bảng Là ai / Từ / Nhịp / Chữ chuyển xuống cuối thành Colophon, Căn hầm bỏ hộp.
6. **Trang chủ như mục lục một số báo**: bài mới nhất là bìa (80 px), năm treo ở cột lề, một định dạng ngày cho cả site.
7. **Không làm**: giấy vân, bóng đổ, lật trang, chữ có chân giả sách, màu riêng cho từng chủ đề.

**Hợp đồng đọc không đổi**: thân 18 / 1.62, một cột, căn trái, 65–75 ký tự, ≥ 4 dòng thân ở màn hình đầu, không tràn ngang. Món "ấn phẩm" nào làm trượt một phép thử ở mục 9 thì bỏ món đó.

**Tác giả đã quyết** (bên đó, mục 12, 2026-10-28): (1) **không chấp nhận lỗ** trong dãy `№`: đánh số riêng theo từng ngôn ngữ, theo thứ tự xuất bản, chỉ bài công khai, kèm kiểm tra chặn bài mới có ngày cũ hơn bài mới nhất; (2) **thử** trang mở đảo màu, trên một phòng trước; (3) **thử** running head thay nav khi đang đọc; (4) **dời** câu giới thiệu trang chủ lên cột lề 13 px. **Đã hiện thực** (2026-10-28, nhánh `design/reader-edition`): trạng thái, số đo và 8 chỗ lệch ở `DIGITAL_EDITORIAL_DESIGN.md` mục 13. Mục 3.3 của tài liệu này: cột đọc giờ là 696 px.

---

_Ghi chú nguồn: nhận xét dựa trên mã trong repo, ảnh chụp màn hình `localhost:5199` (trang chủ, danh sách, bài 005), và sáu ảnh trong `inspiration/`. Lượt 2 đã đo mobile 390 px (trong iframe) và nền sáng, và đã chụp cả hai; số đo ở D12–D16. Thứ vẫn **chưa đo**: thiết bị thật (Safari iOS, Chrome Android), và màn hình đầu ở khổ 375 × 667. Phần về dashboard `/signals` là ngoại suy._
