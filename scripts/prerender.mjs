/* Ghi san menu, bang "Bai moi" va danh sach bai (tu assets/posts.js) vao cac trang .html,
   de bot doc link khong chay JavaScript (Gemini, ChatGPT, Zalo, Facebook...) van thay noi dung.
   Dung chung ham ve voi trinh duyet (window.CT_RENDER trong assets/site.js).
   Chay: npm run prerender (Vercel cung tu chay qua "npm run build" moi lan deploy).
   test/prerender.test.js bao loi neu HTML chua cap nhat theo posts.js. */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = new URL('..', import.meta.url);

function loadRender() {
  const window = {};
  const ctx = vm.createContext({ window, document: { getElementById: () => null } });
  for (const f of ['assets/posts.js', 'assets/site.js']) {
    vm.runInContext(readFileSync(new URL(f, root), 'utf8'), ctx, { filename: f });
  }
  return window.CT_RENDER;
}

/** Thay noi dung ben trong <nav|div ... id="ID" ...>...</nav|div> (khoi khong long the cung ten). */
function fill(html, id, items, indent) {
  const re = new RegExp(`(<(nav|div)\\b[^>]*\\bid="${id}"[^>]*>)[\\s\\S]*?(</\\2>)`);
  const inner = items.length ? '\n' + items.map((x) => indent + '  ' + x).join('\n') + '\n' + indent : '';
  return html.replace(re, (_, open, _tag, close) => open + inner + close);
}

function attr(openTag, name) {
  const m = openTag.match(new RegExp(`\\b${name}="([^"]*)"`));
  return m ? m[1] : null;
}

export function render(file, html, R) {
  const here = R.pathKey('/' + file);
  const indentOf = (id) => (html.match(new RegExp(`\\n([ \\t]*)<[^>\\n]*\\bid="${id}"`)) || [, ''])[1];
  let out = html;
  if (out.includes('id="siteNav"')) out = fill(out, 'siteNav', R.menuItems(here), indentOf('siteNav'));
  if (out.includes('id="newsBoard"')) out = fill(out, 'newsBoard', R.newsItems(false), indentOf('newsBoard'));
  const listTag = out.match(/<div\b[^>]*\bid="postList"[^>]*>/);
  if (listTag) {
    const items = R.listItems(attr(listTag[0], 'data-section'), attr(listTag[0], 'data-parent'), false);
    out = fill(out, 'postList', items, indentOf('postList'));
    out = out.replace(/(<p\b[^>]*\bid="emptyState")( hidden)?>/, (_, p) => p + (items.length ? ' hidden' : '') + '>');
  }
  return out;
}

/** Tra ve danh sach file can (hoac da) cap nhat. */
export function prerender({ write = true } = {}) {
  const R = loadRender();
  const changed = [];
  for (const f of readdirSync(root).filter((x) => x.endsWith('.html')).sort()) {
    const url = new URL(f, root);
    const html = readFileSync(url, 'utf8');
    const out = render(f, html, R);
    if (out !== html) {
      changed.push(f);
      if (write) writeFileSync(url, out);
    }
  }
  return changed;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const changed = prerender();
  console.log(changed.length ? `prerender: cập nhật ${changed.length} trang: ${changed.join(', ')}` : 'prerender: đã khớp posts.js');
}
