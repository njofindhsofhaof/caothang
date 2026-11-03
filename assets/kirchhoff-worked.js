/* Bai nang cao Kirchhoff (K1, K2) - tab rieng trong trang Kirchhoff, trinh bay loi giai thay vi o dap an.
   draw: so do ve bang assets/kirchhoff-svg.js
     ["w", x1, y1, x2, y2] day noi | ["r", x, y, "h"|"v", nhan] dien tro | ["i", x, y, nhan] nguon dong (mui ten len)
     ["v", x, y, nhan] nguon ap (+ tren) | ["a", x, y, huong r/l/u/d, nhan] chieu dong | ["n", x, y, ten] nut
     ["k", cx, cy, ten] vong K2 (chieu kim dong ho)
   steps: [{ title, lines }]; "_x" trong dong = chi so duoi (U_N, P_tải). */
window.KH_SETS = (window.KH_SETS || []).concat([{
  id: 6,
  title: "Bài nâng cao",
  worked: true,
  problems: [
    {
      id: "BG1",
      ask: "a) Tính dòng điện I₁, I₂, I₃. b) Tính công suất nguồn và công suất tải.",
      size: [430, 260],
      draw: [
        ["w", 40, 40, 380, 40], ["w", 40, 220, 380, 220], ["w", 40, 40, 40, 220], ["w", 220, 40, 220, 220], ["w", 380, 40, 380, 220],
        ["i", 40, 130, "5 A"],
        ["r", 130, 40, "h", "R₁ = 1 Ω"], ["r", 300, 40, "h", "R₂ = 3 Ω"], ["r", 220, 130, "v", "R₃ = 2 Ω"],
        ["a", 185, 40, "r", "I₁"], ["a", 250, 40, "r", "I₂"], ["a", 220, 78, "d", "I₃"],
        ["n", 220, 40, "A"], ["n", 220, 220, "B"],
        ["k", 125, 172, "V₁"], ["k", 305, 172, "V₂"]
      ],
      steps: [
        { title: "a) Dòng điện các nhánh", lines: [
          "Nguồn dòng 5 A mắc nối tiếp R₁ nên I₁ = 5 A.",
          "Áp dụng K1 tại nút A: I₁ − I₂ − I₃ = 0 ⇒ I₂ + I₃ = 5   (1)",
          "Áp dụng K2 cho vòng V₂: U₂ − U₃ = 0 ⇒ I₂ × R₂ − I₃ × R₃ = 0 ⇒ 3I₂ − 2I₃ = 0   (2)",
          "Từ (1), (2) ⇒ I₂ = 2 A, I₃ = 3 A"
        ] },
        { title: "b) Công suất", lines: [
          "Áp dụng K2 cho vòng V₁: −U_N + U_R1 + U_R3 = 0",
          "⇒ U_N = U_R1 + U_R3 = I₁ × R₁ + I₃ × R₃ = 5 × 1 + 3 × 2 = 11 V",
          "Công suất nguồn: P_N = U_N × I_N = 11 × 5 = 55 W",
          "Công suất tải: P_tải = I₁² × R₁ + I₂² × R₂ + I₃² × R₃ = 5² × 1 + 2² × 3 + 3² × 2 = 25 + 12 + 18 = 55 W",
          "⇒ Công suất nguồn bằng công suất tải."
        ] }
      ]
    },
    {
      id: "BG2",
      ask: "a) Tính dòng điện I₁, I₂, I₃, I₄. b) Tính công suất nguồn và công suất tải.",
      size: [540, 260],
      draw: [
        ["w", 40, 40, 480, 40], ["w", 40, 220, 480, 220], ["w", 40, 40, 40, 220], ["w", 200, 40, 200, 220], ["w", 330, 40, 330, 220], ["w", 480, 40, 480, 220],
        ["v", 40, 130, "12 V"],
        ["r", 120, 40, "h", "R₁ = 1,8 Ω"], ["r", 200, 130, "v", "R₂ = 2,4 Ω"], ["r", 330, 130, "v", "R₃ = 4 Ω"], ["r", 410, 40, "h", "R₄ = 6 Ω"],
        ["a", 170, 40, "r", "I₁"], ["a", 200, 78, "d", "I₂"], ["a", 330, 78, "d", "I₃"], ["a", 360, 40, "r", "I₄"],
        ["n", 200, 40, "A"],
        ["k", 115, 172, "V₁"], ["k", 268, 172, "V₂"], ["k", 405, 172, "V₃"]
      ],
      steps: [
        { title: "a) Dòng điện các nhánh", lines: [
          "Áp dụng K1 tại nút A: I₁ − I₂ − I₃ − I₄ = 0   (1)",
          "Áp dụng K2 cho vòng V₁: −U_N + U₁ + U₂ = 0 ⇒ 1,8I₁ + 2,4I₂ = 12   (2)",
          "Áp dụng K2 cho vòng V₂: −U₂ + U₃ = 0 ⇒ −2,4I₂ + 4I₃ = 0   (3)",
          "Áp dụng K2 cho vòng V₃: −U₃ + U₄ = 0 ⇒ −4I₃ + 6I₄ = 0   (4)",
          "Từ (3): I₃ = 0,6I₂ ; từ (4): I₄ = 0,4I₂ ; thay vào (1): I₁ = I₂ + 0,6I₂ + 0,4I₂ = 2I₂",
          "Thay vào (2): 1,8 × 2I₂ + 2,4I₂ = 12 ⇒ 6I₂ = 12 ⇒ I₂ = 2 A",
          "⇒ I₁ = 4 A, I₂ = 2 A, I₃ = 1,2 A, I₄ = 0,8 A"
        ] },
        { title: "b) Công suất", lines: [
          "Công suất nguồn: P_N = U_N × I_N = 12 × 4 = 48 W",
          "Công suất tải: P_tải = I₁² × R₁ + I₂² × R₂ + I₃² × R₃ + I₄² × R₄",
          "= 4² × 1,8 + 2² × 2,4 + 1,2² × 4 + 0,8² × 6 = 28,8 + 9,6 + 5,76 + 3,84 = 48 W",
          "⇒ Công suất nguồn bằng công suất tải."
        ] }
      ]
    },
    {
      id: "BG3",
      ask: "a) Tính dòng điện I₁, I₂, I₃, I₄, I₅. b) Tính công suất các nguồn và công suất tải.",
      size: [580, 260],
      draw: [
        ["w", 40, 40, 480, 40], ["w", 40, 220, 480, 220], ["w", 40, 40, 40, 220], ["w", 180, 40, 180, 220], ["w", 340, 40, 340, 220], ["w", 480, 40, 480, 220],
        ["v", 40, 130, "6 V"], ["i", 340, 130, "5 A"],
        ["r", 180, 130, "v", "R₂ = 2 Ω"], ["r", 260, 40, "h", "R₃ = 1 Ω"], ["r", 480, 130, "v", "R₄ = 3 Ω"], ["r", 260, 220, "h", "R₅ = 5 Ω"],
        ["a", 120, 40, "r", "I₁"], ["a", 180, 78, "d", "I₂"], ["a", 215, 40, "l", "I₃"], ["a", 400, 40, "r", "I₄"], ["a", 215, 220, "r", "I₅"],
        ["n", 180, 40, "A"], ["n", 340, 40, "B"], ["n", 340, 220, "C"], ["n", 180, 220, "D"],
        ["k", 100, 172, "V₁"], ["k", 262, 172, "V₂"], ["k", 405, 172, "V₃"]
      ],
      steps: [
        { title: "a) Dòng điện các nhánh", lines: [
          "Áp dụng K1 tại nút A: I₁ − I₂ + I₃ = 0   (1)",
          "Áp dụng K1 tại nút B: −I₃ − I₄ + 5 = 0 ⇒ I₃ + I₄ = 5   (2)",
          "Áp dụng K1 tại nút C: I₄ + I₅ − 5 = 0 ⇒ I₄ + I₅ = 5   (3)",
          "Áp dụng K1 tại nút D: −I₁ + I₂ − I₅ = 0   (4)",
          "Áp dụng K2 cho vòng V₁: −U + U₂ = 0 ⇒ 2I₂ = 6 ⇒ I₂ = 3 A   (5)",
          "Áp dụng K2 cho vòng V₂ (A → B → R₄ → C → D → A, không đi qua nguồn dòng): −U₃ + U₄ − U₅ − U₂ = 0",
          "⇒ −I₃ + 3I₄ − 5I₅ − 2 × 3 = 0 ⇒ −I₃ + 3I₄ − 5I₅ = 6   (6)",
          "Từ (2), (3): I₃ = 5 − I₄, I₅ = 5 − I₄ ; thay vào (6): −(5 − I₄) + 3I₄ − 5(5 − I₄) = 6 ⇒ 9I₄ = 36 ⇒ I₄ = 4 A",
          "⇒ I₃ = 1 A, I₅ = 1 A ; từ (1): I₁ = I₂ − I₃ = 3 − 1 = 2 A",
          "Vậy I₁ = 2 A, I₂ = 3 A, I₃ = 1 A, I₄ = 4 A, I₅ = 1 A"
        ] },
        { title: "b) Công suất", lines: [
          "Điện áp trên nguồn dòng, áp dụng K2 cho vòng V₃: −U_J + U₄ = 0 ⇒ U_J = I₄ × R₄ = 4 × 3 = 12 V",
          "Công suất nguồn: P_N = U × I₁ + U_J × J = 6 × 2 + 12 × 5 = 12 + 60 = 72 W",
          "Công suất tải: P_tải = I₂² × R₂ + I₃² × R₃ + I₄² × R₄ + I₅² × R₅",
          "= 3² × 2 + 1² × 1 + 4² × 3 + 1² × 5 = 18 + 1 + 48 + 5 = 72 W",
          "⇒ Công suất nguồn bằng công suất tải."
        ] }
      ]
    }
  ]
}]);
