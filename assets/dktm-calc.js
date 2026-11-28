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

  /** Nut goc cua bai dien the nut luon la nut C (V_C = 0), theo cach giai tren lop. */
  var GROUND = "C";

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
    /* Nguon dong nam rieng nhanh ngoai cua 1 mat (cung chieu mat) ⇒ I_m cua mat do = J, bo phuong trinh mat do. */
    var fixed = {};
    if (mesh) (p.isources || []).forEach(function (s) { fixed[s.loop] = s.value; });
    var free = [];
    for (var k = 0; k < n; k++) if (fixed[k] == null) free.push(k);
    var Ar = A.map(function (row) { return row.map(function (c, j) { return fixed[j] == null ? c : 0; }); });
    var br = b.map(function (v, r) { return Object.keys(fixed).reduce(function (acc, j) { return acc - A[r][j] * fixed[j]; }, v); });
    return { n: n, A: A, b: b, Ar: Ar, br: br, fixed: fixed, free: free, self: self, mutual: mutual, rhs: rhs };
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

  /** Dong phuong trinh i: ky hieu ⇒ thay so ⇒ rut gon   (k). Mat co nguon dong: thay I_m = J bang so. */
  function equation(p, sys, i, k) {
    var symText = coefText(p, sys.self[i], "sym") + "·" + unknown(p, i);
    var numText = coefText(p, sys.self[i], "num") + unknown(p, i);
    var others = {};
    sys.mutual[i].forEach(function (m) { (others[m.to] = others[m.to] || []).push(m.r); });
    Object.keys(others).forEach(function (j) {
      symText += " − " + coefText(p, others[j], "sym") + "·" + unknown(p, +j);
      numText += " − " + coefText(p, others[j], "num") + (sys.fixed[j] == null ? unknown(p, +j) : "×" + num(sys.fixed[j]));
    });
    var name = p.method === "mesh" ? "Mắt " + (i + 1) : "Nút " + p.nodes[i];
    return name + ": " + symText + " = " + rhsText(sys.rhs[i], "text") + " ⇒ " + numText + " = " + rhsText(sys.rhs[i], "val") +
      " ⇒ " + linear(p, sys.Ar[i]) + " = " + num(sys.br[i]) + "   (" + k + ")";
  }

  function det(m) {
    if (m.length === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
    return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
      m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  }
  function matText(m) { return "|" + m.map(function (row) { return row.map(num).join("  "); }).join(" ; ") + "|"; }
  /** Dinh thuc giu toi 5 chu so thap phan de phep chia ra dung so tron. */
  var dnum = function (x) { return B.num(x, 5); };

  /** Giai he 2 hoac 3 an (cac an tu do) bang dinh thuc Cramer. */
  function cramer(p, sys) {
    var f = sys.free, n = f.length;
    if (n !== 2 && n !== 3) throw new Error("Đề kiểm tra chỉ dùng hệ 2 hoặc 3 ẩn");
    var M = f.map(function (i) { return f.map(function (j) { return sys.Ar[i][j]; }); });
    var rhs = f.map(function (i) { return sys.br[i]; });
    var unit = p.method === "mesh" ? " A" : " V", d = det(M), x = [], lines = [];
    if (n === 2) {
      lines.push("Δ = " + par(M[0][0]) + " × " + par(M[1][1]) + " − " + par(M[0][1]) + " × " + par(M[1][0]) + " = " + dnum(d));
    } else {
      lines.push("Hệ 3 ẩn: ma trận hệ số (mỗi dòng là 1 phương trình) " + matText(M) + ", vế phải " + rhs.map(num).join("; ") + ".");
      lines.push("Δ = det" + matText(M) + " = " + dnum(d));
    }
    for (var k = 0; k < n; k++) {
      var Mk = M.map(function (row, r) { return row.map(function (c, j) { return j === k ? rhs[r] : c; }); });
      var dk = det(Mk), name = unknown(p, f[k]);
      x.push(dk / d);
      lines.push("Δ_" + (k + 1) + " = " + (n === 2
        ? par(Mk[0][0]) + " × " + par(Mk[1][1]) + " − " + par(Mk[0][1]) + " × " + par(Mk[1][0])
        : "det" + matText(Mk)) + " = " + dnum(dk) + " ⇒ " + name + " = Δ_" + (k + 1) + "/Δ = " + dnum(dk) + "/" + dnum(d) + " = " + num(dk / d) + unit);
    }
    lines.push(n === 3
      ? "(Có thể giải bằng phép thế hoặc chức năng giải hệ 3 ẩn của máy tính cầm tay, chấm theo kết quả.)"
      : "(Giải bằng phép thế hoặc máy tính cầm tay đều được, chấm theo kết quả.)");
    return { x: x, free: f, lines: lines };
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

  /** Dien ap tren nguon dong J (dau + o dau mui ten), tu K2 cho mat chua J. */
  function uJLine(p, s, src) {
    var k = src.loop, terms = [], nums = [];
    p.resistors.forEach(function (r) {
      var at = r.loops.indexOf(k);
      if (at < 0) return;
      var other = r.loops[1 - at];
      if (other == null) { terms.push(r.sym + "·I_m" + (k + 1)); nums.push(num(r.value) + " × " + num(s.im[k])); return; }
      terms.push(r.sym + "(I_m" + (k + 1) + " − I_m" + (other + 1) + ")");
      nums.push(num(r.value) + " × (" + num(s.im[k]) + " − " + par(s.im[other]) + ")");
    });
    (p.vsources || []).forEach(function (v) {
      if (v.loop !== k) return;
      terms.push((v.sign > 0 ? "− " : "+ ") + v.sym); nums.push((v.sign > 0 ? "− " : "+ ") + num(v.value));
    });
    return "K2 cho mắt " + (k + 1) + " (chiều mắt): U_" + src.sym + " = " + terms.join(" + ").replace(/\+ ([−+]) /g, "$1 ") + " = " +
      nums.join(" + ").replace(/\+ ([−+]) /g, "$1 ") + " = " + num(s.uJ[src.sym]) + " V";
  }

  /**
   * p.k1: dong nhanh dien tro tinh bang dinh luat Ohm truoc, dong nhanh co nguon ap (vbranch) tinh sau bang K1 tai nut cua no.
   * Chieu: dong dien tro di tu nut dau sang nut sau (sign −1 dao chieu); dong vbranch va nguon dong J di vao nut.
   */
  function k1CurrentLines(p, v, cur) {
    var isVb = function (c) { return !!findVb(p, c.of); };
    var lines = p.currents.filter(function (c) { return !isVb(c); }).map(function (c) { return nodalCurrentLine(p, c, v, cur[c.name]); });
    p.currents.filter(isVb).forEach(function (c) {
      var k = findVb(p, c.of).node, into = [], out = [];
      p.currents.forEach(function (o) {
        if (o === c) return;
        var vb = findVb(p, o.of);
        if (vb) { if (vb.node === k) into.push(o.name); return; }
        var r = findRes(p, o.of), from = r.nodes[0], to = r.nodes[1];
        if ((o.sign || 1) < 0) { var t = from; from = to; to = t; }
        if (from === k) out.push(o.name);
        else if (to === k) into.push(o.name);
      });
      var js = (p.isources || []).filter(function (j) { return j.to === k || j.from === k; });
      js.forEach(function (j) { (j.to === k ? into : out).push(j.sym); });
      var val = function (n) { return n in cur ? cur[n] : js.filter(function (j) { return j.sym === n; })[0].value; };
      var rhs = out.map(function (n) { return { n: n, s: 1 }; }).concat(into.map(function (n) { return { n: n, s: -1 }; }));
      var txt = function (f) { return rhs.map(function (x, i) { return (x.s < 0 ? " − " : (i ? " + " : "")) + f(x.n); }).join("").replace(/^ − /, "−"); };
      lines.push("K1 tại nút " + p.nodes[k] + " (tổng dòng vào = tổng dòng ra): " + [c.name].concat(into).join(" + ") + " = " + out.join(" + ") +
        " ⇒ " + c.name + " = " + txt(function (n) { return n; }) + " = " + txt(function (n) { return num(val(n)); }) + " = " + num(cur[c.name]) + " A");
    });
    return lines;
  }

  /* ---------- can bang cong suat ---------- */
  function powerLines(p, s, cur) {
    var all = (p.vsources || []).concat(p.vbranches || []).concat(p.isources || []);
    var src = p.pSrc.map(function (x) {
      var e = all.filter(function (q) { return q.sym === x.sym; })[0];
      if (x.cur) return { text: x.sym + " × " + x.cur, nums: num(e.value) + " × " + par(cur[x.cur]), val: e.value * cur[x.cur] };
      if (x.uJ) return { text: "U_" + x.sym + " × " + x.sym, nums: par(s.uJ[x.sym]) + " × " + num(e.value), val: s.uJ[x.sym] * e.value };
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
    if (p.pSrc.some(function (x) { return x.u || x.uJ; })) lines.unshift("Công suất nguồn dòng = điện áp trên nguồn × dòng nguồn (đầu + là đầu mũi tên chỉ tới).");
    (p.isources || []).forEach(function (src) { if (src.loop != null) lines.splice(1, 0, uJLine(p, s, src)); });
    return { lines: lines, pSrc: ps, pLoad: pl };
  }

  /**
   * Loi giai Bai 1, chia nhom a–d kem diem.
   * @returns {{groups:{title:string,pts:number,lines:string[]}[], answer:string, x:number[], cur:Object<string,number>, pSrc:number, pLoad:number}}
   */
  function solveCircuit(p) {
    var mesh = p.method === "mesh";
    var sys = system(p), s = M.solve(p), cr = cramer(p, sys), cur = branchValues(p), pw = powerLines(p, s, cur);
    var ms = []; for (var q = 0; q < sys.n; q++) ms.push(unknown(p, q));
    var setup = mesh
      ? ["Mạch có " + p.loops + " mắt lưới. Chọn dòng mắt lưới " + ms.join(", ") + " cùng chiều kim đồng hồ (hình). Nguồn áp đẩy dòng cùng chiều mắt mang dấu +, ngược chiều mang dấu −."]
        .concat((p.isources || []).map(function (j) {
          return "Nguồn dòng " + j.sym + " nằm riêng ở nhánh ngoài của mắt " + (j.loop + 1) + " và cùng chiều mắt ⇒ I_m" + (j.loop + 1) + " = " + j.sym + " = " + num(j.value) +
            " A đã biết, không cần viết phương trình mắt " + (j.loop + 1) + "; chỉ còn " + sys.free.length + " ẩn.";
        }))
      : ["Gọi " + p.nodes.concat([GROUND]).map(function (x) { return "V_" + x; }).join(", ") + " là điện thế tại các nút " +
        p.nodes.concat([GROUND]).join(", ") + ". Chọn nút " + GROUND + " làm nút gốc ⇒ V_" + GROUND + " = 0. Ẩn còn lại là " +
        p.nodes.map(function (x) { return "V_" + x; }).join(", ") + ".",
        "Vế trái: tổng điện dẫn nối vào nút × điện thế nút đó − điện dẫn chung × điện thế nút kia; vế phải: tổng nguồn dòng đổ vào nút."]
        .concat((p.vbranches || []).map(function (v, k) {
          return v.sym + " nối tiếp " + v.rSym + " ⇒ nguồn dòng J_" + (k + 1) + " = " + v.sym + "/" + v.rSym + " = " + num(v.value) + "/" + num(v.r) + " = " + num(v.value / v.r) +
            " A đổ vào nút " + p.nodes[v.node] + ", song song " + v.rSym + " = " + num(v.r) + " Ω.";
        }))
        .concat(p.vbranches && p.vbranches.length ? ["Vẽ lại mạch sau khi biến đổi (hình dưới): mỗi nhánh nguồn áp nối tiếp điện trở thay bằng nguồn dòng song song điện trở đó; các nút A, B, C giữ nguyên. Viết phương trình điện thế nút trên mạch này."] : [])
    var eqs = sys.free.map(function (i, k) { return equation(p, sys, i, k + 1); });
    var nf = sys.free.length;
    var curLines = mesh || !p.k1
      ? p.currents.map(function (c) { return mesh ? meshCurrentLine(p, c, s.im, cur[c.name]) : nodalCurrentLine(p, c, s.v, cur[c.name]); })
      : k1CurrentLines(p, s.v, cur);
    return {
      x: cr.x, cur: cur, pSrc: pw.pSrc, pLoad: pw.pLoad,
      groups: [
        { title: mesh ? "a) Chọn chiều dòng mắt lưới, viết hệ phương trình" : "a) Chọn nút gốc, biến đổi nguồn, viết hệ phương trình", pts: 2,
          lines: setup.concat(eqs).concat(["Thang điểm: chọn ẩn" + (mesh ? (p.isources ? ", chiều mắt lưới và I_m = J" : " và chiều mắt lưới") : ", biến đổi nguồn và vẽ lại mạch") +
            " đúng 0,5 đ; mỗi phương trình đúng " + num(1.5 / nf) + " đ."]) },
        { title: "b) Giải hệ phương trình", pts: 1, lines: cr.lines.concat([nf === 2 ? "Thang điểm: mỗi ẩn đúng 0,5 đ." : "Thang điểm: đúng cả 3 ẩn 1 đ; đúng 1 hoặc 2 ẩn 0,5 đ."]) },
        { title: "c) Dòng điện các nhánh", pts: 1,
          lines: (mesh ? [] : [p.k1
            ? "Nhánh chỉ có điện trở: định luật Ohm, dòng = hiệu điện thế hai đầu nhánh / điện trở. Nhánh có nguồn áp: dùng K1 tại nút của nhánh đó."
            : "Định luật Ohm cho từng nhánh: dòng = hiệu điện thế hai đầu nhánh / điện trở."]).concat(curLines)
            .concat(["Thang điểm: chia đều 1 đ cho " + p.currents.length + " dòng nhánh (đúng giá trị và chiều)."]) },
        { title: "d) Kiểm tra cân bằng công suất", pts: 1, lines: pw.lines.concat(["Thang điểm: P_nguồn 0,5 đ; P_tải và kết luận 0,5 đ."]) }
      ],
      answer: s[mesh ? "im" : "v"].map(function (x, k) { return unknown(p, k) + " = " + num(x) + (mesh ? " A" : " V"); })
        .concat((p.isources || []).filter(function (j) { return j.loop != null; }).map(function (j) { return "U_" + j.sym + " = " + num(s.uJ[j.sym]) + " V"; }))
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
