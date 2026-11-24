/* Trang bai tap mach on ap Zener (/baitapzener): de trong assets/zener-data.js,
   dap an tinh bang assets/zener-calc.js, doc so/so sanh bang assets/phanap-calc.js, so do bang assets/zener-svg.js.
   Loi giai theo trinh tu: K2 cho vong (1) -> K1 tai nut A -> dieu kien on ap I_Zmin <= I_Z <= I_Zmax. */
(function () {
  "use strict";

  var C = window.ZENER_CALC, F = window.PA_CALC, SVG = window.ZENER_SVG;
  var problems = Array.isArray(window.ZENER_PROBLEMS) ? window.ZENER_PROBLEMS : [];
  var app = document.getElementById("znApp");
  if (!app || !C || !F || !SVG) return;

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return node;
  }
  /** "I_Zmin = V_S/R_S" -> text co <sub>. */
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
  var nm = function (a) { return n(a * 1000); };           // A -> so mA
  var mA = function (a) { return nm(a) + " mA"; };
  var V = function (v, d) { return n(v, d) + " V"; };
  var ohm = function (r) { return n(r) + " Ω"; };

  /* ---------- on ap Zener ---------- */
  function zChips(p, extra) {
    var z = p.zener;
    return ["D_Z: V_Z = " + V(z.vz) + ", I_Zmin = " + mA(z.izmin) + ", I_Zmax = " + mA(z.izmax)].concat(extra);
  }
  var K2 = "K2 cho vòng (1): −V_S + I_S·R_S + V_Z = 0   (1)";
  var K1 = "K1 tại nút A: I_S − I_Z − I_RL = 0   (2)";
  function irlLine(z, rl, irl) {
    return "R_L mắc song song D_Z nên V_RL = V_Z: I_RL = V_Z / R_L = " + n(z.vz) + " / " + n(rl) + " = " + mA(irl);
  }

  function z1(p) {
    var z = p.zener, r = C.zenerPoint({ vz: z.vz, izmin: z.izmin, izmax: z.izmax, vs: p.vs, rs: p.rs, rl: p.rl });
    return {
      chips: zChips(p, ["V_S = " + V(p.vs), "R_S = " + ohm(p.rs), "R_L = " + ohm(p.rl)]),
      figs: [SVG.zener()],
      asks: ["Tính I_S, I_RL, I_Z, P_Z. Diode Zener có hoạt động ở chế độ ổn áp không?"],
      items: [{ label: "I_S", unit: "mA", want: r.is * 1000 }, { label: "I_RL", unit: "mA", want: r.irl * 1000 },
        { label: "I_Z", unit: "mA", want: r.iz * 1000 }, { label: "P_Z", unit: "W", want: r.pz }],
      steps: [K2,
        "⇒ I_S = (V_S − V_Z) / R_S = (" + n(p.vs) + " − " + n(z.vz) + ") / " + n(p.rs) + " = " + mA(r.is),
        irlLine(z, p.rl, r.irl),
        K1,
        "⇒ I_Z = I_S − I_RL = " + nm(r.is) + " − " + nm(r.irl) + " = " + mA(r.iz),
        "P_Z = I_Z × V_Z = " + nm(r.iz) + "×10⁻³ × " + n(z.vz) + " = " + n(r.pz) + " W",
        r.ok
          ? "I_Zmin = " + mA(z.izmin) + " ≤ I_Z = " + mA(r.iz) + " ≤ I_Zmax = " + mA(z.izmax) + " nên diode Zener hoạt động ở chế độ ổn áp: V_O = V_Z = " + V(z.vz) + "."
          : "I_Z = " + mA(r.iz) + " nằm ngoài khoảng " + mA(z.izmin) + " – " + mA(z.izmax) + " nên diode Zener không ổn áp."]
    };
  }

  function z2(p) {
    var z = p.zener, r = C.vsRange({ vz: z.vz, izmin: z.izmin, izmax: z.izmax, rs: p.rs, rl: p.rl });
    return {
      chips: zChips(p, ["R_S = " + ohm(p.rs), "R_L = " + ohm(p.rl)]),
      figs: [SVG.zener()],
      asks: ["Xác định khoảng thay đổi của V_S để mạch vẫn ổn áp: tính I_RL, V_Smin, V_Smax."],
      items: [{ label: "I_RL", unit: "mA", want: r.irl * 1000 }, { label: "V_Smin", unit: "V", want: r.lo }, { label: "V_Smax", unit: "V", want: r.hi }],
      steps: [
        "Để diode Zener hoạt động ổn áp: I_Zmin ≤ I_Z ≤ I_Zmax",
        K1 + " ⇒ I_Z = I_S − I_RL",
        "Từ (2): I_Zmin ≤ I_S − I_RL ≤ I_Zmax ⇔ I_Zmin + I_RL ≤ I_S ≤ I_Zmax + I_RL",
        irlLine(z, p.rl, r.irl),
        K2 + " ⇒ I_S = (V_S − V_Z) / R_S",
        "Từ (1) thay I_S vào: I_Zmin + I_RL ≤ (V_S − V_Z) / R_S ≤ I_Zmax + I_RL",
        "⇔ (I_Zmin + I_RL)·R_S + V_Z ≤ V_S ≤ (I_Zmax + I_RL)·R_S + V_Z",
        "⇔ (" + nm(z.izmin) + " + " + nm(r.irl) + ")×10⁻³ × " + n(p.rs) + " + " + n(z.vz) + " ≤ V_S ≤ (" + nm(z.izmax) + " + " + nm(r.irl) + ")×10⁻³ × " + n(p.rs) + " + " + n(z.vz),
        "⇔ " + V(r.lo, 3) + " ≤ V_S ≤ " + V(r.hi, 3)
      ]
    };
  }

  function z3(p) {
    var z = p.zener, r = C.rlRange({ vz: z.vz, izmin: z.izmin, izmax: z.izmax, vs: p.vs, rs: p.rs });
    return {
      chips: zChips(p, ["V_S = " + V(p.vs), "R_S = " + ohm(p.rs)]),
      figs: [SVG.zener()],
      asks: ["Xác định khoảng thay đổi của R_L để mạch vẫn ổn áp: tính I_S, R_Lmin, R_Lmax."],
      items: [{ label: "I_S", unit: "mA", want: r.is * 1000 }, { label: "R_Lmin", unit: "Ω", want: r.lo }, { label: "R_Lmax", unit: "Ω", want: r.hi }],
      steps: [
        K2,
        "⇒ I_S = (V_S − V_Z) / R_S = (" + n(p.vs) + " − " + n(z.vz) + ") / " + n(p.rs) + " = " + mA(r.is) + " (không phụ thuộc R_L)",
        "Để diode Zener hoạt động ổn áp: I_Zmin ≤ I_Z ≤ I_Zmax",
        K1 + " ⇒ I_Z = I_S − I_RL",
        "Từ (2): I_Zmin ≤ I_S − I_RL ≤ I_Zmax",
        "⇔ I_S − I_Zmin ≥ I_RL ≥ I_S − I_Zmax (nhân −1 nên đổi chiều bất đẳng thức)",
        "Mà I_RL = V_Z / R_L ⇒ V_Z / (I_S − I_Zmin) ≤ R_L ≤ V_Z / (I_S − I_Zmax) (nghịch đảo nên đổi chiều)",
        "⇔ " + n(z.vz) + " / ((" + nm(r.is) + " − " + nm(z.izmin) + ")×10⁻³) ≤ R_L ≤ " + n(z.vz) + " / ((" + nm(r.is) + " − " + nm(z.izmax) + ")×10⁻³)",
        "⇔ " + ohm(r.lo) + " ≤ R_L ≤ " + ohm(r.hi)
      ]
    };
  }

  var BUILD = { z1: z1, z2: z2, z3: z3 };

  /* ---------- 1 bai ---------- */
  function buildProblem(p) {
    var d = BUILD[p.type](p);
    var fields = [];
    var card = el("article", { "class": "kh-prob pa-prob dd-prob" });
    var msg = el("p", { "class": "kh-msg", role: "status" });
    var form = el("form", { "class": "kh-form", novalidate: "" });
    var wrap = el("div", { "class": "kh-fields" });
    d.items.forEach(function (it) {
      var input = el("input", { type: "text", inputmode: "decimal", autocomplete: "off", spellcheck: "false",
        "aria-label": it.label.replace(/_/g, " ") + " (" + it.unit + "), bài " + p.id });
      fields.push({ node: input, want: it.want });
      wrap.appendChild(el("label", { "class": "kh-field" }, [rich("span", it.label + " ="), input, el("span", { "class": "dd-unit", text: it.unit })]));
    });
    form.appendChild(el("div", { "class": "pa-group-in" }, [wrap]));
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
        var ok = F.close(F.parseAnswer(f.node.value), f.want);
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

    card.appendChild(el("div", { "class": "kh-head" }, [
      el("span", { "class": "kh-num", text: "Bài " + p.id }),
      rich("h2", p.kind, { "class": "kh-ask" })
    ]));
    card.appendChild(el("ul", { "class": "pa-givens" }, d.chips.map(function (t) { return rich("li", t); })));
    d.figs.forEach(function (f) { card.appendChild(el("figure", { "class": "pa-fig" }, [f])); });
    card.appendChild(el("ol", { "class": "pa-asks" }, d.asks.map(function (a) { return rich("li", a); })));
    card.appendChild(el("p", { "class": "kh-hint", text: "Dòng nhập theo mA, điện áp theo V, điện trở theo Ω, công suất theo W. Làm tròn 2 chữ số sau dấu phẩy; dấu phẩy hay chấm đều được." }));
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
