/* Hinh cho trang /dekiemtradientucoban: mach chinh luu ban ky (duong/am) + dang song vao/ra,
   dien tro vong mau, tu ghi ma, dien tro dan SMD. Dung lai lop dd-* (assets/diode.css), bj-axis (assets/bjt.css),
   bo sung trong assets/dkt.css. Cac mach con lai ve bang PA_SVG, DIODE_SVG, ZENER_SVG, BJT_SVG. Dung boi assets/dkt.js. */
(function (root) {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var BAND_FILL = {
    "Đen": "#1b1b1b", "Nâu": "#7a4a22", "Đỏ": "#d1342f", "Cam": "#f08a24", "Vàng": "#f4d03f",
    "Xanh lục": "#2e9e4f", "Xanh lam": "#2d6cdf", "Tím": "#8e44ad", "Xám": "#8c8c8c", "Trắng": "#f7f7f7",
    "Vàng kim": "#c9a227", "Bạc": "#c0c0c0"
  };

  function s(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(n);
    return n;
  }
  function svgRoot(w, h, aria, cls) {
    return s("svg", { viewBox: "0 0 " + w + " " + h, "class": "dd-svg " + (cls || ""), role: "img", "aria-label": aria });
  }
  function line(g, x1, y1, x2, y2, cls) { return s("line", { x1: x1, y1: y1, x2: x2, y2: y2, "class": cls || "dd-wire" }, g); }
  function label(g, x, y, main, sub, anchor, cls) {
    var t = s("text", { x: x, y: y, "text-anchor": anchor || "start", "class": cls || "" }, g);
    t.appendChild(document.createTextNode(main));
    if (sub) { var ts = s("tspan", { dy: 4, "class": "dd-sub" }, t); ts.textContent = sub; }
    return t;
  }
  function num(x) { return String(Math.round(x * 100) / 100).replace(".", ",").replace("-", "−"); }

  /** Diode nam ngang chiem [x, x+36] tren day y; right = true: tam giac chi sang phai (anode ben trai). */
  function diodeH(g, x, y, right) {
    line(g, x, y, x + 6, y); line(g, x + 30, y, x + 36, y);
    var tri = right
      ? "M" + (x + 6) + " " + (y - 11) + "L" + (x + 6) + " " + (y + 11) + "L" + (x + 30) + " " + y + "Z"
      : "M" + (x + 30) + " " + (y - 11) + "L" + (x + 30) + " " + (y + 11) + "L" + (x + 6) + " " + y + "Z";
    s("path", { d: tri, "class": "dd-sym" }, g);
    var bx = right ? x + 30 : x + 6;
    line(g, bx, y - 12, bx, y + 12, "dd-bar");
  }

  /** Cuon day: 4 vong ban nguyet doc tu y0 xuong, phinh ve phia dir (+1 phai, -1 trai). */
  function coil(g, x, y0, dir) {
    var d = "M" + x + " " + y0;
    for (var k = 0; k < 4; k++) d += " a12 12 0 0 " + (dir > 0 ? 1 : 0) + " 0 24";
    s("path", { d: d, "class": "dd-wire" }, g);
  }

  /** Mach chinh luu ban ky dung bien ap: pol "+" diode thuan chieu ra tai, "-" diode lap nguoc. */
  function rectCircuit(pol) {
    var neg = pol === "-";
    var svg = svgRoot(520, 230, "Mạch chỉnh lưu bán kỳ " + (neg ? "âm" : "dương") + ": biến áp 220 V 50 Hz, cuộn thứ cấp cho V_i, diode D " +
      (neg ? "lắp ngược (cathode quay về biến áp)" : "lắp thuận (anode nối biến áp)") + " nối tiếp tải R_L, V_O lấy trên R_L");
    var g = s("g", {}, svg);
    var top = 50, bot = 182, xp = 70, xs = 150, xd = 230, xr = 380, xo = 450;
    // So cap
    line(g, 24, top + 18, xp, top + 18); line(g, 24, top + 114, xp, top + 114);
    coil(g, xp, top + 18, 1);
    s("circle", { cx: 24, cy: top + 18, r: 4, "class": "dd-term" }, g); s("circle", { cx: 24, cy: top + 114, r: 4, "class": "dd-term" }, g);
    label(g, 20, top + 50, "220 V", "", "start", "dd-val"); label(g, 20, top + 88, "50 Hz", "", "start", "dd-val");
    line(g, xp + 37, top + 10, xp + 37, top + 122); line(g, xp + 43, top + 10, xp + 43, top + 122);
    label(g, xp + 40, top + 2, "MBA", "", "middle", "dd-val");
    // Thu cap
    coil(g, xs, top + 18, -1);
    line(g, xs, top, xs, top + 18); line(g, xs, top + 114, xs, bot);
    label(g, xs + 14, top + 72, "V", "i", "start");
    // Day tren: diode
    line(g, xs, top, xd, top); diodeH(g, xd, top, !neg); line(g, xd + 36, top, xr, top);
    label(g, xd + 18, top - 18, "D", "", "middle");
    // Tai
    line(g, xr, top, xr, 90); s("rect", { x: xr - 9, y: 90, width: 18, height: 52, rx: 1.5, "class": "dd-res" }, g); line(g, xr, 142, xr, bot);
    label(g, xr - 16, 121, "R", "L", "end");
    line(g, xs, bot, xr, bot);
    // V_O
    line(g, xr, top, xo, top, "dd-tap"); line(g, xr, bot, xo, bot, "dd-tap");
    s("circle", { cx: xo, cy: top, r: 4, "class": "dd-term" }, g); s("circle", { cx: xo, cy: bot, r: 4, "class": "dd-term" }, g);
    label(g, xo + 10, top + 5, neg ? "−" : "+", "", "start", "dd-tap-label");
    label(g, xo + 10, bot + 5, neg ? "+" : "−", "", "start", "dd-tap-label");
    label(g, xo, (top + bot) / 2 + 5, "V", "O", "middle", "dd-tap-label");
    // Chieu dong khi diode dan
    var ax = xd + 76;
    s("path", { d: neg ? "M" + (ax + 8) + " " + (top - 5) + "l-8 5 l8 5Z" : "M" + ax + " " + (top - 5) + "l8 5 l-8 5Z", "class": "dd-cur" }, g);
    label(g, ax + 4, top - 12, "I", "D", "middle", "dd-cur-label");
    return svg;
  }

  /**
   * Dang song V_i (tren) va V_O (duoi), 2 chu ky.
   * @param {{pol:"+"|"-"}} c @param {{vm:number, vop:number}} r ket qua DKT_CALC.rect
   */
  function rectWaves(c, r) {
    var neg = c.pol === "-";
    var W = 540, H = 310, x0 = 66, xw = 430, h = 52, y1 = 80, y2 = 226;
    var ratio = Math.abs(r.vop) / r.vm;
    var svg = svgRoot(W, H, "Dạng sóng: V_i hình sin biên độ " + num(r.vm) + " V; V_O chỉ còn bán kỳ " + (neg ? "âm" : "dương") +
      ", đỉnh " + num(r.vop) + " V, bán kỳ kia bằng 0", "dkt-wave");
    var g = s("g", {}, svg);
    function plot(y0, f, cls) {
      var d = "";
      for (var k = 0; k <= 240; k++) {
        var t = k / 240, v = f(Math.sin(4 * Math.PI * t));
        d += (k ? "L" : "M") + (x0 + t * xw).toFixed(1) + " " + (y0 - v * h).toFixed(1);
      }
      s("path", { d: d, "class": cls }, g);
    }
    function axes(y0, sub) {
      line(g, x0, y0, x0 + xw + 16, y0, "bj-axis"); line(g, x0, y0 - h - 14, x0, y0 + h + 14, "bj-axis");
      s("path", { d: "M" + (x0 + xw + 16) + " " + (y0 - 4) + "l8 4 l-8 4Z", "class": "bj-axis-h" }, g);
      label(g, x0 + xw + 26, y0 + 18, "t", "", "end", "dd-val");
      label(g, x0 + 8, y0 - h - 4, "V", sub, "start");
    }
    function level(y, txt) {
      line(g, x0 - 4, y, x0 + xw, y, "dd-tap");
      label(g, x0 - 8, y + 4, txt, "", "end", "dd-val");
    }
    axes(y1, "i"); axes(y2, "O");
    plot(y1, function (v) { return v; }, "dkt-vi");
    plot(y2, function (v) { return neg ? Math.min(0, v) * ratio : Math.max(0, v) * ratio; }, "dkt-vo");
    level(y1 - h, num(r.vm)); level(y1 + h, num(-r.vm));
    var yp = neg ? y2 + h * ratio : y2 - h * ratio;
    level(yp, num(r.vop));
    // nhan doan dan / ngat duoi do thi V_O
    var on = neg ? [0.375, 0.875] : [0.125, 0.625], off = neg ? [0.125, 0.625] : [0.375, 0.875];
    on.forEach(function (f) { label(g, x0 + xw * f, neg ? yp + 30 : yp - 10, "D dẫn", "", "middle", "dkt-on"); });
    off.forEach(function (f) { label(g, x0 + xw * f, neg ? y2 - 12 : y2 + 24, "D ngắt", "", "middle", "dd-val"); });
    return svg;
  }

  /** Dien tro chan cam voi cac vong mau (vong sai so tach xa ve ben phai). */
  function resistorBands(bands) {
    var svg = svgRoot(240, 70, "Điện trở " + bands.length + " vòng màu: " + bands.join(", "), "dkt-part");
    var g = s("g", {}, svg);
    line(g, 6, 35, 54, 35); line(g, 186, 35, 234, 35);
    s("rect", { x: 54, y: 17, width: 132, height: 36, rx: 14, "class": "dkt-body" }, g);
    var n = bands.length, step = n === 4 ? 20 : 17;
    bands.forEach(function (b, k) {
      var x = k === n - 1 ? 160 : 70 + k * step;
      s("rect", { x: x, y: 17, width: 9, height: 36, fill: BAND_FILL[b] || "#999", "class": "dkt-band" }, g);
    });
    return svg;
  }

  /** Tu gom (tu dia) ghi ma. */
  function capChip(code) {
    var svg = svgRoot(160, 90, "Tụ gốm ghi mã " + code, "dkt-part");
    var g = s("g", {}, svg);
    line(g, 66, 60, 66, 88); line(g, 94, 60, 94, 88);
    s("ellipse", { cx: 80, cy: 36, rx: 44, ry: 30, "class": "dkt-cap" }, g);
    label(g, 80, 43, code, "", "middle", "dkt-code");
    return svg;
  }

  /** Dien tro dan SMD ghi ma. */
  function smdChip(code) {
    var svg = svgRoot(160, 80, "Điện trở dán SMD ghi mã " + code, "dkt-part");
    var g = s("g", {}, svg);
    s("rect", { x: 22, y: 18, width: 18, height: 44, "class": "dkt-pad" }, g);
    s("rect", { x: 120, y: 18, width: 18, height: 44, "class": "dkt-pad" }, g);
    s("rect", { x: 38, y: 20, width: 84, height: 40, "class": "dkt-smd" }, g);
    label(g, 80, 47, code, "", "middle", "dkt-code dkt-code-smd");
    return svg;
  }

  root.DKT_SVG = { rectCircuit: rectCircuit, rectWaves: rectWaves, resistorBands: resistorBands, capChip: capChip, smdChip: smdChip };
})(typeof window !== "undefined" ? window : globalThis);
