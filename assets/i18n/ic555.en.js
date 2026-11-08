/* Bản tiếng Anh của /ic555 cho nút VI/EN (assets/i18n.js).
   Khoá = mã băm của đoạn tiếng Việt (CTI18N.hash; "~" = mẫu có số {0}, {1}…); dòng chú thích phía trên là đoạn tiếng Việt gốc.
   Sửa câu tiếng Việt trong trang thì phải sửa cả khoá ở đây, nếu không câu đó hiện tiếng Việt.
   Thêm/đổi chữ: mở trang, gõ CTI18N.collect() trong console để lấy khoá các câu chưa dịch. */
window.CT_EN = {
  // Muốn đèn LED tự nhấp nháy, hay muốn đóng cắt MOSFET hàng chục nghìn lần mỗi giây như trong <a href="/machboost">mạch tăng áp Boost</a>, đều cần một mạch <strong>phát xung</strong>. Cách rẻ và dễ nhất là dùng <strong>IC {0}</strong>.
  "~onyhty": "Whether you want an LED to blink by itself or need to switch a MOSFET tens of thousands of times per second as in the <a href=\"/machboost\">Boost converter</a>, you need a <strong>pulse generator</strong>. The cheapest and easiest way is the <strong>{0} IC</strong>.",
  // IC {0} là gì
  "~geoc18": "What the {0} IC is",
  // {0} là <strong>một con IC</strong>, một con chip nhỏ {1} chân. Mua ở tiệm linh kiện, tên hay gặp là <strong>NE{2}</strong>, giá khoảng {3}–{4} nghìn. Nó <strong>không tự phát xung</strong>: phải gắn thêm {5} điện trở và {6} tụ bên ngoài mới thành "mạch {7}". Nguồn nuôi từ {8}V đến {9}V, nên chạy thẳng bằng {10}V hoặc {11}V được.
  "~12coklc": "The {0} is <strong>an IC</strong>, a small {1}-pin chip. At an electronics shop it is usually sold as the <strong>NE{2}</strong>, for about {3}–{4} thousand VND. It <strong>does not generate pulses by itself</strong>: you have to add {5} resistors and {6} capacitor outside to make a \"{7} circuit\". It runs from {8}V to {9}V, so it works straight from {10}V or {11}V.",
  // Dễ nhớ: {0} giống <strong>cái đồng hồ đếm nhịp</strong>. R và C là quả lắc: chọn R, C khác nhau thì nhịp nhanh chậm khác nhau.
  "~vwrei7": "Easy to remember: the {0} is like <strong>a metronome</strong>. R and C are the pendulum: different R and C give a faster or slower beat.",
  // Sơ đồ chân IC {0}
  "~18olf30": "{0} IC pinout",
  // IC {0} chân nhìn từ trên xuống, khấc ở đầu. Bên trái từ trên xuống: {1} GND, {2} TRIG, {3} OUT, {4} RESET. Bên phải từ dưới lên: {5} CV, {6} THR, {7} DIS, {8} VCC.
  "~1bgsqfh": "{0}-pin IC seen from above, notch at the top. Left side, top to bottom: {1} GND, {2} TRIG, {3} OUT, {4} RESET. Right side, bottom to top: {5} CV, {6} THR, {7} DIS, {8} VCC.",
  // {0} · TRIG (kích)
  "~sew3wk": "{0} · TRIG (trigger)",
  // {0} · OUT (ngõ ra)
  "~19v2f8m": "{0} · OUT (output)",
  // {0} · VCC (+nguồn)
  "~16x1i7z": "{0} · VCC (+supply)",
  // {0} · DIS (xả)
  "~6lud40": "{0} · DIS (discharge)",
  // {0} · THR (ngưỡng)
  "~1p2ovaw": "{0} · THR (threshold)",
  // {0} · CV (chống nhiễu)
  "~1ls0tu0": "{0} · CV (noise filter)",
  // Nhìn từ trên xuống, khấc (hoặc chấm tròn) ở phía trên. Chân {0} nằm ở góc trên bên trái, đếm ngược chiều kim đồng hồ.
  "~kxrw68": "Seen from above, with the notch (or round dot) at the top. Pin {0} is at the top-left corner; count anticlockwise.",
  // Mạch phát xung (astable)
  "8x6zm4": "Pulse generator (astable)",
  // Mạch chuẩn để {0} tự phát xung liên tục, ví dụ cho đèn LED nháy khoảng {1} lần mỗi giây:
  "~1tdpmsc": "The standard circuit that makes the {0} generate pulses continuously, for example to blink an LED about {1} times per second:",
  // Mạch {0} phát xung nháy LED
  "~1gkzm3m": "{0} pulse circuit blinking an LED",
  // Chân {0} và {1} nối nguồn dương. R{2} từ nguồn xuống chân {3}, R{4} từ chân {5} xuống chân {6} và {7} nối chung, tụ C từ đó xuống mass. Chân {8} có tụ {9}nF xuống mass, chân {10} nối mass. Chân {11} qua điện trở {12}k tới LED rồi xuống mass.
  "~1k1ydrc": "Pins {0} and {1} go to the positive supply. R{2} from the supply to pin {3}, R{4} from pin {5} to pins {6} and {7} tied together, capacitor C from there to ground. Pin {8} has a {9}nF capacitor to ground, pin {10} goes to ground. Pin {11} drives the LED through a {12}k resistor, then to ground.",
  // Chân {0} và chân {1} nối chung với nhau. Đổi R{2}, R{3}, C là đổi tốc độ nháy.
  "~an7aes": "Pin {0} and pin {1} are tied together. Changing R{2}, R{3}, C changes the blink rate.",
  // Bên trong nó làm gì
  "utvrqi": "What happens inside",
  // <strong>Dễ nhớ:</strong> giống bồn nước có phao. Nước <span class="k-cap">chảy vào</span> tới vạch trên thì phao bật <span class="k-dis">mở van xả</span>; nước rút xuống vạch dưới thì phao bật <span class="k-cap">đóng van</span> lại. Bồn là tụ C, van xả là chân {0}, còn cái phao bật qua bật lại chính là chỗ người ta gọi là “{1} lật”.
  "~1pob066": "<strong>Easy to remember:</strong> like a tank with a float. Water <span class=\"k-cap\">flows in</span> up to the top mark and the float flips to <span class=\"k-dis\">open the drain valve</span>; the water drops to the bottom mark and the float flips to <span class=\"k-cap\">close the valve</span> again. The tank is capacitor C, the drain valve is pin {0}, and the float that flips back and forth is what people call the “{1} flipping”.",
  // Bên trong {0} có {1} khối chính: hai <strong>bộ so sánh</strong> canh áp trên tụ, và một <strong>công tắc nhớ</strong> (tên kỹ thuật là flip-flop). “Lật” nghĩa là công tắc nhớ đổi trạng thái từ CAO sang THẤP hoặc ngược lại. Nó giống công tắc đèn bập bênh: bấm một lần thì nằm yên ở vị trí đó cho tới khi có ai bấm phía bên kia.
  "~8ftxgg": "Inside the {0} there are {1} main blocks: two <strong>comparators</strong> watching the capacitor voltage, and a <strong>memory switch</strong> (technically a flip-flop). “Flipping” means the memory switch changes from HIGH to LOW or back. It is like a rocker light switch: press it once and it stays there until someone presses the other side.",
  // Sơ đồ bên trong {0} đơn giản: hai bộ so sánh, công tắc nhớ, van xả chân {1}, tụ C và LED
  "~kx89zn": "Simplified inside of the {0}: two comparators, the memory switch, the drain valve at pin {1}, capacitor C and the LED",
  // NE{0} (vẽ đơn giản phần bên trong)
  "~pl168m": "NE{0} (simplified drawing of the inside)",
  // So sánh trên
  "uf2mj3": "Upper comparator",
  // tụ ≥ {0}V ?
  "~1tq7qgi": "cap ≥ {0}V ?",
  // So sánh dưới
  "4jxtvx": "Lower comparator",
  // tụ ≤ {0}V ?
  "~1s8yfzb": "cap ≤ {0}V ?",
  // bấm → THẤP
  "hmzbs7": "press → LOW",
  // bấm → CAO
  "1glsyxs": "press → HIGH",
  // nhớ
  "ylz1og": "memory",
  // van xả
  "1jemyzf": "drain valve",
  // áp tụ
  "wo5dk7": "cap voltage",
  // Bước {0}: Nạp
  "~1gjc5q4": "Step {0}: Charge",
  // Bước {0}: Lật xuống
  "~1y3faun": "Step {0}: Flip down",
  // Bước {0}: Xả
  "~16wmcu0": "Step {0}: Discharge",
  // Bước {0}: Lật lên
  "~re99eq": "Step {0}: Flip up",
  // Điểm mấu chốt là chữ <strong>“nhớ”</strong>: khi áp tụ nằm giữa {0}V và {1}V thì không bộ so sánh nào lên tiếng, nên công tắc cứ giữ trạng thái cũ. Nhờ vậy lúc đi lên tụ nạp một mạch tới {2}V, lúc đi xuống xả một mạch về {3}V, chứ không bị bật qua bật lại lung tung ở giữa.
  "~k846xf": "The key is the word <strong>“memory”</strong>: while the capacitor voltage is between {0}V and {1}V neither comparator speaks up, so the switch keeps its previous state. That is why on the way up the capacitor charges all the way to {2}V, and on the way down it discharges all the way to {3}V, instead of flipping back and forth in the middle.",
  // Tóm lại một vòng:
  "1g7trmw": "One cycle in short:",
  // Tụ C được <span class="k-cap">nạp</span> qua R{0} + R{1}. Trong lúc này chân {2} ở mức <span class="k-out">cao</span> (LED sáng).
  "~1dgppf3": "Capacitor C <span class=\"k-cap\">charges</span> through R{0} + R{1}. Meanwhile pin {2} is <span class=\"k-out\">high</span> (LED on).",
  // Khi áp trên tụ lên tới <strong>{0}/{1} áp nguồn</strong>, {2} lật: chân {3} xuống <span class="k-out">thấp</span> (LED tắt), chân {4} mở ra cho tụ <span class="k-cap">xả</span> qua R{5}.
  "~vnd25w": "When the capacitor voltage reaches <strong>{0}/{1} of the supply</strong>, the {2} flips: pin {3} goes <span class=\"k-out\">low</span> (LED off) and pin {4} opens so the capacitor <span class=\"k-cap\">discharges</span> through R{5}.",
  // Khi áp trên tụ xuống còn <strong>{0}/{1} áp nguồn</strong>, {2} lật lại: chân {3} lên cao, tụ nạp tiếp. Lặp lại mãi.
  "~1d6wbs6": "When the capacitor voltage falls to <strong>{0}/{1} of the supply</strong>, the {2} flips back: pin {3} goes high and the capacitor charges again. Over and over.",
  // Vì tụ nạp qua cả R{0} + R{1} nhưng chỉ xả qua R{2}, thời gian <strong>cao luôn dài hơn thời gian thấp</strong>, nên D luôn lớn hơn {3}%.
  "~10vd4ua": "Because the capacitor charges through R{0} + R{1} but discharges only through R{2}, the <strong>high time is always longer than the low time</strong>, so D is always above {3}%.",
  // t<sub>cao</sub> = {0} × (R{1} + R{2}) × C &nbsp;·&nbsp; t<sub>thấp</sub> = {3} × R{4} × C
  "~du7w0q": "t<sub>high</sub> = {0} × (R{1} + R{2}) × C &nbsp;·&nbsp; t<sub>low</sub> = {3} × R{4} × C",
  // D là chu kỳ làm việc, tức tỉ lệ thời gian ngõ ra ở mức cao: D = t<sub>cao</sub> / (t<sub>cao</sub> + t<sub>thấp</sub>). Muốn D gần {0}% thì chọn <strong>R{1} nhỏ hơn R{2} nhiều</strong>.
  "~vfrwub": "D is the duty cycle, the fraction of time the output is high: D = t<sub>high</sub> / (t<sub>high</sub> + t<sub>low</sub>). For D close to {0}%, choose <strong>R{1} much smaller than R{2}</strong>.",
  // Máy tính {0}
  "~dc6mml": "{0} calculator",
  // Nhập R{0}, R{1}, C để xem tần số, D và dạng sóng. <span class="k-cap">Đường xanh</span> là áp trên tụ, <span class="k-out">đường cam</span> là ngõ ra chân {2}.
  "~bbrqo9": "Enter R{0}, R{1}, C to see the frequency, D and the waveform. The <span class=\"k-cap\">blue line</span> is the capacitor voltage, the <span class=\"k-out\">orange line</span> is the output at pin {2}.",
  // Nháy LED ~{0} Hz
  "~18t4dqi": "LED blink ~{0} Hz",
  // Mạch Boost ~{0} kHz
  "~1hry8u6": "Boost converter ~{0} kHz",
  // Tần số f
  "13c5ikc": "Frequency f",
  // Chu kỳ D
  "10rjfed": "Duty cycle D",
  // Thời gian cao
  "czul1v": "High time",
  // Thời gian thấp
  "zo17or": "Low time",
  // Tụ
  "1g647de": "Capacitor",
  // Lắp thử: nháy LED
  "pofgy8": "Try it: blink an LED",
  // <strong>Linh kiện:</strong> NE{0}, R{1} {2}kΩ, R{3} {4}kΩ, C {5}µF (chân dài là cực +, nối lên phía chân {6}/{7}), tụ {8}nF cho chân {9}, điện trở {10}kΩ và {11} LED. Nguồn {12}V (sạc điện thoại) hoặc {13}–{14}V.
  "~magp8k": "<strong>Parts:</strong> NE{0}, R{1} {2}kΩ, R{3} {4}kΩ, C {5}µF (the long leg is +, towards pins {6}/{7}), a {8}nF capacitor for pin {9}, a {10}kΩ resistor and {11} LED. A {12}V supply (phone charger) or {13}–{14}V.",
  // <strong>Kết quả mong đợi:</strong> f ≈ {0} / ({1}k × {2}µF) ≈ {3} Hz, tức LED nháy khoảng {4} lần mỗi giây, sáng lâu hơn tắt một chút (D ≈ {5}%).
  "~1ve16v8": "<strong>Expected result:</strong> f ≈ {0} / ({1}k × {2}µF) ≈ {3} Hz, so the LED blinks about {4} times per second, on slightly longer than off (D ≈ {5}%).",
  // <strong>Thử đổi:</strong> thay C bằng {0}µF thì nháy nhanh gấp {1} lần. Thay R{2} bằng biến trở {3}k để chỉnh tốc độ bằng tay.
  "~1l0odpm": "<strong>Try changing:</strong> replace C with {0}µF and it blinks {1} times faster. Replace R{2} with a {3}k potentiometer to adjust the speed by hand.",
  // <strong>Không chạy?</strong> Đo chân {0} và {1} có đủ áp nguồn chưa, chân {2} đã xuống mass chưa, và LED có cắm ngược không.
  "~1llspzs": "<strong>Not working?</strong> Check that pins {0} and {1} get the full supply voltage, that pin {2} is grounded, and that the LED is not reversed.",
  // Dùng {0} trong mạch Boost
  "~vwlcoz": "Using the {0} in the Boost converter",
  // Trong <a href="/machboost">mạch tăng áp Boost</a>, ngõ ra chân {0} không nối LED mà nối qua điện trở nhỏ ({1}Ω) vào chân G của MOSFET. Mỗi lần chân {2} lên cao, MOSFET đóng; xuống thấp thì MOSFET mở. Chọn R{3} {4}k, R{5} {6}k, C {7}nF được f ≈ {8} kHz và D ≈ {9}. Sơ đồ hoàn chỉnh có trong bài Boost.
  "~k5xydt": "In the <a href=\"/machboost\">Boost converter</a>, output pin {0} drives not an LED but the MOSFET gate through a small resistor ({1}Ω). Each time pin {2} goes high the MOSFET turns on; when it goes low the MOSFET turns off. Choosing R{3} {4}k, R{5} {6}k, C {7}nF gives f ≈ {8} kHz and D ≈ {9}. The complete schematic is in the Boost article.",
  // Chân {0} (RESET) kéo xuống mass thì {1} <strong>dừng phát xung</strong>, ngõ ra nằm ở mức thấp. Mạch Boost dùng chính chân này để tự ngắt khi áp ra vượt {2}V.
  "~1xhgd7n": "Pulling pin {0} (RESET) to ground makes the {1} <strong>stop generating pulses</strong>, with the output held low. The Boost converter uses this very pin to shut itself off when the output exceeds {2}V.",
  // Mô phỏng {0} lật trạng thái
  "~1disv2f": "Simulation of the {0} flipping state",
  // Ví dụ có sẵn
  "gnvub9": "Presets",
  // Đơn vị tụ
  "tsn72q": "Capacitor unit",
  // Dạng sóng áp trên tụ và ngõ ra
  "1f1acjv": "Capacitor voltage and output waveforms"
};
