// Lịch kiểm tra: chỉ trả qua /api/sinhvien cho MSSV có trong danh sách lớp (không để trong file JS công khai).
// Thêm bài kiểm tra: thêm một dòng { date: 'YYYY-MM-DD', subject: tên môn chuẩn trong assets/subjects.js, kind, review }.
// review: href các trang cha trong assets/posts.js (trang Ôn tập, trang bài lý thuyết của môn); trang sinh viên tự liệt kê
// bài con của các trang này làm link ôn tập, nên thêm bài tập mới vào posts.js là tự hiện.
export const EXAMS = [
  { date: '2026-12-07', subject: 'Điện tử cơ bản', kind: 'Kiểm tra 1 tiết', review: ['/dientucoban', '/namnhat-dientucoban'] },
  { date: '2026-12-09', subject: 'Lý thuyết mạch', kind: 'Kiểm tra 1 tiết', review: ['/lythuyetmach', '/namnhat-lythuyetmach'] },
];

/** Các bài kiểm tra từ hôm nay (YYYY-MM-DD, giờ Việt Nam) trở đi, sớm nhất trước. */
export function upcomingExams(today, list = EXAMS) {
  return list.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
}
