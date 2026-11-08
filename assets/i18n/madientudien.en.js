/* Bản tiếng Anh của /madientudien cho nút VI/EN (assets/i18n.js).
   Khoá = mã băm của đoạn tiếng Việt (CTI18N.hash; "~" = mẫu có số {0}, {1}…); dòng chú thích phía trên là đoạn tiếng Việt gốc.
   Sửa câu tiếng Việt trong trang thì phải sửa cả khoá ở đây, nếu không câu đó hiện tiếng Việt.
   Thêm/đổi chữ: mở trang, gõ CTI18N.collect() trong console để lấy khoá các câu chưa dịch. */
window.CT_EN = {
  // {0} đề (Đề mẫu + {1} đề tổng hợp), mỗi đề {2} câu. Phần {3}: đọc mã in trên thân tụ ra giá trị và chọn sai số. Phần {4}: từ giá trị điện dung viết ra mã in. Điền xong bấm Kiểm tra từng phần.
  "~1tjt1s0": "{0} tests (Sample test + {1} mixed tests), {2} questions each. Part {3}: read the code printed on the capacitor and give its value and tolerance. Part {4}: from the capacitance, write the printed code. When done, press Check for each part.",
  // Ghi nhớ quy ước &amp; cách nhập đáp án
  "rh1kcf": "Conventions to remember &amp; how to enter answers",
  // Quy đổi: {0} F = {1}⁶ µF = {2}⁹ nF = {3}¹² pF; {4} µF = {5} nF; {6} nF = {7} pF.
  "~hy7msg": "Conversions: {0} F = {1}⁶ µF = {2}⁹ nF = {3}¹² pF; {4} µF = {5} nF; {6} nF = {7} pF.",
  // Đơn vị gốc của mã số luôn là picofarad (pF).
  "11asyj2": "The base unit of a numeric code is always the picofarad (pF).",
  // Mã {0} hoặc {1} chữ số: đọc thẳng theo pF: <code>{2}J</code> = {3} pF, <code>{4}K</code> = {5} pF.
  "~17qc0sx": "{0}- or {1}-digit code: read directly in pF: <code>{2}J</code> = {3} pF, <code>{4}K</code> = {5} pF.",
  // Mã {0} chữ số: {1} số đầu là giá trị, số thứ {2} là số mũ của {3}: <code>{4}</code> = {5} × {6}² = {7} pF = {8} nF.
  "~irahqx": "{0}-digit code: the first {1} digits are the value, digit {2} is the power of {3}: <code>{4}</code> = {5} × {6}² = {7} pF = {8} nF.",
  // Bẫy số {0}: số cuối là {1} thì nhân {2}⁰ = {3}: <code>{4}J</code> = {5} pF.
  "~deq5y9": "The {0} trap: if the last digit is {1}, multiply by {2}⁰ = {3}: <code>{4}J</code> = {5} pF.",
  // Chữ sai số: <code>J</code> = ±{0}%, <code>K</code> = ±{1}%.
  "~v8on5q": "Tolerance letters: <code>J</code> = ±{0}%, <code>K</code> = ±{1}%.",
  // Phần {0} nhập giá trị kèm đơn vị, ví dụ <code>{1}nF</code>, <code>{2}pF</code>, <code>{3}uF</code> hoặc <code>{4}n</code>. Không ghi đơn vị thì hiểu là pF. Rồi chọn sai số ±{5}% hoặc ±{6}%.
  "~1ujobaj": "Part {0}: enter the value with its unit, e.g. <code>{1}nF</code>, <code>{2}pF</code>, <code>{3}uF</code> or <code>{4}n</code>. Without a unit it is taken as pF. Then choose a tolerance of ±{5}% or ±{6}%.",
  // Phần {0} nhập mã, ví dụ <code>{1}J</code>. Chữ thường hay hoa đều được.
  "~1b2wd97": "Part {0}: enter the code, e.g. <code>{1}J</code>. Upper or lower case are both fine.",
  // Đề mẫu · Đã đúng {0}/{1} phần
  "~1lyrh8u": "Sample test · {0}/{1} parts correct",
  // Phần {0}
  "~11s2tg2": "Part {0}",
  // Đọc mã trên thân tụ ra giá trị và sai số
  "iks1o0": "Read the code on the capacitor body and give its value and tolerance",
  // sai số
  "whh94": "tolerance",
  // a) {0}J → mã {1} số, đọc thẳng = {2} pF, J = ±{3}%
  "~7iwl1c": "a) {0}J → {1}-digit code, read directly = {2} pF, J = ±{3}%",
  // b) {0}K → mã {1} số, đọc thẳng = {2} pF, K = ±{3}%
  "~wmdnfd": "b) {0}K → {1}-digit code, read directly = {2} pF, K = ±{3}%",
  // l) {0}J → {1} × {2}⁰ pF (bẫy: số {3} cuối là × {4}⁰) = {5} pF, J = ±{6}%
  "~1xmuy8s": "l) {0}J → {1} × {2}⁰ pF (trap: a final {3} means × {4}⁰) = {5} pF, J = ±{6}%",
  // Từ giá trị điện dung, viết mã in trên thân tụ
  "x05vrp": "From the capacitance, write the code printed on the capacitor body",
  // a) {0} pF ±{1}% → dưới {2} pF ghi thẳng số → {3}J
  "~jc3yf7": "a) {0} pF ±{1}% → below {2} pF the number is written directly → {3}J",
  // b) {0} pF ±{1}% → dưới {2} pF ghi thẳng số → {3}K
  "~1salw81": "b) {0} pF ±{1}% → below {2} pF the number is written directly → {3}K",
  // Đề {0} · Đã đúng {1}/{2} phần
  "~4y08sr": "Test {0} · {1}/{2} parts correct",
  // l) {0}K → {1} × {2}⁰ pF (bẫy: số {3} cuối là × {4}⁰) = {5} pF, K = ±{6}%
  "~16kzhvi": "l) {0}K → {1} × {2}⁰ pF (trap: a final {3} means × {4}⁰) = {5} pF, K = ±{6}%",
  // Giá trị của mã {0}J, Đề mẫu
  "~8r7rcq": "Value of code {0}J, Sample test",
  // Sai số của mã {0}J, Đề mẫu
  "~kjyjz9": "Tolerance of code {0}J, Sample test",
  // Giá trị của mã {0}K, Đề mẫu
  "~m667cd": "Value of code {0}K, Sample test",
  // Sai số của mã {0}K, Đề mẫu
  "~hu8lci": "Tolerance of code {0}K, Sample test",
  // Mã cho {0} pF ±{1}%, Đề mẫu
  "~152r9je": "Code for {0} pF ±{1}%, Sample test",
  // Mã cho {0} nF ±{1}%, Đề mẫu
  "~fs19o4": "Code for {0} nF ±{1}%, Sample test",
  // Mã cho {0} µF ±{1}%, Đề mẫu
  "~wsd19v": "Code for {0} µF ±{1}%, Sample test",
  // Giá trị của mã {0}J, Đề {1}
  "~1hbhf0a": "Value of code {0}J, Test {1}",
  // Sai số của mã {0}J, Đề {1}
  "~75h089": "Tolerance of code {0}J, Test {1}",
  // Giá trị của mã {0}K, Đề {1}
  "~hpzgoh": "Value of code {0}K, Test {1}",
  // Sai số của mã {0}K, Đề {1}
  "~19dyi6q": "Tolerance of code {0}K, Test {1}",
  // Mã cho {0} pF ±{1}%, Đề {2}
  "~1xk75i9": "Code for {0} pF ±{1}%, Test {2}",
  // Mã cho {0} nF ±{1}%, Đề {2}
  "~1iatjr3": "Code for {0} nF ±{1}%, Test {2}",
  // Mã cho {0} µF ±{1}%, Đề {2}
  "~xrwg7w": "Code for {0} µF ±{1}%, Test {2}",
  // Đúng {0}/{1} câu. Sửa ô đỏ hoặc mở đáp án.
  "~triaw5": "{0}/{1} questions correct. Fix the red boxes or open the answers."
};
