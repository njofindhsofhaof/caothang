// Lịch sắp tới (kiểm tra, học quân sự…): chỉ trả qua /api/sinhvien cho MSSV có trong danh sách lớp
// (không để trong file JS công khai). Mỗi dòng:
//   date: 'YYYY-MM-DD' ngày bắt đầu · endDate (tuỳ chọn): ngày kết thúc nếu kéo dài nhiều ngày
//   subject: tên môn chuẩn trong assets/subjects.js (để gắn nhãn vào thẻ môn) hoặc title: tên sự kiện không phải môn
//   kind: dòng mô tả · detail (tuỳ chọn): dòng nhấn mạnh (vd. giờ tập trung)
//   review (tuỳ chọn): href các trang cha trong assets/posts.js (trang Ôn tập, trang bài lý thuyết của môn); trang sinh viên
//   tự liệt kê bài con của các trang này làm link ôn tập, nên thêm bài tập mới vào posts.js là tự hiện.
export const EXAMS = [
  { date: '2026-11-29', endDate: '2026-12-06', title: 'Học quân sự', kind: 'Từ Chủ nhật 29/11 đến Chủ nhật 06/12', detail: 'Tập trung lúc 8h30 tại trường, Chủ nhật 29/11' },
  { date: '2026-12-07', subject: 'Điện tử cơ bản', kind: 'Kiểm tra 1 tiết', review: ['/dientucoban', '/namnhat-dientucoban'] },
  { date: '2026-12-09', subject: 'Lý thuyết mạch', kind: 'Kiểm tra 1 tiết', review: ['/lythuyetmach', '/namnhat-lythuyetmach'] },
];

/** Các mục chưa kết thúc tính đến hôm nay (YYYY-MM-DD, giờ Việt Nam), sớm nhất trước. */
export function upcomingExams(today, list = EXAMS) {
  return list.filter((e) => (e.endDate ?? e.date) >= today).sort((a, b) => a.date.localeCompare(b.date));
}
