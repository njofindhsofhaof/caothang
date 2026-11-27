/* Loi giai tung buoc cho de kiem tra 1 tiet Ly thuyet mach Chuong 3–4 (trang /dekiemtralythuyetmach).
   Bai 1 (Chuong 3): mo hinh mach giong assets/mln-calc.js (method "mesh" | "nodal"), them:
     currents: [{ name, of, sign? }]  sign = −1 khi mui ten dong nhanh nguoc chieu tinh cua MLN_CALC
     pSrc:  [{ sym, cur } | { sym, u }]  cong suat nguon = E × I (cur) hoac U × J (u = ten dien the nut, vd "V_B")
     pLoad: [{ sym, cur }]              cong suat tai = R × I²
   Bai 2 (Chuong 4): mo hinh giong assets/bp3-calc.js { conn, Ud, R, X, source?, zForm? }.
   Can MLN_CALC va BP3_CALC nap truoc. Chuoi tra ve dung "_x" lam chi so duoi. */
(function (root) {
  "use strict";

  var M = root.MLN_CALC, B = root.BP3_CALC;
  var num = function (x) { return M.num(x); };
  /** So am dat trong ngoac khi nhan: (−3). */
  var par = function (x) { return x < 0 ? "(" + num(x) + ")" : num(x); };

  function zeros(n) { var a = []; for (var i = 0; i < n; i++) a.push(0); return a; }

  /* ---------- he phuong trinh ---------- */
  /** He Z·I_m = E (mat luoi) hoac G·V = J (dien the nut), kem ten cac thanh phan de viet ky hieu. */
  function system(p) {
    var mesh = p.method === "mesh", n = mesh ? p.loops : p.nodes.length;
    var A = [], b = zeros(n), self = [], mutual = [], rhs = [];
    for (var i = 0; i < n; i++) { A.push(zeros(n)); self.push([]); mutual.push([]); rhs.push([]); }
    var key = mesh ? "loops" : "nodes";
    p.resistors.forEach(function (r) {
      var g = mesh ? r.value : 1 / r.value, a = r[key][0], c = r[key][1];
      A[a][a] += g; self[a].push(r);
      if (c == null) return;
      A[c][c] += g; self[c].push(r);
      A[a][c] -= g; A[c][a] -= g;
      mutual[a].push({ to: c, r: r }); mutual[c].push({ to: a, r: r });
    });
    if (mesh) {
      (p.vsources || []).forEach(function (s) { b[s.loop] += s.sign * s.value; rhs[s.loop].push({ text: s.sym, sign: s.sign, val: num(s.value) }); });
    } else {
      (p.vbranches || []).forEach(function (s) {
        A[s.node][s.node] += 1 / s.r; b[s.node] += s.value / s.r;
        self[s.node].push({ sym: s.rSym, value: s.r });
        rhs[s.node].push({ text: s.sym + "/" + s.rSym, sign: 1, val: num(s.value) + "/" + num(s.r) });
      });
      (p.isources || []).forEach(function (s) {
        if (s.to != null) { b[s.to] += s.value; rhs[s.to].push({ text: s.sym, sign: 1, val: num(s.value) }); }
        if (s.from != null) { b[s.from] -= s.value; rhs[s.from].push({ text: s.sym, sign: -1, val: num(s.value) }); }
      });
    }
    var bySym = function (x, y) { return x.sym < y.sym ? -1 : x.sym > y.sym ? 1 : 0; };
    self.forEach(function (list) { list.sort(bySym); });
    return { n: n, A: A, b: b, self: self, mutual: mutual, rhs: rhs };
  }

  function unknown(p, i) { return p.method === "mesh" ? "I_m" + (i + 1) : "V_" + p.nodes[i]; }

  /** "9I_m1 − 3I_m2" tu mot hang he so. */
  function linear(p, row) {
    var out = "";
    row.forEach(function (c, j) {
      if (Math.abs(c) < 1e-12) return;
      var mag = Math.abs(c), coef = Math.abs(mag - 1) < 1e-12 ? "" : num(mag);
      if (!out) out = (c < 0 ? "−" : "") + coef + unknown(p, j);
      else out += (c < 0 ? " − " : " + ") + coef + unknown(p, j);
    });
    return out || "0";
  }

  function join(list, f) { return list.map(f).join(" + "); }
  /** Mat luoi: "R_1" hoac "(R_1 + R_3)"; dien the nut: "(1/R_1 + 1/R_3)". */
  function coefText(p, list, field) {
    if (p.method === "mesh") {
      var t = join(list, function (r) { return field === "sym" ? r.sym : num(r.value); });
      return list.length > 1 ? "(" + t + ")" : t;
    }
    return "(" + join(list, function (r) { return "1/" + (field === "sym" ? r.sym : num(r.value)); }) + ")";
  }

  function rhsText(items, field) {
    if (!items.length) return "0";
    return items.map(function (it, k) { return (it.sign < 0 ? (k ? " − " : "−") : (k ? " + " : "")) + it[field]; }).join("");
  }

  /** Dong phuong trinh i: ky hieu ⇒ thay so ⇒ rut gon   (i+1). */
  function equation(p, sys, i) {
    var symText = coefText(p, sys.self[i], "sym") + "·" + unknown(p, i);
    var numText = coefText(p, sys.self[i], "num") + unknown(p, i);
    var others = {};
    sys.mutual[i].forEach(function (m) { (others[m.to] = others[m.to] || []).push(m.r); });
    Object.keys(others).forEach(function (j) {
      symText += " − " + coefText(p, others[j], "sym") + "·" + unknown(p, +j);
      numText += " − " + coefText(p, others[j], "num") + unknown(p, +j);
    });
    var name = p.method === "mesh" ? "Mắt " + (i + 1) : "Nút " + p.nodes[i];
    return name + ": " + symText + " = " + rhsText(sys.rhs[i], "text") + " ⇒ " + numText + " = " + rhsText(sys.rhs[i], "val") +
      " ⇒ " + linear(p, sys.A[i]) + " = " + num(sys.b[i]) + "   (" + (i + 1) + ")";
  }

  /** Giai he 2 an bang dinh thuc (Cramer). */
  function cramer(p, sys) {
    if (sys.n !== 2) throw new Error("Đề kiểm tra chỉ dùng hệ 2 ẩn");
    var a = sys.A, b = sys.b, unit = p.method === "mesh" ? " A" : " V";
    var d = a[0][0] * a[1][1] - a[0][1] * a[1][0];
    var d1 = b[0] * a[1][1] - a[0][1] * b[1];
    var d2 = a[0][0] * b[1] - b[0] * a[1][0];
    return {
      x: [d1 / d, d2 / d],
      lines: [
        "Δ = " + par(a[0][0]) + " × " + par(a[1][1]) + " − " + par(a[0][1]) + " × " + par(a[1][0]) + " = " + num(d),
        "Δ_1 = " + par(b[0]) + " × " + par(a[1][1]) + " − " + par(a[0][1]) + " × " + par(b[1]) + " = " + num(d1) +
          " ⇒ " + unknown(p, 0) + " = Δ_1/Δ = " + num(d1) + "/" + num(d) + " = " + num(d1 / d) + unit,
        "Δ_2 = " + par(a[0][0]) + " × " + par(b[1]) + " − " + par(b[0]) + " × " + par(a[1][0]) + " = " + num(d2) +
          " ⇒ " + unknown(p, 1) + " = Δ_2/Δ = " + num(d2) + "/" + num(d) + " = " + num(d2 / d) + unit,
        "(Giải bằng phép thế hoặc máy tính cầm tay đều được, chấm theo kết quả.)"
      ]
    };
  }

  /* ---------- dong nhanh ---------- */
  function findRes(p, s) { return p.resistors.filter(function (r) { return r.sym === s; })[0]; }
  function findVb(p, s) { return (p.vbranches || []).filter(function (v) { return v.sym === s; })[0]; }

  /** @returns {Object<string,number>} dong nhanh theo ten, da tinh dau theo mui ten tren hinh. */
  function branchValues(p) {
    var s = M.solve(p), out = {};
    p.currents.forEach(function (c) { out[c.name] = (c.sign || 1) * s.branch[c.name]; });
    return out;
  }

  function meshCurrentLine(p, c, im, val) {
    var sg = c.sign || 1, r = findRes(p, c.of);
    var lp = r ? r.loops : [p.vsources.filter(function (v) { return v.sym === c.of; })[0].loop];
    if (lp.length === 1) {
      var m = "I_m" + (lp[0] + 1);
      if (sg > 0) return c.name + " = " + m + " = " + num(val) + " A";
      return c.name + " = −" + m + " = −" + par(im[lp[0]]) + " = " + num(val) + " A (" + m + " âm: dòng thật ngược chiều mắt " + (lp[0] + 1) + ", tức đúng chiều mũi tên " + c.name + ")";
    }
    var a = sg < 0 ? lp[1] : lp[0], b = sg < 0 ? lp[0] : lp[1];
    return c.name + " = I_m" + (a + 1) + " − I_m" + (b + 1) + " = " + num(im[a]) + " − " + par(im[b]) + " = " + num(val) + " A (nhánh chung 2 mắt)";
  }

  function nodalCurrentLine(p, c, v, val) {
    var vb = findVb(p, c.of);
    if (vb) {
      return c.name + " = (" + vb.sym + " − V_" + p.nodes[vb.node] + ")/" + vb.rSym + " = (" + num(vb.value) + " − " + num(v[vb.node]) + ")/" +
        num(vb.r) + " = " + num(val) + " A (tính trên mạch gốc, không dùng nguồn dòng tương đương)";
    }
    var r = findRes(p, c.of), n0 = r.nodes[0], n1 = r.nodes[1];
    if ((c.sign || 1) < 0) { var t = n0; n0 = n1; n1 = t; }
    var name = function (k) { return k == null ? "0" : "V_" + p.nodes[k]; };
    var at = function (k) { return k == null ? 0 : v[k]; };
    var top = n1 == null ? name(n0) : "(" + name(n0) + " − " + name(n1) + ")";
    var topV = n1 == null ? num(at(n0)) : "(" + num(at(n0)) + " − " + num(at(n1)) + ")";
    return c.name + " = " + top + "/" + r.sym + " = " + topV + "/" + num(r.value) + " = " + num(val) + " A";
  }

  /* ---------- can bang cong suat ---------- */
  function powerLines(p, s, cur) {
    var all = (p.vsources || []).concat(p.vbranches || []).concat(p.isources || []);
    var src = p.pSrc.map(function (x) {
      var e = all.filter(function (q) { return q.sym === x.sym; })[0];
      if (x.cur) return { text: x.sym + " × " + x.cur, nums: num(e.value) + " × " + par(cur[x.cur]), val: e.value * cur[x.cur] };
      var k = p.nodes.indexOf(x.u.replace("V_", ""));
      return { text: x.u + " × " + x.sym, nums: par(s.v[k]) + " × " + num(e.value), val: s.v[k] * e.value };
    });
    var load = p.pLoad.map(function (x) {
      var r = findRes(p, x.sym);
      var rv = r ? r.value : (p.vbranches || []).filter(function (v) { return v.rSym === x.sym; })[0].r;
      return { text: x.sym + " × " + x.cur + "²", nums: num(rv) + " × " + par(cur[x.cur]) + "²", val: rv * cur[x.cur] * cur[x.cur] };
    });
    var tot = function (l) { return l.reduce(function (a, x) { return a + x.val; }, 0); };
    var ps = tot(src), pl = tot(load), ok = Math.abs(ps - pl) < 1e-6;
    var lines = [
      "P_nguồn = " + src.map(function (x) { return x.text; }).join(" + ") + " = " + src.map(function (x) { return x.nums; }).join(" + ") + " = " + num(ps) + " W",
      "P_tải = " + load.map(function (x) { return x.text; }).join(" + ") + " = " + load.map(function (x) { return x.nums; }).join(" + ") + " = " + num(pl) + " W",
      ok ? "⇒ P_nguồn = P_tải = " + num(ps) + " W ✓ (kết quả đúng)" : "⇒ P_nguồn ≠ P_tải: kiểm tra lại"
    ];
    if (p.pSrc.some(function (x) { return x.u; })) lines.unshift("Công suất nguồn dòng = điện áp trên nguồn × dòng nguồn (đầu + là đầu mũi tên chỉ tới).");
    return { lines: lines, pSrc: ps, pLoad: pl };
  }

  /**
   * Loi giai Bai 1, chia nhom a–d kem diem.
   * @returns {{groups:{title:string,pts:number,lines:string[]}[], answer:string, x:number[], cur:Object<string,number>, pSrc:number, pLoad:number}}
   */
  function solveCircuit(p) {
    var mesh = p.method === "mesh";
    var sys = system(p), s = M.solve(p), cr = cramer(p, sys), cur = branchValues(p), pw = powerLines(p, s, cur);
    var setup = mesh
      ? ["Mạch có " + p.loops + " mắt lưới. Chọn dòng mắt lưới I_m1, I_m2 cùng chiều kim đồng hồ (hình). Nguồn đẩy dòng cùng chiều mắt mang dấu +, ngược chiều mang dấu −."]
      : ["Chọn nút dưới làm gốc (0 V); ẩn là " + p.nodes.map(function (x) { return "V_" + x; }).join(", ") +
        ". Vế trái: tổng điện dẫn nối vào nút × điện thế nút đó − điện dẫn chung × điện thế nút kia; vế phải: tổng nguồn dòng đổ vào nút."]
        .concat((p.vbranches || []).map(function (v) {
          return v.sym + " nối tiếp " + v.rSym + " ⇒ nguồn dòng " + v.sym + "/" + v.rSym + " = " + num(v.value) + "/" + num(v.r) + " = " + num(v.value / v.r) +
            " A đổ vào nút " + p.nodes[v.node] + ", song song " + v.rSym + " = " + num(v.r) + " Ω.";
        }));
    var eqs = [];
    for (var i = 0; i < sys.n; i++) eqs.push(equation(p, sys, i));
    var curLines = p.currents.map(function (c) { return mesh ? meshCurrentLine(p, c, s.im, cur[c.name]) : nodalCurrentLine(p, c, s.v, cur[c.name]); });
    return {
      x: cr.x, cur: cur, pSrc: pw.pSrc, pLoad: pw.pLoad,
      groups: [
        { title: mesh ? "a) Chọn chiều dòng mắt lưới, viết hệ phương trình" : "a) Chọn nút gốc, biến đổi nguồn, viết hệ phương trình", pts: 2,
          lines: setup.concat(eqs).concat(["Thang điểm: chọn ẩn" + (mesh ? " và chiều mắt lưới" : ", biến đổi nguồn") + " đúng 0,5 đ; mỗi phương trình đúng 0,75 đ."]) },
        { title: "b) Giải hệ phương trình", pts: 1, lines: cr.lines.concat(["Thang điểm: mỗi ẩn đúng 0,5 đ."]) },
        { title: "c) Dòng điện các nhánh", pts: 1,
          lines: (mesh ? [] : ["Định luật Ohm cho từng nhánh: dòng = hiệu điện thế hai đầu nhánh / điện trở."]).concat(curLines)
            .concat(["Thang điểm: chia đều 1 đ cho " + p.currents.length + " dòng nhánh (đúng giá trị và chiều)."]) },
        { title: "d) Kiểm tra cân bằng công suất", pts: 1, lines: pw.lines.concat(["Thang điểm: P_nguồn 0,5 đ; P_tải và kết luận 0,5 đ."]) }
      ],
      answer: cr.x.map(function (x, k) { return unknown(p, k) + " = " + num(x) + (mesh ? " A" : " V"); })
        .concat(p.currents.map(function (c) { return c.name + " = " + num(cur[c.name]) + " A"; }))
        .concat(["P_nguồn = P_tải = " + num(pw.pSrc) + " W"]).join("; ")
    };
  }

  /* ---------- Bai 2: mach 3 pha ---------- */
  function swapConn(p) {
    var q = {};
    Object.keys(p).forEach(function (k) { q[k] = p[k]; });
    q.conn = p.conn === "D" ? "Y" : "D";
    return q;
  }

  var CONN = { Y: "hình sao (Y)", D: "hình tam giác (Δ)" };

  /**
   * Loi giai Bai 2, chia nhom a–d kem diem; cau d: dau lai tai sang kieu con lai tren cung mang.
   * @returns {{groups:{title:string,pts:number,lines:string[]}[], answer:string, s:Object, alt:Object, to:string}}
   */
  function solveThreePhase(p) {
    var s = B.solve(p), alt = B.solve(swapConn(p)), f = B.fmt, R = num(p.R), X = num(p.X), y = p.conn === "Y", to = y ? "D" : "Y";
    var volt = [p.source ? "Nguồn " + p.source + " V: điện áp pha nguồn 220 V, điện áp dây U_d = 380 V." : "Điện áp dây của mạng U_d = " + num(s.Ud) + " V.",
      y ? "Tải nối Y: U_p = U_d/√3 = " + num(s.Ud) + "/√3 = " + num(s.Up) + " V (≈ 220 V)" : "Tải nối Δ: mỗi pha tải nối giữa 2 dây nên U_p = U_d = " + num(s.Up) + " V",
      "Thang điểm: U_d 0,25 đ; U_p 0,75 đ."];
    var cur = (p.zForm === "complex" ? ["Z_p = " + R + " + j" + X + " Ω nghĩa là R_p = " + R + " Ω, X_p = " + X + " Ω."] : []).concat([
      "Z_p = √(R_p² + X_p²) = √(" + R + "² + " + X + "²) = " + num(s.Zp) + " Ω",
      "I_p = U_p/Z_p = " + num(s.Up) + "/" + num(s.Zp) + " = " + num(s.Ip) + " A",
      y ? "Tải Y: I_d = I_p = " + num(s.Id) + " A" : "Tải Δ: I_d = √3 × I_p = √3 × " + num(s.Ip) + " = " + num(s.Id) + " A",
      "Thang điểm: Z_p, I_p, I_d mỗi đại lượng 0,5 đ."]);
    var pw = [
      "cosφ = R_p/Z_p = " + R + "/" + num(s.Zp) + " = " + f("cosφ", s.cos) + " (φ = " + num(s.phi) + "°, tải mang tính cảm)",
      "P = 3 × R_p × I_p² = 3 × " + R + " × " + num(s.Ip) + "² = " + f("P", s.P) + " W (hoặc P = √3·U_d·I_d·cosφ)",
      "Q = 3 × X_p × I_p² = 3 × " + X + " × " + num(s.Ip) + "² = " + f("Q", s.Q) + " VAr",
      "S = 3 × U_p × I_p = 3 × " + num(s.Up) + " × " + num(s.Ip) + " = " + f("S", s.S) + " VA ; kiểm tra √(P² + Q²) = " + f("S", Math.hypot(s.P, s.Q)) + " VA ✓",
      "Thang điểm: mỗi đại lượng 0,5 đ. Làm tròn I_p trước khi bình phương, lệch dưới 1% vẫn cho đủ điểm."
    ];
    var swap = [
      "Đấu lại tải sang " + CONN[to] + " trên cùng mạng U_d = " + num(s.Ud) + " V: " +
        (to === "D" ? "U_p = U_d = " : "U_p = U_d/√3 = ") + num(alt.Up) + " V ⇒ I_p = " + num(alt.Up) + "/" + num(alt.Zp) + " = " + num(alt.Ip) + " A",
      (to === "D" ? "I_d = √3 × I_p = " : "I_d = I_p = ") + num(alt.Id) + " A ; P = 3 × " + R + " × " + num(alt.Ip) + "² = " + f("P", alt.P) + " W",
      "So sánh: P_Δ = 3·P_Y (" + (to === "D" ? f("P", alt.P) + " = 3 × " + f("P", s.P) : f("P", s.P) + " = 3 × " + f("P", alt.P)) + " W). " +
        (to === "D" ? "Tải mỗi pha định mức 220 V mà đấu Δ vào mạng 380 V thì bị quá áp √3 lần." : "Đấu Y thì mỗi pha chỉ còn 220 V, công suất giảm 3 lần (đó là lý do khởi động sao – tam giác)."),
      "Thang điểm: I_d và P mới 0,25 đ; so sánh đúng 0,25 đ."
    ];
    return {
      s: s, alt: alt, to: to,
      groups: [
        { title: "a) Điện áp", pts: 1, lines: volt },
        { title: "b) Tổng trở và dòng điện", pts: 1.5, lines: cur },
        { title: "c) Hệ số công suất và công suất", pts: 2, lines: pw },
        { title: "d) Đấu lại tải", pts: 0.5, lines: swap }
      ],
      answer: "U_d = " + num(s.Ud) + " V; U_p = " + num(s.Up) + " V; Z_p = " + num(s.Zp) + " Ω; I_p = " + num(s.Ip) + " A; I_d = " + num(s.Id) +
        " A; cosφ = " + f("cosφ", s.cos) + "; P = " + f("P", s.P) + " W; Q = " + f("Q", s.Q) + " VAr; S = " + f("S", s.S) + " VA; đấu " +
        (to === "D" ? "Δ" : "Y") + ": I_d = " + num(alt.Id) + " A, P = " + f("P", alt.P) + " W"
    };
  }

  root.DKTM_CALC = { system: system, cramer: cramer, linear: linear, branchValues: branchValues, solveCircuit: solveCircuit, solveThreePhase: solveThreePhase };
})(typeof window !== "undefined" ? window : globalThis);
