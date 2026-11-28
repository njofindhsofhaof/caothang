/* Trang bai tap dong mat luoi va dien the nut (/baitapmatluoinut): chon de, so do, o nhap tu cham, loi giai tung buoc.
   So lieu: assets/mln-data.js; dap an tinh bang assets/mln-calc.js; so do ve bang assets/mln-svg.js. */
(function () {
  "use strict";

  var C = window.MLN_CALC;
  var SVG = window.MLN_SVG;
  var sets = Array.isArray(window.MLN_SETS) ? window.MLN_SETS : [];
  var problems = Array.isArray(window.MLN_PROBLEMS) ? window.MLN_PROBLEMS : [];
  var app = document.getElementById("mlnApp");
  if (!C || !SVG || !app) return;

  var UNITS = { I: "A", V: "V" };

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return node;
  }

  /** "I_m1" / "V_A" / "P_tải" -> chi so <sub>. */
  function rich(tag, text, attrs) {
    var node = el(tag, attrs), re = /_([0-9A-Za-zÀ-ỹ]+)/g, last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) node.appendChild(document.createTextNode(text.slice(last, m.index)));
      node.appendChild(el("sub", { text: m[1] }));
      last = re.lastIndex;
    }
    if (last < text.length) node.appendChild(document.createTextNode(text.slice(last)));
    return node;
  }

  function buildSolution(p, keys, expected) {
    var sol = el("details", { "class": "kh-sol kh-worked-sol" }, [el("summary", { text: "Xem lời giải bài " + p.id })]);
    var t = p.transformed;
    p.steps.forEach(function (st, k) {
      sol.appendChild(el("h4", { text: st.title }));
      sol.appendChild(el("ul", { "class": "kh-steps" }, st.lines.map(function (l) { return rich("li", l); })));
      if (t && t.afterStep === k) {
        sol.appendChild(el("p", { "class": "mln-cap", text: t.caption }));
        sol.appendChild(el("figure", { "class": "kh-fig kh-fig-svg mln-fig" }, [
          SVG.draw({ id: p.id + " sau khi biến đổi nguồn", size: t.size, draw: t.draw })
        ]));
      }
    });
    sol.appendChild(el("div", { "class": "mln-answer" }, [
      el("h4", { text: "Đáp số" }),
      el("p", {}, keys.map(function (k, i) {
        return rich("span", (i ? " ; " : "") + k + " = " + C.num(expected[k]) + " " + UNITS[k.charAt(0)]);
      }))
    ]));
    return sol;
  }

  function buildProblem(p, onChange) {
    var expected = C.answers(p);
    var keys = Object.keys(expected);
    var card = el("article", { "class": "kh-prob", "data-id": String(p.id) });

    var inputs = keys.map(function (k) {
      return el("input", {
        type: "text", inputmode: "decimal", autocomplete: "off", autocapitalize: "off", spellcheck: "false",
        placeholder: "?", "aria-label": "Đáp án " + k.replace("_", "") + " bài " + p.id
      });
    });
    var fields = el("div", { "class": "kh-fields" }, keys.map(function (k, i) {
      return el("label", { "class": "kh-field" }, [rich("span", k + " ="), inputs[i], el("span", { text: UNITS[k.charAt(0)] })]);
    }));

    var msg = el("p", { "class": "kh-msg", role: "status" });
    var checkBtn = el("button", { "class": "kh-btn", type: "submit", text: "Kiểm tra" });
    var resetBtn = el("button", { "class": "kh-btn secondary", type: "button", text: "Làm lại" });
    var solution = buildSolution(p, keys, expected);
    var form = el("form", { "class": "kh-form", novalidate: "" }, [
      fields, el("div", { "class": "kh-actions" }, [checkBtn, resetBtn]), msg
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
        var ok = C.matches(C.parseNumber(input.value), expected[keys[i]]);
        input.className = ok ? "ok" : "bad";
        if (!ok) wrong++;
      });
      card.classList.toggle("correct", wrong === 0);
      msg.className = "kh-msg " + (wrong ? "bad" : "ok");
      msg.textContent = wrong ? "Còn " + wrong + " ô chưa đúng, thử lại hoặc mở lời giải." : "Đúng rồi!";
      onChange();
    });

    resetBtn.addEventListener("click", function () {
      inputs.forEach(function (input) { input.value = ""; input.className = ""; });
      card.classList.remove("correct");
      msg.className = "kh-msg";
      msg.textContent = "";
      solution.open = false;
      onChange();
    });

    card.appendChild(el("div", { "class": "kh-head" }, [
      el("span", { "class": "kh-num", text: "Bài " + p.id }),
      el("h2", { "class": "kh-ask", text: p.title })
    ]));
    card.appendChild(rich("p", p.ask, { "class": "mln-ask" }));
    card.appendChild(el("figure", { "class": "kh-fig kh-fig-svg mln-fig" }, [SVG.draw(p)]));
    card.appendChild(form);
    card.appendChild(solution);
    return card;
  }

  /* ---------- tabs ---------- */
  var byId = {};
  problems.forEach(function (p) { byId[p.id] = p; });
  var tabs = el("div", { "class": "kh-tabs", role: "tablist", "aria-label": "Chọn đề" });
  var panels = el("div");
  var entries = [];

  sets.forEach(function (s) {
    var list = s.problems.map(function (id) { return byId[id]; }).filter(Boolean);
    var score = el("p", { "class": "kh-score" });
    var panel = el("section", { role: "tabpanel", id: "de" + s.id, hidden: "", "aria-label": s.title }, [score]);
    function updateScore() {
      score.textContent = "Đã đúng " + panel.querySelectorAll(".kh-prob.correct").length + "/" + list.length + " bài";
    }
    list.forEach(function (p) { panel.appendChild(buildProblem(p, updateScore)); });
    updateScore();

    var tab = el("button", { type: "button", role: "tab", text: s.title, "aria-controls": "de" + s.id });
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
    if (updateHash && history.replaceState) history.replaceState(null, "", "#de" + id);
  }

  app.appendChild(tabs);
  app.appendChild(panels);

  var fromHash = /^#de(\d+)$/.exec(location.hash);
  var initial = fromHash ? parseInt(fromHash[1], 10) : 1;
  select(entries.some(function (e) { return e.id === initial; }) ? initial : (entries[0] && entries[0].id), false);
})();
