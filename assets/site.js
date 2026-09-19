/* Menu chung, bang "Bai moi" (toi da 5 tin) va danh sach bai theo trang. Doc du lieu tu assets/posts.js. */
(function () {
  "use strict";

  var NEWS_LIMIT = 5;
  var NEW_BADGE_DAYS = 7;
  var DAY_MS = 86400000;

  var SECTIONS = [
    { key: "gioithieu", label: "Giới thiệu", href: "/gioithieu" },
    { key: "ontap", label: "Ôn tập", href: "/ontap" },
    { key: "hoctap", label: "Học tập", href: "/hoctap" },
    { key: "hoatdong", label: "Hoạt động", href: "/hoatdong" },
    { key: "event", label: "Event", href: "/event" },
    { key: "thongtinlop", label: "Thông tin lớp", href: "/thongtinlop" }
  ];

  var posts = Array.isArray(window.CT_POSTS) ? window.CT_POSTS : [];

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  function findSection(key) {
    return SECTIONS.filter(function (x) { return x.key === key; })[0];
  }

  function sectionLabel(key) {
    var s = findSection(key);
    return s ? s.label : key;
  }

  function sectionHref(key) {
    var s = findSection(key);
    return s ? s.href : "/";
  }

  var WEEKDAYS = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];

  function formatDate(iso) {
    var p = String(iso).split("-");
    if (p.length !== 3) return String(iso);
    var weekday = WEEKDAYS[new Date(+p[0], +p[1] - 1, +p[2]).getDay()];
    return weekday + ", " + p[2] + "/" + p[1] + "/" + p[0];
  }

  function isRecent(iso) {
    var t = Date.parse(iso + "T00:00:00");
    return !isNaN(t) && Date.now() - t <= NEW_BADGE_DAYS * DAY_MS;
  }

  function byDateDesc(a, b) {
    return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
  }

  function currentPath() {
    var p = location.pathname.replace(/\.html$/, "").replace(/\/+$/, "");
    return p === "" || p === "/index" ? "/" : p;
  }

  function renderMenu(container) {
    var here = currentPath();
    var items = [{ label: "Trang chủ", href: "/" }].concat(SECTIONS);
    items.forEach(function (it) {
      var a = el("a", { href: it.href, text: it.label });
      if (it.href === here) a.setAttribute("aria-current", "page");
      container.appendChild(a);
    });
  }

  function postLink(p, extra) {
    var attrs = Object.assign({ href: p.href }, extra || {});
    if (/^https?:\/\//.test(p.href)) {
      attrs.target = "_blank";
      attrs.rel = "noopener";
    }
    return attrs;
  }

  function badge() {
    return el("span", { "class": "badge-new", text: "Mới" });
  }

  function renderNews(container) {
    var latest = posts
      .filter(function (p) { return !p.hideFromNews; })
      .sort(byDateDesc)
      .slice(0, NEWS_LIMIT);
    if (latest.length === 0) {
      container.appendChild(el("p", { "class": "empty", text: "Chưa có bài mới." }));
      return;
    }
    var tbody = el("tbody");
    latest.forEach(function (p) {
      var titleCell = el("td", { "class": "c-title" }, [el("a", postLink(p, { text: p.title }))]);
      if (isRecent(p.date)) titleCell.appendChild(badge());
      tbody.appendChild(el("tr", {}, [
        el("td", { "class": "c-date", text: formatDate(p.date) }),
        el("td", { "class": "c-sec" }, [el("a", { href: sectionHref(p.section), text: sectionLabel(p.section) })]),
        titleCell
      ]));
    });
    var thead = el("thead", {}, [el("tr", {}, [
      el("th", { text: "Ngày" }),
      el("th", { text: "Trang" }),
      el("th", { text: "Bài mới" })
    ])]);
    container.appendChild(el("table", { "class": "news" }, [thead, tbody]));
  }

  function renderSectionList(container) {
    var key = container.getAttribute("data-section");
    var items = posts
      .filter(function (p) { return p.section === key && !p.parent; })
      .sort(byDateDesc);
    var empty = document.getElementById("emptyState");
    if (items.length === 0) return;
    if (empty) empty.hidden = true;
    items.forEach(function (p) {
      var title = el("h2", { text: p.title });
      if (isRecent(p.date)) title.appendChild(badge());
      container.appendChild(el("a", postLink(p, { "class": "card" }), [
        title,
        p.desc ? el("p", { text: p.desc }) : null,
        el("span", { "class": "pub", text: "Ngày tạo: " + formatDate(p.date) })
      ]));
    });
  }

  function warmPages() {
    var conn = navigator.connection;
    if (conn && conn.saveData) return;
    var here = currentPath();
    var targets = [{ href: "/" }].concat(SECTIONS).filter(function (t) { return t.href !== here; });
    targets.forEach(function (t) {
      fetch(t.href, { credentials: "same-origin" }).catch(function () {});
    });
  }

  var menu = document.getElementById("siteNav");
  if (menu) {
    renderMenu(menu);
    if (window.requestIdleCallback) window.requestIdleCallback(warmPages, { timeout: 3000 });
    else setTimeout(warmPages, 1500);
  }
  var news = document.getElementById("newsBoard");
  if (news) renderNews(news);
  var list = document.getElementById("postList");
  if (list) renderSectionList(list);
})();
