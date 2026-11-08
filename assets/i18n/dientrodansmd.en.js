/* Bản tiếng Anh của /dientrodansmd cho nút VI/EN (assets/i18n.js).
   Khoá = mã băm của đoạn tiếng Việt (CTI18N.hash; "~" = mẫu có số {0}, {1}…); dòng chú thích phía trên là đoạn tiếng Việt gốc.
   Sửa câu tiếng Việt trong trang thì phải sửa cả khoá ở đây, nếu không câu đó hiện tiếng Việt.
   Thêm/đổi chữ: mở trang, gõ CTI18N.collect() trong console để lấy khoá các câu chưa dịch. */
window.CT_EN = {
  // {0} đề (Đề mẫu + {1} đề ôn luyện), mỗi đề {2} câu. Phần {3}: đọc mã ra giá trị điện trở tính bằng ohm (Ω). Phần {4}: từ giá trị viết ra mã in. Điền xong bấm Kiểm tra từng câu.
  "~1vqgfx0": "{0} tests (Sample test + {1} practice tests), {2} questions each. Part {3}: read the code and give the resistance in ohms (Ω). Part {4}: from the value, write the printed code. When done, press Check for each question.",
  // Cách nhập đáp án &amp; quy tắc đọc mã
  "n7ts0x": "How to enter answers &amp; code-reading rules",
  // Phần {0} ghi giá trị theo ohm (Ω), ví dụ {1} kΩ ghi <code>{2}</code>. Có thể viết gọn bằng tiền tố: <code>{3}k</code> (= {4} {5} Ω), <code>{6}k</code> hoặc <code>{7}k{8}</code>, <code>{9}M</code> (= {10} {11} {12} Ω), <code>{13}m</code> (= {14} Ω). Chữ <code>m</code> thường = mili, <code>M</code> hoa = mega.
  "~g1di94": "Part {0}: write the value in ohms (Ω), e.g. {1} kΩ is written <code>{2}</code>. You can shorten it with a prefix: <code>{3}k</code> (= {4} {5} Ω), <code>{6}k</code> or <code>{7}k{8}</code>, <code>{9}M</code> (= {10} {11} {12} Ω), <code>{13}m</code> (= {14} Ω). Lowercase <code>m</code> = milli, uppercase <code>M</code> = mega.",
  // Mã {0} số: {1} số đầu là giá trị, số cuối là số chữ số {2} thêm vào: <code>{3}</code> = {4} × {5}² = {6} kΩ.
  "~hex737": "{0}-digit code: the first {1} digits are the value, the last digit is how many {2}s to add: <code>{3}</code> = {4} × {5}² = {6} kΩ.",
  // Mã {0} số: {1} số đầu là giá trị, số cuối là số chữ số {2}: <code>{3}</code> = {4} × {5}² = {6} kΩ.
  "~zren77": "{0}-digit code: the first {1} digits are the value, the last digit is the number of {2}s: <code>{3}</code> = {4} × {5}² = {6} kΩ.",
  // Bẫy số {0}: số cuối là {1} thì không thêm số {2} nào: <code>{3}</code> = {4} Ω, <code>{5}</code> = {6} Ω.
  "~4x7fig": "The {0} trap: if the last digit is {1}, add no {2}s at all: <code>{3}</code> = {4} Ω, <code>{5}</code> = {6} Ω.",
  // Chữ <code>R</code> là dấu thập phân: <code>{0}R{1}</code> = {2} Ω, <code>R{3}</code> = {4} Ω, <code>R{5}</code> = {6} Ω = {7} mΩ.
  "~1fytij3": "The letter <code>R</code> is the decimal point: <code>{0}R{1}</code> = {2} Ω, <code>R{3}</code> = {4} Ω, <code>R{5}</code> = {6} Ω = {7} mΩ.",
  // <code>{0}</code> hoặc <code>{1}</code> = {2} Ω (điện trở cầu nối – jumper).
  "~15tjm81": "<code>{0}</code> or <code>{1}</code> = {2} Ω (zero-ohm jumper).",
  // Đề mẫu · Đã đúng {0}/{1} câu
  "~13wn69d": "Sample test · {0}/{1} questions correct",
  // Câu {0}
  "~xxqwhd": "Question {0}",
  // Dải Kilo Ohm thông dụng (kΩ)
  "10gy34a": "Common kilo-ohm range (kΩ)",
  // Phần {0} · Đọc mã ra giá trị điện trở (ohm – Ω)
  "~qwz481": "Part {0} · Read the code and give the resistance (ohm – Ω)",
  // Phần {0} · Viết mã in trên thân
  "~nrqqbu": "Part {0} · Write the code printed on the body",
  // (chuẩn {0} số)
  "~92mdrt": "({0}-digit standard)",
  // Các bẫy số “{0}” và hàng chục Ohm
  "~ghqa4t": "The “{0}” traps and tens of ohms",
  // Ký tự “R” làm dấu thập phân (dưới {0} Ω)
  "~1trxjf9": "The letter “R” as a decimal point (below {0} Ω)",
  // (chuẩn {0} ký tự)
  "~10w8so8": "({0}-character standard)",
  // P{0} a) {1}R{2} → R là dấu thập phân: {3} Ω = {4} Ω
  "~rcfg3": "P{0} a) {1}R{2} → R is the decimal point: {3} Ω = {4} Ω",
  // P{0} b) R{1} → R là dấu thập phân: {2} Ω = {3} Ω ({4} mΩ)
  "~b4bmax": "P{0} b) R{1} → R is the decimal point: {2} Ω = {3} Ω ({4} mΩ)",
  // P{0} c) {1}R{2} → R là dấu thập phân: {3} Ω = {4} Ω
  "~1lz8zkd": "P{0} c) {1}R{2} → R is the decimal point: {3} Ω = {4} Ω",
  // P{0} a) {1} Ω ⇒ R{2} → R là dấu thập phân: {3} Ω = {4} Ω ({5} mΩ)
  "~1oss8vy": "P{0} a) {1} Ω ⇒ R{2} → R is the decimal point: {3} Ω = {4} Ω ({5} mΩ)",
  // P{0} b) {1} Ω ⇒ {2}R{3} → R là dấu thập phân: {4} Ω = {5} Ω
  "~duy84y": "P{0} b) {1} Ω ⇒ {2}R{3} → R is the decimal point: {4} Ω = {5} Ω",
  // P{0} c) {1} Ω ⇒ {2}R{3} → R là dấu thập phân: {4} Ω = {5} Ω
  "~1dixp6b": "P{0} c) {1} Ω ⇒ {2}R{3} → R is the decimal point: {4} Ω = {5} Ω",
  // Dải điện trở Shunt / Milliohm (mΩ)
  "1f2i8da": "Shunt / milliohm range (mΩ)",
  // P{0} a) R{1} → R là dấu thập phân: {2} Ω = {3} Ω ({4} mΩ)
  "~whak32": "P{0} a) R{1} → R is the decimal point: {2} Ω = {3} Ω ({4} mΩ)",
  // P{0} c) R{1} → R là dấu thập phân: {2} Ω = {3} Ω ({4} mΩ)
  "~n3h2ew": "P{0} c) R{1} → R is the decimal point: {2} Ω = {3} Ω ({4} mΩ)",
  // P{0} a) {1} Ω ({2} mΩ) ⇒ R{3} → R là dấu thập phân: {4} Ω = {5} Ω ({6} mΩ)
  "~zpvvrf": "P{0} a) {1} Ω ({2} mΩ) ⇒ R{3} → R is the decimal point: {4} Ω = {5} Ω ({6} mΩ)",
  // P{0} b) {1} Ω ({2} mΩ) ⇒ R{3} → R là dấu thập phân: {4} Ω = {5} Ω ({6} mΩ)
  "~1blip3a": "P{0} b) {1} Ω ({2} mΩ) ⇒ R{3} → R is the decimal point: {4} Ω = {5} Ω ({6} mΩ)",
  // P{0} c) {1} Ω ({2} mΩ) ⇒ R{3} → R là dấu thập phân: {4} Ω = {5} Ω ({6} mΩ)
  "~1wwfdqh": "P{0} c) {1} Ω ({2} mΩ) ⇒ R{3} → R is the decimal point: {4} Ω = {5} Ω ({6} mΩ)",
  // Dải giá trị lớn (Mega Ohm – MΩ)
  "4qbiqi": "High-value range (megaohm – MΩ)",
  // Đối chiếu &amp; phân biệt chuẩn {0} số và {1} số
  "~c961wm": "Comparing &amp; telling apart the {0}-digit and {1}-digit standards",
  // {0} số
  "~793lgr": "{0} digits",
  // P{0} c) {1} → {2} Ω (điện trở cầu nối – jumper)
  "~1dsf6ht": "P{0} c) {1} → {2} Ω (zero-ohm jumper)",
  // Đề {0} · Đã đúng {1}/{2} câu
  "~1rezaw2": "Test {0} · {1}/{2} questions correct",
  // P{0} c) {1}R{2} → R là dấu thập phân: {3} Ω = {4} Ω ({5} mΩ)
  "~1l217u9": "P{0} c) {1}R{2} → R is the decimal point: {3} Ω = {4} Ω ({5} mΩ)",
  // Giá trị của mã {0}, Đề mẫu câu {1}
  "~r30z5f": "Value of code {0}, Sample test question {1}",
  // số ohm
  "1qwrsib": "ohms",
  // Mã {0} số cho {1} kΩ, Đề mẫu câu {2}
  "~13pvt1i": "{0}-digit code for {1} kΩ, Sample test question {2}",
  // Mã {0} số cho {1} Ω, Đề mẫu câu {2}
  "~1mmuce9": "{0}-digit code for {1} Ω, Sample test question {2}",
  // Giá trị của mã {0}R{1}, Đề mẫu câu {2}
  "~1el164h": "Value of code {0}R{1}, Sample test question {2}",
  // Giá trị của mã R{0}, Đề mẫu câu {1}
  "~17n9td": "Value of code R{0}, Sample test question {1}",
  // Mã {0} ký tự cho {1} Ω, Đề mẫu câu {2}
  "~geqol0": "{0}-character code for {1} Ω, Sample test question {2}",
  // Mã {0} ký tự cho {1} Ω ({2} mΩ), Đề mẫu câu {3}
  "~10lg054": "{0}-character code for {1} Ω ({2} mΩ), Sample test question {3}",
  // Mã {0} số cho {1} MΩ, Đề mẫu câu {2}
  "~wnnixk": "{0}-digit code for {1} MΩ, Sample test question {2}",
  // Giá trị của mã {0}, Đề {1} câu {2}
  "~7asasw": "Value of code {0}, Test {1} question {2}",
  // Mã {0} số cho {1} kΩ, Đề {2} câu {3}
  "~k0gj0w": "{0}-digit code for {1} kΩ, Test {2} question {3}",
  // Mã {0} số cho {1} Ω, Đề {2} câu {3}
  "~1d4nrc3": "{0}-digit code for {1} Ω, Test {2} question {3}",
  // Giá trị của mã {0}R{1}, Đề {2} câu {3}
  "~1x4uq77": "Value of code {0}R{1}, Test {2} question {3}",
  // Giá trị của mã R{0}, Đề {1} câu {2}
  "~n5jjh6": "Value of code R{0}, Test {1} question {2}",
  // Mã {0} ký tự cho {1} Ω, Đề {2} câu {3}
  "~90g1le": "{0}-character code for {1} Ω, Test {2} question {3}",
  // Mã {0} ký tự cho {1} Ω ({2} mΩ), Đề {3} câu {4}
  "~l41f9p": "{0}-character code for {1} Ω ({2} mΩ), Test {3} question {4}",
  // Mã {0} số cho {1} MΩ, Đề {2} câu {3}
  "~30c27y": "{0}-digit code for {1} MΩ, Test {2} question {3}",
  // Đúng {0}/{1} ô. Sửa ô đỏ hoặc mở đáp án.
  "~qizeit": "{0}/{1} boxes correct. Fix the red boxes or open the answers."
};
