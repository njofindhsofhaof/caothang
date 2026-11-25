/* Tinh toan rieng cho trang /dekiemtradientucoban: chinh luu ban ky (Chuong 3) va doc vong mau dien tro (Chuong 1).
   Cac dang con lai dung lai phanap-calc.js, diode-calc.js, zener-calc.js, bjt-calc.js, cap-code.js, smd-code.js.
   Dung chung cho assets/dkt.js va test/dkt-calc.test.js. Don vi: V, ohm, A. */
(function (root) {
  "use strict";

  var VD = 0.7;
  var DIGITS = ["Đen", "Nâu", "Đỏ", "Cam", "Vàng", "Xanh lục", "Xanh lam", "Tím", "Xám", "Trắng"];
  var MULT = { "Vàng kim": -1, "Bạc": -2 };
  var TOL = { "Nâu": 1, "Đỏ": 2, "Xanh lục": 0.5, "Xanh lam": 0.25, "Tím": 0.1, "Vàng kim": 5, "Bạc": 10 };

  function clean(x) { return parseFloat(Number(x).toPrecision(12)); }

  /**
   * Chinh luu ban ky dung diode Si, bien ap cho V_rms.
   * V_m = V_rms·√2 (lam tron 0,01 V); dinh ra = V_m − 0,7; V_DC = 0,318·(V_m − 0,7); I_DC = V_DC / R. Ban ky am: dao dau.
   * @param {{pol:"+"|"-", vrms:number, r:number}} c
   * @returns {{sign:number, vm:number, vop:number, vdc:number, idc:number}} vop, vdc, idc co dau (am khi pol "-")
   */
  function rect(c) {
    var sign = c.pol === "-" ? -1 : 1;
    var vm = Math.round(c.vrms * Math.SQRT2 * 100) / 100;
    var vop = clean(vm - VD);
    var vdc = Math.round(0.318 * vop * 100) / 100;
    return { sign: sign, vm: vm, vop: sign * vop, vdc: sign * vdc, idc: sign * vdc / c.r };
  }

  /**
   * Doc dien tro vong mau 4 hoac 5 vong.
   * @param {string[]} bands ten mau tu vong 1
   * @returns {{digits:number[], exp:number, ohm:number, tol:number, min:number, max:number}|null}
   */
  function readBands(bands) {
    if (bands.length !== 4 && bands.length !== 5) return null;
    var sig = bands.slice(0, bands.length - 2).map(function (b) { return DIGITS.indexOf(b); });
    var mb = bands[bands.length - 2];
    var exp = MULT[mb] !== undefined ? MULT[mb] : DIGITS.indexOf(mb);
    var tol = TOL[bands[bands.length - 1]];
    if (sig.some(function (d) { return d < 0; }) || exp < -2 || exp > 9 || tol === undefined) return null;
    var ohm = clean(parseInt(sig.join(""), 10) * Math.pow(10, exp));
    return { digits: sig, exp: exp, ohm: ohm, tol: tol, min: clean(ohm * (1 - tol / 100)), max: clean(ohm * (1 + tol / 100)) };
  }

  root.DKT_CALC = { VD: VD, DIGITS: DIGITS, TOL: TOL, rect: rect, readBands: readBands };
})(typeof window !== "undefined" ? window : globalThis);
