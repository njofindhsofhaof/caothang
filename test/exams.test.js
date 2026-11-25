import { test } from 'node:test';
import assert from 'node:assert/strict';
import { upcomingExams, EXAMS } from '../api/_lib/exams.js';

test('lists exams from today onwards, earliest first', () => {
  const list = [{ date: '2026-12-09', subject: 'B' }, { date: '2026-12-07', subject: 'A' }, { date: '2026-11-01', subject: 'old' }];
  assert.deepEqual(upcomingExams('2026-12-07', list).map((e) => e.subject), ['A', 'B']);
  assert.deepEqual(upcomingExams('2026-12-08', list).map((e) => e.subject), ['B']);
  assert.deepEqual(upcomingExams('2026-12-10', list), []);
});

test('the class exam schedule uses valid dates and standard subject names', async () => {
  await import('../assets/subjects.js');
  const { readFileSync } = await import('node:fs');
  const ctx = { window: {} };
  new Function('window', readFileSync(new URL('../assets/posts.js', import.meta.url), 'utf8'))(ctx.window);
  const posts = ctx.window.CT_POSTS;
  for (const e of EXAMS) {
    assert.match(e.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(globalThis.DDSubjects.SUBJECTS.includes(e.subject), e.subject);
    for (const href of e.review ?? []) assert.ok(posts.some((p) => p.href === href), `${href} có trong posts.js`);
  }
});
