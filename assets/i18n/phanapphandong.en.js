/* Bản tiếng Anh của /phanapphandong cho nút VI/EN (assets/i18n.js).
   Khoá = mã băm của đoạn tiếng Việt (CTI18N.hash; "~" = mẫu có số {0}, {1}…); dòng chú thích phía trên là đoạn tiếng Việt gốc.
   Sửa câu tiếng Việt trong trang thì phải sửa cả khoá ở đây, nếu không câu đó hiện tiếng Việt.
   Thêm/đổi chữ: mở trang, gõ CTI18N.collect() trong console để lấy khoá các câu chưa dịch. */
window.CT_EN = {
  /* Cụm từ dùng để ghép câu JS sinh ra (lời giải từng bước…). */
  __phrases: [
    ["Cụm", "Group"]
  ],
  // Bài tập Định lý phân áp &amp; phân dòng
  "863kjw": "Exercises: voltage divider &amp; current divider rules",
  // {0} bài nâng cao gồm {1} dạng. Dạng {2} (Bài {3}, {4}, {5}): cụm song song nằm ở đáy, tiếp Mass. Dạng {6} (Bài {7}, {8}, {9}): cụm song song kẹp giữa các tầng nối tiếp. Đọc sơ đồ, tính rồi nhập kết quả để tự chấm; mở lời giải để xem cách làm từng bước.
  "~lwylzx": "{0} advanced problems of {1} types. Type {2} (Problems {3}, {4}, {5}): the parallel group sits at the bottom, connected to ground. Type {6} (Problems {7}, {8}, {9}): the parallel group is sandwiched between series stages. Read the diagram, calculate and enter your results to self-check; open the solution to see each step.",
  // <strong>Quy ước:</strong> kết quả tính toán làm tròn lấy đúng {0} chữ số sau dấu phẩy (vd {1}; {2}); điện trở tính bằng Ω, dòng điện tính bằng mA, điện áp tính bằng V.
  "~758n7t": "<strong>Conventions:</strong> results are rounded to exactly {0} decimal places (e.g. {1}; {2}); resistance in Ω, current in mA, voltage in V.",
  // Nối tiếp: <span class="f">R<sub>tđ</sub> = R<sub>{0}</sub> + R<sub>{1}</sub> + …</span>, dòng như nhau qua mọi điện trở.
  "~lt5iuk": "Series: <span class=\"f\">R<sub>eq</sub> = R<sub>{0}</sub> + R<sub>{1}</sub> + …</span>, the same current flows through every resistor.",
  // Song song {0} nhánh: <span class="f">R<sub>{1}</sub> = R<sub>{2}</sub>·R<sub>{3}</sub> / (R<sub>{4}</sub> + R<sub>{5}</sub>)</span>; nhiều nhánh: <span class="f">{6}/R = {7}/R<sub>{8}</sub> + {9}/R<sub>{10}</sub> + …</span>. Hai điện trở bằng nhau song song = một nửa.
  "~12y8pne": "Parallel, {0} branches: <span class=\"f\">R<sub>{1}</sub> = R<sub>{2}</sub>·R<sub>{3}</sub> / (R<sub>{4}</sub> + R<sub>{5}</sub>)</span>; more branches: <span class=\"f\">{6}/R = {7}/R<sub>{8}</sub> + {9}/R<sub>{10}</sub> + …</span>. Two equal resistors in parallel = half the value.",
  // Phân áp: <span class="f">V<sub>Rx</sub> = V<sub>CC</sub>·R<sub>x</sub> / R<sub>tđ</sub></span>. Điện áp tại một điểm đo V<sub>O</sub> (so với Mass) = V<sub>CC</sub> × (tổng điện trở từ điểm đó xuống Mass) / R<sub>tđ</sub>.
  "1enxo3f": "Voltage divider: <span class=\"f\">V<sub>Rx</sub> = V<sub>CC</sub>·R<sub>x</sub> / R<sub>eq</sub></span>. The voltage at a test point V<sub>O</sub> (relative to ground) = V<sub>CC</sub> × (total resistance from that point down to ground) / R<sub>eq</sub>.",
  // Phân dòng {0} nhánh: <span class="f">I<sub>{1}</sub> = I·R<sub>{2}</sub> / (R<sub>{3}</sub> + R<sub>{4}</sub>)</span> (dòng qua nhánh này tỉ lệ với điện trở nhánh kia). Nhiều nhánh: <span class="f">I<sub>k</sub> = V<sub>cụm</sub> / R<sub>k</sub></span>, tổng các dòng nhánh = I.
  "~x7bdbj": "Current divider, {0} branches: <span class=\"f\">I<sub>{1}</sub> = I·R<sub>{2}</sub> / (R<sub>{3}</sub> + R<sub>{4}</sub>)</span> (the current in one branch is proportional to the resistance of the other). More branches: <span class=\"f\">I<sub>k</sub> = V<sub>group</sub> / R<sub>k</sub></span>, and the branch currents add up to I.",
  // Đơn vị nhập: điện trở theo Ω, dòng theo mA, điện áp theo V.
  "1kxfhfw": "Input units: resistance in Ω, current in mA, voltage in V.",
  // Dạng {0} · {1} tầng nối tiếp + cụm song song ở đáy
  "~1sdmj9b": "Type {0} · {1} series stages + a parallel group at the bottom",
  // a) Đọc vòng màu ({0}VM và {1}VM, sai số Vàng kim = {2}%) cho cả {3} điện trở.
  "~15pqazy": "a) Read the color bands ({0}-band and {1}-band, Gold tolerance = {2}%) for all {3} resistors.",
  // b) Tính điện trở tương đương R<sub>tđ</sub>.
  "stgg0e": "b) Find the equivalent resistance R<sub>eq</sub>.",
  // c) Tính dòng điện toàn mạch I và các dòng nhánh I<sub>{0}</sub>, I<sub>{1}</sub>.
  "~2y8xrz": "c) Find the total current I and the branch currents I<sub>{0}</sub>, I<sub>{1}</sub>.",
  // d) Dùng định lý phân áp tính V<sub>R{0}</sub>, V<sub>R{1}</sub>, V<sub>R{2}</sub>, V<sub>R{3}</sub> và V<sub>O{4}</sub>, V<sub>O{5}</sub>, V<sub>O{6}</sub>.
  "~15uq5uw": "d) Use the voltage divider rule to find V<sub>R{0}</sub>, V<sub>R{1}</sub>, V<sub>R{2}</sub>, V<sub>R{3}</sub> and V<sub>O{4}</sub>, V<sub>O{5}</sub>, V<sub>O{6}</sub>.",
  // Kết quả làm tròn lấy {0} chữ số sau dấu phẩy (vd {1}; {2}). Nhập dấu phẩy hoặc chấm đều được.
  "~1qri2cu": "Round results to {0} decimal places (e.g. {1}; {2}). Either a comma or a dot is accepted.",
  // a) Vòng màu (sai số Vàng kim ±{0}%)
  "~1umd3m4": "a) Color bands (Gold tolerance ±{0}%)",
  // c) Dòng điện (phân dòng)
  "qx698x": "c) Current (current divider)",
  // d) Điện áp (phân áp)
  "odbcr9": "d) Voltage (voltage divider)",
  // Dạng {0} · Cụm song song {1} nhánh kẹp giữa
  "~8tsqht": "Type {0} · A {1}-branch parallel group in the middle",
  // a) Đọc vòng màu ({0}VM và {1}VM, sai số VK = {2}%) cho các điện trở.
  "~gaub1z": "a) Read the color bands ({0}-band and {1}-band, Gold tolerance = {2}%) for the resistors.",
  // b) Tính R<sub>song song</sub> (R<sub>{0}</sub>) và R<sub>tđ</sub> toàn mạch.
  "~1xusg00": "b) Find R<sub>parallel</sub> (R<sub>{0}</sub>) and R<sub>eq</sub> of the whole circuit.",
  // c) Dùng định lý phân áp tính V<sub>R{0}</sub>, V<sub>song song</sub>, V<sub>R{1}</sub> và V<sub>O{2}</sub>, V<sub>O{3}</sub>.
  "~1x1foyh": "c) Use the voltage divider rule to find V<sub>R{0}</sub>, V<sub>parallel</sub>, V<sub>R{1}</sub> and V<sub>O{2}</sub>, V<sub>O{3}</sub>.",
  // d) Tính dòng tổng I và dòng qua {0} nhánh song song I<sub>{1}</sub>, I<sub>{2}</sub>, I<sub>{3}</sub>, I<sub>{4}</sub>.
  "~1onlu2k": "d) Find the total current I and the currents in the {0} parallel branches I<sub>{1}</sub>, I<sub>{2}</sub>, I<sub>{3}</sub>, I<sub>{4}</sub>.",
  // a) Đọc vòng màu ({0}VM và {1}VM, sai số VK = {2}%).
  "~1xmxnma": "a) Read the color bands ({0}-band and {1}-band, Gold tolerance = {2}%).",
  // b) Tính R<sub>tđ</sub> toàn mạch.
  "1ozyq1n": "b) Find R<sub>eq</sub> of the whole circuit.",
  // c) Dùng phân áp tính lần lượt V<sub>O{0}</sub>, V<sub>O{1}</sub>, V<sub>O{2}</sub>, V<sub>O{3}</sub>.
  "~1rcv1b7": "c) Use the voltage divider to find V<sub>O{0}</sub>, V<sub>O{1}</sub>, V<sub>O{2}</sub>, V<sub>O{3}</sub> in turn.",
  // d) Tính dòng điện tổng I và các dòng rẽ I<sub>{0}</sub>, I<sub>{1}</sub>.
  "~khcfwa": "d) Find the total current I and the branch currents I<sub>{0}</sub>, I<sub>{1}</sub>.",
  // Dạng {0} · Trên và dưới cụm song song đều có {1} điện trở nối tiếp
  "~13ilfof": "Type {0} · {1} series resistor(s) both above and below the parallel group",
  // b) Tính điện trở tương đương cụm song song và toàn mạch R<sub>tđ</sub>.
  "afjmav": "b) Find the equivalent resistance of the parallel group and of the whole circuit R<sub>eq</sub>.",
  // c) Dùng phân áp tính V<sub>O{0}</sub>, V<sub>O{1}</sub>, V<sub>O{2}</sub>, V<sub>O{3}</sub>.
  "~1tsejal": "c) Use the voltage divider to find V<sub>O{0}</sub>, V<sub>O{1}</sub>, V<sub>O{2}</sub>, V<sub>O{3}</sub>.",
  // d) Tính dòng tổng I và dòng phân nhánh I<sub>{0}</sub>, I<sub>{1}</sub>, I<sub>{2}</sub>.
  "~1acil0g": "d) Find the total current I and the branch currents I<sub>{0}</sub>, I<sub>{1}</sub>, I<sub>{2}</sub>.",
  // <span class="pa-bandtag">{0}VM</span><span class="pa-nobands">Không có — giá trị cần {1} số có nghĩa, dùng loại {2} vòng</span>
  "~1vw3nm2": "<span class=\"pa-bandtag\">{0}-band</span><span class=\"pa-nobands\">None — the value needs {1} significant digits, use the {2}-band type</span>",
  // Dạng {0} · Cụm đáy gồm {1} nhánh song song
  "~rhdijv": "Type {0} · The bottom group has {1} parallel branches",
  // c) Tính dòng điện toàn mạch I và dòng rẽ I<sub>{0}</sub>, I<sub>{1}</sub>, I<sub>{2}</sub>.
  "~1b0v4yo": "c) Find the total current I and the branch currents I<sub>{0}</sub>, I<sub>{1}</sub>, I<sub>{2}</sub>.",
  // d) Dùng phân áp tính V<sub>R{0}</sub>, V<sub>R{1}</sub>, V<sub>R{2}</sub> và các mốc áp V<sub>O{3}</sub>, V<sub>O{4}</sub>, V<sub>O{5}</sub>.
  "~dkucr3": "d) Use the voltage divider to find V<sub>R{0}</sub>, V<sub>R{1}</sub>, V<sub>R{2}</sub> and the node voltages V<sub>O{3}</sub>, V<sub>O{4}</sub>, V<sub>O{5}</sub>.",
  // Dạng {0} · Siêu nâng cao: {1} cụm song song nhiều tầng
  "~1yrzyks": "Type {0} · Expert: {1} parallel groups across several stages",
  // b) Tính điện trở tương đương từng cụm song song và toàn mạch R<sub>tđ</sub>.
  "1e4546t": "b) Find the equivalent resistance of each parallel group and of the whole circuit R<sub>eq</sub>.",
  // c) Dùng định lý phân áp tính V<sub>O{0}</sub>, V<sub>O{1}</sub>, V<sub>O{2}</sub>, V<sub>O{3}</sub>.
  "~1693h0a": "c) Use the voltage divider rule to find V<sub>O{0}</sub>, V<sub>O{1}</sub>, V<sub>O{2}</sub>, V<sub>O{3}</sub>.",
  // d) Tính dòng điện toàn mạch I, dòng qua Cụm A (I<sub>{0}</sub>, I<sub>{1}</sub>) và Cụm B (I<sub>{2}</sub>, I<sub>{3}</sub>, I<sub>{4}</sub>).
  "~gjsw4h": "d) Find the total current I, the currents through Group A (I<sub>{0}</sub>, I<sub>{1}</sub>) and Group B (I<sub>{2}</sub>, I<sub>{3}</sub>, I<sub>{4}</sub>)."
};
