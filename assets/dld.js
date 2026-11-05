/* Trang de on kiem tra 1 tiet Do luong dien: 6 de (Cau 1 Shunt x3, Cau 2 dien tro phu x3), moi de 2 phan a/b.
   So lieu tu assets/dld-data.js, tinh bang assets/dld-calc.js, hinh ve bang assets/dld-svg.js. */
(function () {
  "use strict";

  var sets = Array.isArray(window.DLD_SETS) ? window.DLD_SETS : [];
  var app = document.getElementById("dldApp");
  var C = window.DLD_CALC;
  if (!app || !C || !window.DLD_SVG) return;

  var POS = ["A", "B", "C"], R = ["R₁", "R₂", "R₃"];
  var n = C.num;

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { node.appendChild(c); });
    return node;
  }

  /** "I_gm" / "R_g" -> chi so <sub>. */
  function rich(tag, text, cls) {
    var node = el(tag, cls ? { "class": cls } : {}), re = /_([0-9A-Za-zÀ-ỹ]+)/g, last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) node.appendChild(document.createTextNode(text.slice(last, m.index)));
      node.appendChild(el("sub", { text: m[1] }));
      last = re.lastIndex;
    }
    if (last < text.length) node.appendChild(document.createTextNode(text.slice(last)));
    return node;
  }

  /** Dong dien viet theo SI nhu giao trinh: 100 µA -> "100.10⁻⁶", 20 mA -> "20.10⁻³". */
  function siA(i) {
    if (i < 1e-3) return n(i / 1e-6) + ".10⁻⁶";
    if (i < 1) return n(i / 1e-3) + ".10⁻³";
    return n(i);
  }

  /** Dien tro trung gian: so nguyen giu nguyen (98000), con lai lam tron 4 chu so. */
  function ohm(x) { return Number.isInteger(x) ? String(x) : n(x); }

  function list(values, fmt) { return values.map(fmt).join("; "); }

  function meter(s) { return "giá trị giới hạn đo I_gm = " + C.fmtA(s.igm) + ", nội trở của cơ cấu đo R_g = " + C.fmtOhm(s.rg); }

  function asks(s) {
    var isShunt = s.kind === "shunt", fmt = isShunt ? C.fmtA : C.fmtV;
    var what = isShunt ? "điện trở Shunt" : "điện trở phụ";
    var tail = function (part) { return ". Tính các giá trị " + what + " để có ba thang đo " + list(part.ranges, fmt) + " tương ứng với khóa chuyển mạch S ở vị trí A, B và C."; };
    var name = isShunt ? ["mạch Shunt riêng rẽ", "mạch Shunt vạn năng"] : ["mạch điện trở phụ riêng rẽ", "mạch điện trở phụ vạn năng"];
    return [
      "a) Cho " + name[0] + " như hình. Biết cơ cấu đo từ điện có " + meter(s) + tail(s.a),
      "b) Cho " + name[1] + " như hình. Biết cơ cấu đo từ điện có " + meter(s) + tail(s.b)
    ];
  }

  function shuntSepSteps(s) {
    var r = C.shuntSeparate(s.rg, s.igm, s.a.ranges);
    var lines = ["Điện trở Shunt mắc song song với cơ cấu đo ⇒ U_S = U_g ⇒ R_S × I_S = R_g × I_gm, với I_S = I − I_gm."];
    s.a.ranges.forEach(function (i, k) {
      lines.push("Khi khóa S ở vị trí " + POS[k] + ": R_S = " + R[k] + ", I_S = I_" + POS[k] + " − I_gm");
      lines.push("⇒ " + R[k] + " = R_g × I_gm / (I_" + POS[k] + " − I_gm) = " + ohm(s.rg) + " × " + siA(s.igm) + " / (" + siA(i) + " − " + siA(s.igm) + ") = " + C.fmtOhm(r[k]));
    });
    return { steps: [{ title: "Lời giải", lines: lines }], answer: r };
  }

  function shuntUniSteps(s) {
    var I = s.b.ranges, x = C.shuntUniversal(s.rg, s.igm, I), sum = ohm(s.rg) + " + " + n(x.rsh);
    return {
      steps: [
        { title: "Thiết lập 3 phương trình", lines: [
          "Khi khóa S ở vị trí A: R_S = R₁ + R₂ + R₃, nhánh cơ cấu chỉ có R_g",
          "⇒ R₁ + R₂ + R₃ = R_g × I_gm / (I_A − I_gm) = " + ohm(s.rg) + " × " + siA(s.igm) + " / (" + siA(I[0]) + " − " + siA(s.igm) + ") = " + n(x.rsh) + " Ω   (1)",
          "Khi khóa S ở vị trí B: R_S = R₁ + R₂, R₃ nối tiếp cơ cấu ⇒ R₁ + R₂ = (R_g + R₃) × I_gm / (I_B − I_gm)   (2)",
          "Khi khóa S ở vị trí C: R_S = R₁, R₂ + R₃ nối tiếp cơ cấu ⇒ R₁ = (R_g + R₂ + R₃) × I_gm / (I_C − I_gm)   (3)"
        ] },
        { title: "Giải hệ 3 phương trình", lines: [
          "Từ (2): (R₁ + R₂)(I_B − I_gm) = (R_g + R₃) × I_gm ⇒ (R₁ + R₂) × I_B = (R_g + R₁ + R₂ + R₃) × I_gm",
          "⇒ R₁ + R₂ = (R_g + R₁ + R₂ + R₃) × I_gm / I_B = (" + sum + ") × " + siA(s.igm) + " / " + siA(I[1]) + " = " + n(x.r12) + " Ω",
          "Từ (3): R₁ × (I_C − I_gm) = (R_g + R₂ + R₃) × I_gm ⇒ R₁ × I_C = (R_g + R₁ + R₂ + R₃) × I_gm",
          "⇒ R₁ = (" + sum + ") × " + siA(s.igm) + " / " + siA(I[2]) + " = " + C.fmtOhm(x.r1),
          "⇒ R₂ = (R₁ + R₂) − R₁ = " + n(x.r12) + " − " + n(x.r1) + " = " + C.fmtOhm(x.r2),
          "⇒ R₃ = (R₁ + R₂ + R₃) − (R₁ + R₂) = " + n(x.rsh) + " − " + n(x.r12) + " = " + C.fmtOhm(x.r3)
        ] }
      ],
      answer: [x.r1, x.r2, x.r3]
    };
  }

  function multSepSteps(s) {
    var r = C.multSeparate(s.rg, s.igm, s.a.ranges);
    var lines = ["Điện trở phụ mắc nối tiếp cơ cấu đo; kim lệch hết thang khi I_g = I_gm ⇒ U = I_gm × (R_g + R_P) ⇒ R_P = U / I_gm − R_g."];
    s.a.ranges.forEach(function (u, k) {
      lines.push("Khi khóa S ở vị trí " + POS[k] + ": R_P = " + R[k] + " = U_" + POS[k] + " / I_gm − R_g = " + n(u) + " / " + siA(s.igm) + " − " + ohm(s.rg) + " = " + C.fmtOhm(r[k]));
    });
    return { steps: [{ title: "Lời giải", lines: lines }], answer: r };
  }

  function multUniSteps(s) {
    var U = s.b.ranges, r = C.multUniversal(s.rg, s.igm, U);
    var prev = ["", " − " + ohm(r[0]), " − " + ohm(r[0]) + " − " + ohm(r[1])];
    var sym = ["R_P = R₁ ⇒ R₁ = U_A / I_gm − R_g", "R_P = R₁ + R₂ ⇒ R₂ = U_B / I_gm − R_g − R₁", "R_P = R₁ + R₂ + R₃ ⇒ R₃ = U_C / I_gm − R_g − R₁ − R₂"];
    var lines = ["Các điện trở phụ nối tiếp nhau: thang sau dùng lại các điện trở của thang trước, R_P = U / I_gm − R_g."];
    U.forEach(function (u, k) {
      lines.push("Khi khóa S ở vị trí " + POS[k] + ": " + sym[k]);
      lines.push("= " + n(u) + " / " + siA(s.igm) + " − " + ohm(s.rg) + prev[k] + " = " + C.fmtOhm(r[k]));
    });
    return { steps: [{ title: "Lời giải", lines: lines }], answer: r };
  }

  function card(de, part, ask, fig, caption, solved) {
    var sol = el("details", { "class": "kh-sol kh-worked-sol" }, [el("summary", { text: "Xem lời giải câu " + part })]);
    solved.steps.forEach(function (st) {
      sol.appendChild(el("h4", { text: st.title }));
      sol.appendChild(el("ul", { "class": "kh-steps" }, st.lines.map(function (l) { return rich("li", l); })));
    });
    sol.appendChild(el("p", { "class": "dld-ans", text: "Đáp số: " + solved.answer.map(function (v, k) { return R[k] + " = " + C.fmtOhm(v); }).join(" ; ") }));
    return el("article", { "class": "kh-prob" }, [
      el("div", { "class": "kh-head" }, [el("span", { "class": "kh-num", text: "Đề " + de + " · câu " + part }), rich("p", ask, "kh-ask")]),
      el("figure", { "class": "kh-fig kh-fig-svg" }, [window.DLD_SVG.draw(fig, caption), el("figcaption", { "class": "dld-cap", text: caption })]),
      sol
    ]);
  }

  function panelFor(s) {
    var q = asks(s), shunt = s.kind === "shunt";
    var head = el("p", { "class": "dld-lead", text: shunt ? "Xác định điện trở mở rộng tầm đo của cơ cấu đo từ điện đo dòng điện 1 chiều, mở rộng 3 tầm đo." : "Xác định điện trở phụ mở rộng tầm đo của cơ cấu đo từ điện đo điện áp 1 chiều, mở rộng 3 tầm đo." });
    return [
      head,
      shunt ? card(s.no, "a", q[0], "shuntSep", "Mạch Shunt riêng rẽ", shuntSepSteps(s))
        : card(s.no, "a", q[0], "multSep", "Mạch điện trở phụ riêng rẽ", multSepSteps(s)),
      shunt ? card(s.no, "b", q[1], "shuntUni", "Mạch Shunt vạn năng", shuntUniSteps(s))
        : card(s.no, "b", q[1], "multUni", "Mạch điện trở phụ vạn năng", multUniSteps(s))
    ];
  }

  var tabs = el("div", { "class": "kh-tabs", role: "tablist", "aria-label": "Chọn đề" });
  var panels = el("div");
  var entries = [];

  sets.forEach(function (s, idx) {
    s = Object.assign({}, s, { no: idx + 1 });
    var panel = el("section", { role: "tabpanel", id: s.id, hidden: "", "aria-label": "Đề " + s.no }, panelFor(s));
    var tab = el("button", { type: "button", role: "tab", text: "Đề " + s.no, "aria-controls": s.id });
    tab.addEventListener("click", function () { select(s.id, true); });
    tabs.appendChild(tab);
    panels.appendChild(panel);
    entries.push({ id: s.id, tab: tab, panel: panel });
  });

  function select(id, updateHash) {
    entries.forEach(function (e) {
      var active = e.id === id;
      e.tab.setAttribute("aria-selected", active ? "true" : "false");
      e.panel.hidden = !active;
    });
    if (updateHash && history.replaceState) history.replaceState(null, "", "#" + id);
  }

  app.appendChild(tabs);
  app.appendChild(panels);

  var fromHash = location.hash.slice(1);
  select(entries.some(function (e) { return e.id === fromHash; }) ? fromHash : (entries[0] && entries[0].id), false);
})();
