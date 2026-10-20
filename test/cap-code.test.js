import { test } from 'node:test';
import assert from 'node:assert/strict';

globalThis.window = globalThis;
await import('../assets/cap-code.js');
await import('../assets/cap-data.js');
const { decode, parseValue, sameValue, formatCap, allUnits, explain, encode } = globalThis.CAP_CODE;
const sets = globalThis.CAP_SETS;

// Gia tri pF theo dap an trong de (Phan 1, a→l).
const READ_PF = [
  [8, 68, 100, 2200, 4700, 1e4, 33e3, 1e5, 22e4, 47e4, 1e6, 22],
  [5, 47, 150, 3300, 6800, 22e3, 47e3, 15e4, 33e4, 68e4, 22e5, 10],
  [4, 33, 220, 1e3, 5600, 15e3, 68e3, 2e5, 27e4, 56e4, 33e5, 47],
  [2, 27, 330, 1200, 8200, 12e3, 56e3, 12e4, 39e4, 82e4, 47e5, 33],
  [6, 18, 470, 1800, 3900, 18e3, 82e3, 18e4, 5e5, 68e4, 68e5, 56],
  [9, 15, 680, 2700, 5e3, 27e3, 5e4, 25e4, 6e5, 75e4, 1e7, 82]
];

test('decodes 1-2 digit, 3 digit and zero-exponent codes', () => {
  assert.deepEqual(decode('8J'), { pf: 8, letter: 'J', tol: 5 });
  assert.deepEqual(decode('472j'), { pf: 4700, letter: 'J', tol: 5 });
  assert.equal(decode('220K').pf, 22);
  assert.equal(decode('106K').pf, 1e7);
  assert.equal(decode('47'), null);
  assert.equal(decode('4722J'), null);
});

test('every read code matches the published answer key', () => {
  sets.forEach((s, i) => {
    assert.equal(s.read.length, 12);
    assert.deepEqual(s.read.map((c) => decode(c).pf), READ_PF[i], s.title);
  });
});

test('every write answer decodes to its value and tolerance, and is the shortest code', () => {
  for (const s of sets) {
    assert.equal(s.write.length, 12);
    for (const [pf, letter, code] of s.write) {
      const d = decode(code);
      assert.ok(sameValue(d.pf, pf) && d.letter === letter, `${s.title} ${code}`);
      assert.equal(encode(pf, letter), code);
    }
  }
});

test('parses values with or without units', () => {
  assert.equal(parseValue('4700'), 4700);
  assert.equal(parseValue('4.700'), 4700);
  assert.equal(parseValue('4,7nF'), 4700);
  assert.equal(parseValue('4.7 nF'), 4700);
  assert.equal(parseValue('0,1uF'), 1e5);
  assert.equal(parseValue('0.1µF'), 1e5);
  assert.equal(parseValue('100n'), 1e5);
  assert.equal(parseValue('22pF'), 22);
  assert.ok(Number.isNaN(parseValue('abc')));
  assert.ok(Number.isNaN(parseValue('')));
});

test('formats values in the unit the exercise uses', () => {
  assert.equal(formatCap(470), '470 pF');
  assert.equal(formatCap(3300), '3,3 nF');
  assert.equal(formatCap(91e3), '91 nF');
  assert.equal(formatCap(1e5), '0,1 µF');
  assert.equal(allUnits(4700), '4.700 pF = 4,7 nF');
  assert.equal(allUnits(33e3), '33.000 pF = 33 nF = 0,033 µF');
  assert.equal(explain('220J'), '220J → 22 × 10⁰ pF (bẫy: số 0 cuối là × 10⁰) = 22 pF, J = ±5%');
});
