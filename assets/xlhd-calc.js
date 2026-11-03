/* Giai mach xac lap dieu hoa bang anh phuc: nguon (ap hoac dong) -> doan noi tiep -> cac nhanh song song.
   Dung chung cho trang /xaclapdieuhoa va test/xlhd-calc.test.js. */
(function (root) {
  "use strict";

  var DEG = 180 / Math.PI;

  /* ---------- so phuc {re, im} ---------- */
  function cx(re, im) { return { re: re, im: im || 0 }; }
  function polar(mag, deg) { return cx(mag * Math.cos(deg / DEG), mag * Math.sin(deg / DEG)); }
  function add(a, b) { return cx(a.re + b.re, a.im + b.im); }
  function mul(a, b) { return cx(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re); }
  function div(a, b) {
    var d = b.re * b.re + b.im * b.im;
    return cx((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d);
  }
  function conj(a) { return cx(a.re, -a.im); }
  function scale(a, k) { return cx(a.re * k, a.im * k); }
  function abs(a) { return Math.hypot(a.re, a.im); }
  /** @returns {number} goc theo do trong (-180, 180] */
  function arg(a) { return Math.atan2(a.im, a.re) * DEG; }
  function sum(zs) { return zs.reduce(add, cx(0)); }

  /**
   * Tong tro 1 phan tu. R: value (Ω). L: x = cam khang (Ω) hoac h = Henry. C: x = dung khang (Ω) hoac f = Farad.
   * @param {{kind:"R"|"L"|"C", value?:number, x?:number, h?:number, f?:number}} el @param {number} [omega]
   */
  function impedance(el, omega) {
    if (el.kind === "R") return cx(el.value);
    if (el.kind === "L") return cx(0, el.x != null ? el.x : omega * el.h);
    return cx(0, -(el.x != null ? el.x : 1 / (omega * el.f)));
  }

  /**
   * @param {object} p bai tap tu XL_PROBLEMS
   * @returns {{zSeries:object, zBranches:object[], zPar:object, zTotal:object, current:object, vPar:object,
   *   vSource:object, branchI:object[], voltages:Object<string,object>, power:object}}
   *   power = P + jQ cua nguon = ½·U·I* (de mac dinh cho bien do); voltages theo ten trong p.voltages.
   */
  function solve(p) {
    var w = p.source.omega;
    var zSeries = sum((p.series || []).map(function (el) { return impedance(el, w); }));
    var zBranches = p.branches.map(function (b) { return sum(b.elems.map(function (el) { return impedance(el, w); })); });
    var zPar = div(cx(1), sum(zBranches.map(function (z) { return div(cx(1), z); })));
    var zTotal = add(zSeries, zPar);
    var src = polar(p.source.mag, p.source.deg);
    var current = p.source.type === "V" ? div(src, zTotal) : src;
    var vPar = mul(current, zPar);
    var vSource = p.source.type === "V" ? src : mul(current, zTotal);
    var branchI = zBranches.map(function (z) { return div(vPar, z); });
    var voltages = {};
    (p.voltages || []).forEach(function (v) {
      voltages[v.name] = sum(v.terms.map(function (t) {
        var drop = mul(branchI[t.branch], impedance(p.branches[t.branch].elems[t.elem], w));
        return t.sign < 0 ? scale(drop, -1) : drop;
      }));
    });
    var power = scale(mul(vSource, conj(current)), 0.5);
    return {
      zSeries: zSeries, zBranches: zBranches, zPar: zPar, zTotal: zTotal, current: current, vPar: vPar,
      vSource: vSource, branchI: branchI, voltages: voltages, power: power
    };
  }

  /** @param {number} x @returns {string} 2 chu so thap phan, dau phay, dau tru "−"; khong in "−0,00" */
  function f2(x) {
    var r = Math.round(x * 100) / 100;
    return (r === 0 ? 0 : r).toFixed(2).replace(".", ",").replace("-", "−");
  }

  var SQUARE_FREE = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23, 26, 29, 30];
  var MAX_DEN = 6;

  function isWhole(x) { return Math.abs(x - Math.round(x)) <= 1e-9 * Math.max(1, Math.abs(x)); }

  /** @returns {{p:number, q:number, n:number}|null} x = (p/q)·√n voi n khong chinh phuong nho, q nho */
  function asRadical(x) {
    for (var i = 0; i < SQUARE_FREE.length; i++) {
      var n = SQUARE_FREE[i], r = Math.abs(x) / Math.sqrt(n);
      for (var q = 1; q <= MAX_DEN; q++) {
        if (isWhole(r * q) && Math.round(r * q) > 0) return { p: Math.round(r * q), q: q, n: n };
      }
    }
    return null;
  }

  /**
   * So hien thi: so nguyen giu nguyen ("100"), so dang can giu dang can ("50√2", "√2", "10√5/3"),
   * con lai lam tron 2 chu so thap phan, bo so 0 thua ("4,12", "1,4"). Dau tru la "−".
   */
  function num(x) {
    var sign = x < 0 ? "−" : "";
    if (isWhole(x)) return Math.round(x) === 0 ? "0" : sign + Math.abs(Math.round(x));
    var r = asRadical(x);
    if (!r) return f2(x).replace(/(,\d*?)0+$/, "$1").replace(/,$/, "");
    return sign + (r.p === 1 ? "" : r.p) + "√" + r.n + (r.q === 1 ? "" : "/" + r.q);
  }

  /** @returns {string} dang dai so, vd "3,96 + j1,13" ; "1 − j1" ; "−j3,02" ; "100" */
  function fmtRect(z) {
    var re = Math.round(z.re * 1e6) / 1e6, im = Math.round(z.im * 1e6) / 1e6;
    if (Math.round(im * 100) === 0) return num(re);
    var j = "j" + num(Math.abs(im));
    if (Math.round(re * 100) === 0) return (im < 0 ? "−" : "") + j;
    return num(re) + (im < 0 ? " − " : " + ") + j;
  }

  /** @returns {string} dang mu, vd "4,12∠15,95°" ; "50√2∠45°" */
  function fmtPolar(z) {
    return num(abs(z)) + "∠" + num(arg(z)) + "°";
  }

  root.XL_CALC = {
    cx: cx, polar: polar, add: add, mul: mul, div: div, conj: conj, scale: scale, abs: abs, arg: arg,
    impedance: impedance, solve: solve, f2: f2, num: num, fmtRect: fmtRect, fmtPolar: fmtPolar
  };
})(typeof window !== "undefined" ? window : globalThis);
