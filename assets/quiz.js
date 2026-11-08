/* Trac nghiem cuoi bai ly thuyet.
   Trang khai bao: <div id="quiz"></div> + window.CT_QUIZ = [{ q, opts: [4 phuong an], a: chi so dap an dung, why: giai thich }].
   q/opts/why la HTML tinh do tac gia viet trong file bai (cho phep <sub>, <sup>), khong nhan du lieu tu nguoi dung.
   Tien do (phuong an da chon) luu trong localStorage theo duong dan trang, tai lai trang van con; "Lam lai" xoa. */
(function () {
  "use strict";
  var LETTERS = ["A", "B", "C", "D", "E"];
  var STORE_KEY = "ct-quiz:" + location.pathname.replace(/\.html$/, "").replace(/\/$/, "");
  var STORE_VERSION = 1;

  var store = {
    load: function (n) {
      try {
        var d = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
        // Bo du lieu cu neu so cau da doi (tac gia sua de).
        if (!d || d.v !== STORE_VERSION || d.n !== n || !Array.isArray(d.picks)) return null;
        return d.picks;
      } catch (e) { return null; }
    },
    save: function (picks) {
      try { localStorage.setItem(STORE_KEY, JSON.stringify({ v: STORE_VERSION, n: picks.length, picks: picks })); }
      catch (e) { /* che do rieng tu / het dung luong: van lam bai binh thuong, chi khong luu */ }
    },
    clear: function () {
      try { localStorage.removeItem(STORE_KEY); } catch (e) { /* bo qua */ }
    }
  };

  /* Song ngữ: trang có nút VI/EN (assets/i18n.js) khai báo thêm window.CT_QUIZ_EN cùng thứ tự câu,
     cùng chỉ số đáp án. Không có thì luôn dùng tiếng Việt. */
  var UI = {
    vi: { again: "Làm lại", q: "Câu ", ok: "Đúng.", bad: "Chưa đúng, đáp án ",
          none: function (n) { return "Đã làm 0/" + n + " câu"; },
          some: function (a, n, c) { return "Đã làm " + a + "/" + n + " câu · đúng " + c; },
          done: function (c, n) { return "Hoàn thành: đúng " + c + "/" + n + " câu"; } },
    en: { again: "Reset", q: "Q", ok: "Correct.", bad: "Not quite, the answer is ",
          none: function (n) { return "Answered 0/" + n; },
          some: function (a, n, c) { return "Answered " + a + "/" + n + " · " + c + " correct"; },
          done: function (c, n) { return "Done: " + c + "/" + n + " correct"; } }
  };
  function lang() {
    return document.documentElement.lang === "en" && Array.isArray(window.CT_QUIZ_EN) ? "en" : "vi";
  }
  function quizItems() { return lang() === "en" ? window.CT_QUIZ_EN : window.CT_QUIZ; }

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function validPick(p, it) {
    return typeof p === "number" && p >= 0 && p < it.opts.length && p === Math.floor(p);
  }

  function scoreLabel(picks, items) {
    var answered = 0, correct = 0;
    picks.forEach(function (p, k) {
      if (p === null) return;
      answered += 1;
      if (p === items[k].a) correct += 1;
    });
    var t = UI[lang()];
    if (answered === 0) return t.none(items.length);
    if (answered < items.length) return t.some(answered, items.length, correct);
    return t.done(correct, items.length);
  }

  function render(host, items, saved) {
    var t = UI[lang()];
    host.textContent = "";
    var picks = items.map(function (it, k) {
      var p = saved ? saved[k] : null;
      return validPick(p, it) ? p : null;
    });
    var score = el("div", "quiz-score");
    var scoreText = el("span");
    var again = el("button", null, t.again);
    again.type = "button";
    again.addEventListener("click", function () { store.clear(); render(host, quizItems(), null); });
    score.appendChild(scoreText);
    score.appendChild(again);

    items.forEach(function (it, k) {
      var box = el("div", "quiz-item");
      box.appendChild(el("p", "quiz-q", '<span class="qn">' + t.q + (k + 1) + "</span>" + it.q));
      var opts = el("div", "quiz-opts");
      var buttons = [];

      function reveal(i) {
        buttons.forEach(function (x) { x.disabled = true; });
        buttons[it.a].classList.add("ok");
        var right = i === it.a;
        if (!right) buttons[i].classList.add("bad");
        box.appendChild(el("p", "quiz-why" + (right ? "" : " wrong"),
          "<strong>" + (right ? t.ok : t.bad + LETTERS[it.a] + ".") + "</strong> " + it.why));
      }

      it.opts.forEach(function (text, i) {
        var b = el("button", "quiz-opt", '<span class="ql">' + LETTERS[i] + ".</span><span>" + text + "</span>");
        b.type = "button";
        b.addEventListener("click", function () {
          picks = picks.map(function (p, j) { return j === k ? i : p; });
          store.save(picks);
          reveal(i);
          scoreText.textContent = scoreLabel(picks, items);
        });
        opts.appendChild(b);
        buttons.push(b);
      });
      box.appendChild(opts);
      host.appendChild(box);
      if (picks[k] !== null) reveal(picks[k]);
    });
    scoreText.textContent = scoreLabel(picks, items);
    host.appendChild(score);
  }

  var host = document.getElementById("quiz");
  if (host && Array.isArray(window.CT_QUIZ) && window.CT_QUIZ.length) {
    render(host, quizItems(), store.load(window.CT_QUIZ.length));
    document.addEventListener("ct:lang", function () {
      render(host, quizItems(), store.load(window.CT_QUIZ.length));
    });
  }
})();
