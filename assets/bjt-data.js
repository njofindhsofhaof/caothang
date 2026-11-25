/* Bai tap Chuong 4: transistor BJT (/baitaptransistor). Dap an va loi giai tinh bang assets/bjt-calc.js, khong ghi tay.
   - type "q":     Dang 1, mach phan cuc co dinh 2 nguon: vcc, rb, rc, re (ohm, 0 = khong co R_E), beta, vbb: [cac truong hop V_BB].
   - type "act":   Dang 2 khuech dai: vcc, ic (A), vce + vceText (cach de cho), beta, ve.
   - type "sat":   Dang 2 bao hoa: vcc, icmax (A), beta, k, ve.
   - type "satrb": Dang 2 bao hoa cho san R_C, R_E: vcc, rc, re, beta, k. */
(function () {
  "use strict";
  window.BJT_PROBLEMS = [
    { id: 1, type: "q", kind: "Dạng 1 · Vẽ DCLL và xác định điểm làm việc Q",
      vcc: 12, rb: 33000, rc: 820, re: 100, beta: 100, vbb: [0, 5, 12] },
    { id: 2, type: "q", kind: "Dạng 1 · Mạch phân cực cố định không có R_E",
      vcc: 12, rb: 43000, rc: 680, re: 0, beta: 100, vbb: [0, 5, 9] },
    { id: 3, type: "act", kind: "Dạng 2 · Chọn R_B, R_C, R_E cho chế độ khuếch đại",
      vcc: 12, ic: 0.01, vce: 6, vceText: "½V_CC", beta: 100, ve: 1.2 },
    { id: 4, type: "act", kind: "Dạng 2 · Khuếch đại với nguồn 15 V",
      vcc: 15, ic: 0.006, vce: 5, vceText: "⅓V_CC", beta: 150, ve: 1.5 },
    { id: 5, type: "sat", kind: "Dạng 2 · Chọn R_B, R_C, R_E cho chế độ bão hoà",
      vcc: 12, icmax: 0.05, beta: 50, k: 2, ve: 1.1 },
    { id: 6, type: "satrb", kind: "Dạng 2 · Biết R_C, R_E, tìm R_B để bão hoà",
      vcc: 12, rc: 330, re: 100, beta: 100, k: 3 }
  ];
})();
