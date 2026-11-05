import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aliasMap, baseLetter, ANIMAL_WORDS } from '../api/_lib/alias.js';

const roster = [
  { mssv: '1', ho: 'Nguyễn Văn', ten: 'Anh' },
  { mssv: '2', ho: 'Đặng Kim Thiên', ten: 'Bảo' },
  { mssv: '3', ho: 'Trần Vũ', ten: 'Uy' },
  { mssv: '4', ho: 'Nguyễn Hoàng', ten: 'Huy' },
  { mssv: '5', ho: 'Nguyễn Hữu', ten: 'Huy' },
  { mssv: '6', ho: 'Nguyễn Hải', ten: 'Huy' },
  { mssv: '7', ho: 'Lê Trọng', ten: 'Ích' },
];

test('each alias word starts with the same letter as the real name word', () => {
  const map = aliasMap(roster);
  for (const s of roster) {
    const real = `${s.ho} ${s.ten}`.split(/\s+/);
    const fake = map.get(s.mssv).split(' ');
    assert.equal(fake.length, real.length, map.get(s.mssv));
    real.forEach((w, i) => assert.equal(baseLetter(fake[i]), baseLetter(w), `${w} -> ${fake[i]}`));
  }
});

test('aliases are unique within the class and stable across calls', () => {
  const a = aliasMap(roster);
  assert.equal(new Set(a.values()).size, roster.length);
  assert.deepEqual([...aliasMap([...roster].reverse())].sort(), [...a].sort());
});

test('aliases never contain the real given name', () => {
  const map = aliasMap(roster);
  for (const s of roster) assert.ok(!map.get(s.mssv).includes(s.ten), map.get(s.mssv));
});

test('the first word of every alias is an animal', () => {
  const map = aliasMap([...roster, { mssv: '8', ho: 'Phạm Huỳnh', ten: 'Chiêu' }, { mssv: '9', ho: 'Phan Hữu Hải', ten: 'Đăng' }, { mssv: '10', ho: 'Lê Trọng', ten: 'Tín' }]);
  for (const alias of map.values()) assert.ok(ANIMAL_WORDS.has(alias.split(' ')[0]), alias);
});
