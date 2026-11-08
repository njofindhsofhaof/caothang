/* Bản tiếng Anh của /machboost cho nút VI/EN (assets/i18n.js).
   Khoá = mã băm của đoạn tiếng Việt (CTI18N.hash; "~" = mẫu có số {0}, {1}…); dòng chú thích phía trên là đoạn tiếng Việt gốc.
   Sửa câu tiếng Việt trong trang thì phải sửa cả khoá ở đây, nếu không câu đó hiện tiếng Việt.
   Thêm/đổi chữ: mở trang, gõ CTI18N.collect() trong console để lấy khoá các câu chưa dịch. */
window.CT_EN = {
  // Có nguồn {0}V (bình acquy, adapter) nhưng thiết bị lại cần {1}V thì dùng <strong>mạch tăng áp Boost</strong> (boost converter). Bài này giải thích mạch hoạt động thế nào bằng những gì đã học năm nhất: cuộn cảm, diode, tụ điện. Cuối bài có hướng dẫn tự làm.
  "~15e6r23": "If you have a {0}V source (a battery, an adapter) but the device needs {1}V, use a <strong>Boost step-up converter</strong>. This article explains how it works using what you learned in Year 1: inductors, diodes, capacitors. At the end there is a build guide.",
  // <strong>Cuộn cảm L:</strong> tích năng lượng dưới dạng dòng điện, rồi nhả ra để "đẩy" áp lên.
  "1iquvdk": "<strong>Inductor L:</strong> stores energy as current, then releases it to \"push\" the voltage up.",
  // <strong>Công tắc (MOSFET):</strong> chưa học MOSFET cũng không sao. Cứ hiểu nó là <em>công tắc điện tử</em>, giống contactor ở môn Thực hành: có tín hiệu điều khiển thì đóng, mất tín hiệu thì mở. Nó không có bộ phận cơ khí nên đóng cắt được hàng chục nghìn lần mỗi giây.
  "13g7gvq": "<strong>Switch (MOSFET):</strong> it is fine if you have not studied MOSFETs yet. Think of it as an <em>electronic switch</em>, like the contactor in the Practice course: with a control signal it closes, without it it opens. It has no mechanical parts, so it can switch tens of thousands of times per second.",
  // <strong>Diode:</strong> van một chiều, điện chỉ đi từ cuộn cảm ra ngõ ra, không chảy ngược về.
  "1a92ohj": "<strong>Diode:</strong> a one-way valve; current only flows from the inductor to the output, never back.",
  // <strong>Tụ C:</strong> bình chứa, giữ áp ra ổn định ở {0}V.
  "~br4olm": "<strong>Capacitor C:</strong> a reservoir that holds the output steady at {0}V.",
  // Bấm từng bước để xem dòng điện chạy, hoặc để hình tự chạy.
  "1dhi1wb": "Step through to see the current flow, or let the figure run by itself.",
  // Sơ đồ mạch Boost
  "1burknf": "Boost converter schematic",
  // Nguồn {0}V, cuộn cảm, công tắc xuống mass, diode, tụ C và tải. Đường đi của dòng điện đổi theo trạng thái công tắc.
  "~1mpd61i": "{0}V source, inductor, switch to ground, diode, capacitor C and load. The current path changes with the switch state.",
  // Tải
  "5v371n": "Load",
  // Cuộn cảm L
  "159dlc3": "Inductor L",
  // Tụ C
  "1nytoq7": "Capacitor C",
  // Nguồn {0}V
  "~v39zts": "{0}V source",
  // Năng lượng trong cuộn cảm
  "1dgdmhv": "Energy in the inductor",
  // Áp tại chân công tắc
  "cg4iit": "Voltage at the switch node",
  // Tóm lại: <strong>đóng thì L hút điện từ nguồn, mở thì L nhả điện vào tụ.</strong> Mỗi lần mở, cuộn cảm "bơm" thêm một ít điện vào tụ. Lặp lại hàng chục nghìn lần mỗi giây thì tụ được nạp lên {0}V.
  "~c07jyp": "In short: <strong>when closed, L draws energy from the source; when open, L dumps it into the capacitor.</strong> Each time the switch opens, the inductor \"pumps\" a little more charge into the capacitor. Repeated tens of thousands of times per second, the capacitor charges up to {0}V.",
  // Hay nhầm: tụ C <strong>không</strong> được nạp lúc công tắc đóng. Lúc đó dòng đi đường tắt xuống mass, còn diode bị phân cực ngược (phía L gần {0}V, phía tụ đang {1}V) nên khóa lại.
  "~1cjjq4n": "Common mistake: capacitor C is <strong>not</strong> charged while the switch is closed. At that moment the current takes the shortcut to ground, and the diode is reverse-biased (the L side is near {0}V, the capacitor side is at {1}V), so it blocks.",
  // Cái gì quyết định áp ra?
  "1a5cwy0": "What sets the output voltage?",
  // Áp ra không phụ thuộc cuộn cảm to hay nhỏ. Nó phụ thuộc vào <strong>D</strong>, tỉ lệ thời gian công tắc đóng trong mỗi chu kỳ (chu kỳ làm việc, <em>duty cycle</em>):
  "1ws15hz": "The output voltage does not depend on how big the inductor is. It depends on <strong>D</strong>, the fraction of each cycle that the switch is closed (the <em>duty cycle</em>):",
  // V<sub>ra</sub> = <span class="frac"><span>V<sub>vào</sub></span><span>{0} − D</span></span>
  "~1b67jyc": "V<sub>out</sub> = <span class=\"frac\"><span>V<sub>in</sub></span><span>{0} − D</span></span>",
  // D (thời gian đóng)
  "1w9gu2q": "D (on time)",
  // Áp ra từ {0}V
  "~w48nn6": "Output voltage from {0}V",
  // <strong>D tính sao?</strong> D = t<sub>đóng</sub> / T, với T = {0} / f là thời gian một chu kỳ. Biết áp vào và áp ra thì D = {1} − V<sub>vào</sub> / V<sub>ra</sub>: từ {2}V lên {3}V cần D = {4}. Ví dụ f = {5} kHz thì T = {6} µs, công tắc đóng {7} µs rồi mở {8} µs. Thực tế có hao hụt nên D cần nhỉnh hơn một chút. Không nên đẩy D quá khoảng {9}: hao hụt tăng vọt, mạch kém ổn định.
  "~zinia7": "<strong>How is D calculated?</strong> D = t<sub>on</sub> / T, where T = {0} / f is the period. Knowing the input and output voltages, D = {1} − V<sub>in</sub> / V<sub>out</sub>: going from {2}V to {3}V needs D = {4}. For example, with f = {5} kHz, T = {6} µs: the switch is on for {7} µs and off for {8} µs. In practice there are losses, so D needs to be slightly higher. Do not push D beyond about {9}: losses shoot up and the circuit becomes unstable.",
  // Đóng càng lâu thì cuộn cảm lấy đà càng nhiều, áp ra càng cao. Trên module thật, vặn biến trở là đang chỉnh D: IC tự đo áp ra rồi tăng giảm thời gian đóng để áp luôn đứng đúng mức.
  "1r4g8lg": "The longer the switch stays closed, the more momentum the inductor builds, and the higher the output. On a real module, turning the potentiometer adjusts D: the IC measures the output and lengthens or shortens the on time to keep the voltage right on target.",
  // Cuộn cảm và tụ, ai làm gì?
  "1luw5fj": "Inductor and capacitor: who does what?",
  // Tích năng lượng dạng
  "12koeiz": "Stores energy as",
  // Dòng điện (từ trường), ½·L·I²
  "iqugv5": "Current (magnetic field), ½·L·I²",
  // Điện áp (điện tích), ½·C·U²
  "7grz8x": "Voltage (charge), ½·C·U²",
  // "Cứng đầu" ở chỗ
  "78aiik": "\"Stubborn\" about",
  // Không cho <strong>dòng</strong> đổi đột ngột
  "o1m6qe": "Not letting the <strong>current</strong> change suddenly",
  // Không cho <strong>áp</strong> đổi đột ngột
  "jseg92": "Not letting the <strong>voltage</strong> change suddenly",
  // Vai trò
  "1mkpx3r": "Role",
  // Cái bơm: tạo áp cao trong chốc lát
  "1tro1ps": "The pump: creates a high voltage for a moment",
  // Bồn chứa: giữ {0}V ổn định
  "~b5esqz": "The reservoir: keeps {0}V steady",
  // Trị số cuộn cảm ảnh hưởng tới chất lượng: chọn vừa thì dòng chảy đều, áp ra phẳng. Chọn quá nhỏ thì dòng giật cục, mạch nóng và áp ra gợn nhiều. Quan trọng không kém trị số µH là <strong>dòng chịu đựng</strong>: vượt mức thì lõi bão hòa, cuộn cảm mất tác dụng và dòng tăng vọt, có thể làm cháy MOSFET.
  "1agkmf7": "The inductor value affects quality: the right value gives smooth current and a flat output. Too small and the current is jerky, the circuit heats up and the output has a lot of ripple. Just as important as the µH value is the <strong>current rating</strong>: exceed it and the core saturates, the inductor stops working and the current shoots up, which can burn the MOSFET.",
  // Công suất không tự sinh ra
  "26nr5s": "Power is not created out of nothing",
  // Mạch boost chỉ <strong>đổi áp</strong>, không sinh thêm năng lượng, nên dùng nó không tiết kiệm điện mà còn tốn hơn một chút. Lý tưởng thì công suất vào bằng công suất ra. Thực tế luôn có hao hụt thành nhiệt trong cuộn cảm, MOSFET và diode:
  "hipzqh": "A boost converter only <strong>changes the voltage</strong>; it does not create energy, so using it does not save power, it actually costs a little more. Ideally the input power equals the output power. In practice there are always losses as heat in the inductor, MOSFET and diode:",
  // P<sub>ra</sub> = η × P<sub>vào</sub>
  "1h1z1dg": "P<sub>out</sub> = η × P<sub>in</sub>",
  // η là hiệu suất, ở mạch boost khoảng {0}–{1}%. Áp ra gấp đôi áp vào thì <strong>dòng vào phải lớn hơn gấp đôi dòng ra</strong>. Dễ nhớ: giống đổi {2} tờ {3}k lấy {4} tờ {5}k, số tờ đổi nhưng tổng tiền không đổi, còn chỗ đổi lấy thêm chút phí.
  "~1ozg9dl": "η is the efficiency, about {0}–{1}% for a boost converter. If the output voltage is twice the input, <strong>the input current must be more than twice the output current</strong>. Easy to remember: like exchanging {2} notes of {3}k for {4} notes of {5}k, the number of notes changes but the total does not, and the exchange takes a small fee.",
  // Tải quyết định công suất
  "1l6t720": "The load decides the power",
  // Mạch giữ áp ra cố định {0}V. Dòng ra <strong>do tải quyết định</strong>, theo định luật Ohm I = U / R: điện trở tải càng nhỏ thì tải kéo dòng càng lớn. Tải kéo bao nhiêu thì nguồn {1}V phải cấp bấy nhiêu, cộng thêm phần hao hụt. Bấm đổi mức tải để xem:
  "~kv00f2": "The circuit holds the output fixed at {0}V. The output current is <strong>decided by the load</strong>, by Ohm's law I = U / R: the smaller the load resistance, the more current it draws. Whatever the load draws, the {1}V source must supply, plus the losses. Change the load level to see:",
  // Công suất ra (tải dùng)
  "1paj892": "Output power (used by the load)",
  // Hao hụt thành nhiệt
  "1oyqlma": "Losses as heat",
  // Công suất vào (từ {0}V)
  "~1pd84er": "Input power (from {0}V)",
  // kéo
  "wdyzfm": "draws",
  // ở {0}V → nguồn {1}V phải cấp
  "~10ok2te": "at {0}V → the {1}V source must supply",
  // (hiệu suất {0}%).
  "~a5c40x": "(efficiency {0}%).",
  // Điện trở tải
  "17ufhfg": "Load resistance",
  // Dòng ra ({0}V)
  "~1kavtcs": "Output current ({0}V)",
  // Công suất ra
  "zy5ulf": "Output power",
  // Dòng vào ({0}V)
  "~bhsmmm": "Input current ({0}V)",
  // ≈ {0} Ω (chập)
  "~1yj2kjf": "≈ {0} Ω (short)",
  // rất lớn
  "1vhotit": "very large",
  // Quá tải, có thể cháy mạch
  "e5pphf": "Overload, may burn the circuit",
  // Tải thay đổi khi đổi thiết bị (bóng {0}W kéo nhiều hơn bóng {1}W), khi mắc thêm thiết bị song song, hoặc ngay lúc đang chạy: động cơ bị gánh nặng hay vừa khởi động kéo dòng gấp nhiều lần lúc chạy không tải. Vì vậy chọn mạch và nguồn theo <strong>công suất lớn nhất tải có thể đòi</strong>, và chọn dây phía {2}V theo dòng vào, đừng theo dòng ra.
  "~1et1fc6": "The load changes when you swap devices (a {0}W bulb draws more than a {1}W one), when you add devices in parallel, or even while running: a motor under heavy load or just starting draws many times its no-load current. So choose the converter and the supply for the <strong>largest power the load may demand</strong>, and size the wires on the {2}V side for the input current, not the output current.",
  // Tính ngược từ tải về nguồn
  "1p77j2q": "Working back from the load to the source",
  // Ở đầu vào chỉ biết trước U = {0}V. Dòng vào chưa biết, phải tính ngược từ tải. Ví dụ tải {1} Ω:
  "~1ab8b4w": "At the input only U = {0}V is known in advance. The input current is unknown and has to be worked back from the load. For example, a {1} Ω load:",
  // <strong>Biết:</strong> U<sub>vào</sub> = {0}V, U<sub>ra</sub> = {1}V, I<sub>ra</sub> = {2} / {3} = {4}A, hiệu suất η ≈ {5}% (lấy từ datasheet hoặc tự đo).
  "~ezifi5": "<strong>Given:</strong> U<sub>in</sub> = {0}V, U<sub>out</sub> = {1}V, I<sub>out</sub> = {2} / {3} = {4}A, efficiency η ≈ {5}% (from the datasheet or measured yourself).",
  // <strong>Bước {0}, công suất tải dùng:</strong> P<sub>ra</sub> = U<sub>ra</sub> × I<sub>ra</sub> = {1} × {2} = <strong>{3} W</strong>.
  "~1v60xpc": "<strong>Step {0}, power used by the load:</strong> P<sub>out</sub> = U<sub>out</sub> × I<sub>out</sub> = {1} × {2} = <strong>{3} W</strong>.",
  // <strong>Bước {0}, công suất lấy từ nguồn:</strong> P<sub>vào</sub> = P<sub>ra</sub> / η = {1} / {2} ≈ <strong>{3} W</strong>.
  "~pvazwu": "<strong>Step {0}, power drawn from the source:</strong> P<sub>in</sub> = P<sub>out</sub> / η = {1} / {2} ≈ <strong>{3} W</strong>.",
  // <strong>Bước {0}, dòng vào:</strong> I<sub>vào</sub> = P<sub>vào</sub> / U<sub>vào</sub> = {1} / {2} ≈ <strong>{3} A</strong>.
  "~rhighw": "<strong>Step {0}, input current:</strong> I<sub>in</sub> = P<sub>in</sub> / U<sub>in</sub> = {1} / {2} ≈ <strong>{3} A</strong>.",
  // <strong>Kiểm tra:</strong> hao hụt = {0} − {1} = {2} W, đúng bằng {3}% của {4} W.
  "~1ipqlfw": "<strong>Check:</strong> losses = {0} − {1} = {2} W, exactly {3}% of {4} W.",
  // <strong>Bài thực hành đo hiệu suất:</strong> dùng đồng hồ vạn năng đo U và I ở đầu vào, nhân lại được P<sub>vào</sub>. Đo U và I ở đầu ra, được P<sub>ra</sub>. Lấy P<sub>ra</sub> / P<sub>vào</sub> là ra hiệu suất thật của mạch. Thử với vài mức tải để xem hiệu suất thay đổi thế nào.
  "16uzp0q": "<strong>Lab exercise, measuring efficiency:</strong> use a multimeter to measure U and I at the input and multiply them to get P<sub>in</sub>. Measure U and I at the output to get P<sub>out</sub>. P<sub>out</sub> / P<sub>in</sub> is the real efficiency of the circuit. Try several load levels to see how the efficiency changes.",
  // <strong>Mức {0}, nên làm trước:</strong> mua module <strong>XL{1}</strong> (khoảng {2}–{3}k, chịu khoảng {4}–{5}A ngõ vào). Cấp {6}V vào, vừa vặn biến trở vừa đo ngõ ra tới khi được {7}V. Gắn tải rồi đo áp và dòng ở cả hai đầu để tính hiệu suất.
  "~1x3sy79": "<strong>Level {0}, do this first:</strong> buy an <strong>XL{1}</strong> module (about {2}–{3}k VND, handles about {4}–{5}A input). Feed in {6}V and turn the potentiometer while measuring the output until you get {7}V. Connect a load and measure voltage and current at both ends to work out the efficiency.",
  // <strong>Mức {0}, tự ráp từ linh kiện rời</strong> để hiểu sâu hơn: xem <a href="#so-do">sơ đồ hoàn chỉnh</a> bên dưới. Phần tạo xung dùng IC {1}, giải thích trong bài <a href="/ic{2}">IC {3} phát xung</a>.
  "~dvu2dw": "<strong>Level {0}, build it from discrete parts</strong> for a deeper understanding: see the <a href=\"#so-do\">complete schematic</a> below. The pulse generator uses the {1} IC, explained in the article <a href=\"/ic{2}\">{3} IC pulse generator</a>.",
  // <strong>An toàn:</strong> mạch boost không có hồi tiếp mà chạy <strong>không tải</strong> thì cuộn cảm vẫn tiếp tục bơm vào tụ, áp tăng mãi và có thể làm nổ tụ. Luôn gắn tải hoặc diode zener bảo vệ ở ngõ ra. Thử lần đầu bằng nguồn có giới hạn dòng.
  "16wv3z0": "<strong>Safety:</strong> a boost converter without feedback running with <strong>no load</strong> keeps pumping the capacitor, so the voltage rises without limit and can make the capacitor explode. Always connect a load or a protective zener diode at the output. Test the first time with a current-limited supply.",
  // Muốn "thấy" mạch chạy trước khi mua linh kiện: mở <a href="https://www.falstad.com/circuit/" target="_blank" rel="noopener">Falstad Circuit Simulator</a> trên trình duyệt, vào <em>Circuits → Power Supplies → Boost Converter</em>, rồi chỉnh D, L, C xem áp ra thay đổi ra sao.
  "imxl9i": "To \"see\" the circuit run before buying parts: open the <a href=\"https://www.falstad.com/circuit/\" target=\"_blank\" rel=\"noopener\">Falstad Circuit Simulator</a> in your browser, go to <em>Circuits → Power Supplies → Boost Converter</em>, then adjust D, L, C and watch the output change.",
  // Mạch gồm {0} khối: <strong>{1} tạo xung</strong> (bên trái), <strong>tầng công suất</strong> L{2}, Q{3}, D{4}, C{5} (bên phải), và <strong>hồi tiếp</strong> D{6}, Q{7} tự ngắt {8} khi áp ra vượt khoảng {9}V, nên rút tải ra cũng không bị vọt áp. Trên điện thoại, vuốt ngang để xem hết hình.
  "~1uk7sxx": "The circuit has {0} blocks: the <strong>{1} pulse generator</strong> (left), the <strong>power stage</strong> L{2}, Q{3}, D{4}, C{5} (right), and the <strong>feedback</strong> D{6}, Q{7} that shuts the {8} off when the output exceeds about {9}V, so removing the load does not make the voltage shoot up. On a phone, swipe sideways to see the whole figure.",
  // Sơ đồ mạch Boost {0}V lên {1}V dùng NE{2} và IRFZ{3}N
  "~1xc6147": "Schematic of the {0}V to {1}V Boost converter using the NE{2} and IRFZ{3}N",
  // Nguồn {0}V qua cầu chì F{1}, tụ C{2} và C{3}. NE{4} phát xung với R{5}, R{6}, C{7}; chân {8} qua R{9} vào cổng Q{10}, R{11} kéo cổng xuống mass. Cuộn cảm L{12} từ {13}V tới cực máng Q{14}, diode D{15} ra tụ C{16} và tải. Zener D{17} nối tiếp R{18} từ ngõ ra vào cực gốc Q{19}, R{20} kéo gốc xuống mass, cực thu Q{21} kéo chân {22} của {23} (có R{24} lên nguồn).
  "~kf7wt5": "{0}V supply through fuse F{1}, capacitors C{2} and C{3}. The NE{4} generates pulses with R{5}, R{6}, C{7}; pin {8} goes through R{9} to the gate of Q{10}, R{11} pulls the gate to ground. Inductor L{12} runs from {13}V to the drain of Q{14}, diode D{15} to capacitor C{16} and the load. Zener D{17} in series with R{18} goes from the output to the base of Q{19}, R{20} pulls the base to ground, and the collector of Q{21} pulls pin {22} of the {23} (with R{24} up to the supply).",
  // Chấm đen là chỗ dây nối nhau. Chỗ dây hồi tiếp "nhảy cầu" qua dây SW là hai dây <strong>không</strong> nối nhau.
  "6thc0d": "Black dots are wire junctions. Where the feedback wire \"jumps over\" the SW wire, the two wires are <strong>not</strong> connected.",
  // Thông số đã chọn
  "1hab9dk": "Chosen values",
  // <strong>Tần số:</strong> f ≈ {0} / (({1}k + {2} × {3}k) × {4}nF) ≈ <strong>{5} kHz</strong>.
  "~13rh4zs": "<strong>Frequency:</strong> f ≈ {0} / (({1}k + {2} × {3}k) × {4}nF) ≈ <strong>{5} kHz</strong>.",
  // <strong>Chu kỳ:</strong> D = ({0}k + {1}k) / ({2}k + {3}k) ≈ <strong>{4}</strong>. Nếu không có hồi tiếp, áp ra lý tưởng là {5} / ({6} − {7}) = {8}V. D được chọn dư để bù hao hụt khi có tải.
  "~13dl078": "<strong>Duty cycle:</strong> D = ({0}k + {1}k) / ({2}k + {3}k) ≈ <strong>{4}</strong>. Without feedback, the ideal output would be {5} / ({6} − {7}) = {8}V. D is chosen with margin to cover losses under load.",
  // <strong>Hồi tiếp:</strong> khi áp ra vượt {0}V + {1}V (áp zener + áp mở Q{2}) ≈ <strong>{3}V</strong>, zener D{4} dẫn, Q{5} dẫn và kéo chân {6} (RESET) xuống mass, {7} ngừng phát xung, MOSFET mở. Áp tụt xuống dưới ngưỡng thì Q{8} tắt và {9} chạy lại. Áp ra nhờ vậy được ghim quanh {10}V.
  "~av2foh": "<strong>Feedback:</strong> when the output exceeds {0}V + {1}V (zener voltage + Q{2} turn-on voltage) ≈ <strong>{3}V</strong>, zener D{4} conducts, Q{5} turns on and pulls pin {6} (RESET) to ground, the {7} stops pulsing and the MOSFET turns off. When the voltage falls below the threshold, Q{8} turns off and the {9} runs again. This clamps the output around {10}V.",
  // NE{0} + đế {1} chân
  "~ljlfv9": "NE{0} + {1}-pin socket",
  // Phát xung
  "1j0fvb0": "Pulse generation",
  // {0}V, gắn tản nhiệt nhỏ
  "~1tc5d53": "{0}V, fit a small heatsink",
  // Hồi tiếp
  "8mqhs1": "Feedback",
  // Cuộn cảm {0}µH, chịu ≥ {1}A
  "~tdkr7m": "{0}µH inductor, rated ≥ {1}A",
  // Loại cuộn xuyến (toroid)
  "10jn238": "Toroidal type",
  // Hoặc SS{0}; vạch trên thân hướng ra ngõ ra
  "~1yhdxpj": "Or SS{0}; the stripe faces the output",
  // Vạch hướng về ngõ ra {0}V
  "~gwc177": "Stripe towards the {0}V output",
  // Tụ hóa {0}µF {1}V
  "~1qdwdkm": "{0}µF {1}V electrolytic capacitor",
  // Lọc ngõ vào
  "zl0ai6": "Input filtering",
  // Lọc ngõ ra, chọn áp dư
  "1lt111": "Output filtering, choose a voltage rating with margin",
  // Tụ {0}nF (mã {1})
  "~11hctb6": "{0}nF capacitor (code {1})",
  // Định tần số
  "zam9pd": "Sets the frequency",
  // Tụ gốm {0}nF ({1}), {2}nF ({3})
  "~18x27db": "{0}nF ({1}), {2}nF ({3}) ceramic capacitors",
  // C{0} cắm sát chân {1} và chân {2}
  "~1r4xs62": "C{0} placed right next to pin {1} and pin {2}",
  // Nối chân {0} vào cổng Q{1}
  "~ru2v68": "Connects pin {0} to the gate of Q{1}",
  // Hạn dòng zener
  "1fk3nlz": "Limits the zener current",
  // Cầu chì {0}A + đế
  "~4ltsmj": "{0}A fuse + holder",
  // Bảo vệ khi chập
  "6lpf0i": "Short-circuit protection",
  // Tải thử
  "1qt5cp4": "Test load",
  // Bóng đèn {0}V {1}–{2}W
  "~g2t0kd": "{0}V {1}–{2}W bulb",
  // Thử tải nhỏ trước
  "b401ub": "Test with a small load first",
  // <strong>Ráp khối {0} trước</strong>, chưa gắn L{1}, Q{2}. Cấp {3}V, đo chân {4} bằng đồng hồ thang DC: thấy khoảng {5}V là {6} đang phát xung (đồng hồ hiện giá trị trung bình, khoảng D × {7}V).
  "~1oj9gzt": "<strong>Build the {0} block first</strong>, without L{1}, Q{2}. Apply {3}V and measure pin {4} on the DC range: about {5}V means the {6} is generating pulses (the meter shows the average, about D × {7}V).",
  // <strong>Gắn tầng công suất</strong> L{0}, Q{1}, D{2}, C{3} và bóng đèn thử. Cấp nguồn qua cầu chì, tốt nhất dùng nguồn có giới hạn dòng khoảng {4}A. Đo ngõ ra phải được khoảng {5}V.
  "~16g3ia3": "<strong>Add the power stage</strong> L{0}, Q{1}, D{2}, C{3} and the test bulb. Power it through the fuse, preferably from a supply with a current limit of about {4}A. The output should read about {5}V.",
  // <strong>Gắn hồi tiếp</strong> D{0}, Q{1}, R{2}, R{3}. Rút bóng đèn ra: áp ra vẫn đứng khoảng {4}–{5}V. Nếu vượt {6}V, <strong>ngắt nguồn ngay</strong> và kiểm tra chiều zener, chân Q{7}.
  "~18j2ngv": "<strong>Add the feedback</strong> D{0}, Q{1}, R{2}, R{3}. Remove the bulb: the output should stay around {4}–{5}V. If it goes above {6}V, <strong>cut the power immediately</strong> and check the zener orientation and the pins of Q{7}.",
  // <strong>Đo hiệu suất:</strong> đo U, I ở ngõ vào và ngõ ra, tính P<sub>ra</sub> / P<sub>vào</sub>.
  "1ng9048": "<strong>Measure the efficiency:</strong> measure U and I at the input and the output, and compute P<sub>out</sub> / P<sub>in</sub>.",
  // <strong>Lưu ý khi lắp:</strong> đường dòng lớn (L{0}, Q{1}, D{2}, C{3}) đi dây ngắn và to. Breadboard chịu dòng kém, nên thử tải nhỏ (dưới {4}A) trên breadboard, muốn tải lớn hơn thì hàn lên board đồng lỗ. Mạch không có giới hạn dòng: luôn có cầu chì và không được chập ngõ ra. Q{5} nóng thì gắn tản nhiệt.
  "~5u5zmy": "<strong>Assembly notes:</strong> wire the high-current path (L{0}, Q{1}, D{2}, C{3}) short and thick. Breadboards handle current poorly, so test small loads (under {4}A) on a breadboard and solder onto perfboard for larger loads. The circuit has no current limit: always use a fuse and never short the output. If Q{5} gets hot, add a heatsink.",
  "~12qtlcg": "<span class=\"k-charge\">Yellow path:</span> the switch is closed, current from the {0}V source flows through the inductor straight down to ground. The inductor is <strong>storing energy</strong>, like a car picking up speed. The diode blocks, so the capacitor does not discharge backwards. <span class=\"k-cap\">Blue path:</span> meanwhile capacitor C feeds the load on its own.",
  "~jglqs5": "<span class=\"k-boost\">Orange path:</span> the switch opens suddenly. The inductor will not let the current stop at once (a moving car cannot brake instantly), so it <strong>pushes out extra voltage</strong> in series with the source: {0}V + {1}V ≈ {2}V. The current passes the diode, charges capacitor C and feeds the load."
};
