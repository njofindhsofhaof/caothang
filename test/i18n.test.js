import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';

// Moi trang co nut VI/EN (assets/i18n.js): the meta ct-i18n tro toi tu dien co that, nap common.en.js.
// Bo qua file xac minh Google va trang PIN giao vien.
const root = new URL('..', import.meta.url);
const SKIP = /^(google[0-9a-f]+|diemdanh-gv)\.html$/;
const pages = readdirSync(root).filter((f) => f.endsWith('.html') && !SKIP.test(f));

function loadDict(path) {
  const ctx = { window: {} };
  vm.runInNewContext(readFileSync(new URL('..' + path, import.meta.url), 'utf8'), ctx);
  return ctx.window.CT_EN;
}

test('every page loads the VI/EN toggle with existing dictionaries', () => {
  for (const f of pages) {
    const src = readFileSync(new URL(f, root), 'utf8');
    const m = src.match(/<meta name="ct-i18n" content="([^"]+)">/);
    assert.ok(m, `${f} thiếu <meta name="ct-i18n">`);
    assert.match(src, /<script src="\/assets\/i18n\.js[^"]*" defer><\/script>/, `${f} thiếu script i18n.js`);
    const files = m[1].split(/\s+/).map((u) => u.split('?')[0]);
    assert.equal(files[0], '/assets/i18n/common.en.js', `${f}: common.en.js phải nạp đầu tiên`);
    for (const p of files) assert.ok(existsSync(new URL('..' + p, import.meta.url)), `${f}: không có ${p}`);
  }
});

test('dictionaries parse and keep {n} placeholders consistent', () => {
  const dir = new URL('assets/i18n/', root);
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.en.js'))) {
    const d = loadDict('/assets/i18n/' + f);
    assert.ok(d && typeof d === 'object', `${f} không đặt window.CT_EN`);
    for (const [k, v] of Object.entries(d)) {
      if (k === '__phrases') {
        for (const p of v) assert.ok(Array.isArray(p) && p.length === 2, `${f}: cụm từ sai dạng`);
        continue;
      }
      assert.equal(typeof v, 'string', `${f}: ${k} không phải chuỗi`);
      if (!k.startsWith('~')) continue;
      const used = [...v.matchAll(/\{(\d+)\}/g)].map((x) => +x[1]);
      for (const i of used) assert.ok(i < 40, `${f}: ${k} dùng {${i}} bất thường`);
    }
  }
});
