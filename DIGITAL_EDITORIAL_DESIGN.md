# DIGITAL_EDITORIAL_DESIGN.md — maxubrq, bản ấn phẩm

Đặc tả cho lượt thiết kế thứ hai: đưa bản đọc (DESIGN.md, đã hiện thực trên nhánh `design/reader-edition`) thành một **ấn phẩm số**: Digital Editorial trên nền Swiss. Hội đồng: **Vignelli** (lưới, chữ, nhịp trang) và **Reichenstein** (đọc, màn hình, hành vi). Mọi điều về màn hình là **ngoại suy** từ nguyên tắc in.

Số đo ngày 2026-10-28, `localhost:5199`, desktop 1512 px, nền sáng: `/vi`, `/vi/writing/*`, `/vi/topics/tech`, `/vi/about`.

---

## 0. Câu hỏi và câu trả lời ngắn

**Câu hỏi của tác giả:** giữ nguyên khả năng đọc, nhưng làm cho người đọc có cảm giác đang cầm một ấn phẩm, như các cuốn specimen trong `inspiration/`.

**Phán (Vignelli):** cảm giác "ấn phẩm" không đến từ giấy giả, bóng đổ hay chữ có chân. Nó đến từ **ba thứ mà mọi cuốn sách tốt đều có**:

1. **Một lưới cho mọi trang.** Lật trang nào, lề và cột chữ cũng ở cùng chỗ. Đây là cái người đọc cảm thấy mà không gọi tên được.
2. **Nhịp trang: mở, đọc, kết.** Một trang mở (opener) chữ rất lớn, nhiều khoảng trắng; rồi trang chữ yên tĩnh; rồi một dấu kết. Inspiration toàn là nhịp này: chữ 170 pt trên một nửa trang, rồi một trang chữ 9 pt.
3. **Đồ đạc của trang (page furniture) mang thông tin thật:** running head, số mục, nhãn treo ở lề, chú thích hình. Không có cái nào để trang trí.

**Phán (Reichenstein):** đồng ý, với một điều kiện không thương lượng: **cột đọc không đổi.** Thân bài 18/1.62, khoảng 70 ký tự, một cột, căn trái. Mọi thứ "ấn phẩm" xảy ra ở lề, ở trang mở và ở nhịp. Không có gì xảy ra bên trong đoạn văn.

> Yêu sự phong phú, ghét sự rắc rối. Ấn phẩm là thêm cấu trúc, không phải thêm đồ.

---

## 1. Chẩn đoán: vì sao Topic và About lệch khỏi trang chủ và bài viết

| # | Đo được | Hệ quả |
|---|---|---|
| E1 | **Ba lưới khác nhau.** Trang chủ là khối 1080 px canh giữa. Bài viết là cột 744 px canh giữa, mục lục treo cố định bên trái. Chủ đề và About chia đôi màn hình (`1fr 1fr`, `1fr 34%`), **tràn mép**, chữ bắt đầu ở x = 27 px. | Chuyển trang thì lề trái nhảy từ 341 px (trang chủ) về 27 px (chủ đề) rồi về 488 px (bài). Đây là cảm giác "không hài hòa". |
| E2 | Trang chủ đề có **cỡ ngoài thang**: 52,5 px và 17,5 px (từ `TONE_STYLES` trong `src/lib/topics.ts`: mỗi phòng một cỡ thân 17,5 / 18 / 19 / 21). | Phá thang 13 / 18 / 26 / 40. Một trang có thân 17,5 cạnh một trang 18 trông như in ở hai nhà in khác nhau. |
| E3 | Trang chủ đề còn **tít màu xanh** ("Phần mềm"), **chữ hoa thả xanh** ("M"), và nhãn xanh ("Lời người biên tập", "Chủ đề 02 / 06"). | Trái quy tắc màu ở DESIGN.md 3.1: xanh chỉ dùng làm tín hiệu. Các trang khác đã bỏ, trang này chưa. |
| E4 | About: cột thông tin (Là ai / Từ / Nhịp / Chữ) đứng ở mép trái, nội dung bắt đầu ở giữa màn hình (x = 756), **nửa trái để trống** từ y = 500 trở xuống. Ảnh chân dung bị cắt thành một dải 220 px, chỉ còn hai con mắt. | Khoảng trắng ở đây là chỗ thừa, không phải khoảng lặng có chủ đích. Ảnh cắt kiểu đó là trang trí, không phải chân dung. |
| E5 | Ngày hiển thị ba kiểu: `09·22` (trang chủ), `22.09.2026` (bài viết), `22 thg 9, 2026` (trang chủ đề). Nhãn có chỗ viết thường ("thuộc Phần mềm", "tất cả bài viết →"). | Một ấn phẩm có một văn phong (house style). Ba kiểu ngày là ba biên tập viên. |
| E6 | About có một hộp viền (Căn hầm) với tít xanh 26 px. Các trang khác đã bỏ hộp. | Hộp duy nhất còn lại trên site. |

Kết luận: không cần thêm gì cho Topic và About để chúng "hài hòa". Chỉ cần **đặt chúng lên cùng một lưới** và **áp cùng thang, cùng văn phong** (mục 2, 3, 7, 8).

---

## 2. Lưới: một lưới 12 cột cho mọi trang

### 2.1 Thông số (desktop ≥ 1280 px)

```
lề ngoài  32 │ 1  2  3 │ 4  5  6  7  8  9  10 │ 11  12 │ 32
             │  LỀ     │       CHỮ            │ NGOÀI  │
             │ 280 px  │      696 px          │ 176 px │
```

- **12 cột × 72 px, rãnh 32 px.** Tổng 12 × 72 + 11 × 32 = **1216 px**. Lề ngoài 32 px, nên lưới đầy đủ ở màn hình ≥ 1280 px. Canh giữa trên màn hình rộng hơn.
- **Cột chữ = cột 4–10** (7 cột): 7 × 72 + 6 × 32 = **696 px**. Ở 18 px CDA Text là khoảng 72–75 ký tự. Thay cho 680 px hiện nay: chênh 16 px, vẫn trong đích 65–75 ký tự (đo lại bằng bài thật).
- **Cột lề = cột 1–3** (280 px): kicker, nhãn treo, số mục, mục lục, ngày, ghi công ảnh.
- **Cột ngoài = cột 11–12** (176 px): sidenote, chú thích hình, hình nhỏ. Sidenote hiện rộng 240 px; về 176 px là khoảng 24 ký tự mỗi dòng ở 13 px, đủ cho một ghi chú.
- **Bất đối xứng có chủ đích.** Cột chữ không nằm giữa màn hình: lề trái 312 px, lề phải 208 px. Đây là trang Swiss: căng thẳng tạo bởi khoảng trắng không đều, không phải bởi đồ trang trí. Người đọc chỉ thấy một cột chữ ổn định.
- **Token:** `--grid-col: 72px; --grid-gap: 32px; --grid-max: 1216px;` và một lớp tiện ích `.grid` (12 cột) cùng các vùng có tên: `margin` (1/4), `text` (4/11), `outer` (11/13), `spread` (1/13), `wide` (4/13).

### 2.2 Ba khổ

| Khổ | Lưới | Cột chữ | Cột lề | Cột ngoài |
|---|---|---|---|---|
| ≥ 1280 px | 12 cột như trên | cột 4–10 | cột 1–3 | cột 11–12 |
| 900–1279 px | 8 cột, rãnh 24 px | cột 1–8, tối đa 696 px, canh giữa | **gập vào dòng kicker** phía trên cột chữ | sidenote về trong dòng (bấm để mở) |
| < 900 px | 4 cột, lề 16 px | toàn bộ | gập vào kicker | trong dòng |

Mục lục: ≥ 1280 px đứng trong cột lề (sticky); dưới đó là thanh "Mục lục" ở đáy (đã có).

### 2.3 Luật một dòng

- **Mọi thứ trong cột lề treo theo baseline của dòng đầu tiên** ở cột chữ cùng hàng: nhãn mục, ngày, số hình. Như inspiration: nhãn "18/20pt" đứng sát rule, chữ treo ngay dưới.
- **Rule chạy hết lưới (cột 1–12)** ở những chỗ chia phần lớn (dưới trang mở, trước phụ lục). Rule mảnh chỉ chạy trong vùng của nó.
- Khoảng cách dọc giữ thang 8 / 16 / 32 / 64 (DESIGN.md 3.3).

---

## 3. Thang chữ: thêm đúng một bậc cho trang mở

| Token | px | Dùng cho | Họ |
|---|---|---|---|
| `--t-meta` | 13 | nhãn, kicker, ngày, chú thích, running head | CDA Text |
| `--t-body` | 18 / 1.62 | thân bài, mô tả | CDA Text |
| `--t-h2` | 26 / 1.25 | tiêu đề mục trong bài | CDA Deck |
| `--t-title` | 40 / 1.1 | tít trong danh sách, tít trang phụ | CDA Display |
| **`--t-display`** (mới) | **80 / 1.0** (mobile 44) | **chỉ trên trang mở**: tít bài, tên chủ đề, câu mở của About, năm trong mục lục số | CDA Display |

- 18 → 40 → 80: mỗi bậc gấp đôi bậc dưới (H10: một, gấp đôi). Bậc 26 nằm giữa vì bài dài cần nó, như DESIGN.md đã chốt.
- **Một chữ display mỗi trang.** Không có trang nào hai cỡ 80. Đây là chỗ inspiration lấy sức mạnh: một chữ rất lớn, mọi thứ khác rất nhỏ. Hai chữ lớn là la hét.
- `--t-display` ở 80 px dùng `letter-spacing: -0.01em` (Display đã khít; không ép thêm). Phép thử: dấu tiếng Việt chồng tầng (Ấ, Ổ, Ữ) không đụng dòng trên ở line-height 1.0. Nếu đụng, nâng lên 1.05.
- Số trong nhãn và mục lục: `font-variant-numeric: tabular-nums` (đã có `tnum`).
- Mono: Monaspace Xenon, chỉ trong code (DESIGN.md 3.2.1). Không dùng mono để "giả ấn phẩm".

---

## 4. Đồ đạc của trang (page furniture)

Mỗi món dưới đây là một thứ một cuốn sách có, kèm thông tin thật nó mang. Món nào không mang được thông tin thật thì không làm. Đó là lý do số La Mã và fore-edge đã bị bỏ, và không quay lại.

| Món | Ở đâu | Mang thông tin gì | Quy cách |
|---|---|---|---|
| **Running head** | trong header, chỉ trên trang bài, khi đã cuộn qua trang mở | Bạn đang ở bài nào, mục nào | Thay chỗ nav khi header hiện lại (cuộn lên): trái `maxubrq.`, giữa **tên bài**, phải **"Mục 3 / 8"** (số thật, từ `toc`). 13 px. Như "RM Pro … Full Font Overview" trên đầu trang specimen. |
| **Số hiệu bài** | kicker của bài, IndexRow, running head | Thứ tự xuất bản trong ngôn ngữ đó; bài mới luôn nhận số kế tiếp | Đánh số riêng cho từng locale, chỉ bài công khai, không có lỗ (quyết định 12.1). In `№ 005`. Khác số "01" đã bỏ ở trang chủ: số đó đổi mỗi khi có bài mới; số này không đổi và trích dẫn được. |
| **Nhãn treo** | cột lề | Tên mục của khối bên phải | 13 px, weight 600, treo cùng baseline dòng đầu. Thay cho tiêu đề nhỏ đứng trên khối. |
| **Số hình** | cột ngoài, cạnh hình / hình tương tác | "Hình 3" và một câu chú thích | 13 px, muted. Đánh số tự động theo thứ tự trong bài. Chú thích không nằm trong khung hình. |
| **Dấu kết** | cuối đoạn văn cuối cùng, trong dòng | Bài hết ở đây | Một ô vuông 8 × 8 px màu `--blue`, cách chữ cuối một khoảng trắng hẹp. Vẽ bằng CSS (`::after` trên đoạn cuối), vì CDA không có ■. Như "END" trong trang tạp chí của inspiration. DESIGN.md 6.7 đã bỏ ■ đứng một mình giữa cột; dấu này khác: nó nằm trong dòng, nên không thêm một hàng. |
| **Dòng chân trang (imprint)** | footer | Ai xuất bản, khi nào, bằng chữ gì | `© 2026 maxubrq · Chữ: CDA Independence, Monaspace Xenon`, rồi các liên kết. Một dòng, 13 px. |

**Không làm:** giấy có vân, bóng đổ trang, hiệu ứng lật trang, chữ có chân giả sách, số trang, mép giấy. Đó là đóng kịch, không phải ấn phẩm (Vignelli: "chữ dog không cần biết sủa"). Lý do thực dụng: mỗi hiệu ứng là một thứ phải vẽ lại khi đổi theme, và nó cũ đi sau một mùa.

---

## 5. Màu: bảng in hai màu

Inspiration in bằng **một màu mực và một màu tín hiệu** (đen + vàng, đen + đỏ, xanh trên trắng). Site đã đúng như vậy. Thêm đúng một điều:

- **Đảo màu cho trang mở của chủ đề** (mục 7): nền `--ink`, chữ `--paper`. Như spread đen "Aeonik Black" trong inspiration. Ở theme tối thì tự đảo ngược (nền sáng, chữ tối) mà không cần token mới, vì nó chỉ đổi chỗ hai token.
- Không thêm màu thứ ba. Mỗi chủ đề **không** có màu riêng. Lý do: sáu chủ đề sáu màu là sáu ấn phẩm, và màu sẽ cạnh tranh với màu tín hiệu.
- Ảnh halftone giữ một màu theo theme (đã có).

---

## 6. Trang bài: trang mở rồi trang chữ

### 6.1 Trang mở (opener)

```
cột lề (1–3)               cột chữ + ngoài (4–12)
──────────────────────────────────────────────────────── rule 1.5 px, cột 1–12
Tech                      
№ 005                     Từ vựng trường dùng
12 phút đọc               trong hệ thống phân tán          ← 80 px Display, cột 4–12
22.09.2026                
Đọc bản tiếng Anh →       Và cũng thường nhầm lẫn          ← 18 px muted, cột 4–10
──────────────────────────────────────────────────────── rule 1.5 px, cột 1–12
                          (64 px)
                          Thân bài bắt đầu…                ← cột 4–10
```

- Toàn bộ meta (chủ đề, số hiệu, phút, ngày, bản dịch) **dời từ dòng meta dưới tít vào cột lề**, xếp dọc, treo theo baseline dòng đầu của tít. Tít đứng một mình. Đây là phần lớn nhất của "cảm giác ấn phẩm", và nó không đụng tới cột đọc.
- Tít 80 px chạy cột 4–12 (928 px), nên tít dài vẫn ngắt hai, ba dòng như trang mở tạp chí.
- **Màn hình đầu vẫn phải có chữ thân** (phép thử DESIGN.md 9.4: ≥ 4 dòng ở 1512 × 795). Tít 80 px hai dòng là 160 px. Nếu tít dài quá ba dòng thì hạ về 64 px cho bài đó. Luật này viết thành code, không để tác giả chọn tay.
- **Ảnh bìa** (nếu bài có): một hình halftone **cột 1–12, tỉ lệ 3 : 1**, ngay dưới rule thứ hai, trước thân bài. Không có bìa thì không có ô trống.
- Mobile: kicker một dòng (`Tech · № 005 · 12 phút`), tít 44 px, phụ đề, rồi thân bài.

### 6.2 Trang chữ

- Thân bài cột 4–10. Không đổi gì ở cỡ, leading hay màu.
- **Tiêu đề mục (h2) treo**: số mục trong cột lề (`01`, `02`, 13 px, tabular, cùng baseline), chữ tiêu đề 26 px trong cột chữ. Số mục lấy từ `toc`, và là cùng con số running head dùng. Mục lục trong cột lề đổi sang sticky **phía dưới** trang mở, không đè lên kicker.
- **Sidenote** và **chú thích hình** ở cột 11–12.
- **PullQuote**: chữ 26 px trong cột chữ (cột 4–10), rule trên và dưới. _Sửa lúc hiện thực:_ bản đầu cho nó lấn sang lề một cột; bỏ, vì nó trượt xuống dưới mục lục (xem luật bên dưới).
- **Hình tương tác**: rộng cột 4–12 (`wide`) nếu cần chỗ, tức là chỉ lấn sang **phải**.
- **Luật cột lề cạnh thân bài** (chốt sau hai lần va chạm): bên cạnh thân bài, cột lề (1–3) **thuộc về mục lục sticky**. Không gì trong thân bài được lấn sang trái quá cột chữ. Thứ cần thêm chỗ thì lấn sang phải, vào cột ngoài (11–12), như sidenote. Nhãn treo ở lề chỉ dùng ở trang mở và ở phụ lục, là hai hàng lưới mục lục không chạy tới.
- Dấu kết sau đoạn cuối (mục 4).

### 6.3 Phụ lục

Giữ khuôn `.appendix` hiện tại, nhưng **nhãn treo trong cột lề** thay vì đứng trên khối: "Một câu để nhớ", "Đọc tiếp theo", "Nguồn (1)", "Thuật ngữ (10)". Nội dung khối ở cột chữ. Rule 1,5 px chạy cột 1–10.

---

## 7. Trang chủ đề (`/topics/[topic]`): làm lại

**Việc chính:** vào một phòng, biết phòng này là gì, chọn một bài.

```
[nền đảo: --ink]  cột 1–12, cao ~60vh tối đa 560 px
  cột lề:  Chủ đề 2 / 6        cột 4–12:  Phần mềm            ← 80 px Display, --paper
           3 bài viết                     Hai chế độ: viết để giải thích,
                                          xây dựng để ra mắt.  ← 18 px
                                                        [ảnh halftone cột 9–12, bên phải]
──────────────────────────── (hết nền đảo)
cột lề: Lời người biên tập     cột 4–10: ba đoạn ghi chú, 18 / 1.62, ký "— m." căn phải cột chữ
──────────────────────────── rule 1.5 px cột 1–12
cột lề: Bài viết (3)           cột 4–12: IndexRow như trang chủ (ngày · tít · phút)
──────────────────────────── rule mảnh
cột lề: Các chủ đề khác        cột 4–12: Khoa học · Triết học · Nghệ thuật · …  (13 px, một dòng)
```

Quyết định:

- **Trang mở đảo màu** (mục 5). Đây là chỗ duy nhất trên site dùng nền đảo, để mỗi phòng có một "trang lót" như mở một chương sách. Tên chủ đề ở 80 px là chữ display duy nhất của trang.
- **Bỏ `TONE_STYLES` cho cỡ chữ** (E2). Mọi ghi chú biên tập 18 / 1.62 như thân bài. Giữ được hai biến thể của tone khi tác giả muốn: `italic` (cho phòng "literary") và độ rộng hẹp hơn (`48ch`). Bỏ `size`, `lh`, căn giữa (`align: center`): căn giữa một đoạn văn dài làm mắt mất mép trái.
- **Bỏ chữ hoa thả và mọi chữ xanh** trên trang (E3). Xanh chỉ còn ở liên kết.
- **Ảnh phòng** (`room.plate`): thu về cột 9–12 trong trang mở đảo màu, tỉ lệ 4 : 5, halftone đảo theo nền. Không còn một ô ảnh cao 600 px cạnh ghi chú.
- **Danh sách bài dùng đúng `IndexRow` của trang chủ**, cùng định dạng ngày `09·22` (E5). Tiêu đề khối viết hoa đầu câu ("Bài viết", không phải "thuộc Phần mềm").
- **Các chủ đề khác** dời từ thanh trên đầu trang xuống cuối trang, như mục lục cuối chương. Đầu trang chỉ có header site; breadcrumb là chữ "Chủ đề 2 / 6" trong cột lề.
- `starters` và `scratchpad` **vẫn rỗng**, theo quyết định ngày 2026-08-11 (đừng điền lại). Khi điền, chúng là hai khối phụ lục cùng khuôn `.appendix`, nhãn treo ở cột lề.
- Mobile: trang mở đảo màu cao tối đa 360 px, tên 44 px, ảnh ẩn (đã có ở lề ảnh desktop; mobile không đủ chỗ cho cả chữ lớn và ảnh).

---

## 8. About: làm lại thành trang colophon của ấn phẩm

**Việc chính:** biết ai viết, viết về gì, tìm ở đâu.

```
cột lề: Giới thiệu            cột 4–12: Một cuốn sổ tay,
                                        giữ nơi công khai.     ← 80 px Display (chữ display duy nhất)
──────────────────────────── rule 1.5 px cột 1–12
cột lề: (ảnh chân dung        cột 4–10: Hi! Mình là maxubrq… (thân bài 18 px)
        halftone 4:5,
        rộng 280 px)
──────────────────────────── rule cột 1–10
cột lề: Mình viết về gì       cột 4–10: danh sách 2 cột: tên chủ đề (18, weight 600) + một câu (18, muted)
──────────────────────────── rule
cột lề: Căn hầm               cột 4–10: một câu mô tả + "Vào căn hầm →"   (không hộp)
──────────────────────────── rule
cột lề: Ở nơi khác            cột 4–10: GitHub · Email · RSS (bảng 2 cột hiện có)
──────────────────────────── rule
cột lề: Colophon              cột 4–10: bảng: Là ai · Từ · Nhịp · Chữ · Lưới · Màu
                                        (cuối trang, như trang colophon cuối sách)
```

Quyết định:

- **Ảnh chân dung không cắt dải** (E4). Ảnh đặt trong cột lề, tỉ lệ 4 : 5, rộng 280 px, đứng cạnh đoạn giới thiệu. Một khuôn mặt (hay một con mèo) cần thấy cả khuôn mặt. Trên mobile: ảnh rộng toàn cột, tỉ lệ 4 : 5, giữa tít và đoạn giới thiệu.
- **Bảng thông tin (Là ai / Từ / Nhịp / Chữ) chuyển xuống cuối thành Colophon.** Ở đầu trang nó là đồ đạc không ai cần trước khi biết người viết. Ở cuối nó là một trang colophon đúng nghĩa: thêm "Lưới: 12 × 72 / 32" và "Màu: mực + xanh #1a24df". Ghi công CDA (theo README của họ) đặt ở đây.
- **Căn hầm bỏ hộp và tít xanh** (E6). Thành một khối phụ lục như mọi khối khác, liên kết là thứ xanh duy nhất.
- **Nhãn chủ đề trong "Mình viết về gì" không xanh**: tên chủ đề weight 600, màu mực; nó vẫn là liên kết tới trang chủ đề như hiện nay, chỉ đổi xanh khi rê chuột.
- Mọi nhãn ở cột lề, treo theo baseline. Nửa trái màn hình không còn trống: nó là cột lề có nhãn ở mỗi khối.

---

## 9. Trang chủ: mục lục của một số báo

Trang chủ hiện tại đã gần đúng. Ba chỉnh sửa để nó đứng trên cùng lưới và đọc như trang mục lục:

1. **Bài mới nhất là trang bìa (cover story):** tít ở `--t-display` 80 px (chữ display duy nhất của trang chủ), cột 4–12; meta trong cột lề; ảnh halftone cột 1–12 tỉ lệ 3 : 1 phía dưới. Thay cho bố cục chia đôi chữ / ảnh hiện tại.
2. **Năm treo ở cột lề** (`2026`, 26 px Deck, tabular), danh sách bài ở cột 4–12. Như mục lục sách: số chương ở lề, tên chương ở cột.
3. **IndexRow thêm số hiệu**: `№ 005` ở cột lề thay cho ngày `09·22`, ngày dời sang cột phải cùng số phút (`22.09 · 12 phút`). Một định dạng ngày cho cả site: `22.09.2026` khi đứng một mình, `22.09` khi năm đã có ở tiêu đề nhóm (E5).
- Câu giới thiệu ("Viết về những điều…") đứng ở cột lề, 13 px, ngay đầu trang, như dòng tựa trên bìa tạp chí. Không còn chiếm một dòng 18 px trên cột chữ.
- Bộ lọc chủ đề: giữ, đứng ở cột 4–12 trên danh sách.

---

## 10. Những gì không thay đổi (bảo vệ khả năng đọc)

Đây là hợp đồng với người đọc, đo bằng các phép thử ở DESIGN.md mục 9. Bản ấn phẩm **không được** làm hỏng con số nào trong đây:

| Phép thử | Đích | Hiện tại |
|---|---|---|
| Thân bài | 18 / 1.62, CDA Text, một cột, căn trái | đạt |
| Ký tự mỗi dòng | 65–75 | 680 px → 696 px, đo lại |
| Màn hình đầu bài, 1512 × 795 | ≥ 4 dòng thân bài | phải đo lại với tít 80 px + kicker ở lề |
| Màn hình đầu bài, 390 × 844 | câu đầu ở y ≤ 420 | 354 px hiện tại; tít mobile 44 px có thể đẩy xuống, đo lại |
| Tràn ngang 375 / 390 px | không | đạt; đo lại sau khi có `wide` và PullQuote lấn lề (cả hai chỉ lấn ở ≥ 1280 px) |
| Cỡ chữ mỗi trang | ≤ 5 giá trị (thêm 80) | 4 |
| Màu | mực, giấy, muted, rule, xanh | đạt |

**Luật xung đột** (Tiêu chuẩn A10): nếu một món "ấn phẩm" nào làm trượt một phép thử ở bảng trên, món đó bỏ, phép thử giữ.

---

## 11. Thứ tự làm

Mỗi bước tự đứng được, và mỗi bước kết thúc bằng các phép thử ở mục 10.

1. **Lưới**: token `--grid-*`, lớp `.grid` và các vùng có tên. Chuyển trang bài sang lưới (cột chữ 4–10, mục lục cột lề, sidenote cột 11–12). Chưa đổi gì ở trang mở.
2. **Thang**: thêm `--t-display`. Một định dạng ngày (`dmy` và `dm`) cho mọi trang.
3. **Trang mở của bài**: meta dời vào cột lề, tít 80 px, ảnh bìa 3 : 1 khi có. Luật hạ tít về 64 px khi dài quá ba dòng.
4. **Đồ đạc**: số hiệu `№`, số mục treo ở h2, running head trong header, dấu kết, số hình. Mỗi món một commit, để tháo riêng được.
5. **Trang chủ đề** theo mục 7. Bỏ `size`, `lh` và `align` trong `TONE_STYLES`.
6. **About** theo mục 8.
7. **Trang chủ** theo mục 9.
8. **Trang phụ** (topics hub, glossary, resources, reading room, vault, 404): chỉ cần đặt lên lưới, nhãn khối dời vào cột lề. Không có trang mở 80 px, trừ vault nếu tác giả muốn (vault là "phòng riêng", xứng đáng có trang lót).

---

## 12. Quyết định của tác giả (2026-10-28, đã chốt)

Bốn điểm hội đồng để mở. Tác giả đã trả lời; người làm theo, không hỏi lại.

1. **Số hiệu `№`: không chấp nhận lỗ → đánh số riêng cho từng ngôn ngữ.**
   - Số là thứ tự xuất bản **trong locale đó**: bài công khai cũ nhất của `/vi` là `№ 001`, rồi tăng dần theo ngày. Bản `/en` có dãy riêng. Không lấy số từ tên file nữa (tên file `005-…` giữ nguyên, chỉ là tên file).
   - Chỉ bài **đã công khai và có trong danh sách** mới có số. Bài nháp (`draft`), phòng walk-in (`unlisted`) không có số và không chiếm số.
   - **Luật ổn định**: bài mới luôn nhận số kế tiếp. Vì số tính theo ngày, một bài được đăng với ngày cũ hơn bài đã có số sẽ làm dịch dãy số. Người làm thêm một kiểm tra ở `scripts/` hoặc lúc build: nếu một bài mới có ngày nhỏ hơn bài mới nhất đã công khai trong cùng locale thì báo lỗi, để tác giả chọn ngày khác thay vì âm thầm đánh lại số.
   - Hệ quả cần biết: hai bản dịch của cùng một bài **có thể mang hai số khác nhau** (ví dụ `№ 004` ở `/vi`, `№ 003` ở `/en`). Đó là đúng: mỗi locale là một ấn phẩm riêng, như bản tiếng Anh và tiếng Việt của một tạp chí đánh số riêng.
   - Tính số ở một chỗ (trong `src/lib/content/posts.ts`, khi lập danh sách theo locale) và truyền xuống, để trang chủ, kicker của bài và running head luôn nói cùng một số.
2. **Trang mở đảo màu cho chủ đề: thử.**
   - Làm trên **một phòng trước** (đề xuất `tech`, phòng nhiều bài nhất), xem trên cả hai theme và ở 390 px, rồi mới áp cho cả sáu.
   - Phép thử trước khi nhân rộng: chữ 80 px `--paper` trên nền `--ink` đạt tương phản ≥ 7 : 1 ở cả hai theme; ảnh halftone đảo đúng màu trên nền đảo; trang mở cao không quá 560 px desktop / 360 px mobile.
3. **Running head thay nav khi đang đọc: thử.**
   - Khi người đọc đã cuộn qua trang mở của bài và header hiện lại (cuộn lên), header là running head: `maxubrq.` · tên bài · "Mục 3 / 8". Ở đầu bài (chưa qua trang mở) header vẫn là nav bình thường.
   - `maxubrq.` vẫn là liên kết về trang chủ; ba nav còn ở footer. Ba công cụ (Tìm, VI/EN, Cài đặt) **giữ** trong running head.
   - Phép thử: running head một dòng ở 390 px (tên bài cắt bằng dấu `…`), cao vẫn 56 px.
4. **Câu giới thiệu trang chủ: dời lên cột lề, 13 px.**
   - Ở ≥ 1280 px: cột lề, hàng đầu trang chủ, treo cùng baseline với tít bài bìa. Dưới 1280 px: một dòng 13 px muted phía trên bài bìa.

---

## 13. Trạng thái hiện thực (2026-10-28)

Nhánh `design/reader-edition`, chưa commit. `pnpm check`: 0 lỗi, 0 cảnh báo. `pnpm build`: qua.

**Đã làm, theo mục 11 bước 1–8 và quyết định mục 12:**

| Bước | Kết quả đo |
| --- | --- |
| 1 Lưới | Token `--grid-col/gap/max`, lớp `.grid` + vùng `g-margin / g-text / g-outer / g-wide / g-spread`, `.sheet` cho trang phụ. Cột chữ đo được **696 px**, mép trái x = 604 px ở khung 1800 px trên bài, trang chủ, chủ đề, About, Glossary. |
| 2 Thang | `--t-display` 80 px (64 px khi tít dài, 44 px mobile). Ngày: `22.09.2026` và `22.09`; bỏ `09·22` và `22 thg 9, 2026`. |
| 3 Trang mở bài | Meta treo ở cột lề, **cùng baseline** với dòng đầu tít (đo: cùng y = 193). Màn hình đầu 1512 × 795: **7–11 dòng thân** (đích ≥ 4). Mobile 390 × 844: câu đầu ở **y = 336–404** (đích ≤ 420). |
| 4 Đồ đạc | Running head ("tên bài · Mục 2 / 22") khi đã qua trang mở; số hiệu `№` từ sổ cái; số mục trước mỗi h2 và trong mục lục; dấu kết; dòng imprint ở footer. |
| 5 Chủ đề | Trang mở 80 px, nhãn treo ở lề, danh sách bài dùng `IndexRow`, các phòng khác ở cuối trang. Trang mở đảo màu **chỉ ở `tech`** (`INVERTED_TRIAL`): cao 478 px, tương phản tít 14,7 : 1 (sáng) / 13,7 : 1 (tối). `TONE_STYLES` còn `italic` và `maxW`. |
| 6 About | Trang colophon: câu mở 80 px, ảnh 4 : 5 trong cột lề, khối có nhãn treo, Căn hầm không hộp, Colophon cuối trang kèm ghi công CDA và Monaspace. |
| 7 Trang chủ | Câu giới thiệu ở cột lề 13 px; bài bìa 80 px + ảnh 3 : 1; năm treo ở lề; mỗi hàng mở bằng `№`. Cỡ chữ trên trang: 13 / 18 / 26 / 80. |
| 8 Trang phụ | Topics hub, Glossary, Resources, Reading room, Vault, Series, Series/[id] dựng trên `.sheet`, mép trái cột 4. |
| 12.1 Số hiệu | `content/numbers.json` là sổ cái, số riêng từng ngôn ngữ (vi 1–5, en 1–4). Build dừng kèm cách sửa khi thiếu số, khi số có lỗ hoặc trùng, khi số đi ngược ngày. Đã thử cả hai ca âm. |

Không trang nào tràn ngang ở 375 và 390 px (13 trang đã thử).

**Lệch khỏi đặc tả (có chủ đích):**

1. **Số mục không treo ở cột lề.** Cột lề là chỗ mục lục sticky chạy, và hai thứ đè nhau (thấy trên màn hình). Số mục thành một dòng nhãn 13 px ngay trên mỗi h2, ở mọi khổ; mục lục cũng đánh số để hai bên khớp nhau.
2. **Không đánh số hình bằng CSS.** Các hình tương tác đã tự ghi "Figure 4" trong khung. Thêm một counter là có hai hệ số có thể lệch nhau (A9).
3. **Dấu kết chỉ hiện khi đoạn văn thật sự là phần tử cuối.** Bài kết bằng một hình thì kết ở hình.
4. **Luật hạ tít về 64 px đếm ký tự (> 64), không đo số dòng thật.** Đúng trên các bài hiện có (tít 68 ký tự → 3 dòng ở 64 px). Nếu sai trên bài sau, đổi sang đo bằng script.
5. **Running head giữ ba công cụ** (Tìm, VI/EN, Cài đặt). Chỉ ba mục nav nhường chỗ.
6. **Trang phụ mới lên lưới, chưa có nhãn treo ở lề.** Cấu trúc bên trong Glossary, Resources, Vault, Series giữ nguyên. Trang 404 chưa lên lưới.
7. **Header và footer vẫn tràn mép**, không nằm trên lưới. Chúng là phần khung của site, không phải trang.
8. **Thêm một số hiệu mới**: viết bài, rồi thêm một dòng vào `content/numbers.json`. Build in ra đúng dòng cần thêm.
9. **Phụ lục là một hàng lưới riêng sau thân bài** (sửa sau phản hồi của tác giả). Mục lục sticky ở cột lề chỉ trượt trong hàng của thân bài, nên dừng ở dòng cuối của bài. Khi phụ lục còn chung hàng, một mục lục dài (bài 005 có 22 mục) trượt xuống đè lên các nhãn "Nếu chỉ nhớ một câu", "Nguồn", "Thuật ngữ" treo ở lề. Đo lại ở 5 vị trí cuộn: không chồng lần nào, đáy mục lục cách nhãn đầu tiên 80 px.
10. **PullQuote không còn lấn lề** (sửa sau phản hồi của tác giả). Nó lấn 104 px sang cột lề, và mục lục sticky trượt qua nó. Giờ quote nằm trong cột chữ: bài 001, hai quote, mép trái x = 604 px, mục lục kết thúc ở 572 px, đo ở 8 vị trí cuộn không chồng lần nào. Đã soát mọi margin âm trong `src/lib/components` và `PostBody`: chỉ còn `RevisionBody` lùi 18 px, nằm trong rãnh 32 px, không chạm mục lục. Luật cột lề ở mục 6.2 ngăn lỗi này quay lại.

**Chưa đo:** thiết bị thật; nền tối cho mọi trang trừ trang mở đảo màu; ảnh bìa bài (chưa bài nào có `coverImage`).

---

_Ngoại suy: các luật về khổ màn hình, running head khi cuộn và nền đảo trong theme tối là suy ra từ nguyên tắc in, chưa có trên giấy của Vignelli. Chưa đo: mọi con số trong mục 10 sau khi làm, trên thiết bị thật._
