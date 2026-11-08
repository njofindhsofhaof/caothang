/* Nút chuyển VI / EN cho bài lý thuyết.
 *
 * Trang bật bằng: <meta name="ct-i18n" content="/assets/i18n/<trang>.en.js"> + <script src="/assets/i18n.js" defer>.
 * File từ điển đặt window.CT_EN = { "<mã băm>": "<HTML tiếng Anh>" }. Mã băm = FNV-1a của nội dung tiếng Việt
 * đã gom khoảng trắng, nên sửa câu tiếng Việt thì câu đó tự quay về tiếng Việt (không hiện bản dịch cũ sai).
 *
 * Đơn vị dịch:
 *  - "khối lá": phần tử không phải inline, chỉ chứa nội dung inline, không chứa phần tử mà JS đang giữ
 *    (có id, input, output, button…) → thay cả innerHTML;
 *  - còn lại → thay từng nút chữ;
 *  - thuộc tính title / aria-label / alt.
 * Chữ do mô phỏng tự viết (phần tử có id trong figure.sim) và khối #quiz không đụng tới: các script đó
 * nghe sự kiện "ct:lang" rồi tự vẽ lại theo document.documentElement.lang.
 *
 * Trong console: CTI18N.collect() trả danh sách { h, vi } để làm file dịch. */
(function () {
  "use strict";
  var meta = document.querySelector('meta[name="ct-i18n"]');
  if (!meta) return;

  var STORAGE_KEY = "ct-lang";
  var root = document.documentElement;
  var DICT_URL = meta.getAttribute("content");
  var SCOPE = "header h1, #siteNav, article.post";
  /* Phần tử có id trong mô phỏng là chữ JS tự viết; riêng <title>/<desc> của SVG là chữ tĩnh, vẫn dịch. */
  var SIM_LIVE = ".sim [id]:not(title):not(desc)";
  var SKIP = "script, style, noscript, #quiz, output, " + SIM_LIVE;
  var LOCKED = "[id], input, select, textarea, output, button, iframe, video, canvas";
  var INLINE = /^(a|abbr|b|br|cite|code|dfn|em|i|img|kbd|mark|q|s|small|span|strong|sub|sup|time|u|var|wbr|tspan)$/i;
  var ATTRS = ["title", "aria-label", "alt"];

  /* Chữ của khung trang dùng chung, không nằm trong file từ điển từng bài. */
  var CHROME = {
    "Trang chủ": "Home", "Học tập": "Study", "Ôn tập": "Review", "Dự án": "Projects",
    "Hoạt động": "Activities", "Bài viết": "Articles", "Điểm danh": "Attendance",
    "Menu chính": "Main menu", "Mục lục": "Contents", "Cách đọc": "Vietnamese pronunciation"
  };

  function norm(s) { return s.replace(/\s+/g, " ").trim(); }

  function hash(s) {
    var h = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0).toString(36);
  }

  function isInline(el) { return INLINE.test(el.localName); }
  function skipped(el) { return el.closest(SKIP); }

  function pureInline(el) {
    var all = el.getElementsByTagName("*");
    for (var i = 0; i < all.length; i++) if (!isInline(all[i])) return false;
    return true;
  }

  function hasText(el) { return norm(el.textContent) !== ""; }

  /* Gọi visit(kind, target, viText) cho mọi đơn vị dịch, theo thứ tự trong trang. */
  function walk(visit) {
    var scopes = document.querySelectorAll(SCOPE);
    Array.prototype.forEach.call(scopes, function (s) { walkEl(s, visit); });
    Array.prototype.forEach.call(scopes, function (s) {
      var els = [s].concat(Array.prototype.slice.call(s.querySelectorAll("*")));
      els.forEach(function (el) {
        if (skipped(el)) return;
        ATTRS.forEach(function (a) {
          var v = el.getAttribute(a);
          if (v && norm(v)) visit("attr", { el: el, name: a }, norm(v));
        });
      });
    });
  }

  function walkEl(el, visit) {
    if (skipped(el)) return;
    if (!isInline(el) && hasText(el) && pureInline(el) && !el.querySelector(LOCKED) && !el.matches(SIM_LIVE)) {
      visit("html", el, norm(el.innerHTML));
      return;
    }
    Array.prototype.forEach.call(el.childNodes, function (n) {
      if (n.nodeType === 3) {
        if (norm(n.nodeValue)) visit("text", n, norm(n.nodeValue));
      } else if (n.nodeType === 1) {
        walkEl(n, visit);
      }
    });
  }

  var undo = [];

  function lookup(vi) {
    if (CHROME[vi]) return CHROME[vi];
    var d = window.CT_EN;
    return d ? d[hash(vi)] : undefined;
  }

  function toEnglish() {
    walk(function (kind, t, vi) {
      var en = lookup(vi);
      if (en === undefined) return;
      if (kind === "html") {
        undo.push([kind, t, t.innerHTML]);
        t.innerHTML = en;
      } else if (kind === "text") {
        var raw = t.nodeValue, lead = raw.match(/^\s*/)[0], tail = raw.match(/\s*$/)[0];
        undo.push([kind, t, raw]);
        t.nodeValue = lead + en + tail;
      } else {
        undo.push([kind, t, t.el.getAttribute(t.name)]);
        t.el.setAttribute(t.name, en);
      }
    });
    if (window.CT_EN && window.CT_EN.__title) {
      undo.push(["title", null, document.title]);
      document.title = window.CT_EN.__title;
    }
  }

  function toVietnamese() {
    for (var i = undo.length - 1; i >= 0; i--) {
      var u = undo[i];
      if (u[0] === "html") u[1].innerHTML = u[2];
      else if (u[0] === "text") u[1].nodeValue = u[2];
      else if (u[0] === "attr") u[1].el.setAttribute(u[1].name, u[2]);
      else document.title = u[2];
    }
    undo = [];
  }

  var dictPromise = null;
  function loadDict() {
    if (window.CT_EN) return Promise.resolve();
    if (dictPromise) return dictPromise;
    dictPromise = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = DICT_URL;
      s.onload = resolve;
      s.onerror = function () { dictPromise = null; reject(new Error("Không tải được bản dịch")); };
      document.head.appendChild(s);
    });
    return dictPromise;
  }

  function readStored() {
    try { return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "vi"; } catch (e) { return "vi"; }
  }
  function writeStored(lang) {
    try {
      if (lang === "en") localStorage.setItem(STORAGE_KEY, "en");
      else localStorage.removeItem(STORAGE_KEY);
    } catch (e) { /* chế độ riêng tư: vẫn đổi được trong trang */ }
  }

  function syncUrl(lang) {
    try {
      var u = new URL(location.href);
      if (lang === "en") u.searchParams.set("lang", "en");
      else u.searchParams.delete("lang");
      history.replaceState(history.state, "", u.pathname + u.search + u.hash);
    } catch (e) { /* trình duyệt cũ: bỏ qua, nút vẫn chạy */ }
  }

  var current = "vi", btn = null;

  function paintButton() {
    if (!btn) return;
    var en = current === "en";
    btn.setAttribute("aria-pressed", String(en));
    btn.setAttribute("aria-label", en ? "Chuyển sang tiếng Việt" : "Switch to English");
    btn.title = en ? "Tiếng Việt" : "English";
  }

  function setLang(lang) {
    if (lang === current) return Promise.resolve();
    var p = lang === "en" ? loadDict() : Promise.resolve();
    if (btn) btn.classList.add("busy");
    return p.then(function () {
      if (lang === "en") toEnglish(); else toVietnamese();
      current = lang;
      root.lang = lang;
      writeStored(lang);
      syncUrl(lang);
      paintButton();
      document.dispatchEvent(new CustomEvent("ct:lang", { detail: lang }));
    }).catch(function (err) {
      if (btn) btn.title = err.message;
    }).then(function () {
      if (btn) btn.classList.remove("busy");
    });
  }

  var STYLE =
    ".lang-toggle{position:absolute;top:8px;right:48px;z-index:50;display:inline-flex;align-items:center;" +
    "height:32px;padding:0 3px;gap:2px;border-radius:16px;cursor:pointer;font:600 11px/1 var(--mono,monospace);" +
    "letter-spacing:.04em;color:var(--ink-faint,#7E8F9B);background:var(--surface,#fff);border:1px solid var(--line,#D2DADE);" +
    "transition:border-color .15s,transform .15s;}" +
    ".lang-toggle span{padding:6px 7px;border-radius:12px;transition:background-color .15s,color .15s;}" +
    ".lang-toggle[aria-pressed=false] .l-vi,.lang-toggle[aria-pressed=true] .l-en{background:var(--accent,#2F6690);color:var(--accent-ink,#fff);}" +
    ".lang-toggle:hover{border-color:var(--accent,#2F6690);}" +
    ".lang-toggle:active{transform:scale(.95);}" +
    ".lang-toggle:focus-visible{outline:2px solid var(--accent,#2F6690);outline-offset:2px;}" +
    ".lang-toggle.busy{opacity:.6;cursor:progress;}" +
    ":root[lang=en] .say{display:none;}" +
    /* màn hẹp: tiêu đề chạy tới mép phải, chừa chỗ cho 2 nút nổi ở góc trên */
    "@media (max-width:640px){.wrap{padding-top:48px;}}" +
    "@media (prefers-reduced-motion:reduce){.lang-toggle,.lang-toggle span{transition:none;}}";

  function mountButton() {
    var st = document.createElement("style");
    st.textContent = STYLE;
    document.head.appendChild(st);
    btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lang-toggle";
    btn.innerHTML = '<span class="l-vi">VI</span><span class="l-en">EN</span>';
    btn.addEventListener("click", function () { setLang(current === "en" ? "vi" : "en"); });
    document.body.appendChild(btn);
    paintButton();
  }

  window.CTI18N = {
    hash: hash,
    setLang: setLang,
    collect: function () {
      var seen = {}, out = [];
      walk(function (kind, t, vi) {
        if (CHROME[vi]) return;
        var h = hash(vi);
        if (seen[h]) return;
        seen[h] = 1;
        out.push({ h: h, vi: vi });
      });
      return out;
    }
  };

  function start() {
    mountButton();
    var q = null;
    try { q = new URLSearchParams(location.search).get("lang"); } catch (e) { /* bỏ qua */ }
    var want = q === "en" || q === "vi" ? q : readStored();
    if (want === "en") setLang("en");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
