/* Bản tiếng Anh của nhiều trang (menu, chân trang, tên bài, bài tập dùng chung) cho nút VI/EN (assets/i18n.js).
   Khoá = mã băm của đoạn tiếng Việt (CTI18N.hash; "~" = mẫu có số {0}, {1}…); dòng chú thích phía trên là đoạn tiếng Việt gốc.
   Sửa câu tiếng Việt trong trang thì phải sửa cả khoá ở đây, nếu không câu đó hiện tiếng Việt.
   Thêm/đổi chữ: mở trang, gõ CTI18N.collect() trong console để lấy khoá các câu chưa dịch. */
window.CT_EN = {
  /* Cụm từ dùng để ghép câu JS sinh ra (lời giải từng bước…). */
  __phrases: [
    ["tđ", "eq"],
    ["cụm", "group"],
    ["song song", "parallel"],
    ["Hai nhánh song song", "Two parallel branches"],
    ["Toàn mạch", "Whole circuit"],
    ["Chia dòng", "Current divider"],
    ["Hiệu dụng", "RMS values"],
    ["Kiểm tra", "Check"],
    ["Dòng toàn mạch (dạng phức)", "Total current (phasor)"],
    ["Dòng toàn mạch chính là dòng nguồn", "The total current is the source current"],
    ["Điện áp hai đầu cụm song song", "Voltage across the parallel group"],
    ["tải mang tính dung", "capacitive load"],
    ["tải mang tính cảm", "inductive load"],
    ["tải thuần trở", "purely resistive load"],
    ["Nhánh", "Branch"],
    ["Bước", "Step"],
    ["Từ", "From"],
    ["từ", "from"],
    ["thay vào", "substitute into"],
    ["Thay vào", "Substitute into"],
    ["Giải hệ", "Solving the system"],
    ["Giải hệ phương trình", "Solving the system of equations"],
    ["và", "and"],
    ["Áp dụng", "Apply"],
    ["tại nút", "at node"],
    ["cho vòng", "to loop"],
    ["Vậy", "So"],
    ["Đáp án", "Answer"],
    ["Đáp số", "Answers"],
    ["bài", "problem"],
    ["Bài", "Problem"],
    ["Đề", "Test"],
    ["Khi khóa S ở vị trí", "With switch S at position"],
    ["âm: dòng thực tế ngược chiều I", "negative: the actual current flows opposite to I"],
    ["Sơ đồ mạch bài", "Circuit diagram, problem"],
    ["Hình minh họa bài", "Figure for problem"],
    ["Phóng to hình bài", "Enlarge figure for problem"],
    ["Hình bài", "Figure for problem"],
    ["Viết hệ", "Write the system"],
    ["và tính", "and find"],
    ["Tính", "Find"],
    ["Công suất nguồn", "Source power"],
    ["Công suất tải", "Load power"],
    ["tải", "load"],
    ["Điện áp trên nguồn dòng", "Voltage across the current source"],
    ["Nguồn dòng", "Current source"],
    ["Nguồn áp", "Voltage source"],
    ["mắc nối tiếp", "in series with"],
    ["nên", "so"],
    ["Điện trở tương đương", "Equivalent resistance"],
    ["Dòng điện", "Current"],
    ["Điện áp", "Voltage"],
    ["Nâu", "Brown"],
    ["Đỏ", "Red"],
    ["Cam", "Orange"],
    ["Vàng", "Yellow"],
    ["Xanh lục", "Green"],
    ["Xanh lá", "Green"],
    ["Xanh lam", "Blue"],
    ["Xanh dương", "Blue"],
    ["Tím", "Violet"],
    ["Xám", "Grey"],
    ["Trắng", "White"],
    ["Đen", "Black"],
    ["Vàng kim", "Gold"],
    ["Bạc", "Silver"],
    ["Không màu", "None"],
    ["Cập nhật", "Updated"],
    ["tính theo từng môn mỗi ngày", "counted per subject each day"],
    ["buổi đúng giờ", "on-time sessions"],
    ["mã không hợp lệ", "invalid code"]
  ],
  // Ngày
  "1f14dgt": "Day",
  // Mạch hạ áp Buck {0}V xuống {1}V
  "~94quer": "Buck converter {0}V to {1}V",
  // IC {0} phát xung
  "~17ywoeo": "{0} IC pulse generator",
  // Mạch tăng áp Boost {0}V lên {1}V
  "~17sz7nj": "Boost converter {0}V to {1}V",
  // Nền tối
  "qafs24": "Dark theme",
  // Chuyển sang nền tối
  "yorfyn": "Switch to dark theme",
  // Đang cập nhật.
  "1gn8362": "Coming soon.",
  // Lý Thuyết Mạch
  "1z938g": "Circuit Theory",
  // Đo Lường Điện
  "ttnqcu": "Electrical Measurement",
  // Anh Văn
  "1fdllb1": "English",
  // Leo rank tháng {0}
  "~9kgx29": "Rank climb, month {0}",
  // <a class="backlink" href="/namnhat">← Năm nhất</a> <a class="backlink" href="/">← Về trang chủ</a>
  "13ntpwg": "<a class=\"backlink\" href=\"/namnhat\">← Year 1</a> <a class=\"backlink\" href=\"/\">← Back to home</a>",
  // <a class="backlink" href="/ontap">← Ôn tập</a> <a class="backlink" href="/">← Về trang chủ</a>
  "c8ubln": "<a class=\"backlink\" href=\"/ontap\">← Review</a> <a class=\"backlink\" href=\"/\">← Back to home</a>",
  // Mạch xác lập điều hoà
  "9u9lbo": "Sinusoidal steady-state circuits",
  // Đề ôn kiểm tra {0} tiết môn Lý thuyết Mạch
  "~qbtdud": "Circuit Theory {0}-period test review",
  // Bài tập Kirchhoff Law {0} môn Lý thuyết Mạch
  "~yes0pd": "Kirchhoff's Laws {0} exercises · Circuit Theory",
  // ĐT
  "gepxfl": "BE",
  // Bài tập đọc &amp; tính mã điện trở dán SMD
  "26ushl": "Exercises: reading &amp; calculating SMD resistor codes",
  // Bài tập đọc &amp; tính mã tụ điện
  "kcrsw8": "Exercises: reading &amp; calculating capacitor codes",
  // Đề ôn kiểm tra {0} tiết môn Đo lường điện
  "~1e15nx0": "Electrical Measurement {0}-period test review",
  // Test Đầu Vào Tiếng Anh
  "7tdam8": "English Placement Test",
  // <a href="/">Trang chủ</a><a href="/hoctap">Học tập</a><a href="/ontap">Ôn tập</a><a href="/duan">Dự án</a><a href="/hoatdong">Hoạt động</a><a href="/event">Bài viết</a><a href="/diemdanh">Điểm danh</a>
  "1oa02y0": "<a href=\"/\">Home</a><a href=\"/hoctap\">Study</a><a href=\"/ontap\">Review</a><a href=\"/duan\">Projects</a><a href=\"/hoatdong\">Activities</a><a href=\"/event\">Articles</a><a href=\"/diemdanh\">Attendance</a>",
  // {0}/{1}/{2} · Ngao Vui Tính Hẳn
  "~1jgvls2": "{0}/{1}/{2} · Ngao Vui Tính Hẳn",
  // công tắc
  "pucoqn": "switch",
  // Công thức
  "15tt9kj": "Formulas",
  // ← Về Dự án
  "1bpgc5y": "← Back to Projects",
  // Điều khiển mô phỏng
  "xghpau": "Simulation controls",
  // Mạch gồm những gì
  "o48qdk": "What the circuit contains",
  // Nguyên lý: hai bước lặp lại liên tục
  "1c02qn1": "Principle: two steps repeating continuously",
  // Công tắc
  "wwsq1r": "Switch",
  // Tự làm
  "1jvn7gp": "Build it yourself",
  // Sơ đồ hoàn chỉnh để lắp
  "neowdl": "Complete schematic for assembly",
  // Danh sách linh kiện
  "1nu9ul9": "Parts list",
  // Ký hiệu
  "1pnvbxg": "Symbol",
  // Linh kiện
  "1plbck9": "Component",
  // Ghi chú
  "cuf7e6": "Notes",
  // Thứ tự lắp và đo kiểm
  "13pr1r2": "Assembly order and testing",
  // <a class="backlink" href="/lythuyetmach">← Lý Thuyết Mạch</a>
  "1wcovgp": "<a class=\"backlink\" href=\"/lythuyetmach\">← Circuit Theory</a>",
  // Đề {0}
  "~t8jxpc": "Test {0}",
  // Bài {0}
  "~1inw0m0": "Problem {0}",
  // Kiểm tra
  "1jp5mt0": "Check",
  // Làm lại
  "19hs6ji": "Try again",
  // a) Tính dòng điện I₁, I₂, I₃. b) Tính công suất nguồn và công suất tải.
  "14v5pje": "a) Find the currents I₁, I₂, I₃. b) Find the source power and the load power.",
  // Xem lời giải bài {0}
  "~gayp9a": "View solution for problem {0}",
  // a) Dòng điện các nhánh
  "pxtex": "a) Branch currents",
  // Nguồn dòng {0} A mắc nối tiếp R₁ nên I₁ = {1} A.
  "~1f8sghz": "The {0} A current source is in series with R₁, so I₁ = {1} A.",
  // Áp dụng K{0} tại nút A: I₁ − I₂ − I₃ = {1} ⇒ I₂ + I₃ = {2} ({3})
  "~1dircji": "Apply K{0} at node A: I₁ − I₂ − I₃ = {1} ⇒ I₂ + I₃ = {2} ({3})",
  // Áp dụng K{0} cho vòng V₂: U₂ − U₃ = {1} ⇒ I₂ × R₂ − I₃ × R₃ = {2} ⇒ {3}I₂ − {4}I₃ = {5} ({6})
  "~1m1vyb": "Apply K{0} to loop V₂: U₂ − U₃ = {1} ⇒ I₂ × R₂ − I₃ × R₃ = {2} ⇒ {3}I₂ − {4}I₃ = {5} ({6})",
  // Từ ({0}), ({1}) ⇒ I₂ = {2} A, I₃ = {3} A
  "~1762qjf": "From ({0}), ({1}) ⇒ I₂ = {2} A, I₃ = {3} A",
  // b) Công suất
  "3xyt1p": "b) Power",
  // Áp dụng K{0} cho vòng V₁: −U<sub>N</sub> + U<sub>R{1}</sub> + U<sub>R{2}</sub> = {3}
  "~y3z110": "Apply K{0} to loop V₁: −U<sub>N</sub> + U<sub>R{1}</sub> + U<sub>R{2}</sub> = {3}",
  // Công suất nguồn: P<sub>N</sub> = U<sub>N</sub> × I<sub>N</sub> = {0} × {1} = {2} W
  "~vcv8mt": "Source power: P<sub>N</sub> = U<sub>N</sub> × I<sub>N</sub> = {0} × {1} = {2} W",
  // Công suất tải: P<sub>tải</sub> = I₁² × R₁ + I₂² × R₂ + I₃² × R₃ = {0}² × {1} + {2}² × {3} + {4}² × {5} = {6} + {7} + {8} = {9} W
  "~1t0z49e": "Load power: P<sub>load</sub> = I₁² × R₁ + I₂² × R₂ + I₃² × R₃ = {0}² × {1} + {2}² × {3} + {4}² × {5} = {6} + {7} + {8} = {9} W",
  // ⇒ Công suất nguồn bằng công suất tải.
  "1d45wzw": "⇒ Source power equals load power.",
  // a) Tính dòng điện I₁, I₂, I₃, I₄. b) Tính công suất nguồn và công suất tải.
  "1sqgx91": "a) Find the currents I₁, I₂, I₃, I₄. b) Find the source power and the load power.",
  // Áp dụng K{0} tại nút A: I₁ − I₂ − I₃ − I₄ = {1} ({2})
  "~9vvv0b": "Apply K{0} at node A: I₁ − I₂ − I₃ − I₄ = {1} ({2})",
  // Áp dụng K{0} cho vòng V₁: −U<sub>N</sub> + U₁ + U₂ = {1} ⇒ {2}I₁ + {3}I₂ = {4} ({5})
  "~aawo1u": "Apply K{0} to loop V₁: −U<sub>N</sub> + U₁ + U₂ = {1} ⇒ {2}I₁ + {3}I₂ = {4} ({5})",
  // Áp dụng K{0} cho vòng V₂: −U₂ + U₃ = {1} ⇒ −{2}I₂ + {3}I₃ = {4} ({5})
  "~17chevq": "Apply K{0} to loop V₂: −U₂ + U₃ = {1} ⇒ −{2}I₂ + {3}I₃ = {4} ({5})",
  // Áp dụng K{0} cho vòng V₃: −U₃ + U₄ = {1} ⇒ −{2}I₃ + {3}I₄ = {4} ({5})
  "~es0qyx": "Apply K{0} to loop V₃: −U₃ + U₄ = {1} ⇒ −{2}I₃ + {3}I₄ = {4} ({5})",
  // Thay vào ({0}): {1} × {2}I₂ + {3}I₂ = {4} ⇒ {5}I₂ = {6} ⇒ I₂ = {7} A
  "~gss4d": "Substitute into ({0}): {1} × {2}I₂ + {3}I₂ = {4} ⇒ {5}I₂ = {6} ⇒ I₂ = {7} A",
  // Công suất tải: P<sub>tải</sub> = I₁² × R₁ + I₂² × R₂ + I₃² × R₃ + I₄² × R₄
  "38z6iv": "Load power: P<sub>load</sub> = I₁² × R₁ + I₂² × R₂ + I₃² × R₃ + I₄² × R₄",
  // a) Tính dòng điện I₁, I₂, I₃, I₄, I₅. b) Tính công suất các nguồn và công suất tải.
  "s42zlq": "a) Find the currents I₁, I₂, I₃, I₄, I₅. b) Find the power of the sources and the load power.",
  // Áp dụng K{0} tại nút A: I₁ − I₂ + I₃ = {1} ({2})
  "~103ctb": "Apply K{0} at node A: I₁ − I₂ + I₃ = {1} ({2})",
  // Áp dụng K{0} tại nút B: −I₃ − I₄ + {1} = {2} ⇒ I₃ + I₄ = {3} ({4})
  "~14mjuq0": "Apply K{0} at node B: −I₃ − I₄ + {1} = {2} ⇒ I₃ + I₄ = {3} ({4})",
  // Áp dụng K{0} tại nút C: I₄ + I₅ − {1} = {2} ⇒ I₄ + I₅ = {3} ({4})
  "~ujrx07": "Apply K{0} at node C: I₄ + I₅ − {1} = {2} ⇒ I₄ + I₅ = {3} ({4})",
  // Áp dụng K{0} tại nút D: −I₁ + I₂ − I₅ = {1} ({2})
  "~q2bm70": "Apply K{0} at node D: −I₁ + I₂ − I₅ = {1} ({2})",
  // Áp dụng K{0} cho vòng V₁: −U + U₂ = {1} ⇒ {2}I₂ = {3} ⇒ I₂ = {4} A ({5})
  "~kapz0i": "Apply K{0} to loop V₁: −U + U₂ = {1} ⇒ {2}I₂ = {3} ⇒ I₂ = {4} A ({5})",
  // Áp dụng K{0} cho vòng V₂ (A → B → R₄ → C → D → A, không đi qua nguồn dòng): −U₃ + U₄ − U₅ − U₂ = {1}
  "~tvtvf8": "Apply K{0} to loop V₂ (A → B → R₄ → C → D → A, not passing through the current source): −U₃ + U₄ − U₅ − U₂ = {1}",
  // Từ ({0}), ({1}): I₃ = {2} − I₄, I₅ = {3} − I₄ ; thay vào ({4}): −({5} − I₄) + {6}I₄ − {7}({8} − I₄) = {9} ⇒ {10}I₄ = {11} ⇒ I₄ = {12} A
  "~4xgg3o": "From ({0}), ({1}): I₃ = {2} − I₄, I₅ = {3} − I₄ ; substitute into ({4}): −({5} − I₄) + {6}I₄ − {7}({8} − I₄) = {9} ⇒ {10}I₄ = {11} ⇒ I₄ = {12} A",
  // ⇒ I₃ = {0} A, I₅ = {1} A ; từ ({2}): I₁ = I₂ − I₃ = {3} − {4} = {5} A
  "~1i2gpwc": "⇒ I₃ = {0} A, I₅ = {1} A ; from ({2}): I₁ = I₂ − I₃ = {3} − {4} = {5} A",
  // Vậy I₁ = {0} A, I₂ = {1} A, I₃ = {2} A, I₄ = {3} A, I₅ = {4} A
  "~1fkzm31": "So I₁ = {0} A, I₂ = {1} A, I₃ = {2} A, I₄ = {3} A, I₅ = {4} A",
  // Điện áp trên nguồn dòng, áp dụng K{0} cho vòng V₃: −U<sub>J</sub> + U₄ = {1} ⇒ U<sub>J</sub> = I₄ × R₄ = {2} × {3} = {4} V
  "~13uk5p5": "Voltage across the current source, apply K{0} to loop V₃: −U<sub>J</sub> + U₄ = {1} ⇒ U<sub>J</sub> = I₄ × R₄ = {2} × {3} = {4} V",
  // Công suất nguồn: P<sub>N</sub> = U × I₁ + U<sub>J</sub> × J = {0} × {1} + {2} × {3} = {4} + {5} = {6} W
  "~ffttpm": "Source power: P<sub>N</sub> = U × I₁ + U<sub>J</sub> × J = {0} × {1} + {2} × {3} = {4} + {5} = {6} W",
  // Công suất tải: P<sub>tải</sub> = I₂² × R₂ + I₃² × R₃ + I₄² × R₄ + I₅² × R₅
  "1j8xvzr": "Load power: P<sub>load</sub> = I₂² × R₂ + I₃² × R₃ + I₄² × R₄ + I₅² × R₅",
  // Chọn đề
  "z3srsx": "Choose a test",
  // Hai nhánh RC và RL mắc song song với nguồn áp
  "fkhkk8": "RC and RL branches in parallel with a voltage source",
  // Viết phương trình dòng điện trên các nhánh và V<sub>{0}</sub>. Tính P, Q, S của nguồn cấp cho các tải.
  "~vgssf8": "Write the current equations for each branch and V<sub>{0}</sub>. Find P, Q, S delivered by the source to the loads.",
  // Bước {0}. Nhận xét mạch
  "~1n1nf2i": "Step {0}. Analyse the circuit",
  // Nguồn áp dạng phức: U̇<sub>o</sub> = {0}∠{1}° V ⇒ biên độ U<sub>o</sub> = {2} V, góc pha φ<sub>u</sub> = {3}°.
  "~ae8i3k": "Voltage source in phasor form: U̇<sub>o</sub> = {0}∠{1}° V ⇒ amplitude U<sub>o</sub> = {2} V, phase angle φ<sub>u</sub> = {3}°.",
  // Cuộn cảm và tụ đã ghi sẵn tổng trở: Z<sub>C</sub> = −j{0} Ω; Z<sub>L</sub> = j{1} Ω.
  "~l4gulm": "The inductor and capacitor are already given as impedances: Z<sub>C</sub> = −j{0} Ω; Z<sub>L</sub> = j{1} Ω.",
  // Điện trở giữ nguyên giá trị (không đổi sang dạng cực): R<sub>{0}</sub> = {1} Ω; R<sub>{2}</sub> = {3} Ω.
  "~1sgd6h3": "Resistors keep their values (no conversion to polar form): R<sub>{0}</sub> = {1} Ω; R<sub>{2}</sub> = {3} Ω.",
  // Đề không cho ω nên phương trình tức thời viết theo ω.
  "4x3y04": "ω is not given, so the time-domain equations are written in terms of ω.",
  // Bước {0}. Tổng trở
  "~2mgyti": "Step {0}. Impedances",
  // Nhánh {0}: Z<sub>{1}</sub> = R<sub>{2}</sub> + Z<sub>C</sub> = {3} − j{4} Ω
  "~1vulxqm": "Branch {0}: Z<sub>{1}</sub> = R<sub>{2}</sub> + Z<sub>C</sub> = {3} − j{4} Ω",
  // Nhánh {0}: Z<sub>{1}</sub> = R<sub>{2}</sub> + Z<sub>L</sub> = {3} + j{4} Ω
  "~vbqp2o": "Branch {0}: Z<sub>{1}</sub> = R<sub>{2}</sub> + Z<sub>L</sub> = {3} + j{4} Ω",
  // Bước {0}. Dòng điện các nhánh và điện áp
  "~1f9xqlx": "Step {0}. Branch currents and voltages",
  // Dòng toàn mạch (dạng phức): İ<sub>o</sub> = <span class="xl-frac"><span class="xl-num">U̇<sub>o</sub></span><span class="xl-den">Z<sub>tđ</sub></span></span> = <span class="xl-frac"><span class="xl-num">{0}∠{1}°</span><span class="xl-den">{2}</span></span> = {3}∠{4}° A
  "~wtiudp": "Total current (phasor): İ<sub>o</sub> = <span class=\"xl-frac\"><span class=\"xl-num\">U̇<sub>o</sub></span><span class=\"xl-den\">Z<sub>eq</sub></span></span> = <span class=\"xl-frac\"><span class=\"xl-num\">{0}∠{1}°</span><span class=\"xl-den\">{2}</span></span> = {3}∠{4}° A",
  // Chọn vòng kín {0} → C → B → L → {1} → {2} (vòng trên hình), áp dụng K{3}:
  "~yekswb": "Take the closed loop {0} → C → B → L → {1} → {2} (the loop in the figure) and apply K{3}:",
  // Bước {0}. Phương trình tức thời
  "~ip4mdx": "Step {0}. Time-domain equations",
  // Mặc định viết theo sin: X∠φ ⇒ x(t) = X × sin(ωt + φ):
  "1vp9k3u": "By default write with sin: X∠φ ⇒ x(t) = X × sin(ωt + φ):",
  // Bước {0}. Công suất nguồn cấp cho tải
  "~1qk4vh5": "Step {0}. Power delivered by the source to the loads",
  // Hiệu dụng: U = <span class="xl-frac"><span class="xl-num">U<sub>o</sub></span><span class="xl-den">√{0}</span></span> = <span class="xl-frac"><span class="xl-num">{1}</span><span class="xl-den">√{2}</span></span> = {3}√{4} V ; I = <span class="xl-frac"><span class="xl-num">I<sub>o</sub></span><span class="xl-den">√{5}</span></span> = <span class="xl-frac"><span class="xl-num">{6}</span><span class="xl-den">√{7}</span></span> = {8}√{9} A
  "~110lnu3": "RMS values: U = <span class=\"xl-frac\"><span class=\"xl-num\">U<sub>o</sub></span><span class=\"xl-den\">√{0}</span></span> = <span class=\"xl-frac\"><span class=\"xl-num\">{1}</span><span class=\"xl-den\">√{2}</span></span> = {3}√{4} V ; I = <span class=\"xl-frac\"><span class=\"xl-num\">I<sub>o</sub></span><span class=\"xl-den\">√{5}</span></span> = <span class=\"xl-frac\"><span class=\"xl-num\">{6}</span><span class=\"xl-den\">√{7}</span></span> = {8}√{9} A",
  // Q = U × I × sinφ = {0}√{1} × {2}√{3} × sin({4}°) = {5} VAR (Q = {6}: tải thuần trở)
  "~84e08i": "Q = U × I × sinφ = {0}√{1} × {2}√{3} × sin({4}°) = {5} VAR (Q = {6}: purely resistive load)",
  // Kiểm tra: P = <span class="xl-frac"><span class="xl-num">{0}</span><span class="xl-den">{1}</span></span> × (R<sub>{2}</sub> × I<sub>{3}</sub>² + R<sub>{4}</sub> × I<sub>{5}</sub>²) = <span class="xl-frac"><span class="xl-num">{6}</span><span class="xl-den">{7}</span></span> × ({8} × ({9}√{10})² + {11} × ({12}√{13})²) = {14} W ✓
  "~aqiq6b": "Check: P = <span class=\"xl-frac\"><span class=\"xl-num\">{0}</span><span class=\"xl-den\">{1}</span></span> × (R<sub>{2}</sub> × I<sub>{3}</sub>² + R<sub>{4}</sub> × I<sub>{5}</sub>²) = <span class=\"xl-frac\"><span class=\"xl-num\">{6}</span><span class=\"xl-den\">{7}</span></span> × ({8} × ({9}√{10})² + {11} × ({12}√{13})²) = {14} W ✓",
  // Đáp số
  "s3xlcu": "Answers",
  // Nguồn dòng cấp cho hai nhánh RL và RC
  "1a9ob57": "Current source feeding an RL branch and an RC branch",
  // Viết phương trình dòng điện trên các nhánh và V<sub>x</sub>. Tính P, Q, S của nguồn cấp cho các tải.
  "t5xpwi": "Write the current equations for each branch and V<sub>x</sub>. Find P, Q, S delivered by the source to the loads.",
  // Nguồn dòng dạng phức: İ<sub>o</sub> = {0}∠{1}° A ⇒ biên độ I<sub>o</sub> = {2} A, góc pha φ<sub>i</sub> = {3}°.
  "~12yjsvc": "Current source in phasor form: İ<sub>o</sub> = {0}∠{1}° A ⇒ amplitude I<sub>o</sub> = {2} A, phase angle φ<sub>i</sub> = {3}°.",
  // Cuộn cảm và tụ đã ghi sẵn tổng trở: Z<sub>L</sub> = j{0} Ω; Z<sub>C</sub> = −j{1} Ω.
  "~n9nv4m": "The inductor and capacitor are already given as impedances: Z<sub>L</sub> = j{0} Ω; Z<sub>C</sub> = −j{1} Ω.",
  // Kiểm tra: P = <span class="xl-frac"><span class="xl-num">{0}</span><span class="xl-den">{1}</span></span> × (R<sub>{2}</sub> × I<sub>{3}</sub>² + R<sub>{4}</sub> × I<sub>{5}</sub>²) = <span class="xl-frac"><span class="xl-num">{6}</span><span class="xl-den">{7}</span></span> × ({8} × {9}² + {10} × {11}²) = {12} W ✓
  "~1o8ky6o": "Check: P = <span class=\"xl-frac\"><span class=\"xl-num\">{0}</span><span class=\"xl-den\">{1}</span></span> × (R<sub>{2}</sub> × I<sub>{3}</sub>² + R<sub>{4}</sub> × I<sub>{5}</sub>²) = <span class=\"xl-frac\"><span class=\"xl-num\">{6}</span><span class=\"xl-den\">{7}</span></span> × ({8} × {9}² + {10} × {11}²) = {12} W ✓",
  // Q = U × I × sinφ = {0}√{1} × {2} × sin(−{3}°) = −{4} VAR (Q &lt; {5}: tải mang tính dung)
  "~yidu4p": "Q = U × I × sinφ = {0}√{1} × {2} × sin(−{3}°) = −{4} VAR (Q &lt; {5}: capacitive load)",
  // Mạch chưa phức hoá: nguồn {0}cos{1}t, L và R nối tiếp, cụm R // C
  "~1drdvmp": "Circuit not yet in phasor form: source {0}cos{1}t, L and R in series, R // C group",
  // Viết phương trình dòng điện trên các nhánh và phương trình điện áp u<sub>c</sub>(t). Tính P, Q, S của nguồn cấp cho các tải.
  "1b621o1": "Write the current equations for each branch and the voltage equation u<sub>c</sub>(t). Find P, Q, S delivered by the source to the loads.",
  // Bước {0}. Phức hoá mạch
  "~1qczhnq": "Step {0}. Convert the circuit to phasors",
  // Nguồn u(t) = {0}cos{1}t V ⇒ biên độ U<sub>o</sub> = {2} V, góc pha φ<sub>u</sub> = {3}°, ω = {4} rad/s.
  "~1vwbdpt": "Source u(t) = {0}cos{1}t V ⇒ amplitude U<sub>o</sub> = {2} V, phase angle φ<sub>u</sub> = {3}°, ω = {4} rad/s.",
  // Ảnh phức của nguồn: U̇<sub>o</sub> = {0}∠{1}° V.
  "~1l7q7hz": "Phasor of the source: U̇<sub>o</sub> = {0}∠{1}° V.",
  // Cuộn cảm L = {0} H: Z<sub>L</sub> = jωL = j × {1} × {2} = j{3} Ω
  "~1f5suvi": "Inductor L = {0} H: Z<sub>L</sub> = jωL = j × {1} × {2} = j{3} Ω",
  // Tụ C = {0}/{1} F: Z<sub>C</sub> = <span class="xl-frac"><span class="xl-num">{2}</span><span class="xl-den">jωC</span></span> = <span class="xl-frac"><span class="xl-num">{3}</span><span class="xl-den">j × {4} × {5}/{6}</span></span> = −j{7} Ω
  "~zwgqfc": "Capacitor C = {0}/{1} F: Z<sub>C</sub> = <span class=\"xl-frac\"><span class=\"xl-num\">{2}</span><span class=\"xl-den\">jωC</span></span> = <span class=\"xl-frac\"><span class=\"xl-num\">{3}</span><span class=\"xl-den\">j × {4} × {5}/{6}</span></span> = −j{7} Ω",
  // Vẽ lại mạch sau khi phức hoá (mọi phần tử đổi thành tổng trở Ω):
  "o8nja3": "Redraw the circuit in phasor form (every element becomes an impedance in Ω):",
  // Hai nhánh song song: Z<sub>R{0}C</sub> = <span class="xl-frac"><span class="xl-num">R<sub>{1}</sub> × Z<sub>C</sub></span><span class="xl-den">R<sub>{2}</sub> + Z<sub>C</sub></span></span> = <span class="xl-frac"><span class="xl-num">{3} × (−j{4})</span><span class="xl-den">{5} + (−j{6})</span></span> = <span class="xl-frac"><span class="xl-num">−j{7}</span><span class="xl-den">{8} − j{9}</span></span> = {10} − j{11} Ω
  "~mm152f": "Two parallel branches: Z<sub>R{0}C</sub> = <span class=\"xl-frac\"><span class=\"xl-num\">R<sub>{1}</sub> × Z<sub>C</sub></span><span class=\"xl-den\">R<sub>{2}</sub> + Z<sub>C</sub></span></span> = <span class=\"xl-frac\"><span class=\"xl-num\">{3} × (−j{4})</span><span class=\"xl-den\">{5} + (−j{6})</span></span> = <span class=\"xl-frac\"><span class=\"xl-num\">−j{7}</span><span class=\"xl-den\">{8} − j{9}</span></span> = {10} − j{11} Ω",
  // Đề cho nguồn dạng cos nên viết theo cos: X∠φ ⇒ x(t) = X × cos(ωt + φ):
  "i1w660": "The source is given as cos, so write with cos: X∠φ ⇒ x(t) = X × cos(ωt + φ):",
  // Chọn bài
  "18qlrpw": "Choose a problem",
  // Sơ đồ mạch bài {0}
  "~jtuwgf": "Circuit diagram, problem {0}",
  // Mạch đã phức hoá bài {0}
  "~1nwhfmb": "Phasor-domain circuit, problem {0}",
  // <a class="backlink" href="/dientucoban">← Điện Tử Cơ Bản</a>
  "1557vlh": "<a class=\"backlink\" href=\"/dientucoban\">← Basic Electronics</a>",
  // Nhắc lại công thức
  "1oueiuf": "Formula recap",
  // Xem đáp án &amp; lời giải chi tiết
  "1pms6rr": "Show answers &amp; detailed solution",
  // Đúng {0}/{1} ô. Sửa ô đỏ hoặc mở lời giải.
  "~1efsmpk": "{0}/{1} boxes correct. Fix the red boxes or open the solution.",
  // Đề mẫu
  "13y71c9": "Sample problem",
  // Xem đáp án &amp; cách tính
  "osjq8b": "Show answers &amp; how to calculate",
  // mã
  "1rv8jr5": "code",
  // {0} câu trắc nghiệm · {1} đề
  "~1plunqr": "{0} multiple-choice questions · {1} tests",
  // ← Ôn tập
  "16pb72u": "← Review",
  // ← Về trang chủ
  "mekjkq": "← Back to home",
  // PHẦN {0}
  "~x7ie63": "PART {0}",
  // Ngày tạo: Chủ Nhật, {0}/{1}/{2}
  "~19rane1": "Created: Sunday, {0}/{1}/{2}",
  "~t8rlk6": "Created: Sunday, {0}/{1}/{2} · Updated: Sunday, {3}/{4}/{5}",
  "~6ecgi6": "Created: Sunday, {0}/{1}/{2} · Updated: Monday, {3}/{4}/{5}",
  "~1gqk2uv": "Created: Sunday, {0}/{1}/{2} · Updated: Tuesday, {3}/{4}/{5}",
  "~189wavc": "Created: Sunday, {0}/{1}/{2} · Updated: Wednesday, {3}/{4}/{5}",
  "~16ztb9e": "Created: Sunday, {0}/{1}/{2} · Updated: Thursday, {3}/{4}/{5}",
  "~187zabp": "Created: Sunday, {0}/{1}/{2} · Updated: Friday, {3}/{4}/{5}",
  "~ynliiq": "Created: Sunday, {0}/{1}/{2} · Updated: Saturday, {3}/{4}/{5}",
  "~12y4f01": "Created: Monday, {0}/{1}/{2}",
  "~120rini": "Created: Monday, {0}/{1}/{2} · Updated: Sunday, {3}/{4}/{5}",
  "~1fsikcm": "Created: Monday, {0}/{1}/{2} · Updated: Monday, {3}/{4}/{5}",
  "~ww4am7": "Created: Monday, {0}/{1}/{2} · Updated: Tuesday, {3}/{4}/{5}",
  "~1f0ctrk": "Created: Monday, {0}/{1}/{2} · Updated: Wednesday, {3}/{4}/{5}",
  "~1im3mai": "Created: Monday, {0}/{1}/{2} · Updated: Thursday, {3}/{4}/{5}",
  "~1qljjjx": "Created: Monday, {0}/{1}/{2} · Updated: Friday, {3}/{4}/{5}",
  "~y2ktgq": "Created: Monday, {0}/{1}/{2} · Updated: Saturday, {3}/{4}/{5}",
  // Ngày tạo: Thứ Ba, {0}/{1}/{2}
  "~w1p0ts": "Created: Tuesday, {0}/{1}/{2}",
  "~1u82ozj": "Created: Tuesday, {0}/{1}/{2} · Updated: Sunday, {3}/{4}/{5}",
  "~h7edft": "Created: Tuesday, {0}/{1}/{2} · Updated: Monday, {3}/{4}/{5}",
  "~22c9cm": "Created: Tuesday, {0}/{1}/{2} · Updated: Tuesday, {3}/{4}/{5}",
  "~1mn8f3p": "Created: Tuesday, {0}/{1}/{2} · Updated: Wednesday, {3}/{4}/{5}",
  // Ngày tạo: Thứ Ba, {0}/{1}/{2} · Cập nhật: Thứ Năm, {3}/{4}/{5}
  "~jvqcfl": "Created: Tuesday, {0}/{1}/{2} · Updated: Thursday, {3}/{4}/{5}",
  "~1er9dfu": "Created: Tuesday, {0}/{1}/{2} · Updated: Friday, {3}/{4}/{5}",
  "~ziid7t": "Created: Tuesday, {0}/{1}/{2} · Updated: Saturday, {3}/{4}/{5}",
  // Ngày tạo: Thứ Tư, {0}/{1}/{2}
  "~w0xd2v": "Created: Wednesday, {0}/{1}/{2}",
  "~9lpheo": "Created: Wednesday, {0}/{1}/{2} · Updated: Sunday, {3}/{4}/{5}",
  "~kvbfzc": "Created: Wednesday, {0}/{1}/{2} · Updated: Monday, {3}/{4}/{5}",
  "~18egfyp": "Created: Wednesday, {0}/{1}/{2} · Updated: Tuesday, {3}/{4}/{5}",
  "~1mjltxy": "Created: Wednesday, {0}/{1}/{2} · Updated: Wednesday, {3}/{4}/{5}",
  "~6i73to": "Created: Wednesday, {0}/{1}/{2} · Updated: Thursday, {3}/{4}/{5}",
  "~u43jqj": "Created: Wednesday, {0}/{1}/{2} · Updated: Friday, {3}/{4}/{5}",
  "~4szbuc": "Created: Wednesday, {0}/{1}/{2} · Updated: Saturday, {3}/{4}/{5}",
  // Ngày tạo: Thứ Năm, {0}/{1}/{2}
  "~1aqd65h": "Created: Thursday, {0}/{1}/{2}",
  "~snvzd6": "Created: Thursday, {0}/{1}/{2} · Updated: Sunday, {3}/{4}/{5}",
  "~10laxwi": "Created: Thursday, {0}/{1}/{2} · Updated: Monday, {3}/{4}/{5}",
  "~16dxajn": "Created: Thursday, {0}/{1}/{2} · Updated: Tuesday, {3}/{4}/{5}",
  "~1tuyz5o": "Created: Thursday, {0}/{1}/{2} · Updated: Wednesday, {3}/{4}/{5}",
  "~1q8oi9y": "Created: Thursday, {0}/{1}/{2} · Updated: Thursday, {3}/{4}/{5}",
  "~1ym140h": "Created: Thursday, {0}/{1}/{2} · Updated: Friday, {3}/{4}/{5}",
  "~o7y452": "Created: Thursday, {0}/{1}/{2} · Updated: Saturday, {3}/{4}/{5}",
  // Ngày tạo: Thứ Sáu, {0}/{1}/{2}
  "~18ligv6": "Created: Friday, {0}/{1}/{2}",
  // Ngày tạo: Thứ Sáu, {0}/{1}/{2} · Cập nhật: Chủ Nhật, {3}/{4}/{5}
  "~p7izhh": "Created: Friday, {0}/{1}/{2} · Updated: Sunday, {3}/{4}/{5}",
  "~m6781j": "Created: Friday, {0}/{1}/{2} · Updated: Monday, {3}/{4}/{5}",
  "~kcfodg": "Created: Friday, {0}/{1}/{2} · Updated: Tuesday, {3}/{4}/{5}",
  "~4hbpm7": "Created: Friday, {0}/{1}/{2} · Updated: Wednesday, {3}/{4}/{5}",
  "~hea7cn": "Created: Friday, {0}/{1}/{2} · Updated: Thursday, {3}/{4}/{5}",
  "~l45f5o": "Created: Friday, {0}/{1}/{2} · Updated: Friday, {3}/{4}/{5}",
  "~1b5om7r": "Created: Friday, {0}/{1}/{2} · Updated: Saturday, {3}/{4}/{5}",
  // Ngày tạo: Thứ Bảy, {0}/{1}/{2}
  "~6iei2l": "Created: Saturday, {0}/{1}/{2}",
  // Ngày tạo: Thứ Bảy, {0}/{1}/{2} · Cập nhật: Chủ Nhật, {3}/{4}/{5}
  "~yblcma": "Created: Saturday, {0}/{1}/{2} · Updated: Sunday, {3}/{4}/{5}",
  "~1bs8qq2": "Created: Saturday, {0}/{1}/{2} · Updated: Monday, {3}/{4}/{5}",
  "~bvb7yz": "Created: Saturday, {0}/{1}/{2} · Updated: Tuesday, {3}/{4}/{5}",
  "~atejmc": "Created: Saturday, {0}/{1}/{2} · Updated: Wednesday, {3}/{4}/{5}",
  "~9gz5f2": "Created: Saturday, {0}/{1}/{2} · Updated: Thursday, {3}/{4}/{5}",
  "~3xvreh": "Created: Saturday, {0}/{1}/{2} · Updated: Friday, {3}/{4}/{5}",
  "~18ehnvy": "Created: Saturday, {0}/{1}/{2} · Updated: Saturday, {3}/{4}/{5}",
  // <a href="/" aria-current="page">Trang chủ</a><a href="/hoctap">Học tập</a><a href="/ontap">Ôn tập</a><a href="/duan">Dự án</a><a href="/hoatdong">Hoạt động</a><a href="/event">Bài viết</a><a href="/diemdanh">Điểm danh</a>
  "13ztgy1": "<a href=\"/\" aria-current=\"page\">Home</a><a href=\"/hoctap\">Study</a><a href=\"/ontap\">Review</a><a href=\"/duan\">Projects</a><a href=\"/hoatdong\">Activities</a><a href=\"/event\">Articles</a><a href=\"/diemdanh\">Attendance</a>",
  // <a href="/">Trang chủ</a><a href="/hoctap" aria-current="page">Học tập</a><a href="/ontap">Ôn tập</a><a href="/duan">Dự án</a><a href="/hoatdong">Hoạt động</a><a href="/event">Bài viết</a><a href="/diemdanh">Điểm danh</a>
  "15vts93": "<a href=\"/\">Home</a><a href=\"/hoctap\" aria-current=\"page\">Study</a><a href=\"/ontap\">Review</a><a href=\"/duan\">Projects</a><a href=\"/hoatdong\">Activities</a><a href=\"/event\">Articles</a><a href=\"/diemdanh\">Attendance</a>",
  // <a href="/">Trang chủ</a><a href="/hoctap">Học tập</a><a href="/ontap" aria-current="page">Ôn tập</a><a href="/duan">Dự án</a><a href="/hoatdong">Hoạt động</a><a href="/event">Bài viết</a><a href="/diemdanh">Điểm danh</a>
  "25qoj7": "<a href=\"/\">Home</a><a href=\"/hoctap\">Study</a><a href=\"/ontap\" aria-current=\"page\">Review</a><a href=\"/duan\">Projects</a><a href=\"/hoatdong\">Activities</a><a href=\"/event\">Articles</a><a href=\"/diemdanh\">Attendance</a>",
  // <a href="/">Trang chủ</a><a href="/hoctap">Học tập</a><a href="/ontap">Ôn tập</a><a href="/duan" aria-current="page">Dự án</a><a href="/hoatdong">Hoạt động</a><a href="/event">Bài viết</a><a href="/diemdanh">Điểm danh</a>
  "18vamen": "<a href=\"/\">Home</a><a href=\"/hoctap\">Study</a><a href=\"/ontap\">Review</a><a href=\"/duan\" aria-current=\"page\">Projects</a><a href=\"/hoatdong\">Activities</a><a href=\"/event\">Articles</a><a href=\"/diemdanh\">Attendance</a>",
  // <a href="/">Trang chủ</a><a href="/hoctap">Học tập</a><a href="/ontap">Ôn tập</a><a href="/duan">Dự án</a><a href="/hoatdong" aria-current="page">Hoạt động</a><a href="/event">Bài viết</a><a href="/diemdanh">Điểm danh</a>
  "8fpzht": "<a href=\"/\">Home</a><a href=\"/hoctap\">Study</a><a href=\"/ontap\">Review</a><a href=\"/duan\">Projects</a><a href=\"/hoatdong\" aria-current=\"page\">Activities</a><a href=\"/event\">Articles</a><a href=\"/diemdanh\">Attendance</a>",
  // <a href="/">Trang chủ</a><a href="/hoctap">Học tập</a><a href="/ontap">Ôn tập</a><a href="/duan">Dự án</a><a href="/hoatdong">Hoạt động</a><a href="/event" aria-current="page">Bài viết</a><a href="/diemdanh">Điểm danh</a>
  "hce8d9": "<a href=\"/\">Home</a><a href=\"/hoctap\">Study</a><a href=\"/ontap\">Review</a><a href=\"/duan\">Projects</a><a href=\"/hoatdong\">Activities</a><a href=\"/event\" aria-current=\"page\">Articles</a><a href=\"/diemdanh\">Attendance</a>",
  // <a href="/">Trang chủ</a><a href="/hoctap">Học tập</a><a href="/ontap">Ôn tập</a><a href="/duan">Dự án</a><a href="/hoatdong">Hoạt động</a><a href="/event">Bài viết</a><a href="/diemdanh" aria-current="page">Điểm danh</a>
  "hsnq59": "<a href=\"/\">Home</a><a href=\"/hoctap\">Study</a><a href=\"/ontap\">Review</a><a href=\"/duan\">Projects</a><a href=\"/hoatdong\">Activities</a><a href=\"/event\">Articles</a><a href=\"/diemdanh\" aria-current=\"page\">Attendance</a>",
  // Thông tin học tập - Ôn tập ngành Điện Điện Tử
  "1qmmd42": "Study and review for Electrical and Electronics Engineering",
  // lớp DDT{0}C trường Cao đẳng Kỹ thuật Cao Thắng
  "~mfjwum": "class DDT{0}C, Cao Thang Technical College",
  // <strong>CĐ ĐĐT {0}C</strong> là lớp thuộc ngành Công nghệ Kỹ thuật Điện – Điện tử, khóa {1}, Trường Cao đẳng Kỹ thuật Cao Thắng, với hơn {2} sinh viên. Ngành đào tạo theo hướng thực hành, giúp sinh viên nắm nền tảng lý thuyết và làm được việc thật: từ phân tích mạch, lắp ráp, đo kiểm đến lập trình và vận hành thiết bị điện – điện tử.
  "~vubp8a": "<strong>CĐ ĐĐT {0}C</strong> is a class in the Electrical – Electronics Engineering Technology program, intake {1}, at Cao Thang Technical College, with more than {2} students. The program is practice-oriented, helping students master the theoretical foundations and do real work: from circuit analysis, assembly and testing to programming and operating electrical and electronic equipment.",
  // Bài mới
  "dt8fqt": "New posts",
  // <a href="/ontap">Ôn tập</a><span class="sep" aria-hidden="true"> › </span><a class="c-sub" href="/dientucoban">Điện Tử Cơ Bản</a>
  "103k74i": "<a href=\"/ontap\">Review</a><span class=\"sep\" aria-hidden=\"true\"> › </span><a class=\"c-sub\" href=\"/dientucoban\">Basic Electronics</a>",
  // Bài tập mạch ứng dụng diode (Chương {0})
  "~q2z4al": "Exercises: diode application circuits (Chapter {0})",
  // Mới
  "27b9gw": "New",
  // {0} bài tính dòng, áp qua diode và LED, tự chấm có lời giải.
  "~1er7sze": "{0} problems on current and voltage through diodes and LEDs, self-checking with solutions.",
  // <a href="/hoctap">Học tập</a><span class="sep" aria-hidden="true"> › </span><a class="c-sub" href="/namnhat-dientucoban">Điện tử Cơ bản</a>
  "yf8sr9": "<a href=\"/hoctap\">Study</a><span class=\"sep\" aria-hidden=\"true\"> › </span><a class=\"c-sub\" href=\"/namnhat-dientucoban\">Basic Electronics</a>",
  // Chương {0}: Chất bán dẫn và diode
  "~8i0hv1": "Chapter {0}: Semiconductors and Diodes",
  // Bán dẫn, mối nối P-N, các loại diode, chỉnh lưu và ổn áp Zener.
  "1eupx9": "Semiconductors, the P-N junction, diode types, rectification and Zener regulation.",
  // Chương {0}: Linh kiện thụ động
  "~1oijx8w": "Chapter {0}: Passive Components",
  // Điện trở, tụ điện, cuộn cảm: cách đọc mã và cách ghép mạch.
  "1xhvvsq": "Resistors, capacitors, inductors: reading their codes and combining them in circuits.",
  // Chương {0}: Các khái niệm cơ bản
  "~tt763g": "Chapter {0}: Fundamental Concepts",
  // Điện áp, dòng điện, định luật Ohm và các loại pin.
  "17drvwf": "Voltage, current, Ohm's law and battery types.",
  // <a href="/duan">Dự án</a>
  "1pzb1fn": "<a href=\"/duan\">Projects</a>",
  // Hạ áp {0}V xuống {1}V bằng mạch Buck, có hình động và cách làm.
  "~1qry7aq": "Step {0}V down to {1}V with a Buck converter, with animations and build steps.",
  // IC {0} phát xung nháy LED, kèm máy tính tần số R{1} R{2} C.
  "~1r909o2": "{0} IC pulse generator blinking an LED, with an R{1} R{2} C frequency calculator.",
  // Tăng áp {0}V lên {1}V bằng mạch Boost, có hình động và cách ráp.
  "~1veairm": "Step {0}V up to {1}V with a Boost converter, with animations and assembly steps.",
  // <a href="/hoctap">Học tập</a><span class="sep" aria-hidden="true"> › </span><a class="c-sub" href="/namnhat-lythuyetmach">Lý thuyết mạch</a>
  "s75dcx": "<a href=\"/hoctap\">Study</a><span class=\"sep\" aria-hidden=\"true\"> › </span><a class=\"c-sub\" href=\"/namnhat-lythuyetmach\">Circuit Theory</a>",
  // Chương {0}: Khái niệm cơ bản về mạch điện
  "~1o2nfpg": "Chapter {0}: Basic Circuit Concepts",
  // Điện áp, dòng điện, công suất và định luật Kirchhoff K{0}, K{1}.
  "~nrdtzs": "Voltage, current, power and Kirchhoff's laws K{0}, K{1}.",
  // Nhận bài mới qua email
  "1l4u3ub": "Get new posts by email",
  // Nhập email, có bài mới trang sẽ gửi thư báo cho bạn.
  "adj9cq": "Enter your email and the site will notify you when there is a new post.",
  // Đăng ký
  "1gxjxh5": "Subscribe",
  // Năm nhất<span class="badge-new">Mới</span>
  "19nu72t": "Year 1<span class=\"badge-new\">New</span>",
  // Tài liệu học tập năm nhất.
  "aml283": "Year 1 study materials.",
  // <b>Mới cập nhật: </b>Điện tử Cơ bản › Chương {0}: Chất bán dẫn và diode
  "~11nbwry": "<b>Recently updated: </b>Basic Electronics › Chapter {0}: Semiconductors and Diodes",
  // Điện Tử Cơ Bản<span class="badge-new">Mới</span>
  "azwky4": "Basic Electronics<span class=\"badge-new\">New</span>",
  // Bài tập trắc nghiệm môn Điện Tử Cơ Bản.
  "15l3f3o": "Multiple-choice exercises for Basic Electronics.",
  // <b>Mới cập nhật: </b>Bài tập mạch ứng dụng diode (Chương {0})
  "~wdjyku": "<b>Recently updated: </b>Exercises: diode application circuits (Chapter {0})",
  // Bài tập môn Lý Thuyết Mạch.
  "dwq4sj": "Circuit Theory exercises.",
  // Bài tập môn Đo Lường Điện.
  "4v71jn": "Electrical Measurement exercises.",
  // Bài tập và đề thi môn Anh Văn.
  "1x29lwf": "English exercises and tests.",
  // Mạch hạ áp Buck {0}V xuống {1}V<span class="badge-new">Mới</span>
  "~10tw5ti": "Buck step-down converter {0}V to {1}V<span class=\"badge-new\">New</span>",
  // Vì sao không hạ áp bằng biến trở, nguyên lý mạch Buck có hình minh hoạ động, công thức D, so sánh với Boost và cách làm với LM{0}.
  "~jq5rd6": "Why not step down with a potentiometer, how a Buck converter works with animated figures, the duty-cycle formula D, a comparison with Boost, and how to build one with the LM{0}.",
  // IC {0} phát xung<span class="badge-new">Mới</span>
  "~10cie15": "{0} IC pulse generator<span class=\"badge-new\">New</span>",
  // IC {0} là gì, sơ đồ chân, mạch phát xung nháy LED, công thức tần số và D, kèm máy tính R{1} R{2} C. Dùng làm bộ tạo xung cho mạch Boost.
  "~1t9wawj": "What the {0} IC is, its pinout, an LED-blinking pulse circuit, the frequency and D formulas, plus an R{1} R{2} C calculator. Used as the pulse generator for the Boost converter.",
  // Mạch tăng áp Boost {0}V lên {1}V<span class="badge-new">Mới</span>
  "~1tcklmy": "Boost step-up converter {0}V to {1}V<span class=\"badge-new\">New</span>",
  // Nguyên lý mạch Boost có hình minh hoạ động: cuộn cảm, công tắc MOSFET, diode, tụ. Công thức chu kỳ làm việc và cách tự ráp.
  "98ul07": "How a Boost converter works, with animated figures: inductor, MOSFET switch, diode, capacitor. The duty-cycle formula and how to build it yourself.",
  // Thi đua chuyên cần: ai đi học đúng giờ nhiều buổi nhất tháng {0}.
  "~1tkb8y6": "Attendance challenge: who arrived on time for the most sessions in month {0}.",
  // Ghi chú tham quan Vietnam Energy Week {0}<span class="badge-new">Mới</span>
  "~14bormm": "Notes from visiting Vietnam Energy Week {0}<span class=\"badge-new\">New</span>",
  // {0} gian hàng năng lượng, data center, HVAC kèm ảnh, và kiến thức kỹ thuật rút ra: biến tần, cảm biến, MCCB, cáp trung thế.
  "~1aon22f": "{0} booths on energy, data centers and HVAC with photos, plus the technical lessons learned: VFDs, sensors, MCCBs, medium-voltage cables.",
  // Năm nhất
  "ph6es": "Year 1",
  // <a class="backlink" href="/hoctap">← Học tập</a> <a class="backlink" href="/">← Về trang chủ</a>
  "vp2xfa": "<a class=\"backlink\" href=\"/hoctap\">← Study</a> <a class=\"backlink\" href=\"/\">← Back to home</a>",
  // Thực hành<span class="badge-new">Mới</span>
  "gkd23o": "Practice<span class=\"badge-new\">New</span>",
  // Video hướng dẫn thực hành.
  "14vfgv9": "Practical training videos.",
  // Lý thuyết mạch<span class="badge-new">Mới</span>
  "qm0qh": "Circuit Theory<span class=\"badge-new\">New</span>",
  // Tài liệu môn Lý thuyết mạch.
  "1nyj9mv": "Circuit Theory materials.",
  // <b>Mới cập nhật: </b>Chương {0}: Mạch xác lập điều hoà
  "~zpd8s": "<b>Recently updated: </b>Chapter {0}: Sinusoidal Steady-State Circuits",
  // Điện tử Cơ bản<span class="badge-new">Mới</span>
  "lmnnyk": "Basic Electronics<span class=\"badge-new\">New</span>",
  // Tài liệu môn Điện tử Cơ bản.
  "mkt2cg": "Basic Electronics materials.",
  // <b>Mới cập nhật: </b>Chương {0}: Chất bán dẫn và diode
  "~19zaydo": "<b>Recently updated: </b>Chapter {0}: Semiconductors and Diodes",
  // Đo lường điện<span class="badge-new">Mới</span>
  "77cplm": "Electrical Measurement<span class=\"badge-new\">New</span>",
  // Tài liệu môn Đo lường điện.
  "18j45vw": "Electrical Measurement materials.",
  // Lý thuyết mạch
  "ahyja8": "Circuit Theory",
  // Chương {0}: Khái niệm cơ bản về mạch điện<span class="badge-new">Mới</span>
  "~lxkbr9": "Chapter {0}: Basic Circuit Concepts<span class=\"badge-new\">New</span>",
  // Điện thế, điện áp, dòng điện, nguồn điện, điện trở, điện dung, tụ điện, cuộn cảm, công suất và định luật Kirchhoff K{0}, K{1} — có hình minh hoạ, ví dụ giải mẫu và video.
  "~1yknrzn": "Electric potential, voltage, current, sources, resistance, capacitance, capacitors, inductors, power and Kirchhoff's laws K{0}, K{1} — with illustrations, worked examples and videos.",
  // Chương {0}: Mạch xác lập điều hoà<span class="badge-new">Mới</span>
  "~1dby6is": "Chapter {0}: Sinusoidal Steady-State Circuits<span class=\"badge-new\">New</span>",
  // Đại lượng điều hoà, góc lệch pha, trị hiệu dụng, số phức và ảnh phức, trở kháng – dẫn nạp, Ohm và Kirchhoff dạng phức, công suất P, Q, S — có hình minh hoạ và ví dụ giải mẫu.
  "16o6fxs": "Sinusoidal quantities, phase difference, RMS values, complex numbers and phasors, impedance – admittance, Ohm and Kirchhoff in phasor form, power P, Q, S — with illustrations and worked examples.",
  // Điện tử Cơ bản
  "1k1ijct": "Basic Electronics",
  // Chương {0}: Các khái niệm cơ bản<span class="badge-new">Mới</span>
  "~1en20t": "Chapter {0}: Fundamental Concepts<span class=\"badge-new\">New</span>",
  // Electron, điện áp, dòng điện, trở kháng, định luật Ohm, các loại pin, ghép pin nối tiếp/song song, dung lượng mAh – Wh và tỉ lệ C, có mô phỏng và trắc nghiệm.
  "5h5aue": "Electrons, voltage, current, impedance, Ohm's law, battery types, series/parallel battery packs, capacity in mAh – Wh and C-rate, with simulations and a quiz.",
  // Chương {0}: Linh kiện thụ động<span class="badge-new">Mới</span>
  "~1g0kah5": "Chapter {0}: Passive Components<span class=\"badge-new\">New</span>",
  // Điện trở, mã màu {0} và {1} vạch, điện trở dán SMD, ghép nối tiếp song song, hạn dòng LED, chia áp, pull-up, tụ điện, mã tụ và cuộn cảm; có mô phỏng và trắc nghiệm.
  "~4cn77n": "Resistors, {0}- and {1}-band color codes, SMD resistors, series and parallel combinations, LED current limiting, voltage dividers, pull-ups, capacitors, capacitor codes and inductors; with simulations and a quiz.",
  // Chương {0}: Chất bán dẫn và diode<span class="badge-new">Mới</span>
  "~17n4t98": "Chapter {0}: Semiconductors and Diodes<span class=\"badge-new\">New</span>",
  // Bán dẫn Si, Ge, loại N và P, mối nối P-N, phân cực thuận nghịch, các loại diode, thiết kế mạch LED, chỉnh lưu bán kỳ, ổn áp Zener và LED {0} đoạn; có mô phỏng và trắc nghiệm.
  "~1pekn07": "Si and Ge semiconductors, N and P types, the P-N junction, forward and reverse bias, diode types, LED circuit design, half-wave rectification, Zener regulation and {0}-segment LEDs; with simulations and a quiz.",
  // Đo lường điện
  "144kv": "Electrical Measurement",
  // Thực hành
  "1ecx0ut": "Practice",
  // Hướng dẫn lắp mạch và đo mạch điện trở nối tiếp và song song
  "1cw87ep": "How to assemble and measure series and parallel resistor circuits",
  // Video ráp điện trở nối tiếp, song song và dùng đồng hồ đo kiểm tra điện trở tương đương.
  "b0ldsf": "Video: wiring resistors in series and in parallel and using a multimeter to check the equivalent resistance.",
  // Quy trình làm một board mạch đơn giản
  "1x169pd": "Process for making a simple circuit board",
  // Video các bước làm board mạch đơn giản: vẽ mạch, làm mạch in, khoan, hàn linh kiện và kiểm tra.
  "yyi8gn": "Video of the steps for making a simple circuit board: drawing the circuit, making the PCB, drilling, soldering components and testing.",
  // Hướng dẫn lắp mạch khởi động động cơ thuận nghịch và giới hạn hành trình
  "1lnyoqp": "How to wire a forward-reverse motor starter with travel limits",
  // Video lắp mạch đảo chiều động cơ (thuận nghịch) có khoá chéo và công tắc hành trình giới hạn.
  "15a9vcb": "Video: wiring a motor reversing (forward-reverse) circuit with interlocking and limit switches.",
  // Hướng dẫn lắp mạch khởi động động cơ trực tiếp có đèn báo - môn Thực hành Điện cơ bản
  "1wlc8a7": "How to wire a direct-on-line motor starter with indicator lamps – Basic Electrical Practice",
  // Video lắp mạch khởi động trực tiếp động cơ bằng contactor, nút nhấn và đèn báo trạng thái.
  "iwzo0k": "Video: wiring a direct-on-line motor starter with a contactor, push buttons and status lamps.",
  // Hướng dẫn lắp mạch dây điện đèn luân phiên (CS{0}) - môn Thực hành Điện cơ bản
  "~nnz39l": "How to wire alternating lamps (CS{0}) – Basic Electrical Practice",
  // Video lắp mạch đèn luân phiên dùng công tắc {0} cực (CS{1}): sơ đồ đi dây và các bước đấu nối thực tế.
  "~q08ios": "Video: wiring alternating lamps with a {0}-way switch (CS{1}): wiring diagram and the actual connection steps.",
  // {0} bài giải bằng ảnh phức có lời giải từng bước — phức hoá mạch, tổng trở, dòng nhánh, phương trình tức thời, công suất P, Q, S.
  "~ukmqmc": "{0} problems solved with phasors and step-by-step solutions — converting to phasors, impedance, branch currents, time-domain equations, power P, Q, S.",
  // {0} đề, mỗi đề {1} bài Kirchhoff nâng cao + {2} bài mạch xác lập điều hoà, có lời giải từng bước.
  "~1rxvoh9": "{0} tests, each with {1} advanced Kirchhoff problems + {2} sinusoidal steady-state problems, with step-by-step solutions.",
  // Bài tập tự chấm định luật Kirchhoff K{0}, K{1}: chọn đề, nhập dòng nhánh rồi kiểm tra. Có bài nâng cao giải chi tiết kèm công suất.
  "~2fgkrc": "Self-checking exercises on Kirchhoff's laws K{0}, K{1}: choose a test, enter the branch currents and check. Includes advanced problems with detailed solutions and power.",
  // Điện Tử Cơ Bản
  "1o5uhkt": "Basic Electronics",
  // Bài tập mạch ứng dụng diode (Chương {0})<span class="badge-new">Mới</span>
  "~5cbk0c": "Exercises: diode application circuits (Chapter {0})<span class=\"badge-new\">New</span>",
  // Diode, LED nối tiếp và song song, diode phân cực nghịch: tính IR, ID, VO và chọn điện trở — {0} bài (diode Si, Ge và LED), tự chấm và lời giải từng bước.
  "~11ogmrk": "Diodes, LEDs in series and parallel, reverse-biased diodes: find IR, ID, VO and choose resistors — {0} problems (Si, Ge diodes and LEDs), self-checking with step-by-step solutions.",
  // Mã {0} số, {1} số, chữ R, dải mΩ đến MΩ — {2} đề, {3} câu, tự động chấm điểm.
  "~lithbu": "{0}-digit, {1}-digit and R codes, from mΩ to MΩ — {2} tests, {3} questions, automatic scoring.",
  // Bài tập Định lý phân áp &amp; phân dòng trong mạch
  "1re0pa1": "Exercises: voltage divider &amp; current divider rules",
  // {0} bài nâng cao có sơ đồ mạch — Rtđ, dòng nhánh, điện áp VO, vòng màu; tự chấm và lời giải chi tiết.
  "~adl2v3": "{0} advanced problems with circuit diagrams — Req, branch currents, VO voltages, color bands; self-checking with detailed solutions.",
  // Mã {0}–{1} số, mã {2} số, sai số J/K, đổi pF – nF – µF — {3} đề, {4} câu, tự động chấm điểm.
  "~1u2sg4a": "{0}–{1}-digit codes, {2}-digit codes, J/K tolerance, converting pF – nF – µF — {3} tests, {4} questions, automatic scoring.",
  // Bài tập tính vòng màu điện trở chân cắm công suất nhỏ
  "15hbihr": "Exercises: color bands of small through-hole resistors",
  // Trắc nghiệm mã màu điện trở chuẩn IEC {0} — {1} đề, {2} câu, tự động chấm điểm.
  "~q9emyn": "Resistor color code quiz (IEC {0} standard) — {1} tests, {2} questions, automatic scoring.",
  // ĐL
  "9qzgs9": "EM",
  // {0} đề: Câu {1} mạch Shunt (riêng rẽ + vạn năng) và Câu {2} mạch điện trở phụ (riêng rẽ + vạn năng), có lời giải từng bước.
  "~1fk7e9v": "{0} tests: Question {1} shunt circuits (single-range + multi-range) and Question {2} series-multiplier circuits (single-range + multi-range), with step-by-step solutions.",
  // Thi trắc nghiệm tiếng Anh đầu vào — {0} đề, mỗi đề {1} câu, tự động chấm điểm.
  "~mzhucv": "English placement multiple-choice test — {0} tests, {1} questions each, automatic scoring.",
  // <a class="backlink" href="/hoatdong">← Hoạt động</a>
  "1954cqo": "<a class=\"backlink\" href=\"/hoatdong\">← Activities</a>",
  // Thi đua chuyên cần · Tháng {0}/{1}
  "~1giln8d": "Attendance challenge · Month {0}/{1}",
  // Bảng xếp hạng
  "18xhoa": "Leaderboard",
  // Chưa tải được bảng chuyên cần. Thử tải lại trang.
  "19li6fg": "Could not load the attendance board. Try reloading the page.",
  // Chủ Nhật, {0}/{1}/{2}
  "~d786dr": "Sunday, {0}/{1}/{2}",
  "~15bkdgn": "Monday, {0}/{1}/{2}",
  "~588evq": "Tuesday, {0}/{1}/{2}",
  "~1gjbz95": "Wednesday, {0}/{1}/{2}",
  "~1mbfzkb": "Thursday, {0}/{1}/{2}",
  "~465eoc": "Friday, {0}/{1}/{2}",
  // Thứ Bảy, {0}/{1}/{2}
  "~lzogpn": "Saturday, {0}/{1}/{2}",
  // Bước {0}. Dòng điện các nhánh
  "~108xoch": "Step {0}. Branch currents",
  // Xem lời giải
  "7kuf2l": "View solution",
  // Lời giải
  "1ccw2p3": "Solution",
  // Giải:
  "hz426h": "Solution:",
  // Đóng ✕
  "f3ai30": "Close ✕",
  // Hình phóng to
  "haadvi": "Enlarged figure",
  // Tự làm ra giấy trước, rồi bấm <strong>Xem lời giải</strong> để đối chiếu.
  "186ublk": "Work it out on paper first, then press <strong>View solution</strong> to compare.",
  // Điện trở nối tiếp với cụm L // (R nối tiếp C)
  "1tu6mlx": "A resistor in series with the group L // (R in series with C)",
  // Viết phương trình dòng điện trên các nhánh. Tính P, Q, S của nguồn cấp cho các tải.
  "15d6ckb": "Write the current equations for each branch. Find P, Q, S delivered by the source to the loads.",
  // Email chưa đúng định dạng.
  "d24dsx": "The email format is invalid.",
  // Đang gửi…
  "mi4i48": "Sending…",
  // Đã gửi email xác nhận.
  "mojahm": "Confirmation email sent.",
  // Không gửi được. Thử lại sau.
  "eegl9f": "Could not send. Try again later.",
  // Mất kết nối. Thử lại sau.
  "12x2fyp": "Connection lost. Try again later.",
  // Bạn thử quá nhiều lần. Đợi vài phút rồi thử lại.
  "10c18go": "Too many attempts. Wait a few minutes and try again.",
  // Email không hợp lệ.
  "1ikgs3n": "Invalid email.",
  // Email này đã đăng ký rồi.
  "1toi75l": "This email is already subscribed.",
  // Email xác nhận đã được gửi tới địa chỉ này. Kiểm tra hộp thư (cả mục Spam), hoặc thử lại sau 1 giờ.
  "~pyblvr": "A confirmation email has already been sent to this address. Check your inbox (including Spam), or try again in {0} hour.",
  // Hôm nay trang đã gửi quá nhiều email xác nhận. Thử lại vào ngày mai.
  "1mnf16t": "The site has sent too many confirmation emails today. Try again tomorrow.",
  // Danh sách đã đầy. Liên hệ lớp để được hỗ trợ.
  "w9kty8": "The list is full. Contact the class for help.",
  // Đã gửi email xác nhận. Mở hộp thư (cả mục Spam/Quảng cáo) và bấm link để hoàn tất.
  "y2gtj6": "Confirmation email sent. Open your inbox (including Spam/Promotions) and click the link to finish.",
  // Nền sáng
  "vxz0qx": "Light theme",
  // Chuyển sang nền sáng
  "196hq8": "Switch to light theme",
  // Chưa có bài mới.
  "1updcv7": "No new posts yet.",
  // {0} buổi
  "~td58gc": "{0} sessions",
  // + {0} bạn khác
  "~1yrzhi8": "+ {0} more",
  // Chưa có buổi đúng giờ nào trong tháng {0}. Bạn sẽ là người đầu tiên?
  "~3k701d": "No on-time sessions yet in month {0}. Will you be the first?",
  // Chưa có buổi đúng giờ nào trong tháng này. Bạn sẽ là người đầu tiên?
  "s0cu1s": "No on-time sessions yet this month. Will you be the first?",
  // Xếp theo số buổi đi học đúng giờ trong tháng {0}; bằng nhau thì theo tên.
  "~97wflh": "Ranked by the number of on-time sessions in month {0}; ties are sorted by name.",
  // Xếp theo số buổi đi học đúng giờ trong tháng này; bằng nhau thì theo tên.
  "4pjcv0": "Ranked by the number of on-time sessions this month; ties are sorted by name.",
  // SÁNG
  "v094za": "ON",
  // TẮT
  "1qikc9": "OFF",
  // CAO
  "dyhp0y": "HIGH",
  // THẤP
  "bp2fl9": "LOW",
  // cao 12V
  "~1rqlp6": "high {0}V",
  // thấp 0V
  "~79sewg": "low {0}V",
  // ▶ Tự chạy
  "1xsjzll": "▶ Auto run",
  // ⏸ Dừng
  "1t3qzjj": "⏸ Pause",
  // Tự chạy
  "1fbihff": "Auto run",
  // Tạm dừng
  "fxvxox": "Pause",
  // Nhập số dương cho R1, R2 và C.
  "~1xtsp5o": "Enter positive numbers for R{0}, R{1} and C.",
  // Tải 0,5 A
  "~13urnuy": "Load {0} A",
  // Chọn dòng tải
  "3t4j2m": "Choose the load current",
  // Bước 1: đóng công tắc
  "~8lsbko": "Step {0}: close the switch",
  // Bước 2: mở công tắc
  "~twlqj5": "Step {0}: open the switch",
  // Hãy nhập đủ đáp án rồi bấm Kiểm tra.
  "1w48f94": "Enter all the answers, then press Check.",
  // Hãy nhập đáp án rồi bấm Kiểm tra.
  "1ncdgm4": "Enter your answers, then press Check.",
  // Chọn đề, nhập đáp án rồi bấm Kiểm tra. Đáp án có thể âm (dòng thực tế ngược chiều giả định): nhập số, ví dụ {0} hoặc -{1}. Tab <strong>Bài nâng cao</strong> có lời giải chi tiết K{2}, K{3} và công suất.
  "~49gicu": "Choose a test, enter your answers and press Check. Answers may be negative (the actual current flows opposite to the assumed direction): enter a number, e.g. {0} or -{1}. The <strong>Advanced problems</strong> tab has detailed K{2}, K{3} solutions including power.",
  // Bài nâng cao
  "1xu74sg": "Advanced problems",
  // Đã đúng {0}/{1} bài
  "~1n2fr4f": "{0}/{1} problems correct",
  // Chạm vào hình để phóng to
  "18u0jkc": "Tap the figure to enlarge",
  // Tính I và điện áp từng trở.
  "1ff7h8y": "Find I and the voltage across each resistor.",
  // Tính I và công suất tiêu thụ từng trở.
  "1yfxc8y": "Find I and the power dissipated in each resistor.",
  // Tính I và công suất tiêu thụ.
  "1gl0nw7": "Find I and the power dissipated.",
  // Viết hệ K{0},K{1} và tính I₁,I₂,I₃. (I₁ vào, I₂ và I₃ ra khỏi nút B.)
  "~1x7hh9k": "Write the K{0}, K{1} system and find I₁, I₂, I₃. (I₁ enters, I₂ and I₃ leave node B.)",
  // Viết hệ K{0},K{1} và tính I₁,I₂,I₃. (I₁, I₂ giả định ra; I₃ giả định vào nút B.)
  "~1bvc2wo": "Write the K{0}, K{1} system and find I₁, I₂, I₃. (I₁, I₂ assumed leaving; I₃ assumed entering node B.)",
  // Viết hệ K{0},K{1} và tính I₁,I₂,I₃. (I₁ vào, I₂ ra, I₃ giả định vào nút B.)
  "~fqozuj": "Write the K{0}, K{1} system and find I₁, I₂, I₃. (I₁ enters, I₂ leaves, I₃ assumed entering node B.)",
  // Viết hệ K{0},K{1} và tính I₁,I₂,I₃. (I₁ giả định ra, I₂ vào, I₃ ra khỏi nút B.)
  "~5jz0c": "Write the K{0}, K{1} system and find I₁, I₂, I₃. (I₁ assumed leaving, I₂ enters, I₃ leaves node B.)",
  // Viết hệ K{0},K{1} và tính I₁,I₂,I₃. (I₁ giả định ra; I₂, I₃ giả định vào nút B.)
  "~14mtyo0": "Write the K{0}, K{1} system and find I₁, I₂, I₃. (I₁ assumed leaving; I₂, I₃ assumed entering node B.)",
  // Viết hệ K{0},K{1} và tính I₁,I₂,I₃.
  "~515ojz": "Write the K{0}, K{1} system and find I₁, I₂, I₃.",
  // Chưa đúng, thử lại hoặc mở lời giải.
  "1ld99wh": "Not right yet, try again or open the solution.",
  // Đúng rồi!
  "1jedr31": "Correct!",
  // Đúng hết rồi!
  "1gd2mag": "All correct!",
  // Đúng 3/9 ô, còn 2 ô trống. Sửa ô đỏ hoặc mở lời giải.
  "~1xd87j": "{0}/{1} boxes correct, {2} still empty. Fix the red boxes or open the solution.",
  // Đúng 3/9 ô, còn 2 ô trống. Sửa ô đỏ hoặc mở đáp án.
  "~4hb5re": "{0}/{1} boxes correct, {2} still empty. Fix the red boxes or open the answers.",
  // Đúng 3/9 câu, còn 2 câu trống. Sửa ô đỏ hoặc mở đáp án.
  "~1ys4xda": "{0}/{1} questions correct, {2} still empty. Fix the red boxes or open the answers.",
  // Theo vở · VD1
  "~1v32reh": "From the class notes · Ex. {0}",
  // Phát triển từ VD3
  "~nloc49": "Extended from Ex. {0}",
  // Phát triển: diode Ge
  "2k14m7": "Extension: Ge diode",
  // 3 số / 4 số
  "~cxbw33": "{0} digits / {1} digits",
  // 3 ký tự
  "~3mp7gm": "{0} characters",
  // DDT26C Cao Thắng
  "~b0ercv": "DDT26C Cao Thang",
  // Bài tập mạch ứng dụng diode
  "1s0kjvz": "Exercises: diode application circuits",
  // Đề ôn kiểm tra 1 tiết Lý thuyết Mạch
  "~gps9cm": "Circuit Theory {0}-period test review",
  // Đề ôn kiểm tra 1 tiết Đo lường điện
  "~ggnret": "Electrical Measurement {0}-period test review",
  // Bài tập điện trở dán SMD
  "ern82u": "Exercises: SMD resistors",
  // Chương 2: Mạch xác lập điều hoà
  "~9386k5": "Chapter {0}: Sinusoidal Steady-State Circuits",
  // Ghi chú Vietnam Energy Week 2026
  "~1y30ht0": "Notes from Vietnam Energy Week {0}",
  // Bài tập Kirchhoff Law 1,2
  "~1jfrt05": "Kirchhoff's Laws {0} exercises",
  // Lịch thực hành điện tử cơ bản
  "2qn7q6": "Basic electronics lab schedule",
  // Bài tập đọc mã tụ điện
  "1bnebum": "Exercises: capacitor codes",
  // Bài tập phân áp & phân dòng
  "12633nh": "Exercises: voltage & current dividers",
  // Bài Tập Tính Vòng Màu Điện Trở
  "lgo8vs": "Exercises: resistor color bands",
  "~1nxrmvu": "<strong>Step {0} – Charge.</strong> The memory switch is <span class=\"k-out\">HIGH</span>: pin {1} outputs {2}V, the LED is on. The drain valve (pin {3}) is open, so current flows <span class=\"k-cap\">+{4}V → R{5} → R{6} → capacitor C</span>. The capacitor voltage rises.",
  "~19wmpy5": "<strong>Step {0} – Flip down.</strong> The capacitor voltage reaches {1}V ({2}/{3} of {4}V). The upper comparator “presses” the memory switch to <span class=\"k-out\">LOW</span>: pin {5} drops to {6}V, the LED turns off, and the drain valve at pin {7} closes to ground.",
  "~1l1ocfj": "<strong>Step {0} – Discharge.</strong> The valve at pin {1} is grounded, so the capacitor <span class=\"k-dis\">discharges through R{2} → pin {3} → ground</span>. The capacitor voltage falls. The upper comparator has let go, but the switch stays LOW – that is the “memory”. The discharge current does not pass through R{4}, so it discharges faster than it charges.",
  "~ryd09b": "<strong>Step {0} – Flip up.</strong> The capacitor voltage drops to {1}V ({2}/{3} of {4}V). The lower comparator “presses” the memory switch back to <span class=\"k-out\">HIGH</span>: pin {5} rises to {6}V, the LED turns on again and the drain valve opens. Back to Step {7}, and so on forever.",
  "~aovcra": "<strong>Step {0} – On.</strong> The switch connects the {1}V source. Current <span class=\"k-on\">(blue)</span> flows {2}V → switch → inductor → load and back to the source. The inductor holds the current back, stopping it from surging, and stores energy in its magnetic field.",
  "~ulzlfy": "<strong>Step {0} – Off.</strong> The source is cut off, but the inductor will not let the current stop suddenly: it releases its energy, pushing current <span class=\"k-off\">(orange)</span> on through the load and back up through the diode. The load stays powered even while the source is off."
};
