/* 4 bai tap Mach xac lap dieu hoa (mon Ly thuyet mach). Moi mach: nguon -> series (noi tiep, tren day tren)
   -> branches (cac nhanh song song, phan tu tu tren xuong).
   - source: type "V" | "I"; mag + deg la anh phuc nguon, mac dinh mag la BIEN DO (ca de dang phuc lan dang cos);
     omega (rad/s) khi de cho L theo H, C theo F (mach chua phuc hoa);
     fn: "cos" khi de cho nguon dang cos (mac dinh "sin" cho phuong trinh tuc thoi);
     symbol: ac | pm | arrow; label = chu ghi o nguon; complexLabel = chu ghi sau khi phuc hoa.
   - phan tu: R (value Ω), L/C (x = Ω, hoac h = H / f = F); label / complexLabel nhu tren.
   - mark: dau +/− va ten dien ap tren phan tu; nodes: { chi so phan tu: ten nut ngay duoi phan tu }.
   - diff.loop: ve vong kin K2 giua 2 nut; voltages[].loop: cac dong giai thich vong K2 truoc text.
   - voltages: dien ap can tinh = tong (sign) dien ap roi tren cac phan tu (branch, elem); text = cach viet
     ("^I" = I co cham tren dau, tuc dai luong dang phuc).
   Dap an + loi giai tinh tu so lieu bang assets/xlhd-calc.js, khong ghi tay. */
window.XL_PROBLEMS = [
  {
    id: 1,
    title: "Hai nhánh RC và RL mắc song song với nguồn áp",
    source: { type: "V", mag: 100, deg: 0, symbol: "ac", label: "100∠0° V" },
    totalLabel: "I_o",
    branches: [
      { current: "I_1", elems: [{ kind: "R", value: 1, label: "1 Ω" }, { kind: "C", x: 1, label: "−j1 Ω", mark: "U_C" }], nodes: { 0: "1" } },
      { current: "I_2", elems: [{ kind: "R", value: 1, label: "1 Ω" }, { kind: "L", x: 1, label: "j1 Ω", mark: "U_L" }], nodes: { 0: "2" } }
    ],
    diff: { name: "V_12", from: [0, 0], to: [1, 0], loop: true },
    voltages: [{
      name: "V_12",
      loop: ["Chọn vòng kín 1 → C → B → L → 2 → 1 (vòng trên hình), áp dụng K2:", "^V_12 + ^U_L − ^U_C = 0"],
      text: "⇒ ^V_12 = ^U_C − ^U_L = ^I_1·Z_C − ^I_2·Z_L = ^I_1·(−j1) − ^I_2·(j1)",
      terms: [{ branch: 0, elem: 1, sign: 1 }, { branch: 1, elem: 1, sign: -1 }]
    }],
    asks: "Viết phương trình dòng điện trên các nhánh và V_12. Tính P, Q, S của nguồn cấp cho các tải."
  },
  {
    id: 2,
    title: "Nguồn dòng cấp cho hai nhánh RL và RC",
    source: { type: "I", mag: 5, deg: 90, symbol: "arrow", label: "5∠90° A" },
    branches: [
      { current: "I_1", elems: [{ kind: "R", value: 5, label: "5 Ω" }, { kind: "L", x: 5, label: "j5 Ω" }] },
      { current: "I_2", elems: [{ kind: "R", value: 2, label: "2 Ω" }, { kind: "C", x: 2, label: "−j2 Ω", mark: "V_x" }] }
    ],
    voltages: [{ name: "V_x", text: "^V_x = ^I_2·Z_C = ^I_2·(−j2)", terms: [{ branch: 1, elem: 1, sign: 1 }] }],
    asks: "Viết phương trình dòng điện trên các nhánh và V_x. Tính P, Q, S của nguồn cấp cho các tải."
  },
  {
    id: 3,
    title: "Điện trở nối tiếp với cụm L // (R nối tiếp C)",
    source: { type: "V", mag: 50, deg: 0, symbol: "pm", label: "50∠0° V" },
    totalLabel: "I_o",
    series: [{ kind: "R", value: 5, label: "5 Ω" }],
    branches: [
      { current: "I_1", elems: [{ kind: "L", x: 10, label: "j10 Ω" }] },
      { current: "I_2", elems: [{ kind: "R", value: 3, label: "3 Ω" }, { kind: "C", x: 4, label: "−j4 Ω" }] }
    ],
    voltages: [],
    asks: "Viết phương trình dòng điện trên các nhánh. Tính P, Q, S của nguồn cấp cho các tải."
  },
  {
    id: 4,
    title: "Mạch chưa phức hoá: nguồn 10cos2t, L và R nối tiếp, cụm R // C",
    source: {
      type: "V", mag: 10, deg: 0, omega: 2, fn: "cos", symbol: "ac",
      label: "10cos2t", complexLabel: "10∠0° V"
    },
    totalLabel: "I_o",
    series: [
      { kind: "L", h: 1, label: "1 H", complexLabel: "j2 Ω" },
      { kind: "R", value: 6, label: "6 Ω", complexLabel: "6 Ω" }
    ],
    branches: [
      { current: "I_1", elems: [{ kind: "R", value: 2, label: "2 Ω", complexLabel: "2 Ω" }] },
      { current: "I_2", elems: [{ kind: "C", f: 0.25, label: "1/4 F", complexLabel: "−j2 Ω", mark: "U_c" }] }
    ],
    voltages: [{ name: "U_c", text: "^U_c = ^I_2·Z_C = ^I_2·(−j2)", terms: [{ branch: 1, elem: 0, sign: 1 }] }],
    asks: "Viết phương trình dòng điện trên các nhánh và phương trình điện áp u_c(t). Tính P, Q, S của nguồn cấp cho các tải."
  }
];
