/* Giai mach noi tiep nhieu tang (moi tang la 1 dien tro hoac 1 cum song song) + doc vong mau dien tro.
   Dung chung cho trang /phanapphandong va test/phanap-calc.test.js. */
(function (root) {
  "use strict";

  var DIGIT_COLORS = ["Đen", "Nâu", "Đỏ", "Cam", "Vàng", "Xanh lục", "Xanh lam", "Tím", "Xám", "Trắng"];
  var MULT_COLORS = { "-2": "Bạc", "-1": "Vàng kim" };
  var TOLERANCE = "Vàng kim";

  function clean(x) { return parseFloat(Number(x).toPrecision(12)); }

  /** @param {number[]} rs @returns {number} dien tro tuong duong cua cac nhanh song song */
  function parallel(rs) {
    return clean(1 / rs.reduce(function (s, r) { return s + 1 / r; }, 0));
  }

  /**
   * @param {{vcc:number, stages:string[][], values:Object<string,number>}} c
   * @returns {{rtd:number, current:number, stages:Array<{r:number, v:number, below:number, branches:Array<{name:string, i:number}>}>}}
   *   i tinh bang A, v bang V; below = tong dien tro tu tang nay xuong Mass.
   */
  function solve(c) {
    var rs = c.stages.map(function (names) {
      return names.length === 1 ? c.values[names[0]] : parallel(names.map(function (n) { return c.values[n]; }));
    });
    var rtd = clean(rs.reduce(function (s, r) { return s + r; }, 0));
    var current = c.vcc / rtd;
    var below = rtd;
    var stages = rs.map(function (r, k) {
      var v = current * r;
      var st = {
        r: r, v: v, below: below,
        branches: c.stages[k].map(function (n) { return { name: n, i: v / c.values[n] }; })
      };
      below = clean(below - r);
      return st;
    });
    return { rtd: rtd, current: current, stages: stages };
  }

  /**
   * @param {number} ohm @param {4|5} bands
   * @returns {string[]|null} ten mau tu vong 1 den vong sai so; null neu gia tri can nhieu chu so co nghia hon
   */
  function colorBands(ohm, bands) {
    var sig = bands === 4 ? 2 : 3;
    var exp = Math.floor(Math.log10(ohm)) - (sig - 1);
    var mant = Math.round(ohm / Math.pow(10, exp));
    if (Math.abs(mant * Math.pow(10, exp) - ohm) > 1e-9 * ohm || exp < -2 || exp > 9) return null;
    var digits = String(mant).split("").map(function (d) { return DIGIT_COLORS[+d]; });
    var mult = exp >= 0 ? DIGIT_COLORS[exp] : MULT_COLORS[String(exp)];
    return digits.concat([mult, TOLERANCE]);
  }

  /** @param {string} raw so hoc sinh nhap, chap nhan dau phay thap phan @returns {number} NaN neu khong doc duoc */
  function parseAnswer(raw) {
    var s = String(raw).trim().replace(/\s+/g, "");
    if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, "");
    s = s.replace(",", ".");
    return /^-?(\d+\.?\d*|\.\d+)$/.test(s) ? parseFloat(s) : NaN;
  }

  /** Dung khi lech <= 1% (sai so do lam tron tung buoc) hoac <= 0,02 don vi. */
  function close(got, want) {
    if (!isFinite(got)) return false;
    var d = Math.abs(got - want);
    return d <= 0.02 || d <= Math.abs(want) * 0.01;
  }

  /** @param {number} x @param {number} [dec=2] @returns {string} so gon, dau phay thap phan: 2680 ; 13,43 ; 1,8 */
  function fmt(x, dec) {
    var d = dec === undefined ? 2 : dec;
    var s = (Math.round(x * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d);
    if (d > 0) s = s.replace(/0+$/, "").replace(/\.$/, "");
    return s.replace(".", ",");
  }

  /** @param {number} x @returns {string} ket qua theo barem: luon 2 chu so thap phan, vd 12,00 ; 2680,00 */
  function fmtResult(x) {
    return (Math.round(x * 100) / 100).toFixed(2).replace(".", ",");
  }

  /** @param {number} ohm @returns {string} vd "330 Ω", "1,2 kΩ" */
  function fmtOhm(ohm) {
    return ohm >= 1000 ? fmt(ohm / 1000, 3) + " kΩ" : fmt(ohm, 2) + " Ω";
  }

  root.PA_CALC = {
    parallel: parallel, solve: solve, colorBands: colorBands,
    parseAnswer: parseAnswer, close: close, fmt: fmt, fmtResult: fmtResult, fmtOhm: fmtOhm
  };
})(typeof window !== "undefined" ? window : globalThis);
