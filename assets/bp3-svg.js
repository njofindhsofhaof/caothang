/* Ve so do mach 3 pha cho trang /baitap3pha: nguon A, B, C (N), day dan (co the co Z_d), tai noi Y hoac Δ.
   Dung lop CSS .kh-svg trong kirchhoff.css nen xem duoc ca nen sang va toi. */
(function (root) {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var X0 = 40, BOX_L = 46, BOX_W = 16;

  function s(tag, attrs, parent) {
    var node = document.createElementNS(NS, tag);
    Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(node);
    return node;
  }

  /** Chu co chi so duoi: "I_d" -> I<tspan>d</tspan>. */
  function text(g, x, y, str, anchor, cls) {
    var t = s("text", { x: x, y: y, "text-anchor": anchor || "middle", "class": cls || "kh-t" }, g);
    str.split(/_([0-9A-Za-z]+)/).forEach(function (part, i) {
      if (!part) return;
      if (i % 2) s("tspan", { dy: 4, "font-size": "10" }, t).textContent = part;
      else (i ? s("tspan", { dy: -4 }, t) : t).appendChild(document.createTextNode(part));
    });
  }

  function wire(g, pts) {
    s("path", { d: "M " + pts.map(function (p) { return p.join(" "); }).join(" L "), "class": "kh-w" }, g);
  }

  /** Tro khang (hinh chu nhat) tam (x, y), quay theo goc deg. */
  function box(g, x, y, deg) {
    s("rect", {
      x: x - BOX_L / 2, y: y - BOX_W / 2, width: BOX_L, height: BOX_W, rx: 2, "class": "kh-src",
      transform: "rotate(" + deg + " " + x + " " + y + ")"
    }, g);
  }

  /** Mui ten dong dien tai (x, y), chi theo goc deg (0 = sang phai, 90 = xuong). */
  function arrow(g, x, y, deg) {
    s("path", { d: "M 6 0 L -5 5 L -5 -5 Z", "class": "kh-arrow", transform: "translate(" + x + " " + y + ") rotate(" + deg + ")" }, g);
  }

  function dot(g, x, y) { s("circle", { cx: x, cy: y, r: 3.5, "class": "kh-dot" }, g); }

  /* Toa do 3 day: Y co them day trung tinh N. */
  var ROWS = { Y: { A: 50, B: 150, C: 250, N: 300 }, D: { A: 50, B: 150, C: 290 } };

  function drawSource(g, p, rows) {
    Object.keys(rows).forEach(function (name) {
      dot(g, X0, rows[name]);
      text(g, X0 - 10, rows[name] + 5, name, "end", "kh-node");
    });
    s("path", { d: "M 84 " + (rows.A + 6) + " L 84 " + (rows.B - 8), "class": "kh-w" }, g);
    arrow(g, 84, rows.B - 8, 90);
    text(g, 92, (rows.A + rows.B) / 2 + 5, "U_d", "start", "kh-cur");
    if (p.Rd || p.Xd) {
      ["A", "B", "C"].forEach(function (name) { box(g, 170, rows[name], 0); });
      text(g, 170, rows.A - 16, "Z_d");
    }
    arrow(g, 260, rows.A, 0);
    text(g, 260, rows.A - 10, "I_d", "middle", "kh-cur");
  }

  function drawStar(g, rows) {
    var ox = 440, oy = rows.B;
    wire(g, [[X0, rows.A], [ox, rows.A], [ox, oy]]);
    wire(g, [[X0, rows.B], [ox, oy]]);
    wire(g, [[X0, rows.C], [ox, rows.C], [ox, oy]]);
    wire(g, [[ox, oy], [520, oy], [520, rows.N], [X0, rows.N]]);
    box(g, ox, (rows.A + oy) / 2, 90);
    box(g, 370, oy, 0);
    box(g, ox, (rows.C + oy) / 2, 90);
    text(g, ox + 14, (rows.A + oy) / 2 + 5, "Z_p", "start");
    text(g, 370, oy - 14, "Z_p");
    text(g, ox + 14, (rows.C + oy) / 2 + 5, "Z_p", "start");
    arrow(g, ox, rows.A + 20, 90);
    text(g, ox - 10, rows.A + 25, "I_p", "end", "kh-cur");
    dot(g, ox, oy);
    text(g, ox + 8, oy - 8, "O", "start", "kh-node");
  }

  function drawDelta(g, rows) {
    var p1 = [440, rows.A], p2 = [370, 250], p3 = [510, 250];
    wire(g, [[X0, rows.A], p1]);
    wire(g, [[X0, rows.B], [p2[0], rows.B], p2]);
    wire(g, [[X0, rows.C], [p3[0], rows.C], p3]);
    wire(g, [p1, p2, p3, p1]);
    [[p1, p2], [p1, p3], [p2, p3]].forEach(function (e) {
      var mx = (e[0][0] + e[1][0]) / 2, my = (e[0][1] + e[1][1]) / 2;
      var deg = Math.atan2(e[1][1] - e[0][1], e[1][0] - e[0][0]) * 180 / Math.PI;
      box(g, mx, my, deg);
    });
    text(g, 414, 180, "Z_p", "start");
    text(g, 498, 150, "Z_p", "start");
    text(g, 440, 280, "Z_p");
    var ax = p1[0] + (p3[0] - p1[0]) * 0.18, ay = p1[1] + (p3[1] - p1[1]) * 0.18;
    arrow(g, ax, ay, Math.atan2(p3[1] - p1[1], p3[0] - p1[0]) * 180 / Math.PI);
    text(g, ax + 10, ay, "I_p", "start", "kh-cur");
    [p1, p2, p3].forEach(function (pt) { dot(g, pt[0], pt[1]); });
  }

  /** @param {{id:(number|string), conn:string, Rd?:number, Xd?:number}} p @returns {SVGSVGElement} */
  function draw(p) {
    var rows = ROWS[p.conn === "D" ? "D" : "Y"];
    var svg = s("svg", {
      viewBox: "0 0 560 320", "class": "kh-svg bp3-svg", role: "img",
      "aria-label": "Sơ đồ tải 3 pha nối " + (p.conn === "D" ? "tam giác" : "sao") + ((p.Rd || p.Xd) ? " có tổng trở đường dây" : "")
    });
    var g = s("g", {}, svg);
    if (p.conn === "D") drawDelta(g, rows); else drawStar(g, rows);
    drawSource(g, p, rows);
    return svg;
  }

  root.BP3_SVG = { draw: draw };
})(window);
