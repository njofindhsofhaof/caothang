/* So lieu 4 de kiem tra 1 tiet Ly thuyet mach Chuong 3–4 (trang /dekiemtralythuyetmach).
   Moi de 2 bai theo bang DKTM_PLAN: Bai 1 Chuong 3 (de 1, 3 dong mat luoi 3 mat; de 2, 4 dien the nut 3 nut co bien doi nguon), Bai 2 Chuong 4 (mach 3 pha).
   - b1: mo hinh mach nhu assets/mln-calc.js + currents.sign, pSrc, pLoad (xem assets/dktm-calc.js); draw ve bang assets/mln-svg.js.
   - b2: mo hinh 3 pha nhu assets/bp3-calc.js.
   Dap an va loi giai tinh tu so lieu, khong ghi tay; test/dktm-calc.test.js giu dap so tron. */
(function () {
  "use strict";

  window.DKTM_PLAN = [
    { bai: "1", title: "Dòng mắt lưới hoặc điện thế nút (3 mắt / 3 nút, có nguồn dòng, biến đổi nguồn)", ch: "Ch.3", min: 22, pts: 5,
      what: "a) Viết hệ phương trình (2 đ) · b) Giải hệ (1 đ) · c) Dòng các nhánh (1 đ) · d) Kiểm tra cân bằng công suất (1 đ)" },
    { bai: "2", title: "Mạch 3 pha tải đối xứng nối Y hoặc Δ", ch: "Ch.4", min: 20, pts: 5,
      what: "a) U_d, U_p (1 đ) · b) Z_p, I_p, I_d (1,5 đ) · c) cosφ, P, Q, S (2 đ) · d) Đấu lại tải, so sánh công suất (0,5 đ)" }
  ];

  /* 3 mat luoi hinh thang: E1 trai, E2 phai (I_m3 ra am). */
  var MESH_3 = {
    method: "mesh", loops: 3,
    resistors: [
      { sym: "R_1", value: 2, loops: [0] },
      { sym: "R_2", value: 4, loops: [0, 1] },
      { sym: "R_3", value: 3, loops: [1] },
      { sym: "R_4", value: 6, loops: [1, 2] },
      { sym: "R_5", value: 2, loops: [2] }
    ],
    vsources: [
      { sym: "E_1", value: 40, loop: 0, sign: 1 },
      { sym: "E_2", value: 20, loop: 2, sign: -1 }
    ],
    currents: [
      { name: "I_1", of: "R_1" }, { name: "I_2", of: "R_2" }, { name: "I_3", of: "R_3" },
      { name: "I_4", of: "R_4" }, { name: "I_5", of: "R_5", sign: -1 }
    ],
    pSrc: [{ sym: "E_1", cur: "I_1" }, { sym: "E_2", cur: "I_5" }],
    pLoad: [{ sym: "R_1", cur: "I_1" }, { sym: "R_2", cur: "I_2" }, { sym: "R_3", cur: "I_3" }, { sym: "R_4", cur: "I_4" }, { sym: "R_5", cur: "I_5" }],
    size: [650, 260],
    draw: [
      ["w", 40, 40, 520, 40], ["w", 40, 220, 520, 220],
      ["w", 40, 40, 40, 220], ["w", 200, 40, 200, 220], ["w", 360, 40, 360, 220], ["w", 520, 40, 520, 220],
      ["v", 40, 130, "u", "E₁ = 40 V"], ["r", 120, 40, "h", "R₁ = 2 Ω"], ["r", 200, 130, "v", "R₂ = 4 Ω"],
      ["r", 280, 40, "h", "R₃ = 3 Ω"], ["r", 360, 130, "v", "R₄ = 6 Ω"], ["r", 440, 40, "h", "R₅ = 2 Ω"], ["v", 520, 130, "u", "E₂ = 20 V"],
      ["a", 168, 40, "r", "I₁"], ["a", 200, 185, "d", "I₂"], ["a", 328, 40, "r", "I₃"], ["a", 360, 185, "d", "I₄"], ["a", 488, 40, "l", "I₅"],
      ["n", 200, 40, ""], ["n", 360, 40, ""], ["n", 200, 220, ""], ["n", 360, 220, ""],
      ["k", 120, 172, "Iₘ₁"], ["k", 280, 172, "Iₘ₂"], ["k", 440, 172, "Iₘ₃"]
    ]
  };

  /* 3 mat luoi, nguon dong J o nhanh ngoai mat 3 (I_m3 = J). */
  var MESH_J = {
    method: "mesh", loops: 3,
    resistors: [
      { sym: "R_1", value: 4, loops: [0] },
      { sym: "R_2", value: 4, loops: [0, 1] },
      { sym: "R_3", value: 3, loops: [1] },
      { sym: "R_4", value: 2, loops: [1, 2] },
      { sym: "R_5", value: 6, loops: [2] }
    ],
    vsources: [
      { sym: "E_1", value: 48, loop: 0, sign: 1 },
      { sym: "E_2", value: 24, loop: 1, sign: 1 }
    ],
    isources: [{ sym: "J", value: 4, loop: 2 }],
    currents: [
      { name: "I_1", of: "R_1" }, { name: "I_2", of: "R_2" }, { name: "I_3", of: "R_3" },
      { name: "I_4", of: "R_4" }, { name: "I_5", of: "R_5" }
    ],
    pSrc: [{ sym: "E_1", cur: "I_1" }, { sym: "E_2", cur: "I_3" }, { sym: "J", uJ: true }],
    pLoad: [{ sym: "R_1", cur: "I_1" }, { sym: "R_2", cur: "I_2" }, { sym: "R_3", cur: "I_3" }, { sym: "R_4", cur: "I_4" }, { sym: "R_5", cur: "I_5" }],
    size: [650, 260],
    draw: [
      ["w", 40, 40, 540, 40], ["w", 40, 220, 540, 220],
      ["w", 40, 40, 40, 220], ["w", 200, 40, 200, 220], ["w", 380, 40, 380, 220], ["w", 540, 40, 540, 220],
      ["v", 40, 130, "u", "E₁ = 48 V"], ["r", 120, 40, "h", "R₁ = 4 Ω"], ["r", 200, 130, "v", "R₂ = 4 Ω"],
      ["r", 252, 40, "h", "R₃ = 3 Ω", "b"], ["v", 325, 40, "r", "E₂ = 24 V"], ["r", 380, 130, "v", "R₄ = 2 Ω"],
      ["r", 460, 40, "h", "R₅ = 6 Ω"], ["i", 540, 130, "d", "J = 4 A"],
      ["a", 168, 40, "r", "I₁"], ["a", 200, 185, "d", "I₂"], ["a", 358, 40, "r", "I₃"], ["a", 380, 185, "d", "I₄"], ["a", 506, 40, "r", "I₅"],
      ["n", 200, 40, ""], ["n", 380, 40, ""], ["n", 200, 220, ""], ["n", 380, 220, ""],
      ["k", 120, 172, "Iₘ₁"], ["k", 290, 172, "Iₘ₂"], ["k", 460, 172, "Iₘ₃"]
    ]
  };

  /* 3 nut A, B, C: hai nhanh nguon ap noi tiep dien tro o hai dau (can bien doi nguon). */
  var NODAL_3 = {
    method: "nodal", nodes: ["A", "B", "C"],
    resistors: [
      { sym: "R_2", value: 2, nodes: [0] },
      { sym: "R_3", value: 2, nodes: [0, 1] },
      { sym: "R_4", value: 4, nodes: [1] },
      { sym: "R_5", value: 2, nodes: [1, 2] },
      { sym: "R_6", value: 1, nodes: [2] }
    ],
    vbranches: [
      { sym: "E_1", value: 40, rSym: "R_1", r: 2, node: 0 },
      { sym: "E_2", value: 12, rSym: "R_7", r: 4, node: 2 }
    ],
    currents: [
      { name: "I_1", of: "E_1" }, { name: "I_2", of: "R_2" }, { name: "I_3", of: "R_3" }, { name: "I_4", of: "R_4" },
      { name: "I_5", of: "R_5" }, { name: "I_6", of: "R_6" }, { name: "I_7", of: "E_2" }
    ],
    pSrc: [{ sym: "E_1", cur: "I_1" }, { sym: "E_2", cur: "I_7" }],
    pLoad: [{ sym: "R_1", cur: "I_1" }, { sym: "R_2", cur: "I_2" }, { sym: "R_3", cur: "I_3" }, { sym: "R_4", cur: "I_4" },
      { sym: "R_5", cur: "I_5" }, { sym: "R_6", cur: "I_6" }, { sym: "R_7", cur: "I_7" }],
    size: [680, 290],
    draw: [
      ["w", 40, 60, 560, 60], ["w", 40, 240, 560, 240],
      ["w", 40, 60, 40, 240], ["w", 170, 60, 170, 240], ["w", 300, 60, 300, 240], ["w", 430, 60, 430, 240], ["w", 560, 60, 560, 240],
      ["v", 40, 150, "u", "E₁ = 40 V"], ["r", 102, 60, "h", "R₁ = 2 Ω"], ["r", 170, 150, "v", "R₂ = 2 Ω"],
      ["r", 232, 60, "h", "R₃ = 2 Ω"], ["r", 300, 150, "v", "R₄ = 4 Ω"], ["r", 362, 60, "h", "R₅ = 2 Ω"],
      ["r", 430, 150, "v", "R₆ = 1 Ω"], ["r", 492, 60, "h", "R₇ = 4 Ω"], ["v", 560, 150, "u", "E₂ = 12 V"],
      ["a", 146, 60, "r", "I₁"], ["a", 170, 202, "d", "I₂"], ["a", 276, 60, "r", "I₃"], ["a", 300, 202, "d", "I₄"],
      ["a", 406, 60, "r", "I₅"], ["a", 430, 202, "d", "I₆"], ["a", 534, 60, "l", "I₇"],
      ["n", 170, 60, "A"], ["n", 300, 60, "B"], ["n", 430, 60, "C"], ["n", 170, 240, ""], ["n", 300, 240, "gốc (0 V)"], ["n", 430, 240, ""]
    ],
    /* Mach sau khi bien doi nguon: E1 nt R1 -> J1 = E1/R1 // R1; E2 nt R7 -> J2 = E2/R7 // R7. */
    sizeT: [850, 290],
    drawT: [
      ["w", 120, 60, 740, 60], ["w", 120, 240, 740, 240],
      ["w", 120, 60, 120, 240], ["w", 190, 60, 190, 240], ["w", 280, 60, 280, 240], ["w", 410, 60, 410, 240],
      ["w", 540, 60, 540, 240], ["w", 640, 60, 640, 240], ["w", 740, 60, 740, 240],
      ["i", 120, 150, "u", "J₁ = 20 A", "l"], ["r", 190, 150, "v", "R₁ = 2 Ω"], ["r", 280, 150, "v", "R₂ = 2 Ω"],
      ["r", 345, 60, "h", "R₃ = 2 Ω"], ["r", 410, 150, "v", "R₄ = 4 Ω"], ["r", 475, 60, "h", "R₅ = 2 Ω"],
      ["r", 540, 150, "v", "R₆ = 1 Ω"], ["r", 640, 150, "v", "R₇ = 4 Ω"], ["i", 740, 150, "u", "J₂ = 3 A"],
      ["n", 280, 60, "A"], ["n", 410, 60, "B"], ["n", 540, 60, "C"], ["n", 410, 240, "gốc (0 V)"]
    ]
  };

  /* 3 nut A, B, C: hai nhanh nguon ap noi tiep dien tro + nguon dong J vao B. */
  var NODAL_J = {
    method: "nodal", nodes: ["A", "B", "C"],
    resistors: [
      { sym: "R_2", value: 4, nodes: [0] },
      { sym: "R_3", value: 2, nodes: [0, 1] },
      { sym: "R_4", value: 4, nodes: [1] },
      { sym: "R_5", value: 4, nodes: [1, 2] },
      { sym: "R_6", value: 2, nodes: [2] }
    ],
    isources: [{ sym: "J", value: 2, from: null, to: 1 }],
    vbranches: [
      { sym: "E_1", value: 40, rSym: "R_1", r: 4, node: 0 },
      { sym: "E_2", value: 20, rSym: "R_7", r: 4, node: 2 }
    ],
    currents: [
      { name: "I_1", of: "E_1" }, { name: "I_2", of: "R_2" }, { name: "I_3", of: "R_3" }, { name: "I_4", of: "R_4" },
      { name: "I_5", of: "R_5" }, { name: "I_6", of: "R_6" }, { name: "I_7", of: "E_2" }
    ],
    pSrc: [{ sym: "E_1", cur: "I_1" }, { sym: "E_2", cur: "I_7" }, { sym: "J", u: "V_B" }],
    pLoad: [{ sym: "R_1", cur: "I_1" }, { sym: "R_2", cur: "I_2" }, { sym: "R_3", cur: "I_3" }, { sym: "R_4", cur: "I_4" },
      { sym: "R_5", cur: "I_5" }, { sym: "R_6", cur: "I_6" }, { sym: "R_7", cur: "I_7" }],
    size: [780, 290],
    draw: [
      ["w", 40, 60, 660, 60], ["w", 40, 240, 660, 240],
      ["w", 40, 60, 40, 240], ["w", 170, 60, 170, 240], ["w", 300, 60, 300, 240], ["w", 420, 60, 420, 240],
      ["w", 530, 60, 530, 240], ["w", 660, 60, 660, 240],
      ["v", 40, 150, "u", "E₁ = 40 V"], ["r", 102, 60, "h", "R₁ = 4 Ω"], ["r", 170, 150, "v", "R₂ = 4 Ω"],
      ["r", 232, 60, "h", "R₃ = 2 Ω"], ["r", 300, 150, "v", "R₄ = 4 Ω"], ["i", 420, 150, "u", "J = 2 A"],
      ["r", 462, 60, "h", "R₅ = 4 Ω"], ["r", 530, 150, "v", "R₆ = 2 Ω"], ["r", 592, 60, "h", "R₇ = 4 Ω"], ["v", 660, 150, "u", "E₂ = 20 V"],
      ["a", 146, 60, "r", "I₁"], ["a", 170, 202, "d", "I₂"], ["a", 276, 60, "r", "I₃"], ["a", 300, 202, "d", "I₄"],
      ["a", 506, 60, "r", "I₅"], ["a", 530, 202, "d", "I₆"], ["a", 634, 60, "l", "I₇"],
      ["n", 170, 60, "A"], ["n", 300, 60, "B"], ["n", 420, 60, ""], ["n", 530, 60, "C"],
      ["n", 170, 240, ""], ["n", 300, 240, ""], ["n", 420, 240, "gốc (0 V)"], ["n", 530, 240, ""]
    ],
    /* Mach sau khi bien doi nguon: E1 nt R1 -> J1 = E1/R1 // R1; E2 nt R7 -> J2 = E2/R7 // R7; J giu nguyen. */
    sizeT: [950, 290],
    drawT: [
      ["w", 120, 60, 840, 60], ["w", 120, 240, 840, 240],
      ["w", 120, 60, 120, 240], ["w", 190, 60, 190, 240], ["w", 280, 60, 280, 240], ["w", 410, 60, 410, 240],
      ["w", 530, 60, 530, 240], ["w", 640, 60, 640, 240], ["w", 740, 60, 740, 240], ["w", 840, 60, 840, 240],
      ["i", 120, 150, "u", "J₁ = 10 A", "l"], ["r", 190, 150, "v", "R₁ = 4 Ω"], ["r", 280, 150, "v", "R₂ = 4 Ω"],
      ["r", 345, 60, "h", "R₃ = 2 Ω"], ["r", 410, 150, "v", "R₄ = 4 Ω"], ["i", 530, 150, "u", "J = 2 A"],
      ["r", 585, 60, "h", "R₅ = 4 Ω"], ["r", 640, 150, "v", "R₆ = 2 Ω"], ["r", 740, 150, "v", "R₇ = 4 Ω"],
      ["i", 840, 150, "u", "J₂ = 5 A"],
      ["n", 280, 60, "A"], ["n", 410, 60, "B"], ["n", 640, 60, "C"], ["n", 410, 240, "gốc (0 V)"]
    ]
  };

  window.DKTM_EXAMS = [
    { de: 1, b1: MESH_3, b2: { conn: "Y", Ud: 380, R: 6, X: 8 } },
    { de: 2, b1: NODAL_3, b2: { conn: "D", Ud: 380, R: 12, X: 16 } },
    { de: 3, b1: MESH_J, b2: { conn: "Y", Ud: 380, source: "220/380", zForm: "complex", R: 16, X: 12 } },
    { de: 4, b1: NODAL_J, b2: { conn: "D", Ud: 380, zForm: "complex", R: 30, X: 40 } }
  ];
})();
