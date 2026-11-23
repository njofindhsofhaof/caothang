/* Danh sách môn và cách gộp tên buổi về đúng môn.
   Dùng chung: trang giáo viên (<script>) và máy chủ (api/_lib/tally.js import file này),
   để bảng tháng, ảnh tổng kết, chuỗi đúng giờ và bảng Leo rank gộp môn giống nhau.
   Tên cũ gõ tay không đồng nhất (vd. "LT mạch", "mạch điện") được đưa về tên chuẩn. */
(() => {
  const SUBJECTS = ['Sinh hoạt chủ nhiệm', 'Lý thuyết mạch', 'Điện tử cơ bản', 'Đo lường điện', 'Nhập môn ĐĐT'];
  const ALIASES = [
    [/nhap mon/, 'Nhập môn ĐĐT'],
    [/sinh hoat|chu nhiem|\bshcn\b/, 'Sinh hoạt chủ nhiệm'],
    [/ly thuyet mach|\blt ?mach|^mach\b/, 'Lý thuyết mạch'],
    [/dien tu (co ban|cb)|\bdtcb\b/, 'Điện tử cơ bản'],
    [/do luong/, 'Đo lường điện'],
  ];
  const plain = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').toLowerCase();
  // Tên môn của một buổi (theo label); không khớp môn nào thì giữ nguyên tên đã nhập.
  const subjectName = (s) => {
    const label = (s?.label ?? '').trim();
    const hit = ALIASES.find(([re]) => re.test(plain(label)));
    return hit ? hit[1] : label || 'Buổi học';
  };
  globalThis.DDSubjects = { SUBJECTS, subjectName };
})();
