/* Bai tap Ly thuyet mach Chuong 4: mach 3 pha tai doi xung (trang /baitap3pha).
   Mo hinh moi bai (conn, Ud/Up, R, X, Rd, Xd, source, zForm, ask): xem assets/bp3-calc.js.
   Dap an va loi giai tinh tu mo hinh, khong ghi tay. note: dong ghi chu them vao cuoi loi giai.
   "_x" trong chuoi = chi so duoi (I_p, U_d, R_d). */
window.BP3_SETS = [
  { id: 1, title: "Tải nối sao Y", problems: [1, 2] },
  { id: 2, title: "Tải nối tam giác Δ", problems: [3, 4] },
  { id: 3, title: "Có xét đường dây", problems: [5, 6] },
  { id: 4, title: "Đề ngẫu nhiên", random: true }
];

window.BP3_PROBLEMS = [
  {
    id: 1, title: "Tải Y có R_p, X_p, biết U_d",
    conn: "Y", Ud: 380, R: 20, X: 15,
    text: "Tải 3 pha đối xứng nối hình sao (Y) có R_p = 20 Ω, X_p = 15 Ω, đấu vào mạng điện 3 pha có U_d = 380 V. a/ Tính I_p và I_d. b/ Tính P, Q, S và cosφ của tải 3 pha.",
    ask: ["I_p", "I_d", "P", "Q", "S", "cosφ"],
    note: "Nếu làm tròn I_p = 8,78 A rồi mới bình phương thì được P ≈ 4625 W, Q ≈ 3469 VAr, S ≈ 5781 VA: vẫn chấm đúng vì lệch dưới 1%."
  },
  {
    id: 2, title: "Nguồn 220/380 V, tải Y có Z_p = 8 + j6 Ω",
    conn: "Y", Ud: 380, source: "220/380", zForm: "complex", R: 8, X: 6,
    text: "Nguồn 3 pha cân bằng 220 V/380 V cung cấp cho một tải đối xứng nối hình sao như hình vẽ. Tổng trở mỗi pha Z_p = 8 + j6 Ω. Tính U_d, U_p, I_d, I_p, P, Q, S.",
    ask: ["U_d", "U_p", "I_d", "I_p", "P", "Q", "S"],
    note: "Nếu lấy U_p = 220 V tròn thì I_p = 220/10 = 22 A, P = 3 × 8 × 22² = 11616 W, Q = 8712 VAr, S = 14520 VA: vẫn chấm đúng vì lệch dưới 1%."
  },
  {
    id: 3, title: "Tải Δ có R_p, X_p, biết U_d",
    conn: "D", Ud: 380, R: 9, X: 12,
    text: "Tải 3 pha đối xứng nối hình tam giác (Δ) có R_p = 9 Ω, X_p = 12 Ω, đấu vào mạng điện 3 pha có U_d = 380 V. a/ Tính I_p và I_d. b/ Tính P, Q, S và cosφ của tải 3 pha.",
    ask: ["I_p", "I_d", "P", "Q", "S", "cosφ"],
    note: "Nếu làm tròn I_p = 25,3 A rồi mới bình phương thì được P ≈ 17282 W, Q ≈ 23043 VAr, S ≈ 28803 VA: vẫn chấm đúng vì lệch dưới 1%."
  },
  {
    id: 4, title: "Tải Δ thuần trở R = 10 Ω",
    conn: "D", Ud: 380, R: 10, X: 0,
    text: "Tải 3 pha đối xứng nối hình tam giác (Δ), mỗi pha là điện trở R_p = 10 Ω (X_p = 0), đấu vào mạng có U_d = 380 V. Tính U_p, I_p, I_d và P.",
    ask: ["U_p", "I_p", "I_d", "P"],
    note: "Tải thuần trở nên φ = 0, cosφ = 1, Q = 0 và S = P. Viết gọn: I_d = 38√3 A."
  },
  {
    id: 5, title: "Tải Y có xét đường dây",
    conn: "Y", Ud: 380, R: 11, X: 14, Rd: 1, Xd: 2,
    text: "Mạng điện 3 pha có U_d = 380 V cấp cho tải đối xứng nối hình sao (Y), R_p = 11 Ω, X_p = 14 Ω. Mỗi dây dẫn có R_d = 1 Ω, X_d = 2 Ω. Tính I_d, I_p, điện áp U_p trên mỗi pha tải và P, Q, S của tải.",
    ask: ["I_d", "I_p", "U_p", "P", "Q", "S"],
    note: "So sánh: bỏ qua đường dây thì U_p = 220 V; đường dây gây sụt áp nên mỗi pha tải chỉ còn khoảng 195 V."
  },
  {
    id: 6, title: "Tải Δ có xét đường dây",
    conn: "D", Ud: 380, R: 33, X: 42, Rd: 1, Xd: 2,
    text: "Mạng điện 3 pha có U_d = 380 V cấp cho tải đối xứng nối hình tam giác (Δ), R_p = 33 Ω, X_p = 42 Ω. Mỗi dây dẫn có R_d = 1 Ω, X_d = 2 Ω. Tính I_d, I_p, điện áp U_p trên mỗi pha tải và P, Q, S của tải.",
    ask: ["I_d", "I_p", "U_p", "P", "Q", "S"],
    note: "Chỉ chia 3 trở kháng tải, không chia trở kháng đường dây: dây vẫn nối tiếp với từng pha của sơ đồ sao tương đương."
  }
];
