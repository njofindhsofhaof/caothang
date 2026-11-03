/* Trang Mach xac lap dieu hoa: moi bai gom de, so do va loi giai trinh bay tung buoc.
   So lieu lay tu assets/xlhd-data.js, ket qua tinh bang assets/xlhd-calc.js, so do ve bang assets/xlhd-svg.js. */
(function () {
  "use strict";

  var C = window.XL_CALC;
  var SVG = window.XL_SVG;
  var problems = Array.isArray(window.XL_PROBLEMS) ? window.XL_PROBLEMS : [];
  var app = document.getElementById("xlApp");
  if (!app || !C || !SVG) return;

  var num = C.num, rect = C.fmtRect, pol = C.fmtPolar;

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return node;
  }

  /** Phan so xep chong (tu tren, mau duoi) dung trong 1 dong loi giai. */
  function fr(top, bottom) { return { frac: [top, bottom] }; }

  /** "^I_o" -> I co cham tren dau (dang phuc) + chi so <sub>; "_{..}" cho chi so nhieu ky tu. */
  function richText(node, text) {
    text = text.replace(/\^([A-Za-z])/g, "$1̇");
    var re = /_(\{[^}]+\}|[0-9A-Za-zđ]+)/g, last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) node.appendChild(document.createTextNode(text.slice(last, m.index)));
      node.appendChild(el("sub", { text: m[1].replace(/[{}]/g, "") }));
      last = re.lastIndex;
    }
    if (last < text.length) node.appendChild(document.createTextNode(text.slice(last)));
    return node;
  }

  /** 1 dong = chuoi hoac mang [chuoi | fr(tu, mau)]. */
  function rich(tag, line, attrs) {
    var node = el(tag, attrs);
    (Array.isArray(line) ? line : [line]).forEach(function (part) {
      if (typeof part === "string") { richText(node, part); return; }
      node.appendChild(el("span", { "class": "xl-frac" }, [
        richText(el("span", { "class": "xl-num" }), part.frac[0]),
        richText(el("span", { "class": "xl-den" }), part.frac[1])
      ]));
    });
    return node;
  }

  /** So am hoac so phuc 2 thanh phan thi dat trong ngoac khi dung trong bieu thuc. */
  function term(z) {
    var t = rect(z);
    return /^−| [+−] /.test(t) ? "(" + t + ")" : t;
  }

  function isReal(z) { return Math.round(z.im * 100) === 0; }

  /** Dong/ap: "1,4 − j0,2 = √2∠−8,13°"; so thuc chi ghi dang cuc. */
  function both(z) { return isReal(z) ? pol(z) : rect(z) + " = " + pol(z); }

  function zName(b) { return "Z_" + b.current.split("_")[1]; }
  function dot(name) { return "^" + name; }
  function lower(name) { return name.charAt(0).toLowerCase() + name.slice(1); }

  function allElems(p) {
    return p.branches.reduce(function (a, b) { return a.concat(b.elems); }, (p.series || []).slice());
  }

  function hasSeries(p) { return !!(p.series && p.series.length); }

  function fnName(p) { return p.source.fn === "cos" ? "cos" : "sin"; }

  function resistorLine(p) {
    var rs = allElems(p).filter(function (e) { return e.kind === "R"; }).map(function (e) { return e.label; });
    return rs.length ? "Điện trở giữ nguyên giá trị (không đổi sang dạng cực): " + rs.join("; ") + "." : null;
  }

  /** "U_o = 100 V, φ_u = 0°" tu anh phuc nguon. */
  function sourceAmp(p) {
    var v = p.source.type === "V";
    return (v ? "U_o = " : "I_o = ") + num(p.source.mag) + (v ? " V" : " A") + ", góc pha φ_" + (v ? "u" : "i") + " = " + num(p.source.deg) + "°";
  }

  /* ---------- cac buoc giai ---------- */

  function stepComplexify(p) {
    var w = p.source.omega;
    var lines = ["Nguồn u(t) = " + p.source.label + " V ⇒ biên độ " + sourceAmp(p) + ", ω = " + w + " rad/s.",
      "Ảnh phức của nguồn: " + dot("U_o") + " = " + p.source.complexLabel + "."];
    allElems(p).forEach(function (e) {
      var z = rect(C.impedance(e, w));
      if (e.kind === "L" && e.h != null) lines.push("Cuộn cảm " + e.label + ": Z_L = jωL = j·" + w + "·" + e.h + " = " + z + " Ω");
      if (e.kind === "C" && e.f != null) {
        lines.push(["Tụ " + e.label + ": Z_C = ", fr("1", "jωC"), " = ", fr("1", "j·" + w + "·" + e.label.replace(" F", "")), " = " + z + " Ω"]);
      }
    });
    lines.push(resistorLine(p));
    return {
      title: "Bước 1. Phức hoá mạch", lines: lines.filter(Boolean),
      caption: "Vẽ lại mạch sau khi phức hoá (mọi phần tử đổi thành tổng trở Ω):", figure: SVG.draw(p, true)
    };
  }

  function stepConvention(p) {
    var src = pol(C.polar(p.source.mag, p.source.deg));
    var first = p.source.type === "V"
      ? "Nguồn áp dạng phức: " + dot("U_o") + " = " + src + " V ⇒ biên độ " + sourceAmp(p) + "."
      : "Nguồn dòng dạng phức: " + dot("I_o") + " = " + src + " A ⇒ biên độ " + sourceAmp(p) + ".";
    return {
      title: "Bước 1. Nhận xét mạch",
      lines: [
        first,
        "Cuộn cảm và tụ đã ghi sẵn tổng trở jX_L, −jX_C.",
        resistorLine(p),
        "Đề không cho ω nên phương trình tức thời viết theo ω."
      ].filter(Boolean)
    };
  }

  /** "a + b = " truoc ket qua, bo qua khi chi 1 so hang hoac phep cong da chinh la ket qua (vd 1 + j1). */
  function sumPrefix(parts, z) {
    var expr = parts.join(" + ").replace(/\+ \(−([^)]*)\)/g, "− $1");
    return parts.length > 1 && expr !== rect(z) ? expr + " = " : "";
  }

  function stepImpedance(p, s) {
    var w = p.source.omega;
    var lines = [];
    if (hasSeries(p)) {
      var sp = p.series.map(function (e) { return term(C.impedance(e, w)); });
      lines.push("Đoạn nối tiếp: Z_nt = " + sumPrefix(sp, s.zSeries) + rect(s.zSeries) + " Ω");
    }
    p.branches.forEach(function (b, k) {
      var parts = b.elems.map(function (e) { return term(C.impedance(e, w)); });
      lines.push("Nhánh " + (k + 1) + ": " + zName(b) + " = " + sumPrefix(parts, s.zBranches[k]) + rect(s.zBranches[k]) + " Ω");
    });
    var z1 = s.zBranches[0], z2 = s.zBranches[1];
    var n1 = zName(p.branches[0]), n2 = zName(p.branches[1]);
    lines.push(["Hai nhánh song song: Z_AB = ", fr(n1 + "·" + n2, n1 + " + " + n2), " = ",
      fr(term(z1) + "·" + term(z2), rect(z1) + " + " + term(z2)), " = ",
      fr(rect(C.mul(z1, z2)), rect(C.add(z1, z2))), " = " + rect(s.zPar) + " Ω"]);
    if (hasSeries(p)) {
      lines.push("Toàn mạch: Z_tđ = Z_nt + Z_AB = " + term(s.zSeries) + " + " + term(s.zPar) + " = " + rect(s.zTotal) + " Ω");
    } else if (p.source.type === "V") {
      lines.push("Toàn mạch: Z_tđ = Z_AB = " + rect(s.zPar) + " Ω");
    }
    return { title: "Bước 2. Tổng trở", lines: lines };
  }

  function stepCurrents(p, s) {
    var lines = [];
    var src = C.polar(p.source.mag, p.source.deg);
    var io = s.current;
    if (p.source.type === "V") {
      lines.push(["Dòng toàn mạch (dạng phức): " + dot("I_o") + " = ", fr(dot("U_o"), "Z_tđ"), " = ",
        fr(pol(src), rect(s.zTotal)), " = " + both(io) + " A"]);
    } else {
      lines.push("Dòng toàn mạch chính là dòng nguồn: " + dot("I_o") + " = " + both(io) + " A");
      lines.push("Điện áp hai đầu cụm song song: " + dot("U_{AB}") + " = " + dot("I_o") + "·Z_AB = " + term(io) + "·" + term(s.zPar) +
        " = " + both(s.vPar) + " V");
    }
    var b1 = p.branches[0], b2 = p.branches[1];
    var z1 = s.zBranches[0], z2 = s.zBranches[1];
    lines.push(["Chia dòng: " + dot(b1.current) + " = " + dot("I_o") + "·", fr(zName(b2), zName(b1) + " + " + zName(b2)), " = ",
      fr(term(io) + "·" + term(z2), rect(C.add(z1, z2))), " = " + both(s.branchI[0]) + " A"]);
    lines.push("Kirchhoff 1: " + dot(b2.current) + " = " + dot("I_o") + " − " + dot(b1.current) + " = " + term(io) + " − " +
      term(s.branchI[0]) + " = " + both(s.branchI[1]) + " A");
    (p.voltages || []).forEach(function (v) {
      lines.push(v.text + " = " + both(s.voltages[v.name]) + " V");
    });
    return { title: "Bước 3. Dòng điện các nhánh" + ((p.voltages || []).length ? " và điện áp" : ""), lines: lines };
  }

  /** "sin(2t − 8,13°)" hoac "cos(ωt + 45°)" */
  function waveArg(p, z) {
    var deg = Math.round(C.arg(z) * 100) / 100;
    var wt = p.source.omega ? p.source.omega + "t" : "ωt";
    var f = fnName(p);
    if (deg === 0) return f + "(" + wt + ")";
    return f + "(" + wt + (deg < 0 ? " − " : " + ") + num(Math.abs(deg)) + "°)";
  }

  /** Bien do: "2sin" ; "50√2·sin" ; "sin" khi bien do = 1. */
  function amp(x) {
    var a = num(x);
    return a === "1" ? "" : a.indexOf("√") >= 0 ? a + "·" : a;
  }

  function timeLine(p, name, z, unit) {
    return lower(name) + "(t) = " + amp(C.abs(z)) + waveArg(p, z) + " " + unit;
  }

  /** Binh phuong trong bieu thuc: "1,41²" ; "(50√2)²" */
  function squared(x) {
    var a = num(x);
    return (a.indexOf("√") >= 0 ? "(" + a + ")" : a) + "²";
  }

  function timeLines(p, s) {
    var lines = [];
    if (p.source.type === "V") lines.push(timeLine(p, "I_o", s.current, "A"));
    p.branches.forEach(function (b, k) { lines.push(timeLine(p, b.current, s.branchI[k], "A")); });
    (p.voltages || []).forEach(function (v) { lines.push(timeLine(p, v.name, s.voltages[v.name], "V")); });
    return lines;
  }

  function stepTime(p, s) {
    var head = fnName(p) === "cos"
      ? "Đề cho nguồn dạng cos nên viết theo cos: X∠φ ⇒ x(t) = X·cos(ωt + φ):"
      : "Mặc định viết theo sin: X∠φ ⇒ x(t) = X·sin(ωt + φ):";
    return { title: "Bước 4. Phương trình tức thời", lines: [head].concat(timeLines(p, s)) };
  }

  function stepPower(p, s) {
    var u = dot(p.source.type === "V" ? "U_o" : "U_{AB}");
    var q = Math.round(s.power.im * 100) / 100;
    var nature = q === 0 ? "Q = 0: tải thuần trở" : q < 0 ? "Q < 0: tải mang tính dung" : "Q > 0: tải mang tính cảm";
    var rTerms = [], rSum = 0;
    function addR(r, z) { rTerms.push(r + "·" + squared(C.abs(z))); rSum += r * C.abs(z) * C.abs(z); }
    (p.series || []).forEach(function (e) { if (e.kind === "R") addR(e.value, s.current); });
    p.branches.forEach(function (b, n) { b.elems.forEach(function (e) { if (e.kind === "R") addR(e.value, s.branchI[n]); }); });
    return {
      title: "Bước 5. Công suất nguồn cấp cho tải",
      lines: [
        ["S̃ = ", fr("1", "2"), "·" + u + "·" + dot("I_o") + "* = ", fr("1", "2"), "·" + pol(s.vSource) + "·" + pol(C.conj(s.current)) +
          " = " + rect(s.power) + " VA  (" + dot("I_o") + "* là số phức liên hợp; theo biên độ nên nhân ", fr("1", "2"), ")"],
        "P = Re(S̃) = " + num(s.power.re) + " W",
        "Q = Im(S̃) = " + num(q) + " VAR  (" + nature + ")",
        "S = |S̃| = √(P² + Q²) = " + num(C.abs(s.power)) + " VA",
        ["Kiểm tra: P = ", fr("1", "2"), "·Σ R·I² = ", fr("1", "2"), "·(" + rTerms.join(" + ") + ") = " + num(rSum / 2) + " W ✓"]
      ]
    };
  }

  /* ---------- 1 bai ---------- */
  function buildProblem(p) {
    var s = C.solve(p);
    var card = el("article", { "class": "kh-prob xl-prob" });
    card.appendChild(el("div", { "class": "kh-head" }, [
      el("span", { "class": "kh-num", text: "Bài " + p.id }),
      el("h2", { "class": "kh-ask", text: p.title })
    ]));
    card.appendChild(rich("p", p.asks, { "class": "xl-asks" }));
    card.appendChild(el("figure", { "class": "xl-fig" }, [SVG.draw(p, false)]));

    var steps = [
      allElems(p).some(function (e) { return e.h != null || e.f != null; }) ? stepComplexify(p) : stepConvention(p),
      stepImpedance(p, s), stepCurrents(p, s), stepTime(p, s), stepPower(p, s)
    ];
    var sol = el("section", { "class": "xl-sol", "aria-label": "Lời giải bài " + p.id }, [el("h3", { "class": "xl-sol-title", text: "Lời giải" })]);
    steps.forEach(function (st) {
      sol.appendChild(el("h4", { text: st.title }));
      sol.appendChild(el("ul", { "class": "xl-steps" }, st.lines.map(function (t) { return rich("li", t); })));
      if (st.figure) {
        sol.appendChild(el("p", { "class": "xl-cap", text: st.caption }));
        sol.appendChild(el("figure", { "class": "xl-fig" }, [st.figure]));
      }
    });
    var final = timeLines(p, s).concat(["P = " + num(s.power.re) + " W;  Q = " + num(s.power.im) + " VAR;  S = " + num(C.abs(s.power)) + " VA"]);
    sol.appendChild(el("div", { "class": "xl-answer" }, [
      el("h4", { text: "Đáp số" }),
      el("ul", { "class": "xl-steps" }, final.map(function (t) { return rich("li", t); }))
    ]));
    card.appendChild(sol);
    return card;
  }

  /* ---------- tabs ---------- */
  var tabs = el("div", { "class": "kh-tabs", role: "tablist", "aria-label": "Chọn bài" });
  var panels = el("div");
  var entries = [];

  problems.forEach(function (p) {
    var panel = el("section", { role: "tabpanel", id: "bai" + p.id, hidden: "", "aria-label": "Bài " + p.id }, [buildProblem(p)]);
    var tab = el("button", { type: "button", role: "tab", text: "Bài " + p.id, "aria-controls": "bai" + p.id });
    tab.addEventListener("click", function () { select(p.id, true); });
    tabs.appendChild(tab);
    panels.appendChild(panel);
    entries.push({ id: p.id, tab: tab, panel: panel });
  });

  function select(id, updateHash) {
    entries.forEach(function (e) {
      var active = e.id === id;
      e.tab.setAttribute("aria-selected", active ? "true" : "false");
      e.panel.hidden = !active;
    });
    if (updateHash && history.replaceState) history.replaceState(null, "", "#bai" + id);
  }

  app.appendChild(tabs);
  app.appendChild(panels);

  var fromHash = /^#bai(\d+)$/.exec(location.hash);
  var initial = fromHash ? parseInt(fromHash[1], 10) : 0;
  select(entries.some(function (e) { return e.id === initial; }) ? initial : (entries[0] && entries[0].id), false);
})();
