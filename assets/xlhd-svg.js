/* Ve so do mach xac lap dieu hoa: nguon ben trai, doan noi tiep tren day tren, cac nhanh song song dung doc.
   R ve rang cua, L ve cuon, C ve 2 ban cuc giong hinh trong de; mach da phuc hoa ve toan bo bang ky hieu dien tro. Dung boi assets/xlhd.js. */
(function (root) {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var TOP = 40, BOT = 240, SRC_X = 40, SRC_R = 22, HALF = 30;
  var MID = (TOP + BOT) / 2;

  var SHAPES = {
    R: "M-30 0L-18 0l3 -7l6 14l6 -14l6 14l6 -14l6 14l3 -7L30 0",
    L: "M-30 0L-20 0a5 5 0 0 1 10 0a5 5 0 0 1 10 0a5 5 0 0 1 10 0a5 5 0 0 1 10 0L30 0",
    C: "M-30 0L-4 0M-4 -13L-4 13M4 -13L4 13M4 0L30 0"
  };

  function s(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(n);
    return n;
  }

  function wire(g, x1, y1, x2, y2) {
    s("line", { x1: x1, y1: y1, x2: x2, y2: y2, "class": "xl-wire" }, g);
  }

  /** "I_1" -> I + chi so 1; text thuong giu nguyen. */
  function label(g, x, y, text, anchor, cls) {
    var t = s("text", { x: x, y: y, "text-anchor": anchor || "start", "class": cls || "" }, g);
    var m = /^([A-Za-z]+)_(\w+)$/.exec(text);
    if (!m) { t.textContent = text; return t; }
    t.appendChild(document.createTextNode(m[1]));
    s("tspan", { dy: 4, "class": "xl-sub" }, t).textContent = m[2];
    return t;
  }

  function dot(g, x, y) { s("circle", { cx: x, cy: y, r: 3.2, "class": "xl-dot" }, g); }

  /** Mach da phuc hoa: moi phan tu ve bang ky hieu dien tro, ghi gia tri tong tro. */
  function element(g, el, x, y, vertical, complex) {
    s("path", {
      d: SHAPES[complex ? "R" : el.kind], "class": "xl-wire",
      transform: "translate(" + x + " " + y + ")" + (vertical ? " rotate(90)" : "")
    }, g);
  }

  function arrow(g, x, y, dir) {
    var d = dir === "down"
      ? "M" + (x - 5) + " " + (y - 9) + "L" + (x + 5) + " " + (y - 9) + "L" + x + " " + y + "Z"
      : "M" + (x - 9) + " " + (y - 5) + "L" + (x - 9) + " " + (y + 5) + "L" + x + " " + y + "Z";
    s("path", { d: d, "class": "xl-cur" }, g);
  }

  function drawSource(g, src, complex) {
    wire(g, SRC_X, TOP, SRC_X, MID - SRC_R);
    wire(g, SRC_X, MID + SRC_R, SRC_X, BOT);
    s("circle", { cx: SRC_X, cy: MID, r: SRC_R, "class": "xl-src" }, g);
    if (src.symbol === "arrow") {
      wire(g, SRC_X, MID + 12, SRC_X, MID - 6);
      s("path", { d: "M" + (SRC_X - 6) + " " + (MID - 4) + "L" + (SRC_X + 6) + " " + (MID - 4) + "L" + SRC_X + " " + (MID - 14) + "Z", "class": "xl-ink" }, g);
    } else if (src.symbol === "pm") {
      label(g, SRC_X, MID - 3, "+", "middle", "xl-pm");
      label(g, SRC_X, MID + 15, "−", "middle", "xl-pm");
    } else {
      s("path", { d: "M" + (SRC_X - 12) + " " + MID + "c4 -12 8 -12 12 0s8 12 12 0", "class": "xl-wire" }, g);
      label(g, SRC_X + 16, MID - SRC_R - 4, "+", "start", "xl-pm");
      label(g, SRC_X + 16, MID + SRC_R + 14, "−", "start", "xl-pm");
    }
    label(g, SRC_X - SRC_R - 8, MID + 5, complex && src.complexLabel ? src.complexLabel : src.label, "end", "xl-src-label");
  }

  /** @param {object} p bai tu XL_PROBLEMS @param {boolean} [complex] ve mach da phuc hoa @returns {SVGSVGElement} */
  function draw(p, complex) {
    var svg = s("svg", {
      "class": "xl-svg", role: "img",
      "aria-label": (complex ? "Mạch đã phức hoá bài " : "Sơ đồ mạch bài ") + p.id
    });
    var g = s("g", {}, svg);
    var text = function (el) { return complex && el.complexLabel ? el.complexLabel : el.label; };

    drawSource(g, p.source, complex);

    var x = SRC_X;
    (p.series || []).forEach(function (el, i) {
      var cxp = SRC_X + 110 + i * 110;
      wire(g, x, TOP, cxp - HALF, TOP);
      element(g, el, cxp, TOP, false, complex);
      label(g, cxp, TOP - 14, text(el), "middle", "xl-val");
      x = cxp + HALF;
    });
    if (p.totalLabel) {
      arrow(g, SRC_X + 48, TOP, "right");
      label(g, SRC_X + 40, TOP - 12, p.totalLabel, "middle", "xl-cur-label");
    }

    var first = p.series && p.series.length ? x + 70 : SRC_X + 150;
    var xs = p.branches.map(function (_, k) { return first + k * 160; });
    var last = xs[xs.length - 1];
    wire(g, x, TOP, last, TOP);
    wire(g, SRC_X, BOT, last, BOT);

    var nodePos = {};
    p.branches.forEach(function (b, k) {
      var bx = xs[k];
      var n = b.elems.length;
      var ys = b.elems.map(function (_, i) { return TOP + (BOT - TOP) * (i + 1) / (n + 1); });
      var y = TOP;
      b.elems.forEach(function (el, i) {
        wire(g, bx, y, bx, ys[i] - HALF);
        element(g, el, bx, ys[i], true, complex);
        label(g, bx + 18, ys[i] + 5, text(el), "start", "xl-val");
        if (el.mark) {
          label(g, bx - 12, ys[i] - 14, "+", "end", "xl-mark");
          label(g, bx - 12, ys[i] + 26, "−", "end", "xl-mark");
          label(g, bx - 20, ys[i] + 6, el.mark, "end", "xl-mark");
        }
        y = ys[i] + HALF;
      });
      wire(g, bx, y, bx, BOT);
      Object.keys(b.nodes || {}).forEach(function (i) {
        var ny = (ys[+i] + ys[+i + 1]) / 2;
        dot(g, bx, ny);
        var outer = k === 0 ? -10 : 10;
        label(g, bx + outer, ny + 5, b.nodes[i], outer < 0 ? "end" : "start", "xl-node");
        nodePos[k + ":" + i] = { x: bx, y: ny };
      });
      if (b.current) {
        arrow(g, bx, TOP + 22, "down");
        label(g, bx - 8, TOP + 20, b.current, "end", "xl-cur-label");
      }
      if (k < xs.length - 1) { dot(g, bx, TOP); dot(g, bx, BOT); }
    });

    label(g, xs[0], TOP - 8, "A", "middle", "xl-node");
    label(g, xs[0], BOT + 18, "B", "middle", "xl-node");

    if (p.diff) {
      var a = nodePos[p.diff.from.join(":")], b = nodePos[p.diff.to.join(":")];
      var parts = p.diff.name.split("_");
      var t = label(g, (a.x + b.x) / 2, a.y + 5, "+ " + parts[0], "middle", "xl-mark");
      s("tspan", { dy: 4, "class": "xl-sub" }, t).textContent = parts[1];
      s("tspan", { dy: -4 }, t).textContent = " −";
    }

    var left = SRC_X - SRC_R - 120, w = last + 90 - left, h = BOT + 30;
    svg.setAttribute("viewBox", left + " 0 " + w + " " + h);
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);
    return svg;
  }

  root.XL_SVG = { draw: draw };
})(window);
