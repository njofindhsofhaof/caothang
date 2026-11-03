/* 3 de on kiem tra 1 tiet Ly thuyet mach. Moi de: dc = 1 bai Kirchhoff nang cao (cung dang voi assets/kirchhoff-worked.js,
   doi so lieu, loi giai ghi tay) + ac = 1 bai mach xac lap dieu hoa (cung dang voi assets/xlhd-data.js, loi giai tinh tu dong). */
window.DKT_SETS = [
  {
    id: 1,
    dc: {
      id: "D1-1",
      ask: "a) Tính dòng điện I₁, I₂, I₃. b) Tính công suất nguồn và công suất tải.",
      size: [430, 260],
      draw: [
        ["w", 40, 40, 380, 40], ["w", 40, 220, 380, 220], ["w", 40, 40, 40, 220], ["w", 220, 40, 220, 220], ["w", 380, 40, 380, 220],
        ["i", 40, 130, "6 A"],
        ["r", 130, 40, "h", "R₁ = 2 Ω"], ["r", 300, 40, "h", "R₂ = 4 Ω"], ["r", 220, 130, "v", "R₃ = 2 Ω"],
        ["a", 185, 40, "r", "I₁"], ["a", 250, 40, "r", "I₂"], ["a", 220, 78, "d", "I₃"],
        ["n", 220, 40, "A"], ["n", 220, 220, "B"],
        ["k", 125, 172, "V₁"], ["k", 305, 172, "V₂"]
      ],
      steps: [
        { title: "a) Dòng điện các nhánh", lines: [
          "Nguồn dòng 6 A mắc nối tiếp R₁ nên I₁ = 6 A.",
          "Áp dụng K1 tại nút A: I₁ − I₂ − I₃ = 0 ⇒ I₂ + I₃ = 6   (1)",
          "Áp dụng K2 cho vòng V₂: U₂ − U₃ = 0 ⇒ I₂ × R₂ − I₃ × R₃ = 0 ⇒ 4I₂ − 2I₃ = 0   (2)",
          "Từ (1), (2) ⇒ I₂ = 2 A, I₃ = 4 A"
        ] },
        { title: "b) Công suất", lines: [
          "Áp dụng K2 cho vòng V₁: −U_N + U_R1 + U_R3 = 0",
          "⇒ U_N = U_R1 + U_R3 = I₁ × R₁ + I₃ × R₃ = 6 × 2 + 4 × 2 = 20 V",
          "Công suất nguồn: P_N = U_N × I_N = 20 × 6 = 120 W",
          "Công suất tải: P_tải = I₁² × R₁ + I₂² × R₂ + I₃² × R₃ = 6² × 2 + 2² × 4 + 4² × 2 = 72 + 16 + 32 = 120 W",
          "⇒ Công suất nguồn bằng công suất tải."
        ] }
      ]
    },
    ac: {
      id: 2,
      title: "Hai nhánh RC và RL mắc song song với nguồn áp",
      source: { type: "V", mag: 100, deg: 0, symbol: "ac", label: "100∠0° V" },
      totalLabel: "I_o",
      branches: [
        { current: "I_1", elems: [{ kind: "R", value: 3, label: "3 Ω" }, { kind: "C", x: 4, label: "−j4 Ω", mark: "U_C" }], nodes: { 0: "1" } },
        { current: "I_2", elems: [{ kind: "R", value: 4, label: "4 Ω" }, { kind: "L", x: 3, label: "j3 Ω", mark: "U_L" }], nodes: { 0: "2" } }
      ],
      diff: { name: "V_12", from: [0, 0], to: [1, 0], loop: true },
      voltages: [{
        name: "V_12",
        loop: ["Chọn vòng kín 1 → C → B → L → 2 → 1 (vòng trên hình), áp dụng K2:", "^V_12 + ^U_L − ^U_C = 0"],
        text: "⇒ ^V_12 = ^U_C − ^U_L = ^I_1 × Z_C − ^I_2 × Z_L = ^I_1 × (−j4) − ^I_2 × (j3)",
        terms: [{ branch: 0, elem: 1, sign: 1 }, { branch: 1, elem: 1, sign: -1 }]
      }],
      asks: "Viết phương trình dòng điện trên các nhánh và V_12. Tính P, Q, S của nguồn cấp cho các tải."
    }
  },
  {
    id: 2,
    dc: {
      id: "D2-1",
      ask: "a) Tính dòng điện I₁, I₂, I₃, I₄. b) Tính công suất nguồn và công suất tải.",
      size: [540, 260],
      draw: [
        ["w", 40, 40, 480, 40], ["w", 40, 220, 480, 220], ["w", 40, 40, 40, 220], ["w", 200, 40, 200, 220], ["w", 330, 40, 330, 220], ["w", 480, 40, 480, 220],
        ["v", 40, 130, "24 V"],
        ["r", 120, 40, "h", "R₁ = 2 Ω"], ["r", 200, 130, "v", "R₂ = 6 Ω"], ["r", 330, 130, "v", "R₃ = 12 Ω"], ["r", 410, 40, "h", "R₄ = 4 Ω"],
        ["a", 170, 40, "r", "I₁"], ["a", 200, 78, "d", "I₂"], ["a", 330, 78, "d", "I₃"], ["a", 360, 40, "r", "I₄"],
        ["n", 200, 40, "A"],
        ["k", 115, 172, "V₁"], ["k", 268, 172, "V₂"], ["k", 405, 172, "V₃"]
      ],
      steps: [
        { title: "a) Dòng điện các nhánh", lines: [
          "Áp dụng K1 tại nút A: I₁ − I₂ − I₃ − I₄ = 0   (1)",
          "Áp dụng K2 cho vòng V₁: −U_N + U₁ + U₂ = 0 ⇒ 2I₁ + 6I₂ = 24   (2)",
          "Áp dụng K2 cho vòng V₂: −U₂ + U₃ = 0 ⇒ −6I₂ + 12I₃ = 0   (3)",
          "Áp dụng K2 cho vòng V₃: −U₃ + U₄ = 0 ⇒ −12I₃ + 4I₄ = 0   (4)",
          "Từ (3): I₃ = 0,5I₂ ; từ (4): I₄ = 3I₃ = 1,5I₂ ; thay vào (1): I₁ = I₂ + 0,5I₂ + 1,5I₂ = 3I₂",
          "Thay vào (2): 2 × 3I₂ + 6I₂ = 24 ⇒ 12I₂ = 24 ⇒ I₂ = 2 A",
          "⇒ I₁ = 6 A, I₂ = 2 A, I₃ = 1 A, I₄ = 3 A"
        ] },
        { title: "b) Công suất", lines: [
          "Công suất nguồn: P_N = U_N × I_N = 24 × 6 = 144 W",
          "Công suất tải: P_tải = I₁² × R₁ + I₂² × R₂ + I₃² × R₃ + I₄² × R₄",
          "= 6² × 2 + 2² × 6 + 1² × 12 + 3² × 4 = 72 + 24 + 12 + 36 = 144 W",
          "⇒ Công suất nguồn bằng công suất tải."
        ] }
      ]
    },
    ac: {
      id: 2,
      title: "Nguồn dòng cấp cho hai nhánh RL và RC",
      source: { type: "I", mag: 10, deg: 0, symbol: "arrow", label: "10∠0° A" },
      branches: [
        { current: "I_1", elems: [{ kind: "R", value: 3, label: "3 Ω" }, { kind: "L", x: 4, label: "j4 Ω" }] },
        { current: "I_2", elems: [{ kind: "R", value: 4, label: "4 Ω" }, { kind: "C", x: 3, label: "−j3 Ω", mark: "V_x" }] }
      ],
      voltages: [{ name: "V_x", text: "^V_x = ^I_2 × Z_C = ^I_2 × (−j3)", terms: [{ branch: 1, elem: 1, sign: 1 }] }],
      asks: "Viết phương trình dòng điện trên các nhánh và V_x. Tính P, Q, S của nguồn cấp cho các tải."
    }
  },
  {
    id: 3,
    dc: {
      id: "D3-1",
      ask: "a) Tính dòng điện I₁, I₂, I₃, I₄, I₅. b) Tính công suất các nguồn và công suất tải.",
      size: [580, 260],
      draw: [
        ["w", 40, 40, 480, 40], ["w", 40, 220, 480, 220], ["w", 40, 40, 40, 220], ["w", 180, 40, 180, 220], ["w", 340, 40, 340, 220], ["w", 480, 40, 480, 220],
        ["v", 40, 130, "10 V"], ["i", 340, 130, "6 A"],
        ["r", 180, 130, "v", "R₂ = 2 Ω"], ["r", 260, 40, "h", "R₃ = 1 Ω"], ["r", 480, 130, "v", "R₄ = 4 Ω"], ["r", 260, 220, "h", "R₅ = 2 Ω"],
        ["a", 120, 40, "r", "I₁"], ["a", 180, 78, "d", "I₂"], ["a", 215, 40, "l", "I₃"], ["a", 400, 40, "r", "I₄"], ["a", 215, 220, "r", "I₅"],
        ["n", 180, 40, "A"], ["n", 340, 40, "B"], ["n", 340, 220, "C"], ["n", 180, 220, "D"],
        ["k", 100, 172, "V₁"], ["k", 262, 172, "V₂"], ["k", 405, 172, "V₃"]
      ],
      steps: [
        { title: "a) Dòng điện các nhánh", lines: [
          "Áp dụng K1 tại nút A: I₁ − I₂ + I₃ = 0   (1)",
          "Áp dụng K1 tại nút B: −I₃ − I₄ + 6 = 0 ⇒ I₃ + I₄ = 6   (2)",
          "Áp dụng K1 tại nút C: I₄ + I₅ − 6 = 0 ⇒ I₄ + I₅ = 6   (3)",
          "Áp dụng K1 tại nút D: −I₁ + I₂ − I₅ = 0   (4)",
          "Áp dụng K2 cho vòng V₁: −U + U₂ = 0 ⇒ 2I₂ = 10 ⇒ I₂ = 5 A   (5)",
          "Áp dụng K2 cho vòng V₂ (A → B → R₄ → C → D → A, không đi qua nguồn dòng): −U₃ + U₄ − U₅ − U₂ = 0",
          "⇒ −I₃ + 4I₄ − 2I₅ − 2 × 5 = 0 ⇒ −I₃ + 4I₄ − 2I₅ = 10   (6)",
          "Từ (2), (3): I₃ = 6 − I₄, I₅ = 6 − I₄ ; thay vào (6): −(6 − I₄) + 4I₄ − 2(6 − I₄) = 10 ⇒ 7I₄ = 28 ⇒ I₄ = 4 A",
          "⇒ I₃ = 2 A, I₅ = 2 A ; từ (1): I₁ = I₂ − I₃ = 5 − 2 = 3 A",
          "Vậy I₁ = 3 A, I₂ = 5 A, I₃ = 2 A, I₄ = 4 A, I₅ = 2 A"
        ] },
        { title: "b) Công suất", lines: [
          "Điện áp trên nguồn dòng, áp dụng K2 cho vòng V₃: −U_J + U₄ = 0 ⇒ U_J = I₄ × R₄ = 4 × 4 = 16 V",
          "Công suất nguồn: P_N = U × I₁ + U_J × J = 10 × 3 + 16 × 6 = 30 + 96 = 126 W",
          "Công suất tải: P_tải = I₂² × R₂ + I₃² × R₃ + I₄² × R₄ + I₅² × R₅",
          "= 5² × 2 + 2² × 1 + 4² × 4 + 2² × 2 = 50 + 4 + 64 + 8 = 126 W",
          "⇒ Công suất nguồn bằng công suất tải."
        ] }
      ]
    },
    ac: {
      id: 2,
      title: "Mạch chưa phức hoá: nguồn 20cos4t, L và R nối tiếp, cụm R // C",
      source: {
        type: "V", mag: 20, deg: 0, omega: 4, fn: "cos", symbol: "ac",
        label: "20cos4t", complexLabel: "20∠0° V"
      },
      totalLabel: "I_o",
      series: [
        { kind: "L", h: 0.25, label: "0,25 H", complexLabel: "j1 Ω" },
        { kind: "R", value: 4, label: "4 Ω", complexLabel: "4 Ω" }
      ],
      branches: [
        { current: "I_1", elems: [{ kind: "R", value: 2, label: "2 Ω", complexLabel: "2 Ω" }] },
        { current: "I_2", elems: [{ kind: "C", f: 0.125, label: "1/8 F", complexLabel: "−j2 Ω", mark: "U_c" }] }
      ],
      voltages: [{ name: "U_c", text: "^U_c = ^I_2 × Z_C = ^I_2 × (−j2)", terms: [{ branch: 1, elem: 0, sign: 1 }] }],
      asks: "Viết phương trình dòng điện trên các nhánh và phương trình điện áp u_c(t). Tính P, Q, S của nguồn cấp cho các tải."
    }
  }
];
