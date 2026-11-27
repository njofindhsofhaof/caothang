/* Trang bai tap mach 3 pha (/baitap3pha): chon de, so do, o nhap tu cham, loi giai tung buoc, de ngau nhien.
   So lieu: assets/bp3-data.js; tinh toan + loi giai: assets/bp3-calc.js; so do: assets/bp3-svg.js. */
(function () {
  "use strict";

  var C = window.BP3_CALC;
  var SVG = window.BP3_SVG;
  var sets = Array.isArray(window.BP3_SETS) ? window.BP3_SETS : [];
  var problems = Array.isArray(window.BP3_PROBLEMS) ? window.BP3_PROBLEMS : [];
  var app = document.getElementById("bp3App");
  if (!C || !SVG || !app) return;

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return node;
  }

  /** "I_p" / "R_d + R_p" -> chi so <sub>. */
  function rich(tag, text, attrs) {
    var node = el(tag, attrs), re = /_([0-9A-Za-z]+)/g, last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) node.appendChild(document.createTextNode(text.slice(last, m.index)));
      node.appendChild(el("sub", { text: m[1] }));
      last = re.lastIndex;
    }
    if (last < text.length) node.appendChild(document.createTextNode(text.slice(last)));
    return node;
  }

  function unitOf(k) { return C.UNITS[k] ? " " + C.UNITS[k] : ""; }

  function zLabel(p) {
    var s = "Z_p = " + C.num(p.R) + (p.X ? " + j" + C.num(p.X) : "") + " Ω mỗi pha";
    if (p.Rd || p.Xd) s += " ; Z_d = " + C.num(p.Rd) + " + j" + C.num(p.Xd) + " Ω mỗi dây";
    return s;
  }

  function buildSolution(p, expected) {
    var label = typeof p.id === "number" ? "bài " + p.id : "đề này";
    var sol = el("details", { "class": "kh-sol kh-worked-sol" }, [el("summary", { text: "Xem lời giải " + label })]);
    C.steps(p).forEach(function (st) {
      sol.appendChild(el("h4", { text: st.title }));
      sol.appendChild(el("ul", { "class": "kh-steps" }, st.lines.map(function (l) { return rich("li", l); })));
    });
    if (p.note) sol.appendChild(rich("p", p.note, { "class": "bp3-note" }));
    sol.appendChild(el("div", { "class": "mln-answer" }, [
      el("h4", { text: "Đáp số" }),
      el("p", {}, p.ask.map(function (k, i) {
        return rich("span", (i ? " ; " : "") + k + " = " + C.fmt(k, expected[k]) + unitOf(k));
      }))
    ]));
    return sol;
  }

  /** @param {Object} p bai  @param {() => void} onChange goi lai khi trang thai dung/sai doi */
  function buildProblem(p, onChange) {
    var expected = C.answers(p);
    var card = el("article", { "class": "kh-prob", "data-id": String(p.id) });

    var inputs = p.ask.map(function (k) {
      return el("input", {
        type: "text", inputmode: "decimal", autocomplete: "off", autocapitalize: "off", spellcheck: "false",
        placeholder: "?", "aria-label": "Đáp án " + k.replace("_", "")
      });
    });
    var fields = el("div", { "class": "kh-fields" }, p.ask.map(function (k, i) {
      return el("label", { "class": "kh-field" }, [rich("span", k + " ="), inputs[i], el("span", { text: C.UNITS[k] })]);
    }));

    var msg = el("p", { "class": "kh-msg", role: "status" });
    var solution = buildSolution(p, expected);
    var form = el("form", { "class": "kh-form", novalidate: "" }, [
      fields,
      el("div", { "class": "kh-actions" }, [
        el("button", { "class": "kh-btn", type: "submit", text: "Kiểm tra" }),
        el("button", { "class": "kh-btn secondary", type: "reset", text: "Làm lại" })
      ]),
      msg
    ]);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (inputs.some(function (input) { return input.value.trim() === ""; })) {
        msg.className = "kh-msg";
        msg.textContent = "Hãy nhập đủ đáp án rồi bấm Kiểm tra.";
        return;
      }
      var wrong = 0;
      inputs.forEach(function (input, i) {
        var ok = C.matches(C.parseNumber(input.value), expected[p.ask[i]]);
        input.className = ok ? "ok" : "bad";
        if (!ok) wrong++;
      });
      card.classList.toggle("correct", wrong === 0);
      msg.className = "kh-msg " + (wrong ? "bad" : "ok");
      msg.textContent = wrong ? "Còn " + wrong + " ô chưa đúng, thử lại hoặc mở lời giải." : "Đúng rồi!";
      onChange();
    });

    form.addEventListener("reset", function () {
      inputs.forEach(function (input) { input.className = ""; });
      card.classList.remove("correct");
      msg.className = "kh-msg";
      msg.textContent = "";
      solution.open = false;
      onChange();
    });

    card.appendChild(el("div", { "class": "kh-head" }, [
      el("span", { "class": "kh-num", text: typeof p.id === "number" ? "Bài " + p.id : "Đề mới" }),
      rich("h2", p.title, { "class": "kh-ask" })
    ]));
    card.appendChild(rich("p", p.text, { "class": "mln-ask" }));
    card.appendChild(el("figure", { "class": "kh-fig kh-fig-svg bp3-fig" }, [
      SVG.draw(p), rich("figcaption", zLabel(p))
    ]));
    card.appendChild(form);
    card.appendChild(solution);
    return card;
  }

  /* ---------- tab de ngau nhien ---------- */
  var KIND_LABELS = [["", "Dạng bất kỳ"], ["Y", "Tải nối Y"], ["D", "Tải nối Δ"], ["Yd", "Tải Y có đường dây"], ["Dd", "Tải Δ có đường dây"]];

  function buildRandomPanel(panel) {
    var solved = 0, count = 0, current = null;
    var score = el("p", { "class": "kh-score" });
    var select = el("select", { "class": "bp3-select", "aria-label": "Chọn dạng đề" },
      KIND_LABELS.map(function (o) { return el("option", { value: o[0], text: o[1] }); }));
    var btn = el("button", { "class": "kh-btn", type: "button", text: "Đề mới" });
    var slot = el("div");
    function updateScore() {
      score.textContent = "Đã làm đúng " + solved + "/" + count + " đề ngẫu nhiên";
    }
    function fresh() {
      var p = C.generate(Math.random, select.value);
      p.id = "r" + (++count);
      var wasCorrect = false;
      var card = buildProblem(p, function () {
        var now = card.classList.contains("correct");
        if (now !== wasCorrect) { solved += now ? 1 : -1; wasCorrect = now; }
        updateScore();
      });
      if (current) slot.removeChild(current);
      slot.appendChild(card);
      current = card;
      updateScore();
    }
    btn.addEventListener("click", fresh);
    select.addEventListener("change", fresh);
    panel.appendChild(score);
    panel.appendChild(el("div", { "class": "bp3-gen" }, [select, btn]));
    panel.appendChild(slot);
    fresh();
  }

  /* ---------- tabs ---------- */
  var byId = {};
  problems.forEach(function (p) { byId[p.id] = p; });
  var tabs = el("div", { "class": "kh-tabs", role: "tablist", "aria-label": "Chọn dạng bài" });
  var panels = el("div");
  var entries = [];

  sets.forEach(function (set) {
    var panel = el("section", { role: "tabpanel", id: "de" + set.id, hidden: "", "aria-label": set.title });
    if (set.random) buildRandomPanel(panel);
    else {
      var list = (set.problems || []).map(function (id) { return byId[id]; }).filter(Boolean);
      var score = el("p", { "class": "kh-score" });
      var updateScore = function () {
        score.textContent = "Đã đúng " + panel.querySelectorAll(".kh-prob.correct").length + "/" + list.length + " bài";
      };
      panel.appendChild(score);
      list.forEach(function (p) { panel.appendChild(buildProblem(p, updateScore)); });
      updateScore();
    }
    var tab = el("button", { type: "button", role: "tab", text: set.title, "aria-controls": "de" + set.id });
    tab.addEventListener("click", function () { select(set.id, true); });
    tabs.appendChild(tab);
    panels.appendChild(panel);
    entries.push({ id: set.id, tab: tab, panel: panel });
  });

  function select(id, updateHash) {
    entries.forEach(function (e) {
      var active = e.id === id;
      e.tab.setAttribute("aria-selected", active ? "true" : "false");
      e.panel.hidden = !active;
    });
    if (updateHash && history.replaceState) history.replaceState(null, "", "#de" + id);
  }

  app.appendChild(tabs);
  app.appendChild(panels);

  var fromHash = /^#de(\d+)$/.exec(location.hash);
  var initial = fromHash ? parseInt(fromHash[1], 10) : 1;
  select(entries.some(function (e) { return e.id === initial; }) ? initial : (entries[0] && entries[0].id), false);
})();
