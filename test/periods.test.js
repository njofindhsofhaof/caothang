import { test } from 'node:test';
import assert from 'node:assert/strict';
import { periodAt, lateUntil } from '../api/_lib/periods.js';

// Giờ Việt Nam (UTC+7) của ngày 2026-11-04.
const vn = (hhmm) => Date.parse(`2026-11-04T${hhmm}:00+07:00`);

test('periods run 12:30–17:00 in 45-minute blocks', () => {
  assert.deepEqual(periodAt(vn('12:30')), { index: 1, startsAt: vn('12:30'), endsAt: vn('13:15') });
  assert.equal(periodAt(vn('13:14')).index, 1);
  assert.equal(periodAt(vn('13:15')).index, 2);
  assert.deepEqual(periodAt(vn('16:59')), { index: 6, startsAt: vn('16:15'), endsAt: vn('17:00') });
});

test('no period outside class hours', () => {
  assert.equal(periodAt(vn('12:29')), null);
  assert.equal(periodAt(vn('17:00')), null);
  assert.equal(periodAt(vn('08:00')), null);
});

test('late window ends with the period the session ends in', () => {
  assert.equal(lateUntil({ expiresAt: vn('12:45') }), vn('13:15'));
  assert.equal(lateUntil({ expiresAt: vn('14:10') }), vn('14:45'));
});

test('no late window when the session ends on a period boundary or outside class hours', () => {
  assert.equal(lateUntil({ expiresAt: vn('13:15') }), vn('13:15'));
  assert.equal(lateUntil({ expiresAt: vn('09:00') }), vn('09:00'));
});
