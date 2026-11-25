/* Trang de mau kiem tra 1 tiet Dien tu co ban (/dekiemtradientucoban): 4 de, moi de 6 cau theo DKT_PLAN.
   So lieu: assets/dkt-data.js. Tinh: dkt-calc.js, phanap-calc.js, diode-calc.js, zener-calc.js, bjt-calc.js,
   cap-code.js, smd-code.js. Hinh: dkt-svg.js, phanap-svg.js, diode-svg.js, zener-svg.js, bjt-svg.js. */
(function () {
  "use strict";

  var W = window;
  var app = document.getElementById("dktApp");
  var need = ["DKT_EXAMS", "DKT_PLAN", "DKT_CALC", "DKT_SVG", "PA_CALC", "PA_SVG", "DIODE_CALC", "DIODE_SVG",
    "ZENER_CALC", "ZENER_SVG", "BJT_CALC", "BJT_SVG", "CAP_CODE", "SMD_CODE"];
  if (!app) return;
  var missing = need.filter(function (k) { return !W[k]; });
  if (missing.length) {
    app.textContent = "Không tải được dữ liệu đề (thiếu " + missing.join(", ") + "). Tải lại trang để thử lại.";
    return;
  }
  var K = W.DKT_CALC, F = W.PA_CALC, PLAN = {};
  W.DKT_PLAN.forEach(function (p) { PLAN[p.cau] = p; });

  /* ---------- tien ich ---------- */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return node;
  }
  /** Van ban co chi so duoi: "I_RL", "R_{tđ}" -> <sub>. */
  function rich(tag, text, attrs) {
    var node = el(tag, attrs);
    var re = /_(\{[^}]+\}|[0-9A-Za-zÀ-ỹ]+)/g, last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) node.appendChild(document.createTextNode(text.slice(last, m.index)));
      node.appendChild(el("sub", { text: m[1].replace(/[{}]/g, "") }));
      last = re.lastIndex;
    }
    if (last < text.length) node.appendChild(document.createTextNode(text.slice(last)));
    return node;
  }
  var n = function (x, d) { return F.fmt(x, d === undefined ? 2 : d).replace(/^-/, "−"); };
  var mA = function (a, d) { return n(a * 1000, d) + " mA"; };
  var V = function (v) { return n(v) + " V"; };
  var ohm = function (r) { return F.fmtOhm(r); };
  var pts = function (x) { return n(x) + " đ"; };
  /** SMD_CODE dung dau cham thap phan -> dau phay. */
  var vn = function (s) { return s.replace(/(\d)\.(\d)/g, "$1,$2"); };
  var sub = function (name) { return name.replace(/^([A-Z])(\d+)$/, "$1_$2"); };

  /**
   * Khung 1 cau: tieu de + thoi gian/diem, de bai, hinh, yeu cau co diem, loi giai an.
   * @param {{id:string, cau:string, sub:string, intro:string, chips?:string[], figs?:Node[], asks:Array<Array>,
   *          steps:string[], solFigs?:Node[], answer:string}} q
   */
  function question(q) {
    var plan = PLAN[q.cau];
    var head = el("div", { "class": "dkt-qhead" }, [
      rich("h3", "Câu " + q.cau + " · " + q.sub, { "class": "kh-ask" }),
      el("span", { "class": "dkt-badge", text: plan.min + " phút · " + pts(plan.pts) })
    ]);
    var body = [head, rich("p", q.intro, { "class": "dkt-intro" })];
    if (q.chips) body.push(el("ul", { "class": "pa-givens" }, q.chips.map(function (c) { return rich("li", c); })));
    if (q.figs) body.push(el("figure", { "class": "pa-fig dkt-figs" }, q.figs));
    body.push(el("ol", { "class": "dkt-asks" }, q.asks.map(function (a) {
      var li = rich("li", a[0]);
      li.appendChild(el("span", { "class": "dkt-pts", text: " (" + pts(a[1]) + ")" }));
      return li;
    })));
    var sol = el("details", { "class": "kh-sol dkt-sol" }, [el("summary", { text: "Xem lời giải" })]);
    (q.solFigs || []).forEach(function (f) { sol.appendChild(el("figure", { "class": "pa-fig" }, [f])); });
    sol.appendChild(el("ol", { "class": "kh-steps dkt-steps" }, q.steps.map(function (s) { return rich("li", s); })));
    sol.appendChild(rich("p", "Đáp số: " + q.answer, { "class": "dkt-ans" }));
    body.push(sol);
    return el("article", { "class": "kh-prob dkt-q", id: q.id }, body);
  }

  /* ---------- Cau 1: chinh luu ban ky ---------- */
  function cau1(e) {
    var c = e.rect, r = K.rect(c), neg = c.pol === "-";
    var half = neg ? "âm" : "dương", sgn = neg ? "−" : "";
    var how = neg
      ? ["b) Diode lắp ngược nên chỉ dẫn ở bán kỳ âm: khi V_i < −0,7 V, D phân cực thuận. K2 vòng 1: −V_i − V_D + V_O = 0 ⇒ V_O = V_i + 0,7 V (âm).",
        "Bán kỳ dương và lúc V_i > −0,7 V: D phân cực nghịch, I_D = 0 ⇒ V_O = R_L × 0 = 0, toàn bộ V_i đặt lên diode."]
      : ["b) Diode lắp thuận nên chỉ dẫn ở bán kỳ dương: khi V_i > 0,7 V, D phân cực thuận. K2 vòng 1: −V_i + V_D + V_O = 0 ⇒ V_O = V_i − 0,7 V.",
        "Bán kỳ âm và lúc V_i < 0,7 V: D phân cực nghịch, I_D = 0 ⇒ V_O = R_L × 0 = 0, toàn bộ V_i đặt lên diode."];
    return question({
      id: "d" + e.de + "c1", cau: "1", sub: "Mạch chỉnh lưu bán kỳ " + half,
      intro: "Dùng biến áp 220 V / " + n(c.vrms) + " V, 50 Hz (" + n(c.vrms) + " V là giá trị hiệu dụng thứ cấp), một diode Si (V_D = 0,7 V) và tải R_L = " + ohm(c.r) + " để điện áp ra chỉ còn bán kỳ " + half + ".",
      asks: [
        ["Vẽ sơ đồ mạch chỉnh lưu bán kỳ " + half + ", ghi rõ chiều lắp diode, chiều dòng I_D và cực tính V_O.", 0.75],
        ["Vẽ dạng sóng V_i và V_O theo thời gian (2 chu kỳ), ghi giá trị đỉnh, chỉ rõ lúc diode dẫn và ngắt.", 0.75],
        ["Tính V_m, đỉnh V_Op của điện áp ra, điện áp trung bình V_DC và dòng trung bình I_DC qua tải.", 0.5]
      ],
      solFigs: [W.DKT_SVG.rectCircuit(c.pol), W.DKT_SVG.rectWaves(c, r)],
      steps: [
        "a) Sơ đồ như hình: biến áp hạ áp, diode D nối tiếp tải R_L. " + (neg
          ? "Muốn giữ bán kỳ âm thì lắp ngược diode: cathode nối cuộn thứ cấp, anode nối R_L; I_D chạy từ dưới lên qua R_L nên V_O âm (đầu trên R_L là −)."
          : "Muốn giữ bán kỳ dương thì anode nối cuộn thứ cấp, cathode nối R_L; I_D chạy từ trên xuống qua R_L nên V_O dương (đầu trên R_L là +)."),
        how[0], how[1],
        "c) Biên độ thứ cấp: V_m = V_rms × √2 = " + n(c.vrms) + " × 1,414 = " + V(r.vm) + ".",
        "Đỉnh điện áp ra: V_Op = " + sgn + "(V_m − V_D) = " + sgn + "(" + n(r.vm) + " − 0,7) = " + V(r.vop) + ".",
        "V_DC = " + sgn + "0,318 × (V_m − V_D) = " + sgn + "0,318 × " + n(Math.abs(r.vop)) + " = " + V(r.vdc) + ".",
        "I_DC = V_DC / R_L = " + n(r.vdc) + " / " + n(c.r) + " = " + mA(r.idc) + (neg ? " (dấu − : dòng qua tải đi từ dưới lên)." : "."),
        "Kiểm tra: V_DC / V_Op = " + n(r.vdc / r.vop, 3) + " ≈ 1/π = 0,318 ✓. Diode chịu điện áp ngược đỉnh PIV = V_m = " + V(r.vm) + " nên dùng 1N4007 (1000 V) là đủ."
      ],
      answer: "V_m = " + V(r.vm) + "; V_Op = " + V(r.vop) + "; V_DC = " + V(r.vdc) + "; I_DC = " + mA(r.idc)
    });
  }

  /* ---------- Cau 2: doc linh kien ---------- */
  var LETTERS = ["a", "b", "c", "d", "e", "f"];
  function supExp(e) {
    var SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
    return (e < 0 ? "⁻" : "") + String(Math.abs(e)).split("").map(function (d) { return SUP[+d]; }).join("");
  }
  function bandsItem(bands) {
    var rd = K.readBands(bands), sigN = bands.length - 2;
    var parts = bands.map(function (b, k) {
      if (k < sigN) return b + " " + rd.digits[k];
      if (k === sigN) return b + " × 10" + supExp(rd.exp);
      return b + " ±" + n(rd.tol) + "%";
    });
    return {
      fig: W.DKT_SVG.resistorBands(bands), cap: "Điện trở " + bands.length + " vòng màu",
      sol: parts.join(" · ") + " ⇒ " + rd.digits.join("") + " × 10" + supExp(rd.exp) + " = " + ohm(rd.ohm) + " ±" + n(rd.tol) +
        "%; giá trị thật từ " + ohm(rd.min) + " đến " + ohm(rd.max) + ".",
      ans: ohm(rd.ohm) + " ±" + n(rd.tol) + "%"
    };
  }
  function capItem(code) {
    var d = W.CAP_CODE.decode(code);
    return { fig: W.DKT_SVG.capChip(code), cap: "Tụ gốm", sol: W.CAP_CODE.explain(code), ans: W.CAP_CODE.formatCap(d.pf) + " ±" + d.tol + "%" };
  }
  function smdItem(code) {
    return { fig: W.DKT_SVG.smdChip(code), cap: "Điện trở dán SMD", sol: vn(W.SMD_CODE.explain(code)), ans: vn(W.SMD_CODE.formatOhm(W.SMD_CODE.decode(code))) };
  }
  function cau2(e) {
    var p = e.parts;
    var items = [bandsItem(p.bands4), bandsItem(p.bands5), capItem(p.cap[0]), capItem(p.cap[1]), smdItem(p.smd[0]), smdItem(p.smd[1])];
    var grid = el("div", { "class": "dkt-parts" }, items.map(function (it, k) {
      return el("div", { "class": "dkt-part-cell" }, [it.fig, el("span", { text: LETTERS[k] + ") " + it.cap })]);
    }));
    return question({
      id: "d" + e.de + "c2", cau: "2", sub: "Đọc giá trị linh kiện",
      intro: "Đọc giá trị và sai số của 6 linh kiện dưới đây. Điện trở vòng màu ghi thêm khoảng giá trị thật (nhỏ nhất đến lớn nhất); tụ đổi ra pF, nF, µF.",
      figs: [grid],
      asks: items.map(function (it) { return [it.cap, 0.25]; }),
      steps: ["Bảng màu: Đen 0, Nâu 1, Đỏ 2, Cam 3, Vàng 4, Xanh lục 5, Xanh lam 6, Tím 7, Xám 8, Trắng 9; vòng nhân Vàng kim × 10⁻¹, Bạc × 10⁻²; sai số Nâu ±1%, Đỏ ±2%, Vàng kim ±5%, Bạc ±10%. Điện trở 4 vòng có 2 số, 5 vòng có 3 số."]
        .concat(items.map(function (it, k) { return LETTERS[k] + ") " + it.sol; }))
        .concat(["Mã tụ: 1–2 số đọc thẳng pF; 3 số = 2 số đầu × 10^(số cuối) pF; J = ±5%, K = ±10%. Mã SMD: 3 số = 2 số đầu × 10^(số cuối) Ω; 4 số = 3 số đầu × 10^(số cuối) Ω; chữ R là dấu phẩy thập phân."]),
      answer: items.map(function (it, k) { return LETTERS[k] + ") " + it.ans; }).join("; ")
    });
  }

  /* ---------- Cau 3: dien tro hon hop ---------- */
  function cau3(e) {
    var p = e.res, s = F.solve(p), v = p.values;
    var steps = ["a) Các tầng mắc nối tiếp từ V_CC xuống mass; tầng có nhiều điện trở là cụm song song."];
    var labels = p.stages.map(function (names, k) {
      if (names.length === 1) return sub(names[0]);
      var lab = "R_{" + names.map(function (x) { return x.slice(1); }).join("") + "}";
      var same = names.every(function (x) { return v[x] === v[names[0]]; });
      var how = names.length === 2
        ? sub(names[0]) + "·" + sub(names[1]) + " / (" + sub(names[0]) + " + " + sub(names[1]) + ") = " + n(v[names[0]]) + " × " + n(v[names[1]]) + " / (" + n(v[names[0]]) + " + " + n(v[names[1]]) + ")"
        : same ? "R / " + names.length + " = " + n(v[names[0]]) + " / " + names.length
          : "1 / (" + names.map(function (x) { return "1/" + n(v[x]); }).join(" + ") + ")";
      steps.push(lab + " = " + names.map(sub).join(" // ") + " = " + how + " = " + ohm(s.stages[k].r));
      return lab;
    });
    steps.push("R_{tđ} = " + labels.join(" + ") + " = " + s.stages.map(function (t) { return n(t.r); }).join(" + ") + " = " + ohm(s.rtd));
    steps.push("b) Định luật Ohm: I = V_CC / R_{tđ} = " + n(p.vcc) + " / " + n(s.rtd) + " = " + mA(s.current, 3) + ". Các tầng nối tiếp có cùng dòng I.");
    steps.push("c) Điện áp mỗi tầng U = I × R tầng; trong cụm song song mọi nhánh cùng điện áp, dòng nhánh = U / R nhánh:");
    var answers = [];
    s.stages.forEach(function (t, k) {
      var names = p.stages[k];
      var u = "U_{" + labels[k].replace(/^R_\{?|\}$/g, "") + "} = I × " + labels[k] + " = " + n(s.current * 1000, 3) + "×10⁻³ × " + n(t.r) + " = " + V(t.v);
      steps.push(names.length === 1
        ? u + " ⇒ I_" + names[0].slice(1) + " = I = " + mA(s.current, 3)
        : u + " ⇒ " + t.branches.map(function (b) { return "I_" + b.name.slice(1) + " = " + n(t.v) + " / " + n(v[b.name]) + " = " + mA(b.i, 3); }).join("; "));
      names.forEach(function (nm, j) { answers.push("U_" + nm.slice(1) + " = " + V(t.v) + ", I_" + nm.slice(1) + " = " + mA(t.branches[j].i, 3)); });
    });
    var sumU = s.stages.reduce(function (a, t) { return a + t.v; }, 0);
    var par = s.stages.filter(function (t, k) { return p.stages[k].length > 1; })[0];
    steps.push("Kiểm tra K2: " + s.stages.map(function (t) { return n(t.v); }).join(" + ") + " = " + V(sumU) + " = V_CC ✓" +
      (par ? "; K1 tại nút cụm song song: " + par.branches.map(function (b) { return n(b.i * 1000, 3); }).join(" + ") + " = " + mA(par.branches.reduce(function (a, b) { return a + b.i; }, 0), 3) + " = I ✓" : ""));
    return question({
      id: "d" + e.de + "c3", cau: "3", sub: "Điện trở mắc hỗn hợp",
      intro: "Cho mạch điện như hình với V_CC = " + V(p.vcc) + ".",
      chips: Object.keys(v).map(function (k) { return sub(k) + " = " + ohm(v[k]); }),
      figs: [W.PA_SVG.draw(Object.assign({}, p, { id: "câu 3" }))],
      asks: [["Tính điện trở tương đương R_{tđ} của mạch.", 0.5], ["Tính dòng điện mạch chính I.", 0.5], ["Tính điện áp và dòng điện trên từng điện trở.", 1]],
      steps: steps,
      answer: "R_{tđ} = " + ohm(s.rtd) + "; I = " + mA(s.current, 3) + "; " + answers.join("; ")
    });
  }

  /* ---------- Cau 4a: diode ---------- */
  var KIND = { si: "Si", ge: "Ge", led: "LED đỏ" };
  function dname(d) { return sub(d.name) + " (" + KIND[d.kind] + " " + n(d.vf) + " V)"; }
  function cau4a(e) {
    var p = e.diode, r = W.DIODE_CALC.solve(p.levels, p.vcc, p.r);
    var all = [].concat.apply([], p.levels);
    var taps = p.taps.map(function (t) { return "V_" + t.name + " = " + V(r.nodes[t.node]); }).join("; ");
    var currents = all.map(function (d) { return "I_" + d.name + " = " + mA(r.id[d.name]); }).join("; ");
    var steps = [];
    if (r.mode === "blocked") {
      var bad = p.levels[r.blockedAt].filter(function (d) { return d.rev; })[0];
      steps.push("a) " + sub(bad.name) + " lắp ngược (cathode quay lên phía V_CC) ⇒ phân cực nghịch, ngắt. Các tầng mắc nối tiếp nên cả mạch hở: không diode nào dẫn.");
      steps.push("b) I_R = 0 ⇒ " + all.map(function (d) { return "I_" + d.name; }).join(" = ") + " = 0.");
      steps.push("c) Không có dòng nên R không sụt áp: " + taps + ". Toàn bộ V_CC đặt lên diode lắp ngược.");
    } else {
      steps.push("a) Xét từng tầng từ trên xuống:");
      p.levels.forEach(function (lv, k) {
        var st = r.states[k];
        if (lv.length === 1) { steps.push("Tầng " + (k + 1) + ": " + dname(lv[0]) + " phân cực thuận ⇒ dẫn, giữ " + V(st.v) + "."); return; }
        var off = lv.filter(function (d) { return st.on.indexOf(d.name) < 0; }).map(function (d) { return sub(d.name); });
        steps.push("Tầng " + (k + 1) + ": " + lv.map(dname).join(" // ") + ". Diode ngưỡng thấp dẫn trước và ghim điện áp cụm ở " + V(st.v) +
          (off.length ? ", nhỏ hơn ngưỡng của " + off.join(", ") + " ⇒ " + off.join(", ") + " ngắt." : "."));
      });
      steps.push("V_CC = " + V(p.vcc) + " > tổng ngưỡng " + V(r.sumV) + " ⇒ mạch có dòng.");
      steps.push("b) K2 vòng 1: −V_CC + I_R·R + " + r.states.map(function (st) { return n(st.v); }).join(" + ") + " = 0 ⇒ I_R = (" + n(p.vcc) + " − " + n(r.sumV) + ") / " + n(p.r) + " = " + mA(r.iR) + ".");
      steps.push(currents + " (diode ngắt có dòng 0; diode dẫn ở mỗi tầng mang dòng I_R).");
      steps.push("c) Điện áp điểm đo = tổng sụt áp các diode từ điểm đó xuống mass: " + taps + ".");
      steps.push("Kiểm tra: V_R + V_" + p.taps[0].name + " = " + n(r.iR * p.r) + " + " + n(r.nodes[0]) + " = " + V(r.iR * p.r + r.nodes[0]) + " = V_CC ✓");
    }
    return question({
      id: "d" + e.de + "c4a", cau: "4a", sub: "Mạch diode",
      intro: "Cho mạch như hình, V_CC = " + V(p.vcc) + ", R = " + ohm(p.r) + ". Diode Si có V_D = 0,7 V, Ge 0,3 V, LED đỏ 2 V.",
      figs: [W.DIODE_SVG.draw(p, p.vcc)],
      asks: [["Diode nào dẫn, diode nào ngắt? Giải thích.", 0.25], ["Tính I_R và dòng qua từng diode.", 0.5],
        ["Tính " + p.taps.map(function (t) { return "V_" + t.name; }).join(", ") + ".", 0.25]],
      steps: steps,
      answer: "I_R = " + mA(r.iR) + "; " + currents + "; " + taps
    });
  }

  /* ---------- Cau 4b: Zener ---------- */
  function cau4b(e) {
    var p = e.zener, z = p.zener;
    var r = W.ZENER_CALC.zenerPoint({ vz: z.vz, izmin: z.izmin, izmax: z.izmax, vs: p.vs, rs: p.rs, rl: p.rl });
    var pzmax = z.vz * z.izmax;
    return question({
      id: "d" + e.de + "c4b", cau: "4b", sub: "Mạch ổn áp diode Zener",
      intro: "Cho mạch ổn áp Zener như hình.",
      chips: ["V_S = " + V(p.vs), "R_S = " + ohm(p.rs), "R_L = " + ohm(p.rl), "V_Z = " + V(z.vz), "I_Zmin = " + mA(z.izmin, 1), "I_Zmax = " + mA(z.izmax, 1)],
      figs: [W.ZENER_SVG.zener()],
      asks: [["Tính dòng I_S qua R_S và dòng tải I_RL.", 0.5], ["Tính dòng I_Z qua Zener và công suất P_Z.", 0.5], ["Mạch có ổn áp không? Khi đó V_O bằng bao nhiêu?", 0.5]],
      steps: [
        "Giả sử Zener làm việc ở vùng ổn áp ⇒ V_A = V_O = V_Z = " + V(z.vz) + ".",
        "a) K2 vòng 1: −V_S + I_S·R_S + V_Z = 0 ⇒ I_S = (V_S − V_Z) / R_S = (" + n(p.vs) + " − " + n(z.vz) + ") / " + n(p.rs) + " = " + mA(r.is) + ".",
        "I_RL = V_Z / R_L = " + n(z.vz) + " / " + n(p.rl) + " = " + mA(r.irl) + ".",
        "b) K1 tại nút A: I_S = I_Z + I_RL ⇒ I_Z = " + n(r.is * 1000) + " − " + n(r.irl * 1000) + " = " + mA(r.iz) + ".",
        "P_Z = V_Z × I_Z = " + n(z.vz) + " × " + n(r.iz * 1000) + "×10⁻³ = " + n(r.pz * 1000, 1) + " mW ≈ " + n(r.pz, 3) + " W.",
        "c) " + (r.ok
          ? "I_Zmin = " + mA(z.izmin, 1) + " ≤ I_Z = " + mA(r.iz) + " ≤ I_Zmax = " + mA(z.izmax, 1) + " ⇒ mạch ổn áp, V_O = V_Z = " + V(z.vz) + "."
          : "I_Z = " + mA(r.iz) + " nằm ngoài khoảng " + mA(z.izmin, 1) + " … " + mA(z.izmax, 1) + " ⇒ mạch không ổn áp."),
        "Kiểm tra: I_Z + I_RL = " + n((r.iz + r.irl) * 1000) + " mA = I_S ✓; P_Z = " + n(r.pz, 3) + " W ≤ P_Zmax = V_Z·I_Zmax = " + n(pzmax, 3) + " W ✓."
      ],
      answer: "I_S = " + mA(r.is) + "; I_RL = " + mA(r.irl) + "; I_Z = " + mA(r.iz) + "; P_Z ≈ " + n(r.pz, 3) + " W; " + (r.ok ? "ổn áp, V_O = " + V(z.vz) : "không ổn áp")
    });
  }

  /* ---------- Cau 5: BJT ---------- */
  var MODES = { cut: "ngưng dẫn", active: "khuếch đại", sat: "bão hoà" };
  function cau5(e) {
    var p = e.bjt, C = W.BJT_CALC, icmax = C.loadLine(p).icmax;
    var rSum = p.re ? "(R_C + R_E)" : "R_C", rSumVal = p.re ? "(" + n(p.rc) + " + " + n(p.re) + ")" : n(p.rc);
    var cases = p.vbb.map(function (vbb) { return C.qPoint({ vcc: p.vcc, vbb: vbb, rb: p.rb, rc: p.rc, re: p.re, beta: p.beta }); });
    var steps = [
      "a) K2 vòng C–E (I_E ≈ I_C): −V_CC + I_C·R_C + V_CE" + (p.re ? " + I_C·R_E" : "") + " = 0 ⇒ phương trình DCLL: V_CE = V_CC − I_C·" + rSum + ".",
      "V_CE = 0 ⇒ I_Cmax = V_CC / " + rSum + " = " + n(p.vcc) + " / " + rSumVal + " = " + mA(icmax) + "; I_C = 0 ⇒ V_CE = V_CC = " + V(p.vcc) + ". DCLL là đoạn thẳng nối (0 V; " + mA(icmax) + ") và (" + V(p.vcc) + "; 0 mA)."
    ];
    cases.forEach(function (r, k) {
      var qn = "Q_" + (k + 1), vbb = p.vbb[k], tag = (k === 0 ? "b) " : "c) ") + "V_BB = " + V(vbb) + ": ";
      if (r.mode === "cut") { steps.push(tag + "V_BB < 0,7 V ⇒ I_B = 0, I_C = 0: ngưng dẫn; V_CE = V_CC ⇒ " + qn + "(0 mA; " + V(p.vcc) + ")."); return; }
      steps.push(tag + "K2 vòng B–E: −V_BB + I_B·R_B + V_BE" + (p.re ? " + (1 + β)·I_B·R_E" : "") + " = 0 ⇒ I_B = (V_BB − 0,7) / " +
        (p.re ? "[R_B + (1 + β)R_E] = (" + n(vbb) + " − 0,7) / (" + n(p.rb) + " + " + (p.beta + 1) + " × " + n(p.re) + ")" : "R_B = (" + n(vbb) + " − 0,7) / " + n(p.rb)) + " = " + mA(r.ib, 4) + ".");
      if (r.mode === "active") {
        steps.push("β·I_B = " + p.beta + " × " + n(r.ib * 1000, 4) + " = " + mA(r.bib) + " < I_Cmax ⇒ khuếch đại: I_C = " + mA(r.ic) + "; V_CE = " + n(p.vcc) + " − " + n(r.ic * 1000) + "×10⁻³ × " + rSumVal + " = " + V(r.vce) + " ⇒ " + qn + "(" + mA(r.ic) + "; " + V(r.vce) + ").");
        steps.push("Kiểm tra: V_CE + I_C·" + rSum + " = " + n(r.vce) + " + " + n(r.ic * (p.rc + p.re)) + " = " + V(r.vce + r.ic * (p.rc + p.re)) + " = V_CC ✓ (" + qn + " nằm trên DCLL).");
      } else {
        steps.push("β·I_B = " + p.beta + " × " + n(r.ib * 1000, 4) + " = " + mA(r.bib) + " ≥ I_Cmax = " + mA(icmax) + " ⇒ bão hoà: I_C = I_Cmax = " + mA(r.ic) + ", V_CE = V_CEsat ≈ 0,2 V ⇒ " + qn + "(" + mA(r.ic) + "; 0,2 V).");
      }
    });
    steps.push("d) Đánh dấu " + cases.map(function (r, k) { return "Q_" + (k + 1); }).join(", ") + " trên DCLL như đồ thị trên.");
    return question({
      id: "d" + e.de + "c5", cau: "5", sub: "Transistor BJT: đường tải tĩnh DCLL và điểm Q",
      intro: "Cho mạch phân cực transistor NPN Si (V_BE = 0,7 V, V_CEsat = 0,2 V) như hình.",
      chips: ["V_CC = " + V(p.vcc), "R_B = " + ohm(p.rb), "R_C = " + ohm(p.rc), p.re ? "R_E = " + ohm(p.re) : "R_E = 0 (E nối mass)", "β = " + p.beta],
      figs: [W.BJT_SVG.bias({ two: true, re: p.re > 0 })],
      asks: [["Viết phương trình đường tải tĩnh DCLL, tính I_Cmax và vẽ DCLL.", 0.75],
        ["Với V_BB = " + V(p.vbb[0]) + ": tính I_B, I_C, V_CE và cho biết chế độ làm việc.", 0.5],
        ["Với V_BB = " + V(p.vbb[1]) + ": tính I_B, I_C, V_CE và cho biết chế độ làm việc.", 0.5],
        ["Đánh dấu hai điểm làm việc Q_1, Q_2 trên DCLL.", 0.25]],
      solFigs: [W.BJT_SVG.loadLine(p.vcc, Math.round(icmax * 100000) / 100, cases.map(function (r, k) { return { vce: r.vce, icMa: r.ic * 1000, name: "Q" + (k + 1) }; }))],
      steps: steps,
      answer: "I_Cmax = " + mA(icmax) + "; " + cases.map(function (r, k) { return "Q_" + (k + 1) + ": " + MODES[r.mode] + ", I_C = " + mA(r.ic) + ", V_CE = " + V(r.vce); }).join("; ")
    });
  }

  /* ---------- Ghep de + tab ---------- */
  function panelFor(e) {
    var used = W.DKT_PLAN.reduce(function (a, p) { return a + p.min; }, 0);
    var total = W.DKT_PLAN.reduce(function (a, p) { return a + p.pts; }, 0);
    return [
      el("p", { "class": "dkt-dehead", text: "Đề " + e.de + " · 45 phút (làm bài " + used + " phút + " + (45 - used) + " phút đọc đề, soát lại) · " + n(total) + " điểm · Không dùng tài liệu, được dùng máy tính cầm tay." }),
      cau1(e), cau2(e), cau3(e), cau4a(e), cau4b(e), cau5(e)
    ];
  }

  var tabs = el("div", { "class": "kh-tabs", role: "tablist", "aria-label": "Chọn đề" });
  var panels = el("div");
  var entries = [];
  W.DKT_EXAMS.forEach(function (e) {
    var id = "de" + e.de;
    var panel = el("section", { role: "tabpanel", id: id, hidden: "", "aria-label": "Đề " + e.de }, panelFor(e));
    var tab = el("button", { type: "button", role: "tab", text: "Đề " + e.de + " · bán kỳ " + (e.rect.pol === "-" ? "âm" : "dương"), "aria-controls": id });
    tab.addEventListener("click", function () { select(id, true); });
    tabs.appendChild(tab);
    panels.appendChild(panel);
    entries.push({ id: id, tab: tab, panel: panel });
  });

  function select(id, updateHash) {
    entries.forEach(function (x) {
      var active = x.id === id;
      x.tab.setAttribute("aria-selected", active ? "true" : "false");
      x.panel.hidden = !active;
    });
    if (updateHash && history.replaceState) history.replaceState(null, "", "#" + id);
  }

  app.appendChild(tabs);
  app.appendChild(panels);
  var fromHash = location.hash.slice(1);
  select(entries.some(function (x) { return x.id === fromHash; }) ? fromHash : entries[0].id, false);
})();
