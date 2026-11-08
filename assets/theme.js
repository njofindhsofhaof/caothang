/* Nút đổi nền sáng / tối.
 * Nạp đồng bộ trong <head> của mọi trang để áp chế độ đã chọn trước khi vẽ (không nháy trắng).
 * Mặc định theo cài đặt máy; bấm nút thì ghi nhớ lựa chọn trong localStorage.
 * Nếu chọn trùng với cài đặt máy thì xoá ghi nhớ, quay lại tự theo máy.
 * CSS các trang đã có sẵn: :root[data-theme="dark"] và @media (dark) :root:not([data-theme="light"]). */
(function () {
  var STORAGE_KEY = "ct-theme";
  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function readStored() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      return v === "light" || v === "dark" ? v : null;
    } catch (e) {
      return null;
    }
  }

  function writeStored(value) {
    try {
      if (value) localStorage.setItem(STORAGE_KEY, value);
      else localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      /* chế độ riêng tư chặn lưu: vẫn đổi được trong trang hiện tại */
    }
  }

  function systemTheme() {
    return media && media.matches ? "dark" : "light";
  }

  function apply(choice) {
    if (choice) {
      root.setAttribute("data-theme", choice);
      root.style.colorScheme = choice;
    } else {
      root.removeAttribute("data-theme");
      root.style.colorScheme = "";
    }
  }

  function currentTheme() {
    return root.getAttribute("data-theme") || systemTheme();
  }

  apply(readStored());

  var ICON_MOON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="currentColor"/></svg>';
  var ICON_SUN = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></g></svg>';

  var STYLE =
    ".theme-toggle{position:absolute;top:8px;right:8px;z-index:50;" +
    "display:inline-flex;align-items:center;justify-content:center;" +
    "width:32px;height:32px;padding:0;border-radius:50%;cursor:pointer;" +
    "color:var(--ink-soft,#51626F);background:var(--surface,#fff);border:1px solid var(--line,#D2DADE);" +
    "transition:border-color .15s,color .15s,transform .15s;}" +
    ".theme-toggle:hover{border-color:var(--accent,#2F6690);color:var(--accent,#2F6690);}" +
    ".theme-toggle:active{transform:scale(.92);}" +
    ".theme-toggle:focus-visible{outline:2px solid var(--accent,#2F6690);outline-offset:2px;}" +
    "@media print{.theme-toggle{display:none;}}";

  function render(button) {
    var isDark = currentTheme() === "dark";
    button.innerHTML = isDark ? ICON_SUN : ICON_MOON;
    button.title = isDark ? "Nền sáng" : "Nền tối";
    button.setAttribute("aria-label", isDark ? "Chuyển sang nền sáng" : "Chuyển sang nền tối");
    button.setAttribute("aria-pressed", isDark ? "true" : "false");
  }

  function mount() {
    if (!document.body || document.querySelector(".theme-toggle")) return;

    var style = document.createElement("style");
    style.textContent = STYLE;
    document.head.appendChild(style);

    var button = document.createElement("button");
    button.type = "button";
    button.className = "theme-toggle";
    render(button);

    button.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      var choice = next === systemTheme() ? null : next;
      apply(choice);
      writeStored(choice);
      render(button);
    });

    if (media) {
      var onSystemChange = function () { render(button); };
      if (media.addEventListener) media.addEventListener("change", onSystemChange);
      else if (media.addListener) media.addListener(onSystemChange);
    }

    document.body.appendChild(button);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
