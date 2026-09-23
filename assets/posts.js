/* Nguon du lieu duy nhat cho bang "Bai moi" o trang chu va danh sach bai o cac trang con.
   Them bai moi: them 1 dong vao mang duoi day (date dang YYYY-MM-DD).
   - section: gioithieu | ontap | hoctap | hoatdong | event | thongtinlop
   - parent: (tuy chon) href trang cha; bai co parent van len bang "Bai moi" nhung khong lap trong danh sach cua trang.
   - hideFromNews: (tuy chon) true = chi hien trong danh sach cua trang, khong len bang "Bai moi" (vd. trang chua bai). */
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
    href: "/dientucoban",
    hideFromNews: true
  },
  {
    section: "ontap",
    title: "Bài tập tính vòng màu điện trở chân cắm công suất nhỏ",
    desc: "Trắc nghiệm mã màu điện trở chuẩn IEC 60062 — 7 đề, 360 câu, tự động chấm điểm.",
    date: "2026-09-11",
    href: "/vongmaudientro",
    parent: "/dientucoban"
  },
  {
    section: "hoctap",
    title: "Hướng dẫn lắp mạch dây điện đèn luân phiên (CS3) - môn Thực hành Điện cơ bản",
    date: "2026-09-19",
    href: "https://vt.tiktok.com/ZSqngEDSJ/"
  },
  {
    section: "ontap",
    title: "Bài tập Kirchhoff Law 1,2 môn Lý thuyết Mạch",
    date: "2026-09-19",
    href: "/kirchhoff"
  },
  {
    section: "thongtinlop",
    title: "Lịch thực hành điện tử cơ bản từ 21-26/9/2026",
    date: "2026-09-20",
    href: "/lichthuchanh"
  },
  {
    section: "hoctap",
    title: "Hướng dẫn lắp mạch khởi động động cơ trực tiếp có đèn báo - môn Thực hành Điện cơ bản",
    date: "2026-09-23",
    href: "https://vt.tiktok.com/ZSbJtDv8f/"
  }
];
