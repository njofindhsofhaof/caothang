/* Nguon du lieu duy nhat cho bang "Bai moi" o trang chu va danh sach bai o cac trang con.
   Them bai moi: them 1 dong vao mang duoi day (date dang YYYY-MM-DD).
   - section: hoctap | ontap | duan | hoatdong | event
   - parent: (tuy chon) href trang cha; bai co parent van len bang "Bai moi" nhung khong lap trong danh sach cua trang.
   - order: (tuy chon) so thu tu co dinh trong danh sach trang muc (vd. 4 mon On tap); bai khong co order xep sau theo ngay.
   - hideFromNews: (tuy chon) true = chi hien trong danh sach cua trang, khong len bang "Bai moi" (vd. trang chua bai).
   Trang chua bai (trang cha): khi bai con co "Moi", the trang cha o trang muc cung tu hien "Moi" + ngay cap nhat.
   Trang cha tu liet ke bai con bang <div class="list" id="postList" data-parent="/href-trang-cha"></div>
   + nap /assets/posts.js va /assets/site.js (xem dientucoban.html).
   Trang cha co the long nhau (Hoc tap > Nam nhat > Thuc hanh); "Moi" lan len tu moi cap con chau. */
window.CT_POSTS = [
  {
    section: "duan",
    title: "Mạch hạ áp Buck 24V xuống 12V",
    desc: "Vì sao không hạ áp bằng biến trở, nguyên lý mạch Buck có hình minh hoạ động, công thức D, so sánh với Boost và cách làm với LM2596.",
    date: "2026-11-07",
    href: "/machbuck"
  },
  {
    section: "duan",
    title: "IC 555 phát xung",
    desc: "IC 555 là gì, sơ đồ chân, mạch phát xung nháy LED, công thức tần số và D, kèm máy tính R1 R2 C. Dùng làm bộ tạo xung cho mạch Boost.",
    date: "2026-11-07",
    href: "/ic555"
  },
  {
    section: "duan",
    title: "Mạch tăng áp Boost 12V lên 24V",
    desc: "Nguyên lý mạch Boost có hình minh hoạ động: cuộn cảm, công tắc MOSFET, diode, tụ. Công thức chu kỳ làm việc và cách tự ráp.",
    date: "2026-11-07",
    href: "/machboost"
  },
  {
    section: "hoctap",
    title: "Năm nhất",
    desc: "Tài liệu học tập năm nhất.",
    date: "2026-11-07",
    href: "/namnhat",
    hideFromNews: true,
    order: 1
  },
  {
    section: "hoctap",
    parent: "/namnhat",
    title: "Thực hành",
    desc: "Video hướng dẫn thực hành.",
    date: "2026-11-07",
    href: "/namnhat-thuchanh",
    hideFromNews: true,
    order: 1
  },
  {
    section: "hoctap",
    parent: "/namnhat",
    title: "Lý thuyết mạch",
    desc: "Tài liệu môn Lý thuyết mạch.",
    date: "2026-11-07",
    href: "/namnhat-lythuyetmach",
    hideFromNews: true,
    order: 2
  },
  {
    section: "hoctap",
    parent: "/namnhat",
    title: "Điện tử Cơ bản",
    desc: "Tài liệu môn Điện tử Cơ bản.",
    date: "2026-11-07",
    href: "/namnhat-dientucoban",
    hideFromNews: true,
    order: 3
  },
  {
    section: "hoctap",
    parent: "/namnhat",
    title: "Đo lường điện",
    desc: "Tài liệu môn Đo lường điện.",
    date: "2026-11-07",
    href: "/namnhat-doluongdien",
    hideFromNews: true,
    order: 4
  },
  {
    section: "event",
    title: "Ghi chú tham quan Vietnam Energy Week 2026",
    desc: "17 gian hàng năng lượng, data center, HVAC kèm ảnh, và kiến thức kỹ thuật rút ra: biến tần, cảm biến, MCCB, cáp trung thế.",
    date: "2026-11-06",
    href: "/energyweek2026"
  },
  {
    section: "hoatdong",
    title: "Leo rank tháng 11",
    desc: "Thi đua chuyên cần: ai đi học đúng giờ nhiều buổi nhất tháng 11.",
    date: "2026-11-05",
    href: "/leorank-thang11"
  },
  {
    section: "ontap",
    title: "Lý Thuyết Mạch",
    desc: "Bài tập môn Lý Thuyết Mạch.",
    date: "2026-11-03",
    href: "/lythuyetmach",
    hideFromNews: true,
    order: 2
  },
  {
    section: "ontap",
    title: "Đo Lường Điện",
    desc: "Bài tập môn Đo Lường Điện.",
    date: "2026-11-03",
    href: "/doluongdien",
    hideFromNews: true,
    order: 3
  },
  {
    section: "ontap",
    title: "Đề ôn kiểm tra 1 tiết môn Đo lường điện",
    desc: "6 đề: Câu 1 mạch Shunt (riêng rẽ + vạn năng) và Câu 2 mạch điện trở phụ (riêng rẽ + vạn năng), có lời giải từng bước.",
    date: "2026-11-05",
    href: "/dekiemtradoluong",
    parent: "/doluongdien"
  },
  {
    section: "ontap",
    title: "Anh Văn",
    desc: "Bài tập và đề thi môn Anh Văn.",
    date: "2026-11-03",
    href: "/anhvan",
    hideFromNews: true,
    order: 4
  },
  {
    section: "ontap",
    title: "Test Đầu Vào Tiếng Anh",
    desc: "Thi trắc nghiệm tiếng Anh đầu vào — 5 đề, mỗi đề 50 câu, tự động chấm điểm.",
    date: "2026-09-11",
    href: "/testdauvaotienganh",
    parent: "/anhvan"
  },
  {
    section: "ontap",
    title: "Điện Tử Cơ Bản",
    desc: "Bài tập trắc nghiệm môn Điện Tử Cơ Bản.",
    date: "2026-09-11",
    href: "/dientucoban",
    hideFromNews: true,
    order: 1
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
    section: "ontap",
    title: "Bài tập Định lý phân áp & phân dòng trong mạch",
    desc: "6 bài nâng cao có sơ đồ mạch — Rtđ, dòng nhánh, điện áp VO, vòng màu; tự chấm và lời giải chi tiết.",
    date: "2026-10-20",
    href: "/phanapphandong",
    parent: "/dientucoban"
  },
  {
    section: "ontap",
    title: "Bài tập đọc & tính mã tụ điện",
    desc: "Mã 1–2 số, mã 3 số, sai số J/K, đổi pF – nF – µF — 6 đề, 144 câu, tự động chấm điểm.",
    date: "2026-10-20",
    href: "/madientudien",
    parent: "/dientucoban"
  },
  {
    section: "hoctap",
    parent: "/namnhat-thuchanh",
    title: "Hướng dẫn lắp mạch dây điện đèn luân phiên (CS3) - môn Thực hành Điện cơ bản",
    desc: "Video lắp mạch đèn luân phiên dùng công tắc 3 cực (CS3): sơ đồ đi dây và các bước đấu nối thực tế.",
    date: "2026-09-19",
    href: "https://vt.tiktok.com/ZSqngEDSJ/"
  },
  {
    section: "hoctap",
    parent: "/namnhat-dientucoban",
    title: "Chương 2: Linh kiện thụ động",
    desc: "Điện trở, mã màu 4 và 5 vạch, điện trở dán SMD, ghép nối tiếp song song, hạn dòng LED, chia áp, pull-up, tụ điện, mã tụ và cuộn cảm; có mô phỏng và trắc nghiệm.",
    date: "2026-11-08",
    href: "/dientucoban-chuong2",
    order: 2
  },
  {
    section: "hoctap",
    parent: "/namnhat-dientucoban",
    title: "Chương 1: Các khái niệm cơ bản",
    desc: "Electron, điện áp, dòng điện, trở kháng, định luật Ohm, các loại pin, ghép pin nối tiếp/song song, dung lượng mAh – Wh và tỉ lệ C, có mô phỏng và trắc nghiệm.",
    date: "2026-11-08",
    href: "/dientucoban-chuong1",
    order: 1
  },
  {
    section: "hoctap",
    parent: "/namnhat-lythuyetmach",
    title: "Chương 1: Khái niệm cơ bản về mạch điện",
    desc: "Điện thế, điện áp, dòng điện, nguồn điện, điện trở, điện dung, tụ điện, cuộn cảm, công suất và định luật Kirchhoff K1, K2 — có hình minh hoạ, ví dụ giải mẫu và video.",
    date: "2026-11-07",
    href: "/lythuyetmach-chuong1",
    order: 1
  },
  {
    section: "hoctap",
    parent: "/namnhat-lythuyetmach",
    title: "Chương 2: Mạch xác lập điều hoà",
    desc: "Đại lượng điều hoà, góc lệch pha, trị hiệu dụng, số phức và ảnh phức, trở kháng – dẫn nạp, Ohm và Kirchhoff dạng phức, công suất P, Q, S — có hình minh hoạ và ví dụ giải mẫu.",
    date: "2026-11-07",
    href: "/lythuyetmach-chuong2",
    order: 2
  },
  {
    section: "ontap",
    title: "Bài tập Kirchhoff Law 1,2 môn Lý thuyết Mạch",
    desc: "Bài tập tự chấm định luật Kirchhoff K1, K2: chọn đề, nhập dòng nhánh rồi kiểm tra. Có bài nâng cao giải chi tiết kèm công suất.",
    date: "2026-09-19",
    href: "/kirchhoff",
    parent: "/lythuyetmach"
  },
  {
    section: "ontap",
    title: "Mạch xác lập điều hoà",
    desc: "4 bài giải bằng ảnh phức có lời giải từng bước — phức hoá mạch, tổng trở, dòng nhánh, phương trình tức thời, công suất P, Q, S.",
    date: "2026-11-03",
    href: "/xaclapdieuhoa",
    parent: "/lythuyetmach"
  },
  {
    section: "ontap",
    title: "Đề ôn kiểm tra 1 tiết môn Lý thuyết Mạch",
    desc: "3 đề, mỗi đề 1 bài Kirchhoff nâng cao + 1 bài mạch xác lập điều hoà, có lời giải từng bước.",
    date: "2026-11-03",
    href: "/dekiemtra",
    parent: "/lythuyetmach"
  },
  {
    section: "hoctap",
    parent: "/namnhat-thuchanh",
    title: "Hướng dẫn lắp mạch khởi động động cơ trực tiếp có đèn báo - môn Thực hành Điện cơ bản",
    desc: "Video lắp mạch khởi động trực tiếp động cơ bằng contactor, nút nhấn và đèn báo trạng thái.",
    date: "2026-09-23",
    href: "https://vt.tiktok.com/ZSbJtDv8f/"
  },
  {
    section: "hoctap",
    parent: "/namnhat-thuchanh",
    title: "Hướng dẫn lắp mạch khởi động động cơ thuận nghịch và giới hạn hành trình",
    desc: "Video lắp mạch đảo chiều động cơ (thuận nghịch) có khoá chéo và công tắc hành trình giới hạn.",
    date: "2026-09-27",
    href: "https://www.tiktok.com/@ckcddt26c/video/7689804296971488564"
  },
  {
    section: "hoctap",
    parent: "/namnhat-thuchanh",
    title: "Hướng dẫn lắp mạch và đo mạch điện trở nối tiếp và song song",
    desc: "Video ráp điện trở nối tiếp, song song và dùng đồng hồ đo kiểm tra điện trở tương đương.",
    date: "2026-10-20",
    href: "https://www.tiktok.com/@ckcddt26c/video/7696094907047480583"
  },
  {
    section: "hoctap",
    parent: "/namnhat-thuchanh",
    title: "Quy trình làm một board mạch đơn giản",
    desc: "Video các bước làm board mạch đơn giản: vẽ mạch, làm mạch in, khoan, hàn linh kiện và kiểm tra.",
    date: "2026-10-20",
    href: "https://www.tiktok.com/@ckcddt26c/video/7697250102666251527"
  }
];
