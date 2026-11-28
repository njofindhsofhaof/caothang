/* Nguon du lieu duy nhat cho bang "Bai moi" o trang chu va danh sach bai o cac trang con.
   Them bai moi: them 1 dong vao mang duoi day (date dang YYYY-MM-DD).
   - section: hoctap | ontap | duan | hoatdong | event
   - parent: (tuy chon) href trang cha; bai co parent van len bang "Bai moi" nhung khong lap trong danh sach cua trang.
   - order: (tuy chon) so thu tu co dinh trong danh sach trang muc (vd. 4 mon On tap); bai khong co order xep sau theo ngay.
   - short: (tuy chon) tom tat 1 cau (<= ~70 ky tu) hien o bang "Bai moi"; khong co thi dung desc (bang cat con 2 dong).
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
    short: "Hạ áp 24V xuống 12V bằng mạch Buck, có hình động và cách làm.",
    date: "2026-11-07",
    href: "/machbuck"
  },
  {
    section: "duan",
    title: "IC 555 phát xung",
    desc: "IC 555 là gì, sơ đồ chân, mạch phát xung nháy LED, công thức tần số và D, kèm máy tính R1 R2 C. Dùng làm bộ tạo xung cho mạch Boost.",
    short: "IC 555 phát xung nháy LED, kèm máy tính tần số R1 R2 C.",
    date: "2026-11-07",
    href: "/ic555"
  },
  {
    section: "duan",
    title: "Mạch tăng áp Boost 12V lên 24V",
    desc: "Nguyên lý mạch Boost có hình minh hoạ động: cuộn cảm, công tắc MOSFET, diode, tụ. Công thức chu kỳ làm việc và cách tự ráp.",
    short: "Tăng áp 12V lên 24V bằng mạch Boost, có hình động và cách ráp.",
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
    short: "17 gian hàng năng lượng và kiến thức kỹ thuật rút ra.",
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
    short: "6 đề mạch Shunt và điện trở phụ, có lời giải từng bước.",
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
    short: "6 bài phân áp, phân dòng có sơ đồ, tự chấm.",
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
    section: "ontap",
    title: "Bài tập mạch ứng dụng diode (Chương 3)",
    desc: "Diode, LED nối tiếp và song song, diode phân cực nghịch: tính IR, ID, VO và chọn điện trở — 13 bài (diode Si, Ge và LED), tự chấm và lời giải từng bước.",
    short: "13 bài tính dòng, áp qua diode và LED, tự chấm có lời giải.",
    date: "2026-11-08",
    href: "/baitapdiode",
    parent: "/dientucoban"
  },
  {
    section: "ontap",
    title: "Bài tập mạch ổn áp diode Zener (Chương 3)",
    desc: "Mạch ổn áp dùng diode Zener: tính IS, IRL, IZ, PZ, khoảng VS và khoảng RL để mạch ổn áp. 6 bài tự chấm, lời giải từng bước theo K1, K2.",
    short: "6 bài mạch ổn áp diode Zener, tự chấm có lời giải.",
    date: "2026-11-24",
    href: "/baitapzener",
    parent: "/dientucoban"
  },
  {
    section: "ontap",
    title: "Bài tập transistor BJT (Chương 4)",
    desc: "Transistor BJT: vẽ đường tải tĩnh DCLL, xác định điểm làm việc Q (ngưng dẫn, khuếch đại, bão hoà), chọn RB, RC, RE cho chế độ khuếch đại và bão hoà. 6 bài tự chấm, lời giải từng bước theo K2.",
    short: "6 bài transistor BJT: DCLL, điểm Q, chọn RB RC RE, tự chấm.",
    date: "2026-11-25",
    href: "/baitaptransistor",
    parent: "/dientucoban"
  },
  {
    section: "ontap",
    title: "Đề mẫu kiểm tra 1 tiết Điện tử cơ bản (Chương 1–4)",
    desc: "4 đề 45 phút / 10 điểm: chỉnh lưu bán kỳ dương/âm, đọc điện trở vòng màu, tụ, SMD, điện trở hỗn hợp, diode, Zener, transistor BJT. Mỗi câu ghi số phút và điểm, có sơ đồ, lời giải từng bước và bảng thời gian/điểm để tự ghép đề.",
    short: "4 đề kiểm tra 45 phút Chương 1–4, có thời gian, điểm và lời giải.",
    date: "2026-11-26",
    href: "/dekiemtradientucoban",
    parent: "/dientucoban"
  },
  {
    section: "hoctap",
    parent: "/namnhat-thuchanh",
    title: "Hướng dẫn lắp mạch dây điện đèn luân phiên (CS3) - môn Thực hành Điện cơ bản",
    desc: "Video lắp mạch đèn luân phiên dùng công tắc 3 cực (CS3): sơ đồ đi dây và các bước đấu nối thực tế.",
    short: "Video lắp mạch đèn luân phiên dùng công tắc 3 cực.",
    date: "2026-09-19",
    href: "https://vt.tiktok.com/ZSqngEDSJ/"
  },
  {
    section: "hoctap",
    parent: "/namnhat-dientucoban",
    title: "Chương 4: Transistor lưỡng cực BJT",
    desc: "Cấu tạo PNP, NPN, ký hiệu, nguyên lý hoạt động và I_C = β·I_B, ba vùng ngưng dẫn – khuếch đại – bão hoà, mạch phân cực cố định, đường tải tĩnh DCLL, xác định điểm Q và chọn R_B, R_C, R_E; có mô phỏng và trắc nghiệm.",
    short: "Transistor BJT, ba vùng làm việc, đường tải tĩnh và điểm Q.",
    date: "2026-11-25",
    href: "/dientucoban-chuong4",
    order: 4
  },
  {
    section: "hoctap",
    parent: "/namnhat-dientucoban",
    title: "Chương 3: Chất bán dẫn và diode",
    desc: "Bán dẫn Si, Ge, loại N và P, mối nối P-N, phân cực thuận nghịch, các loại diode, thiết kế mạch LED, chỉnh lưu bán kỳ, ổn áp Zener và LED 7 đoạn; có mô phỏng và trắc nghiệm.",
    short: "Bán dẫn, mối nối P-N, các loại diode, chỉnh lưu và ổn áp Zener.",
    date: "2026-11-08",
    href: "/dientucoban-chuong3",
    order: 3
  },
  {
    section: "hoctap",
    parent: "/namnhat-dientucoban",
    title: "Chương 2: Linh kiện thụ động",
    desc: "Điện trở, mã màu 4 và 5 vạch, điện trở dán SMD, ghép nối tiếp song song, hạn dòng LED, chia áp, pull-up, tụ điện, mã tụ và cuộn cảm; có mô phỏng và trắc nghiệm.",
    short: "Điện trở, tụ điện, cuộn cảm: cách đọc mã và cách ghép mạch.",
    date: "2026-11-08",
    href: "/dientucoban-chuong2",
    order: 2
  },
  {
    section: "hoctap",
    parent: "/namnhat-dientucoban",
    title: "Chương 1: Các khái niệm cơ bản",
    desc: "Electron, điện áp, dòng điện, trở kháng, định luật Ohm, các loại pin, ghép pin nối tiếp/song song, dung lượng mAh – Wh và tỉ lệ C, có mô phỏng và trắc nghiệm.",
    short: "Điện áp, dòng điện, định luật Ohm và các loại pin.",
    date: "2026-11-08",
    href: "/dientucoban-chuong1",
    order: 1
  },
  {
    section: "hoctap",
    parent: "/namnhat-lythuyetmach",
    title: "Chương 1: Khái niệm cơ bản về mạch điện",
    desc: "Điện thế, điện áp, dòng điện, nguồn điện, điện trở, điện dung, tụ điện, cuộn cảm, công suất và định luật Kirchhoff K1, K2 — có hình minh hoạ, ví dụ giải mẫu và video.",
    short: "Điện áp, dòng điện, công suất và định luật Kirchhoff K1, K2.",
    date: "2026-11-07",
    href: "/lythuyetmach-chuong1",
    order: 1
  },
  {
    section: "hoctap",
    parent: "/namnhat-lythuyetmach",
    title: "Chương 2: Mạch xác lập điều hoà",
    desc: "Đại lượng điều hoà, góc lệch pha, trị hiệu dụng, số phức và ảnh phức, trở kháng – dẫn nạp, Ohm và Kirchhoff dạng phức, công suất P, Q, S — có hình minh hoạ và ví dụ giải mẫu.",
    short: "Mạch xác lập điều hoà: số phức, trở kháng, công suất P, Q, S.",
    date: "2026-11-07",
    href: "/lythuyetmach-chuong2",
    order: 2
  },
  {
    section: "hoctap",
    parent: "/namnhat-lythuyetmach",
    title: "Chương 3: Phương pháp dòng mắt lưới và điện thế nút",
    desc: "Nhánh, nút, mắt lưới; giải mạch bằng dòng mắt lưới (có nguồn dòng) và điện thế nút, biến đổi nguồn áp thành nguồn dòng, so sánh hai phương pháp — có mô phỏng, ví dụ giải từng bước và trắc nghiệm.",
    short: "Giải mạch bằng dòng mắt lưới và điện thế nút, có ví dụ từng bước.",
    date: "2026-11-26",
    href: "/lythuyetmach-chuong3",
    order: 3
  },
  {
    section: "hoctap",
    parent: "/namnhat-lythuyetmach",
    title: "Chương 4: Mạch điện xoay chiều 3 pha",
    desc: "Nguồn 3 pha, điện áp và dòng điện pha – dây, nối hình sao (Y) và tam giác (Δ), tải 3 pha đối xứng có xét trở kháng đường dây, công suất P, Q, S và cosφ, hộp đấu dây động cơ — có mô phỏng, ví dụ giải từng bước và trắc nghiệm.",
    short: "Mạch 3 pha: nối sao, tam giác, dòng – áp pha, dây và công suất.",
    date: "2026-11-27",
    href: "/lythuyetmach-chuong4",
    order: 4
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
    short: "4 bài mạch xác lập điều hoà giải bằng ảnh phức.",
    date: "2026-11-03",
    href: "/xaclapdieuhoa",
    parent: "/lythuyetmach"
  },
  {
    section: "ontap",
    title: "Bài tập dòng mắt lưới và điện thế nút (Chương 3)",
    desc: "4 bài tự chấm: 2 bài dòng mắt lưới (có nguồn dòng), 2 bài điện thế nút (có biến đổi nguồn áp thành nguồn dòng). Lời giải từng bước, kiểm tra lại bằng K1 và cân bằng công suất.",
    short: "4 bài dòng mắt lưới và điện thế nút, tự chấm có lời giải.",
    date: "2026-11-27",
    href: "/baitapmatluoinut",
    parent: "/lythuyetmach"
  },
  {
    section: "ontap",
    title: "Bài tập mạch 3 pha (Chương 4)",
    desc: "Tải 3 pha đối xứng nối Y và Δ: tính Up, Ip, Id, cosφ, P, Q, S, có dạng xét tổng trở đường dây và đề ngẫu nhiên không giới hạn. Tự chấm, có hình mạch và lời giải từng bước.",
    short: "Bài tập mạch 3 pha nối Y và Δ, tự chấm, có đề ngẫu nhiên.",
    date: "2026-11-27",
    href: "/baitap3pha",
    parent: "/lythuyetmach"
  },
  {
    section: "ontap",
    title: "Đề ôn kiểm tra 1 tiết môn Lý thuyết Mạch",
    desc: "3 đề, mỗi đề 1 bài Kirchhoff nâng cao + 1 bài mạch xác lập điều hoà, có lời giải từng bước.",
    short: "3 đề Kirchhoff và mạch xác lập điều hoà, có lời giải.",
    date: "2026-11-03",
    href: "/dekiemtra",
    parent: "/lythuyetmach"
  },
  {
    section: "ontap",
    title: "Đề kiểm tra 1 tiết Lý thuyết Mạch (Chương 3–4)",
    desc: "4 đề 45 phút / 10 điểm: Bài 1 dạng khó nhất Chương 3: dòng mắt lưới mạch 3 mắt có nguồn dòng (đề 1, 3) hoặc điện thế nút 2 nút A, B có biến đổi nguồn áp thành nguồn dòng (đề 2, 4), Bài 2 mạch 3 pha tải đối xứng nối Y hoặc Δ. Mỗi bài ghi số phút và điểm, có sơ đồ, lời giải từng bước và thang điểm chi tiết.",
    short: "4 đề 45 phút: mắt lưới, điện thế nút và mạch 3 pha, có thang điểm.",
    date: "2026-11-27",
    href: "/dekiemtralythuyetmach",
    parent: "/lythuyetmach"
  },
  {
    section: "hoctap",
    parent: "/namnhat-thuchanh",
    title: "Hướng dẫn lắp mạch khởi động động cơ trực tiếp có đèn báo - môn Thực hành Điện cơ bản",
    desc: "Video lắp mạch khởi động trực tiếp động cơ bằng contactor, nút nhấn và đèn báo trạng thái.",
    short: "Video lắp mạch khởi động trực tiếp động cơ bằng contactor.",
    date: "2026-09-23",
    href: "https://vt.tiktok.com/ZSbJtDv8f/"
  },
  {
    section: "hoctap",
    parent: "/namnhat-thuchanh",
    title: "Hướng dẫn lắp mạch khởi động động cơ thuận nghịch và giới hạn hành trình",
    desc: "Video lắp mạch đảo chiều động cơ (thuận nghịch) có khoá chéo và công tắc hành trình giới hạn.",
    short: "Video lắp mạch đảo chiều động cơ có khoá chéo.",
    date: "2026-09-27",
    href: "https://www.tiktok.com/@ckcddt26c/video/7689804296971488564"
  },
  {
    section: "hoctap",
    parent: "/namnhat-thuchanh",
    title: "Hướng dẫn lắp mạch và đo mạch điện trở nối tiếp và song song",
    desc: "Video ráp điện trở nối tiếp, song song và dùng đồng hồ đo kiểm tra điện trở tương đương.",
    short: "Video ráp điện trở nối tiếp, song song và đo kiểm tra.",
    date: "2026-10-20",
    href: "https://www.tiktok.com/@ckcddt26c/video/7696094907047480583"
  },
  {
    section: "hoctap",
    parent: "/namnhat-thuchanh",
    title: "Quy trình làm một board mạch đơn giản",
    desc: "Video các bước làm board mạch đơn giản: vẽ mạch, làm mạch in, khoan, hàn linh kiện và kiểm tra.",
    short: "Video các bước làm board mạch đơn giản.",
    date: "2026-10-20",
    href: "https://www.tiktok.com/@ckcddt26c/video/7697250102666251527"
  },
  {
    section: "hoctap",
    parent: "/namnhat-thuchanh",
    title: "Hướng dẫn lắp mạch đa hài NPN - PNP - IC555",
    desc: "Video lắp mạch đa hài (dao động tạo xung nháy LED) bằng transistor NPN, transistor PNP và bằng IC 555.",
    short: "Video lắp mạch đa hài dùng transistor NPN, PNP và IC 555.",
    date: "2026-11-10",
    href: "https://www.tiktok.com/@ckcddt26c/video/7706551191714401537"
  }
];
