import { test } from 'node:test';
import assert from 'node:assert/strict';
import { removeStudent, shortName, addStudent } from '../api/roster.js';

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

test('shortName keeps only the given name in full and initials for the rest', () => {
  assert.equal(shortName('Nguyễn Thế', 'Anh'), 'N. T. Anh');
  assert.equal(shortName('Đặng Kim Thiên', 'Bảo'), 'Đ. K. T. Bảo');
  assert.equal(shortName('', 'Uy'), 'Uy');
  assert.equal(shortName('  Trần   Vũ ', ' Uy '), 'T. V. Uy');
});

test('addStudent inserts by MSSV like the school list and renumbers STT without touching the input', () => {
  const without = removeStudent(roster, '100000002');
  const { roster: after, error } = addStudent(without, { mssv: '0100000002', ho: ' Phạm  Văn ', ten: 'D' });
  assert.equal(error, undefined);
  assert.deepEqual(after.map((s) => [s.stt, s.mssv, s.ho]), [[1, '100000001', 'Nguyễn Văn'], [2, '100000002', 'Phạm Văn'], [3, '100000003', 'Trần Văn']]);
  assert.equal(without.length, 2);
});

test('addStudent appends a MSSV larger than everyone', () => {
  const { roster: after } = addStudent(roster, { mssv: '100000009', ho: 'Lê', ten: 'E' });
  assert.deepEqual(after.at(-1), { stt: 4, mssv: '100000009', ho: 'Lê', ten: 'E' });
});

test('addStudent rejects a duplicate, a bad MSSV or a missing name', () => {
  assert.match(addStudent(roster, { mssv: '100000002', ho: 'X', ten: 'Y' }).error, /đã có/);
  assert.match(addStudent(roster, { mssv: '12ab', ho: 'X', ten: 'Y' }).error, /MSSV/);
  assert.match(addStudent(roster, { mssv: '100000008', ho: 'X', ten: ' ' }).error, /tên/);
});
