/* Mo phong tuong tac cho Ly thuyet mach Chuong 4 (lythuyetmach-chuong4.html).
   2 khoi: simPhase (gian do vecto 3 pha quay + song sin, dien ap day U_AB),
           simLoad (tai 3 pha doi xung noi sao / tam giac, dong dien, cong suat P Q S).
   Nhan nut va dong so lieu tu viet lai khi doi ngon ngu (su kien "ct:lang"). */
(function () {
  "use strict";

  var SQ3 = Math.sqrt(3);
  function $(id) { return document.getElementById(id); }
  function isEn() { return document.documentElement.lang === "en"; }
  function tr(vi, en) { return isEn() ? en : vi; }
  function onLang(fn) { document.addEventListener("ct:lang", fn); }
  function fmt(x, d) {
    var n = d == null ? 2 : d;
    var v = Math.round(x * Math.pow(10, n)) / Math.pow(10, n);
    if (v === 0) v = 0; /* bo -0 */
    var s = v.toFixed(n).replace("-", "−");
    return isEn() ? s : s.replace(".", ",");
  }
  /* So lon co tach nhom: 17328 -> "17 328" */
  function big(x) {
    var s = Math.round(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, isEn() ? "," : " ");
    return s.replace("-", "−");
  }
  function sub(name, s) { return name + "<sub>" + s + "</sub>"; }
  function svgSub(name, s, rest) {
    return name + "<tspan class=\"sub\" dy=\"4\">" + s + "</tspan><tspan dy=\"-4\">" + (rest || "") + "</tspan>";
  }
  function slider(id, unit, d, cb) {
    var input = $(id), out = $(id + "o");
    function show() { out.textContent = fmt(+input.value, d) + " " + unit; }
    input.addEventListener("input", function () { show(); cb(); });
    onLang(function () { show(); cb(); });
    show();
    return function () { return +input.value; };
  }
  function setD(id, d) { var el = $(id); if (el) el.setAttribute("d", d); }
  function rad(deg) { return deg * Math.PI / 180; }

  /* 1. Gian do vecto 3 pha. Vecto pha dai L = 60 px quay nguoc chieu kim dong ho;
        song ben phai cung bien do 60 px nen hinh chieu dung cua dau vecto trung voi diem tren song. */
  function initPhase() {
    if (!$("simPhase")) return;
    var CX = 130, CY = 130, L = 60, X0 = 270, W = 330;
    var PH = [0, 120, 240], KEYS = ["a", "b", "c"];
    var showD = false, playing = false, last = 0;
    var tIn = $("phT"), play = $("phPlay"), btnD = $("phShowD");

    function wavePath(amp, shift) {
      var pts = [];
      for (var deg = 0; deg <= 360; deg += 6) {
        var x = X0 + deg / 360 * W, y = CY - amp * Math.sin(rad(deg + shift));
        pts.push(x.toFixed(1) + " " + y.toFixed(1));
      }
      return "M" + pts.join(" L");
    }
    setD("phWa", wavePath(L, 0)); setD("phWb", wavePath(L, -120)); setD("phWc", wavePath(L, -240));
    setD("phWd", wavePath(L * SQ3, 30));

    function labels() {
      play.textContent = playing ? tr("⏸ Dừng", "⏸ Pause") : tr("▶ Cho quay", "▶ Rotate");
      btnD.innerHTML = (showD ? tr("Ẩn", "Hide") : tr("Hiện", "Show")) + " " + tr("điện áp dây ", "line voltage ") + sub("U", "AB");
      play.setAttribute("aria-pressed", String(playing));
      btnD.setAttribute("aria-pressed", String(showD));
    }

    function draw() {
      var th = +tIn.value, Up = +$("phU").value, Um = Up * Math.SQRT2;
      var cx = X0 + th / 360 * W, tips = [], vals = [];
      PH.forEach(function (ph, i) {
        var a = rad(th - ph), x = CX + L * Math.cos(a), y = CY - L * Math.sin(a), k = KEYS[i];
        tips.push([x, y]);
        vals.push(Um * Math.sin(a));
        setD("phV" + k, "M" + CX + " " + CY + " L" + x.toFixed(1) + " " + y.toFixed(1));
        setD("phP" + k, "M" + x.toFixed(1) + " " + y.toFixed(1) + " L" + cx.toFixed(1) + " " + y.toFixed(1));
        var dot = $("phD" + k); dot.setAttribute("cx", cx.toFixed(1)); dot.setAttribute("cy", y.toFixed(1));
        var lb = $("phL" + k);
        lb.setAttribute("x", (CX + (L + 16) * Math.cos(a) - 8).toFixed(1));
        lb.setAttribute("y", (CY - (L + 16) * Math.sin(a) + 5).toFixed(1));
      });
      setD("phCur", "M" + cx.toFixed(1) + " 30 L" + cx.toFixed(1) + " 230");
      /* U_AB = U_A - U_B: ve tu dau vecto B toi dau vecto A */
      setD("phVd", "M" + tips[1][0].toFixed(1) + " " + tips[1][1].toFixed(1) + " L" + tips[0][0].toFixed(1) + " " + tips[0][1].toFixed(1));
      var ld = $("phLd");
      ld.setAttribute("x", ((tips[0][0] + tips[1][0]) / 2 + 8).toFixed(1));
      ld.setAttribute("y", ((tips[0][1] + tips[1][1]) / 2 - 6).toFixed(1));
      ["phVd", "phWd", "phLd"].forEach(function (id) { $(id).classList.toggle("hide", !showD); });
      $("phTo").textContent = Math.round(th) + "°";
      $("phAng").textContent = "ωt = " + Math.round(th) + "°";
      var sum = vals[0] + vals[1] + vals[2];
      var html =
        tr("Giá trị tức thời (biên độ U", "Instantaneous values (amplitude U") + "<sub>m</sub> = √2·" + fmt(Up, 0) + " ≈ " + fmt(Um, 0) + " V): " +
        "<span class=\"k-i\">" + sub("u", "A") + " = " + fmt(vals[0], 1) + " V</span> · " +
        "<span class=\"k-u\">" + sub("u", "B") + " = " + fmt(vals[1], 1) + " V</span> · " +
        "<b class=\"ok\">" + sub("u", "C") + " = " + fmt(vals[2], 1) + " V</b><br>" +
        tr("Tổng: ", "Sum: ") + sub("u", "A") + " + " + sub("u", "B") + " + " + sub("u", "C") + " = <b>" + fmt(Math.abs(sum) < 1e-6 ? 0 : sum, 1) + " V</b> <span class=\"ok\">✓</span>";
      if (showD) {
        html += "<br>" + tr("Điện áp dây (nối sao): ", "Line voltage (star): ") + sub("U", "AB") + " = √3·" + sub("U", "p") + " = √3 × " + fmt(Up, 0) + " ≈ <b>" + fmt(SQ3 * Up, 0) + " V</b>, " +
          tr("vượt trước ", "leading ") + sub("U", "A") + " 30°";
      }
      $("phLive").innerHTML = html;
    }

    function step(ts) {
      if (!playing) return;
      if (last) tIn.value = ((+tIn.value + (ts - last) * 0.06) % 360).toFixed(1);
      last = ts;
      draw();
      requestAnimationFrame(step);
    }
    play.addEventListener("click", function () {
      playing = !playing; last = 0; labels();
      if (playing) requestAnimationFrame(step);
    });
    btnD.addEventListener("click", function () { showD = !showD; labels(); draw(); });
    tIn.addEventListener("input", draw);
    slider("phU", "V", 0, draw);
    onLang(function () { labels(); draw(); });
    labels();
    draw();
  }

  /* 2. Tai 3 pha doi xung noi sao / tam giac. */
  function initLoad() {
    if (!$("simLoad")) return;
    var mode = "Y";
    var bY = $("ldBY"), bD = $("ldBD");

    function flow(id, I) {
      var el = $(id);
      el.classList.toggle("off", I < 0.01);
      el.style.setProperty("--dur", Math.max(0.25, Math.min(3, 26 / Math.max(I, 0.1))).toFixed(2) + "s");
    }
    function calc(m, U, R, X) {
      var Z = Math.sqrt(R * R + X * X), Up = m === "Y" ? U / SQ3 : U, Ip = Up / Z;
      var Id = m === "Y" ? Ip : SQ3 * Ip;
      return { Z: Z, Up: Up, Ip: Ip, Id: Id, P: 3 * R * Ip * Ip, Q: 3 * X * Ip * Ip, S: 3 * Up * Ip };
    }
    function labels() {
      bY.textContent = tr("Nối sao (Y)", "Star (Y)");
      bD.textContent = tr("Nối tam giác (Δ)", "Delta (Δ)");
      bY.setAttribute("aria-pressed", String(mode === "Y"));
      bD.setAttribute("aria-pressed", String(mode === "D"));
    }
    var get = {
      U: slider("ldU", "V", 0, draw), R: slider("ldR", "Ω", 0, draw), X: slider("ldX", "Ω", 0, draw)
    };
    function draw() {
      var U = get.U(), R = get.R(), X = get.X();
      var c = calc(mode, U, R, X), o = calc(mode === "Y" ? "D" : "Y", U, R, X);
      var phi = Math.atan2(X, R) * 180 / Math.PI, cos = R / c.Z;
      $("ldY").classList.toggle("hide", mode !== "Y");
      $("ldD").classList.toggle("hide", mode !== "D");
      flow("ldF1", c.Id); flow("ldF2", c.Id); flow("ldF3", c.Id);
      $("ldLId").innerHTML = svgSub("I", "d", " = " + fmt(c.Id) + " A");
      $("ldLIp").innerHTML = svgSub("I", "p", " = " + fmt(c.Ip) + " A") + "<tspan> · </tspan>" + svgSub("U", "p", " = " + fmt(c.Up, 1) + " V");
      /* Tam giac cong suat: chi the hien hinh dang (goc phi), so lieu o dong chu ben duoi */
      var k = Math.min(150 / c.P, c.Q > 0 ? 110 / c.Q : Infinity), px = 420 + k * c.P, qy = 200 - k * c.Q;
      setD("ldTP", "M420 200 L" + px.toFixed(1) + " 200");
      setD("ldTQ", "M" + px.toFixed(1) + " 200 L" + px.toFixed(1) + " " + qy.toFixed(1));
      setD("ldTS", "M420 200 L" + px.toFixed(1) + " " + qy.toFixed(1));
      $("ldTQl").setAttribute("x", (px + 8).toFixed(1)); $("ldTQl").setAttribute("y", ((200 + qy) / 2 + 5).toFixed(1));
      $("ldTSl").setAttribute("x", ((420 + px) / 2 - 6).toFixed(1)); $("ldTSl").setAttribute("y", ((200 + qy) / 2 - 4).toFixed(1));
      $("ldTQl").classList.toggle("hide", c.Q < 1e-9);

      var Y = mode === "Y";
      var html =
        (Y ? sub("U", "p") + " = " + sub("U", "d") + "/√3 = " + fmt(U, 0) + "/√3 = <b>" + fmt(c.Up, 1) + " V</b>"
           : sub("U", "p") + " = " + sub("U", "d") + " = <b>" + fmt(c.Up, 0) + " V</b>") +
        " · " + sub("Z", "p") + " = √(" + fmt(R, 0) + "² + " + fmt(X, 0) + "²) = <b>" + fmt(c.Z) + " Ω</b><br>" +
        sub("I", "p") + " = " + sub("U", "p") + "/" + sub("Z", "p") + " = <b>" + fmt(c.Ip) + " A</b> · " +
        (Y ? sub("I", "d") + " = " + sub("I", "p") + " = <b>" + fmt(c.Id) + " A</b>"
           : sub("I", "d") + " = √3·" + sub("I", "p") + " = <b>" + fmt(c.Id) + " A</b>") +
        " · φ = arctg(" + fmt(X, 0) + "/" + fmt(R, 0) + ") = " + fmt(phi, 1) + "°, cosφ = " + fmt(cos) + "<br>" +
        "<span class=\"k-i\">P = 3·" + sub("R", "p") + "·" + sub("I", "p") + "² = " + big(c.P) + " W</span> · " +
        "<span class=\"k-u\">Q = 3·" + sub("X", "p") + "·" + sub("I", "p") + "² = " + big(c.Q) + " VAr</span> · " +
        "<b class=\"ok\">S = " + big(c.S) + " VA</b><br>" +
        tr("Cùng tải nếu nối ", "Same load connected in ") + (Y ? tr("tam giác", "delta") : tr("sao", "star")) + ": " +
        sub("I", "d") + " = " + fmt(o.Id) + " A, P = " + big(o.P) + " W " +
        "(" + (Y ? tr("gấp 3 lần", "3 times larger") : tr("bằng 1/3", "one third")) + ")";
      $("ldLive").innerHTML = html;
    }
    bY.addEventListener("click", function () { mode = "Y"; labels(); draw(); });
    bD.addEventListener("click", function () { mode = "D"; labels(); draw(); });
    onLang(labels);
    labels();
    draw();
  }

  initPhase();
  initLoad();
})();
