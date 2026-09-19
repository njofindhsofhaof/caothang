/* Nguon du lieu duy nhat cho bang "Bai moi" o trang chu va danh sach bai o cac trang con.
   Them bai moi: them 1 dong vao mang duoi day (date dang YYYY-MM-DD).
   - section: gioithieu | ontap | hoatdong | event | thongtinlop
   - parent: (tuy chon) href trang cha; bai co parent van len bang "Bai moi" nhung khong lap trong danh sach cua trang. */
window.CT_POSTS = [
  {
    section: "ontap",
    title: "Test Đầu Vào Tiếng Anh",
    desc: "Thi trắc nghiệm tiếng Anh đầu vào — 5 đề, mỗi đề 50 câu, tự động chấm điểm.",
    date: "2026-09-11",
    href: "/testdauvaotienganh"
  },
  {
    section: "ontap",
    title: "Điện Tử Cơ Bản",
    desc: "Bài tập trắc nghiệm môn Điện Tử Cơ Bản.",
    date: "2026-09-11",
    href: "/dientucoban"
  },
  {
    section: "ontap",
    title: "Bài tập tính vòng màu điện trở chân cắm công suất nhỏ",
    desc: "Trắc nghiệm mã màu điện trở chuẩn IEC 60062 — 7 đề, 360 câu, tự động chấm điểm.",
    date: "2026-09-11",
    href: "/vongmaudientro",
    parent: "/dientucoban"
  }
];
