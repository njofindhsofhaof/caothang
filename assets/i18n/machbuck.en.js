/* Bản tiếng Anh của /machbuck cho nút VI/EN (assets/i18n.js).
   Khoá = mã băm của đoạn tiếng Việt (CTI18N.hash; "~" = mẫu có số {0}, {1}…); dòng chú thích phía trên là đoạn tiếng Việt gốc.
   Sửa câu tiếng Việt trong trang thì phải sửa cả khoá ở đây, nếu không câu đó hiện tiếng Việt.
   Thêm/đổi chữ: mở trang, gõ CTI18N.collect() trong console để lấy khoá các câu chưa dịch. */
window.CT_EN = {
  // Có nguồn {0}V (acquy xe tải, nguồn tổ ong {1}V) mà thiết bị chỉ chịu {2}V thì dùng <strong>mạch hạ áp Buck</strong> (buck converter). Đây là "anh em" của <a href="/machboost">mạch tăng áp Boost</a>: cùng một bộ linh kiện, chỉ xếp lại thứ tự. Mạch nguồn dùng LM{3} trong danh sách thực hành Điện tử Cơ bản chính là mạch này.
  "~e9o9n7": "If you have a {0}V supply (a truck battery, a {1}V switching power supply) but the device only takes {2}V, use a <strong>Buck step-down converter</strong>. It is the \"sibling\" of the <a href=\"/machboost\">Boost converter</a>: the same set of parts, just in a different order. The LM{3} power circuit on the Basic Electronics practice list is exactly this circuit.",
  // Sao không dùng biến trở cho nhanh?
  "fa10yd": "Why not just use a potentiometer?",
  // Ý tưởng đầu tiên ai cũng nghĩ tới: mắc nối tiếp một biến trở cho nó "ăn bớt" {0}V. Chạy được, nhưng có hai cái dở. Bấm đổi tải để xem:
  "~ftzqvo": "The first idea everyone has: put a potentiometer in series to \"eat\" {0}V. It works, but has two drawbacks. Change the load to see:",
  // Tải {0}Ω ({1}A)
  "~151wu7h": "Load {0}Ω ({1}A)",
  // Rút tải ra
  "j3vk9o": "Remove the load",
  // Biến trở {0}Ω: áp ra tải
  "~1pxku51": "{0}Ω potentiometer: load voltage",
  // Biến trở: đốt thành nhiệt
  "9h98te": "Potentiometer: burned as heat",
  // <span>Mạch Buck: áp ra tải</span><b>{0} V</b>
  "~csxikp": "<span>Buck converter: load voltage</span><b>{0} V</b>",
  // Mạch Buck: hao hụt
  "qopjfy": "Buck converter: losses",
  // <strong>Áp ra nhảy theo tải.</strong> Biến trở ăn bớt U = I × R, mà dòng tải lại thay đổi. Tải ăn ít dòng thì biến trở ăn ít áp, rút tải ra thì đầu ra lên nguyên {0}V.
  "~11zlghf": "<strong>The output voltage follows the load.</strong> The potentiometer drops U = I × R, and the load current changes. A light load means a small drop, and with the load removed the output goes all the way to {0}V.",
  // <strong>Phí điện.</strong> Ở {0}A, biến trở đốt {1}V × {2}A = {3}W thành nhiệt, bằng đúng phần tải dùng, nên hiệu suất chỉ {4}%. Biến trở nhỏ trên board chịu chưa tới {5}W nên sẽ cháy.
  "~1k0feeu": "<strong>It wastes power.</strong> At {0}A the potentiometer burns {1}V × {2}A = {3}W as heat, exactly as much as the load uses, so the efficiency is only {4}%. A small board potentiometer handles less than {5}W, so it will burn out.",
  // <strong>Dễ nhớ:</strong> biến trở dùng để <em>chỉnh tín hiệu</em> (vặn âm lượng, đặt ngưỡng), không dùng để <em>hạ áp cấp cho tải</em>.
  "tiyufj": "<strong>Easy to remember:</strong> a potentiometer is for <em>adjusting signals</em> (turning the volume, setting a threshold), not for <em>stepping down the supply to a load</em>.",
  // <strong>Công tắc (MOSFET):</strong> công tắc điện tử, đóng ngắt hàng chục nghìn lần mỗi giây (LM{0} là khoảng {1} nghìn lần).
  "~bj7qi3": "<strong>Switch (MOSFET):</strong> an electronic switch that turns on and off tens of thousands of times per second (the LM{0} does about {1} thousand times).",
  // <strong>Cuộn cảm L:</strong> "ghì" dòng lại khi công tắc đóng và nhả năng lượng ra khi công tắc ngắt, nên dòng ra tải đều, không bị giật.
  "s2yny0": "<strong>Inductor L:</strong> \"holds back\" the current when the switch closes and releases energy when the switch opens, so the load current is smooth, not jerky.",
  // <strong>Diode:</strong> đường vòng để dòng của cuộn cảm có lối chạy lúc công tắc ngắt.
  "1jj3z03": "<strong>Diode:</strong> a bypass path so the inductor current has somewhere to go when the switch is open.",
  // <strong>Tụ C:</strong> lọc cho áp ra phẳng.
  "okcbew": "<strong>Capacitor C:</strong> smooths the output voltage.",
  // Mạch Buck: nguồn {0}V, công tắc, cuộn cảm, diode, tụ và tải
  "~68vpva": "Buck converter: {0}V source, switch, inductor, diode, capacitor and load",
  // cuộn cảm L
  "1t0pbj7": "inductor L",
  // tụ C
  "1gxu7tb": "capacitor C",
  // áp ra
  "1nbhpxt": "output voltage",
  // Bước {0}: Đóng
  "~nlkqd3": "Step {0}: Switch on",
  // Bước {0}: Ngắt
  "~1gc7yl1": "Step {0}: Switch off",
  // Tỉ lệ đóng D
  "ufszfq": "On ratio D",
  // Kéo thanh D sẽ thấy: công tắc đóng càng lâu trong mỗi chu kỳ thì áp ra càng cao. Khi chạy tự động, khúc xanh (đóng) dài hay ngắn so với khúc cam (ngắt) chính là D.
  "1hmovxm": "Drag the D slider: the longer the switch stays on in each cycle, the higher the output voltage. In auto mode, how long the blue (on) segment is compared with the orange (off) segment is D.",
  // V<sub>ra</sub> = D × V<sub>vào</sub> &nbsp;·&nbsp; D = t<sub>đóng</sub> / T
  "100el3y": "V<sub>out</sub> = D × V<sub>in</sub> &nbsp;·&nbsp; D = t<sub>on</sub> / T",
  // Muốn ra {0}V từ {1}V thì D = {2} / {3} = {4}: công tắc đóng một nửa thời gian. Cuộn cảm và tụ "san phẳng" các xung {5}V tắt mở thành áp trung bình {6}V.
  "~v97k96": "To get {0}V from {1}V, D = {2} / {3} = {4}: the switch is on half the time. The inductor and capacitor \"smooth\" the on-off {5}V pulses into an average of {6}V.",
  // Áp ra (từ {0}V)
  "~168c59f": "Output voltage (from {0}V)",
  // Dùng cho
  "5py0ep": "Used for",
  // Sạc điện thoại, Arduino
  "1svt9ka": "Phone chargers, Arduino",
  // Quạt, đèn LED, thiết bị xe hơi
  "6wjvt2": "Fans, LED lights, car accessories",
  // Sạc laptop đời cũ
  "16u6ygl": "Older laptop chargers",
  // <strong>Vì sao đổi tải mà áp ra vẫn đứng yên?</strong> IC điều khiển (như LM{0}) liên tục đo áp ra. Áp tụt một chút thì nó cho công tắc đóng lâu hơn, áp vượt thì đóng ngắn lại. Đây là <strong>hồi tiếp</strong>, giống mạch zener + BC{1} trong bài Boost.
  "~1xjpemn": "<strong>Why does the output stay put when the load changes?</strong> The controller IC (such as the LM{0}) measures the output continuously. If it sags a little, it keeps the switch on longer; if it overshoots, it shortens the on time. This is <strong>feedback</strong>, like the zener + BC{1} circuit in the Boost article.",
  // Buck và Boost khác nhau chỗ nào
  "1ijykdl": "How Buck and Boost differ",
  // Buck (hạ áp)
  "1a6392x": "Buck (step-down)",
  // Boost (tăng áp)
  "rc7hxy": "Boost (step-up)",
  // Đứng đầu, nối với nguồn
  "grutrr": "First in line, connected to the source",
  // Nối từ cuộn cảm xuống mass
  "fnpo0l": "From the inductor to ground",
  // Cuộn cảm
  "6cwgkv": "Inductor",
  // Đứng sau công tắc, nối ra tải
  "16xzf6t": "After the switch, towards the load",
  // Từ mass lên cuộn cảm
  "tk6qy2": "From ground up to the inductor",
  // Từ cuộn cảm ra ngõ ra
  "1uid0xi": "From the inductor to the output",
  // V<sub>ra</sub> = D × V<sub>vào</sub>
  "1ip6w1d": "V<sub>out</sub> = D × V<sub>in</sub>",
  // V<sub>ra</sub> = V<sub>vào</sub> / ({0} − D)
  "~63ff3i": "V<sub>out</sub> = V<sub>in</sub> / ({0} − D)",
  // Ý tưởng
  "ybs2eu": "Idea",
  // Cắt nhỏ áp rồi san phẳng
  "1q8zj8t": "Chop the voltage, then smooth it",
  // Tích năng lượng rồi chồng thêm áp
  "77x1gm": "Store energy, then stack extra voltage on top",
  // Hai mạch đều không tự sinh ra năng lượng: Buck hạ áp thì dòng ra <em>lớn hơn</em> dòng vào. Ví dụ tải {0}V {1}A ({2}W), hiệu suất {3}% thì nguồn {4}V chỉ cấp khoảng {5} / {6} / {7} ≈ {8}A.
  "~is2owl": "Neither circuit creates energy: when a Buck steps the voltage down, the output current is <em>larger</em> than the input current. For example, a {0}V {1}A load ({2}W) at {3}% efficiency draws only about {5} / {6} / {7} ≈ {8}A from the {4}V supply.",
  // So {0} cách hạ áp {1}V xuống {2}V, tải {3}A
  "~1tjge1o": "Comparing {0} ways to step {1}V down to {2}V, {3}A load",
  // Cách
  "1i1yrtu": "Method",
  // Áp ra ổn định?
  "1h5mzlz": "Stable output?",
  // Hiệu suất
  "1yejatf": "Efficiency",
  // Nhiệt thải
  "nm2seb": "Waste heat",
  // Biến trở nối tiếp
  "10bwdxi": "Series potentiometer",
  // Không, đổi theo tải
  "so4od2": "No, it follows the load",
  // {0}W, cháy biến trở
  "~1kcvuj6": "{0}W, the potentiometer burns out",
  // IC ổn áp tuyến tính {0}
  "~1nnn49h": "{0} linear regulator IC",
  // Có
  "1iw8syb": "Yes",
  // {0}W, cần tản nhiệt to
  "~182r8ti": "{0}W, needs a big heatsink",
  // <strong>Mạch Buck (LM{0})</strong>
  "~jp297s": "<strong>Buck converter (LM{0})</strong>",
  // {0} giống một "biến trở tự vặn": áp ra luôn đúng {1}V nhưng vẫn đốt phần dư thành nhiệt. Còn công tắc của mạch Buck chỉ đóng hẳn hoặc ngắt hẳn, cả hai trạng thái đều gần như không đốt nhiệt.
  "~1ty8u9w": "The {0} is like a \"self-adjusting potentiometer\": the output is always exactly {1}V but the excess is still burned as heat. The Buck switch is either fully on or fully off, and in both states it burns almost no heat.",
  // <strong>Mức {0}, mua module LM{1}</strong> (khoảng {2}–{3} nghìn): có sẵn biến trở đa vòng để chỉnh áp ra. Cấp {4}V vào, vặn biến trở trong lúc đo đầu ra bằng VOM cho tới khi được {5}V rồi mới gắn tải. Biến trở ở đây chỉ "đặt mục tiêu" cho IC, dòng tải không đi qua nó.
  "~1qc0569": "<strong>Level {0}, buy an LM{1} module</strong> (about {2}–{3} thousand VND): it has a multi-turn potentiometer to set the output. Feed in {4}V, turn the potentiometer while measuring the output with a multimeter until you get {5}V, then connect the load. Here the potentiometer only \"sets the target\" for the IC; the load current does not flow through it.",
  // <strong>Mức {0}, mạch nguồn trong danh sách thực hành Điện tử Cơ bản:</strong> cầu diode KBP{1} + tụ {2}µF chỉnh lưu điện xoay chiều thành DC, rồi LM{3}S-{4} hạ xuống cố định {5}V với cuộn cảm {6}µH, diode HER{7} và tụ {8}µF. Đúng sơ đồ trong bài này, chỉ thêm khâu chỉnh lưu phía trước. Sơ đồ đầy đủ để lắp ở <a href="#so-do">mục bên dưới</a>.
  "~1cqcmiw": "<strong>Level {0}, the power circuit on the Basic Electronics practice list:</strong> a KBP{1} diode bridge + {2}µF capacitor rectifies AC into DC, then the LM{3}S-{4} steps it down to a fixed {5}V with a {6}µH inductor, a HER{7} diode and a {8}µF capacitor. It is exactly the schematic in this article, with a rectifier stage added in front. The full schematic for assembly is in the <a href=\"#so-do\">section below</a>.",
  // <strong>Lưu ý với LM{0}:</strong> áp vào tối đa {1}V, và phải cao hơn áp ra ít nhất khoảng {2}V. Dòng ghi {3}A nhưng trên {4}A nên gắn thêm tản nhiệt. Diode phải là loại nhanh (Schottky như {5}N{6}, hoặc HER{7} như trong danh sách), không dùng {8}N{9} vì nó quá chậm so với tần số đóng ngắt.
  "~qxydic": "<strong>Notes on the LM{0}:</strong> maximum input {1}V, and it must be at least about {2}V above the output. It is rated {3}A, but above {4}A add a heatsink. The diode must be a fast type (Schottky like the {5}N{6}, or HER{7} as on the list); do not use the {8}N{9}, it is too slow for the switching frequency.",
  // Dùng <strong>LM{0}S-{1}</strong>, loại ra cố định {2}V giống trong danh sách của lớp. Bên trong IC đã có sẵn công tắc, bộ tạo xung {3}kHz và mạch hồi tiếp, nên bên ngoài chỉ cần gắn cuộn cảm, diode và tụ.
  "~1ddmzcl": "Use the <strong>LM{0}S-{1}</strong>, the fixed {2}V version as on the class list. The IC already contains the switch, a {3}kHz oscillator and the feedback circuit, so outside you only add the inductor, diode and capacitors.",
  // Sơ đồ mạch hạ áp {0}V xuống {1}V dùng LM{2}S-{3}
  "~1rocg2": "Schematic of the {0}V to {1}V step-down using the LM{2}S-{3}",
  // J{0} vào {1}–{2}V
  "~3nf03s": "J{0} input {1}–{2}V",
  // hồi tiếp: IC đo áp ra để tự chỉnh D
  "1nkhufo": "feedback: the IC measures the output to adjust D itself",
  // Chân {0} (ON/OFF) nối mass thì IC chạy. Chân {1} (FB) nối thẳng vào ngõ ra {2}V. Vạch trên thân D{3} quay về phía chân {4}. Trên điện thoại, vuốt ngang để xem hết sơ đồ.
  "~1fo4w9h": "Pin {0} (ON/OFF) to ground makes the IC run. Pin {1} (FB) connects straight to the {2}V output. The stripe on D{3} faces pin {4}. On a phone, swipe sideways to see the whole schematic.",
  // Thông số
  "k0hivg": "Specifications",
  // <strong>Áp vào:</strong> khoảng {0}V tới {1}V (LM{2} chịu tối đa {3}V, chừa khoảng an toàn). Dưới khoảng {4}V thì áp ra bắt đầu tụt khỏi {5}V.
  "~1322zcl": "<strong>Input:</strong> about {0}V to {1}V (the LM{2} takes at most {3}V, leaving a safety margin). Below about {4}V the output starts to drop below {5}V.",
  // <strong>Áp ra:</strong> {0}V cố định. <strong>Dòng ra:</strong> tới khoảng {1}A, giới hạn bởi cuộn cảm {2}µH loại {3}A trong danh sách.
  "~957e2u": "<strong>Output:</strong> fixed {0}V. <strong>Output current:</strong> up to about {1}A, limited by the {2}µH {3}A inductor on the list.",
  // <strong>f:</strong> {0}kHz do IC tự tạo. <strong>D:</strong> IC tự chỉnh, khoảng {1} khi vào {2}V, lên cao hơn khi áp vào thấp.
  "~1njcz68": "<strong>f:</strong> {0}kHz generated by the IC. <strong>D:</strong> set by the IC, about {1} at {2}V input, higher when the input is lower.",
  // Mặt lưng là chân GND, hàn vào mảng đồng lớn để tản nhiệt
  "g3n3fr": "The back tab is GND; solder it to a large copper area for cooling",
  // Cầu chì {0}A
  "~1hdlhj4": "{0}A fuse",
  // Bảo vệ khi lỡ chập ngõ ra
  "1w5auyq": "Protection if the output is shorted",
  // Tụ hoá {0}µF {1}V
  "~wijj5u": "{0}µF {1}V electrolytic capacitor",
  // Đúng cực, chịu áp lớn hơn áp vào
  "168jz7d": "Correct polarity, rated above the input voltage",
  // Tụ gốm {0}nF ({1})
  "~e9bbph": "{0}nF ceramic capacitor ({1})",
  // Đặt sát chân {0} và {1} của IC
  "~1b42j9p": "Placed right next to pins {0} and {1} of the IC",
  // Cuộn cảm {0}µH, ≥ {1}A
  "~1mfmnvb": "{0}µH inductor, ≥ {1}A",
  // Như CDRH{0} {1}µH {2}A trong danh sách lớp
  "~1t6nv3y": "Such as the CDRH{0} {1}µH {2}A on the class list",
  // Hoặc HER{0}. Không dùng {1}N{2}
  "~1ofshgk": "Or HER{0}. Do not use the {1}N{2}",
  // Loại low ESR càng tốt
  "pdwawv": "Low-ESR type preferred",
  // Điện trở {0}k + LED
  "~1y6vcb": "{0}k resistor + LED",
  // Đèn báo có điện, khoảng {0}mA
  "~5ilabs": "Power indicator, about {0}mA",
  // Domino {0} chân
  "~1b8y69e": "{0}-pin terminal block",
  // Đấu dây vào / ra
  "1fdrhyb": "Input / output wiring",
  // Danh sách của lớp có thêm biến trở {0}k và vài điện trở khác; cách nối chúng tuỳ sơ đồ thầy phát, nên lắp theo bản của thầy nếu khác chỗ nào. Nếu dùng bản <strong>LM{1}-ADJ</strong> (chỉnh được) thì chân {2} nối vào cầu phân áp: R<sub>dưới</sub> {3}k từ chân {4} xuống mass, R<sub>trên</sub> từ ngõ ra xuống chân {5} với R<sub>trên</sub> = {6}k × (V<sub>ra</sub> / {7} − {8}). Ra {9}V thì R<sub>trên</sub> ≈ {10}k, dùng biến trở {11}k để vặn.
  "~s93ckn": "The class list also has a {0}k potentiometer and a few other resistors; how they connect depends on the teacher's schematic, so follow the teacher's version where it differs. If you use the adjustable <strong>LM{1}-ADJ</strong>, pin {2} goes to a divider: R<sub>bottom</sub> {3}k from pin {4} to ground, R<sub>top</sub> from the output to pin {5}, with R<sub>top</sub> = {6}k × (V<sub>out</sub> / {7} − {8}). For {9}V out, R<sub>top</sub> ≈ {10}k; use a {11}k potentiometer to tune it.",
  // <strong>Kiểm tra trước khi cấp điện:</strong> đo thông mạch, chắc chắn +{0}V và mass không chạm nhau, +{1}V và mass không chạm nhau. Xem lại chiều C{2}, C{3}, D{4}, LED.
  "~1edf9t2": "<strong>Check before powering up:</strong> test continuity and make sure +{0}V and ground are not shorted, and +{1}V and ground are not shorted. Double-check the orientation of C{2}, C{3}, D{4} and the LED.",
  // <strong>Cấp {0}V, chưa gắn tải:</strong> đo J{1} được khoảng {2}V, LED sáng, IC không nóng. Nếu đo ra gần {3}V là IC hỏng hoặc chân {4} chưa nối.
  "~1q86rsk": "<strong>Apply {0}V with no load:</strong> J{1} should read about {2}V, the LED lights, the IC stays cool. If it reads close to {3}V, the IC is faulty or pin {4} is not connected.",
  // <strong>Gắn tải nhỏ rồi tăng dần:</strong> bóng {0}V {1}W trước, sau đó tải lớn hơn tới {2}A. Áp ra vẫn phải quanh {3}V. IC, cuộn cảm, diode ấm là bình thường, nóng không sờ được là quá tải.
  "~6mmxzm": "<strong>Add a small load and increase it:</strong> a {0}V {1}W bulb first, then larger loads up to {2}A. The output must stay around {3}V. A warm IC, inductor and diode are normal; too hot to touch means overload.",
  // <strong>Đo hiệu suất:</strong> P<sub>vào</sub> = U<sub>vào</sub> × I<sub>vào</sub>, P<sub>ra</sub> = U<sub>ra</sub> × I<sub>ra</sub>, η = P<sub>ra</sub> / P<sub>vào</sub>. Làm tốt sẽ được khoảng {0}–{1}%.
  "~1q23x1c": "<strong>Measure the efficiency:</strong> P<sub>in</sub> = U<sub>in</sub> × I<sub>in</sub>, P<sub>out</sub> = U<sub>out</sub> × I<sub>out</sub>, η = P<sub>out</sub> / P<sub>in</sub>. A good build reaches about {0}–{1}%.",
  // <strong>Đi dây:</strong> vòng C{0} → chân {1}, chân {2} → D{3} → mass phải thật ngắn và to, vì đây là chỗ dòng đóng ngắt {4} nghìn lần mỗi giây. Dây dài sẽ gây nhiễu và gai áp. Dây hồi tiếp chân {5} lấy ngay tại chân tụ C{6}, đi xa cuộn cảm.
  "~17qscap": "<strong>Wiring:</strong> the loop C{0} → pin {1}, pin {2} → D{3} → ground must be short and thick, because the current switches {4} thousand times per second there. Long wires cause noise and voltage spikes. Take the pin {5} feedback wire right at capacitor C{6} and route it away from the inductor.",
  // So sánh biến trở với mạch hạ áp
  "4gezxl": "Potentiometer vs. step-down converter",
  // Chọn tải
  "tosxdp": "Choose the load",
  // Mô phỏng mạch Buck
  "khoxou": "Buck converter simulation"
};
