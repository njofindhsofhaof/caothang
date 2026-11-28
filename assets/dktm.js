/* Trang de kiem tra 1 tiet Ly thuyet mach Chuong 3–4 (/dekiemtralythuyetmach): 4 de, moi de 2 bai theo DKTM_PLAN.
   So lieu: assets/dktm-data.js. Loi giai: dktm-calc.js (dung mln-calc.js, bp3-calc.js). Hinh: mln-svg.js, bp3-svg.js.
   Khung trang giong /dekiemtradientucoban (dkt.css). */
(function () {
  "use strict";

  var W = window;
  var app = document.getElementById("dktApp");
  if (!app) return;
  var need = ["DKTM_EXAMS", "DKTM_PLAN", "DKTM_CALC", "MLN_CALC", "MLN_SVG", "BP3_CALC", "BP3_SVG"];
  var missing = need.filter(function (k) { return !W[k]; });
  if (missing.length) {
    app.textContent = "Không tải được dữ liệu đề (thiếu " + missing.join(", ") + "). Tải lại trang để thử lại.";
    return;
  }
  var C = W.DKTM_CALC, num = W.MLN_CALC.num, PLAN = {};
  W.DKTM_PLAN.forEach(function (p) { PLAN[p.bai] = p; });

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return node;
  }
  /** Van ban co chi so duoi: "I_m1", "V_A", "P_nguồn" -> <sub>. */
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
  var pts = function (x) { return num(x) + " đ"; };

  /**
   * Khung 1 bai: tieu de + thoi gian/diem, de bai, hinh, yeu cau co diem, loi giai an (chia nhom a–d kem diem).
   * @param {{id:string, bai:string, sub:string, intro:string, chips?:string[], fig:Node, asks:Array<Array>,
   *          sol:{groups:{title:string,pts:number,lines:string[]}[], answer:string}}} q
   */
  function problem(q) {
    var plan = PLAN[q.bai];
    var body = [
      el("div", { "class": "dkt-qhead" }, [
        rich("h3", "Bài " + q.bai + " · " + q.sub, { "class": "kh-ask" }),
        el("span", { "class": "dkt-badge", text: plan.min + " phút · " + pts(plan.pts) })
      ]),
      rich("p", q.intro, { "class": "dkt-intro" })
    ];
    if (q.chips) body.push(el("ul", { "class": "pa-givens" }, q.chips.map(function (c) { return rich("li", c); })));
    body.push(el("figure", { "class": "pa-fig dktm-fig" }, [q.fig]));
    body.push(el("ol", { "class": "dkt-asks" }, q.asks.map(function (a) {
      var li = rich("li", a[0]);
      li.appendChild(el("span", { "class": "dkt-pts", text: " (" + pts(a[1]) + ")" }));
      return li;
    })));
    var sol = el("details", { "class": "kh-sol dkt-sol" }, [el("summary", { text: "Xem lời giải và thang điểm" })]);
    q.sol.groups.forEach(function (g, k) {
      sol.appendChild(el("p", { "class": "dktm-step" }, [rich("strong", g.title), el("span", { "class": "dkt-pts", text: " (" + pts(g.pts) + ")" })]));
      var steps = g.lines.filter(function (s) { return !/^Thang điểm/.test(s); });
      var rubric = g.lines.filter(function (s) { return /^Thang điểm/.test(s); });
      var fig = k === 0 && q.solFig;
      var split = fig ? steps.length - q.solFigAfter : steps.length;
      var li = function (s) { return rich("li", s); };
      sol.appendChild(el("ol", { "class": "kh-steps dkt-steps" }, steps.slice(0, split).map(li)));
      if (fig) sol.appendChild(el("figure", { "class": "pa-fig dktm-fig" }, [fig, el("figcaption", { "class": "dktm-cap", text: "Mạch sau khi biến đổi nguồn áp thành nguồn dòng" })]));
      sol.appendChild(el("ol", { "class": "kh-steps dkt-steps" }, steps.slice(split).map(li).concat(rubric.map(function (s) { return rich("li", s, { "class": "dktm-rubric" }); }))));
    });
    sol.appendChild(rich("p", "Đáp số: " + q.sol.answer, { "class": "dkt-ans" }));
    body.push(sol);
    return el("article", { "class": "kh-prob dkt-q", id: q.id }, body);
  }

  /* ---------- Bai 1: Chuong 3 ---------- */
  function bai1(e) {
    var p = e.b1, mesh = p.method === "mesh";
    var names = p.currents.map(function (c) { return c.name; });
    var range = names[0] + " … " + names[names.length - 1];
    var ms = [];
    for (var k = 0; k < (mesh ? p.loops : 0); k++) ms.push("I_m" + (k + 1));
    var hasJ = (p.isources || []).length > 0;
    var power = "Kiểm tra kết quả bằng cân bằng công suất P_nguồn = P_tải" + (hasJ ? " (kể cả công suất của nguồn dòng J)." : ".");
    return problem({
      id: "d" + e.de + "b1", bai: "1", sub: mesh ? "Phương pháp dòng mắt lưới" : "Phương pháp điện thế nút",
      intro: mesh
        ? "Cho mạch điện một chiều như hình. Dùng phương pháp dòng mắt lưới (chọn các dòng mắt lưới " + ms.join(", ") + " cùng chiều kim đồng hồ):"
        : "Cho mạch điện một chiều như hình. Chọn nút dưới làm nút gốc (0 V), dùng phương pháp điện thế nút:",
      fig: W.MLN_SVG.draw({ id: "1 đề " + e.de, size: p.size, draw: p.draw }),
      asks: mesh
        ? [["Viết hệ phương trình dòng mắt lưới." + (hasJ ? " Mắt có nguồn dòng J xử lý thế nào?" : ""), 2], ["Giải hệ, tìm " + ms.join(", ") + ".", 1],
          ["Tính dòng điện " + range + " trong các nhánh theo chiều mũi tên trên hình.", 1], [power, 1]]
        : [["Biến đổi các nhánh nguồn áp nối tiếp điện trở thành nguồn dòng, vẽ lại mạch sau khi biến đổi và viết hệ phương trình điện thế nút.", 2],
          ["Giải hệ, tìm điện thế V_" + p.nodes.join(", V_") + ".", 1],
          ["Tính dòng điện " + range + " trong các nhánh theo chiều mũi tên trên hình.", 1], [power, 1]],
      sol: C.solveCircuit(p),
      /* Hinh mach da bien doi chen sau dong "Ve lai mach", truoc cac phuong trinh nut. */
      solFig: p.drawT ? W.MLN_SVG.draw({ id: "1 đề " + e.de + " sau biến đổi", size: p.sizeT, draw: p.drawT }) : null,
      solFigAfter: p.drawT ? p.nodes.length : 0
    });
  }

  /* ---------- Bai 2: Chuong 4 ---------- */
  var CONN = { Y: "hình sao (Y)", D: "hình tam giác (Δ)" };
  function bai2(e) {
    var p = e.b2, to = p.conn === "Y" ? "D" : "Y";
    var src = p.source ? "Nguồn 3 pha cân bằng " + p.source + " V" : "Mạng điện 3 pha có U_d = " + num(p.Ud) + " V";
    var z = p.zForm === "complex" ? "tổng trở mỗi pha Z_p = " + num(p.R) + " + j" + num(p.X) + " Ω" : "mỗi pha có R_p = " + num(p.R) + " Ω, X_p = " + num(p.X) + " Ω";
    return problem({
      id: "d" + e.de + "b2", bai: "2", sub: "Mạch 3 pha tải đối xứng nối " + (p.conn === "Y" ? "sao Y" : "tam giác Δ"),
      intro: src + " cấp cho tải 3 pha đối xứng nối " + CONN[p.conn] + ", " + z + " (hình).",
      fig: W.BP3_SVG.draw({ id: "2 đề " + e.de, conn: p.conn }),
      asks: [
        ["Tính điện áp dây U_d và điện áp pha U_p đặt trên mỗi pha tải.", 1],
        ["Tính tổng trở pha Z_p, dòng điện pha I_p và dòng điện dây I_d.", 1.5],
        ["Tính hệ số công suất cosφ, công suất tác dụng P, phản kháng Q và biểu kiến S của tải 3 pha.", 2],
        ["Nếu đấu lại tải thành " + CONN[to] + " trên cùng mạng điện thì I_d và P bằng bao nhiêu? So sánh P với lúc nối " + (p.conn === "Y" ? "Y" : "Δ") + ".", 0.5]
      ],
      sol: C.solveThreePhase(p)
    });
  }

  /* ---------- Ghep de + tab ---------- */
  function panelFor(e) {
    var used = W.DKTM_PLAN.reduce(function (a, p) { return a + p.min; }, 0);
    var total = W.DKTM_PLAN.reduce(function (a, p) { return a + p.pts; }, 0);
    return [
      el("p", { "class": "dkt-dehead", text: "Đề " + e.de + " · 45 phút (làm bài " + used + " phút + " + (45 - used) + " phút đọc đề, soát lại) · " +
        num(total) + " điểm · Không dùng tài liệu, được dùng máy tính cầm tay. Kết quả làm tròn 2 chữ số thập phân." }),
      bai1(e), bai2(e)
    ];
  }

  var tabs = el("div", { "class": "kh-tabs", role: "tablist", "aria-label": "Chọn đề" });
  var panels = el("div");
  var entries = [];
  W.DKTM_EXAMS.forEach(function (e) {
    var id = "de" + e.de;
    var label = "Đề " + e.de + " · " + (e.b1.method === "mesh" ? "mắt lưới" : "điện thế nút") + " + " + (e.b2.conn === "Y" ? "Y" : "Δ");
    var panel = el("section", { role: "tabpanel", id: id, hidden: "", "aria-label": "Đề " + e.de }, panelFor(e));
    var tab = el("button", { type: "button", role: "tab", text: label, "aria-controls": id });
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
