/* So do cho trang /baitapzener: mach on ap Zener (V_S, R_S, nut A, D_Z // R_L). Dung lai cac lop dd-* trong assets/diode.css. Dung boi assets/zener.js. */
(function (root) {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";

  function s(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(n);
    return n;
  }
  function line(g, x1, y1, x2, y2, cls) { return s("line", { x1: x1, y1: y1, x2: x2, y2: y2, "class": cls || "dd-wire" }, g); }
  function label(g, x, y, main, sub, anchor, cls) {
    var t = s("text", { x: x, y: y, "text-anchor": anchor || "start", "class": cls || "" }, g);
    t.appendChild(document.createTextNode(main));
    if (sub) { var ts = s("tspan", { dy: 4, "class": "dd-sub" }, t); ts.textContent = sub; }
    return t;
  }
  function svgRoot(w, h, aria) {
    return s("svg", { viewBox: "0 0 " + w + " " + h, "class": "dd-svg", role: "img", "aria-label": aria });
  }
  function arrowDown(g, x, y) { s("path", { d: "M" + (x - 4) + " " + (y - 7) + "L" + (x + 4) + " " + (y - 7) + "L" + x + " " + y + "Z", "class": "dd-cur" }, g); }
  function arrowRight(g, x, y) { s("path", { d: "M" + (x - 7) + " " + (y - 4) + "L" + (x - 7) + " " + (y + 4) + "L" + x + " " + y + "Z", "class": "dd-cur" }, g); }
  function voltArrow(g, x, y1, y2, main, sub) {
    line(g, x, y1, x, y2 - 6, "dd-varrow");
    s("path", { d: "M" + (x - 5) + " " + (y2 - 9) + "L" + (x + 5) + " " + (y2 - 9) + "L" + x + " " + y2 + "Z", "class": "dd-varrow-h" }, g);
    label(g, x + 9, (y1 + y2) / 2 + 5, main, sub, "start", "dd-tap-label");
  }
  function loop(g, x, y) {
    s("circle", { cx: x, cy: y, r: 30, "class": "dd-loop-ring" }, g);
    s("path", { d: "M" + (x - 34) + " " + (y + 6) + "l4 -10 l5 9 Z", "class": "dd-loop-h" }, g);
    s("circle", { cx: x, cy: y, r: 10, "class": "dd-loop-c" }, g);
    s("text", { x: x, y: y + 4.5, "text-anchor": "middle", "class": "dd-loop-t" }, g).textContent = "1";
  }
  function resV(g, x, y, h) { s("rect", { x: x - 9, y: y, width: 18, height: h, rx: 1.5, "class": "dd-res" }, g); }
  function resH(g, x, y, w) { s("rect", { x: x, y: y - 9, width: w, height: 18, rx: 1.5, "class": "dd-res" }, g); }

  /** Zener: dat [y, y+32] tren day doc x; anode duoi, cathode tren (phan cuc nguoc). */
  function zenerSym(g, x, y) {
    line(g, x, y, x, y + 4); line(g, x, y + 28, x, y + 32);
    s("path", { d: "M" + (x - 11) + " " + (y + 28) + "L" + (x + 11) + " " + (y + 28) + "L" + x + " " + (y + 4) + "Z", "class": "dd-sym" }, g);
    s("path", { d: "M" + (x - 16) + " " + y + "L" + (x - 12) + " " + (y + 4) + "L" + (x + 12) + " " + (y + 4) + "L" + (x + 16) + " " + (y + 8), "class": "dd-bar" }, g);
  }

  /** Mach on ap Zener giong hinh vo: V_S -> R_S -> nut A -> D_Z // R_L. */
  function zener() {
    var svg = svgRoot(480, 240, "Sơ đồ mạch ổn áp Zener: nguồn V_S qua R_S tới nút A, diode Zener và tải R_L mắc song song, V_O trên R_L");
    var g = s("g", {}, svg);
    var top = 50, bot = 200, xs = 60, xa = 220, xl = 320;
    line(g, xs, top, xs, 107); line(g, xs, 143, xs, bot);
    s("circle", { cx: xs, cy: 125, r: 18, "class": "dd-res" }, g);
    label(g, xs, 120, "+", "", "middle", "dd-val"); label(g, xs, 137, "−", "", "middle", "dd-val");
    label(g, xs - 26, 130, "V", "S", "end");
    line(g, xs, top, 120, top); resH(g, 120, top, 50); line(g, 170, top, xl, top);
    label(g, 145, top - 16, "R", "S", "middle");
    arrowRight(g, 100, top); label(g, 92, top - 10, "I", "S", "middle", "dd-cur-label");
    s("circle", { cx: xa, cy: top, r: 3.6, "class": "dd-dot" }, g);
    label(g, xa, top - 12, "A", "", "middle", "dd-node");
    line(g, xa, top, xa, 108); zenerSym(g, xa, 108); line(g, xa, 140, xa, bot);
    arrowDown(g, xa - 10, 86); label(g, xa - 16, 86, "I", "Z", "end", "dd-cur-label");
    label(g, xa + 20, 124, "D", "Z", "start"); label(g, xa + 20, 142, "V", "Z", "start", "dd-val");
    line(g, xl, top, xl, 98); resV(g, xl, 98, 50); line(g, xl, 148, xl, bot);
    arrowDown(g, xl - 10, 86); label(g, xl - 16, 86, "I", "RL", "end", "dd-cur-label");
    label(g, xl + 16, 128, "R", "L", "start");
    line(g, xs, bot, xl, bot);
    s("circle", { cx: xa, cy: bot, r: 3.2, "class": "dd-dot" }, g);
    voltArrow(g, 400, top, bot, "V", "O");
    loop(g, 140, 128);
    return svg;
  }

  root.ZENER_SVG = { zener: zener };
})(typeof window !== "undefined" ? window : globalThis);
