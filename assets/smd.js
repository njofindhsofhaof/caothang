/* Trang bai tap dien tro dan SMD: dung giao dien tu assets/smd-data.js, cham bang assets/smd-code.js. */
(function () {
  "use strict";

  var C = window.SMD_CODE;
  var sets = Array.isArray(window.SMD_SETS) ? window.SMD_SETS : [];
  var app = document.getElementById("smdApp");
  if (!app || !C) return;

  var LETTERS = "abc";

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return node;
  }

  function makeInput(kind, expected, label) {
    var input = el("input", {
      type: "text", autocomplete: "off", spellcheck: "false",
      autocapitalize: kind === "code" ? "characters" : "off",
      placeholder: kind === "code" ? "mã" : "giá trị",
      "class": kind === "code" ? "smd-code-in" : "smd-val-in",
      "aria-label": label
    });
    return { node: input, kind: kind, expected: expected };
  }

  function isRight(f) {
    if (f.kind === "code") return C.normalizeCode(f.node.value) === f.expected;
    return C.sameValue(C.parseValue(f.node.value), f.expected);
  }

  function codeTag(code) { return el("code", { "class": "smd-chip", text: code }); }

  function row(i, parts) {
    return el("li", { "class": "smd-row" }, [
      el("span", { "class": "smd-letter", text: LETTERS[i] + ")" }),
      el("span", { "class": "smd-body" }, parts)
    ]);
  }

  function buildRead(q, qid, fields) {
    var rows = q.read.map(function (r, i) {
      var parts = [];
      for (var k = 0; k < r.length; k += 2) {
        var f = makeInput("value", r[k + 1], "Giá trị của mã " + r[k] + ", " + qid);
        fields.push(f);
        parts.push(el("span", { "class": "smd-pair" }, [
          k > 0 ? el("span", { "class": "smd-and", text: "và" }) : null,
          codeTag(r[k]), el("span", { text: "=" }), f.node
        ]));
      }
      return row(i, parts);
    });
    return el("div", { "class": "smd-part" }, [
      el("h3", { text: "Phần 1 · Đọc mã ra giá trị" }),
      el("ol", { "class": "smd-rows" }, rows)
    ]);
  }

  function buildWrite(q, qid, fields) {
    var rows = q.write.map(function (w, i) {
      var label = w[0], stds = w[1].split(" / "), codes = w.slice(2);
      var parts = [
        el("span", { "class": "smd-target" }, [el("strong", { text: label }), stds.length === 1 ? " (chuẩn " + stds[0] + ")" : ""]),
        el("span", { text: "→" })
      ];
      codes.forEach(function (code, k) {
        var f = makeInput("code", code, "Mã " + stds[k] + " cho " + label + ", " + qid);
        fields.push(f);
        parts.push(stds.length > 1
          ? el("span", { "class": "smd-pair" }, [el("span", { "class": "smd-std", text: stds[k] }), f.node])
          : f.node);
      });
      return row(i, parts);
    });
    return el("div", { "class": "smd-part" }, [
      el("h3", { text: "Phần 2 · Viết mã in trên thân" }),
      el("ol", { "class": "smd-rows" }, rows)
    ]);
  }

  function solutionLines(q) {
    var lines = [];
    q.read.forEach(function (r, i) {
      for (var k = 0; k < r.length; k += 2) lines.push("P1 " + LETTERS[i] + ") " + C.explain(r[k]));
    });
    q.write.forEach(function (w, i) {
      w.slice(2).forEach(function (code) { lines.push("P2 " + LETTERS[i] + ") " + w[0] + " ⇒ " + C.explain(code)); });
    });
    return lines;
  }

  function buildQuestion(q, n, setTitle, onChange) {
    var qid = setTitle + " câu " + n;
    var fields = [];
    var card = el("article", { "class": "kh-prob smd-q" });
    var msg = el("p", { "class": "kh-msg", role: "status" });
    var checkBtn = el("button", { "class": "kh-btn", type: "submit", text: "Kiểm tra" });
    var resetBtn = el("button", { "class": "kh-btn secondary", type: "button", text: "Làm lại" });
    var solution = el("details", { "class": "kh-sol" }, [el("summary", { text: "Xem đáp án & cách tính" })]);
    solution.appendChild(el("ul", { "class": "smd-sol" }, solutionLines(q).map(function (t) { return el("li", { text: t }); })));

    var form = el("form", { "class": "kh-form", novalidate: "" }, [
      buildRead(q, qid, fields), buildWrite(q, qid, fields),
      el("div", { "class": "kh-actions" }, [checkBtn, resetBtn]), msg
    ]);

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
        if (f.node.value.trim() === "") { f.node.className = f.node.className.replace(/ (ok|bad)$/, ""); return; }
        var ok = isRight(f);
        f.node.className = f.node.className.replace(/ (ok|bad)$/, "") + (ok ? " ok" : " bad");
        if (ok) right++;
      });
      var allOk = right === fields.length;
      var empty = fields.length - filled.length;
      card.classList.toggle("correct", allOk);
      msg.className = "kh-msg " + (allOk ? "ok" : "bad");
      msg.textContent = allOk ? "Đúng hết rồi!" :
        "Đúng " + right + "/" + fields.length + " ô" + (empty ? ", còn " + empty + " ô trống." : ". Sửa ô đỏ hoặc mở đáp án.");
      onChange();
    });

    resetBtn.addEventListener("click", function () {
      fields.forEach(function (f) { f.node.value = ""; f.node.className = f.node.className.replace(/ (ok|bad)$/, ""); });
      card.classList.remove("correct");
      msg.className = "kh-msg";
      msg.textContent = "";
      solution.open = false;
      onChange();
    });

    card.appendChild(el("div", { "class": "kh-head" }, [
      el("span", { "class": "kh-num", text: "Câu " + n }),
      el("h2", { "class": "kh-ask", text: q.title })
    ]));
    card.appendChild(form);
    card.appendChild(solution);
    return card;
  }

  /* ---------- tabs + panels ---------- */
  var tabs = el("div", { "class": "kh-tabs", role: "tablist", "aria-label": "Chọn đề" });
  var panels = el("div");
  var entries = [];

  sets.forEach(function (s) {
    var score = el("p", { "class": "kh-score" });
    var panel = el("section", { role: "tabpanel", id: "de" + s.id, hidden: "", "aria-label": s.title }, [score]);
    function updateScore() {
      var done = panel.querySelectorAll(".smd-q.correct").length;
      score.textContent = s.title + " · Đã đúng " + done + "/" + s.questions.length + " câu";
    }
    s.questions.forEach(function (q, i) { panel.appendChild(buildQuestion(q, i + 1, s.title, updateScore)); });
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
  var initial = fromHash ? parseInt(fromHash[1], 10) : 0;
  select(entries.some(function (e) { return e.id === initial; }) ? initial : (entries[0] && entries[0].id), false);
})();
