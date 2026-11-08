/* Ve so do mach diode dang doc giong hinh trong vo: VCC tren, R, cac tang diode (don hoac cum song song),
   Mass duoi; diem do V_O keo ngang sang phai, mui ten vong (1) ben trai. Dung boi assets/diode.js. */
(function (root) {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var CX = 210, COL = 62, TAP_X = 430, W = 490, RW = 18, RH = 44;
  var SINGLE_H = 74, PAR_H = 96;

  function s(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(n);
    return n;
  }
  function line(g, x1, y1, x2, y2, cls) { return s("line", { x1: x1, y1: y1, x2: x2, y2: y2, "class": cls || "dd-wire" }, g); }

  /** Chu co chi so duoi, vd label(g, x, y, "I", "D1"). */
  function label(g, x, y, main, sub, anchor, cls) {
    var t = s("text", { x: x, y: y, "text-anchor": anchor || "start", "class": cls || "" }, g);
    t.appendChild(document.createTextNode(main));
    if (sub) { var ts = s("tspan", { dy: 4, "class": "dd-sub" }, t); ts.textContent = sub; }
    return t;
  }
  function text(g, x, y, str, anchor, cls) {
    var t = s("text", { x: x, y: y, "text-anchor": anchor || "start", "class": cls || "" }, g);
    t.textContent = str;
    return t;
  }
  function arrowDown(g, x, y) { s("path", { d: "M" + (x - 4) + " " + (y - 7) + "L" + (x + 4) + " " + (y - 7) + "L" + x + " " + y + "Z", "class": "dd-cur" }, g); }
  function vf(d) { return String(d.vf).replace(".", ",") + " V"; }

  /** Diode chiem doan [y, y+32] tren day doc x. Thuan: tam giac chi xuong; nghich: chi len. */
  function diode(g, x, y, d) {
    line(g, x, y, x, y + 4);
    line(g, x, y + 28, x, y + 32);
    var tri = d.rev
      ? "M" + (x - 11) + " " + (y + 28) + "L" + (x + 11) + " " + (y + 28) + "L" + x + " " + (y + 4) + "Z"
      : "M" + (x - 11) + " " + (y + 4) + "L" + (x + 11) + " " + (y + 4) + "L" + x + " " + (y + 28) + "Z";
    s("path", { d: tri, "class": "dd-sym" + (d.kind === "led" ? " dd-led" : "") }, g);
    var by = d.rev ? y + 4 : y + 28;
    line(g, x - 12, by, x + 12, by, "dd-bar");
    if (d.kind === "led") {
      [0, 7].forEach(function (o) {
        var x0 = x + 9, y0 = y + 11 + o, x1 = x + 19, y1 = y + 19 + o;
        line(g, x0, y0, x1, y1, "dd-ray");
        s("path", { d: "M" + x1 + " " + y1 + "l-6 -1 l3 -3 Z", "class": "dd-ray-h" }, g);
      });
    }
  }

  function drawSingle(g, y, d) {
    line(g, CX, y, CX, y + 20);
    arrowDown(g, CX - 9, y + 16);
    label(g, CX - 16, y + 16, "I", d.name, "end", "dd-cur-label");
    diode(g, CX, y + 20, d);
    line(g, CX, y + 52, CX, y + SINGLE_H);
    label(g, CX + 26, y + 34, d.name.charAt(0), d.name.slice(1));
    text(g, CX + 26, y + 50, (d.kind === "si" ? "Si " : "LED ") + vf(d) + (d.rev ? " · ngược" : ""), "start", "dd-val");
    return y + SINGLE_H;
  }

  function drawParallel(g, y, level, node) {
    var n = level.length;
    var xs = level.map(function (_, i) { return CX + (i - (n - 1) / 2) * COL; });
    var top = y + 14, bot = y + 74;
    line(g, CX, y, CX, top);
    line(g, xs[0], top, xs[n - 1], top);
    line(g, xs[0], bot, xs[n - 1], bot);
    level.forEach(function (d, i) {
      var x = xs[i];
      line(g, x, top, x, top + 12);
      diode(g, x, top + 12, d);
      line(g, x, top + 44, x, bot);
      label(g, x + 13, top + 14, d.name.charAt(0), d.name.slice(1), "start", "dd-pname");
      text(g, x + 13, top + 56, vf(d), "start", "dd-val");
      s("circle", { cx: x, cy: top, r: 2.6, "class": "dd-dot" }, g);
      s("circle", { cx: x, cy: bot, r: 2.6, "class": "dd-dot" }, g);
    });
    s("circle", { cx: CX, cy: top, r: 3.6, "class": "dd-dot" }, g);
    text(g, CX - 7, top - 4, node, "end", "dd-node");
    line(g, CX, bot, CX, y + PAR_H);
    return y + PAR_H;
  }

  function tap(g, y, name) {
    s("line", { x1: CX, y1: y, x2: TAP_X, y2: y, "class": "dd-tap" }, g);
    s("circle", { cx: TAP_X, cy: y, r: 4, "class": "dd-term" }, g);
    label(g, TAP_X + 9, y + 5, "V", name, "start", "dd-tap-label");
  }

  function nodeName(i) { return String.fromCharCode(65 + i); }

  /** @param {{levels:Array, taps:Array<{name:string,node:number}>}} p @param {number} [vcc] ve so neu chi co 1 gia tri */
  function draw(p, vcc) {
    var heights = p.levels.map(function (lv) { return lv.length > 1 ? PAR_H : SINGLE_H; });
    var total = 128 + heights.reduce(function (a, h) { return a + h; }, 0) + 40;
    var svg = s("svg", { viewBox: "0 0 " + W + " " + total, "class": "dd-svg", role: "img",
      "aria-label": "Sơ đồ mạch: nguồn V_CC qua điện trở R tới " + p.levels.map(function (lv) {
        return lv.map(function (d) { return d.name + (d.rev ? " ngược" : ""); }).join(" song song ");
      }).join(", nối tiếp ") + " xuống Mass" });
    var g = s("g", {}, svg);

    label(g, CX + 12, 18, "V", "CC", "start", "dd-vcc");
    if (vcc !== undefined) text(g, CX + 44, 18, "= " + String(vcc).replace(".", ",") + " V", "start", "dd-vcc");
    s("path", { d: "M" + (CX - 6) + " 22L" + (CX + 6) + " 22L" + CX + " 10Z", "class": "dd-cur" }, g);
    line(g, CX, 22, CX, 54);
    arrowDown(g, CX - 9, 46);
    label(g, CX - 16, 46, "I", "R", "end", "dd-cur-label");
    s("rect", { x: CX - RW / 2, y: 54, width: RW, height: RH, rx: 1.5, "class": "dd-res" }, g);
    text(g, CX + 18, 82, "R");
    line(g, CX, 54 + RH, CX, 116);

    var tapAt = {};
    p.taps.forEach(function (t) { tapAt[t.node] = t.name; });
    var y = 116, par = 0;
    p.levels.forEach(function (lv, k) {
      if (tapAt[k] !== undefined) { tap(g, y, tapAt[k]); s("circle", { cx: CX, cy: y, r: 3.2, "class": "dd-dot" }, g); }
      y = lv.length > 1 ? drawParallel(g, y, lv, nodeName(par++)) : drawSingle(g, y, lv[0]);
    });
    line(g, CX, y, CX, y + 10);
    [[16, 0], [10, 6], [4, 12]].forEach(function (a) { line(g, CX - a[0], y + 10 + a[1], CX + a[0], y + 10 + a[1]); });

    var lx = 22;
    line(g, lx, 36, lx, y + 4, "dd-loop");
    s("path", { d: "M" + (lx - 5) + " " + (y - 4) + "L" + (lx + 5) + " " + (y - 4) + "L" + lx + " " + (y + 6) + "Z", "class": "dd-loop-h" }, g);
    s("circle", { cx: lx, cy: (36 + y) / 2, r: 10, "class": "dd-loop-c" }, g);
    text(g, lx, (36 + y) / 2 + 5, "1", "middle", "dd-loop-t");
    return svg;
  }

  root.DIODE_SVG = { draw: draw, nodeName: nodeName };
})(typeof window !== "undefined" ? window : globalThis);
