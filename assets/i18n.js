/* Nút chuyển VI / EN cho mọi trang.
 *
 * Trang bật bằng: <meta name="ct-i18n" content="/assets/i18n/common.en.js /assets/i18n/<trang>.en.js">
 * (nhiều file cách nhau bởi dấu cách; common.en.js chứa chữ dùng chung nhiều trang: menu, chân trang, tên bài…)
 * + <script src="/assets/i18n.js" defer>.
 * Mỗi file từ điển đặt window.CT_EN = { "<khoá>": "<HTML tiếng Anh>" }; loader gộp lần lượt các file.
 *  - khoá thường = mã băm FNV-1a của nội dung tiếng Việt đã gom khoảng trắng;
 *  - khoá "~<mã băm>" = mẫu có số: mọi cụm số trong câu tiếng Việt thay bằng {0}, {1}… trước khi băm, bản
 *    tiếng Anh dùng lại {0}, {1}… nên câu do JS sinh ra với số ngẫu nhiên (đề bài, điểm…) vẫn dịch được.
 * Sửa câu tiếng Việt thì câu đó tự quay về tiếng Việt (không hiện bản dịch cũ sai).
 *
 * Đơn vị dịch (trong <body>):
 *  - "khối lá": phần tử không phải inline, chỉ chứa nội dung inline, không chứa phần tử mà JS đang giữ
 *    (có id, input, output, button…) → thay cả innerHTML;
 *  - còn lại → thay từng nút chữ;
 *  - thuộc tính title / aria-label / alt / placeholder.
 * Câu không có trong từ điển thì thử ghép từ danh sách cụm từ "__phrases" (chỉ nhận khi dịch hết chữ Việt).
 * Khi đang ở tiếng Anh, MutationObserver dịch luôn phần JS vẽ thêm (bài tập, kết quả chấm, bảng điểm…).
 * Chữ do mô phỏng tự viết (phần tử có id trong figure.sim), khối #quiz và phần tử [data-i18n="off"] không
 * đụng tới: các script đó nghe sự kiện "ct:lang" rồi tự vẽ lại theo document.documentElement.lang.
 *
 * Trong console: CTI18N.collect() trả danh sách { k, vi } chưa có bản dịch để làm file dịch. */
(function () {
  "use strict";
  var meta = document.querySelector('meta[name="ct-i18n"]');
  if (!meta) return;

  var STORAGE_KEY = "ct-lang";
  var root = document.documentElement;
  var DICT_URLS = meta.getAttribute("content").split(/\s+/).filter(Boolean);
  /* Phần tử có id trong mô phỏng là chữ JS tự viết (mô phỏng tự vẽ lại theo "ct:lang"); riêng <title>/<desc> của SVG
     là chữ tĩnh, vẫn dịch. Mô phỏng không tự đổi ngôn ngữ thì gắn data-i18n="auto" để dịch như chữ thường. */
  var SIM_LIVE = ".sim:not([data-i18n=auto]) [id]:not(title):not(desc)";
  var SKIP = "script, style, noscript, template, #quiz, output, .lang-toggle, [data-i18n=off], " + SIM_LIVE;
  var LOCKED = "[id], input, select, textarea, output, button, iframe, video, canvas";
  var INLINE = /^(a|abbr|b|br|cite|code|dfn|em|i|img|kbd|mark|q|s|small|span|strong|sub|sup|time|u|var|wbr|tspan)$/i;
  var ATTRS = ["title", "aria-label", "alt", "placeholder"];
  var NUM = /\d+(?:[.,]\d+)*/g;
  var VI_CHARS = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;

  /* Chữ của khung trang dùng chung. */
  var CHROME = {
    "Trang chủ": "Home", "Học tập": "Study", "Ôn tập": "Review", "Dự án": "Projects",
    "Hoạt động": "Activities", "Bài viết": "Articles", "Điểm danh": "Attendance",
    "Menu chính": "Main menu", "Mục lục": "Contents", "Cách đọc": "Vietnamese pronunciation",
    /* nút giao diện cũ (không dấu) ở /vongmaudientro, /testdauvaotienganh */
    "Giao dien: He thong": "Theme: System", "Giao dien: Sang": "Theme: Light", "Giao dien: Toi": "Theme: Dark"
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

  /* "Bài 12: R = 4,7 kΩ" → mẫu "Bài {0}: R = {1} kΩ" + số ["12", "4,7"]. */
  function template(s) {
    var nums = [], i = 0;
    var tpl = s.replace(NUM, function (m) { nums.push(m); return "{" + (i++) + "}"; });
    return { tpl: tpl, nums: nums };
  }

  function isInline(el) { return INLINE.test(el.localName); }
  function skipped(el) { return el.closest(SKIP); }

  function pureInline(el) {
    var all = el.getElementsByTagName("*");
    for (var i = 0; i < all.length; i++) if (!isInline(all[i])) return false;
    return true;
  }

  function hasText(el) { return norm(el.textContent) !== ""; }

  function visitAttrs(el, visit) {
    var els = [el].concat(Array.prototype.slice.call(el.querySelectorAll("*")));
    els.forEach(function (x) {
      if (skipped(x)) return;
      ATTRS.forEach(function (a) {
        var v = x.getAttribute(a);
        if (v && norm(v)) visit("attr", { el: x, name: a }, norm(v));
      });
    });
  }

  /* Gọi visit(kind, target, viText) cho mọi đơn vị dịch trong el, theo thứ tự trong trang. */
  function walk(el, visit) {
    walkEl(el, visit);
    visitAttrs(el, visit);
  }

  /* Khối lá có số trong thuộc tính thẻ (màu style="#E…", toạ độ x="12"…; trừ href) thì mỗi tổ hợp là một mẫu
     riêng: nếu không có bản dịch nguyên khối thì dịch từng nút chữ bên trong. */
  var DIGIT_IN_TAG = /<[^>]*\s(?!href=)[\w:-]+="[^"]*\d/;

  function walkEl(el, visit) {
    if (skipped(el)) return;
    if (!isInline(el) && hasText(el) && pureInline(el) && !el.querySelector(LOCKED) && !el.matches(SIM_LIVE)) {
      var html = norm(el.innerHTML);
      if (visit("html", el, html) !== false || !DIGIT_IN_TAG.test(html)) return;
    }
    Array.prototype.forEach.call(el.childNodes, function (n) {
      if (n.nodeType === 3) {
        if (norm(n.nodeValue)) visit("text", n, norm(n.nodeValue));
      } else if (n.nodeType === 1) {
        walkEl(n, visit);
      }
    });
  }

  var DICT = {};
  var undo = [];

  /* Cụm từ (từ điển "__phrases": [[vi, en], …]) cho câu do JS ghép (lời giải từng bước…): thay từng cụm trong phần
     chữ (không đụng thẻ HTML), cụm dài trước. Chỉ dùng khi thay xong không còn chữ tiếng Việt nào. */
  var PHRASES = [], phraseRe = null, phraseMap = {};

  function buildPhrases() {
    phraseRe = null;
    phraseMap = {};
    if (!PHRASES.length) return;
    PHRASES.forEach(function (p) { phraseMap[p[0]] = p[1]; });
    var keys = Object.keys(phraseMap).sort(function (a, b) { return b.length - a.length; });
    var alts = keys.map(function (k) { return k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }).join("|");
    try { phraseRe = new RegExp("(^|[^\\p{L}])(" + alts + ")(?![\\p{L}])", "gu"); } catch (e) { phraseRe = null; }
  }

  function byPhrases(vi) {
    if (!phraseRe) return undefined;
    var out = vi.split(/(<[^>]*>)/).map(function (part, i) {
      if (i % 2) return part;
      return part.replace(phraseRe, function (m, pre, w) { return pre + phraseMap[w]; });
    }).join("");
    return VI_CHARS.test(out.replace(/<[^>]*>/g, "")) ? undefined : out;
  }

  function lookup(vi) {
    if (CHROME[vi]) return CHROME[vi];
    var en = DICT[hash(vi)];
    if (en !== undefined) return en;
    if (/\d/.test(vi)) {
      var t = template(vi);
      en = DICT["~" + hash(t.tpl)];
      if (en !== undefined) {
        return en.replace(/\{(\d+)\}/g, function (m, i) { return t.nums[+i] !== undefined ? t.nums[+i] : m; });
      }
    }
    return byPhrases(vi);
  }

  /* Trả false khi không có bản dịch (để walkEl thử dịch từng phần nhỏ hơn). */
  function apply(kind, t, vi) {
    if (!VI_CHARS.test(vi) && !CHROME[vi]) return false;
    var en = lookup(vi);
    if (en === undefined) return false;
    if (kind === "html") {
      undo.push([kind, t, t.innerHTML, en]);
      t.innerHTML = en;
    } else if (kind === "text") {
      var raw = t.nodeValue, lead = raw.match(/^\s*/)[0], tail = raw.match(/\s*$/)[0];
      t.nodeValue = lead + en + tail;
      undo.push([kind, t, raw, t.nodeValue]);
    } else {
      undo.push([kind, t, t.el.getAttribute(t.name), en]);
      t.el.setAttribute(t.name, en);
    }
  }

  function toEnglish() {
    walk(document.body, apply);
    var title = DICT.__title || titleEn(document.title);
    if (title) {
      undo.push(["title", null, document.title]);
      document.title = title;
    }
  }

  /* <title> không có __title thì dịch từng phần ngăn bởi " · " (tên bài · tên site). */
  function titleEn(t) {
    var parts = norm(t).split(" · ").map(function (p) { return VI_CHARS.test(p) ? lookup(p) : p; });
    return parts.some(function (p) { return p === undefined; }) ? undefined : parts.join(" · ");
  }

  /* Chỉ trả lại tiếng Việt cho chỗ vẫn còn đúng chữ mình đã đặt; JS đã vẽ lại thì để nguyên. */
  function toVietnamese() {
    for (var i = undo.length - 1; i >= 0; i--) {
      var u = undo[i], t = u[1];
      if (u[0] === "html") { if (t.innerHTML === u[3]) t.innerHTML = u[2]; }
      else if (u[0] === "text") { if (t.nodeValue === u[3]) t.nodeValue = u[2]; }
      else if (u[0] === "attr") { if (t.el.getAttribute(t.name) === u[3]) t.el.setAttribute(t.name, u[2]); }
      else document.title = u[2];
    }
    undo = [];
  }

  /* ---------- phần JS vẽ thêm khi đang ở tiếng Anh ---------- */
  var observer = null, pending = [], queued = false;

  function unitRoot(node) {
    var el = node.nodeType === 1 ? node : node.parentNode;
    while (el && el.nodeType === 1 && isInline(el) && el !== document.body) el = el.parentNode;
    return el && el.nodeType === 1 ? el : null;
  }

  function flush() {
    queued = false;
    var roots = pending;
    pending = [];
    roots.forEach(function (el) {
      if (!el.isConnected || skipped(el)) return;
      walk(el, apply);
    });
    if (observer) observer.takeRecords();
    if (undo.length > 4000) undo = undo.filter(function (u) { return !u[1] || (u[1].el || u[1]).isConnected; });
  }

  function onMutate(list) {
    list.forEach(function (m) {
      var el = m.type === "attributes" ? m.target : unitRoot(m.target);
      if (el && pending.indexOf(el) < 0) pending.push(el);
    });
    if (pending.length && !queued) {
      queued = true;
      Promise.resolve().then(flush);
    }
  }

  function watch(on) {
    if (typeof MutationObserver === "undefined") return;
    if (on && !observer) {
      observer = new MutationObserver(onMutate);
      observer.observe(document.body, {
        childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS
      });
    } else if (!on && observer) {
      observer.disconnect();
      observer = null;
      pending = [];
    }
  }

  /* ---------- tải từ điển ---------- */
  function loadScript(url) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = url;
      s.onload = function () {
        var d = window.CT_EN || {};
        window.CT_EN = undefined;
        Object.keys(d).forEach(function (k) {
          if (k === "__phrases") PHRASES = PHRASES.concat(d[k]);
          else DICT[k] = d[k];
        });
        buildPhrases();
        resolve();
      };
      s.onerror = function () { reject(new Error("Không tải được bản dịch")); };
      document.head.appendChild(s);
    });
  }

  var dictPromise = null;
  function loadDict() {
    if (dictPromise) return dictPromise;
    dictPromise = DICT_URLS.reduce(function (p, url) {
      return p.then(function () { return loadScript(url); });
    }, Promise.resolve());
    dictPromise.catch(function () { dictPromise = null; });
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
      watch(false);
      current = lang;
      root.lang = lang;
      /* Báo trước để mô phỏng / trắc nghiệm / bài tập vẽ lại theo ngôn ngữ mới, rồi mới dịch phần còn lại. */
      document.dispatchEvent(new CustomEvent("ct:lang", { detail: lang }));
      if (lang === "en") { toEnglish(); watch(true); } else toVietnamese();
      writeStored(lang);
      syncUrl(lang);
      paintButton();
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
    template: template,
    setLang: setLang,
    load: loadDict,
    /* Bản tiếng Anh của một câu (undefined nếu chưa có), dùng để kiểm tra từ điển. */
    t: function (vi) { return lookup(norm(vi)); },
    /* Đơn vị tiếng Việt chưa có bản dịch: { k: khoá, vi: chữ (hoặc mẫu có {0}…) }. */
    collect: function (all) {
      var seen = {}, out = [];
      walk(document.body, function (kind, t, vi) {
        if (kind === "html" && DIGIT_IN_TAG.test(vi) && (all || lookup(vi) === undefined)) return false;
        if (!VI_CHARS.test(vi) || CHROME[vi]) return;
        if (!all && lookup(vi) !== undefined) return;
        var k = hash(vi), text = vi;
        if (/\d/.test(vi)) { text = template(vi).tpl; k = "~" + hash(text); }
        if (seen[k]) return;
        seen[k] = 1;
        out.push({ k: k, vi: text });
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
