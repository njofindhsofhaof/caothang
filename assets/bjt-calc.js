/* Tinh toan cho trang /baitaptransistor: transistor BJT NPN (Chuong 4 Dien tu co ban).
   Dang 1: mach phan cuc co dinh 2 nguon -> DCLL, diem Q, che do (ngung dan / khuech dai / bao hoa).
   Dang 2: cho Q, tim R_E, R_C, R_B (khuech dai va bao hoa) + chon gia tri chuan E12.
   Dung chung cho assets/bjt.js va test/bjt-calc.test.js. Don vi: V, ohm, A. */
(function (root) {
  "use strict";

  var VBE = 0.7, VBE_SAT = 0.8, VCE_SAT = 0.2;
  var E12 = [10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82];

  /** Cac gia tri E12 tu 1 ohm toi 10 Mohm, tang dan. */
  var SERIES = (function () {
    var out = [];
    for (var e = -1; e <= 5; e++) E12.forEach(function (m) { out.push(Math.round(m * Math.pow(10, e) * 10) / 10); });
    return out;
  })();

  /** Gia tri E12 gan nhat (theo hieu so). */
  function e12Nearest(x) {
    return SERIES.reduce(function (best, v) { return Math.abs(v - x) < Math.abs(best - x) ? v : best; }, SERIES[0]);
  }
  /** Gia tri E12 lon nhat khong vuot qua x (chon R_B nho hon de chac chan bao hoa). */
  function e12Below(x) {
    var r = SERIES[0];
    SERIES.forEach(function (v) { if (v <= x * (1 + 1e-9)) r = v; });
    return r;
  }

  /** DCLL (K2 vong 2, I_E ~ I_C): I_Cmax = V_CC / (R_C + R_E), diem cat truc V_CE la V_CC. */
  function loadLine(c) {
    return { icmax: c.vcc / (c.rc + c.re), vcc: c.vcc };
  }

  /**
   * Dang 1: diem lam viec Q cua mach phan cuc co dinh (V_BB qua R_B vao B; V_CC qua R_C vao C; E qua R_E xuong mass).
   * @param {{vcc:number, vbb:number, rb:number, rc:number, re:number, beta:number}} c
   * @returns {{mode:"cut"|"active"|"sat", ib:number, bib:number, ic:number, vce:number, icmax:number}}
   */
  function qPoint(c) {
    var icmax = loadLine(c).icmax;
    if (c.vbb < VBE) return { mode: "cut", ib: 0, bib: 0, ic: 0, vce: c.vcc, icmax: icmax };
    var ib = (c.vbb - VBE) / (c.rb + (1 + c.beta) * c.re);
    var bib = c.beta * ib;
    if (bib >= icmax) return { mode: "sat", ib: ib, bib: bib, ic: icmax, vce: VCE_SAT, icmax: icmax };
    return { mode: "active", ib: ib, bib: bib, ic: bib, vce: c.vcc - bib * (c.rc + c.re), icmax: icmax };
  }

  /**
   * Dang 2 khuech dai (mot nguon V_CC, R_B tu V_CC xuong B): cho I_C, V_CE, beta, V_E.
   * @param {{vcc:number, ic:number, vce:number, beta:number, ve:number}} c
   */
  function designActive(c) {
    var re = c.ve / c.ic;
    var rc = (c.vcc - c.vce - c.ve) / c.ic;
    var ib = c.ic / c.beta;
    var rb = (c.vcc - VBE - c.ve) / ib;
    return { re: re, rc: rc, ib: ib, rb: rb, std: { re: e12Nearest(re), rc: e12Nearest(rc), rb: e12Nearest(rb) } };
  }

  /**
   * Dang 2 bao hoa: cho I_Cmax, beta, K (he so bao hoa sau), V_E.
   * @param {{vcc:number, icmax:number, beta:number, k:number, ve:number}} c
   */
  function designSat(c) {
    var re = c.ve / c.icmax;
    var ib = c.k * c.icmax / c.beta;
    var rb = (c.vcc - VBE_SAT - c.ve) / ib;
    var rc = (c.vcc - VCE_SAT - c.ve) / c.icmax;
    return { re: re, ib: ib, rb: rb, rc: rc, std: { re: e12Nearest(re), rb: e12Below(rb), rc: e12Nearest(rc) } };
  }

  /**
   * Dang 2 bao hoa, cho san R_C, R_E: tim R_B.
   * @param {{vcc:number, rc:number, re:number, beta:number, k:number}} c
   */
  function satRb(c) {
    var icmax = c.vcc / (c.rc + c.re);
    var ib = c.k * icmax / c.beta;
    var ve = icmax * c.re;
    var rb = (c.vcc - VBE_SAT - ve) / ib;
    return { icmax: icmax, ib: ib, ve: ve, rb: rb, std: { rb: e12Below(rb) } };
  }

  root.BJT_CALC = {
    VBE: VBE, VBE_SAT: VBE_SAT, VCE_SAT: VCE_SAT,
    e12Nearest: e12Nearest, e12Below: e12Below, loadLine: loadLine, qPoint: qPoint,
    designActive: designActive, designSat: designSat, satRb: satRb
  };
})(typeof window !== "undefined" ? window : globalThis);
