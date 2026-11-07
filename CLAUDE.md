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
4. Phần định luật / phương pháp giải, có ví dụ giải mẫu từng bước và kiểm tra lại kết quả.
5. Bảng tóm tắt 1 trang (gồm bảng tiền tố đơn vị nếu cần).
6. Cuối bài: link bài tập **chỉ của đúng chương đó**.

Quy ước ký hiệu: điện thế viết `V_A`, `V_B` (không dùng φ); điện áp `U_AB = V_A − V_B`; công suất nguồn `P_N = U_N × I_N`, công suất tải `P_tải = R × I²`, cân bằng `P_nguồn = P_tải`. Dấu K1, K2 theo trang `/kirchhoff`.

Thêm bài: thêm 1 mục vào `assets/posts.js` với `section: "hoctap"`, `parent` là trang môn (vd. `/namnhat-lythuyetmach`) và `order` theo số chương.
