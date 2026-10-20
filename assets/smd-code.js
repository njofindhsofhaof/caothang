/* Quy tac doc ma dien tro dan SMD (3 so, 4 so, chu R lam dau thap phan) + doc gia tri hoc sinh nhap.
   Dung chung cho trang /dientrodansmd va test/smd-code.test.js. */
(function (root) {
  "use strict";

  var SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  var PREFIX = { "": 1, m: 1e-3, k: 1e3, K: 1e3, M: 1e6, meg: 1e6, Meg: 1e6, MEG: 1e6 };

  function clean(x) { return parseFloat(Number(x).toPrecision(12)); }

  /** @param {string} code ma in tren than (vd "103", "4R7", "R010") @returns {number} gia tri ohm, NaN neu sai dinh dang */
  function decode(code) {
    var c = String(code).trim().toUpperCase();
    if (/^0+$/.test(c)) return 0;
    if (/^\d*R\d+$|^\d+R$/.test(c)) return clean(parseFloat(c.replace("R", ".")));
    if (/^\d{3}$/.test(c)) return clean(parseInt(c.slice(0, 2), 10) * Math.pow(10, +c[2]));
    if (/^\d{4}$/.test(c)) return clean(parseInt(c.slice(0, 3), 10) * Math.pow(10, +c[3]));
    return NaN;
  }

  function group(n) {
    var parts = String(n).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
  }

  /** @param {number} v gia tri ohm @returns {string} vd "4.7 kΩ", "0.01 Ω (10 mΩ)" */
  function formatOhm(v) {
    if (v === 0) return "0 Ω";
    if (v >= 1e6) return clean(v / 1e6) + " MΩ";
    if (v >= 1e3) return clean(v / 1e3) + " kΩ";
    if (v >= 1) return clean(v) + " Ω";
    return clean(v) + " Ω (" + clean(v * 1e3) + " mΩ)";
  }

  /** @param {string} code @returns {string} cach tinh tung buoc */
  function explain(code) {
    var c = String(code).trim().toUpperCase();
    var v = decode(c);
    if (isNaN(v)) return c + ": mã không hợp lệ";
    if (v === 0) return c + " → 0 Ω (điện trở cầu nối – jumper)";
    if (c.indexOf("R") >= 0) return c + " → R là dấu thập phân: " + c.replace("R", ".").replace(/^\./, "0.") + " Ω = " + formatOhm(v);
    var exp = +c[c.length - 1];
    var detail = c + " → " + parseInt(c.slice(0, -1), 10) + " × 10" + SUP[exp] + " = " + group(v) + " Ω";
    return v >= 1e3 ? detail + " = " + formatOhm(v) : detail;
  }

  /** Doc gia tri hoc sinh nhap: "10k", "4,7 kΩ", "4k7", "10m" (mili), "1M" (mega), "0.22" @returns {number} NaN neu khong doc duoc */
  function parseValue(raw) {
    var s = String(raw).trim().replace(/,/g, ".").replace(/\s+/g, "").replace(/(Ω|ohms?|ôm)$/i, "");
    var m = /^(\d+(?:\.\d+)?|\.\d+)(m|k|K|M|meg|Meg|MEG)?$/.exec(s);
    if (m) return clean(parseFloat(m[1]) * PREFIX[m[2] || ""]);
    var rkm = /^(\d+)([RrkKM])(\d+)$/.exec(s);
    if (rkm) {
      var mult = rkm[2] === "R" || rkm[2] === "r" ? 1 : PREFIX[rkm[2]];
      return clean(parseFloat(rkm[1] + "." + rkm[3]) * mult);
    }
    return NaN;
  }

  function sameValue(a, b) {
    if (isNaN(a) || isNaN(b)) return false;
    return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b));
  }

  function normalizeCode(raw) { return String(raw).trim().toUpperCase().replace(/\s+/g, ""); }

  root.SMD_CODE = { decode: decode, formatOhm: formatOhm, explain: explain, parseValue: parseValue, sameValue: sameValue, normalizeCode: normalizeCode };
})(typeof window !== "undefined" ? window : globalThis);
