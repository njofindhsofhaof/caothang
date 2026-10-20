/* 6 bai tap Dinh ly phan ap & phan dong. Moi bai la mach noi tiep nhieu tang tu VCC xuong Mass:
   - stages: tung tang tu tren xuong; tang co 1 ten = dien tro don, nhieu ten = cum song song.
   - taps: diem do V_O; node k = nut ngay tren tang thu k (dem tu 0).
   - groups: (tuy chon) ten cum song song theo chi so tang, vd { 1: "A" }.
   - asks: yeu cau de bai; "_x" hoac "_{xy}" hien thanh chi so duoi.
   Dap an va loi giai deu tinh tu so lieu bang assets/phanap-calc.js, khong ghi tay. */
window.PA_PROBLEMS = [
  {
    id: 1,
    kind: "Dạng 1 · 3 tầng nối tiếp + cụm song song ở đáy",
    vcc: 36,
    stages: [["R1"], ["R2"], ["R3"], ["R4", "R5"]],
    values: { R1: 330, R2: 470, R3: 680, R4: 2000, R5: 3000 },
    taps: [{ name: "O1", node: 3 }, { name: "O2", node: 2 }, { name: "O3", node: 1 }],
    asks: [
      "a) Đọc vòng màu (4VM và 5VM, sai số Vàng kim = 5%) cho cả 5 điện trở.",
      "b) Tính điện trở tương đương R_tđ.",
      "c) Tính dòng điện toàn mạch I và các dòng nhánh I_4, I_5.",
      "d) Dùng định lý phân áp tính V_R1, V_R2, V_R3, V_R45 và V_O1, V_O2, V_O3."
    ]
  },
  {
    id: 2,
    kind: "Dạng 2 · Cụm song song 4 nhánh kẹp giữa",
    vcc: 24,
    stages: [["R1"], ["R2", "R3", "R4", "R5"], ["R6"]],
    values: { R1: 1000, R2: 1200, R3: 1200, R4: 600, R5: 300, R6: 850 },
    taps: [{ name: "O1", node: 2 }, { name: "O2", node: 1 }],
    asks: [
      "a) Đọc vòng màu (4VM và 5VM, sai số VK = 5%) cho các điện trở.",
      "b) Tính R_{song song} (R_2345) và R_tđ toàn mạch.",
      "c) Dùng định lý phân áp tính V_R1, V_{song song}, V_R6 và V_O1, V_O2.",
      "d) Tính dòng tổng I và dòng qua 4 nhánh song song I_2, I_3, I_4, I_5."
    ]
  },
  {
    id: 3,
    kind: "Dạng 1 · 4 tầng nối tiếp + cụm song song ở đáy",
    vcc: 48,
    stages: [["R1"], ["R2"], ["R3"], ["R4"], ["R5", "R6"]],
    values: { R1: 150, R2: 270, R3: 390, R4: 470, R5: 1800, R6: 1800 },
    taps: [{ name: "O1", node: 4 }, { name: "O2", node: 3 }, { name: "O3", node: 2 }, { name: "O4", node: 1 }],
    asks: [
      "a) Đọc vòng màu (4VM và 5VM, sai số VK = 5%).",
      "b) Tính R_tđ toàn mạch.",
      "c) Dùng phân áp tính lần lượt V_O1, V_O2, V_O3, V_O4.",
      "d) Tính dòng điện tổng I và các dòng rẽ I_5, I_6."
    ]
  },
  {
    id: 4,
    kind: "Dạng 2 · Trên và dưới cụm song song đều có 2 điện trở nối tiếp",
    vcc: 30,
    stages: [["R1"], ["R2"], ["R3", "R4", "R5"], ["R6"], ["R7"]],
    values: { R1: 200, R2: 300, R3: 1500, R4: 1500, R5: 750, R6: 400, R7: 225 },
    taps: [{ name: "O1", node: 4 }, { name: "O2", node: 3 }, { name: "O3", node: 2 }, { name: "O4", node: 1 }],
    asks: [
      "a) Đọc vòng màu (4VM và 5VM, sai số VK = 5%).",
      "b) Tính điện trở tương đương cụm song song và toàn mạch R_tđ.",
      "c) Dùng phân áp tính V_O1, V_O2, V_O3, V_O4.",
      "d) Tính dòng tổng I và dòng phân nhánh I_3, I_4, I_5."
    ]
  },
  {
    id: 5,
    kind: "Dạng 1 · Cụm đáy gồm 3 nhánh song song",
    vcc: 24,
    stages: [["R1"], ["R2"], ["R3"], ["R4", "R5", "R6"]],
    values: { R1: 120, R2: 180, R3: 300, R4: 1200, R5: 1200, R6: 600 },
    taps: [{ name: "O1", node: 3 }, { name: "O2", node: 2 }, { name: "O3", node: 1 }],
    asks: [
      "a) Đọc vòng màu (4VM và 5VM, sai số VK = 5%).",
      "b) Tính điện trở tương đương R_tđ.",
      "c) Tính dòng điện toàn mạch I và dòng rẽ I_4, I_5, I_6.",
      "d) Dùng phân áp tính V_R1, V_R2, V_R3 và các mốc áp V_O1, V_O2, V_O3."
    ]
  },
  {
    id: 6,
    kind: "Dạng 2 · Siêu nâng cao: 2 cụm song song nhiều tầng",
    vcc: 36,
    stages: [["R1"], ["R2", "R3"], ["R4"], ["R5", "R6", "R7"], ["R8"]],
    groups: { 1: "A", 3: "B" },
    values: { R1: 360, R2: 1000, R3: 1000, R4: 240, R5: 1500, R6: 1500, R7: 750, R8: 325 },
    taps: [{ name: "O1", node: 4 }, { name: "O2", node: 3 }, { name: "O3", node: 2 }, { name: "O4", node: 1 }],
    asks: [
      "a) Đọc vòng màu (4VM và 5VM, sai số VK = 5%).",
      "b) Tính điện trở tương đương từng cụm song song và toàn mạch R_tđ.",
      "c) Dùng định lý phân áp tính V_O1, V_O2, V_O3, V_O4.",
      "d) Tính dòng điện toàn mạch I, dòng qua Cụm A (I_2, I_3) và Cụm B (I_5, I_6, I_7)."
    ]
  }
];
