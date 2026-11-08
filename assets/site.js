/* Menu chung, bang "Bai moi" va danh sach bai theo trang. Doc du lieu tu assets/posts.js.
   scripts/prerender.mjs chay file nay trong Node (window.CT_RENDER) de ghi san menu/bai vao HTML,
   giup bot doc link (Gemini, ChatGPT, Zalo...) khong chay JS van thay noi dung; trinh duyet ve lai kem nhan "Moi". */
(function () {
  "use strict";

  var NEWS_LIMIT = 8;
  var NEW_BADGE_DAYS = 7;
  var DAY_MS = 86400000;

  var SECTIONS = [
    { key: "hoctap", label: "Học tập", href: "/hoctap" },
    { key: "ontap", label: "Ôn tập", href: "/ontap" },
    { key: "duan", label: "Dự án", href: "/duan" },
    { key: "hoatdong", label: "Hoạt động", href: "/hoatdong" },
    { key: "event", label: "Bài viết", href: "/event" },
    { key: "diemdanh", label: "Điểm danh", href: "/diemdanh" }
  ];

  var posts = Array.isArray(window.CT_POSTS) ? window.CT_POSTS : [];

  function esc(v) {
    return String(v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* Tao chuoi HTML (dung chung cho trinh duyet va scripts/prerender.mjs). */
  function tag(name, attrs, inner) {
    var text = null;
    var a = Object.keys(attrs || {}).map(function (k) {
      if (k === "text") { text = attrs[k]; return ""; }
      return " " + k + '="' + esc(attrs[k]) + '"';
    }).join("");
    var body = text != null ? esc(text) : (inner || []).filter(Boolean).join("");
    return "<" + name + a + ">" + body + "</" + name + ">";
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

  function pathKey(pathname) {
    var p = String(pathname).replace(/\.html$/, "").replace(/\/+$/, "");
    return p === "" || p === "/index" ? "/" : p;
  }

  function currentPath() {
    return pathKey(location.pathname);
  }

  /* Moi ham *Items tra ve mang chuoi HTML; badges=false khi prerender (nhan "Moi" phu thuoc ngay xem). */
  function menuItems(here) {
    return [{ label: "Trang chủ", href: "/" }].concat(SECTIONS).map(function (it) {
      var attrs = { href: it.href, text: it.label };
      if (it.href === here) attrs["aria-current"] = "page";
      return tag("a", attrs);
    });
  }

  function renderMenu(container) {
    container.innerHTML = menuItems(currentPath()).join("");
    // Tren dien thoai menu cuon ngang: dua muc dang mo vao tam nhin.
    var current = container.querySelector('[aria-current="page"]');
    if (current && container.scrollWidth > container.clientWidth) {
      container.scrollLeft = Math.max(0, current.offsetLeft - container.offsetLeft - 16);
    }
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
    return tag("span", { "class": "badge-new", text: "Mới" });
  }

  /** Bai con (co parent, vd. bai Kirchhoff thuoc Ly Thuyet Mach) hien them ten mon ben canh muc. */
  function sectionCell(p) {
    var cells = [tag("a", { href: sectionHref(p.section), text: sectionLabel(p.section) })];
    var parent = p.parent && posts.filter(function (x) { return x.href === p.parent; })[0];
    if (parent) {
      cells.push(tag("span", { "class": "sep", "aria-hidden": "true", text: " › " }));
      cells.push(tag("a", { "class": "c-sub", href: parent.href, text: parent.title }));
    }
    return cells;
  }

  function newsItems(badges) {
    var latest = posts
      .filter(function (p) { return !p.hideFromNews; })
      .sort(byDateDesc)
      .slice(0, NEWS_LIMIT);
    if (latest.length === 0) return [tag("p", { "class": "empty", text: "Chưa có bài mới." })];
    var rows = latest.map(function (p) {
      return tag("tr", {}, [
        tag("td", { "class": "c-date", text: formatDate(p.date) }),
        tag("td", { "class": "c-sec" }, sectionCell(p)),
        tag("td", { "class": "c-title" }, [
          tag("a", postLink(p, { text: p.title })),
          badges && isRecent(p.date) ? badge() : null
        ])
      ]);
    });
    var thead = tag("thead", {}, [tag("tr", {}, [
      tag("th", { text: "Ngày" }),
      tag("th", { text: "Trang" }),
      tag("th", { text: "Bài mới" })
    ])]);
    return [tag("table", { "class": "news" }, [thead, tag("tbody", {}, rows)])];
  }

  function renderNews(container) {
    container.innerHTML = newsItems(true).join("");
  }

  /** Ngay moi nhat cua bai va moi bai con chau (parent long nhau), de trang cha cung bao "Moi". */
  function latestDate(p, depth) {
    if (depth > 5) return p.date;
    return posts.reduce(function (d, c) {
      if (c.parent !== p.href) return d;
      var cd = latestDate(c, depth + 1);
      return cd > d ? cd : d;
    }, p.date);
  }

  function rank(p) {
    return p.order == null ? -1 : p.order;
  }

  /** Bai that (khong phai thu muc) moi nhat ben duoi p, kem duong dan tieu de tu duoi p xuong, vd. ["Lý thuyết mạch", "Chương 2: ..."].
      Cung ngay: uu tien order lon hon (chuong sau), roi bai khai bao sau trong posts.js. */
  function latestLeaf(p, depth) {
    var best = null;
    if (depth > 5) return best;
    posts.forEach(function (c) {
      if (c.parent !== p.href) return;
      var sub = latestLeaf(c, depth + 1);
      // Trang thu muc (hideFromNews) chua co bai con thi khong tinh la bai.
      var cand = sub ? { post: sub.post, path: [c.title].concat(sub.path) } : c.hideFromNews ? null : { post: c, path: [c.title] };
      if (!cand) return;
      if (!best || cand.post.date > best.post.date ||
          (cand.post.date === best.post.date && rank(cand.post) >= rank(best.post))) best = cand;
    });
    return best;
  }

  function withActivity(p) {
    return Object.assign({}, p, { activity: latestDate(p, 0) });
  }

  function byActivityDesc(a, b) {
    return a.activity < b.activity ? 1 : a.activity > b.activity ? -1 : 0;
  }

  /** Bai co "order" (vd. 4 mon o trang On tap, 4 thu muc Nam nhat) dung yen theo thu tu do, dung truoc bai khong co. */
  function byOrderThenActivity(a, b) {
    var oa = a.order == null ? Infinity : a.order;
    var ob = b.order == null ? Infinity : b.order;
    return oa !== ob ? oa - ob : byActivityDesc(a, b);
  }

  /* data-section="ontap": bai cua trang muc; data-parent="/dientucoban": bai con cua 1 trang chua bai. */
  function listItems(key, parent, badges) {
    return posts
      .filter(function (p) { return parent ? p.parent === parent : p.section === key && !p.parent; })
      .map(withActivity)
      .sort(byOrderThenActivity)
      .map(function (p) {
        var updated = p.activity > p.date ? " · Cập nhật: " + formatDate(p.activity) : "";
        var recent = badges && isRecent(p.activity);
        var leaf = latestLeaf(p, 0);
        return tag("a", postLink(p, { "class": "card" }), [
          tag("h2", {}, [esc(p.title), recent ? badge() : null]),
          p.desc ? tag("p", { text: p.desc }) : null,
          leaf ? tag("p", { "class": "latest" }, [
            tag("b", { text: badges && isRecent(leaf.post.date) ? "Mới cập nhật: " : "Bài gần nhất: " }),
            esc(leaf.path.join(" › "))
          ]) : null,
          tag("span", { "class": "pub", text: "Ngày tạo: " + formatDate(p.date) + updated })
        ]);
      });
  }

  function renderSectionList(container) {
    var items = listItems(container.getAttribute("data-section"), container.getAttribute("data-parent"), true);
    if (items.length === 0) return;
    var empty = document.getElementById("emptyState");
    if (empty) empty.hidden = true;
    container.innerHTML = items.join("");
  }

  window.CT_RENDER = { pathKey: pathKey, menuItems: menuItems, newsItems: newsItems, listItems: listItems };

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
  var subForm = document.getElementById("subscribeForm");
  if (subForm) bindSubscribe(subForm);

  /* Form "Nhan bai moi qua email": POST /api/subscribe -> server gui thu xac nhan. */
  function bindSubscribe(form) {
    var msg = form.querySelector(".sub-msg");
    var button = form.querySelector("button");
    function show(text, kind) {
      msg.textContent = text;
      msg.setAttribute("data-kind", kind);
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = form.elements.email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return show("Email chưa đúng định dạng.", "error");
      button.disabled = true;
      show("Đang gửi…", "info");
      fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, website: form.elements.website.value })
      })
        .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
        .then(function (data) {
          if (data.ok) {
            show(data.message || "Đã gửi email xác nhận.", "ok");
            if (!data.already) form.elements.email.value = "";
          } else {
            show(data.message || "Không gửi được. Thử lại sau.", "error");
          }
        })
        .catch(function () { show("Mất kết nối. Thử lại sau.", "error"); })
        .then(function () { button.disabled = false; });
    });
  }
})();
