import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prerender } from '../scripts/prerender.mjs';

// Menu va danh sach bai phai ghi san trong HTML de bot khong chay JS (Gemini, Zalo...) van doc duoc.
test('HTML pages are prerendered from assets/posts.js', () => {
  const stale = prerender({ write: false });
  assert.deepEqual(stale, [], `Chạy "npm run prerender" để cập nhật: ${stale.join(', ')}`);
});
