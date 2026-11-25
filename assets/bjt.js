/* Trang bai tap transistor BJT (/baitaptransistor): de trong assets/bjt-data.js,
   dap an tinh bang assets/bjt-calc.js, doc so/so sanh bang assets/phanap-calc.js, so do bang assets/bjt-svg.js.
   Khung tab + o nhap tu cham giong assets/zener.js; them o chon che do (ngung dan / khuech dai / bao hoa). */
(function () {
  "use strict";

  var C = window.BJT_CALC, F = window.PA_CALC, SVG = window.BJT_SVG;
  var problems = Array.isArray(window.BJT_PROBLEMS) ? window.BJT_PROBLEMS : [];
  var app = document.getElementById("bjApp");
  if (!app || !C || !F || !SVG) return;

  var MODES = { cut: "ngưng dẫn", active: "khuếch đại", sat: "bão hoà" };

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return node;
  }
  /** "I_Cmax = V_CC/R_C" -> text co <sub>. */
  function rich(tag, text, attrs) {
    var node = el(tag, attrs);
    var re = /_(\{[^}]+\}|[0-9A-Za-z]+)/g, last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) node.appendChild(document.createTextNode(text.slice(last, m.index)));
      node.appendChild(el("sub", { text: m[1].replace(/[{}]/g, "") }));
      last = re.lastIndex;
    }
    if (last < text.length) node.appendChild(document.createTextNode(text.slice(last)));
    return node;
  }

  var n = function (x, d) { return F.fmt(x, d === undefined ? 2 : d); };
  var nm = function (a, d) { return n(a * 1000, d); };        // A -> so mA
  var mA = function (a, d) { return nm(a, d) + " mA"; };
  var V = function (v) { return n(v) + " V"; };
  var ohm = function (r) { return F.fmtOhm(r); };
  var kohm = function (r) { return n(r / 1000, 3); };          // ohm -> so kOhm

  /* ---------- Dang 1: diem Q ---------- */
  var Q_NAMES = ["a", "b", "c", "d"];

  function rSum(p) { return p.re ? "(R_C + R_E)" : "R_C"; }
  function rSumVal(p) { return p.re ? "(" + n(p.rc) + " + " + n(p.re) + ")" : n(p.rc); }

  function qCase(p, vbb, k, icmax) {
    var r = C.qPoint({ vcc: p.vcc, vbb: vbb, rb: p.rb, rc: p.rc, re: p.re, beta: p.beta });
    var qn = "Q_" + (k + 1);
    var head = Q_NAMES[k] + ". V_BB = " + V(vbb) + ": ";
    var steps = [];
    if (r.mode === "cut") {
      steps.push(head + "V_BB < V_BE = 0,7 V ⇒ I_B = 0 ⇒ I_C = 0: transistor ngưng dẫn");
      steps.push("V_CE = V_CC = " + V(p.vcc) + " ⇒ " + qn + "(0 mA; " + V(p.vcc) + ")");
    } else {
      steps.push(head + "V_BB > 0,7 V nên transistor dẫn. K2 vòng 1: −V_BB + I_B·R_B + V_BE" + (p.re ? " + I_E·R_E = 0, với I_E = (1 + β)·I_B" : " = 0"));
      steps.push(p.re
        ? "⇒ I_B = (V_BB − V_BE) / [R_B + (1 + β)R_E] = (" + n(vbb) + " − 0,7) / (" + kohm(p.rb) + " + " + (p.beta + 1) + " × " + kohm(p.re) + ") kΩ = " + mA(r.ib, 4)
        : "⇒ I_B = (V_BB − V_BE) / R_B = (" + n(vbb) + " − 0,7) / " + kohm(p.rb) + " kΩ = " + mA(r.ib, 4));
      if (r.mode === "active") {
        steps.push("β·I_B = " + p.beta + " × " + nm(r.ib, 4) + " = " + mA(r.bib) + " < I_Cmax = " + mA(icmax) + " ⇒ khuếch đại: I_C = β·I_B = " + mA(r.ic));
        steps.push("V_CE = V_CC − I_C·" + rSum(p) + " = " + n(p.vcc) + " − " + nm(r.ic) + "×10⁻³ × " + rSumVal(p) + " = " + V(r.vce) + " ⇒ " + qn + "(" + mA(r.ic) + "; " + V(r.vce) + ")");
      } else {
        steps.push("β·I_B = " + p.beta + " × " + nm(r.ib, 4) + " = " + mA(r.bib) + " ≥ I_Cmax = " + mA(icmax) + " ⇒ bão hoà");
        steps.push("I_C = I_Cmax = " + mA(r.ic) + ", V_CE = V_CEsat = 0,2 V ⇒ " + qn + "(" + mA(r.ic) + "; 0,2 V)");
      }
    }
    return {
      r: r, steps: steps, qn: qn,
      group: { title: qn + " · V_BB = " + V(vbb), items: [
        { label: "Chế độ", choice: true, want: r.mode },
        { label: "I_C", unit: "mA", want: r.ic * 1000 },
        { label: "V_CE", unit: "V", want: r.vce }] }
    };
  }

  function q(p) {
    var icmax = C.loadLine(p).icmax;
    var cases = p.vbb.map(function (vbb, k) { return qCase(p, vbb, k, icmax); });
    var steps = [
      "1. DCLL · K2 vòng 2 (I_E ≈ I_C): −V_CC + I_C·R_C + V_CE" + (p.re ? " + I_C·R_E" : "") + " = 0 ⇒ I_C = (V_CC − V_CE) / " + rSum(p),
      "V_CE = 0 ⇒ I_Cmax = V_CC / " + rSum(p) + " = " + n(p.vcc) + " / " + rSumVal(p) + " = " + mA(icmax),
      "I_C = 0 ⇒ V_CE = V_CC = " + V(p.vcc) + ". DCLL nối hai điểm (0 V; " + mA(icmax) + ") và (" + V(p.vcc) + "; 0 mA).",
      "2. Điểm làm việc Q:"
    ];
    cases.forEach(function (c) { steps = steps.concat(c.steps); });
    return {
      chips: ["V_CC = " + V(p.vcc), "R_B = " + ohm(p.rb), "R_C = " + ohm(p.rc), p.re ? "R_E = " + ohm(p.re) : "R_E = 0 (cực E nối thẳng xuống mass)", "β = " + p.beta],
      figs: [SVG.bias({ two: true, re: p.re > 0 })],
      asks: ["Vẽ đường tải tĩnh DCLL: tính I_Cmax.",
        "Xác định chế độ hoạt động và điểm làm việc Q(I_C; V_CE) khi V_BB = " + p.vbb.map(V).join("; ") + "."],
      groups: [{ title: "Đường tải tĩnh DCLL", items: [{ label: "I_Cmax", unit: "mA", want: icmax * 1000 }] }]
        .concat(cases.map(function (c) { return c.group; })),
      hint: "Dòng nhập theo mA, điện áp theo V. Làm tròn 2 chữ số sau dấu phẩy; dấu phẩy hay chấm đều được. Giữ I_B nhiều chữ số khi nhân với β để không lệch.",
      steps: steps,
      solFig: SVG.loadLine(p.vcc, Math.round(icmax * 100000) / 100, cases.map(function (c) {
        return { vce: c.r.vce, icMa: c.r.ic * 1000, name: c.qn.replace("_", "") };
      }))
    };
  }

  /* ---------- Dang 2 ---------- */
  function checkLine(p, std) {
    var r = C.qPoint({ vcc: p.vcc, vbb: p.vcc, rb: std.rb, rc: std.rc, re: std.re, beta: p.beta });
    return "Kiểm tra với giá trị chuẩn: I_B = (V_CC − 0,7) / [R_B + (1 + β)R_E] = " + mA(r.ib, 4) + " ⇒ I_C = " + mA(r.ic) +
      ", V_CE ≈ " + V(r.vce) + ": gần đúng điểm Q cần thiết kế.";
  }

  function act(p) {
    var r = C.designActive(p);
    return {
      chips: ["V_CC = " + V(p.vcc), "I_C = " + mA(p.ic), "V_CE = " + p.vceText, "β = " + p.beta, "V_E ≈ 10% V_CC", "V_BE = 0,7 V"],
      figs: [SVG.bias({ two: false, re: true })],
      asks: ["Chọn R_E, R_C, R_B để transistor hoạt động ở chế độ khuếch đại với điểm Q trên: tính R_E, R_C, I_B, R_B rồi chọn giá trị chuẩn E12."],
      groups: [{ title: "Giá trị tính được", items: [
        { label: "R_E", unit: "Ω", want: r.re }, { label: "R_C", unit: "Ω", want: r.rc },
        { label: "I_B", unit: "mA", want: r.ib * 1000 }, { label: "R_B", unit: "kΩ", want: r.rb / 1000 }] }],
      hint: "R_E, R_C nhập theo Ω, R_B theo kΩ, I_B theo mA. Nhập giá trị tính được (trước khi chọn giá trị chuẩn), làm tròn 2 chữ số sau dấu phẩy.",
      steps: [
        "V_CE = " + p.vceText + " = " + V(p.vce),
        "Chọn V_E ≈ 10% V_CC = " + V(p.ve) + " ⇒ R_E = V_E / I_E ≈ V_E / I_C = " + n(p.ve) + " / (" + nm(p.ic) + "×10⁻³) = " + n(r.re) + " Ω ⇒ chọn R_E = " + ohm(r.std.re),
        "K2 vòng 2: −V_CC + I_C·R_C + V_CE + V_E = 0 ⇒ R_C = (V_CC − V_CE − V_E) / I_C = (" + n(p.vcc) + " − " + n(p.vce) + " − " + n(p.ve) + ") / (" + nm(p.ic) + "×10⁻³) = " + n(r.rc) + " Ω ⇒ chọn R_C = " + ohm(r.std.rc),
        "I_B = I_C / β = " + nm(p.ic) + " / " + p.beta + " = " + mA(r.ib, 3),
        "K2 vòng 1: −V_CC + I_B·R_B + V_BE + V_E = 0 ⇒ R_B = (V_CC − V_BE − V_E) / I_B = (" + n(p.vcc) + " − 0,7 − " + n(p.ve) + ") / (" + nm(r.ib, 3) + "×10⁻³) = " + kohm(r.rb) + " kΩ ⇒ chọn R_B = " + ohm(r.std.rb),
        checkLine(p, r.std)
      ]
    };
  }

  function sat(p) {
    var r = C.designSat(p);
    return {
      chips: ["V_CC = " + V(p.vcc), "I_Cmax = " + mA(p.icmax), "β = " + p.beta, "K = " + p.k, "V_E = " + V(p.ve), "V_BEsat = 0,8 V", "V_CEsat = 0,2 V"],
      figs: [SVG.bias({ two: false, re: true })],
      asks: ["Chọn R_E, R_B, R_C để transistor hoạt động ở chế độ bão hoà sâu: tính R_E, I_B, R_B, R_C rồi chọn giá trị chuẩn."],
      groups: [{ title: "Giá trị tính được", items: [
        { label: "R_E", unit: "Ω", want: r.re }, { label: "I_B", unit: "mA", want: r.ib * 1000 },
        { label: "R_B", unit: "kΩ", want: r.rb / 1000 }, { label: "R_C", unit: "Ω", want: r.rc }] }],
      hint: "R_E, R_C nhập theo Ω, R_B theo kΩ, I_B theo mA. Nhập giá trị tính được, làm tròn 2 chữ số sau dấu phẩy.",
      steps: [
        "I_Cmax = I_C ≈ I_E = " + mA(p.icmax) + " ⇒ R_E = V_E / I_E = " + n(p.ve) + " / (" + nm(p.icmax) + "×10⁻³) = " + n(r.re) + " Ω ⇒ chọn R_E = " + ohm(r.std.re),
        "Bão hoà sâu: I_C = β·I_B / K ⇒ I_B = K·I_Cmax / β = " + p.k + " × " + nm(p.icmax) + " / " + p.beta + " = " + mA(r.ib),
        "K2 vòng 1: −V_CC + I_B·R_B + V_BEsat + V_E = 0 ⇒ R_B = (" + n(p.vcc) + " − 0,8 − " + n(p.ve) + ") / (" + nm(r.ib) + "×10⁻³) = " + kohm(r.rb) + " kΩ ⇒ chọn R_B = " + ohm(r.std.rb) + " (nhỏ hơn giá trị tính để I_B lớn hơn, chắc chắn bão hoà)",
        "K2 vòng 2: −V_CC + I_Cmax·R_C + V_CEsat + V_E = 0 ⇒ R_C = (" + n(p.vcc) + " − 0,2 − " + n(p.ve) + ") / (" + nm(p.icmax) + "×10⁻³) = " + n(r.rc) + " Ω ⇒ chọn R_C = " + ohm(r.std.rc)
      ]
    };
  }

  function satrb(p) {
    var r = C.satRb(p);
    return {
      chips: ["V_CC = " + V(p.vcc), "R_C = " + ohm(p.rc), "R_E = " + ohm(p.re), "β = " + p.beta, "K = " + p.k, "V_BEsat = 0,8 V"],
      figs: [SVG.bias({ two: false, re: true })],
      asks: ["Tìm R_B để transistor hoạt động ở chế độ bão hoà sâu: tính I_Cmax, I_B, R_B rồi chọn giá trị chuẩn."],
      groups: [{ title: "Giá trị tính được", items: [
        { label: "I_Cmax", unit: "mA", want: r.icmax * 1000 }, { label: "I_B", unit: "mA", want: r.ib * 1000 },
        { label: "R_B", unit: "kΩ", want: r.rb / 1000 }] }],
      hint: "Dòng nhập theo mA, R_B theo kΩ. Làm tròn 2 chữ số sau dấu phẩy.",
      steps: [
        "K2 vòng 2: −V_CC + I_C·R_C + V_CE + I_C·R_E = 0 ⇒ I_C = (V_CC − V_CE) / (R_C + R_E)",
        "Cho V_CE = 0 ⇒ I_Cmax = " + n(p.vcc) + " / (" + n(p.rc) + " + " + n(p.re) + ") = " + mA(r.icmax),
        "I_B = K·I_Cmax / β = " + p.k + " × " + nm(r.icmax) + " / " + p.beta + " = " + mA(r.ib, 4),
        "K2 vòng 1: −V_CC + I_B·R_B + V_BEsat + I_Cmax·R_E = 0, với I_Cmax·R_E = " + nm(r.icmax) + "×10⁻³ × " + n(p.re) + " = " + V(r.ve),
        "⇒ R_B = (" + n(p.vcc) + " − 0,8 − " + n(r.ve) + ") / (" + nm(r.ib, 4) + "×10⁻³) = " + kohm(r.rb) + " kΩ ⇒ chọn R_B = " + ohm(r.std.rb) + " (không lớn hơn giá trị tính)"
      ]
    };
  }

  var BUILD = { q: q, act: act, sat: sat, satrb: satrb };

  /* ---------- o nhap ---------- */
  function makeField(it, pid) {
    var aria = it.label.replace(/_/g, " ") + (it.unit ? " (" + it.unit + ")" : "") + ", bài " + pid;
    if (it.choice) {
      var sel = el("select", { "aria-label": aria, "class": "bj-mode" }, [el("option", { value: "", text: "— chọn —" })]
        .concat(Object.keys(MODES).map(function (k) { return el("option", { value: k, text: MODES[k] }); })));
      return { node: sel, label: el("label", { "class": "kh-field" }, [rich("span", it.label + ":"), sel]),
        check: function () { return sel.value === it.want; } };
    }
    var input = el("input", { type: "text", inputmode: "decimal", autocomplete: "off", spellcheck: "false", "aria-label": aria });
    return { node: input, label: el("label", { "class": "kh-field" }, [rich("span", it.label + " ="), input, el("span", { "class": "dd-unit", text: it.unit })]),
      check: function () { return F.close(F.parseAnswer(input.value), it.want); } };
  }

  /* ---------- 1 bai ---------- */
  function buildProblem(p) {
    var d = BUILD[p.type](p);
    var fields = [];
    var card = el("article", { "class": "kh-prob pa-prob dd-prob bj-prob" });
    var msg = el("p", { "class": "kh-msg", role: "status" });
    var form = el("form", { "class": "kh-form", novalidate: "" });
    d.groups.forEach(function (gr) {
      var wrap = el("div", { "class": "kh-fields" });
      gr.items.forEach(function (it) { var f = makeField(it, p.id); fields.push(f); wrap.appendChild(f.label); });
      form.appendChild(el("div", { "class": "pa-group-in" }, [rich("h3", gr.title), wrap]));
    });
    var resetBtn = el("button", { "class": "kh-btn secondary", type: "button", text: "Làm lại" });
    form.appendChild(el("div", { "class": "kh-actions" }, [el("button", { "class": "kh-btn", type: "submit", text: "Kiểm tra" }), resetBtn]));
    form.appendChild(msg);

    function mark(f, state) { f.node.classList.remove("ok", "bad"); if (state) f.node.classList.add(state); }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var filled = fields.filter(function (f) { return f.node.value.trim() !== ""; });
      if (!filled.length) { msg.className = "kh-msg"; msg.textContent = "Hãy nhập đáp án rồi bấm Kiểm tra."; return; }
      var right = 0;
      fields.forEach(function (f) {
        if (f.node.value.trim() === "") return mark(f, null);
        var ok = f.check();
        mark(f, ok ? "ok" : "bad");
        if (ok) right++;
      });
      var allOk = right === fields.length, empty = fields.length - filled.length;
      card.classList.toggle("correct", allOk);
      msg.className = "kh-msg " + (allOk ? "ok" : "bad");
      msg.textContent = allOk ? "Đúng hết rồi!" :
        "Đúng " + right + "/" + fields.length + " ô" + (empty ? ", còn " + empty + " ô trống." : ". Sửa ô đỏ hoặc mở lời giải.");
    });

    var solution = el("details", { "class": "kh-sol pa-sol" }, [el("summary", { text: "Xem đáp án & lời giải chi tiết" })]);
    resetBtn.addEventListener("click", function () {
      fields.forEach(function (f) { f.node.value = ""; mark(f, null); });
      card.classList.remove("correct");
      msg.className = "kh-msg";
      msg.textContent = "";
      solution.open = false;
    });
    solution.appendChild(el("ul", { "class": "pa-steps" }, d.steps.map(function (t) { return rich("li", t); })));
    if (d.solFig) solution.appendChild(el("figure", { "class": "pa-fig" }, [d.solFig]));

    card.appendChild(el("div", { "class": "kh-head" }, [
      el("span", { "class": "kh-num", text: "Bài " + p.id }),
      rich("h2", p.kind, { "class": "kh-ask" })
    ]));
    card.appendChild(el("ul", { "class": "pa-givens" }, d.chips.map(function (t) { return rich("li", t); })));
    d.figs.forEach(function (f) { card.appendChild(el("figure", { "class": "pa-fig" }, [f])); });
    card.appendChild(el("ol", { "class": "pa-asks" }, d.asks.map(function (a) { return rich("li", a); })));
    card.appendChild(rich("p", d.hint, { "class": "kh-hint" }));
    card.appendChild(form);
    card.appendChild(solution);
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
