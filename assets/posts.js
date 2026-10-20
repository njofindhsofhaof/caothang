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
    section: "ontap",
    title: "Bài tập đọc & tính mã điện trở dán SMD",
    desc: "Mã 3 số, 4 số, chữ R, dải mΩ đến MΩ — 6 đề, 36 câu, tự động chấm điểm.",
    date: "2026-10-20",
    href: "/dientrodansmd",
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
  },
  {
    section: "hoctap",
    title: "Hướng dẫn lắp mạch khởi động động cơ thuận nghịch và giới hạn hành trình",
    date: "2026-09-27",
    href: "https://www.tiktok.com/@ckcddt26c/video/7689804296971488564"
  },
  {
    section: "hoctap",
    title: "Hướng dẫn lắp mạch và đo mạch điện trở nối tiếp và song song",
    date: "2026-10-20",
    href: "https://www.tiktok.com/@ckcddt26c/video/7696094907047480583"
  },
  {
    section: "hoctap",
    title: "Quy trình làm một board mạch đơn giản",
    date: "2026-10-20",
    href: "https://www.tiktok.com/@ckcddt26c/video/7697250102666251527"
  }
];
