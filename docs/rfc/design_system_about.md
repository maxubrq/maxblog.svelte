# RFC: trang About qua hội đồng Vignelli × Reichenstein

- Trạng thái: đã áp #1, #3, #4, #5. #2 làm cả hai: trong trang, và đổi `--muted` toàn site trong `app.css` (sáng `#6b6b73`, dusk `#6b6458`; bảng màu mẫu ở `/reading` đổi theo). Trần cột đổi từ 66ch thành 58ch sau khi đo: 66ch cho 80 ký tự tiếng Việt một dòng, 58ch cho 67–73.
- Phạm vi: `src/routes/[lang=lang]/about/+page.svelte`. Một chỗ sửa (#2) đụng token chung trong `src/app.css`.
- Ngày: 2026-10-19

## Việc chính và nghĩa

**Việc chính:** cho người lạ biết ai đang viết ở đây, để họ chọn một cửa đi tiếp.

**Nghĩa:** người đọc lần đầu, thường đến từ một bài viết, đọc trên điện thoại hoặc desktop. Trang sống nhiều năm, ít khi đổi.

**Phán tổng thể:** cấu trúc đúng hướng: rule đậm, rail mono, cửa vào căn hầm là lời mời duy nhất. Nhưng trang không giữ được lời hứa của chính nó ở chỗ quan trọng nhất là đọc. Cột bio quá rộng để đọc. Trên điện thoại, dòng bio đầu tiên rơi ra ngoài màn hình đầu.

## Đã đo gì

Đo trên dev server (`localhost:5173/vi/about`), giao diện tối. Desktop thật là viewport 1800 px vì cửa sổ không co về 1440 được, nên số 1440 bên dưới là **tính từ CSS**, không phải đo. Số 375 px đo bằng một iframe rộng 375 px. Tương phản tính bằng công thức WCAG trên token trong `app.css`.

| Đo | Giá trị |
|---|---|
| Rộng cột bio @1800 | 1228 px, khoảng 131 ký tự/dòng ở 18 px |
| Rộng cột bio @1440 (tính) | khoảng 904 px, khoảng 97 ký tự/dòng |
| Đỉnh dòng bio đầu @375 | y = 804 px, màn hình cao 812 px |
| Số cỡ chữ trên trang | 10: 52 · 30 · 24 · 18 · 14.5 · 14 · 13 · 12 · 10.5 · 9.5 |
| Trục mép trái @1800 | 4: 30 (h1) · 134 (rail) · 438 (bio) · 900 (chân dung) |
| `--muted` trên `--paper` (sáng) | 4.25:1 |
| `--muted` trên `--paper` (sepia) | 3.99:1 |
| `--muted` trên `--paper` (tối) | 5.74:1 |
| Vùng bấm link chủ đề | 62 × 22 px (chỉ cái Tag) |
| Scribble vs chữ nhấn "công khai" @1800 | scribble rộng 210 px, chữ rộng 225 px; nét dưới cắt ngang chữ |
| Scribble @375 | cắt ngang chữ rõ hơn |

## Năm chỗ sửa

Xếp theo luật của hội đồng: chạy trước, đẹp sau. Bốn chỗ đầu là lỗi chạy (Tiêu chuẩn A bậc 3: đọc được, tiếp cận được). Chỗ cuối là lỗi hình.

### 1. Cột đọc quá rộng; bio rơi khỏi màn đầu trên điện thoại

**Phần tử:** `.body` (`grid-template-columns: 270px minmax(0, 1.2fr)`, `max-width: 90%`) và thứ tự rail → bio ở ≤ 860 px.

**Nghĩa:** bio là việc chính của trang. Cột 97–131 ký tự làm mắt lạc dòng khi quay về đầu dòng sau. Hội đồng đặt trần ≤ 70ch, tức khoảng 15–18 chữ tiếng Việt. Trên điện thoại, chân dung (260 px) và rail (195 px) đứng trước bio, nên người đọc thấy con mèo và bốn dòng metadata trước khi biết ai viết.

**Sửa:** đưa cả trang lên **một lưới hai cột**, chính là lưới của `.split` ở trên.

- Cột trái: rail, bắt đầu ở `var(--pad-chrome)`, thẳng mép với h1.
- Cột phải: `.measure`, bắt đầu ở đường 50%, thẳng mép với chân dung, có `padding-inline: var(--pad-measure)` và `max-width: 66ch`.
- @1440: 720 − 2 × 44 = 632 px, khoảng 68ch. Số trục mép trái giảm từ 4 còn 2.
- Vẫn **không** buộc vào `--measure`. Lý do trong README vẫn đúng: một colophon không nên nghe theo cài đặt đọc bài. 66ch là giá trị riêng của trang.
- ≤ 860 px: đổi thứ tự thành bio → chủ đề → căn hầm → nơi khác → rail (colophon rơi xuống cuối, đúng nghĩa của nó). Ước tính dòng bio đầu lên khoảng y ≈ 580, nằm trong màn đầu.

```css
.body {
	display: grid;
	grid-template-columns: 1fr 1fr;
	padding: 36px 0 120px;
}
.body > :global(aside) { padding: 0 26px 0 var(--pad-chrome); }
.measure { padding: 0 var(--pad-measure); max-width: 66ch; }
@media (max-width: 860px) {
	.body { grid-template-columns: 1fr; padding: 26px 18px 80px; }
	.body > :global(aside) { order: 2; padding: 0; }
	.measure { padding: 0; }
}
```

**Đánh đổi:** cột trái thành khoảng trắng dài với một rail sticky. Đây là khoảng trắng chủ động: nó chính là cột tiêu đề phía trên kéo xuống. Nếu Max muốn giữ cảm giác "rộng ba phần tư màn hình" như production, thì làm phương án tối thiểu: chỉ thêm `max-width: 66ch` cho `.measure p`. Phương án này sửa được lỗi đọc nhưng không sửa được bốn trục mép trái.

### 2. Chữ `--muted` dưới 4.5:1 ở giao diện sáng và sepia

**Phần tử:** blurb căn hầm (14 px), lời cảm ơn (12 px), Tag (10.5 px) và nhãn MetaRail (9.5 px). Tất cả dùng `--muted`.

**Nghĩa:** muted là "metadata", không phải "khó đọc". Đo được 4.25:1 (sáng) và 3.99:1 (sepia), dưới ngưỡng AA 4.5:1 cho chữ nhỏ. Giao diện tối đạt (5.74:1).

**Sửa (token chung, cần Max quyết vì đổi cả site):**

| Theme | Hiện tại | Đề xuất | Trên `--paper` | Trên `--paper2` |
|---|---|---|---|---|
| sáng | `#77777f` | `#6b6b73` | 5.05:1 | 4.71:1 |
| sepia | `#7d766a` | `#6b6458` | 5.19:1 | 4.70:1 |

Màu vẫn đọc ra là xám, và thứ bậc so với `--ink` (14.7:1) vẫn còn rõ. Nếu Max chưa muốn đổi cả site, thì giới hạn ở trang này: dùng `color: var(--ink)` cho `.door-blurb` và `.thanks`, còn thứ bậc thì giữ bằng cỡ chữ và họ chữ mono.

### 3. Link chủ đề chỉ là một nhãn 10.5 px

**Phần tử:** `.subjects li > a` bọc mỗi `<Tag on>`; tagline nằm ngoài link.

**Nghĩa:** đây là sáu cửa đi tiếp, tức nửa sau của việc chính. Vùng bấm đo được 62 × 22 px, thấp hơn mức 24 px. Tagline là chữ dễ đọc nhất trong ô nhưng lại không bấm được. Cửa vào căn hầm ngay bên dưới đã làm đúng: cả ô là cửa.

**Sửa:** để `<a>` bọc cả `li`, gồm tên và tagline, `display: block` và cao ít nhất 44 px. Hover dùng cùng ngữ pháp với cửa căn hầm, nhưng nhẹ hơn: chỉ đổi rule trên từ `--rule-hard` sang `--blue`, không đảo nền, để căn hầm vẫn là lời mời duy nhất được đảo màu. `:focus-visible` toàn cục (viền 2 px màu `--blue`) đã đủ cho bàn phím.

### 4. Scribble gạch ngang chữ "công khai"

**Phần tử:** `<Headline mark="scribble" markWidth={210}>`.

**Nghĩa:** dấu tay phải ôm lấy chữ nhấn; gạch ngang thì lại đọc thành "đã xoá". Đo được: chữ nhấn tiếng Việt rộng 225 px, scribble rộng 210 px, nét dưới cắt ngang mắt chữ ở cả 1800 lẫn 375. Đây đúng là lỗi README đã ghi cho phòng đọc ("A note on the scribble"): một hình ellipse không ôm vừa cả hai locale.

**Sửa:** dùng lại cách đã chọn ở phòng đọc: `mark="underline"`, đặt `markWidth={225}`. Gạch chân treo dưới baseline, nên sai vài px chỉ làm nét dài hơn hoặc ngắn hơn chữ, không cắt chữ. Chưa đo bản tiếng Anh ("public"); cần nhìn lại trước khi merge.

### 5. Mười cỡ chữ trên một trang

**Phần tử:** bảy cỡ do trang tự đặt: h2 24, tiêu đề cửa 30, thân 18, blurb 14.5, blurb cửa 14, link mono 13, lời cảm ơn 12. Ba cỡ còn lại đến từ component: 52 (Headline), 10.5 (Tag), 9.5 (MetaRail).

**Nghĩa:** 14.5 và 14 khác nhau 0.5 px. Không người đọc nào thấy được khác biệt này, nên nó chỉ là hai quyết định chưa ai đưa ra. Hội đồng cho mỗi màn hai cỡ, cộng metadata (cùng cỡ, khác màu hoặc độ đậm). Hệ hiện tại có thêm họ mono làm lớp metadata, nên mình ánh xạ vào hệ đó, không đem hệ `--canon-*` vào.

**Sửa:** bảy cỡ của trang còn ba:

| Vai | Cỡ | Gồm |
|---|---|---|
| Trưng bày phụ | 24 px, `--display` 700 | h2, tiêu đề cửa căn hầm (30 → 24) |
| Thân | 18 px, `--body` | bio, tagline chủ đề (14.5 → 18), blurb căn hầm (14 → 18, màu muted) |
| Metadata | 13 px, `--mono` | link nơi khác, lời cảm ơn (12 → 13) |

Headline 52 được giữ và gọi tên là ngoại lệ: đây là cỡ hero của cả site. Tag và MetaRail nằm ngoài phạm vi RFC này vì chúng là component dùng chung; xem mục "Để sau". Kết quả là 10 cỡ còn 6, và phần trang tự quyết từ 7 còn 3.

## Những thứ giữ nguyên

- **Cửa căn hầm** (đảo nền khi hover, không có trong nav). Nó mang nghĩa và là khoảnh khắc đặc trưng duy nhất của trang. Đúng một khoảnh khắc như hội đồng cho phép.
- **Rule 1.5 px `--rule-hard` / 1 px `--rule`.** Hai cấp, có nghĩa: chia phần và chia mục.
- **`.measure p.thanks`** và 120 px khoảng thở cuối trang. Lý do đã có trong README.
- **Chân dung halftone.** Đúng hệ ảnh của site (§6).

## Để sau (ngoài 5 chỗ, không làm ở vòng này)

- **Nội dung tiếng Việt mỏng hơn tiếng Anh.** `bio2` tiếng Việt chỉ có một câu, trong khi bản tiếng Anh có ba ý. Câu `bio1` thiếu dấu ở chỗ "thú vị đó có thể là"; nên viết thành "thú vị: có thể là". Nội dung đứng trước hộp, nên đây là việc của người viết, không phải của CSS.
- **`<meta name="description">`** đang dùng lại heading ("một cuốn sổ tay, giữ nơi công khai."). Nên viết riêng một câu mô tả ai viết, viết về gì.
- **Chân dung `alt=""`.** Trên trang About, chân dung là nội dung. Đề xuất `alt` là "Chân dung maxubrq" / "Portrait of maxubrq" (thêm vào i18n; `portraitPlate` đã có nhưng chưa dùng).
- **`'2024'`** hardcode trong rail. Nên chuyển vào `site.ts` cạnh `site.author`.
- **`transition: background 0.14s`** là giá trị lẻ. Site chưa có token thời gian; khi có thì ánh xạ vào. Cửa căn hầm cũng nên đảo màu khi `:focus-visible`, không chỉ khi `:hover`.
- **Tag 10.5 px, MetaRail 9.5 px.** Hai cỡ dưới 12 px dùng toàn site. Cần một RFC riêng cho hệ chữ metadata, không sửa lẻ ở đây.

## Bài tập

Cắt MetaRail khỏi trang. Đưa bốn dòng của nó (là ai, từ, nhịp, chữ) xuống thành một dòng colophon mono ngay trên lời cảm ơn, rồi nhìn lại trang ở 375 px và 1440 px. Nếu không ai nhớ rail, thì nó chưa bao giờ là việc chính; khi đó lưới một cột đọc ở #1 còn đơn giản hơn nữa.

---

*Ghi chú nguồn quy tắc:* các ngưỡng (≤ 70ch, hai cỡ chữ mỗi màn, một khoảnh khắc đặc trưng) là quy tắc suy ra từ phương pháp của Vignelli và Reichenstein qua bảng phân xử của hội đồng, không phải lời của hai ông. Ngưỡng tương phản 4.5:1 và vùng bấm 24 px lấy từ WCAG 2.2 AA.
