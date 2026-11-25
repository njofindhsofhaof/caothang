// Lịch kiểm tra: chỉ trả qua /api/sinhvien cho MSSV có trong danh sách lớp (không để trong file JS công khai).
// Thêm bài kiểm tra: thêm một dòng { date: 'YYYY-MM-DD', subject: tên môn chuẩn trong assets/subjects.js, kind }.
export const EXAMS = [
  { date: '2026-12-07', subject: 'Điện tử cơ bản', kind: 'Kiểm tra 1 tiết' },
  { date: '2026-12-09', subject: 'Lý thuyết mạch', kind: 'Kiểm tra 1 tiết' },
];

/** Các bài kiểm tra từ hôm nay (YYYY-MM-DD, giờ Việt Nam) trở đi, sớm nhất trước. */
export function upcomingExams(today, list = EXAMS) {
  return list.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
}
