# caothang – site học tập lớp CĐ ĐĐT 26C

Site tĩnh (HTML + JS thuần) deploy bằng Vercel từ nhánh `main`. Danh sách bài và cây mục nằm trong `assets/posts.js` (xem chú thích đầu file).

## Cấu trúc bài học lý thuyết (Học tập › Năm nhất › <môn>)

Mẫu chuẩn: `lythuyetmach-chuong1.html`. Bài mới theo đúng khung này:

1. **Khung "Sau khi học Chương N, bạn cần nắm"** ở đầu bài: danh sách đánh số các mục tiêu cụ thể (biết phân biệt…, tính được…, viết được…), mỗi ý link tới mục tương ứng trong bài.
2. Mục lục, rồi video TikTok của lớp (nếu có) nhúng bằng `https://www.tiktok.com/player/v1/<id>`, đặt cạnh phần nó minh hoạ.
3. **Các khái niệm trước**, mỗi khái niệm gồm theo thứ tự:
   - câu **Dễ nhớ** (so sánh đời thường, ví dụ nước chảy trong ống),
   - **hình minh hoạ SVG đơn giản** vẽ inline, dùng biến màu của site để xem được cả nền sáng và tối,
   - **ảnh thiết bị thực tế** (nếu có): ảnh giấy phép tự do từ Wikimedia Commons (ưu tiên CC0/public domain, tránh logo hãng nổi bật), kèm chú thích cách dùng và dòng ghi nguồn tác giả · giấy phép · link,
   - định nghĩa (`.def`) + công thức (`.formula`),
   - **bảng đổi đơn vị** đủ các bậc (vd. MV, kV, V, mV, µV) ghi giá trị quy đổi và ví dụ thực tế.
   - **Link bài tập liên quan** (vd. `/vongmaudientro`, `/madientudien`) đặt thành khối riêng `<a class="practice">` (CSS trong `site.css`) **ngay dưới hình**, không nhét trong chú thích ảnh: người đọc tưởng đó là link Wikimedia nên bỏ qua.
   - **Visual bắt buộc**: mỗi khái niệm chính có hình SVG; quan hệ có tham số (công thức, góc pha, tần số…) làm thành mô phỏng tương tác "Thử ngay" (`figure.sim`, thanh trượt + số liệu tự tính), xem `lythuyetmach-chuong1.html` và `assets/lt2-sim.js`.
4. Phần định luật / phương pháp giải, có ví dụ giải mẫu từng bước và kiểm tra lại kết quả.
5. Bảng tóm tắt 1 trang (gồm bảng tiền tố đơn vị nếu cần).
6. **Trắc nghiệm ôn tập: 10 câu hỏi lý thuyết**, mỗi câu 4 phương án kèm giải thích (nêu vì sao đúng và vì sao các phương án nhiễu sai), để tóm tắt kiến thức của chương. Dùng component chung: `<div class="quiz" id="quiz"></div>`, khai báo `window.CT_QUIZ = [{ q, opts: [4 phương án], a: chỉ số đáp án đúng, why }]`, nạp `/assets/quiz.css` và `/assets/quiz.js` (xem `lythuyetmach-chuong2.html`).
7. Cuối bài: link bài tập **chỉ của đúng chương đó**.

Tên riêng và đơn vị viết theo **tên gốc quốc tế**, không phiên âm tiếng Việt: định luật Ohm (không viết Ôm), Kirchhoff, Thevenin, Norton; đơn vị volt, ampere, ohm, watt, joule, coulomb, siemens, hertz, farad, henry (Kilovolt, Miliampere, Kiloohm…). Riêng tên dụng cụ đo giữ cách gọi quen thuộc: vôn kế, ampe kế, ampe kìm. Tên đơn vị và tiền tố có **cách đọc tiếng Việt kế bên**: `volt <span class="say" title="Cách đọc">vôn</span> (V)` (CSS `.say` trong `site.css` tự thêm dấu /…/). Cách đọc: volt vôn, ampere am-pe, ohm ôm, watt oát, joule jun, coulomb cu-lông, siemens si-men, hertz héc, farad fa-ra, henry hen-ri; mega mê-ga, kilo ki-lô, mili mi-li, micro mi-crô, nano na-nô, pico pi-cô. Thêm ở dòng đơn vị gốc của bảng đổi đơn vị, bảng tiền tố và các chú thích đơn vị dưới công thức.

Quy ước ký hiệu: điện thế viết `V_A`, `V_B` (không dùng φ); điện áp `U_AB = V_A − V_B`; công suất nguồn `P_N = U_N × I_N`, công suất tải `P_tải = R × I²`, cân bằng `P_nguồn = P_tải`. Dấu K1, K2 theo trang `/kirchhoff`.

Thêm bài: thêm 1 mục vào `assets/posts.js` với `section: "hoctap"`, `parent` là trang môn (vd. `/namnhat-lythuyetmach`) và `order` theo số chương.

## Thẻ xem trước khi chia sẻ link

Mọi trang `.html` phải có `<meta name="description">` và các thẻ Open Graph (`og:title`, `og:description`, `og:url`, `og:image` = `/assets/og.png` 1200×630, `twitter:card`) để dán link vào Zalo/Facebook hiện tiêu đề và ảnh. Chép khối thẻ từ `lythuyetmach-chuong2.html` rồi sửa title/description/url. `npm test` (test/og-tags.test.js) báo lỗi nếu trang mới thiếu.

## PIN giáo viên

Đổi PIN ngay trong `/diemdanh-gv` (tab Danh sách lớp → Đổi mã PIN). PIN mới lưu trên Redis key `teacher:pin` dạng băm scrypt (`api/_lib/pin.js`), thay thế `TEACHER_PIN` trên Vercel. Quên PIN: xoá key `teacher:pin` (Vercel → Storage → Open in Upstash → Data Browser) để quay về `TEACHER_PIN`. Mọi API cần PIN đi qua `teacherGate` (store.js): sai 8 lần/IP bị khoá 15 phút.
