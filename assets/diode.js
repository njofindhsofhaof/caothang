/* Trang bai tap mach ung dung diode (/baitapdiode): de lay tu assets/diode-data.js, dap an + loi giai
   tinh bang assets/diode-calc.js (giai mach) va assets/phanap-calc.js (doc so, so sanh, dinh dang),
   so do ve bang assets/diode-svg.js. Loi giai theo trinh tu trong vo: xet dan/khong dan -> K2 cho vong (1)
   -> K1 tai nut cum song song -> dien ap cac diem do. */
(function () {
  "use strict";

  var D = window.DIODE_CALC, F = window.PA_CALC, SVG = window.DIODE_SVG;
  var problems = Array.isArray(window.DIODE_PROBLEMS) ? window.DIODE_PROBLEMS : [];
  var app = document.getElementById("ddApp");
  if (!app || !D || !F || !SVG) return;

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return node;
  }

  /** "I_D1 = V_CC/R" -> text co <sub>. */
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

  var n = function (x) { return F.fmt(x, 2); };
  var mA = function (a) { return n(a * 1000) + " mA"; };
  var V = function (v) { return n(v) + " V"; };
  function sub(name) { return name.length > 1 ? name.charAt(0) + "_" + name.slice(1) : name; }
  function iSym(name) { return "I_" + name; }
  function allDiodes(p) { return p.levels.reduce(function (a, lv) { return a.concat(lv); }, []); }
  function topTap(p) { return p.taps.filter(function (t) { return t.node === 0; })[0]; }
  function eq(names) { return names.join(" = "); }

  /** Ky hieu dien ap tang k: diode don -> V_D1; cum -> V_D + so cac diode dan, vd V_D135. */
  function levelSym(p, k, st) {
    var lv = p.levels[k];
    if (lv.length === 1) return "V_" + lv[0].name;
    return "V_D" + st.on.map(function (nm) { return nm.slice(1); }).join("");
  }
  function kindText(d) { return d.kind === "si" ? "Si" : "LED"; }

  /* ---------- nhan xet mach (chung cho moi truong hop) ---------- */
  function circuitNotes(p) {
    var lines = [];
    p.levels.forEach(function (lv, k) {
      var st = D.levelState(lv);
      if (lv.length === 1) {
        var d = lv[0];
        lines.push(d.rev
          ? sub(d.name) + " (" + kindText(d) + ") lắp ngược: cathode hướng lên V_CC → phân cực nghịch, không dẫn điện."
          : sub(d.name) + " (" + kindText(d) + ", V_" + d.name + " = " + V(d.vf) + ") phân cực thuận.");
        return;
      }
      var names = lv.map(function (d) { return sub(d.name); }).join(" // ");
      var rev = lv.filter(function (d) { return d.rev; });
      var fwd = lv.filter(function (d) { return !d.rev; });
      var off = fwd.filter(function (d) { return st.on.indexOf(d.name) < 0; });
      var parts = ["Cụm " + names + " (mắc song song, cùng điện áp; dòng I_R chia nhánh tại nút " + nodeOf(p, k) + ")."];
      if (rev.length) parts.push(rev.map(function (d) { return sub(d.name); }).join(", ") + " phân cực nghịch → không dẫn, " + eq(rev.map(function (d) { return iSym(d.name); })) + " = 0.");
      if (!off.length) {
        parts.push(st.on.map(sub).join(", ") + " cùng loại (" + V(st.v) + "), cùng phân cực thuận → cùng dẫn, điện áp cụm " + levelSym(p, k, st) + " = " + V(st.v) + ".");
      } else {
        parts.push(st.on.map(sub).join(", ") + " có điện áp ngưỡng nhỏ nhất (" + V(st.v) + ") nên dẫn trước và ghim điện áp cụm ở " + V(st.v) + ".");
        parts.push(off.map(function (d) { return sub(d.name); }).join(", ") + " (" + V(off[0].vf) + ") chỉ có " + V(st.v) + " < " + V(off[0].vf) + " (điện áp ngưỡng) nên không đủ áp để dẫn → " + eq(off.map(function (d) { return iSym(d.name); })) + " = 0.");
      }
      lines.push(parts.join(" "));
    });
    return lines;
  }

  function sumText(p, states) {
    var syms = states.map(function (st, k) { return levelSym(p, k, st); });
    var vals = states.map(function (st) { return n(st.v); });
    var total = V(states.reduce(function (a, st) { return a + st.v; }, 0));
    return states.length === 1 ? syms[0] + " = " + total : syms.join(" + ") + " = " + vals.join(" + ") + " = " + total;
  }

  function tapLines(p, states) {
    return p.taps.slice().sort(function (a, b) { return b.node - a.node; }).map(function (t) {
      var ks = states.slice(t.node).map(function (_, j) { return t.node + j; });
      var syms = ks.map(function (k) { return levelSym(p, k, states[k]); });
      var vals = ks.map(function (k) { return n(states[k].v); });
      var total = V(ks.reduce(function (a, k) { return a + states[k].v; }, 0));
      return "V_" + t.name + " = " + (ks.length === 1 ? syms[0] + " = " + total : syms.join(" + ") + " = " + vals.join(" + ") + " = " + total);
    });
  }

  /** Danh so phuong trinh K1/K2 trong 1 bai: lan dau ghi ra kem (n), lan sau ghi "Tu (n) ta co". */
  function eqLabel(ctx, key) {
    if (ctx.nums[key]) return { n: ctx.nums[key], first: false };
    ctx.count += 1;
    ctx.nums[key] = ctx.count;
    return { n: ctx.count, first: true };
  }
  function cap(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
  function fromRef(nums) { return "Từ " + nums.map(function (x) { return "(" + x + ")"; }).join(", ") + " ta có: "; }
  function k1Line(on, lbl, node) { return "K1 tại nút " + node + ": I_R = " + on.join(" + ") + "   (" + lbl.n + ")"; }
  /** Ten nut chia dong (A, B, ...) cua tang song song k, trung voi so do. */
  function nodeOf(p, k) {
    var i = p.levels.slice(0, k).filter(function (lv) { return lv.length > 1; }).length;
    return SVG.nodeName(i);
  }

  function currentLines(p, sol, ctx) {
    var lines = [];
    var singles = [];
    p.levels.forEach(function (lv, k) {
      var st = sol.states[k];
      if (lv.length === 1) { singles.push(iSym(lv[0].name)); return; }
      var on = st.on.map(iSym);
      if (on.length === 1) lines.push(on[0] + " = I_R = " + mA(sol.iR));
      else {
        var lbl = eqLabel(ctx, "k1-" + k);
        var share = "các diode dẫn cùng loại nên " + eq(on) + " = I_R / " + on.length + " = " + n(sol.iR * 1000) + " / " + on.length + " = " + mA(sol.iR / on.length);
        if (lbl.first) lines.push(k1Line(on, lbl, nodeOf(p, k)), cap(share));
        else lines.push(fromRef([lbl.n]) + share);
      }
      var zero = lv.filter(function (d) { return st.on.indexOf(d.name) < 0; }).map(function (d) { return iSym(d.name); });
      if (zero.length) lines.push(eq(zero) + " = 0 mA");
    });
    if (singles.length) lines.unshift("Mạch nối tiếp nên " + eq(singles) + " = I_R = " + mA(sol.iR));
    return lines;
  }

  /* ---------- loi giai tung truong hop ---------- */
  function analysisSteps(p, vcc, r, ctx) {
    var sol = D.solve(p.levels, vcc, r);
    var top = "V_" + topTap(p).name;
    var all = [iSym("R")].concat(allDiodes(p).map(function (d) { return iSym(d.name); }));
    if (sol.mode === "blocked") {
      var bad = p.levels[sol.blockedAt].map(function (d) { return sub(d.name); }).join(", ");
      var lines = [bad + " phân cực nghịch nên không dẫn; mạch nối tiếp bị hở, không có dòng chạy qua.", eq(all) + " = 0 mA"];
      lines.push(eq(p.taps.map(function (t) { return "V_" + t.name; })) + " = V_CC = " + V(vcc) + " (mạch nối tiếp: 1 diode không dẫn thì cả mạch không dẫn, không có dòng nên R không sụt áp)");
      return lines;
    }
    if (sol.mode === "off") {
      return [
        "V_CC = " + V(vcc) + (vcc < sol.sumV ? " < " : " = ") + sumText(p, sol.states) + " ⇒ không đủ áp, các diode không dẫn (mạch nối tiếp: 1 con không dẫn thì cả mạch không dẫn).",
        eq(all) + " = 0 mA",
        eq(p.taps.map(function (t) { return "V_" + t.name; })) + " = V_CC = " + V(vcc) + " (không có dòng nên R không sụt áp)"
      ];
    }
    var k2 = eqLabel(ctx, "k2");
    var iR = "I_R = (V_CC − " + top + ") / R = (" + n(vcc) + " − " + n(sol.sumV) + ") / " + n(r) + " = " + mA(sol.iR);
    var lines = [
      "V_CC = " + V(vcc) + " > " + sumText(p, sol.states) + " ⇒ các diode phân cực thuận dẫn.",
      top + " = " + sumText(p, sol.states).split(" = ").pop()
    ];
    if (k2.first) lines.push(k2Line(top, k2), "⇒ " + iR);
    else lines.push(fromRef([k2.n]) + iR);
    return lines.concat(currentLines(p, sol, ctx)).concat(tapLines(p, sol.states));
  }

  function k2Line(top, lbl) { return "K2 cho vòng (1): −V_CC + I_R·R + " + top + " = 0   (" + lbl.n + ")"; }

  function designSteps(p, vcc, ma, ctx) {
    var ds = D.design(p.levels, vcc, ma / 1000);
    var top = "V_" + topTap(p).name;
    var lines = ["V_CC = " + V(vcc) + " > " + sumText(p, ds.states) + " ⇒ các diode phân cực thuận dẫn; " + top + " = " + V(ds.sumV)];
    if (ds.n === 1) lines.push("Dòng qua mỗi diode dẫn I_D = " + ma + " mA; mạch nối tiếp nên I_R = I_D = " + ma + " mA");
    else {
      var refs = [];
      p.levels.forEach(function (lv, k) {
        if (lv.length < 2 || ds.states[k].on.length < 2) return;
        var l1 = eqLabel(ctx, "k1-" + k);
        if (l1.first) lines.push(k1Line(ds.states[k].on.map(iSym), l1, nodeOf(p, k)));
        refs.push(l1.n);
      });
      var onAll = [];
      p.levels.forEach(function (lv, k) { if (lv.length > 1) onAll = onAll.concat(ds.states[k].on.map(iSym)); });
      lines.push("Vì các diode dẫn " + (refs.length > 1 ? "trong mỗi cụm " : "") + "cùng loại nên I_D = " + onAll.join(" = ") + ".");
      lines.push(fromRef(refs) + "I_R = " + ds.n + " × I_D = " + ds.n + " × " + ma + " = " + mA(ds.iR));
    }
    var k2 = eqLabel(ctx, "k2");
    var rr = "R = (V_CC − " + top + ") / I_R = (" + n(vcc) + " − " + n(ds.sumV) + ") / " + n(ds.iR) + " = " + n(ds.r) + " Ω";
    if (k2.first) lines.push(k2Line(top, k2), "⇒ " + rr);
    else lines.push(fromRef([k2.n]) + rr);
    var real = function (rr) { return mA((vcc - ds.sumV) / rr / ds.n) + " mỗi diode"; };
    if (Math.abs(ds.nearest - ds.r) < 1e-9) lines.push("R = " + n(ds.r) + " Ω đúng giá trị chuẩn E12, chọn luôn.");
    else if (ds.nearest === ds.higher) lines.push("Chọn điện trở chuẩn E12 gần nhất (cũng là giá trị lớn hơn kế tiếp): R = " + n(ds.nearest) + " Ω → I_D thực ≈ " + real(ds.nearest) + ".");
    else lines.push("Chọn điện trở chuẩn E12 gần nhất: R = " + n(ds.nearest) + " Ω (I_D thực ≈ " + real(ds.nearest) + "). Muốn dòng không vượt " + ma + " mA thì lấy giá trị lớn hơn kế tiếp: " + n(ds.higher) + " Ω (I_D ≈ " + real(ds.higher) + ").");
    if (p.design.askV) lines = lines.concat(tapLines(p, ds.states));
    return lines;
  }

  /* ---------- o nhap ---------- */
  function analysisFields(p, vcc) {
    var sol = D.solve(p.levels, vcc, p.analysis.r);
    var items = [{ label: "I_R", unit: "mA", want: sol.iR * 1000 }];
    allDiodes(p).forEach(function (d) { items.push({ label: iSym(d.name), unit: "mA", want: sol.id[d.name] * 1000 }); });
    p.taps.forEach(function (t) { items.push({ label: "V_" + t.name, unit: "V", want: sol.nodes[t.node] }); });
    return items;
  }
  function designFields(p, vcc) {
    var ds = D.design(p.levels, vcc, p.design.ma / 1000);
    var items = [{ label: "I_R", unit: "mA", want: ds.iR * 1000 }, { label: "R", unit: "Ω", want: ds.r }];
    if (p.design.askV) p.taps.forEach(function (t) { items.push({ label: "V_" + t.name, unit: "V", want: ds.nodes[t.node] }); });
    return items;
  }

  function vccList(vccs) { return vccs.map(function (v) { return V(v); }).join("; "); }
  function askText(p) {
    var curr = ["I_R"].concat(allDiodes(p).map(function (d) { return iSym(d.name); }));
    var volts = p.taps.slice().sort(function (a, b) { return a.node - b.node; }).map(function (t) { return "V_" + t.name; });
    var asks = ["a) Cho R = " + n(p.analysis.r) + " Ω. Tính " + curr.join(", ") + ", " + volts.join(", ") + " khi V_CC = " + vccList(p.analysis.vccs) + "."];
    if (p.design) asks.push("b) Chọn điện trở R để dòng qua mỗi diode dẫn là " + p.design.ma + " mA (LED sáng bình thường) khi V_CC = " + vccList(p.design.vccs) + ". Tính I_R, R" + (p.design.askV ? ", " + volts.join(", ") : "") + ".");
    return asks;
  }

  function isSingleVcc(p) {
    return p.analysis.vccs.length === 1 && (!p.design || (p.design.vccs.length === 1 && p.design.vccs[0] === p.analysis.vccs[0]));
  }

  function givenChips(p) {
    var chips = allDiodes(p).map(function (d) {
      return rich("li", sub(d.name) + ": " + kindText(d) + ", V_" + d.name + " = " + V(d.vf) + (d.rev ? ", lắp ngược" : ""));
    });
    if (isSingleVcc(p)) chips.unshift(rich("li", "V_CC = " + V(p.analysis.vccs[0])));
    return el("ul", { "class": "pa-givens" }, chips);
  }

  /* ---------- 1 bai ---------- */
  function buildProblem(p) {
    var fields = [];
    var card = el("article", { "class": "kh-prob pa-prob dd-prob" });
    var msg = el("p", { "class": "kh-msg", role: "status" });
    var form = el("form", { "class": "kh-form", novalidate: "" });
    var eqCtx = { count: 0, nums: {} };
    var cases = p.analysis.vccs.map(function (v) {
      return { title: "a) R = " + n(p.analysis.r) + " Ω, V_CC = " + V(v), items: analysisFields(p, v), steps: analysisSteps(p, v, p.analysis.r, eqCtx) };
    });
    if (p.design) p.design.vccs.forEach(function (v) {
      cases.push({ title: "b) I_D = " + p.design.ma + " mA, V_CC = " + V(v), items: designFields(p, v), steps: designSteps(p, v, p.design.ma, eqCtx) });
    });

    cases.forEach(function (c) {
      var wrap = el("div", { "class": "kh-fields" });
      c.items.forEach(function (it) {
        var input = el("input", { type: "text", inputmode: "decimal", autocomplete: "off", spellcheck: "false",
          "aria-label": it.label.replace("_", " ") + " (" + it.unit + "), " + c.title.replace(/_/g, "") + ", bài " + p.id });
        fields.push({ node: input, want: it.want });
        wrap.appendChild(el("label", { "class": "kh-field" }, [rich("span", it.label + " ="), input, el("span", { "class": "dd-unit", text: it.unit })]));
      });
      form.appendChild(el("div", { "class": "pa-group-in" }, [rich("h3", c.title), wrap]));
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

    solution.appendChild(el("h3", { text: "Nhận xét mạch" }));
    solution.appendChild(el("ul", { "class": "pa-steps" }, circuitNotes(p).map(function (t) { return rich("li", t); })));
    cases.forEach(function (c) {
      solution.appendChild(rich("h3", c.title));
      solution.appendChild(el("ul", { "class": "pa-steps" }, c.steps.map(function (t) { return rich("li", t); })));
    });

    card.appendChild(el("div", { "class": "kh-head" }, [
      el("span", { "class": "kh-num", text: "Bài " + p.id }),
      el("h2", { "class": "kh-ask", text: p.kind })
    ]));
    card.appendChild(givenChips(p));
    card.appendChild(el("figure", { "class": "pa-fig" }, [SVG.draw(p, isSingleVcc(p) ? p.analysis.vccs[0] : undefined)]));
    card.appendChild(el("ol", { "class": "pa-asks" }, askText(p).map(function (a) { return rich("li", a); })));
    card.appendChild(el("p", { "class": "kh-hint", text: "Dòng nhập theo mA, điện trở theo Ω, điện áp theo V. Làm tròn 2 chữ số sau dấu phẩy; dấu phẩy hay chấm đều được. Diode không dẫn thì nhập 0." }));
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
