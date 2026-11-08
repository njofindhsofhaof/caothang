/* Bản tiếng Anh của /dekiemtradoluong cho nút VI/EN (assets/i18n.js).
   Khoá = mã băm của đoạn tiếng Việt (CTI18N.hash; "~" = mẫu có số {0}, {1}…); dòng chú thích phía trên là đoạn tiếng Việt gốc.
   Sửa câu tiếng Việt trong trang thì phải sửa cả khoá ở đây, nếu không câu đó hiện tiếng Việt.
   Thêm/đổi chữ: mở trang, gõ CTI18N.collect() trong console để lấy khoá các câu chưa dịch. */
window.CT_EN = {
  /* Cụm từ dùng để ghép câu JS sinh ra (lời giải từng bước…). */
  __phrases: [
    ["Cho mạch Shunt riêng rẽ như hình", "Given the individual shunt circuit shown"],
    ["Cho mạch Shunt vạn năng như hình", "Given the universal (Ayrton) shunt circuit shown"],
    ["Cho mạch điện trở phụ riêng rẽ như hình", "Given the individual multiplier circuit shown"],
    ["Cho mạch điện trở phụ vạn năng như hình", "Given the universal multiplier circuit shown"],
    ["Biết cơ cấu đo từ điện có giá trị giới hạn đo", "The moving-coil movement has a full-scale current"],
    ["nội trở của cơ cấu đo", "and internal resistance"],
    ["Tính các giá trị điện trở Shunt để có ba thang đo", "Find the shunt resistor values that give three ranges"],
    ["Tính các giá trị điện trở phụ để có ba thang đo", "Find the multiplier resistor values that give three ranges"],
    ["tương ứng với khóa chuyển mạch S ở vị trí A, B và C", "corresponding to selector switch S at positions A, B and C"]
  ],
  // <strong>Shunt riêng rẽ</strong> (song song cơ cấu): R<sub>S</sub> = R<sub>g</sub>·I<sub>gm</sub> / (I − I<sub>gm</sub>).
  "amz85y": "<strong>Individual shunts</strong> (in parallel with the movement): R<sub>S</sub> = R<sub>g</sub>·I<sub>gm</sub> / (I − I<sub>gm</sub>).",
  // <strong>Shunt vạn năng</strong>: A → shunt R<sub>{0}</sub>+R<sub>{1}</sub>+R<sub>{2}</sub>; B → shunt R<sub>{3}</sub>+R<sub>{4}</sub>, R<sub>{5}</sub> nối tiếp cơ cấu; C → shunt R<sub>{6}</sub>, R<sub>{7}</sub>+R<sub>{8}</sub> nối tiếp cơ cấu. Giải hệ {9} phương trình.
  "~10607om": "<strong>Universal (Ayrton) shunt</strong>: A → shunt R<sub>{0}</sub>+R<sub>{1}</sub>+R<sub>{2}</sub>; B → shunt R<sub>{3}</sub>+R<sub>{4}</sub>, R<sub>{5}</sub> in series with the movement; C → shunt R<sub>{6}</sub>, R<sub>{7}</sub>+R<sub>{8}</sub> in series with the movement. Solve a system of {9} equations.",
  // <strong>Điện trở phụ riêng rẽ</strong> (nối tiếp cơ cấu): R<sub>P</sub> = U / I<sub>gm</sub> − R<sub>g</sub>.
  "q5s4bj": "<strong>Individual multipliers</strong> (in series with the movement): R<sub>P</sub> = U / I<sub>gm</sub> − R<sub>g</sub>.",
  // <strong>Điện trở phụ vạn năng</strong>: R<sub>{0}</sub> = U<sub>A</sub>/I<sub>gm</sub> − R<sub>g</sub>; R<sub>{1}</sub> = U<sub>B</sub>/I<sub>gm</sub> − R<sub>g</sub> − R<sub>{2}</sub>; R<sub>{3}</sub> = U<sub>C</sub>/I<sub>gm</sub> − R<sub>g</sub> − R<sub>{4}</sub> − R<sub>{5}</sub>.
  "~nffddq": "<strong>Universal (series-chain) multipliers</strong>: R<sub>{0}</sub> = U<sub>A</sub>/I<sub>gm</sub> − R<sub>g</sub>; R<sub>{1}</sub> = U<sub>B</sub>/I<sub>gm</sub> − R<sub>g</sub> − R<sub>{2}</sub>; R<sub>{3}</sub> = U<sub>C</sub>/I<sub>gm</sub> − R<sub>g</sub> − R<sub>{4}</sub> − R<sub>{5}</sub>.",
  // Đổi đơn vị trước khi tính: {0} mA = {1}⁻³ A, {2} µA = {3}⁻⁶ A, {4} kΩ = {5}³ Ω, {6} MΩ = {7}⁶ Ω.
  "~1kupnuz": "Convert units before calculating: {0} mA = {1}⁻³ A, {2} µA = {3}⁻⁶ A, {4} kΩ = {5}³ Ω, {6} MΩ = {7}⁶ Ω.",
  // Xác định điện trở mở rộng tầm đo của cơ cấu đo từ điện đo dòng điện {0} chiều, mở rộng {1} tầm đo.
  "~ogr26o": "Determine the range-extension resistors for a moving-coil (PMMC) movement measuring DC current, extended to {1} ranges.",
  // Xác định điện trở phụ mở rộng tầm đo của cơ cấu đo từ điện đo điện áp {0} chiều, mở rộng {1} tầm đo.
  "~1e89me9": "Determine the multiplier resistors for a moving-coil (PMMC) movement measuring DC voltage, extended to {1} ranges.",
  // Đề {0} · câu a
  "~1pwjhh6": "Test {0} · part a",
  // Đề {0} · câu b
  "~1pmjvs7": "Test {0} · part b",
  // Mạch Shunt riêng rẽ
  "vp4577": "Individual shunt circuit",
  // Mạch Shunt vạn năng
  "1gwx807": "Universal (Ayrton) shunt circuit",
  // Mạch điện trở phụ riêng rẽ
  "3a0dke": "Individual multiplier circuit",
  // Mạch điện trở phụ vạn năng
  "tfr2si": "Universal multiplier circuit",
  // Xem lời giải câu a
  "rspqlu": "View solution for part a",
  // Xem lời giải câu b
  "riq4wv": "View solution for part b",
  // Giải hệ {0} phương trình:
  "~1j3iia": "Solve the system of {0} equations:",
  // Điện trở Shunt mắc song song với cơ cấu đo ⇒ U<sub>S</sub> = U<sub>g</sub> ⇒ R<sub>S</sub> × I<sub>S</sub> = R<sub>g</sub> × I<sub>gm</sub>, với I<sub>S</sub> = I − I<sub>gm</sub>.
  "1trt4j6": "The shunt is in parallel with the movement ⇒ U<sub>S</sub> = U<sub>g</sub> ⇒ R<sub>S</sub> × I<sub>S</sub> = R<sub>g</sub> × I<sub>gm</sub>, where I<sub>S</sub> = I − I<sub>gm</sub>.",
  // Điện trở phụ mắc nối tiếp cơ cấu đo; kim lệch hết thang khi I<sub>g</sub> = I<sub>gm</sub> ⇒ U = I<sub>gm</sub> × (R<sub>g</sub> + R<sub>P</sub>) ⇒ R<sub>P</sub> = <span class="dld-frac"><span>U</span><span>I<sub>gm</sub></span></span> − R<sub>g</sub>.
  "1j3xif0": "The multiplier is in series with the movement; the needle reaches full scale when I<sub>g</sub> = I<sub>gm</sub> ⇒ U = I<sub>gm</sub> × (R<sub>g</sub> + R<sub>P</sub>) ⇒ R<sub>P</sub> = <span class=\"dld-frac\"><span>U</span><span>I<sub>gm</sub></span></span> − R<sub>g</sub>.",
  // Các điện trở phụ nối tiếp nhau: thang sau dùng lại các điện trở của thang trước, R<sub>P</sub> = <span class="dld-frac"><span>U</span><span>I<sub>gm</sub></span></span> − R<sub>g</sub>.
  "nd1rva": "The multipliers are in series: each higher range reuses the resistors of the previous range, R<sub>P</sub> = <span class=\"dld-frac\"><span>U</span><span>I<sub>gm</sub></span></span> − R<sub>g</sub>.",
  // <a class="backlink" href="/doluongdien">← Đo Lường Điện</a>
  "55psvs": "<a class=\"backlink\" href=\"/doluongdien\">← Electrical Measurement</a>"
};
