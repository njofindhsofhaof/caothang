/* Trang bai tap Kirchhoff: dung giao dien tu assets/kirchhoff-data.js, cham dap an, phong to hinh. */
(function () {
  "use strict";

  var TOLERANCE = 0.01;
  var IMG_BASE = "/assets/kirchhoff/";
  var sets = Array.isArray(window.KH_SETS) ? window.KH_SETS : [];
  var app = document.getElementById("khApp");
  if (!app) return;

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  function parseNumber(raw) {
    var s = String(raw).trim().replace(/[−–—]/g, "-").replace(",", ".").replace(/\s+/g, "");
    s = s.replace(/[avw]$/i, "");
    return /^[-+]?\d+(\.\d+)?$/.test(s) ? parseFloat(s) : NaN;
  }

  function matches(input, expected, absOk) {
    if (isNaN(input)) return false;
    if (Math.abs(input - expected) <= TOLERANCE) return true;
    return absOk && Math.abs(Math.abs(input) - Math.abs(expected)) <= TOLERANCE;
  }

  /* ---------- zoom dialog ---------- */
  var zoomDialog = null;
  var zoomImg = null;

  function ensureZoom() {
    if (zoomDialog) return;
    zoomImg = el("img", { alt: "" });
    var closeBtn = el("button", { "class": "kh-zoom-close", type: "button", text: "Đóng ✕" });
    var scroll = el("div", { "class": "kh-zoom-scroll" }, [zoomImg]);
    zoomDialog = el("dialog", { "class": "kh-zoom", "aria-label": "Hình phóng to" }, [closeBtn, scroll]);
    closeBtn.addEventListener("click", function () { zoomDialog.close(); });
    scroll.addEventListener("click", function (e) { if (e.target === scroll) zoomDialog.close(); });
    document.body.appendChild(zoomDialog);
  }

  function openZoom(p) {
    var src = IMG_BASE + p.img;
    if (typeof HTMLDialogElement === "undefined") {
      window.open(src, "_blank", "noopener");
      return;
    }
    ensureZoom();
    zoomImg.src = src;
    zoomImg.width = p.w;
    zoomImg.height = p.h;
    zoomImg.alt = "Hình bài " + p.id;
    zoomDialog.showModal();
  }

  /* ---------- problem card ---------- */
  function buildProblem(p, onChange) {
    var card = el("article", { "class": "kh-prob", "data-id": p.id });

    var img = el("img", {
      src: IMG_BASE + p.img, width: String(p.w), height: String(p.h),
      alt: "Hình minh họa bài " + p.id, loading: "lazy", decoding: "async"
    });
    var fig = el("button", { "class": "kh-fig", type: "button", "aria-label": "Phóng to hình bài " + p.id }, [img]);
    fig.addEventListener("click", function () { openZoom(p); });

    var inputs = p.fields.map(function (f) {
      return el("input", {
        type: "text", autocomplete: "off", autocapitalize: "off", spellcheck: "false",
        placeholder: "?", "aria-label": "Đáp án " + f.label + " bài " + p.id
      });
    });
    var fields = el("div", { "class": "kh-fields" }, p.fields.map(function (f, i) {
      return el("label", { "class": "kh-field" }, [
        el("span", { text: f.label + " =" }), inputs[i], el("span", { text: f.unit })
      ]);
    }));

    var msg = el("p", { "class": "kh-msg", role: "status" });
    var checkBtn = el("button", { "class": "kh-btn", type: "submit", text: "Kiểm tra" });
    var resetBtn = el("button", { "class": "kh-btn secondary", type: "button", text: "Làm lại" });
    var solution = el("details", { "class": "kh-sol" }, [
      el("summary", { text: "Xem lời giải" }),
      el("p", { text: p.solution })
    ]);

    var form = el("form", { "class": "kh-form", novalidate: "" }, [
      fields, el("div", { "class": "kh-actions" }, [checkBtn, resetBtn]), msg
    ]);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var empty = inputs.some(function (input) { return input.value.trim() === ""; });
      if (empty) {
        msg.className = "kh-msg";
        msg.textContent = "Hãy nhập đủ đáp án rồi bấm Kiểm tra.";
        return;
      }
      var allOk = true;
      inputs.forEach(function (input, i) {
        var ok = matches(parseNumber(input.value), p.fields[i].value, p.absOk);
        input.className = ok ? "ok" : "bad";
        if (!ok) allOk = false;
      });
      card.classList.toggle("correct", allOk);
      msg.className = "kh-msg " + (allOk ? "ok" : "bad");
      msg.textContent = allOk ? "Đúng rồi!" : "Chưa đúng, thử lại hoặc mở lời giải.";
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
      el("p", { "class": "kh-ask", text: p.ask })
    ]));
    card.appendChild(fig);
    card.appendChild(el("p", { "class": "kh-hint", text: "Chạm vào hình để phóng to" }));
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
    var panel = el("section", { role: "tabpanel", id: "de" + s.id, hidden: "" }, [score]);
    function updateScore() {
      var done = panel.querySelectorAll(".kh-prob.correct").length;
      score.textContent = "Đã đúng " + done + "/" + s.problems.length + " bài";
    }
    s.problems.forEach(function (p) { panel.appendChild(buildProblem(p, updateScore)); });
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
