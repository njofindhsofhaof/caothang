/* So lieu 4 de mau kiem tra 1 tiet Dien tu co ban (Chuong 1-4), trang /dekiemtradientucoban.
   Moi de 6 cau (1, 2, 3, 4a, 4b, 5) theo bang thoi gian/diem DKT_PLAN. Dap an va loi giai tinh tu so lieu bang
   assets/dkt-calc.js, phanap-calc.js, diode-calc.js, zener-calc.js, bjt-calc.js, khong ghi tay.
   - rect:   chinh luu ban ky; pol "+" (ban ky duong) | "-" (ban ky am); vrms = dien ap hieu dung thu cap (V), r = tai (ohm).
   - parts:  cau doc linh kien; bands4/bands5 = ten mau tu vong 1; cap = 2 ma tu; smd = 2 ma dan.
   - res:    mach dien tro hon hop, cung dang PA_PROBLEMS (stages tu tren xuong, nhanh nhieu ten = song song).
   - diode:  mach V_CC -> R -> cac tang diode, cung dang DIODE_PROBLEMS (vf: Si 0,7 V, Ge 0,3 V, LED do 2 V).
   - zener:  mach on ap Zener: zener {vz, izmin, izmax (A)}, vs, rs, rl.
   - bjt:    phan cuc co dinh 2 nguon: vcc, rb, rc, re, beta, vbb = 2 truong hop. */
(function () {
  "use strict";
  function si(name, opts) { return { name: name, vf: 0.7, kind: "si", rev: !!(opts && opts.rev) }; }
  function ge(name) { return { name: name, vf: 0.3, kind: "ge", rev: false }; }
  function led(name, vf) { return { name: name, vf: vf, kind: "led", rev: false }; }
  var Z91 = { vz: 9.1, izmin: 0.002, izmax: 0.035 };
  var Z51 = { vz: 5.1, izmin: 0.001, izmax: 0.05 };

  window.DKT_PLAN = [
    { cau: "1", title: "Chỉnh lưu bán kỳ dương hoặc âm", ch: "Ch.3", min: 7, pts: 2, what: "Vẽ sơ đồ, vẽ dạng sóng vào/ra, tính V_m, đỉnh V_O, V_DC, I_DC" },
    { cau: "2", title: "Đọc giá trị linh kiện", ch: "Ch.1–2", min: 6, pts: 1.5, what: "6 ý × 0,25 điểm: 2 điện trở vòng màu (4 và 5 vòng), 2 tụ điện, 2 điện trở dán SMD" },
    { cau: "3", title: "Điện trở mắc hỗn hợp", ch: "Ch.1", min: 8, pts: 2, what: "Tính R_tđ, dòng mạch chính I, điện áp và dòng từng điện trở" },
    { cau: "4a", title: "Diode nối tiếp, song song, kết hợp", ch: "Ch.3", min: 6, pts: 1, what: "Xét diode nào dẫn, tính I_R, I_D, V_O" },
    { cau: "4b", title: "Diode Zener ổn áp", ch: "Ch.3", min: 6, pts: 1.5, what: "Tính I_S, I_RL, I_Z, P_Z và xét mạch có ổn áp không" },
    { cau: "5", title: "Transistor BJT: DCLL và điểm Q", ch: "Ch.4", min: 10, pts: 2, what: "Tính I_Cmax, vẽ DCLL, tính I_B, I_C, V_CE và chế độ cho 2 giá trị V_BB" }
  ];

  window.DKT_EXAMS = [
    {
      de: 1,
      rect: { pol: "+", vrms: 12, r: 1000 },
      parts: { bands4: ["Vàng", "Tím", "Đỏ", "Vàng kim"], bands5: ["Nâu", "Đen", "Đen", "Đỏ", "Nâu"], cap: ["104K", "22J"], smd: ["472", "4R7"] },
      res: { id: "d1", vcc: 24, stages: [["R1"], ["R2", "R3"], ["R4"]], values: { R1: 1000, R2: 3000, R3: 6000, R4: 1000 }, taps: [] },
      diode: { levels: [[si("D1")], [led("D2", 2)]], taps: [{ name: "O", node: 0 }, { name: "A", node: 1 }], vcc: 9, r: 330 },
      zener: { zener: Z91, vs: 18, rs: 220, rl: 680 },
      bjt: { vcc: 12, rb: 47000, rc: 1000, re: 100, beta: 100, vbb: [3, 9] }
    },
    {
      de: 2,
      rect: { pol: "-", vrms: 9, r: 470 },
      parts: { bands4: ["Nâu", "Xám", "Cam", "Vàng kim"], bands5: ["Đỏ", "Đỏ", "Đen", "Nâu", "Nâu"], cap: ["473J", "102K"], smd: ["1002", "R47"] },
      res: { id: "d2", vcc: 12, stages: [["R1"], ["R2", "R3"]], values: { R1: 680, R2: 1200, R3: 1800 }, taps: [] },
      diode: { levels: [[si("D1")], [si("D2"), led("D3", 2)]], taps: [{ name: "O", node: 0 }, { name: "A", node: 1 }], vcc: 12, r: 1000 },
      zener: { zener: Z51, vs: 12, rs: 150, rl: 330 },
      bjt: { vcc: 15, rb: 68000, rc: 1200, re: 0, beta: 120, vbb: [5, 12] }
    },
    {
      de: 3,
      rect: { pol: "+", vrms: 15, r: 2200 },
      parts: { bands4: ["Cam", "Cam", "Nâu", "Vàng kim"], bands5: ["Vàng", "Tím", "Đen", "Cam", "Nâu"], cap: ["223J", "47K"], smd: ["683", "2201"] },
      res: { id: "d3", vcc: 18, stages: [["R1", "R2"], ["R3"], ["R4"]], values: { R1: 2000, R2: 2000, R3: 1500, R4: 470 }, taps: [] },
      diode: { levels: [[si("D1"), ge("D2")]], taps: [{ name: "O", node: 0 }], vcc: 5, r: 470 },
      zener: { zener: Z91, vs: 20, rs: 330, rl: 1200 },
      bjt: { vcc: 12, rb: 39000, rc: 680, re: 220, beta: 80, vbb: [4, 12] }
    },
    {
      de: 4,
      rect: { pol: "-", vrms: 6, r: 330 },
      parts: { bands4: ["Xanh lục", "Xanh lam", "Đen", "Vàng kim"], bands5: ["Cam", "Trắng", "Đen", "Đen", "Nâu"], cap: ["334K", "68J"], smd: ["105", "1R0"] },
      res: { id: "d4", vcc: 30, stages: [["R1"], ["R2", "R3", "R4"], ["R5"]], values: { R1: 1000, R2: 3300, R3: 3300, R4: 3300, R5: 1200 }, taps: [] },
      diode: { levels: [[si("D1")], [si("D2", { rev: true })]], taps: [{ name: "O", node: 0 }, { name: "A", node: 1 }], vcc: 10, r: 1000 },
      zener: { zener: Z51, vs: 9, rs: 100, rl: 220 },
      bjt: { vcc: 10, rb: 56000, rc: 820, re: 100, beta: 150, vbb: [2, 10] }
    }
  ];
})();
