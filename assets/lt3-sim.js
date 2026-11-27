/* Mo phong tuong tac cho Ly thuyet mach Chuong 3 (lythuyetmach-chuong3.html).
   2 khoi: simMesh (dong mat luoi, mach 2 mat 3 nguon ap), simNode (dien the nut, mach 2 nut 3 nguon dong).
   Dong chay ve bang duong net dut chuyen dong (.ov); dong am thi dao chieu (.rev); dong ~0 thi an (.off). */
(function () {
  "use strict";

  function $(id) { return document.getElementById(id); }
  function isEn() { return document.documentElement.lang === "en"; }
  function tr(vi, en) { return isEn() ? en : vi; }
  function onLang(fn) { document.addEventListener("ct:lang", fn); }
  function fmt(x, d) {
    var n = d == null ? 2 : d;
    var v = Math.round(x * Math.pow(10, n)) / Math.pow(10, n);
    if (v === 0) v = 0; /* bo -0 */
    var s = v.toString().replace("-", "−");
    return isEn() ? s : s.replace(".", ",");
  }
  function setText(id, t) { var n = $(id); if (n) n.textContent = t; }
  function slider(id, unit, cb) {
    var input = $(id), out = $(id + "o");
    function show() { out.textContent = fmt(+input.value, 1) + " " + unit; }
    input.addEventListener("input", function () { show(); cb(); });
    onLang(function () { show(); cb(); });
    show();
    return function () { return +input.value; };
  }
  /* Dat chieu, toc do, an/hien cho mot duong dong chay theo gia tri dong I (A). */
  function flow(id, I) {
    var el = $(id);
    if (!el) return;
    var a = Math.abs(I);
    el.classList.toggle("off", a < 0.01);
    el.classList.toggle("rev", I < 0);
    el.style.setProperty("--dur", Math.max(0.25, Math.min(3, 2.4 / Math.max(a, 0.1))).toFixed(2) + "s");
  }
  /* Giai he 2 an a11 x + a12 y = b1, a21 x + a22 y = b2 bang Cramer. */
  function solve2(a11, a12, a21, a22, b1, b2) {
    var d = a11 * a22 - a12 * a21;
    return [(b1 * a22 - a12 * b2) / d, (a11 * b2 - b1 * a21) / d];
  }
  function cur(name, I) {
    return name + " = " + fmt(I) + " A" + (I < -0.005 ? " <span class=\"neg\">(" + tr("ngược chiều vẽ", "opposite to the drawn arrow") + ")</span>" : "");
  }

  /* 1. Dong mat luoi: E1 (trai), R1 (tren trai), R3 + E2 (giua, cuc + o duoi), R2 (tren phai), E3 (phai).
        Im1 cung chieu kim dong ho, Im2 nguoc chieu kim dong ho: ca hai deu di xuong qua R3. */
  function initMesh() {
    if (!$("simMesh")) return;
    var R1 = 3, R2 = 9;
    var get = {
      E1: slider("mhE1", "V", draw), E2: slider("mhE2", "V", draw),
      E3: slider("mhE3", "V", draw), R3: slider("mhR3", "Ω", draw)
    };
    function draw() {
      var E1 = get.E1(), E2 = get.E2(), E3 = get.E3(), R3 = get.R3();
      var a11 = R1 + R3, a12 = R3, a22 = R2 + R3, b1 = E1 + E2, b2 = E2 + E3;
      var s = solve2(a11, a12, a12, a22, b1, b2), m1 = s[0], m2 = s[1];
      var I1 = m1, I2 = m2, I3 = m1 + m2;
      flow("mhF1", I1); flow("mhF2", I2); flow("mhF3", I3);
      setText("mhLE1", "E₁ = " + fmt(E1, 1) + " V");
      setText("mhLE2", "E₂ = " + fmt(E2, 1) + " V");
      setText("mhLE3", "E₃ = " + fmt(E3, 1) + " V");
      setText("mhLR3", "R₃ = " + fmt(R3, 1) + " Ω");
      setText("mhM1", fmt(m1) + " A");
      setText("mhM2", fmt(m2) + " A");
      var pSrc = E1 * I1 + E2 * I3 + E3 * I2;
      var pLoad = R1 * I1 * I1 + R2 * I2 * I2 + R3 * I3 * I3;
      $("mhLive").innerHTML =
        tr("Mắt 1: ", "Mesh 1: ") + "(" + R1 + " + " + fmt(R3, 1) + ")·I<sub>m1</sub> + " + fmt(R3, 1) + "·I<sub>m2</sub> = " + fmt(E1, 1) + " + " + fmt(E2, 1) +
        " ⇒ <b>" + fmt(a11, 1) + "·I<sub>m1</sub> + " + fmt(a12, 1) + "·I<sub>m2</sub> = " + fmt(b1, 1) + "</b><br>" +
        tr("Mắt 2: ", "Mesh 2: ") + fmt(R3, 1) + "·I<sub>m1</sub> + (" + R2 + " + " + fmt(R3, 1) + ")·I<sub>m2</sub> = " + fmt(E2, 1) + " + " + fmt(E3, 1) +
        " ⇒ <b>" + fmt(a12, 1) + "·I<sub>m1</sub> + " + fmt(a22, 1) + "·I<sub>m2</sub> = " + fmt(b2, 1) + "</b><br>" +
        tr("Giải: ", "Solve: ") + "<b>I<sub>m1</sub> = " + fmt(m1) + " A</b>, <b>I<sub>m2</sub> = " + fmt(m2) + " A</b><br>" +
        tr("Dòng nhánh: ", "Branch currents: ") + cur("I₁ = I<sub>m1</sub>", I1) + " · " + cur("I₂ = I<sub>m2</sub>", I2) + " · " +
        cur("I₃ = I<sub>m1</sub> + I<sub>m2</sub>", I3) + "<br>" +
        tr("Kiểm tra: P<sub>nguồn</sub> = ", "Check: P<sub>sources</sub> = ") + fmt(pSrc, 1) + " W, P<sub>" + tr("tải", "load") + "</sub> = ΣR·I² = " + fmt(pLoad, 1) + " W " +
        (Math.abs(pSrc - pLoad) < 0.05 ? "<span class=\"ok\">✓ " + tr("cân bằng", "balanced") + "</span>" : "");
    }
    draw();
  }

  /* 2. Dien the nut: J1 vao a, R1 = 6 Ω tu a xuong goc, R2 tu a sang b, J2 tu b sang a, R3 = 2 Ω tu b xuong goc, J3 vao b. */
  function initNode() {
    if (!$("simNode")) return;
    var R1 = 6, R3 = 2;
    var get = {
      J1: slider("ndJ1", "A", draw), J2: slider("ndJ2", "A", draw),
      J3: slider("ndJ3", "A", draw), R2: slider("ndR2", "Ω", draw)
    };
    function draw() {
      var J1 = get.J1(), J2 = get.J2(), J3 = get.J3(), R2 = get.R2();
      var g1 = 1 / R1, g2 = 1 / R2, g3 = 1 / R3;
      var s = solve2(g1 + g2, -g2, -g2, g2 + g3, J1 + J2, J3 - J2), Va = s[0], Vb = s[1];
      var I1 = Va / R1, I2 = (Va - Vb) / R2, I3 = Vb / R3;
      flow("ndF1", I1); flow("ndF2", I2); flow("ndF3", I3);
      flow("ndFJ1", J1); flow("ndFJ2", J2); flow("ndFJ3", J3);
      setText("ndLJ1", fmt(J1, 1) + " A"); setText("ndLJ2", fmt(J2, 1) + " A");
      setText("ndLJ3", fmt(J3, 1) + " A"); setText("ndLR2", fmt(R2, 1) + " Ω");
      setText("ndVa", " = " + fmt(Va, 1) + " V"); setText("ndVb", " = " + fmt(Vb, 1) + " V");
      /* Cot muc dien the: 0..40 V ung voi 0..70 px, am thi ve xuong duoi */
      [["ndBarA", Va], ["ndBarB", Vb]].forEach(function (p) {
        var el = $(p[0]), h = Math.max(-35, Math.min(70, p[1] / 40 * 70));
        el.setAttribute("y", (h >= 0 ? 230 - h : 230).toFixed(1));
        el.setAttribute("height", Math.abs(h).toFixed(1));
      });
      var kcl = J1 + J2 - I1 - I2;
      $("ndLive").innerHTML =
        tr("Nút a: ", "Node a: ") + "(1/6 + 1/" + fmt(R2, 1) + ")·V<sub>A</sub> − (1/" + fmt(R2, 1) + ")·V<sub>B</sub> = " + fmt(J1, 1) + " + " + fmt(J2, 1) + "<br>" +
        tr("Nút b: ", "Node b: ") + "−(1/" + fmt(R2, 1) + ")·V<sub>A</sub> + (1/" + fmt(R2, 1) + " + 1/2)·V<sub>B</sub> = " + fmt(J3, 1) + " − " + fmt(J2, 1) + "<br>" +
        tr("Giải: ", "Solve: ") + "<b>V<sub>A</sub> = " + fmt(Va) + " V</b>, <b>V<sub>B</sub> = " + fmt(Vb) + " V</b> (V<sub>C</sub> = 0)<br>" +
        tr("Dòng nhánh: ", "Branch currents: ") + cur("I₁ = V<sub>A</sub>/6", I1) + " · " + cur("I₂ = (V<sub>A</sub> − V<sub>B</sub>)/R₂", I2) + " · " + cur("I₃ = V<sub>B</sub>/2", I3) + "<br>" +
        tr("Kiểm tra K1 tại a: ", "KCL check at a: ") + "J₁ + J₂ − I₁ − I₂ = " + fmt(kcl) + " A " +
        (Math.abs(kcl) < 0.005 ? "<span class=\"ok\">✓</span>" : "");
    }
    draw();
  }

  initMesh();
  initNode();
})();
