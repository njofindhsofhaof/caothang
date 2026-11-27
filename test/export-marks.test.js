import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// assets/diemdanh-xlsx.js là script trình duyệt (gắn window.DDXlsx): nạp trong một window giả.
const window = {};
new Function('window', readFileSync(new URL('../assets/diemdanh-xlsx.js', import.meta.url), 'utf8'))(window);
const { exportMarks, notInRoster } = window.DDXlsx;

// Ngày 2026-11-23: bạn 1 có mặt, bạn 2 có phép, còn lại không có bản ghi → K.
const statusOn = () => (mssv) => ({ 100000001: 'ok', 100000002: 'P' }[mssv] ?? 'K');

test('students in the school template but missing from the web roster are marked absent, not left blank', () => {
  const marks = exportMarks({ dates: ['2026-11-23'], mssvs: ['100000001', '100000002', '100000099'], statusOn });
  assert.deepEqual(marks, { 100000002: { 23: 'P' }, 100000099: { 23: 'K' } });
});

test('a template MSSV typed with a leading zero still matches', () => {
  const marks = exportMarks({ dates: ['2026-11-23'], mssvs: ['0100000099'], statusOn });
  assert.deepEqual(marks, { 100000099: { 23: 'K' } });
});

test('late counts as present in the export', () => {
  const marks = exportMarks({ dates: ['2026-11-23'], mssvs: ['100000003'], statusOn: () => () => 'T' });
  assert.deepEqual(marks, {});
});

test('notInRoster lists template students the web roster does not have', () => {
  const template = [{ mssv: '0100000001', ho: 'A', ten: 'An' }, { mssv: '100000099', ho: 'Trần Văn', ten: 'B' }];
  const roster = [{ mssv: '100000001' }];
  assert.deepEqual(notInRoster(template, roster).map((s) => s.mssv), ['100000099']);
});
