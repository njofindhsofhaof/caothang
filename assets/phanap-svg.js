/* Ve so do mach phan ap dang doc (VCC tren, Mass duoi) giong hinh trong vo: dien tro chu nhat IEC,
   cum song song re nhanh ngang, diem do V_O keo ra ben phai. Dung boi assets/phanap.js. */
(function (root) {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var CX = 200, GAP = 84, RW = 18, RH = 46, TAP_X = 372;
  var RIGHT = TAP_X + 48;
  var C = root.PA_CALC;

  function s(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(n);
    return n;
  }

  function line(g, x1, y1, x2, y2, cls) {
    return s("line", { x1: x1, y1: y1, x2: x2, y2: y2, "class": cls || "pa-wire" }, g);
  }

  /** Chu co chi so duoi: main + sub (+ rest), vd "R"+"4", "V"+"O1". */
  function label(g, x, y, main, sub, rest, anchor, cls) {
    var t = s("text", { x: x, y: y, "text-anchor": anchor || "start", "class": cls || "" }, g);
    t.appendChild(document.createTextNode(main));
    if (sub) {
      var ts = s("tspan", { dy: 4, "class": "pa-sub" }, t);
      ts.textContent = sub;
    }
    if (rest) {
      var tr = s("tspan", { dy: sub ? -4 : 0 }, t);
      tr.textContent = rest;
    }
    return t;
  }

  function nameLabel(g, x, y, name, value, anchor) {
    label(g, x, y, name.charAt(0), name.slice(1), "", anchor);
    var v = s("text", { x: x, y: y + 16, "text-anchor": anchor, "class": "pa-val" }, g);
    v.textContent = C.fmtOhm(value);
  }

  function arrowDown(g, x, y, cls) {
    s("path", { d: "M" + (x - 5) + " " + (y - 8) + "L" + (x + 5) + " " + (y - 8) + "L" + x + " " + y + "Z", "class": cls }, g);
  }

  function resistor(g, x, top) {
    s("rect", { x: x - RW / 2, y: top, width: RW, height: RH, rx: 1.5, "class": "pa-res" }, g);
  }

  function dot(g, x, y) { s("circle", { cx: x, cy: y, r: 3.2, "class": "pa-dot" }, g); }

  function drawSingle(g, y, name, value) {
    line(g, CX, y, CX, y + 12);
    resistor(g, CX, y + 12);
    line(g, CX, y + 12 + RH, CX, y + 72);
    nameLabel(g, CX - 20, y + 31, name, value, "end");
    return y + 72;
  }

  function drawParallel(g, y, names, values, group) {
    var n = names.length;
    var xs = names.map(function (_, i) { return CX + (i - (n - 1) / 2) * GAP; });
    var top = y + 14, bot = y + 104;
    line(g, CX, y, CX, top);
    line(g, xs[0], top, xs[n - 1], top);
    line(g, xs[0], bot, xs[n - 1], bot);
    line(g, CX, bot, CX, y + 118);
    dot(g, CX, top);
    dot(g, CX, bot);
    names.forEach(function (name, i) {
      var x = xs[i];
      line(g, x, top, x, top + 26);
      resistor(g, x, top + 26);
      line(g, x, top + 26 + RH, x, bot);
      arrowDown(g, x, top + 20, "pa-cur");
      label(g, x - 8, top + 18, "I", name.slice(1), "", "end", "pa-cur-label");
      nameLabel(g, x + 15, top + 45, name, values[name], "start");
    });
    if (group) label(g, xs[0] - 18, top + 53, "Cụm " + group, "", "", "end", "pa-group");
    return y + 118;
  }

  function drawGround(g, y) {
    line(g, CX, y, CX, y + 16);
    line(g, CX - 20, y + 16, CX + 20, y + 16);
    line(g, CX - 13, y + 23, CX + 13, y + 23);
    line(g, CX - 6, y + 30, CX + 6, y + 30);
  }

  function drawTap(g, y, name) {
    dot(g, CX, y);
    line(g, CX, y, TAP_X - 4, y, "pa-tap");
    s("circle", { cx: TAP_X, cy: y, r: 4, "class": "pa-term" }, g);
    label(g, TAP_X + 10, y + 5, "V", name, "", "start", "pa-tap-label");
  }

  /** @param {object} p bai tap tu PA_PROBLEMS @returns {SVGSVGElement} */
  function draw(p) {
    var svg = s("svg", { "class": "pa-svg", role: "img", "aria-label": "Sơ đồ mạch bài " + p.id });
    var g = s("g", {}, svg);
    var taps = s("g", {}, svg);

    s("path", { d: "M" + (CX - 7) + " 24L" + CX + " 12L" + (CX + 7) + " 24", "class": "pa-wire" }, g);
    line(g, CX, 12, CX, 50);
    label(g, CX + 14, 24, "V", "CC", " = " + p.vcc + " V", "start", "pa-vcc");
    arrowDown(g, CX, 42, "pa-cur");
    label(g, CX - 12, 42, "I", "", "", "end", "pa-cur-label");

    var y = 50;
    var nodeY = [];
    var left = CX - 80;
    p.stages.forEach(function (names, k) {
      nodeY[k] = y;
      var group = p.groups && p.groups[k];
      if (names.length > 1) left = Math.min(left, CX - (names.length - 1) / 2 * GAP - (group ? 66 : 34));
      y = names.length === 1
        ? drawSingle(g, y, names[0], p.values[names[0]])
        : drawParallel(g, y, names, p.values, group);
    });
    drawGround(g, y);
    p.taps.forEach(function (t) { drawTap(taps, nodeY[t.node], t.name); });

    var h = y + 40, w = RIGHT - left;
    svg.setAttribute("viewBox", left + " 0 " + w + " " + h);
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);
    return svg;
  }

  root.PA_SVG = { draw: draw };
})(window);
