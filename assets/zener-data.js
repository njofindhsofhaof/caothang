/* Bai tap Chuong 3: mach on ap Zener (/baitapzener).
   - type "z1": biet V_S, R_S, R_L -> I_S, I_RL, I_Z, P_Z. "z2": tim khoang V_S. "z3": tim khoang R_L.
     zener: {vz (V), izmin, izmax (A)}. Dap an va loi giai tinh bang assets/zener-calc.js, khong ghi tay. */
(function () {
  "use strict";
  var Z91 = { vz: 9.1, izmin: 0.002, izmax: 0.035 };
  var Z51 = { vz: 5.1, izmin: 0.001, izmax: 0.05 };

  window.ZENER_PROBLEMS = [
    { id: 1, type: "z1", kind: "Zener dạng 1 · Tính dòng và công suất", zener: Z91, vs: 15, rs: 150, rl: 1000 },
    { id: 2, type: "z2", kind: "Zener dạng 2 · Khoảng thay đổi của V_S", zener: Z91, rs: 150, rl: 1000 },
    { id: 3, type: "z3", kind: "Zener dạng 3 · Khoảng thay đổi của R_L", zener: Z91, vs: 15, rs: 150 },
    { id: 4, type: "z1", kind: "Zener dạng 1 · Zener 5,1 V", zener: Z51, vs: 12, rs: 100, rl: 200 },
    { id: 5, type: "z2", kind: "Zener dạng 2 · Zener 5,1 V", zener: Z51, rs: 100, rl: 200 },
    { id: 6, type: "z3", kind: "Zener dạng 3 · Zener 5,1 V", zener: Z51, vs: 12, rs: 100 }
  ];
})();
