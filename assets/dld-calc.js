/* Tinh dien tro Shunt (mo rong thang do dong) va dien tro phu (mo rong thang do ap) cho co cau do tu dien.
   Dung chung cho trang /dekiemtradoluong va test/dld-calc.test.js. */
(function (root) {
  "use strict";

  var SIG_DIGITS = 4;

  function clean(x) { return parseFloat(Number(x).toPrecision(12)); }

  /** @param {number} rg @param {number} igm @param {number[]} ranges dong toan thang (A) @returns {number[]} */
  function shuntSeparate(rg, igm, ranges) {
    return ranges.map(function (i) { return clean(rg * igm / (i - igm)); });
  }

  /**
   * Mach Shunt van nang (hinh 3.6): A -> shunt R1+R2+R3, B -> shunt R1+R2 (R3 noi tiep co cau), C -> shunt R1.
   * @returns {{rsh:number, r12:number, r1:number, r2:number, r3:number}}
   */
  function shuntUniversal(rg, igm, ranges) {
    var rsh = rg * igm / (ranges[0] - igm);
    var r12 = (rg + rsh) * igm / ranges[1];
    var r1 = (rg + rsh) * igm / ranges[2];
    return { rsh: clean(rsh), r12: clean(r12), r1: clean(r1), r2: clean(r12 - r1), r3: clean(rsh - r12) };
  }

  /** @param {number[]} ranges dien ap toan thang (V) @returns {number[]} */
  function multSeparate(rg, igm, ranges) {
    return ranges.map(function (u) { return clean(u / igm - rg); });
  }

  /** Mach dien tro phu van nang (hinh 3.18): A -> R1, B -> R1+R2, C -> R1+R2+R3. */
  function multUniversal(rg, igm, ranges) {
    var out = [], used = rg;
    ranges.forEach(function (u) {
      var rk = u / igm - used;
      out.push(clean(rk));
      used += rk;
    });
    return out;
  }

  function num(x) {
    return String(parseFloat(Number(x).toPrecision(SIG_DIGITS))).replace(".", ",");
  }

  function scaled(x, units) {
    var ax = Math.abs(x);
    for (var i = units.length - 1; i > 0; i--) {
      if (ax >= units[i][0] * 0.99995) return num(x / units[i][0]) + " " + units[i][1];
    }
    return num(x / units[0][0]) + " " + units[0][1];
  }

  function fmtOhm(r) { return scaled(r, [[1, "Ω"], [1e3, "kΩ"], [1e6, "MΩ"]]); }
  function fmtA(i) { return scaled(i, [[1e-6, "µA"], [1e-3, "mA"], [1, "A"]]); }
  function fmtV(u) { return num(u) + " V"; }

  root.DLD_CALC = {
    shuntSeparate: shuntSeparate, shuntUniversal: shuntUniversal,
    multSeparate: multSeparate, multUniversal: multUniversal,
    num: num, fmtOhm: fmtOhm, fmtA: fmtA, fmtV: fmtV
  };
})(typeof window !== "undefined" ? window : globalThis);
