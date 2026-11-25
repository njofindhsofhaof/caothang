/* So do cho trang /baitaptransistor: mach phan cuc BJT NPN (2 nguon hoac 1 nguon, co/khong R_E) va do thi DCLL.
   Dung lai cac lop dd-* trong assets/diode.css, bo sung trong assets/bjt.css. Dung boi assets/bjt.js. */
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
  function resV(g, x, y, h) { s("rect", { x: x - 9, y: y, width: 18, height: h, rx: 1.5, "class": "dd-res" }, g); }
  function resH(g, x, y, w) { s("rect", { x: x, y: y - 9, width: w, height: 18, rx: 1.5, "class": "dd-res" }, g); }
  function arrowDown(g, x, y) { s("path", { d: "M" + (x - 4) + " " + (y - 7) + "L" + (x + 4) + " " + (y - 7) + "L" + x + " " + y + "Z", "class": "dd-cur" }, g); }
  function arrowRight(g, x, y) { s("path", { d: "M" + (x - 7) + " " + (y - 4) + "L" + (x - 7) + " " + (y + 4) + "L" + x + " " + y + "Z", "class": "dd-cur" }, g); }
  /** Nguon DC tron, cuc + o tren, dat tren day doc x tu yTop toi yBot. */
  function source(g, x, cy, yTop, yBot, name, sub, side) {
    line(g, x, yTop, x, cy - 18); line(g, x, cy + 18, x, yBot);
    s("circle", { cx: x, cy: cy, r: 18, "class": "dd-res" }, g);
    label(g, x, cy - 4, "+", "", "middle", "dd-val"); label(g, x, cy + 12, "−", "", "middle", "dd-val");
    label(g, side === "right" ? x + 26 : x - 26, cy + 5, name, sub, side === "right" ? "start" : "end");
  }
  function loopMark(g, x, y, n) {
    s("circle", { cx: x, cy: y, r: 22, "class": "dd-loop-ring" }, g);
    s("circle", { cx: x, cy: y, r: 9, "class": "dd-loop-c" }, g);
    s("text", { x: x, y: y + 4, "text-anchor": "middle", "class": "dd-loop-t" }, g).textContent = n;
  }

  /**
   * Mach phan cuc BJT NPN.
   * @param {{two:boolean, re:boolean}} o two = 2 nguon (V_BB rieng), nguoc lai R_B lay tu V_CC; re = co R_E.
   */
  function bias(o) {
    var aria = o.two
      ? "Mạch phân cực cố định: nguồn V_BB qua R_B vào cực B của transistor NPN, nguồn V_CC qua R_C vào cực C, cực E " + (o.re ? "qua R_E " : "") + "xuống mass"
      : "Mạch phân cực một nguồn: V_CC qua R_B vào cực B, V_CC qua R_C vào cực C, cực E qua R_E xuống mass";
    var svg = s("svg", { viewBox: "0 0 480 260", "class": "dd-svg bj-svg", role: "img", "aria-label": aria });
    var g = s("g", {}, svg);
    var top = 30, bot = 236, bx = 250, by = 140, cx = 274;

    /* transistor NPN */
    s("circle", { cx: bx + 12, cy: by, r: 27, "class": "bj-case" }, g);
    line(g, bx, by - 17, bx, by + 17, "dd-bar");
    line(g, bx, by - 7, cx, by - 22); line(g, bx, by + 7, cx, by + 22);
    s("path", { d: "M" + (cx - 1) + " " + (by + 21) + "l-10 -1 l5 -8 Z", "class": "dd-sym" }, g);
    label(g, bx - 8, by - 8, "B", "", "end", "dd-node");
    label(g, cx + 8, by - 26, "C", "", "start", "dd-node");
    label(g, cx + 8, by + 34, "E", "", "start", "dd-node");

    /* nhanh C: R_C tu ray V_CC */
    line(g, cx, top, cx, 44); resV(g, cx, 44, 42); line(g, cx, 86, cx, by - 22);
    label(g, cx + 16, 70, "R", "C", "start");
    arrowDown(g, cx, 103); label(g, cx - 10, 104, "I", "C", "end", "dd-cur-label");

    /* nhanh E */
    if (o.re) {
      line(g, cx, by + 22, cx, 180); resV(g, cx, 180, 40); line(g, cx, 220, cx, bot);
      label(g, cx + 16, 205, "R", "E", "start");
    } else {
      line(g, cx, by + 22, cx, bot);
    }

    /* V_CC ben phai */
    line(g, cx, top, 410, top);
    source(g, 410, 133, top, bot, "V", "CC", "right");
    line(g, o.two ? 60 : 150, bot, 410, bot);
    s("circle", { cx: cx, cy: bot, r: 3.2, "class": "dd-dot" }, g);
    s("circle", { cx: cx, cy: top, r: 3.2, "class": "dd-dot" }, g);

    /* nhanh B */
    if (o.two) {
      source(g, 60, 190, by, bot, "V", "BB", "left");
      line(g, 60, by, 120, by); resH(g, 120, by, 56); line(g, 176, by, bx, by);
      label(g, 148, by - 16, "R", "B", "middle");
      arrowRight(g, 214, by); label(g, 206, by + 22, "I", "B", "middle", "dd-cur-label");
      loopMark(g, 160, 196, "1");
    } else {
      line(g, 150, top, cx, top);
      s("circle", { cx: 150, cy: top, r: 3.2, "class": "dd-dot" }, g);
      line(g, 150, top, 150, 60); resV(g, 150, 60, 46); line(g, 150, 106, 150, by); line(g, 150, by, bx, by);
      label(g, 134, 88, "R", "B", "end");
      arrowRight(g, 214, by); label(g, 206, by + 22, "I", "B", "middle", "dd-cur-label");
      loopMark(g, 200, 196, "1");
    }
    loopMark(g, 352, 100, "2");
    return svg;
  }

  /**
   * Do thi DCLL: truc V_CE (V) va I_C (mA), duong noi (0; I_Cmax) - (V_CC; 0), cac diem Q.
   * @param {number} vcc V @param {number} icmaxMa mA @param {Array<{vce:number, icMa:number, name:string}>} pts
   */
  function loadLine(vcc, icmaxMa, pts) {
    var W = 440, H = 250, x0 = 60, y0 = 210, xw = 330, yh = 170;
    var svg = s("svg", { viewBox: "0 0 " + W + " " + H, "class": "dd-svg bj-svg", role: "img",
      "aria-label": "Đường tải tĩnh DCLL từ (0; I_Cmax) đến (V_CC; 0) và các điểm làm việc Q" });
    var g = s("g", {}, svg);
    var X = function (v) { return x0 + v / vcc * xw; };
    var Y = function (i) { return y0 - i / icmaxMa * yh; };
    line(g, x0, y0, x0 + xw + 24, y0, "bj-axis"); line(g, x0, y0, x0, y0 - yh - 22, "bj-axis");
    s("path", { d: "M" + (x0 + xw + 24) + " " + (y0 - 4) + "l8 4 l-8 4Z", "class": "bj-axis-h" }, g);
    s("path", { d: "M" + (x0 - 4) + " " + (y0 - yh - 22) + "l4 -8 l4 8Z", "class": "bj-axis-h" }, g);
    label(g, x0 + xw + 30, y0 + 22, "V", "CE", "end", "dd-val");
    label(g, x0 - 8, y0 - yh - 18, "I", "C", "end", "dd-val");
    line(g, X(0), Y(icmaxMa), X(vcc), Y(0), "bj-dcll");
    label(g, x0 - 6, Y(icmaxMa) + 4, String(icmaxMa).replace(".", ","), "", "end", "dd-val");
    label(g, X(vcc), y0 + 18, String(vcc).replace(".", ","), "", "middle", "dd-val");
    label(g, x0 - 6, y0 + 14, "0", "", "end", "dd-val");
    label(g, X(vcc * 0.55) + 8, Y(icmaxMa * 0.45) - 6, "DCLL", "", "start", "bj-dcll-t");
    pts.forEach(function (p) {
      var px = X(p.vce), py = Y(p.icMa);
      s("circle", { cx: px, cy: py, r: 5, "class": "bj-q" }, g);
      label(g, px + 8, py - 8, p.name, "", "start", "bj-q-t");
    });
    return svg;
  }

  root.BJT_SVG = { bias: bias, loadLine: loadLine };
})(typeof window !== "undefined" ? window : globalThis);
