import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aliasMap, baseLetter, ANIMAL_WORDS, nameKey } from '../api/_lib/alias.js';
import { FIXED_ALIASES } from '../api/_lib/alias-fixed.js';

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

test('a fixed alias overrides the generated one, matched by name regardless of accents and spacing', () => {
  const overrides = new Map([[nameKey('Tran  Thi Mo'), 'Thỏ Tím Mây']]);
  const map = aliasMap([{ mssv: '1', ho: 'Trần Thị', ten: 'Mơ' }, { mssv: '2', ho: 'Lê Văn', ten: 'Tý' }], overrides);
  assert.equal(map.get('1'), 'Thỏ Tím Mây');
  assert.ok(ANIMAL_WORDS.has(map.get('2').split(' ')[0]));
});

test('a duplicated fixed alias goes to the lower MSSV; the other gets a generated one', () => {
  const overrides = new Map([[nameKey('Le Van Ty'), 'Lừa Vui Trăng'], [nameKey('Lam Van Tu'), 'Lừa Vui Trăng']]);
  const map = aliasMap([{ mssv: '2', ho: 'Lâm Văn', ten: 'Tú' }, { mssv: '1', ho: 'Lê Văn', ten: 'Tý' }], overrides);
  assert.equal(map.get('1'), 'Lừa Vui Trăng');
  assert.notEqual(map.get('2'), 'Lừa Vui Trăng');
});

test('the built-in fixed aliases are unique and start with an animal', () => {
  const values = [...FIXED_ALIASES.values()];
  for (const a of values) assert.ok(ANIMAL_WORDS.has(a.split(' ')[0]), a);
  assert.equal(new Set(values).size, values.length);
  assert.ok(values.length >= 100);
});
