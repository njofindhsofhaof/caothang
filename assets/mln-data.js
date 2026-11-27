/* Bai tap Ly thuyet mach Chuong 3: dong mat luoi (bai 1, 2) va dien the nut (bai 3, 4).
   - Mo hinh mach (method, loops/nodes, resistors, vsources, isources, vbranches, currents): xem assets/mln-calc.js.
     Dap an cac o nhap tinh tu mo hinh, khong ghi tay.
   - draw: so do ve bang assets/mln-svg.js
     ["w", x1, y1, x2, y2] day | ["r", x, y, "h"|"v", nhan, vi tri nhan?] dien tro
     ["v", x, y, huong cuc + (u/d/l/r), nhan, vi tri nhan?] nguon ap | ["i", x, y, huong mui ten, nhan, vi tri nhan?] nguon dong
     ["a", x, y, huong, nhan] chieu dong nhanh | ["n", x, y, ten] nut | ["k", cx, cy, ten] dong mat luoi (chieu kim dong ho)
     vi tri nhan: "l" trai, "t" tren, "b" duoi (mac dinh: phan tu doc ghi ben phai, phan tu ngang ghi ben tren)
   - steps: [{ title, lines }]; "_x" trong dong = chi so duoi (I_m1, V_A, P_tải). */
window.MLN_SETS = [
  { id: 1, title: "Dòng mắt lưới", problems: [1, 2] },
  { id: 2, title: "Điện thế nút", problems: [3, 4] }
];

window.MLN_PROBLEMS = [
  {
    id: 1,
    method: "mesh",
    title: "Hai nguồn áp, ba mắt lưới",
    ask: "Dùng phương pháp dòng mắt lưới tính dòng điện I₁ … I₅ trong các nhánh. Kiểm tra lại bằng K1 và cân bằng công suất.",
    loops: 3,
    resistors: [
      { sym: "R_1", value: 6, loops: [0] },
      { sym: "R_2", value: 2, loops: [0, 1] },
      { sym: "R_3", value: 12, loops: [1, 2] },
      { sym: "R_4", value: 4, loops: [2] }
    ],
    vsources: [
      { sym: "E_1", value: 28, loop: 0, sign: 1 },
      { sym: "E_2", value: 8, loop: 1, sign: 1 }
    ],
    currents: [
      { name: "I_1", of: "R_1" }, { name: "I_2", of: "R_2" }, { name: "I_3", of: "E_2" },
      { name: "I_4", of: "R_3" }, { name: "I_5", of: "R_4" }
    ],
    size: [560, 260],
    draw: [
      ["w", 40, 40, 460, 40], ["w", 40, 220, 460, 220], ["w", 40, 40, 40, 220], ["w", 180, 40, 180, 220], ["w", 320, 40, 320, 220], ["w", 460, 40, 460, 220],
      ["v", 40, 130, "u", "E₁ = 28 V"], ["r", 110, 40, "h", "R₁ = 6 Ω"], ["r", 180, 130, "v", "R₂ = 2 Ω"],
      ["v", 250, 40, "r", "E₂ = 8 V"], ["r", 320, 130, "v", "R₃ = 12 Ω"], ["r", 460, 130, "v", "R₄ = 4 Ω"],
      ["a", 155, 40, "r", "I₁"], ["a", 180, 182, "d", "I₂"], ["a", 293, 40, "r", "I₃"], ["a", 320, 182, "d", "I₄"], ["a", 460, 182, "d", "I₅"],
      ["n", 180, 40, ""], ["n", 320, 40, ""], ["n", 180, 220, ""], ["n", 320, 220, ""],
      ["k", 110, 176, "Iₘ₁"], ["k", 250, 176, "Iₘ₂"], ["k", 390, 176, "Iₘ₃"]
    ],
    steps: [
      { title: "Bước 1. Chọn dòng mắt lưới", lines: [
        "Mạch có 3 mắt lưới. Chọn 3 dòng mắt lưới I_m1, I_m2, I_m3 cùng chiều kim đồng hồ (hình).",
        "E₁ và E₂ đều đẩy dòng cùng chiều mắt của nó nên mang dấu + ở vế phải."
      ] },
      { title: "Bước 2. Viết phương trình K2 cho từng mắt", lines: [
        "Mắt 1: (R_1 + R_2)I_m1 − R_2·I_m2 = E_1 ⇒ (6 + 2)I_m1 − 2I_m2 = 28 ⇒ 8I_m1 − 2I_m2 = 28   (1)",
        "Mắt 2: (R_2 + R_3)I_m2 − R_2·I_m1 − R_3·I_m3 = E_2 ⇒ 14I_m2 − 2I_m1 − 12I_m3 = 8   (2)",
        "Mắt 3: (R_3 + R_4)I_m3 − R_3·I_m2 = 0 ⇒ 16I_m3 − 12I_m2 = 0   (3)"
      ] },
      { title: "Bước 3. Giải hệ phương trình", lines: [
        "Từ (3): I_m3 = 12/16 × I_m2 = 0,75I_m2",
        "Thay vào (2): 14I_m2 − 2I_m1 − 9I_m2 = 8 ⇒ −2I_m1 + 5I_m2 = 8   (4)",
        "Từ (1): I_m1 = (28 + 2I_m2)/8 ; thay vào (4): 5I_m2 − (28 + 2I_m2)/4 = 8 ⇒ 20I_m2 − 28 − 2I_m2 = 32 ⇒ 18I_m2 = 60",
        "⇒ I_m2 = 10/3 ≈ 3,33 A ; I_m1 = (28 + 20/3)/8 = 13/3 ≈ 4,33 A ; I_m3 = 0,75 × 10/3 = 2,5 A"
      ] },
      { title: "Bước 4. Dòng điện các nhánh", lines: [
        "Nhánh chỉ thuộc 1 mắt: I_1 = I_m1 = 4,33 A ; I_3 = I_m2 = 3,33 A ; I_5 = I_m3 = 2,5 A",
        "Nhánh chung 2 mắt: I_2 = I_m1 − I_m2 = 13/3 − 10/3 = 1 A ; I_4 = I_m2 − I_m3 = 10/3 − 2,5 ≈ 0,83 A"
      ] },
      { title: "Bước 5. Kiểm tra", lines: [
        "K1 tại nút trên R_2: I_1 = I_2 + I_3 ⇒ 4,33 = 1 + 3,33 ✓",
        "K1 tại nút trên R_3: I_3 = I_4 + I_5 ⇒ 3,33 = 0,83 + 2,5 ✓",
        "P_nguồn = E_1 × I_1 + E_2 × I_3 = 28 × 13/3 + 8 × 10/3 = 121,33 + 26,67 = 148 W",
        "P_tải = R_1 × I_1² + R_2 × I_2² + R_3 × I_4² + R_4 × I_5² = 6 × 4,33² + 2 × 1² + 12 × 0,83² + 4 × 2,5² = 112,67 + 2 + 8,33 + 25 = 148 W",
        "⇒ P_nguồn = P_tải ✓"
      ] }
    ]
  },
  {
    id: 2,
    method: "mesh",
    title: "Hai nguồn áp và một nguồn dòng",
    ask: "Dùng phương pháp dòng mắt lưới tính dòng điện I₁ … I₅ trong các nhánh. Kiểm tra lại bằng K1 và cân bằng công suất.",
    loops: 3,
    resistors: [
      { sym: "R_1", value: 5, loops: [0] },
      { sym: "R_2", value: 4, loops: [1] },
      { sym: "R_3", value: 20, loops: [0, 1] },
      { sym: "R_4", value: 7, loops: [0, 2] },
      { sym: "R_5", value: 1, loops: [1, 2] }
    ],
    vsources: [
      { sym: "E_1", value: 240, loop: 0, sign: 1 },
      { sym: "E_2", value: 84, loop: 1, sign: 1 }
    ],
    isources: [{ sym: "J", value: 16, loop: 2 }],
    currents: [
      { name: "I_1", of: "R_1" }, { name: "I_2", of: "R_2" }, { name: "I_3", of: "R_3" },
      { name: "I_4", of: "R_4" }, { name: "I_5", of: "R_5" }
    ],
    size: [680, 350],
    draw: [
      ["w", 110, 40, 550, 40], ["w", 110, 170, 550, 170], ["w", 110, 300, 550, 300],
      ["w", 110, 40, 110, 300], ["w", 550, 40, 550, 300], ["w", 330, 40, 330, 170],
      ["v", 110, 105, "u", "E₁ = 240 V", "l"], ["v", 550, 105, "d", "E₂ = 84 V"],
      ["r", 220, 40, "h", "R₁ = 5 Ω"], ["r", 440, 40, "h", "R₂ = 4 Ω"], ["r", 330, 105, "v", "R₃ = 20 Ω"],
      ["r", 220, 170, "h", "R₄ = 7 Ω"], ["r", 440, 170, "h", "R₅ = 1 Ω"],
      ["i", 330, 300, "l", "J = 16 A", "b"],
      ["a", 285, 40, "r", "I₁"], ["a", 375, 40, "r", "I₂"], ["a", 330, 150, "d", "I₃"], ["a", 160, 170, "l", "I₄"], ["a", 380, 170, "l", "I₅"],
      ["n", 330, 40, ""], ["n", 330, 170, ""], ["n", 110, 170, ""], ["n", 550, 170, ""],
      ["k", 200, 100, "Iₘ₁"], ["k", 465, 100, "Iₘ₂"], ["k", 330, 232, "Iₘ₃"]
    ],
    steps: [
      { title: "Bước 1. Chọn dòng mắt lưới", lines: [
        "Mạch có 3 mắt lưới, chọn I_m1, I_m2, I_m3 cùng chiều kim đồng hồ (hình).",
        "Mắt 3 có nguồn dòng J = 16 A nằm riêng và cùng chiều mắt ⇒ I_m3 = J = 16 A, không cần viết K2 cho mắt 3.",
        "E₁ (+ ở trên) và E₂ (+ ở dưới) đều đẩy dòng cùng chiều mắt của nó nên mang dấu +."
      ] },
      { title: "Bước 2. Viết phương trình K2 cho mắt 1 và mắt 2", lines: [
        "Mắt 1: (R_1 + R_3 + R_4)I_m1 − R_3·I_m2 − R_4·I_m3 = E_1 ⇒ (5 + 20 + 7)I_m1 − 20I_m2 − 7 × 16 = 240",
        "⇒ 32I_m1 − 20I_m2 = 352   (1)",
        "Mắt 2: (R_2 + R_3 + R_5)I_m2 − R_3·I_m1 − R_5·I_m3 = E_2 ⇒ (4 + 20 + 1)I_m2 − 20I_m1 − 1 × 16 = 84",
        "⇒ −20I_m1 + 25I_m2 = 100   (2)"
      ] },
      { title: "Bước 3. Giải hệ phương trình", lines: [
        "Từ (2): I_m1 = (25I_m2 − 100)/20 = 1,25I_m2 − 5",
        "Thay vào (1): 32 × (1,25I_m2 − 5) − 20I_m2 = 352 ⇒ 40I_m2 − 160 − 20I_m2 = 352 ⇒ 20I_m2 = 512",
        "⇒ I_m2 = 25,6 A ; I_m1 = 1,25 × 25,6 − 5 = 27 A ; I_m3 = 16 A"
      ] },
      { title: "Bước 4. Dòng điện các nhánh", lines: [
        "I_1 = I_m1 = 27 A ; I_2 = I_m2 = 25,6 A",
        "I_3 = I_m1 − I_m2 = 27 − 25,6 = 1,4 A",
        "I_4 = I_m1 − I_m3 = 27 − 16 = 11 A ; I_5 = I_m2 − I_m3 = 25,6 − 16 = 9,6 A"
      ] },
      { title: "Bước 5. Kiểm tra", lines: [
        "K1 tại nút trên R_3: I_1 = I_3 + I_2 ⇒ 27 = 1,4 + 25,6 ✓",
        "K1 tại nút dưới R_3: I_3 + I_5 = I_4 ⇒ 1,4 + 9,6 = 11 ✓",
        "K1 tại nút trái giữa: I_4 + J = I_1 ⇒ 11 + 16 = 27 ✓",
        "Điện áp trên nguồn dòng (đầu + phía mũi tên), K2 cho mắt 3: U_J = R_4(I_m3 − I_m1) + R_5(I_m3 − I_m2) = 7 × (−11) + 1 × (−9,6) = −86,6 V",
        "U_J âm ⇒ nguồn dòng đang nhận công suất: P_J = U_J × J = −86,6 × 16 = −1385,6 W",
        "P_nguồn = E_1 × I_1 + E_2 × I_2 + U_J × J = 240 × 27 + 84 × 25,6 − 1385,6 = 6480 + 2150,4 − 1385,6 = 7244,8 W",
        "P_tải = 5 × 27² + 4 × 25,6² + 20 × 1,4² + 7 × 11² + 1 × 9,6² = 3645 + 2621,44 + 39,2 + 847 + 92,16 = 7244,8 W",
        "⇒ P_nguồn = P_tải ✓"
      ] }
    ]
  },
  {
    id: 3,
    method: "nodal",
    title: "Hai nguồn dòng, hai nút",
    ask: "Chọn C làm nút gốc. Dùng phương pháp điện thế nút tính V_A, V_B và dòng điện I₁ … I₄. Kiểm tra lại bằng K1 và cân bằng công suất.",
    nodes: ["A", "B"],
    resistors: [
      { sym: "R_1", value: 10, nodes: [0] },
      { sym: "R_2", value: 5, nodes: [0] },
      { sym: "R_3", value: 2, nodes: [1, 0] },
      { sym: "R_4", value: 4, nodes: [1] }
    ],
    isources: [
      { sym: "J_1", value: 6, from: 0, to: 1 },
      { sym: "J_2", value: 3, from: null, to: 1 }
    ],
    currents: [
      { name: "I_1", of: "R_1" }, { name: "I_2", of: "R_2" }, { name: "I_3", of: "R_3" }, { name: "I_4", of: "R_4" }
    ],
    size: [600, 310],
    draw: [
      ["w", 40, 120, 510, 120], ["w", 40, 270, 510, 270],
      ["w", 40, 120, 40, 270], ["w", 170, 120, 170, 270], ["w", 390, 120, 390, 270], ["w", 510, 120, 510, 270],
      ["w", 230, 120, 230, 46], ["w", 230, 46, 390, 46], ["w", 390, 46, 390, 120],
      ["r", 40, 195, "v", "R₁ = 10 Ω"], ["r", 170, 195, "v", "R₂ = 5 Ω"], ["r", 310, 120, "h", "R₃ = 2 Ω", "b"],
      ["r", 390, 195, "v", "R₄ = 4 Ω"], ["i", 310, 46, "r", "J₁ = 6 A", "t"], ["i", 510, 195, "u", "J₂ = 3 A"],
      ["a", 40, 152, "d", "I₁"], ["a", 170, 152, "d", "I₂"], ["a", 362, 120, "l", "I₃"], ["a", 390, 152, "d", "I₄"],
      ["n", 230, 120, "A"], ["n", 390, 120, "B"], ["n", 280, 270, "C (gốc, 0 V)"]
    ],
    steps: [
      { title: "Bước 1. Chọn nút gốc và ẩn", lines: [
        "Mạch có 3 nút A, B, C. Chọn C làm gốc: V_C = 0 V. Ẩn là V_A, V_B.",
        "Vế trái: điện dẫn riêng của nút × điện thế nút − điện dẫn chung × điện thế nút kia. Vế phải: tổng nguồn dòng đổ vào nút (đi ra thì mang dấu −)."
      ] },
      { title: "Bước 2. Viết phương trình cho nút A và nút B", lines: [
        "Nút A (J_1 đi ra khỏi A): (1/R_1 + 1/R_2 + 1/R_3)V_A − (1/R_3)V_B = −J_1",
        "⇒ (1/10 + 1/5 + 1/2)V_A − (1/2)V_B = −6 ⇒ 0,8V_A − 0,5V_B = −6   (1)",
        "Nút B (J_1 và J_2 đổ vào B): −(1/R_3)V_A + (1/R_3 + 1/R_4)V_B = J_1 + J_2",
        "⇒ −(1/2)V_A + (1/2 + 1/4)V_B = 6 + 3 ⇒ −0,5V_A + 0,75V_B = 9   (2)"
      ] },
      { title: "Bước 3. Giải hệ phương trình", lines: [
        "Nhân (1) với 1,5: 1,2V_A − 0,75V_B = −9 ; cộng với (2): 0,7V_A = 0 ⇒ V_A = 0 V",
        "Thay vào (2): 0,75V_B = 9 ⇒ V_B = 12 V"
      ] },
      { title: "Bước 4. Dòng điện các nhánh (định luật Ohm)", lines: [
        "I_1 = V_A/R_1 = 0/10 = 0 A ; I_2 = V_A/R_2 = 0/5 = 0 A",
        "I_3 = (V_B − V_A)/R_3 = (12 − 0)/2 = 6 A (chiều từ B về A)",
        "I_4 = V_B/R_4 = 12/4 = 3 A"
      ] },
      { title: "Bước 5. Kiểm tra", lines: [
        "K1 tại nút A: I_3 = J_1 + I_1 + I_2 ⇒ 6 = 6 + 0 + 0 ✓",
        "K1 tại nút B: J_1 + J_2 = I_3 + I_4 ⇒ 6 + 3 = 6 + 3 ✓",
        "Công suất nguồn dòng = điện áp trên nguồn × dòng nguồn: P_J1 = U_BA × J_1 = (12 − 0) × 6 = 72 W ; P_J2 = U_BC × J_2 = 12 × 3 = 36 W",
        "P_nguồn = 72 + 36 = 108 W ; P_tải = R_3 × I_3² + R_4 × I_4² = 2 × 6² + 4 × 3² = 72 + 36 = 108 W (R_1, R_2 không có dòng)",
        "⇒ P_nguồn = P_tải ✓"
      ] }
    ]
  },
  {
    id: 4,
    method: "nodal",
    title: "Hai nhánh nguồn áp nối tiếp điện trở, một nguồn dòng",
    ask: "Chọn nút dưới làm gốc. Dùng phương pháp điện thế nút tính V_A, V_B và dòng điện I₁ … I₅. Kiểm tra lại bằng K1 và cân bằng công suất.",
    nodes: ["A", "B"],
    resistors: [
      { sym: "R_3", value: 1, nodes: [0, 1] },
      { sym: "R_4", value: 2, nodes: [0] },
      { sym: "R_5", value: 2, nodes: [1] }
    ],
    isources: [{ sym: "J", value: 4, from: null, to: 0 }],
    vbranches: [
      { sym: "E_1", value: 24, rSym: "R_1", r: 2, node: 0 },
      { sym: "E_2", value: 16, rSym: "R_2", r: 1, node: 1 }
    ],
    currents: [
      { name: "I_1", of: "E_1" }, { name: "I_2", of: "E_2" }, { name: "I_3", of: "R_3" },
      { name: "I_4", of: "R_4" }, { name: "I_5", of: "R_5" }
    ],
    size: [680, 290],
    draw: [
      ["w", 40, 60, 570, 60], ["w", 40, 240, 570, 240],
      ["w", 40, 60, 40, 240], ["w", 180, 60, 180, 240], ["w", 290, 60, 290, 240], ["w", 430, 60, 430, 240], ["w", 570, 60, 570, 240],
      ["v", 40, 150, "u", "E₁ = 24 V"], ["r", 110, 60, "h", "R₁ = 2 Ω"], ["r", 180, 150, "v", "R₄ = 2 Ω"],
      ["i", 290, 150, "u", "J = 4 A"], ["r", 360, 60, "h", "R₃ = 1 Ω"], ["r", 430, 150, "v", "R₅ = 2 Ω"],
      ["r", 500, 60, "h", "R₂ = 1 Ω"], ["v", 570, 150, "u", "E₂ = 16 V"],
      ["a", 155, 60, "r", "I₁"], ["a", 180, 200, "d", "I₄"], ["a", 405, 60, "r", "I₃"], ["a", 430, 200, "d", "I₅"], ["a", 545, 60, "l", "I₂"],
      ["n", 235, 60, "A"], ["n", 430, 60, "B"], ["n", 305, 240, "gốc (0 V)"]
    ],
    steps: [
      { title: "Bước 1. Chọn nút gốc và biến đổi nguồn", lines: [
        "Chọn nút dưới làm gốc (0 V), ẩn là V_A, V_B.",
        "Nhánh nguồn áp nối tiếp điện trở đổi thành nguồn dòng song song điện trở đó:",
        "E_1 nối tiếp R_1 ⇒ nguồn dòng E_1/R_1 = 24/2 = 12 A đổ vào A, song song R_1 = 2 Ω",
        "E_2 nối tiếp R_2 ⇒ nguồn dòng E_2/R_2 = 16/1 = 16 A đổ vào B, song song R_2 = 1 Ω"
      ] },
      { title: "Bước 2. Viết phương trình cho nút A và nút B", lines: [
        "Nút A: (1/R_1 + 1/R_4 + 1/R_3)V_A − (1/R_3)V_B = E_1/R_1 + J",
        "⇒ (1/2 + 1/2 + 1)V_A − V_B = 12 + 4 ⇒ 2V_A − V_B = 16   (1)",
        "Nút B: −(1/R_3)V_A + (1/R_3 + 1/R_5 + 1/R_2)V_B = E_2/R_2",
        "⇒ −V_A + (1 + 1/2 + 1)V_B = 16 ⇒ −V_A + 2,5V_B = 16   (2)"
      ] },
      { title: "Bước 3. Giải hệ phương trình", lines: [
        "(1) + 2 × (2): −V_B + 5V_B = 16 + 32 ⇒ 4V_B = 48 ⇒ V_B = 12 V",
        "Thay vào (1): 2V_A = 16 + 12 ⇒ V_A = 14 V"
      ] },
      { title: "Bước 4. Dòng điện các nhánh", lines: [
        "I_3 = (V_A − V_B)/R_3 = (14 − 12)/1 = 2 A ; I_4 = V_A/R_4 = 14/2 = 7 A ; I_5 = V_B/R_5 = 12/2 = 6 A",
        "Lưu ý: nhánh có nguồn áp phải tính lại trên mạch gốc (không dùng nguồn dòng tương đương 12 A, 16 A, vì dòng qua R_1, R_2 trong mạch đã biến đổi khác dòng thật):",
        "I_1 = (E_1 − V_A)/R_1 = (24 − 14)/2 = 5 A ; I_2 = (E_2 − V_B)/R_2 = (16 − 12)/1 = 4 A"
      ] },
      { title: "Bước 5. Kiểm tra", lines: [
        "K1 tại nút A: I_1 + J = I_3 + I_4 ⇒ 5 + 4 = 2 + 7 ✓",
        "K1 tại nút B: I_3 + I_2 = I_5 ⇒ 2 + 4 = 6 ✓",
        "P_nguồn = E_1 × I_1 + E_2 × I_2 + V_A × J = 24 × 5 + 16 × 4 + 14 × 4 = 120 + 64 + 56 = 240 W",
        "P_tải = R_1 × I_1² + R_2 × I_2² + R_3 × I_3² + R_4 × I_4² + R_5 × I_5² = 2 × 5² + 1 × 4² + 1 × 2² + 2 × 7² + 2 × 6² = 50 + 16 + 4 + 98 + 72 = 240 W",
        "⇒ P_nguồn = P_tải ✓"
      ] }
    ]
  }
];
