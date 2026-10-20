/* Trang bai tap phan ap & phan dong: dung giao dien tu assets/phanap-data.js,
   dap an + loi giai tinh bang assets/phanap-calc.js, so do ve bang assets/phanap-svg.js. */
(function () {
  "use strict";

  var C = window.PA_CALC;
  var SVG = window.PA_SVG;
  var problems = Array.isArray(window.PA_PROBLEMS) ? window.PA_PROBLEMS : [];
  var app = document.getElementById("paApp");
  if (!app || !C || !SVG) return;

  var SWATCH = {
    "Đen": "#1b1b1b", "Nâu": "#7B4A21", "Đỏ": "#D0352B", "Cam": "#EE7D1A", "Vàng": "#F4C430",
    "Xanh lục": "#2E8B3E", "Xanh lam": "#1E62C0", "Tím": "#7E3BA6", "Xám": "#8C8C8C",
    "Trắng": "#FFFFFF", "Vàng kim": "#C9A227", "Bạc": "#C0C0C0"
  };

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return node;
  }

  /** "V_CC·R_1/R_tđ" -> doan text co <sub>; "_{song song}" cho chi so nhieu chu. */
  function rich(tag, text, attrs) {
    var node = el(tag, attrs);
    var re = /_(\{[^}]+\}|[0-9A-Za-zđ]+)/g, last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) node.appendChild(document.createTextNode(text.slice(last, m.index)));
      node.appendChild(el("sub", { text: m[1].replace(/[{}]/g, "") }));
      last = re.lastIndex;
    }
    if (last < text.length) node.appendChild(document.createTextNode(text.slice(last)));
    return node;
  }

  var f2 = C.fmtResult;
  var mA = function (i) { return f2(i * 1000) + " mA"; };
  function sub(name) { return name.charAt(0) + "_" + name.slice(1); }

  /** Ky hieu tang: R1 -> "R_1"; cum -> "R_45" hoac "R_A". */
  function stageSym(p, k) {
    var names = p.stages[k];
    if (names.length === 1) return sub(names[0]);
    var g = p.groups && p.groups[k];
    return "R_" + (g || names.map(function (n) { return n.slice(1); }).join(""));
  }
  function stageVSym(p, k) {
    var g = p.groups && p.groups[k];
    return g ? "V_" + g : "V_" + stageSym(p, k).replace("_", "");
  }

  /* ---------- dap an can dien ---------- */
  function buildFields(p, sol) {
    var groups = [
      { title: "Điện trở tương đương (Ω)", items: [] },
      { title: "Dòng điện (mA)", items: [] },
      { title: "Điện áp (V)", items: [] }
    ];
    p.stages.forEach(function (names, k) {
      if (names.length > 1) groups[0].items.push({ label: stageSym(p, k), want: sol.stages[k].r });
    });
    groups[0].items.push({ label: "R_tđ", want: sol.rtd });
    groups[1].items.push({ label: "I", want: sol.current * 1000 });
    p.stages.forEach(function (names, k) {
      if (names.length > 1) sol.stages[k].branches.forEach(function (b) {
        groups[1].items.push({ label: "I_" + b.name.slice(1), want: b.i * 1000 });
      });
    });
    p.stages.forEach(function (_, k) { groups[2].items.push({ label: stageVSym(p, k), want: sol.stages[k].v }); });
    p.taps.forEach(function (t) {
      groups[2].items.push({ label: "V_" + t.name, want: p.vcc * sol.stages[t.node].below / sol.rtd });
    });
    return groups;
  }

  /* ---------- loi giai ---------- */
  function solutionSteps(p, sol) {
    var rtdSyms = p.stages.map(function (_, k) { return stageSym(p, k); });
    var b = [], c = [], d = [];

    p.stages.forEach(function (names, k) {
      if (names.length === 1) return;
      var vals = names.map(function (n) { return p.values[n]; });
      var syms = names.map(sub);
      if (names.length === 2) {
        b.push(stageSym(p, k) + " = " + syms.join("·") + " / (" + syms.join(" + ") + ") = " +
          vals.map(C.fmt).join("·") + " / (" + vals.map(C.fmt).join(" + ") + ") = " + C.fmt(sol.stages[k].r) + " Ω");
      } else {
        b.push("1/" + stageSym(p, k) + " = " + syms.map(function (s) { return "1/" + s; }).join(" + ") + " = " +
          vals.map(function (v) { return "1/" + C.fmt(v); }).join(" + ") + "  ⇒  " + stageSym(p, k) + " = " + f2(sol.stages[k].r) + " Ω");
      }
    });
    b.push("R_tđ = " + rtdSyms.join(" + ") + " = " + sol.stages.map(function (s) { return C.fmt(s.r); }).join(" + ") + " = " + f2(sol.rtd) + " Ω");

    c.push("I = V_CC / R_tđ = " + p.vcc + " / " + C.fmt(sol.rtd) + " = " + mA(sol.current));
    p.stages.forEach(function (names, k) {
      if (names.length === 1) return;
      var st = sol.stages[k];
      if (names.length === 2) {
        names.forEach(function (n, i) {
          var other = names[1 - i];
          c.push("I_" + n.slice(1) + " = I·" + sub(other) + " / (" + names.map(sub).join(" + ") + ") = " +
            f2(sol.current * 1000) + "·" + C.fmt(p.values[other]) + " / " + C.fmt(p.values[names[0]] + p.values[names[1]]) + " = " + mA(st.branches[i].i));
        });
      } else {
        c.push(stageVSym(p, k) + " = I·" + stageSym(p, k) + " = " + f2(sol.current * 1000) + " mA · " + C.fmt(st.r) + " Ω = " + f2(st.v) + " V");
        st.branches.forEach(function (br) {
          c.push("I_" + br.name.slice(1) + " = " + stageVSym(p, k) + " / " + sub(br.name) + " = " + f2(st.v) + " / " + C.fmt(p.values[br.name]) + " = " + mA(br.i));
        });
      }
      c.push("Kiểm tra: " + st.branches.map(function (br) { return f2(br.i * 1000); }).join(" + ") + " = " + f2(sol.current * 1000) + " mA = I ✓");
    });

    p.stages.forEach(function (_, k) {
      d.push(stageVSym(p, k) + " = V_CC·" + rtdSyms[k] + " / R_tđ = " + p.vcc + "·" + C.fmt(sol.stages[k].r) + " / " + C.fmt(sol.rtd) + " = " + f2(sol.stages[k].v) + " V");
    });
    p.taps.forEach(function (t) {
      var below = rtdSyms.slice(t.node);
      var vals = sol.stages.slice(t.node).map(function (s) { return C.fmt(s.r); });
      var num = below.length > 1 ? "(" + below.join(" + ") + ")" : below[0];
      var numV = vals.length > 1 ? "(" + vals.join(" + ") + ")" : vals[0];
      d.push("V_" + t.name + " = V_CC·" + num + " / R_tđ = " + p.vcc + "·" + numV + " / " + C.fmt(sol.rtd) +
        " = " + f2(p.vcc * sol.stages[t.node].below / sol.rtd) + " V");
    });
    return [["b) Điện trở tương đương", b], ["c) Dòng điện (phân dòng)", c], ["d) Điện áp (phân áp)", d]];
  }

  function bandChips(colors) {
    if (!colors) return el("span", { "class": "pa-nobands", text: "Không có — giá trị cần 3 số có nghĩa, dùng loại 5 vòng" });
    return el("span", { "class": "pa-bands" }, colors.map(function (name) {
      return el("span", { "class": "pa-band" }, [
        el("i", { "class": "pa-sw", style: "background:" + SWATCH[name], "aria-hidden": "true" }), name
      ]);
    }));
  }

  function colorTable(p) {
    var names = p.stages.reduce(function (a, s) { return a.concat(s); }, []);
    var rows = names.map(function (n) {
      return el("tr", {}, [
        el("th", { scope: "row" }, [rich("span", sub(n))]),
        el("td", { "class": "pa-ohm", text: C.fmtOhm(p.values[n]) }),
        el("td", {}, [el("span", { "class": "pa-bandtag", text: "4VM" }), bandChips(C.colorBands(p.values[n], 4))]),
        el("td", {}, [el("span", { "class": "pa-bandtag", text: "5VM" }), bandChips(C.colorBands(p.values[n], 5))])
      ]);
    });
    return el("div", { "class": "pa-tablewrap" }, [el("table", { "class": "pa-colors" }, [el("tbody", {}, rows)])]);
  }

  /* ---------- 1 bai ---------- */
  function buildProblem(p) {
    var sol = C.solve(p);
    var fieldGroups = buildFields(p, sol);
    var fields = [];
    var card = el("article", { "class": "kh-prob pa-prob" });
    var msg = el("p", { "class": "kh-msg", role: "status" });

    var givens = el("ul", { "class": "pa-givens" }, [rich("li", "V_CC = " + p.vcc + " V")].concat(
      p.stages.reduce(function (a, s) { return a.concat(s); }, []).map(function (n) {
        return rich("li", sub(n) + " = " + C.fmtOhm(p.values[n]));
      })));

    var form = el("form", { "class": "kh-form", novalidate: "" });
    fieldGroups.forEach(function (g) {
      var wrap = el("div", { "class": "kh-fields" });
      g.items.forEach(function (it) {
        var input = el("input", { type: "text", inputmode: "decimal", autocomplete: "off", spellcheck: "false", "aria-label": it.label.replace("_", " ") + ", bài " + p.id });
        fields.push({ node: input, want: it.want });
        wrap.appendChild(el("label", { "class": "kh-field" }, [rich("span", it.label + " ="), input]));
      });
      form.appendChild(el("div", { "class": "pa-group-in" }, [el("h3", { text: g.title }), wrap]));
    });
    var checkBtn = el("button", { "class": "kh-btn", type: "submit", text: "Kiểm tra" });
    var resetBtn = el("button", { "class": "kh-btn secondary", type: "button", text: "Làm lại" });
    form.appendChild(el("div", { "class": "kh-actions" }, [checkBtn, resetBtn]));
    form.appendChild(msg);

    function mark(f, state) {
      f.node.classList.remove("ok", "bad");
      if (state) f.node.classList.add(state);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var filled = fields.filter(function (f) { return f.node.value.trim() !== ""; });
      if (!filled.length) {
        msg.className = "kh-msg";
        msg.textContent = "Hãy nhập đáp án rồi bấm Kiểm tra.";
        return;
      }
      var right = 0;
      fields.forEach(function (f) {
        if (f.node.value.trim() === "") return mark(f, null);
        var ok = C.close(C.parseAnswer(f.node.value), f.want);
        mark(f, ok ? "ok" : "bad");
        if (ok) right++;
      });
      var allOk = right === fields.length;
      var empty = fields.length - filled.length;
      card.classList.toggle("correct", allOk);
      msg.className = "kh-msg " + (allOk ? "ok" : "bad");
      msg.textContent = allOk ? "Đúng hết rồi!" :
        "Đúng " + right + "/" + fields.length + " ô" + (empty ? ", còn " + empty + " ô trống." : ". Sửa ô đỏ hoặc mở lời giải.");
    });

    resetBtn.addEventListener("click", function () {
      fields.forEach(function (f) { f.node.value = ""; mark(f, null); });
      card.classList.remove("correct");
      msg.className = "kh-msg";
      msg.textContent = "";
      solution.open = false;
    });

    var solution = el("details", { "class": "kh-sol pa-sol" }, [el("summary", { text: "Xem đáp án & lời giải chi tiết" })]);
    solution.appendChild(el("h3", { text: "a) Vòng màu (sai số Vàng kim ±5%)" }));
    solution.appendChild(colorTable(p));
    solutionSteps(p, sol).forEach(function (part) {
      solution.appendChild(el("h3", { text: part[0] }));
      solution.appendChild(el("ul", { "class": "pa-steps" }, part[1].map(function (t) { return rich("li", t); })));
    });

    card.appendChild(el("div", { "class": "kh-head" }, [
      el("span", { "class": "kh-num", text: "Bài " + p.id }),
      el("h2", { "class": "kh-ask", text: p.kind })
    ]));
    card.appendChild(givens);
    card.appendChild(el("figure", { "class": "pa-fig" }, [SVG.draw(p)]));
    card.appendChild(el("ol", { "class": "pa-asks" }, p.asks.map(function (a) { return rich("li", a); })));
    card.appendChild(el("p", { "class": "kh-hint", text: "Kết quả làm tròn lấy 2 chữ số sau dấu phẩy (vd 12,00; 13,43). Nhập dấu phẩy hoặc chấm đều được." }));
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
