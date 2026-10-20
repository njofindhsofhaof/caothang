import { test } from 'node:test';
import assert from 'node:assert/strict';

globalThis.window = globalThis;
await import('../assets/smd-code.js');
await import('../assets/smd-data.js');
const { decode, parseValue, sameValue, formatOhm, explain } = globalThis.SMD_CODE;
const sets = globalThis.SMD_SETS;

const STD = {
  '3 số': /^\d{3}$/,
  '4 số': /^\d{4}$/,
  '3 ký tự': /^[\dR]{3}$/,
  '4 ký tự': /^[\dR]{4}$/
};

test('decodes 3-digit, 4-digit, R and zero codes', () => {
  assert.equal(decode('103'), 10000);
  assert.equal(decode('100'), 10);
  assert.equal(decode('1002'), 10000);
  assert.equal(decode('4R7'), 4.7);
  assert.equal(decode('R010'), 0.01);
  assert.equal(decode('0R22'), 0.22);
  assert.equal(decode('000'), 0);
  assert.ok(Number.isNaN(decode('12')));
  assert.ok(Number.isNaN(decode('R')));
});

test('parses student values with unit prefixes', () => {
  assert.equal(parseValue('10k'), 10000);
  assert.equal(parseValue('4,7 kΩ'), 4700);
  assert.equal(parseValue('4k7'), 4700);
  assert.equal(parseValue('2M2'), 2.2e6);
  assert.equal(parseValue('10mΩ'), 0.01);
  assert.equal(parseValue('0.22 ohm'), 0.22);
  assert.equal(parseValue('4R7'), 4.7);
  assert.ok(Number.isNaN(parseValue('abc')));
});

test('formats and explains', () => {
  assert.equal(formatOhm(4700), '4.7 kΩ');
  assert.equal(formatOhm(0.01), '0.01 Ω (10 mΩ)');
  assert.equal(explain('103'), '103 → 10 × 10³ = 10 000 Ω = 10 kΩ');
});

test('has 6 sets of 6 questions', () => {
  assert.equal(sets.length, 6);
  sets.forEach((s) => assert.equal(s.questions.length, 6, s.title));
});

for (const s of sets) {
  test(`${s.title}: answer key matches decoding rules`, () => {
    s.questions.forEach((q, qi) => {
      q.read.forEach((r) => {
        for (let i = 0; i < r.length; i += 2) {
          assert.ok(sameValue(decode(r[i]), r[i + 1]), `${s.title} câu ${qi + 1} đọc ${r[i]} ≠ ${r[i + 1]}`);
        }
      });
      q.write.forEach(([label, std, ...codes]) => {
        const expected = parseValue(label.split(' (')[0]);
        const stds = std.split(' / ');
        assert.equal(codes.length, stds.length, `${s.title} câu ${qi + 1} ${label}`);
        codes.forEach((code, i) => {
          assert.match(code, STD[stds[i]], `${s.title} câu ${qi + 1} ${label}: ${code} không đúng chuẩn ${stds[i]}`);
          assert.ok(sameValue(decode(code), expected), `${s.title} câu ${qi + 1} viết ${label} → ${code}`);
        });
      });
    });
  });
}
