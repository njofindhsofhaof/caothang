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

test('bài 4: transformed-circuit figure shows J = E/R for every voltage branch', () => {
  const p = byId[4];
  const labels = p.transformed.draw.filter((c) => c[0] === 'i').map((c) => c[4]);
  const subs = { 1: '₁', 2: '₂' };
  for (const vb of p.vbranches) {
    const label = labels.find((l) => l.startsWith('J' + subs[vb.sym.split('_')[1]] + ' '));
    assert.ok(label, `có nguồn dòng tương đương cho ${vb.sym}`);
    near(parseNumber(label.split('=')[1]), vb.value / vb.r);
  }
  assert.ok(labels.includes('J = 4 A'), 'nguồn dòng J giữ nguyên');
  assert.ok(p.transformed.afterStep < p.steps.length);
});

test('nodal problems: 2 unknown nodes A, B; node C is the reference, named on every figure', () => {
  const opening = 'Gọi V_A, V_B, V_C là điện thế tại các nút A, B, C. Chọn nút C làm nút gốc ⇒ V_C = 0.';
  for (const p of globalThis.MLN_PROBLEMS.filter((q) => q.method === 'nodal')) {
    assert.deepEqual(p.nodes, ['A', 'B'], `bài ${p.id}`);
    assert.ok(p.steps[0].lines[0].startsWith(opening), `bài ${p.id} mở đầu bằng câu gọi V_A, V_B, V_C`);
    for (const draw of [p.draw, p.transformed?.draw].filter(Boolean)) {
      const names = draw.filter((c) => c[0] === 'n' && c[3]).map((c) => c[3]);
      assert.deepEqual(names.sort(), ['A', 'B', 'C'], `bài ${p.id}: nhãn nút`);
    }
    assert.ok(!JSON.stringify(p).includes('gốc (0 V)'), `bài ${p.id} không ghi "gốc (0 V)"`);
  }
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
