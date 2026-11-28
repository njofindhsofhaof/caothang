/* So lieu 4 de kiem tra 1 tiet Ly thuyet mach Chuong 3–4 (trang /dekiemtralythuyetmach).
   Moi de 2 bai theo bang DKTM_PLAN: Bai 1 Chuong 3 (de 1, 3 dong mat luoi 3 mat; de 2, 4 dien the nut 2 nut A, B co bien doi nguon), Bai 2 Chuong 4 (mach 3 pha).
   - b1: mo hinh mach nhu assets/mln-calc.js + currents.sign, pSrc, pLoad (xem assets/dktm-calc.js); draw ve bang assets/mln-svg.js.
   - b2: mo hinh 3 pha nhu assets/bp3-calc.js.
   Dap an va loi giai tinh tu so lieu, khong ghi tay; test/dktm-calc.test.js giu dap so tron. */
(function () {
  "use strict";

  window.DKTM_PLAN = [
    { bai: "1", title: "Dòng mắt lưới hoặc điện thế nút (3 mắt có nguồn dòng / 2 nút có biến đổi nguồn)", ch: "Ch.3", min: 22, pts: 5,
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

  /* 2 nut A, B: hai nhanh nguon ap noi tiep dien tro (can bien doi nguon). */
  var NODAL_2 = {
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
      ["n", 180, 60, "A"], ["n", 360, 60, "B"], ["n", 180, 240, ""], ["n", 360, 240, "C"]
    ],
    /* Mach sau khi bien doi nguon: E1 nt R1 -> J1 = E1/R1 // R1; E2 nt R2 -> J2 = E2/R2 // R2. */
    sizeT: [740, 290],
    drawT: [
      ["w", 120, 60, 630, 60], ["w", 120, 240, 630, 240],
      ["w", 120, 60, 120, 240], ["w", 190, 60, 190, 240], ["w", 300, 60, 300, 240], ["w", 430, 60, 430, 240],
      ["w", 530, 60, 530, 240], ["w", 630, 60, 630, 240],
      ["i", 120, 150, "u", "J₁ = 4 A", "l"], ["r", 190, 150, "v", "R₁ = 10 Ω"], ["r", 300, 150, "v", "R₄ = 2 Ω"],
      ["r", 365, 60, "h", "R₃ = 1 Ω"], ["r", 430, 150, "v", "R₅ = 2 Ω"], ["r", 530, 150, "v", "R₂ = 1 Ω"],
      ["i", 630, 150, "u", "J₂ = 20 A"],
      ["n", 300, 60, "A"], ["n", 430, 60, "B"], ["n", 430, 240, "C"]
    ]
  };

  /* 2 nut A, B: hai nhanh nguon ap noi tiep dien tro + nguon dong J vao A. */
  var NODAL_2J = {
    method: "nodal", nodes: ["A", "B"],
    resistors: [
      { sym: "R_3", value: 4, nodes: [0, 1] },
      { sym: "R_4", value: 2, nodes: [0] },
      { sym: "R_5", value: 1, nodes: [1] }
    ],
    isources: [{ sym: "J", value: 5, from: null, to: 0 }],
    vbranches: [
      { sym: "E_1", value: 36, rSym: "R_1", r: 4, node: 0 },
      { sym: "E_2", value: 20, rSym: "R_2", r: 2, node: 1 }
    ],
    currents: [
      { name: "I_1", of: "E_1" }, { name: "I_2", of: "E_2" }, { name: "I_3", of: "R_3" },
      { name: "I_4", of: "R_4" }, { name: "I_5", of: "R_5" }
    ],
    pSrc: [{ sym: "E_1", cur: "I_1" }, { sym: "E_2", cur: "I_2" }, { sym: "J", u: "V_A" }],
    pLoad: [{ sym: "R_1", cur: "I_1" }, { sym: "R_2", cur: "I_2" }, { sym: "R_3", cur: "I_3" }, { sym: "R_4", cur: "I_4" }, { sym: "R_5", cur: "I_5" }],
    size: [650, 290],
    draw: [
      ["w", 40, 60, 540, 60], ["w", 40, 240, 540, 240],
      ["w", 40, 60, 40, 240], ["w", 180, 60, 180, 240], ["w", 290, 60, 290, 240], ["w", 400, 60, 400, 240], ["w", 540, 60, 540, 240],
      ["v", 40, 150, "u", "E₁ = 36 V"], ["r", 110, 60, "h", "R₁ = 4 Ω"], ["r", 180, 150, "v", "R₄ = 2 Ω"],
      ["i", 290, 150, "u", "J = 5 A"], ["r", 345, 60, "h", "R₃ = 4 Ω"], ["r", 400, 150, "v", "R₅ = 1 Ω"],
      ["r", 470, 60, "h", "R₂ = 2 Ω"], ["v", 540, 150, "u", "E₂ = 20 V"],
      ["a", 155, 60, "r", "I₁"], ["a", 180, 202, "d", "I₄"], ["a", 380, 60, "r", "I₃"], ["a", 400, 202, "d", "I₅"], ["a", 515, 60, "l", "I₂"],
      ["n", 180, 60, "A"], ["n", 290, 60, ""], ["n", 400, 60, "B"], ["n", 180, 240, ""], ["n", 290, 240, ""], ["n", 400, 240, "C"]
    ],
    /* Mach sau khi bien doi nguon: E1 nt R1 -> J1 = E1/R1 // R1; E2 nt R2 -> J2 = E2/R2 // R2; J giu nguyen. */
    sizeT: [830, 290],
    drawT: [
      ["w", 120, 60, 710, 60], ["w", 120, 240, 710, 240],
      ["w", 120, 60, 120, 240], ["w", 190, 60, 190, 240], ["w", 280, 60, 280, 240], ["w", 380, 60, 380, 240],
      ["w", 510, 60, 510, 240], ["w", 610, 60, 610, 240], ["w", 710, 60, 710, 240],
      ["i", 120, 150, "u", "J₁ = 9 A", "l"], ["r", 190, 150, "v", "R₁ = 4 Ω"], ["r", 280, 150, "v", "R₄ = 2 Ω"],
      ["i", 380, 150, "u", "J = 5 A"], ["r", 445, 60, "h", "R₃ = 4 Ω"], ["r", 510, 150, "v", "R₅ = 1 Ω"],
      ["r", 610, 150, "v", "R₂ = 2 Ω"], ["i", 710, 150, "u", "J₂ = 10 A"],
      ["n", 280, 60, "A"], ["n", 510, 60, "B"], ["n", 510, 240, "C"]
    ]
  };

  window.DKTM_EXAMS = [
    { de: 1, b1: MESH_3, b2: { conn: "Y", Ud: 380, R: 6, X: 8 } },
    { de: 2, b1: NODAL_2, b2: { conn: "D", Ud: 380, R: 12, X: 16 } },
    { de: 3, b1: MESH_J, b2: { conn: "Y", Ud: 380, source: "220/380", zForm: "complex", R: 16, X: 12 } },
    { de: 4, b1: NODAL_2J, b2: { conn: "D", Ud: 380, zForm: "complex", R: 30, X: 40 } }
  ];
})();
