/* Trang de on kiem tra 1 tiet Ly thuyet mach: moi de = Bai 1 Kirchhoff nang cao + Bai 2 mach xac lap dieu hoa.
   So lieu tu assets/dekiemtra-data.js; the bai dung lai KH_WORKED_CARD (kirchhoff.js) va XL_CARD (xlhd.js). */
(function () {
  "use strict";

  var sets = Array.isArray(window.DKT_SETS) ? window.DKT_SETS : [];
  var app = document.getElementById("dktApp");
  if (!app || !window.KH_WORKED_CARD || !window.XL_CARD) return;

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { node.appendChild(c); });
    return node;
  }

  var tabs = el("div", { "class": "kh-tabs", role: "tablist", "aria-label": "Chọn đề" });
  var panels = el("div");
  var entries = [];

  sets.forEach(function (s) {
    var panel = el("section", { role: "tabpanel", id: "de" + s.id, hidden: "", "aria-label": "Đề " + s.id }, [
      window.KH_WORKED_CARD(s.dc, 1),
      window.XL_CARD(s.ac)
    ]);
    var tab = el("button", { type: "button", role: "tab", text: "Đề " + s.id, "aria-controls": "de" + s.id });
    tab.addEventListener("click", function () { select(s.id, true); });
    tabs.appendChild(tab);
    panels.appendChild(panel);
    entries.push({ id: s.id, tab: tab, panel: panel });
  });

  function select(id, updateHash) {
    entries.forEach(function (e) {
      var active = e.id === id;
      e.tab.setAttribute("aria-selected", active ? "true" : "false");
      e.panel.hidden = !active;
    });
    if (updateHash && history.replaceState) history.replaceState(null, "", "#de" + id);
  }

  app.appendChild(tabs);
  app.appendChild(panels);

  var fromHash = /^#de(\d+)$/.exec(location.hash);
  var initial = fromHash ? parseInt(fromHash[1], 10) : 1;
  select(entries.some(function (e) { return e.id === initial; }) ? initial : (entries[0] && entries[0].id), false);
})();
