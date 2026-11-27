import { test } from 'node:test';
import assert from 'node:assert/strict';

globalThis.window = globalThis;
await import('../assets/mln-calc.js');
await import('../assets/mln-data.js');
const { linsolve, solve, answers, num, parseNumber, matches } = globalThis.MLN_CALC;
const byId = Object.fromEntries(globalThis.MLN_PROBLEMS.map((p) => [p.id, p]));

const near = (got, want, tol = 1e-6) => assert.ok(Math.abs(got - want) <= tol, `${got} != ${want}`);

test('linsolve solves a 2×2 system and rejects a singular one', () => {
  const [x, y] = linsolve([[2, -1], [-1, 2.5]], [16, 16]);
  near(x, 14);
  near(y, 12);
  assert.throws(() => linsolve([[1, 2], [2, 4]], [1, 2]));
});

test('bài 1: three CW meshes give 13/3, 10/3, 2,5 A', () => {
  const s = solve(byId[1]);
  near(s.im[0], 13 / 3);
  near(s.im[1], 10 / 3);
  near(s.im[2], 2.5);
  const a = answers(byId[1]);
  near(a.I_1, 13 / 3);
  near(a.I_2, 1);
  near(a.I_3, 10 / 3);
  near(a.I_4, 5 / 6);
  near(a.I_5, 2.5);
  near(s.pSum, 148);
  near(s.pLoad, 148);
});

test('bài 2: current source fixes Iₘ₃ = 16 A and absorbs power', () => {
  const s = solve(byId[2]);
  near(s.im[0], 27);
  near(s.im[1], 25.6);
  near(s.im[2], 16);
  const a = answers(byId[2]);
  assert.deepEqual(Object.keys(a), ['I_1', 'I_2', 'I_3', 'I_4', 'I_5']);
  near(a.I_3, 1.4);
  near(a.I_4, 11);
  near(a.I_5, 9.6);
  near(s.uJ.J, -86.6);
  near(s.pSum, 7244.8);
  near(s.pLoad, 7244.8);
});

test('bài 3: nodal analysis gives V_A = 0, V_B = 12 V', () => {
  const a = answers(byId[3]);
  near(a.V_A, 0);
  near(a.V_B, 12);
  near(a.I_1, 0);
  near(a.I_2, 0);
  near(a.I_3, 6);
  near(a.I_4, 3);
  const s = solve(byId[3]);
  near(s.pSum, 108);
  near(s.pLoad, 108);
});

test('bài 4: source transformation, branch currents recomputed on the original circuit', () => {
  const s = solve(byId[4]);
  assert.deepEqual(s.G, [[2, -1], [-1, 2.5]]);
  assert.deepEqual(s.J, [16, 16]);
  const a = answers(byId[4]);
  assert.deepEqual(Object.keys(a), ['V_A', 'V_B', 'I_1', 'I_2', 'I_3', 'I_4', 'I_5']);
  near(a.V_A, 14);
  near(a.V_B, 12);
  near(a.I_1, 5);
  near(a.I_2, 4);
  near(a.I_3, 2);
  near(a.I_4, 7);
  near(a.I_5, 6);
  near(s.pSum, 240);
  near(s.pLoad, 240);
});

test('every problem balances power and lists 5 solution steps', () => {
  for (const p of globalThis.MLN_PROBLEMS) {
    const s = solve(p);
    near(s.pSum, s.pLoad);
    assert.equal(p.steps.length, 5, `bài ${p.id}`);
  }
});

test('parseNumber accepts comma, minus sign, fractions and units', () => {
  near(parseNumber('4,33'), 4.33);
  near(parseNumber('−86,6 V'), -86.6);
  near(parseNumber('13/3'), 13 / 3);
  near(parseNumber(' 2.5A '), 2.5);
  assert.ok(Number.isNaN(parseNumber('abc')));
  assert.ok(Number.isNaN(parseNumber('1/0')));
});

test('matches allows 2-decimal rounding only', () => {
  assert.ok(matches(4.33, 13 / 3));
  assert.ok(matches(0.83, 5 / 6));
  assert.ok(!matches(4.3, 13 / 3));
  assert.ok(!matches(NaN, 1));
});

test('num formats with Vietnamese decimal comma', () => {
  assert.equal(num(13 / 3), '4,33');
  assert.equal(num(-86.6), '−86,6');
  assert.equal(num(-0.001), '0');
});
