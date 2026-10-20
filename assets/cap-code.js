/* Quy tac doc ma tu dien (ma 1-2 so doc thang pF, ma 3 so = 2 so co nghia x 10^so cuoi) + chu sai so J/K.
   Dung chung cho trang /madientudien va test/cap-code.test.js. */
(function (root) {
  "use strict";

  var TOL = { J: 5, K: 10 };
  var SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  var UNIT = { p: 1, n: 1e3, u: 1e6, "µ": 1e6 };

  function clean(x) { return parseFloat(Number(x).toPrecision(12)); }

  function normalizeCode(raw) { return String(raw).trim().toUpperCase().replace(/\s+/g, ""); }

  /** @param {string} code vd "472J", "8J", "220K" @returns {{pf:number, letter:string, tol:number}|null} */
  function decode(code) {
    var m = /^(\d{1,3})([JK])$/.exec(normalizeCode(code));
    if (!m) return null;
    var d = m[1];
    var pf = d.length < 3 ? +d : +d.slice(0, 2) * Math.pow(10, +d[2]);
    return { pf: pf, letter: m[2], tol: TOL[m[2]] };
  }

  /**
   * Doc gia tri hoc sinh nhap. Khong ghi don vi = pF. Chap nhan p/pF, n/nF, u/µ/uF; dau phay hoac cham thap phan.
   * @param {string} raw @returns {number} gia tri pF, NaN neu khong doc duoc
   */
  function parseValue(raw) {
    var s = String(raw).trim().replace(/\s+/g, "").replace(/μ/g, "µ");
    var m = /^([\d.,]+)([pnuµ])?F?$/i.exec(s);
    if (!m) return NaN;
    var n = m[1];
    if (/^\d{1,3}(\.\d{3})+$/.test(n)) n = n.replace(/\./g, "");
    n = n.replace(",", ".");
    if (!/^(\d+\.?\d*|\.\d+)$/.test(n)) return NaN;
    var unit = m[2] ? m[2].toLowerCase() : "p";
    return clean(parseFloat(n) * UNIT[unit]);
  }

  function sameValue(a, b) { return isFinite(a) && Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b)); }

  /** @param {number} x @returns {string} so kieu Viet Nam: 4.700 ; 0,047 */
  function num(x) {
    var parts = String(clean(x)).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",");
  }

  /** Ghi theo de: duoi 1.000 pF -> pF, duoi 100 nF -> nF, con lai -> µF. */
  function formatCap(pf) {
    if (pf < 1000) return num(pf) + " pF";
    if (pf < 1e5) return num(pf / 1e3) + " nF";
    return num(pf / 1e6) + " µF";
  }

  /** @param {number} pf @returns {string} vd "4.700 pF = 4,7 nF = 0,0047 µF" */
  function allUnits(pf) {
    var parts = [num(pf) + " pF"];
    if (pf >= 100) parts.push(num(pf / 1e3) + " nF");
    if (pf >= 1e4) parts.push(num(pf / 1e6) + " µF");
    return parts.join(" = ");
  }

  /** @param {string} code @returns {string} loi giai doc ma */
  function explain(code) {
    var c = normalizeCode(code), d = decode(c);
    if (!d) return c + ": mã không hợp lệ";
    var digits = c.slice(0, -1);
    var how = digits.length < 3
      ? "mã " + digits.length + " số, đọc thẳng"
      : digits.slice(0, 2) + " × 10" + SUP[+digits[2]] + " pF" + (digits[2] === "0" ? " (bẫy: số 0 cuối là × 10⁰)" : "");
    return c + " → " + how + " = " + allUnits(d.pf) + ", " + d.letter + " = ±" + d.tol + "%";
  }

  /** @param {number} pf @param {string} letter @returns {string} ma ngan nhat: duoi 100 pF ghi thang, con lai 3 so */
  function encode(pf, letter) {
    if (pf < 100 && pf === Math.round(pf)) return pf + letter;
    var exp = Math.floor(Math.log10(pf)) - 1;
    return String(Math.round(pf / Math.pow(10, exp))) + exp + letter;
  }

  root.CAP_CODE = {
    TOL: TOL, decode: decode, normalizeCode: normalizeCode, parseValue: parseValue, sameValue: sameValue,
    formatCap: formatCap, allUnits: allUnits, explain: explain, encode: encode
  };
})(typeof window !== "undefined" ? window : globalThis);
