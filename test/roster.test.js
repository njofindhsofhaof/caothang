import { test } from 'node:test';
import assert from 'node:assert/strict';
import { removeStudent } from '../api/roster.js';

const roster = [
  { stt: 1, mssv: '100000001', ho: 'Nguyễn Văn', ten: 'A' },
  { stt: 2, mssv: '100000002', ho: 'Lê Thị', ten: 'B' },
  { stt: 3, mssv: '100000003', ho: 'Trần Văn', ten: 'C' },
];

test('removes the student and renumbers STT without touching the input', () => {
  const after = removeStudent(roster, '100000002');
  assert.deepEqual(after.map((s) => [s.stt, s.mssv]), [[1, '100000001'], [2, '100000003']]);
  assert.equal(roster.length, 3);
});

test('leaves the roster unchanged for an unknown MSSV', () => {
  assert.equal(removeStudent(roster, '999999999').length, 3);
});
