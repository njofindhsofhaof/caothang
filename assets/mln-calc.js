/* Giai mach DC bang phuong phap dong mat luoi va dien the nut (bai tap Ly thuyet mach Chuong 3).
   Dung chung cho trang /baitapmatluoinut va test/mln-calc.test.js.
   - Mat luoi (method "mesh"): moi mat chieu kim dong ho, Iₘ dong vai tro an.
     resistors: [{ sym, value, loops: [i] | [i, j] }]  (nhanh chung 2 mat: dong nhanh = Iₘi − Iₘj)
     vsources:  [{ sym, value, loop, sign }]            (sign = +1 khi nguon day dong cung chieu mat)
     isources:  [{ sym, value, loop }]                  (nguon dong nam rieng 1 mat, cung chieu mat ⇒ Iₘ = J)
   - Dien the nut (method "nodal"): nut goc = 0 V, nodes = ten cac nut con lai.
     resistors: [{ sym, value, nodes: [i] | [i, j] }]   (dong tu nut dau sang nut sau; [i] = tu nut i xuong goc)
     isources:  [{ sym, value, from, to }]              (from/to = chi so nut, null = nut goc)
     vbranches: [{ sym, value, rSym, r, node }]         (nguon ap + huong ve nut, noi tiep R, dau kia o goc)
   currents: [{ name, of }] dong nhanh can tinh theo ten dien tro (vbranch: ten nguon). */
(function (root) {
  "use strict";

  /** Giai A·x = b bang khu Gauss co chon phan tu tru. @returns {number[]} */
  function linsolve(A, b) {
    var n = b.length;
    var m = A.map(function (row, i) { return row.slice().concat(b[i]); });
    for (var c = 0; c < n; c++) {
      var piv = c;
      for (var r = c + 1; r < n; r++) if (Math.abs(m[r][c]) > Math.abs(m[piv][c])) piv = r;
      if (Math.abs(m[piv][c]) < 1e-12) throw new Error("Hệ phương trình suy biến");
      var tmp = m[c]; m[c] = m[piv]; m[piv] = tmp;
      for (var k = 0; k < n; k++) {
        if (k === c) continue;
        var f = m[k][c] / m[c][c];
        for (var j = c; j <= n; j++) m[k][j] -= f * m[c][j];
      }
    }
    return m.map(function (row, i) { return row[n] / row[i]; });
  }

  function zeros(n) { var a = []; for (var i = 0; i < n; i++) a.push(0); return a; }

  /* ---------- dong mat luoi ---------- */
  function meshCurrentIn(res, im) {
    return res.loops.length === 1 ? im[res.loops[0]] : im[res.loops[0]] - im[res.loops[1]];
  }

  /**
   * @returns {{im:number[], branch:Object<string,number>, pSources:Object<string,number>, pLoads:Object<string,number>, uJ:Object<string,number>}}
   */
  function solveMesh(p) {
    var n = p.loops;
    var fixed = {};
    (p.isources || []).forEach(function (s) { fixed[s.loop] = s.value; });
    var Z = [], E = [];
    for (var i = 0; i < n; i++) { Z.push(zeros(n)); E.push(0); }
    p.resistors.forEach(function (r) {
      var a = r.loops[0], b = r.loops[1];
      Z[a][a] += r.value;
      if (b == null) return;
      Z[b][b] += r.value; Z[a][b] -= r.value; Z[b][a] -= r.value;
    });
    (p.vsources || []).forEach(function (s) { E[s.loop] += s.sign * s.value; });

    var free = [];
    for (var k = 0; k < n; k++) if (fixed[k] == null) free.push(k);
    var A = free.map(function (i) { return free.map(function (j) { return Z[i][j]; }); });
    var rhs = free.map(function (i) {
      return Object.keys(fixed).reduce(function (acc, j) { return acc - Z[i][j] * fixed[j]; }, E[i]);
    });
    var x = free.length ? linsolve(A, rhs) : [];
    var im = zeros(n);
    free.forEach(function (i, t) { im[i] = x[t]; });
    Object.keys(fixed).forEach(function (j) { im[j] = fixed[j]; });

    var byName = {}, pLoads = {}, pSources = {}, uJ = {};
    p.resistors.forEach(function (r) {
      var cur = meshCurrentIn(r, im);
      byName[r.sym] = cur;
      pLoads[r.sym] = r.value * cur * cur;
    });
    (p.vsources || []).forEach(function (s) { byName[s.sym] = s.sign * im[s.loop]; pSources[s.sym] = s.value * s.sign * im[s.loop]; });
    (p.isources || []).forEach(function (s) {
      /* K2 cho mat chua nguon dong (chieu mat): tong ap roi tren R = tong E cung chieu + U_J. */
      var drop = p.resistors.reduce(function (acc, r) {
        var k = r.loops.indexOf(s.loop);
        if (k < 0) return acc;
        var other = r.loops[1 - k];
        return acc + r.value * (im[s.loop] - (other == null ? 0 : im[other]));
      }, 0);
      var emf = (p.vsources || []).reduce(function (acc, v) { return v.loop === s.loop ? acc + v.sign * v.value : acc; }, 0);
      uJ[s.sym] = drop - emf;
      pSources[s.sym] = uJ[s.sym] * s.value;
    });
    return { im: im, branch: pick(p, byName), pSources: pSources, pLoads: pLoads, uJ: uJ };
  }

  /* ---------- dien the nut ---------- */
  /**
   * @returns {{v:number[], G:number[][], J:number[], branch:Object<string,number>, pSources:Object<string,number>, pLoads:Object<string,number>}}
   */
  function solveNodal(p) {
    var n = p.nodes.length;
    var G = [], J = [];
    for (var i = 0; i < n; i++) { G.push(zeros(n)); J.push(0); }
    p.resistors.forEach(function (r) {
      var g = 1 / r.value, a = r.nodes[0], b = r.nodes[1];
      G[a][a] += g;
      if (b == null) return;
      G[b][b] += g; G[a][b] -= g; G[b][a] -= g;
    });
    (p.isources || []).forEach(function (s) {
      if (s.from != null) J[s.from] -= s.value;
      if (s.to != null) J[s.to] += s.value;
    });
    /* Bien doi nguon: E noi tiep R ⇒ nguon dong E/R vao nut, song song R. */
    (p.vbranches || []).forEach(function (s) { G[s.node][s.node] += 1 / s.r; J[s.node] += s.value / s.r; });
    var v = linsolve(G, J);
    function at(k) { return k == null ? 0 : v[k]; }

    var byName = {}, pLoads = {}, pSources = {};
    p.resistors.forEach(function (r) {
      var cur = (at(r.nodes[0]) - at(r.nodes[1])) / r.value;
      byName[r.sym] = cur;
      pLoads[r.sym] = r.value * cur * cur;
    });
    (p.isources || []).forEach(function (s) { pSources[s.sym] = (at(s.to) - at(s.from)) * s.value; });
    (p.vbranches || []).forEach(function (s) {
      var cur = (s.value - v[s.node]) / s.r;
      byName[s.sym] = cur;
      pSources[s.sym] = s.value * cur;
      pLoads[s.rSym] = s.r * cur * cur;
    });
    return { v: v, G: G, J: J, branch: pick(p, byName), pSources: pSources, pLoads: pLoads };
  }

  function pick(p, byName) {
    var out = {};
    (p.currents || []).forEach(function (c) { out[c.name] = byName[c.of]; });
    return out;
  }

  function total(obj) { return Object.keys(obj).reduce(function (a, k) { return a + obj[k]; }, 0); }

  /** Giai bai theo p.method; them pSum, pLoad de kiem tra can bang cong suat. */
  function solve(p) {
    var s = p.method === "mesh" ? solveMesh(p) : solveNodal(p);
    s.pSum = total(s.pSources);
    s.pLoad = total(s.pLoads);
    return s;
  }

  /** Dap an cac o nhap: { "I_1": 4.33…, "V_A": 14 } */
  function answers(p) {
    var s = solve(p), out = {};
    if (p.method === "nodal") p.nodes.forEach(function (name, i) { out["V_" + name] = s.v[i]; });
    Object.keys(s.branch).forEach(function (k) { out[k] = s.branch[k]; });
    return out;
  }

  /** "4,33" ; "−86,6" ; "12" — lam tron 2 chu so, dau phay thap phan. */
  function num(x) {
    var r = Math.round(x * 100) / 100;
    if (r === 0) r = 0;
    return String(r).replace("-", "−").replace(".", ",");
  }

  /** Doc so nguoi hoc nhap: "4,33", "-3", "13/3", "4.33 A". @returns {number} NaN neu khong hop le */
  function parseNumber(raw) {
    var s = String(raw).trim().replace(/[−–—]/g, "-").replace(/,/g, ".").replace(/\s+/g, "").replace(/[avΩ]$/i, "");
    var m = /^([-+]?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/.exec(s);
    if (m) return parseFloat(m[2]) === 0 ? NaN : parseFloat(m[1]) / parseFloat(m[2]);
    return /^[-+]?\d+(\.\d+)?$/.test(s) ? parseFloat(s) : NaN;
  }

  /** Dung khi lech ≤ 0,01 so voi dap an (cho phep lam tron 2 chu so). */
  function matches(input, expected) {
    return !isNaN(input) && Math.abs(input - expected) <= 0.01 + 1e-9;
  }

  root.MLN_CALC = {
    linsolve: linsolve, solveMesh: solveMesh, solveNodal: solveNodal, solve: solve,
    answers: answers, num: num, parseNumber: parseNumber, matches: matches
  };
})(typeof window !== "undefined" ? window : globalThis);
