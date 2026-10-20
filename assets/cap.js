/* Trang bai tap doc ma tu dien: dung giao dien tu assets/cap-data.js, cham bang assets/cap-code.js. */
(function () {
  "use strict";

  var C = window.CAP_CODE;
  var sets = Array.isArray(window.CAP_SETS) ? window.CAP_SETS : [];
  var app = document.getElementById("capApp");
  if (!app || !C) return;

  var LETTERS = "abcdefghijkl";

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return node;
  }

  function row(i, parts) {
    return el("li", { "class": "smd-row" }, [
      el("span", { "class": "smd-letter", text: LETTERS[i] + ")" }),
      el("span", { "class": "smd-body" }, parts)
    ]);
  }

  function tolSelect(label) {
    return el("select", { "class": "cap-tol", "aria-label": label }, [
      el("option", { value: "", text: "sai số" }),
      el("option", { value: "J", text: "±5%" }),
      el("option", { value: "K", text: "±10%" })
    ]);
  }

  /* Moi field: nodes (de to mau), parts (hien thi), filled(), check(). */
  function readField(code, qid) {
    var d = C.decode(code);
    var input = el("input", { type: "text", autocomplete: "off", spellcheck: "false", "class": "smd-val-in", placeholder: "vd 4,7nF", "aria-label": "Giá trị của mã " + code + ", " + qid });
    var tol = tolSelect("Sai số của mã " + code + ", " + qid);
    return {
      nodes: [input, tol],
      parts: [el("code", { "class": "smd-chip", text: code }), el("span", { text: "=" }), input, tol],
      filled: function () { return input.value.trim() !== "" || tol.value !== ""; },
      check: function () { return C.sameValue(C.parseValue(input.value), d.pf) && tol.value === d.letter; }
    };
  }

  function writeField(w, qid) {
    var pf = w[0], letter = w[1];
    var label = C.formatCap(pf) + " ±" + C.TOL[letter] + "%";
    var input = el("input", { type: "text", autocomplete: "off", spellcheck: "false", autocapitalize: "characters", "class": "smd-code-in", placeholder: "mã", "aria-label": "Mã cho " + label + ", " + qid });
    return {
      nodes: [input],
      parts: [el("span", { "class": "smd-target" }, [el("strong", { text: label })]), el("span", { text: "→" }), input],
      filled: function () { return input.value.trim() !== ""; },
      check: function () {
        var d = C.decode(input.value);
        return !!d && C.sameValue(d.pf, pf) && d.letter === letter;
      }
    };
  }

  function writeExplain(w) {
    var pf = w[0], code = w[2];
    var how = pf < 100 ? "dưới 100 pF ghi thẳng số" : C.allUnits(pf) + " = " + code.slice(0, 2) + " × 10" + "⁰¹²³⁴⁵⁶⁷⁸⁹"[+code[2]] + " pF";
    return C.formatCap(pf) + " ±" + C.TOL[w[1]] + "% → " + how + " → " + code;
  }

  function buildPart(title, heading, fields, lines, onChange) {
    var card = el("article", { "class": "kh-prob smd-q" });
    var msg = el("p", { "class": "kh-msg", role: "status" });
    var solution = el("details", { "class": "kh-sol" }, [el("summary", { text: "Xem đáp án & cách tính" }),
      el("ul", { "class": "smd-sol" }, lines.map(function (t, i) { return el("li", { text: LETTERS[i] + ") " + t }); }))]);
    var form = el("form", { "class": "kh-form", novalidate: "" }, [
      el("div", { "class": "smd-part" }, [el("ol", { "class": "smd-rows" }, fields.map(function (f, i) { return row(i, f.parts); }))]),
      el("div", { "class": "kh-actions" }, [
        el("button", { "class": "kh-btn", type: "submit", text: "Kiểm tra" }),
        el("button", { "class": "kh-btn secondary", type: "reset", text: "Làm lại" })
      ]), msg
    ]);

    function mark(f, state) {
      f.nodes.forEach(function (n) { n.classList.remove("ok", "bad"); if (state) n.classList.add(state); });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var filled = fields.filter(function (f) { return f.filled(); });
      if (!filled.length) {
        msg.className = "kh-msg";
        msg.textContent = "Hãy nhập đáp án rồi bấm Kiểm tra.";
        return;
      }
      var right = 0;
      fields.forEach(function (f) {
        if (!f.filled()) return mark(f, null);
        var ok = f.check();
        mark(f, ok ? "ok" : "bad");
        if (ok) right++;
      });
      var allOk = right === fields.length;
      var empty = fields.length - filled.length;
      card.classList.toggle("correct", allOk);
      msg.className = "kh-msg " + (allOk ? "ok" : "bad");
      msg.textContent = allOk ? "Đúng hết rồi!" :
        "Đúng " + right + "/" + fields.length + " câu" + (empty ? ", còn " + empty + " câu trống." : ". Sửa ô đỏ hoặc mở đáp án.");
      onChange();
    });

    form.addEventListener("reset", function () {
      fields.forEach(function (f) { mark(f, null); });
      card.classList.remove("correct");
      msg.className = "kh-msg";
      msg.textContent = "";
      solution.open = false;
      setTimeout(onChange, 0);
    });

    card.appendChild(el("div", { "class": "kh-head" }, [
      el("span", { "class": "kh-num", text: title }),
      el("h2", { "class": "kh-ask", text: heading })
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
      score.textContent = s.title + " · Đã đúng " + panel.querySelectorAll(".smd-q.correct").length + "/2 phần";
    }
    panel.appendChild(buildPart("Phần 1", "Đọc mã trên thân tụ ra giá trị và sai số",
      s.read.map(function (c) { return readField(c, s.title); }), s.read.map(C.explain), updateScore));
    panel.appendChild(buildPart("Phần 2", "Từ giá trị điện dung, viết mã in trên thân tụ",
      s.write.map(function (w) { return writeField(w, s.title); }), s.write.map(writeExplain), updateScore));
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
