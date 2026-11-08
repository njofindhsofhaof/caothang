/* Mo phong tuong tac cho Ly thuyet mach Chuong 2 (lythuyetmach-chuong2.html).
   4 khoi: simWave (song sin + vong quay pha), simCx (so phuc), simZ (tro khang RLC theo tan so), simPQS (tam giac cong suat). */
(function () {
  "use strict";
  var DEG = Math.PI / 180;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(id) { return document.getElementById(id); }
  function fmt(x, d) {
    var n = d == null ? 2 : d;
    var s = (Math.round(x * Math.pow(10, n)) / Math.pow(10, n)).toString();
    s = s.replace("-", "−");
    return isEn() ? s : s.replace(".", ",");
  }
  /* Nút VI/EN (assets/i18n.js) đặt <html lang> rồi phát "ct:lang": mỗi khối vẽ lại theo ngôn ngữ. */
  function isEn() { return document.documentElement.lang === "en"; }
  function tr(vi, en) { return isEn() ? en : vi; }
  function onLang(fn) { document.addEventListener("ct:lang", fn); }
  function setText(id, t) { var n = $(id); if (n) n.textContent = t; }
  function attr(id, a) { var n = $(id); if (!n) return; Object.keys(a).forEach(function (k) { n.setAttribute(k, a[k]); }); }
  function slider(id, unit, cb, digits) {
    var input = $(id), out = $(id + "o");
    function show() { out.textContent = fmt(+input.value, digits == null ? 2 : digits) + (unit ? " " + unit : ""); }
    input.addEventListener("input", function () { show(); cb(); });
    onLang(show);
    show();
    return function () { return +input.value; };
  }
  function polyline(fn, x0, x1, n) {
    var pts = [];
    for (var k = 0; k <= n; k++) {
      var x = x0 + (x1 - x0) * k / n;
      pts.push(x.toFixed(1) + " " + fn(x).toFixed(1));
    }
    return "M" + pts.join(" L");
  }
  function arrowHead(x0, y0, x1, y1, size) {
    var a = Math.atan2(y1 - y0, x1 - x0), s = size || 9;
    var l = [x1 - s * Math.cos(a - 0.45), y1 - s * Math.sin(a - 0.45)];
    var r = [x1 - s * Math.cos(a + 0.45), y1 - s * Math.sin(a + 0.45)];
    return "M" + x0.toFixed(1) + " " + y0.toFixed(1) + " L" + x1.toFixed(1) + " " + y1.toFixed(1) +
      " M" + l[0].toFixed(1) + " " + l[1].toFixed(1) + " L" + x1.toFixed(1) + " " + y1.toFixed(1) + " L" + r[0].toFixed(1) + " " + r[1].toFixed(1);
  }
  function phaseWord(phi) {
    if (Math.abs(phi) < 0.5) return tr("điện áp <b>cùng pha</b> với dòng điện", "voltage is <b>in phase</b> with current");
    return phi > 0 ? tr("điện áp <b>sớm pha</b> hơn dòng điện ", "voltage <b>leads</b> current by ") + fmt(phi, 1) + "°" : tr("điện áp <b>trễ pha</b> hơn dòng điện ", "voltage <b>lags</b> current by ") + fmt(-phi, 1) + "°";
  }

  /* 1. Song sin + vong quay pha */
  function initWave() {
    if (!$("simWave")) return;
    var CX = 95, CY = 110, R = 70, X0 = 195, X1 = 545, WIN = 0.04; /* cua so 40 ms */
    var t = 0, playing = !reduceMotion, last = null;
    var get = {
      Um: slider("wvUm", "V", draw, 0), f: slider("wvF", "Hz", draw, 0),
      pu: slider("wvPu", "°", draw, 0), Im: slider("wvIm", "A", draw, 1), pi: slider("wvPi", "°", draw, 0)
    };
    function draw() {
      var Um = get.Um(), f = get.f(), pu = get.pu(), Im = get.Im(), pi = get.pi();
      var w = 2 * Math.PI * f, au = Um / 320 * R, ai = Im / 10 * R;
      var xs = function (x) { return (x - X0) / (X1 - X0) * WIN; };
      attr("wvU", { d: polyline(function (x) { return CY - au * Math.sin(w * xs(x) + pu * DEG); }, X0, X1, 220) });
      attr("wvI", { d: polyline(function (x) { return CY - ai * Math.sin(w * xs(x) + pi * DEG); }, X0, X1, 220) });
      var thU = w * t + pu * DEG, thI = w * t + pi * DEG;
      var ux = CX + au * Math.cos(thU), uy = CY - au * Math.sin(thU);
      var ix = CX + ai * Math.cos(thI), iy = CY - ai * Math.sin(thI);
      attr("wvVu", { d: arrowHead(CX, CY, ux, uy) });
      attr("wvVi", { d: arrowHead(CX, CY, ix, iy) });
      var cx = X0 + t / WIN * (X1 - X0);
      attr("wvCur", { x1: cx, x2: cx });
      attr("wvPu1", { d: "M" + ux.toFixed(1) + " " + uy.toFixed(1) + " L" + cx.toFixed(1) + " " + uy.toFixed(1) });
      attr("wvDot", { cx: cx, cy: uy });
      var T = 1 / f, phi = pu - pi;
      while (phi > 180) phi -= 360;
      while (phi < -180) phi += 360;
      $("wvLive").innerHTML = "u = " + fmt(Um, 0) + " sin(" + fmt(w, 1) + "t " + (pu < 0 ? "− " : "+ ") + fmt(Math.abs(pu), 0) + "°) V · " +
        "T = 1/f = <b>" + fmt(T * 1000, 2) + " ms</b> · ω = 2πf = <b>" + fmt(w, 1) + " rad/s</b><br>" +
        tr("Hiệu dụng", "RMS") + " U = U<sub>m</sub>/√2 = <b>" + fmt(Um / Math.SQRT2, 1) + " V</b> · I = <b>" + fmt(Im / Math.SQRT2, 2) + " A</b><br>" +
        "φ = φ<sub>u</sub> − φ<sub>i</sub> = " + fmt(pu, 0) + "° − (" + fmt(pi, 0) + "°) = <b>" + fmt(phi, 0) + "°</b>: " + phaseWord(phi);
    }
    function frame(ts) {
      if (!playing) { last = null; return; }
      if (last != null) t = (t + (ts - last) / 1000 * 0.01) % WIN; /* cham 100 lan */
      last = ts;
      draw();
      requestAnimationFrame(frame);
    }
    var btn = $("wvPlay");
    function setBtn() {
      $("wvReset").textContent = tr("↺ Về t = 0", "↺ Back to t = 0");
      btn.textContent = playing ? tr("⏸ Tạm dừng", "⏸ Pause") : tr("▶ Cho quay", "▶ Rotate"); btn.setAttribute("aria-pressed", playing ? "true" : "false");
    }
    btn.addEventListener("click", function () { playing = !playing; setBtn(); if (playing) requestAnimationFrame(frame); });
    $("wvReset").addEventListener("click", function () { t = 0; draw(); });
    setBtn();
    draw();
    onLang(function () { setBtn(); draw(); });
    if (playing) requestAnimationFrame(frame);
  }

  /* 2. So phuc */
  function initCx() {
    if (!$("simCx")) return;
    var OX = 280, OY = 112, K = 9;
    var get = { a: slider("cxA", "", draw, 1), b: slider("cxB", "", draw, 1) };
    function draw() {
      var a = get.a(), b = get.b(), r = Math.hypot(a, b), psi = Math.atan2(b, a) / DEG;
      var px = OX + a * K, py = OY - b * K;
      attr("cxVec", { d: r > 0.05 ? arrowHead(OX, OY, px, py) : "" });
      attr("cxDa", { d: "M" + OX + " " + py.toFixed(1) + " L" + px.toFixed(1) + " " + py.toFixed(1) });
      attr("cxDb", { d: "M" + px.toFixed(1) + " " + OY + " L" + px.toFixed(1) + " " + py.toFixed(1) });
      attr("cxPt", { cx: px, cy: py });
      var rr = 26;
      var ex = OX + rr * Math.cos(psi * DEG), ey = OY - rr * Math.sin(psi * DEG);
      attr("cxArc", { d: r > 0.05 ? "M" + (OX + rr) + " " + OY + " A" + rr + " " + rr + " 0 0 " + (psi >= 0 ? 0 : 1) + " " + ex.toFixed(1) + " " + ey.toFixed(1) : "" });
      attr("cxLbl", { x: px + (a >= 0 ? 8 : -8), y: py + (b >= 0 ? -8 : 18), "text-anchor": a >= 0 ? "start" : "end" });
      setText("cxLbl", fmt(a, 1) + (b < 0 ? " − j" : " + j") + fmt(Math.abs(b), 1));
      var quad = a < 0 ? tr(" (a &lt; 0 nên phải cộng/trừ 180° vào arctan(b/a) = ", " (a &lt; 0, so add/subtract 180° to arctan(b/a) = ") + fmt(Math.atan(b / a) / DEG, 2) + "°)" : "";
      $("cxLive").innerHTML = tr("Dạng đại số", "Rectangular form") + ": C = <b>" + fmt(a, 1) + (b < 0 ? " − j" : " + j") + fmt(Math.abs(b), 1) + "</b><br>" +
        "r = √(" + fmt(a, 1) + "² + " + fmt(b, 1) + "²) = <b>" + fmt(r, 2) + "</b> · ψ = <b>" + fmt(r > 0.05 ? psi : 0, 2) + "°</b>" + (r > 0.05 ? quad : "") + "<br>" +
        tr("Dạng cực", "Polar form") + ": C = <b>" + fmt(r, 2) + "∠" + fmt(r > 0.05 ? psi : 0, 2) + "°</b>";
    }
    draw();
    onLang(draw);
  }

  /* 3. Tro khang RLC noi tiep theo tan so */
  function initZ() {
    if (!$("simZ")) return;
    var U = 220;
    var get = {
      f: slider("zF", "Hz", draw, 0), R: slider("zR", "Ω", draw, 0),
      L: slider("zL", "mH", draw, 0), C: slider("zC", "µF", draw, 0)
    };
    function draw() {
      var f = get.f(), R = get.R(), L = get.L() / 1000, C = get.C() * 1e-6, w = 2 * Math.PI * f;
      var XL = w * L, XC = 1 / (w * C), X = XL - XC, z = Math.hypot(R, X), phi = Math.atan2(X, R) / DEG;
      /* tam giac tro khang: goc (40,112), canh dai nhat 90 px */
      var s = 90 / Math.max(R, Math.abs(X), 1);
      var rx = 40 + R * s, xy = 112 - X * s;
      attr("zTR", { d: "M40 112 L" + rx.toFixed(1) + " 112" });
      attr("zTX", { d: "M" + rx.toFixed(1) + " 112 L" + rx.toFixed(1) + " " + xy.toFixed(1) });
      attr("zTZ", { d: (R > 0 || Math.abs(X) > 0) ? arrowHead(40, 112, rx, xy) : "" });
      attr("zTRl", { x: (40 + rx) / 2, y: X >= 0 ? 130 : 102 });
      attr("zTXl", { x: rx + 8, y: (112 + xy) / 2 + 4 });
      setText("zTRl", "R = " + fmt(R, 0) + " Ω");
      setText("zTXl", "X = " + fmt(X, 1) + " Ω");
      /* do thi vecto U, I: goc (400,112), U lam goc 0 */
      var OX = 400, OY = 112, LI = 75, LU = 110, iAng = -phi * DEG;
      attr("zVU", { d: arrowHead(OX, OY, OX + LU, OY) });
      attr("zVI", { d: arrowHead(OX, OY, OX + LI * Math.cos(iAng), OY - LI * Math.sin(iAng)) });
      attr("zVIl", { x: OX + (LI + 14) * Math.cos(iAng), y: OY - (LI + 14) * Math.sin(iAng) + 4 });
      /* thanh X_L, X_C */
      var bmax = Math.max(XL, XC, 1), bw = 150;
      attr("zBL", { width: Math.min(bw, XL / bmax * bw).toFixed(1) });
      attr("zBC", { width: Math.min(bw, XC / bmax * bw).toFixed(1) });
      setText("zBLt", "XL = " + fmt(XL, 1) + " Ω");
      setText("zBCt", "XC = " + fmt(XC, 1) + " Ω");
      var f0 = 1 / (2 * Math.PI * Math.sqrt(L * C));
      var kind = Math.abs(X) < 0.5 ? "<span class=\"ok\">" + tr("cộng hưởng: X = 0, mạch thuần trở, dòng lớn nhất", "resonance: X = 0, purely resistive, maximum current") + "</span>"
        : X > 0 ? tr("mạch <b>tính cảm</b> (X &gt; 0): dòng trễ pha hơn áp", "<b>inductive</b> circuit (X &gt; 0): current lags voltage") : tr("mạch <b>tính dung</b> (X &lt; 0): dòng sớm pha hơn áp", "<b>capacitive</b> circuit (X &lt; 0): current leads voltage");
      $("zLive").innerHTML = "ω = 2πf = " + fmt(w, 1) + " rad/s · X<sub>L</sub> = ωL = <b>" + fmt(XL, 1) + " Ω</b> · X<sub>C</sub> = 1/(ωC) = <b>" + fmt(XC, 1) + " Ω</b><br>" +
        "Z = R + j(X<sub>L</sub> − X<sub>C</sub>) = " + fmt(R, 0) + (X < 0 ? " − j" : " + j") + fmt(Math.abs(X), 1) + " = <b>" + fmt(z, 1) + "∠" + fmt(phi, 1) + "° Ω</b> → " + kind + "<br>" +
        tr("Với U = ", "With U = ") + U + tr(" V (hiệu dụng): I = U / z = <b>", " V (RMS): I = U / z = <b>") + fmt(z > 0 ? U / z : 0, 2) + " A</b> · " + tr("tần số cộng hưởng", "resonant frequency") + " f<sub>0</sub> = 1/(2π√(LC)) ≈ " + fmt(f0, 1) + " Hz";
    }
    draw();
    onLang(draw);
  }

  /* 4. Tam giac cong suat */
  function initPQS() {
    if (!$("simPQS")) return;
    var get = { U: slider("pqU", "V", draw, 0), R: slider("pqR", "Ω", draw, 0), X: slider("pqX", "Ω", draw, 0) };
    function draw() {
      var U = get.U(), R = get.R(), X = get.X(), z = Math.hypot(R, X), I = z > 0 ? U / z : 0;
      var P = R * I * I, Q = X * I * I, S = U * I, cos = S > 0 ? P / S : 1, phi = Math.atan2(X, R) / DEG;
      var s = 95 / Math.max(P, Math.abs(Q), 1);
      var px = 60 + P * s, qy = 112 - Q * s;
      attr("pqP", { d: "M60 112 L" + px.toFixed(1) + " 112" });
      attr("pqQ", { d: "M" + px.toFixed(1) + " 112 L" + px.toFixed(1) + " " + qy.toFixed(1) });
      attr("pqS", { d: "M60 112 L" + px.toFixed(1) + " " + qy.toFixed(1) });
      attr("pqPl", { x: (60 + px) / 2, y: Q >= 0 ? 130 : 102 });
      attr("pqQl", { x: px + 8, y: (112 + qy) / 2 + 4 });
      setText("pqPl", "P = " + fmt(P, 0) + " W");
      setText("pqQl", "Q = " + fmt(Q, 0) + " VAr");
      /* coc bia: phan bia theo P/S, phan bot theo phan con lai */
      var H = 150, beer = H * cos;
      attr("pqBeer", { y: (190 - beer).toFixed(1), height: beer.toFixed(1) });
      attr("pqFoam", { y: 190 - H, height: (H - beer).toFixed(1) });
      setText("pqCos", "cosφ = " + fmt(cos, 2));
      $("pqLive").innerHTML = "z = √(R² + X²) = " + fmt(z, 1) + " Ω · I = U / z = <b>" + fmt(I, 2) + " A</b> · φ = " + fmt(phi, 1) + "°<br>" +
        "P = R × I² = <b>" + fmt(P, 0) + " W</b> · Q = X × I² = <b>" + fmt(Q, 0) + " VAr</b> · S = U × I = <b>" + fmt(S, 0) + " VA</b><br>" +
        tr("Kiểm tra", "Check") + ": √(P² + Q²) = " + fmt(Math.hypot(P, Q), 0) + " VA = S <span class=\"ok\">✓</span> · " + tr("hệ số công suất", "power factor") + " cosφ = P/S = <b>" + fmt(cos, 2) + "</b>";
    }
    draw();
    onLang(draw);
  }

  initWave();
  initCx();
  initZ();
  initPQS();
})();
