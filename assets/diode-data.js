/* Bai tap mach ung dung diode (Chuong 3). Moi bai la mach VCC -> R -> cac tang noi tiep xuong Mass:
   - levels: tung tang tu tren xuong; tang co 1 diode hoac nhieu diode song song.
     Diode: name, vf (V), kind "si" (diode thuong) | "led", rev = true neu lap phan cuc nghich.
   - taps: diem do V_O; node k = nut ngay tren tang k (dem tu 0). Luon co 1 diem do o node 0.
   - analysis: cho R, tinh dong va dien ap voi tung V_CC. design: chon R de dong qua moi diode dan = ma (mA).
   - from: bai goc trong vo (VD1 ... VD8) hoac bai phat trien.
   Dap an va loi giai tinh bang assets/diode-calc.js, khong ghi tay. */
(function () {
  "use strict";
  function si(name, opts) { return { name: name, vf: 0.7, kind: "si", rev: !!(opts && opts.rev) }; }
  function led(name, vf, opts) { return { name: name, vf: vf, kind: "led", rev: !!(opts && opts.rev) }; }

  window.DIODE_PROBLEMS = [
    {
      id: 1, from: "Theo vở · VD1", kind: "Dạng 1 · Một LED nối tiếp điện trở",
      levels: [[led("D", 2)]],
      taps: [{ name: "O", node: 0 }],
      analysis: { r: 220, vccs: [1.5, 5, 9] },
      design: { ma: 10, vccs: [5, 9, 12], askV: true }
    },
    {
      id: 2, from: "Theo vở · VD2", kind: "Dạng 2 · Diode Si nối tiếp LED",
      levels: [[si("D1")], [led("D2", 2)]],
      taps: [{ name: "O2", node: 0 }, { name: "O1", node: 1 }],
      analysis: { r: 220, vccs: [1.5, 5, 9] },
      design: { ma: 10, vccs: [5, 9, 12], askV: true }
    },
    {
      id: 3, from: "Theo vở · VD3", kind: "Dạng 3 · Ba diode nối tiếp (Si + 2 LED)",
      levels: [[si("D1")], [led("D2", 2)], [led("D3", 3)]],
      taps: [{ name: "O3", node: 0 }, { name: "O2", node: 1 }, { name: "O1", node: 2 }],
      analysis: { r: 220, vccs: [5, 9, 12] },
      design: { ma: 10, vccs: [9, 12, 15], askV: true }
    },
    {
      id: 4, from: "Phát triển từ VD3", kind: "Dạng 3 · Ba diode nối tiếp, Si nằm giữa",
      levels: [[led("D1", 2.2)], [si("D2")], [led("D3", 3.2)]],
      taps: [{ name: "O3", node: 0 }, { name: "O2", node: 1 }, { name: "O1", node: 2 }],
      analysis: { r: 330, vccs: [5, 9, 12] },
      design: { ma: 15, vccs: [9, 12, 24], askV: true }
    },
    {
      id: 5, from: "Theo vở · VD5", kind: "Dạng 4 · Có diode phân cực nghịch trong mạch nối tiếp",
      levels: [[si("D1", { rev: true })], [led("D2", 2)]],
      taps: [{ name: "O2", node: 0 }, { name: "O1", node: 1 }],
      analysis: { r: 220, vccs: [1.5, 5, 9] }
    },
    {
      id: 6, from: "Phát triển từ VD5", kind: "Dạng 4 · Diode phân cực nghịch nằm giữa hai LED",
      levels: [[led("D1", 2)], [si("D2", { rev: true })], [led("D3", 3)]],
      taps: [{ name: "O3", node: 0 }, { name: "O2", node: 1 }, { name: "O1", node: 2 }],
      analysis: { r: 220, vccs: [5, 12] }
    },
    {
      id: 7, from: "Theo vở · VD6", kind: "Dạng 5 · Hai LED cùng loại mắc song song",
      levels: [[led("D1", 2.7), led("D2", 2.7)]],
      taps: [{ name: "O", node: 0 }],
      analysis: { r: 330, vccs: [9] },
      design: { ma: 15, vccs: [9], askV: false }
    },
    {
      id: 8, from: "Theo vở · VD7", kind: "Dạng 6 · Song song các diode khác loại (ghim điện áp)",
      levels: [[led("D1", 2.2), led("D2", 3), led("D3", 2.2), led("D4", 3), led("D5", 2.2), si("D6", { rev: true })]],
      taps: [{ name: "O", node: 0 }],
      analysis: { r: 330, vccs: [9] },
      design: { ma: 10, vccs: [9], askV: false }
    },
    {
      id: 9, from: "Phát triển từ VD7", kind: "Dạng 6 · Song song LED đỏ, LED trắng và diode Si ngược",
      levels: [[led("D1", 2), led("D2", 3.2), led("D3", 2), si("D4", { rev: true })]],
      taps: [{ name: "O", node: 0 }],
      analysis: { r: 470, vccs: [12] },
      design: { ma: 12, vccs: [12], askV: false }
    },
    {
      id: 10, from: "Theo vở · VD8", kind: "Dạng 7 · Hai cụm song song mắc nối tiếp",
      levels: [[led("D1", 2.2), led("D2", 3), led("D3", 2.2)], [led("D4", 3), led("D5", 2.2, { rev: true }), led("D6", 3)]],
      taps: [{ name: "O2", node: 0 }, { name: "O1", node: 1 }],
      analysis: { r: 330, vccs: [12] },
      design: { ma: 10, vccs: [12], askV: false }
    },
    {
      id: 11, from: "Phát triển từ VD8", kind: "Dạng 7 · Cụm LED nối tiếp cụm diode Si",
      levels: [[led("D1", 3), led("D2", 2), led("D3", 2)], [si("D4"), si("D5"), led("D6", 2, { rev: true })]],
      taps: [{ name: "O2", node: 0 }, { name: "O1", node: 1 }],
      analysis: { r: 220, vccs: [9] },
      design: { ma: 10, vccs: [9], askV: false }
    }
  ];
})();
