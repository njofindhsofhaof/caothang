/* So lieu 4 de kiem tra 1 tiet Ly thuyet mach Chuong 3–4 (trang /dekiemtralythuyetmach).
   Moi de 2 bai theo bang DKTM_PLAN: Bai 1 Chuong 3 (de 1, 3 dong mat luoi; de 2, 4 dien the nut), Bai 2 Chuong 4 (mach 3 pha).
   - b1: mo hinh mach nhu assets/mln-calc.js + currents.sign, pSrc, pLoad (xem assets/dktm-calc.js); draw ve bang assets/mln-svg.js.
   - b2: mo hinh 3 pha nhu assets/bp3-calc.js.
   Dap an va loi giai tinh tu so lieu, khong ghi tay; test/dktm-calc.test.js giu dap so tron. */
(function () {
  "use strict";

  window.DKTM_PLAN = [
    { bai: "1", title: "Dòng mắt lưới hoặc điện thế nút (mạch 2 ẩn)", ch: "Ch.3", min: 22, pts: 5,
      what: "a) Viết hệ phương trình (2 đ) · b) Giải hệ (1 đ) · c) Dòng các nhánh (1 đ) · d) Kiểm tra cân bằng công suất (1 đ)" },
    { bai: "2", title: "Mạch 3 pha tải đối xứng nối Y hoặc Δ", ch: "Ch.4", min: 20, pts: 5,
      what: "a) U_d, U_p (1 đ) · b) Z_p, I_p, I_d (1,5 đ) · c) cosφ, P, Q, S (2 đ) · d) Đấu lại tải, so sánh công suất (0,5 đ)" }
  ];

  /* 2 mat luoi: nguon E1 trai, nhanh giua R3, nguon E2 phai. */
  var MESH_A = {
    method: "mesh", loops: 2,
    resistors: [
      { sym: "R_1", value: 6, loops: [0] },
      { sym: "R_2", value: 4, loops: [1] },
      { sym: "R_3", value: 3, loops: [0, 1] }
    ],
    vsources: [
      { sym: "E_1", value: 24, loop: 0, sign: 1 },
      { sym: "E_2", value: 20, loop: 1, sign: -1 }
    ],
    currents: [{ name: "I_1", of: "R_1" }, { name: "I_2", of: "R_2", sign: -1 }, { name: "I_3", of: "R_3" }],
    pSrc: [{ sym: "E_1", cur: "I_1" }, { sym: "E_2", cur: "I_2" }],
    pLoad: [{ sym: "R_1", cur: "I_1" }, { sym: "R_2", cur: "I_2" }, { sym: "R_3", cur: "I_3" }],
    size: [570, 260],
    draw: [
      ["w", 40, 40, 440, 40], ["w", 40, 220, 440, 220], ["w", 40, 40, 40, 220], ["w", 240, 40, 240, 220], ["w", 440, 40, 440, 220],
      ["v", 40, 130, "u", "E₁ = 24 V"], ["r", 140, 40, "h", "R₁ = 6 Ω"], ["r", 240, 130, "v", "R₃ = 3 Ω"],
      ["r", 340, 40, "h", "R₂ = 4 Ω"], ["v", 440, 130, "u", "E₂ = 20 V"],
      ["a", 195, 40, "r", "I₁"], ["a", 240, 185, "d", "I₃"], ["a", 290, 40, "l", "I₂"],
      ["n", 240, 40, ""], ["n", 240, 220, ""],
      ["k", 140, 172, "Iₘ₁"], ["k", 340, 172, "Iₘ₂"]
    ]
  };

  /* 2 mat luoi: E1 trai, R2 nhanh giua, mat phai co E2, R3, R4 noi tiep. */
  var MESH_B = {
    method: "mesh", loops: 2,
    resistors: [
      { sym: "R_1", value: 2, loops: [0] },
      { sym: "R_2", value: 4, loops: [0, 1] },
      { sym: "R_3", value: 2, loops: [1] },
      { sym: "R_4", value: 3, loops: [1] }
    ],
    vsources: [
      { sym: "E_1", value: 20, loop: 0, sign: 1 },
      { sym: "E_2", value: 12, loop: 1, sign: 1 }
    ],
    currents: [{ name: "I_1", of: "R_1" }, { name: "I_2", of: "R_2" }, { name: "I_3", of: "R_3" }],
    pSrc: [{ sym: "E_1", cur: "I_1" }, { sym: "E_2", cur: "I_3" }],
    pLoad: [{ sym: "R_1", cur: "I_1" }, { sym: "R_2", cur: "I_2" }, { sym: "R_3", cur: "I_3" }, { sym: "R_4", cur: "I_3" }],
    size: [570, 260],
    draw: [
      ["w", 40, 40, 480, 40], ["w", 40, 220, 480, 220], ["w", 40, 40, 40, 220], ["w", 240, 40, 240, 220], ["w", 480, 40, 480, 220],
      ["v", 40, 130, "u", "E₁ = 20 V"], ["r", 140, 40, "h", "R₁ = 2 Ω"], ["r", 240, 130, "v", "R₂ = 4 Ω"],
      ["v", 310, 40, "r", "E₂ = 12 V"], ["r", 400, 40, "h", "R₃ = 2 Ω"], ["r", 480, 130, "v", "R₄ = 3 Ω"],
      ["a", 195, 40, "r", "I₁"], ["a", 240, 185, "d", "I₂"], ["a", 452, 40, "r", "I₃"],
      ["n", 240, 40, ""], ["n", 240, 220, ""],
      ["k", 140, 172, "Iₘ₁"], ["k", 360, 172, "Iₘ₂"]
    ]
  };

  /* 2 nut A, B: hai nhanh nguon ap noi tiep dien tro (can bien doi nguon). */
  var NODAL_A = {
    method: "nodal", nodes: ["A", "B"],
    resistors: [
      { sym: "R_3", value: 1, nodes: [0, 1] },
      { sym: "R_4", value: 2, nodes: [0] },
      { sym: "R_5", value: 2, nodes: [1] }
    ],
    vbranches: [
      { sym: "E_1", value: 40, rSym: "R_1", r: 10, node: 0 },
      { sym: "E_2", value: 20, rSym: "R_2", r: 1, node: 1 }
    ],
    currents: [
      { name: "I_1", of: "E_1" }, { name: "I_2", of: "E_2" }, { name: "I_3", of: "R_3", sign: -1 },
      { name: "I_4", of: "R_4" }, { name: "I_5", of: "R_5" }
    ],
    pSrc: [{ sym: "E_1", cur: "I_1" }, { sym: "E_2", cur: "I_2" }],
    pLoad: [{ sym: "R_1", cur: "I_1" }, { sym: "R_2", cur: "I_2" }, { sym: "R_3", cur: "I_3" }, { sym: "R_4", cur: "I_4" }, { sym: "R_5", cur: "I_5" }],
    size: [620, 290],
    draw: [
      ["w", 40, 60, 500, 60], ["w", 40, 240, 500, 240],
      ["w", 40, 60, 40, 240], ["w", 180, 60, 180, 240], ["w", 360, 60, 360, 240], ["w", 500, 60, 500, 240],
      ["v", 40, 150, "u", "E₁ = 40 V"], ["r", 110, 60, "h", "R₁ = 10 Ω"], ["r", 180, 150, "v", "R₄ = 2 Ω"],
      ["r", 270, 60, "h", "R₃ = 1 Ω"], ["r", 360, 150, "v", "R₅ = 2 Ω"], ["r", 430, 60, "h", "R₂ = 1 Ω"], ["v", 500, 150, "u", "E₂ = 20 V"],
      ["a", 155, 60, "r", "I₁"], ["a", 180, 202, "d", "I₄"], ["a", 322, 60, "l", "I₃"], ["a", 360, 202, "d", "I₅"], ["a", 475, 60, "l", "I₂"],
      ["n", 180, 60, "A"], ["n", 360, 60, "B"], ["n", 180, 240, ""], ["n", 360, 240, "gốc (0 V)"]
    ]
  };

  /* 2 nut A, B: mot nhanh nguon ap noi tiep R1, mot nguon dong J vao B. */
  var NODAL_B = {
    method: "nodal", nodes: ["A", "B"],
    resistors: [
      { sym: "R_2", value: 2, nodes: [0] },
      { sym: "R_3", value: 1, nodes: [0, 1] },
      { sym: "R_4", value: 2, nodes: [1] }
    ],
    isources: [{ sym: "J", value: 5, from: null, to: 1 }],
    vbranches: [{ sym: "E", value: 36, rSym: "R_1", r: 2, node: 0 }],
    currents: [{ name: "I_1", of: "E" }, { name: "I_2", of: "R_2" }, { name: "I_3", of: "R_3" }, { name: "I_4", of: "R_4" }],
    pSrc: [{ sym: "E", cur: "I_1" }, { sym: "J", u: "V_B" }],
    pLoad: [{ sym: "R_1", cur: "I_1" }, { sym: "R_2", cur: "I_2" }, { sym: "R_3", cur: "I_3" }, { sym: "R_4", cur: "I_4" }],
    size: [600, 290],
    draw: [
      ["w", 40, 60, 480, 60], ["w", 40, 240, 480, 240],
      ["w", 40, 60, 40, 240], ["w", 180, 60, 180, 240], ["w", 360, 60, 360, 240], ["w", 480, 60, 480, 240],
      ["v", 40, 150, "u", "E = 36 V"], ["r", 110, 60, "h", "R₁ = 2 Ω"], ["r", 180, 150, "v", "R₂ = 2 Ω"],
      ["r", 270, 60, "h", "R₃ = 1 Ω"], ["r", 360, 150, "v", "R₄ = 2 Ω"], ["i", 480, 150, "u", "J = 5 A"],
      ["a", 155, 60, "r", "I₁"], ["a", 180, 202, "d", "I₂"], ["a", 322, 60, "r", "I₃"], ["a", 360, 202, "d", "I₄"],
      ["n", 180, 60, "A"], ["n", 360, 60, "B"], ["n", 180, 240, ""], ["n", 360, 240, "gốc (0 V)"]
    ]
  };

  window.DKTM_EXAMS = [
    { de: 1, b1: MESH_A, b2: { conn: "Y", Ud: 380, R: 6, X: 8 } },
    { de: 2, b1: NODAL_A, b2: { conn: "D", Ud: 380, R: 12, X: 16 } },
    { de: 3, b1: MESH_B, b2: { conn: "Y", Ud: 380, source: "220/380", zForm: "complex", R: 16, X: 12 } },
    { de: 4, b1: NODAL_B, b2: { conn: "D", Ud: 380, zForm: "complex", R: 30, X: 40 } }
  ];
})();
