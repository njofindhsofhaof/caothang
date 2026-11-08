/* Bản tiếng Anh của /baitapdiode cho nút VI/EN (assets/i18n.js).
   Khoá = mã băm của đoạn tiếng Việt (CTI18N.hash; "~" = mẫu có số {0}, {1}…); dòng chú thích phía trên là đoạn tiếng Việt gốc.
   Sửa câu tiếng Việt trong trang thì phải sửa cả khoá ở đây, nếu không câu đó hiện tiếng Việt.
   Thêm/đổi chữ: mở trang, gõ CTI18N.collect() trong console để lấy khoá các câu chưa dịch. */
window.CT_EN = {
  /* Cụm từ dùng để ghép câu JS sinh ra (lời giải từng bước…). */
  __phrases: [
    ["Sơ đồ mạch: nguồn V_CC qua điện trở R tới", "Circuit diagram: source V_CC through resistor R to"],
    ["nối tiếp", "in series with"],
    ["song song", "parallel with"],
    ["ngược", "(reversed)"],
    ["xuống Mass", "to ground"]
  ],
  // Bài tập mạch ứng dụng diode
  "1s0kjvz": "Exercises: diode application circuits",
  // <strong>Dạng {0} – {1}:</strong> diode và LED mắc nối tiếp (có diode phân cực nghịch).
  "~oxrgzp": "<strong>Types {0} – {1}:</strong> diodes and LEDs in series (including a reverse-biased diode).",
  // <strong>Dạng {0} – {1}:</strong> diode mắc song song cùng loại, khác loại và hai cụm song song nối tiếp.
  "~6g69pf": "<strong>Types {0} – {1}:</strong> diodes in parallel of the same type, of different types, and two parallel groups in series.",
  // Đọc sơ đồ, tính rồi nhập kết quả để tự chấm; mở lời giải để xem cách làm từng bước.
  "qlwu5d": "Read the diagram, calculate and enter your results to self-check; open the solution to see each step.",
  // <strong>Quy ước:</strong> diode Si dẫn khi đủ {0} V, diode Ge dẫn khi đủ {1} V, LED dẫn khi đủ điện áp V<sub>D</sub> ghi trong đề; khi dẫn, điện áp trên diode giữ đúng bằng V<sub>D</sub>. Dòng điện tính bằng mA, điện trở bằng Ω, điện áp bằng V; làm tròn {2} chữ số sau dấu phẩy.
  "~uu2e0f": "<strong>Conventions:</strong> a Si diode conducts once it has {0} V, a Ge diode once it has {1} V, an LED once it has the voltage V<sub>D</sub> given in the problem; while conducting, the diode voltage stays exactly at V<sub>D</sub>. Current in mA, resistance in Ω, voltage in V; round to {2} decimal places.",
  // Nhắc lại cách giải
  "l924h2": "How to solve",
  // <strong>Bước {0} · Xét diode dẫn hay không.</strong> Diode lắp ngược (cathode hướng lên V<sub>CC</sub>) là phân cực nghịch, không dẫn. Mạch nối tiếp: nếu <span class="f">V<sub>CC</sub> ≤ V<sub>D{1}</sub> + V<sub>D{2}</sub> + …</span> hoặc có {3} diode không dẫn thì cả mạch không dẫn, I = {4}.
  "~eg7ldz": "<strong>Step {0} · Check whether each diode conducts.</strong> A diode fitted backwards (cathode towards V<sub>CC</sub>) is reverse-biased and does not conduct. Series circuit: if <span class=\"f\">V<sub>CC</sub> ≤ V<sub>D{1}</sub> + V<sub>D{2}</sub> + …</span> or {3} diode does not conduct, the whole circuit does not conduct, I = {4}.",
  // <strong>Mạch không dẫn:</strong> R không có dòng nên không sụt áp, các điểm đo đều có điện áp = <span class="f">V<sub>CC</sub></span>.
  "q5plfs": "<strong>Non-conducting circuit:</strong> no current flows through R so it drops no voltage; every test point sits at <span class=\"f\">V<sub>CC</sub></span>.",
  // <strong>Diode song song:</strong> diode có điện áp ngưỡng nhỏ nhất dẫn trước và ghim điện áp cả cụm ở mức đó; diode có ngưỡng lớn hơn không đủ áp nên không dẫn (I = {0}). Các diode dẫn cùng loại chia đều dòng (định luật Kirchhoff {1} tại nút): <span class="f">I<sub>D</sub> = I<sub>R</sub> / số diode dẫn</span>.
  "~1n1rety": "<strong>Diodes in parallel:</strong> the diode with the lowest threshold conducts first and clamps the whole group at that voltage; diodes with a higher threshold do not get enough voltage and stay off (I = {0}). Conducting diodes of the same type share the current equally (Kirchhoff's law {1} at the node): <span class=\"f\">I<sub>D</sub> = I<sub>R</sub> / number of conducting diodes</span>.",
  // <strong>Bước {0} · K{1} cho vòng ({2}):</strong> <span class="f">−V<sub>CC</sub> + I<sub>R</sub>·R + V<sub>O</sub> = {3}</span> ⇒ <span class="f">I<sub>R</sub> = (V<sub>CC</sub> − V<sub>O</sub>) / R</span>, với V<sub>O</sub> là tổng điện áp các diode từ nút trên cùng xuống Mass.
  "~7pjrv8": "<strong>Step {0} · K{1} for loop ({2}):</strong> <span class=\"f\">−V<sub>CC</sub> + I<sub>R</sub>·R + V<sub>O</sub> = {3}</span> ⇒ <span class=\"f\">I<sub>R</sub> = (V<sub>CC</sub> − V<sub>O</sub>) / R</span>, where V<sub>O</sub> is the sum of the diode voltages from the top node down to ground.",
  // <strong>Chọn R:</strong> <span class="f">R = (V<sub>CC</sub> − V<sub>O</sub>) / I<sub>R</sub></span>, đổi mA ra A trước khi chia, rồi chọn điện trở chuẩn E{0} ({1}, {2}, {3}, {4}, {5}, {6}, {7}, {8}, {9}, {10}, {11}, {12} × {13}ⁿ).
  "~17urimm": "<strong>Choosing R:</strong> <span class=\"f\">R = (V<sub>CC</sub> − V<sub>O</sub>) / I<sub>R</sub></span>, convert mA to A before dividing, then pick a standard E{0} value ({1}, {2}, {3}, {4}, {5}, {6}, {7}, {8}, {9}, {10}, {11}, {12} × {13}ⁿ).",
  // Đơn vị: volt <span class="say" title="Cách đọc">vôn</span> (V) · ampere <span class="say" title="Cách đọc">am-pe</span> (A), {0} mA (mili <span class="say" title="Cách đọc">mi-li</span>ampere) = {1} A · ohm <span class="say" title="Cách đọc">ôm</span> (Ω).
  "~uxrq6t": "Units: volt (V) · ampere (A), {0} mA (milliampere) = {1} A · ohm (Ω).",
  // Dạng {0} · Một LED nối tiếp điện trở
  "~1rc8e91": "Type {0} · One LED in series with a resistor",
  // b) Chọn điện trở R để dòng qua mỗi diode dẫn là {0} mA (LED sáng bình thường) khi V<sub>CC</sub> = {1} V; {2} V; {3} V. Tính I<sub>R</sub>, R, V<sub>O</sub>.
  "~4exekb": "b) Choose R so that each conducting diode carries {0} mA (LED at normal brightness) when V<sub>CC</sub> = {1} V; {2} V; {3} V. Find I<sub>R</sub>, R, V<sub>O</sub>.",
  // Dòng nhập theo mA, điện trở theo Ω, điện áp theo V. Làm tròn {0} chữ số sau dấu phẩy; dấu phẩy hay chấm đều được. Diode không dẫn thì nhập {1}.
  "~akbe7e": "Enter current in mA, resistance in Ω, voltage in V. Round to {0} decimal places; a comma or a dot is fine. If the diode does not conduct, enter {1}.",
  // Nhận xét mạch
  "1g0tzvu": "Analyse the circuit",
  // D (LED, V<sub>D</sub> = {0} V) phân cực thuận.
  "~tvg7xm": "D (LED, V<sub>D</sub> = {0} V) is forward-biased.",
  // V<sub>CC</sub> = {0} V &lt; V<sub>D</sub> = {1} V ⇒ không đủ áp, các diode không dẫn (mạch nối tiếp: {2} con không dẫn thì cả mạch không dẫn).
  "~qwud60": "V<sub>CC</sub> = {0} V &lt; V<sub>D</sub> = {1} V ⇒ not enough voltage, the diodes do not conduct (series circuit: if {2} diode is off, the whole circuit is off).",
  // V<sub>O</sub> = V<sub>CC</sub> = {0} V (không có dòng nên R không sụt áp)
  "~15926yr": "V<sub>O</sub> = V<sub>CC</sub> = {0} V (no current, so R drops no voltage)",
  // V<sub>CC</sub> = {0} V &gt; V<sub>D</sub> = {1} V ⇒ các diode phân cực thuận dẫn.
  "~1ou1wy0": "V<sub>CC</sub> = {0} V &gt; V<sub>D</sub> = {1} V ⇒ the forward-biased diodes conduct.",
  // Mạch nối tiếp nên I<sub>D</sub> = I<sub>R</sub> = {0} mA
  "~1u92o9s": "Series circuit, so I<sub>D</sub> = I<sub>R</sub> = {0} mA",
  // Từ ({0}) ta có: I<sub>R</sub> = (V<sub>CC</sub> − V<sub>O</sub>) / R = ({1} − {2}) / {3} = {4} mA
  "~qt5moq": "From ({0}): I<sub>R</sub> = (V<sub>CC</sub> − V<sub>O</sub>) / R = ({1} − {2}) / {3} = {4} mA",
  // V<sub>CC</sub> = {0} V &gt; V<sub>D</sub> = {1} V ⇒ các diode phân cực thuận dẫn; V<sub>O</sub> = {2} V
  "~1c4d2dc": "V<sub>CC</sub> = {0} V &gt; V<sub>D</sub> = {1} V ⇒ the forward-biased diodes conduct; V<sub>O</sub> = {2} V",
  // Dòng qua mỗi diode dẫn I<sub>D</sub> = {0} mA; mạch nối tiếp nên I<sub>R</sub> = I<sub>D</sub> = {1} mA
  "~1l9s2ca": "Current through each conducting diode I<sub>D</sub> = {0} mA; series circuit, so I<sub>R</sub> = I<sub>D</sub> = {1} mA",
  // Từ ({0}) ta có: R = (V<sub>CC</sub> − V<sub>O</sub>) / I<sub>R</sub> = ({1} − {2}) / {3} = {4} Ω
  "~1r0gweb": "From ({0}): R = (V<sub>CC</sub> − V<sub>O</sub>) / I<sub>R</sub> = ({1} − {2}) / {3} = {4} Ω",
  // Chọn điện trở chuẩn E{0} gần nhất (cũng là giá trị lớn hơn kế tiếp): R = {1} Ω → I<sub>D</sub> thực ≈ {2} mA mỗi diode.
  "~ekyli5": "Pick the nearest standard E{0} value (also the next larger one): R = {1} Ω → actual I<sub>D</sub> ≈ {2} mA per diode.",
  // Chọn điện trở chuẩn E{0} gần nhất: R = {1} Ω (I<sub>D</sub> thực ≈ {2} mA mỗi diode). Muốn dòng không vượt {3} mA thì lấy giá trị lớn hơn kế tiếp: {4} Ω (I<sub>D</sub> ≈ {5} mA mỗi diode).
  "~2cksfn": "Pick the nearest standard E{0} value: R = {1} Ω (actual I<sub>D</sub> ≈ {2} mA per diode). To keep the current below {3} mA, take the next larger value: {4} Ω (I<sub>D</sub> ≈ {5} mA per diode).",
  // R = {0} Ω đúng giá trị chuẩn E{1}, chọn luôn.
  "~15l4fkj": "R = {0} Ω is exactly a standard E{1} value, use it as is.",
  // Dạng {0} · Diode Si nối tiếp LED
  "~1tq97v0": "Type {0} · Si diode in series with an LED",
  // b) Chọn điện trở R để dòng qua mỗi diode dẫn là {0} mA (LED sáng bình thường) khi V<sub>CC</sub> = {1} V; {2} V; {3} V. Tính I<sub>R</sub>, R, V<sub>O{4}</sub>, V<sub>O{5}</sub>.
  "~1nre1tg": "b) Choose R so that each conducting diode carries {0} mA (LED at normal brightness) when V<sub>CC</sub> = {1} V; {2} V; {3} V. Find I<sub>R</sub>, R, V<sub>O{4}</sub>, V<sub>O{5}</sub>.",
  // D<sub>{0}</sub> (Si, V<sub>D{1}</sub> = {2} V) phân cực thuận.
  "~1noi8v5": "D<sub>{0}</sub> (Si, V<sub>D{1}</sub> = {2} V) is forward-biased.",
  // D<sub>{0}</sub> (LED, V<sub>D{1}</sub> = {2} V) phân cực thuận.
  "~r5lf4e": "D<sub>{0}</sub> (LED, V<sub>D{1}</sub> = {2} V) is forward-biased.",
  // V<sub>CC</sub> = {0} V &lt; V<sub>D{1}</sub> + V<sub>D{2}</sub> = {3} + {4} = {5} V ⇒ không đủ áp, các diode không dẫn (mạch nối tiếp: {6} con không dẫn thì cả mạch không dẫn).
  "~67r47e": "V<sub>CC</sub> = {0} V &lt; V<sub>D{1}</sub> + V<sub>D{2}</sub> = {3} + {4} = {5} V ⇒ not enough voltage, the diodes do not conduct (series circuit: if {6} diode is off, the whole circuit is off).",
  // V<sub>O{0}</sub> = V<sub>O{1}</sub> = V<sub>CC</sub> = {2} V (không có dòng nên R không sụt áp)
  "~4p331j": "V<sub>O{0}</sub> = V<sub>O{1}</sub> = V<sub>CC</sub> = {2} V (no current, so R drops no voltage)",
  // V<sub>CC</sub> = {0} V &gt; V<sub>D{1}</sub> + V<sub>D{2}</sub> = {3} + {4} = {5} V ⇒ các diode phân cực thuận dẫn.
  "~516i22": "V<sub>CC</sub> = {0} V &gt; V<sub>D{1}</sub> + V<sub>D{2}</sub> = {3} + {4} = {5} V ⇒ the forward-biased diodes conduct.",
  // Mạch nối tiếp nên I<sub>D{0}</sub> = I<sub>D{1}</sub> = I<sub>R</sub> = {2} mA
  "~1sd4buw": "Series circuit, so I<sub>D{0}</sub> = I<sub>D{1}</sub> = I<sub>R</sub> = {2} mA",
  // Từ ({0}) ta có: I<sub>R</sub> = (V<sub>CC</sub> − V<sub>O{1}</sub>) / R = ({2} − {3}) / {4} = {5} mA
  "~f22e5j": "From ({0}): I<sub>R</sub> = (V<sub>CC</sub> − V<sub>O{1}</sub>) / R = ({2} − {3}) / {4} = {5} mA",
  // V<sub>CC</sub> = {0} V &gt; V<sub>D{1}</sub> + V<sub>D{2}</sub> = {3} + {4} = {5} V ⇒ các diode phân cực thuận dẫn; V<sub>O{6}</sub> = {7} V
  "~1gyqsiz": "V<sub>CC</sub> = {0} V &gt; V<sub>D{1}</sub> + V<sub>D{2}</sub> = {3} + {4} = {5} V ⇒ the forward-biased diodes conduct; V<sub>O{6}</sub> = {7} V",
  // Từ ({0}) ta có: R = (V<sub>CC</sub> − V<sub>O{1}</sub>) / I<sub>R</sub> = ({2} − {3}) / {4} = {5} Ω
  "~r3nyk": "From ({0}): R = (V<sub>CC</sub> − V<sub>O{1}</sub>) / I<sub>R</sub> = ({2} − {3}) / {4} = {5} Ω",
  // Dạng {0} · Ba diode nối tiếp (Si + {1} LED)
  "~ovl9gq": "Type {0} · Three diodes in series (Si + {1} LEDs)",
  // b) Chọn điện trở R để dòng qua mỗi diode dẫn là {0} mA (LED sáng bình thường) khi V<sub>CC</sub> = {1} V; {2} V; {3} V. Tính I<sub>R</sub>, R, V<sub>O{4}</sub>, V<sub>O{5}</sub>, V<sub>O{6}</sub>.
  "~1r1swds": "b) Choose R so that each conducting diode carries {0} mA (LED at normal brightness) when V<sub>CC</sub> = {1} V; {2} V; {3} V. Find I<sub>R</sub>, R, V<sub>O{4}</sub>, V<sub>O{5}</sub>, V<sub>O{6}</sub>.",
  // V<sub>CC</sub> = {0} V &lt; V<sub>D{1}</sub> + V<sub>D{2}</sub> + V<sub>D{3}</sub> = {4} + {5} + {6} = {7} V ⇒ không đủ áp, các diode không dẫn (mạch nối tiếp: {8} con không dẫn thì cả mạch không dẫn).
  "~1fum2bw": "V<sub>CC</sub> = {0} V &lt; V<sub>D{1}</sub> + V<sub>D{2}</sub> + V<sub>D{3}</sub> = {4} + {5} + {6} = {7} V ⇒ not enough voltage, the diodes do not conduct (series circuit: if {8} diode is off, the whole circuit is off).",
  // V<sub>O{0}</sub> = V<sub>O{1}</sub> = V<sub>O{2}</sub> = V<sub>CC</sub> = {3} V (không có dòng nên R không sụt áp)
  "~1lepwr3": "V<sub>O{0}</sub> = V<sub>O{1}</sub> = V<sub>O{2}</sub> = V<sub>CC</sub> = {3} V (no current, so R drops no voltage)",
  // V<sub>CC</sub> = {0} V &gt; V<sub>D{1}</sub> + V<sub>D{2}</sub> + V<sub>D{3}</sub> = {4} + {5} + {6} = {7} V ⇒ các diode phân cực thuận dẫn.
  "~138kjhg": "V<sub>CC</sub> = {0} V &gt; V<sub>D{1}</sub> + V<sub>D{2}</sub> + V<sub>D{3}</sub> = {4} + {5} + {6} = {7} V ⇒ the forward-biased diodes conduct.",
  // Mạch nối tiếp nên I<sub>D{0}</sub> = I<sub>D{1}</sub> = I<sub>D{2}</sub> = I<sub>R</sub> = {3} mA
  "~11hsnpo": "Series circuit, so I<sub>D{0}</sub> = I<sub>D{1}</sub> = I<sub>D{2}</sub> = I<sub>R</sub> = {3} mA",
  // V<sub>CC</sub> = {0} V &gt; V<sub>D{1}</sub> + V<sub>D{2}</sub> + V<sub>D{3}</sub> = {4} + {5} + {6} = {7} V ⇒ các diode phân cực thuận dẫn; V<sub>O{8}</sub> = {9} V
  "~5bamwl": "V<sub>CC</sub> = {0} V &gt; V<sub>D{1}</sub> + V<sub>D{2}</sub> + V<sub>D{3}</sub> = {4} + {5} + {6} = {7} V ⇒ the forward-biased diodes conduct; V<sub>O{8}</sub> = {9} V",
  // Dạng {0} · Ba diode nối tiếp, Si nằm giữa
  "~kmzt1s": "Type {0} · Three diodes in series, Si in the middle",
  // Dạng {0} · Có diode phân cực nghịch trong mạch nối tiếp
  "~wlxbp6": "Type {0} · A reverse-biased diode in a series circuit",
  // D<sub>{0}</sub>: Si, V<sub>D{1}</sub> = {2} V, lắp ngược
  "~1g8q2y5": "D<sub>{0}</sub>: Si, V<sub>D{1}</sub> = {2} V, fitted backwards",
  // Si {0} V · ngược
  "~f7yrnj": "Si {0} V · reversed",
  // D<sub>{0}</sub> (Si) lắp ngược: cathode hướng lên V<sub>CC</sub> → phân cực nghịch, không dẫn điện.
  "~1j2y7cw": "D<sub>{0}</sub> (Si) is fitted backwards: cathode towards V<sub>CC</sub> → reverse-biased, it does not conduct.",
  // D<sub>{0}</sub> phân cực nghịch nên không dẫn; mạch nối tiếp bị hở, không có dòng chạy qua.
  "~1hsuibm": "D<sub>{0}</sub> is reverse-biased and does not conduct; the series circuit is open, no current flows.",
  // V<sub>O{0}</sub> = V<sub>O{1}</sub> = V<sub>CC</sub> = {2} V (mạch nối tiếp: {3} diode không dẫn thì cả mạch không dẫn, không có dòng nên R không sụt áp)
  "~13ti0ep": "V<sub>O{0}</sub> = V<sub>O{1}</sub> = V<sub>CC</sub> = {2} V (series circuit: if {3} diode is off, the whole circuit is off; no current, so R drops no voltage)",
  // Dạng {0} · Diode phân cực nghịch nằm giữa hai LED
  "~1iw3rce": "Type {0} · A reverse-biased diode between two LEDs",
  // V<sub>O{0}</sub> = V<sub>O{1}</sub> = V<sub>O{2}</sub> = V<sub>CC</sub> = {3} V (mạch nối tiếp: {4} diode không dẫn thì cả mạch không dẫn, không có dòng nên R không sụt áp)
  "~h40ro8": "V<sub>O{0}</sub> = V<sub>O{1}</sub> = V<sub>O{2}</sub> = V<sub>CC</sub> = {3} V (series circuit: if {4} diode is off, the whole circuit is off; no current, so R drops no voltage)",
  // Dạng {0} · Hai LED cùng loại mắc song song
  "~z91tuc": "Type {0} · Two identical LEDs in parallel",
  // b) Chọn điện trở R để dòng qua mỗi diode dẫn là {0} mA (LED sáng bình thường) khi V<sub>CC</sub> = {1} V. Tính I<sub>R</sub>, R.
  "~rrsxhw": "b) Choose R so that each conducting diode carries {0} mA (LED at normal brightness) when V<sub>CC</sub> = {1} V. Find I<sub>R</sub>, R.",
  // Cụm D<sub>{0}</sub> // D<sub>{1}</sub> (mắc song song, cùng điện áp; dòng I<sub>R</sub> chia nhánh tại nút A). D<sub>{2}</sub>, D<sub>{3}</sub> cùng loại ({4} V), cùng phân cực thuận → cùng dẫn, điện áp cụm V<sub>D{5}</sub> = {6} V.
  "~1vk2x87": "Group D<sub>{0}</sub> // D<sub>{1}</sub> (in parallel, same voltage; current I<sub>R</sub> splits at node A). D<sub>{2}</sub>, D<sub>{3}</sub> are the same type ({4} V) and both forward-biased → both conduct, group voltage V<sub>D{5}</sub> = {6} V.",
  // V<sub>CC</sub> = {0} V &gt; V<sub>D{1}</sub> = {2} V ⇒ các diode phân cực thuận dẫn.
  "~85tsu": "V<sub>CC</sub> = {0} V &gt; V<sub>D{1}</sub> = {2} V ⇒ the forward-biased diodes conduct.",
  // Các diode dẫn cùng loại nên I<sub>D{0}</sub> = I<sub>D{1}</sub> = I<sub>R</sub> / {2} = {3} / {4} = {5} mA
  "~13z8n73": "The conducting diodes are the same type, so I<sub>D{0}</sub> = I<sub>D{1}</sub> = I<sub>R</sub> / {2} = {3} / {4} = {5} mA",
  // V<sub>CC</sub> = {0} V &gt; V<sub>D{1}</sub> = {2} V ⇒ các diode phân cực thuận dẫn; V<sub>O</sub> = {3} V
  "~123y3p3": "V<sub>CC</sub> = {0} V &gt; V<sub>D{1}</sub> = {2} V ⇒ the forward-biased diodes conduct; V<sub>O</sub> = {3} V",
  // Vì các diode dẫn cùng loại nên I<sub>D</sub> = I<sub>D{0}</sub> = I<sub>D{1}</sub>.
  "~1b843ap": "Since the conducting diodes are the same type, I<sub>D</sub> = I<sub>D{0}</sub> = I<sub>D{1}</sub>.",
  // Từ ({0}) ta có: I<sub>R</sub> = {1} × I<sub>D</sub> = {2} × {3} = {4} mA
  "~1xfdh3d": "From ({0}): I<sub>R</sub> = {1} × I<sub>D</sub> = {2} × {3} = {4} mA",
  // Dạng {0} · Song song các diode khác loại (ghim điện áp)
  "~hy1fp8": "Type {0} · Different diodes in parallel (voltage clamping)",
  // Cụm D<sub>{0}</sub> // D<sub>{1}</sub> // D<sub>{2}</sub> // D<sub>{3}</sub> // D<sub>{4}</sub> // D<sub>{5}</sub> (mắc song song, cùng điện áp; dòng I<sub>R</sub> chia nhánh tại nút A). D<sub>{6}</sub> phân cực nghịch → không dẫn, I<sub>D{7}</sub> = {8}. D<sub>{9}</sub>, D<sub>{10}</sub>, D<sub>{11}</sub> có điện áp ngưỡng nhỏ nhất ({12} V) nên dẫn trước và ghim điện áp cụm ở {13} V. D<sub>{14}</sub>, D<sub>{15}</sub> ({16} V) chỉ có {17} V &lt; {18} V (điện áp ngưỡng) nên không đủ áp để dẫn → I<sub>D{19}</sub> = I<sub>D{20}</sub> = {21}.
  "~jyrjin": "Group D<sub>{0}</sub> // D<sub>{1}</sub> // D<sub>{2}</sub> // D<sub>{3}</sub> // D<sub>{4}</sub> // D<sub>{5}</sub> (in parallel, same voltage; current I<sub>R</sub> splits at node A). D<sub>{6}</sub> is reverse-biased → off, I<sub>D{7}</sub> = {8}. D<sub>{9}</sub>, D<sub>{10}</sub>, D<sub>{11}</sub> have the lowest threshold ({12} V), so they conduct first and clamp the group at {13} V. D<sub>{14}</sub>, D<sub>{15}</sub> ({16} V) only get {17} V &lt; {18} V (threshold), not enough to conduct → I<sub>D{19}</sub> = I<sub>D{20}</sub> = {21}.",
  // Các diode dẫn cùng loại nên I<sub>D{0}</sub> = I<sub>D{1}</sub> = I<sub>D{2}</sub> = I<sub>R</sub> / {3} = {4} / {5} = {6} mA
  "~161hpm4": "The conducting diodes are the same type, so I<sub>D{0}</sub> = I<sub>D{1}</sub> = I<sub>D{2}</sub> = I<sub>R</sub> / {3} = {4} / {5} = {6} mA",
  // Vì các diode dẫn cùng loại nên I<sub>D</sub> = I<sub>D{0}</sub> = I<sub>D{1}</sub> = I<sub>D{2}</sub>.
  "~16m52aw": "Since the conducting diodes are the same type, I<sub>D</sub> = I<sub>D{0}</sub> = I<sub>D{1}</sub> = I<sub>D{2}</sub>.",
  // Dạng {0} · Song song LED đỏ, LED trắng và diode Si ngược
  "~1jtnjko": "Type {0} · A red LED, a white LED and a reversed Si diode in parallel",
  // Cụm D<sub>{0}</sub> // D<sub>{1}</sub> // D<sub>{2}</sub> // D<sub>{3}</sub> (mắc song song, cùng điện áp; dòng I<sub>R</sub> chia nhánh tại nút A). D<sub>{4}</sub> phân cực nghịch → không dẫn, I<sub>D{5}</sub> = {6}. D<sub>{7}</sub>, D<sub>{8}</sub> có điện áp ngưỡng nhỏ nhất ({9} V) nên dẫn trước và ghim điện áp cụm ở {10} V. D<sub>{11}</sub> ({12} V) chỉ có {13} V &lt; {14} V (điện áp ngưỡng) nên không đủ áp để dẫn → I<sub>D{15}</sub> = {16}.
  "~19jhvew": "Group D<sub>{0}</sub> // D<sub>{1}</sub> // D<sub>{2}</sub> // D<sub>{3}</sub> (in parallel, same voltage; current I<sub>R</sub> splits at node A). D<sub>{4}</sub> is reverse-biased → off, I<sub>D{5}</sub> = {6}. D<sub>{7}</sub>, D<sub>{8}</sub> have the lowest threshold ({9} V), so they conduct first and clamp the group at {10} V. D<sub>{11}</sub> ({12} V) only gets {13} V &lt; {14} V (threshold), not enough to conduct → I<sub>D{15}</sub> = {16}.",
  // Dạng {0} · Hai cụm song song mắc nối tiếp
  "~1e5uab0": "Type {0} · Two parallel groups in series",
  // D<sub>{0}</sub>: LED, V<sub>D{1}</sub> = {2} V, lắp ngược
  "~s76m7i": "D<sub>{0}</sub>: LED, V<sub>D{1}</sub> = {2} V, fitted backwards",
  // Cụm D<sub>{0}</sub> // D<sub>{1}</sub> // D<sub>{2}</sub> (mắc song song, cùng điện áp; dòng I<sub>R</sub> chia nhánh tại nút A). D<sub>{3}</sub>, D<sub>{4}</sub> có điện áp ngưỡng nhỏ nhất ({5} V) nên dẫn trước và ghim điện áp cụm ở {6} V. D<sub>{7}</sub> ({8} V) chỉ có {9} V &lt; {10} V (điện áp ngưỡng) nên không đủ áp để dẫn → I<sub>D{11}</sub> = {12}.
  "~c4hzdc": "Group D<sub>{0}</sub> // D<sub>{1}</sub> // D<sub>{2}</sub> (in parallel, same voltage; current I<sub>R</sub> splits at node A). D<sub>{3}</sub>, D<sub>{4}</sub> have the lowest threshold ({5} V), so they conduct first and clamp the group at {6} V. D<sub>{7}</sub> ({8} V) only gets {9} V &lt; {10} V (threshold), not enough to conduct → I<sub>D{11}</sub> = {12}.",
  // Cụm D<sub>{0}</sub> // D<sub>{1}</sub> // D<sub>{2}</sub> (mắc song song, cùng điện áp; dòng I<sub>R</sub> chia nhánh tại nút B). D<sub>{3}</sub> phân cực nghịch → không dẫn, I<sub>D{4}</sub> = {5}. D<sub>{6}</sub>, D<sub>{7}</sub> cùng loại ({8} V), cùng phân cực thuận → cùng dẫn, điện áp cụm V<sub>D{9}</sub> = {10} V.
  "~1urtkmp": "Group D<sub>{0}</sub> // D<sub>{1}</sub> // D<sub>{2}</sub> (in parallel, same voltage; current I<sub>R</sub> splits at node B). D<sub>{3}</sub> is reverse-biased → off, I<sub>D{4}</sub> = {5}. D<sub>{6}</sub>, D<sub>{7}</sub> are the same type ({8} V) and both forward-biased → both conduct, group voltage V<sub>D{9}</sub> = {10} V.",
  // Vì các diode dẫn trong mỗi cụm cùng loại nên I<sub>D</sub> = I<sub>D{0}</sub> = I<sub>D{1}</sub> = I<sub>D{2}</sub> = I<sub>D{3}</sub>.
  "~14mlifw": "Since the conducting diodes in each group are the same type, I<sub>D</sub> = I<sub>D{0}</sub> = I<sub>D{1}</sub> = I<sub>D{2}</sub> = I<sub>D{3}</sub>.",
  // Từ ({0}), ({1}) ta có: I<sub>R</sub> = {2} × I<sub>D</sub> = {3} × {4} = {5} mA
  "~1tw4d51": "From ({0}), ({1}): I<sub>R</sub> = {2} × I<sub>D</sub> = {3} × {4} = {5} mA",
  // Dạng {0} · Cụm LED nối tiếp cụm diode Si
  "~83pun4": "Type {0} · An LED group in series with a Si diode group",
  // Dạng {0} · Ba diode nối tiếp (Ge + Si + LED)
  "~1hr8km": "Type {0} · Three diodes in series (Ge + Si + LED)",
  // D<sub>{0}</sub> (Ge, V<sub>D{1}</sub> = {2} V) phân cực thuận.
  "~6ocrfl": "D<sub>{0}</sub> (Ge, V<sub>D{1}</sub> = {2} V) is forward-biased.",
  // Dạng {0} · Song song Ge // Si (khác loại) nối tiếp LED
  "~fwwcyg": "Type {0} · Ge // Si in parallel (different types) in series with an LED",
  // Cụm D<sub>{0}</sub> // D<sub>{1}</sub> (mắc song song, cùng điện áp; dòng I<sub>R</sub> chia nhánh tại nút A). D<sub>{2}</sub> có điện áp ngưỡng nhỏ nhất ({3} V) nên dẫn trước và ghim điện áp cụm ở {4} V. D<sub>{5}</sub> ({6} V) chỉ có {7} V &lt; {8} V (điện áp ngưỡng) nên không đủ áp để dẫn → I<sub>D{9}</sub> = {10}.
  "~19lupxv": "Group D<sub>{0}</sub> // D<sub>{1}</sub> (in parallel, same voltage; current I<sub>R</sub> splits at node A). D<sub>{2}</sub> has the lowest threshold ({3} V), so it conducts first and clamps the group at {4} V. D<sub>{5}</sub> ({6} V) only gets {7} V &lt; {8} V (threshold), not enough to conduct → I<sub>D{9}</sub> = {10}.",
  // Mạch nối tiếp nên I<sub>D{0}</sub> = I<sub>R</sub> = {1} mA
  "~16n5c87": "Series circuit, so I<sub>D{0}</sub> = I<sub>R</sub> = {1} mA",
  // I<sub>D{0}</sub> = {1} (không dẫn) nên I<sub>D{2}</sub> = I<sub>R</sub> = {3} mA
  "~18mcxr2": "I<sub>D{0}</sub> = {1} (off), so I<sub>D{2}</sub> = I<sub>R</sub> = {3} mA",
  // Cụm song song chỉ có D<sub>{0}</sub> dẫn nên dòng chỉ đi qua {1} nhánh: I<sub>R</sub> = I<sub>D</sub> = {2} mA
  "~gst6uu": "Only D<sub>{0}</sub> conducts in the parallel group, so the current takes {1} branch: I<sub>R</sub> = I<sub>D</sub> = {2} mA"
};
