/* Ve 4 so do co dinh cua de on Do luong dien (giu nguyen hinh trong giao trinh, khong ghi so lieu len hinh):
   shuntSep = hinh 3.5, shuntUni = hinh 3.6, multSep = hinh 3.17, multUni = hinh 3.18. Dung lai class kh-* cua kirchhoff.css. */
(function (root) {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var HALF = 24, G_R = 16;

  function s(tag, attrs, parent) {
    var node = document.createElementNS(NS, tag);
    Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(node);
    return node;
  }

  /** "R_g" -> R + chi so g (tspan). */
  function label(g, x, y, str, anchor, cls) {
    var t = s("text", { x: x, y: y, "text-anchor": anchor || "middle", "class": cls || "kh-t" }, g);
    var m = /^(.*?)_(.+)$/.exec(str);
    if (!m) { t.textContent = str; return; }
    t.appendChild(document.createTextNode(m[1]));
    s("tspan", { dy: 4, "font-size": 10 }, t).textContent = m[2];
  }

  function wire(g, pts) {
    s("path", { d: "M " + pts.map(function (p) { return p.join(" "); }).join(" L "), "class": "kh-w" }, g);
  }

  function zigzag(len) {
    var pts = ["M " + -len + " 0", "L " + (-len + 6) + " 0"], step = (2 * len - 12) / 6;
    for (var i = 0; i < 6; i++) pts.push("L " + (-len + 6 + step * (i + 0.5)) + " " + (i % 2 ? 6 : -6));
    pts.push("L " + (len - 6) + " 0", "L " + len + " 0");
    return pts.join(" ");
  }

  function resistor(g, x, y, name) {
    s("rect", { x: x - HALF, y: y - 9, width: 2 * HALF, height: 18, "class": "kh-mask" }, g);
    s("path", { d: zigzag(HALF), "class": "kh-w", transform: "translate(" + x + " " + y + ")" }, g);
    label(g, x, y - 14, name);
  }

  function head(g, x, y, ang) {
    var c = Math.cos(ang), sn = Math.sin(ang), back = 9, w = 4.5;
    var bx = x - back * c, by = y - back * sn;
    s("path", { d: "M " + x + " " + y + " L " + (bx - w * sn) + " " + (by + w * c) + " L " + (bx + w * sn) + " " + (by - w * c) + " Z", "class": "kh-arrow" }, g);
  }

  function galvo(g, x, y) {
    s("circle", { cx: x, cy: y, r: G_R, "class": "kh-src" }, g);
    s("path", { d: "M " + (x - 8) + " " + (y + 8) + " L " + (x + 6) + " " + (y - 6), "class": "kh-w" }, g);
    head(g, x + 9, y - 9, -Math.PI / 4);
    label(g, x, y - 24, "G");
    label(g, x - 26, y - 10, "+", "middle", "kh-pm");
    label(g, x + 26, y - 10, "−", "middle", "kh-pm");
  }

  function dot(g, x, y) { s("circle", { cx: x, cy: y, r: 3.5, "class": "kh-dot" }, g); }
  function terminal(g, x, y) { s("circle", { cx: x, cy: y, r: 4.5, "class": "dld-term" }, g); }

  function contact(g, x, y, name, lx, ly) {
    s("circle", { cx: x, cy: y, r: 4, "class": "dld-term" }, g);
    label(g, x + lx, y + ly, name, "middle", "kh-node");
  }

  function blade(g, px, py, tx, ty) {
    wire(g, [[px, py], [tx, ty]]);
    head(g, tx, ty, Math.atan2(ty - py, tx - px));
    terminal(g, px, py);
  }

  function current(g, x, y) { head(g, x, y - 6, -Math.PI / 2); label(g, x - 10, y + 2, "I_g", "end", "kh-cur"); }

  function voltage(g, x1, x2, y) {
    s("path", { d: "M " + (x1 + 10) + " " + y + " L " + (x2 - 10) + " " + y, "class": "dld-dash" }, g);
    head(g, x1 + 9, y, Math.PI);
    head(g, x2 - 9, y, 0);
    var mid = (x1 + x2) / 2;
    s("rect", { x: mid - 14, y: y - 11, width: 28, height: 22, "class": "kh-mask" }, g);
    label(g, mid, y + 5, "U");
  }

  var FIGS = {
    shuntSep: { size: [480, 250], draw: function (g) {
      wire(g, [[20, 165], [130, 165]]);
      wire(g, [[70, 165], [70, 40], [410, 40], [410, 165]]);
      [105, 165, 225].forEach(function (y) { wire(g, [[190, y], [340, y]]); });
      wire(g, [[340, 105], [340, 225]]);
      wire(g, [[340, 165], [460, 165]]);
      resistor(g, 160, 40, "R_g"); galvo(g, 260, 40);
      resistor(g, 265, 105, "R₁"); resistor(g, 265, 165, "R₂"); resistor(g, 265, 225, "R₃");
      current(g, 70, 108);
      [[70, 165], [340, 165], [410, 165]].forEach(function (p) { dot(g, p[0], p[1]); });
      contact(g, 190, 105, "A", -14, -8); contact(g, 190, 165, "B", -2, -12); contact(g, 190, 225, "C", -14, -8);
      blade(g, 130, 165, 184, 112);
      label(g, 150, 128, "S", "middle", "kh-node");
      terminal(g, 20, 165); terminal(g, 460, 165);
    } },
    shuntUni: { size: [520, 250], draw: function (g) {
      wire(g, [[20, 110], [340, 110]]);
      wire(g, [[60, 110], [60, 40], [340, 40], [340, 150], [396, 150]]);
      wire(g, [[260, 110], [260, 185], [396, 185]]);
      wire(g, [[160, 110], [160, 220], [396, 220]]);
      wire(g, [[450, 200], [500, 200]]);
      resistor(g, 130, 40, "R_g"); galvo(g, 230, 40);
      resistor(g, 110, 110, "R₁"); resistor(g, 210, 110, "R₂"); resistor(g, 300, 110, "R₃");
      current(g, 60, 80);
      [[60, 110], [160, 110], [260, 110], [340, 110]].forEach(function (p) { dot(g, p[0], p[1]); });
      contact(g, 400, 150, "A", -14, -8); contact(g, 400, 185, "B", -14, -8); contact(g, 400, 220, "C", -14, -8);
      blade(g, 450, 200, 407, 156);
      label(g, 452, 168, "S", "middle", "kh-node");
      terminal(g, 20, 110); terminal(g, 500, 200);
    } },
    multSep: { size: [520, 270], draw: function (g) {
      wire(g, [[30, 235], [30, 60], [386, 60]]);
      wire(g, [[240, 60], [240, 170], [386, 170]]);
      wire(g, [[240, 115], [386, 115]]);
      wire(g, [[450, 95], [490, 95], [490, 235]]);
      resistor(g, 100, 60, "R_g"); galvo(g, 175, 60);
      resistor(g, 315, 60, "R₁"); resistor(g, 315, 115, "R₂"); resistor(g, 315, 170, "R₃");
      current(g, 30, 150);
      dot(g, 240, 60); dot(g, 240, 115);
      contact(g, 390, 60, "A", 0, -12); contact(g, 390, 115, "B", 14, 18); contact(g, 390, 170, "C", 14, 18);
      blade(g, 450, 95, 397, 65);
      label(g, 462, 72, "S", "middle", "kh-node");
      voltage(g, 30, 490, 235);
      terminal(g, 30, 235); terminal(g, 490, 235);
    } },
    multUni: { size: [560, 270], draw: function (g) {
      wire(g, [[30, 235], [30, 60], [490, 60], [490, 111]]);
      wire(g, [[290, 60], [290, 111]]);
      wire(g, [[390, 60], [390, 111]]);
      wire(g, [[420, 185], [530, 185], [530, 235]]);
      resistor(g, 95, 60, "R_g"); galvo(g, 165, 60);
      resistor(g, 240, 60, "R₁"); resistor(g, 340, 60, "R₂"); resistor(g, 440, 60, "R₃");
      current(g, 30, 150);
      dot(g, 290, 60); dot(g, 390, 60);
      contact(g, 290, 115, "A", -14, 10); contact(g, 390, 115, "B", 14, 10); contact(g, 490, 115, "C", 14, 10);
      blade(g, 420, 185, 296, 121);
      label(g, 372, 172, "S", "middle", "kh-node");
      voltage(g, 30, 530, 235);
      terminal(g, 30, 235); terminal(g, 530, 235);
    } }
  };

  /** @param {"shuntSep"|"shuntUni"|"multSep"|"multUni"} name @param {string} caption @returns {SVGSVGElement} */
  function draw(name, caption) {
    var fig = FIGS[name];
    var svg = s("svg", { viewBox: "0 0 " + fig.size[0] + " " + fig.size[1], "class": "kh-svg", role: "img", "aria-label": caption });
    fig.draw(s("g", {}, svg));
    return svg;
  }

  root.DLD_SVG = { draw: draw };
})(window);
