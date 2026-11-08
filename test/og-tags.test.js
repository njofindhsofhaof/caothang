import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';

// Moi trang can the og de khi dan link vao Zalo/Facebook hien tieu de + anh xem truoc.
const pages = readdirSync(new URL('..', import.meta.url)).filter((f) => f.endsWith('.html') && !/^google[0-9a-f]+\.html$/.test(f)); // bo file xac minh Google Search Console

test('every page has description and Open Graph preview tags', () => {
  for (const f of pages) {
    const src = readFileSync(new URL('../' + f, import.meta.url), 'utf8');
    for (const tag of ['name="description"', 'property="og:title"', 'property="og:description"', 'property="og:image"', 'property="og:url"', 'rel="canonical"', 'rel="icon"']) {
      assert.ok(src.includes(tag), `${f} thiếu ${tag}`);
    }
  }
});
