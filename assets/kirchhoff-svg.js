/* Ve so do mach DC cho bai giai mau Kirchhoff tu danh sach lenh p.draw (xem assets/kirchhoff-worked.js).
   Day ve truoc, phan tu ve sau co nen che day nen khong can cat day. */
(function (root) {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var HALF = 24, SRC_R = 18;

  function s(tag, attrs, parent) {
    var node = document.createElementNS(NS, tag);
    Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(node);
    return node;
  }

  function text(g, x, y, str, anchor, cls) {
    s("text", { x: x, y: y, "text-anchor": anchor || "middle", "class": cls || "kh-t" }, g).textContent = str;
  }

  function zigzag(len) {
    var pts = ["M " + -len + " 0", "L " + (-len + 6) + " 0"], step = (2 * len - 12) / 6;
    for (var i = 0; i < 6; i++) pts.push("L " + (-len + 6 + step * (i + 0.5)) + " " + (i % 2 ? 6 : -6));
    pts.push("L " + (len - 6) + " 0", "L " + len + " 0");
    return pts.join(" ");
  }

  var DRAW = {
    w: function (g, x1, y1, x2, y2) { s("path", { d: "M " + x1 + " " + y1 + " L " + x2 + " " + y2, "class": "kh-w" }, g); },
    r: function (g, x, y, dir, label) {
      var v = dir === "v";
      s("rect", { x: v ? x - 9 : x - HALF, y: v ? y - HALF : y - 9, width: v ? 18 : 2 * HALF, height: v ? 2 * HALF : 18, "class": "kh-mask" }, g);
      s("path", { d: zigzag(HALF), "class": "kh-w", transform: "translate(" + x + " " + y + ")" + (v ? " rotate(90)" : "") }, g);
      if (v) text(g, x + 14, y + 5, label, "start");
      else text(g, x, y - 14, label);
    },
    i: function (g, x, y, label) {
      s("circle", { cx: x, cy: y, r: SRC_R, "class": "kh-src" }, g);
      s("path", { d: "M " + x + " " + (y + 11) + " L " + x + " " + (y - 9) + " M " + (x - 5) + " " + (y - 3) + " L " + x + " " + (y - 10) + " L " + (x + 5) + " " + (y - 3), "class": "kh-w" }, g);
      text(g, x + SRC_R + 6, y + 5, label, "start");
    },
    v: function (g, x, y, label) {
      s("circle", { cx: x, cy: y, r: SRC_R, "class": "kh-src" }, g);
      text(g, x, y - 3, "+", "middle", "kh-pm");
      text(g, x, y + 13, "−", "middle", "kh-pm");
      text(g, x + SRC_R + 6, y + 5, label, "start");
    },
    a: function (g, x, y, dir, label) {
      var d = { r: [1, 0], l: [-1, 0], d: [0, 1], u: [0, -1] }[dir], px = -d[1], py = d[0];
      var tip = [x + 5 * d[0], y + 5 * d[1]];
      s("path", {
        d: "M " + tip.join(" ") + " L " + (x - 5 * d[0] + 5 * px) + " " + (y - 5 * d[1] + 5 * py) +
          " L " + (x - 5 * d[0] - 5 * px) + " " + (y - 5 * d[1] - 5 * py) + " Z", "class": "kh-arrow"
      }, g);
      if (d[1]) text(g, x - 10, y + 5, label, "end", "kh-cur");
      else text(g, x, y + 20, label, "middle", "kh-cur");
    },
    n: function (g, x, y, name) {
      s("circle", { cx: x, cy: y, r: 3.5, "class": "kh-dot" }, g);
      text(g, x + 6, y < 130 ? y - 8 : y + 18, name, "start", "kh-node");
    },
    k: function (g, cx, cy, name) {
      var r = 22;
      s("path", { d: "M " + (cx - r) + " " + cy + " A " + r + " " + r + " 0 1 1 " + cx + " " + (cy + r), "class": "kh-loop" }, g);
      s("path", { d: "M " + (cx + 6) + " " + (cy + r - 6) + " L " + cx + " " + (cy + r) + " L " + (cx + 6) + " " + (cy + r + 6), "class": "kh-loop" }, g);
      text(g, cx, cy + 5, name, "middle", "kh-loop-t");
    }
  };

  /** @param {{id:string, size:number[], draw:Array[]}} p @returns {SVGSVGElement} */
  function draw(p) {
    var svg = s("svg", {
      viewBox: "0 0 " + p.size[0] + " " + p.size[1], "class": "kh-svg", role: "img", "aria-label": "Sơ đồ mạch bài " + p.id
    });
    var g = s("g", {}, svg);
    p.draw.forEach(function (cmd) { DRAW[cmd[0]].apply(null, [g].concat(cmd.slice(1))); });
    return svg;
  }

  root.KH_SVG = { draw: draw };
})(window);
