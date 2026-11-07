/* Trac nghiem cuoi bai ly thuyet.
   Trang khai bao: <div id="quiz"></div> + window.CT_QUIZ = [{ q, opts: [4 phuong an], a: chi so dap an dung, why: giai thich }].
   q/opts/why la HTML tinh do tac gia viet trong file bai (cho phep <sub>, <sup>), khong nhan du lieu tu nguoi dung. */
(function () {
  "use strict";
  var LETTERS = ["A", "B", "C", "D", "E"];

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function render(host, items) {
    host.textContent = "";
    var answered = 0, correct = 0;
    var score = el("div", "quiz-score");
    var scoreText = el("span", null, "Đã làm 0/" + items.length + " câu");
    var again = el("button", null, "Làm lại");
    again.type = "button";
    again.addEventListener("click", function () { render(host, items); });
    score.appendChild(scoreText);
    score.appendChild(again);

    items.forEach(function (it, k) {
      var box = el("div", "quiz-item");
      box.appendChild(el("p", "quiz-q", '<span class="qn">Câu ' + (k + 1) + "</span>" + it.q));
      var opts = el("div", "quiz-opts");
      var buttons = it.opts.map(function (text, i) {
        var b = el("button", "quiz-opt", '<span class="ql">' + LETTERS[i] + ".</span><span>" + text + "</span>");
        b.type = "button";
        b.addEventListener("click", function () {
          buttons.forEach(function (x) { x.disabled = true; });
          buttons[it.a].classList.add("ok");
          var right = i === it.a;
          if (!right) b.classList.add("bad");
          answered += 1;
          if (right) correct += 1;
          box.appendChild(el("p", "quiz-why" + (right ? "" : " wrong"),
            "<strong>" + (right ? "Đúng." : "Chưa đúng, đáp án " + LETTERS[it.a] + ".") + "</strong> " + it.why));
          scoreText.textContent = answered < items.length
            ? "Đã làm " + answered + "/" + items.length + " câu · đúng " + correct
            : "Hoàn thành: đúng " + correct + "/" + items.length + " câu";
        });
        opts.appendChild(b);
        return b;
      });
      box.appendChild(opts);
      host.appendChild(box);
    });
    host.appendChild(score);
  }

  var host = document.getElementById("quiz");
  if (host && Array.isArray(window.CT_QUIZ) && window.CT_QUIZ.length) render(host, window.CT_QUIZ);
})();
