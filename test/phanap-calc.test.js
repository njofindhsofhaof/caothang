import { test } from 'node:test';
import assert from 'node:assert/strict';

globalThis.window = globalThis;
await import('../assets/phanap-calc.js');
await import('../assets/phanap-data.js');
const { parallel, solve, colorBands, parseAnswer, close, fmt, fmtOhm } = globalThis.PA_CALC;
const byId = Object.fromEntries(globalThis.PA_PROBLEMS.map((p) => [p.id, p]));

const near = (got, want, tol = 0.006) => assert.ok(Math.abs(got - want) <= tol, `${got} != ${want}`);
const vo = (p, sol, node) => (p.vcc * sol.stages[node].below) / sol.rtd;

test('parallel resistance of equal and mixed branches', () => {
  assert.equal(parallel([2000, 3000]), 1200);
  assert.equal(parallel([1200, 1200, 600, 300]), 150);
  assert.equal(parallel([1500, 1500, 750]), 375);
});

test('bài 1 matches the published answer key', () => {
  const p = byId[1];
  const s = solve(p);
  assert.equal(s.rtd, 2680);
  near(s.current * 1000, 13.43);
  near(s.stages[3].branches[0].i * 1000, 8.06);
  near(s.stages[3].branches[1].i * 1000, 5.37);
  near(s.stages[3].v, 16.12);
  near(vo(p, s, 2), 25.25);
  near(vo(p, s, 1), 31.57);
});

test('bài 2 currents through 4 branches add up to I', () => {
  const s = solve(byId[2]);
  assert.equal(s.rtd, 2000);
  near(s.stages[1].v, 1.8);
  assert.deepEqual(s.stages[1].branches.map((b) => +(b.i * 1000).toFixed(3)), [1.5, 1.5, 3, 6]);
});

test('bài 3–6 totals and tap voltages', () => {
  const s3 = solve(byId[3]);
  assert.equal(s3.rtd, 2180);
  near(vo(byId[3], s3, 4), 19.82);
  near(vo(byId[3], s3, 1), 44.70);

  const s4 = solve(byId[4]);
  assert.equal(s4.rtd, 1500);
  assert.deepEqual([4, 3, 2, 1].map((n) => +vo(byId[4], s4, n).toFixed(3)), [4.5, 12.5, 20, 26]);

  const s5 = solve(byId[5]);
  assert.equal(s5.rtd, 900);
  near(s5.stages[3].branches[2].i * 1000, 13.33);

  const s6 = solve(byId[6]);
  assert.equal(s6.rtd, 1800);
  assert.deepEqual([4, 3, 2, 1].map((n) => +vo(byId[6], s6, n).toFixed(3)), [6.5, 14, 18.8, 28.8]);
  assert.deepEqual(s6.stages[3].branches.map((b) => +(b.i * 1000).toFixed(3)), [5, 5, 10]);
});

test('every tap node is inside the circuit and every resistor has a value', () => {
  for (const p of globalThis.PA_PROBLEMS) {
    for (const t of p.taps) assert.ok(t.node >= 1 && t.node < p.stages.length, `bài ${p.id} ${t.name}`);
    for (const n of p.stages.flat()) assert.ok(p.values[n] > 0, `bài ${p.id} ${n}`);
  }
});

test('color bands for 4 and 5 band resistors', () => {
  assert.deepEqual(colorBands(330, 4), ['Cam', 'Cam', 'Nâu', 'Vàng kim']);
  assert.deepEqual(colorBands(330, 5), ['Cam', 'Cam', 'Đen', 'Đen', 'Vàng kim']);
  assert.deepEqual(colorBands(1200, 4), ['Nâu', 'Đỏ', 'Đỏ', 'Vàng kim']);
  assert.deepEqual(colorBands(1200, 5), ['Nâu', 'Đỏ', 'Đen', 'Nâu', 'Vàng kim']);
  assert.deepEqual(colorBands(225, 5), ['Đỏ', 'Đỏ', 'Xanh lục', 'Đen', 'Vàng kim']);
  assert.equal(colorBands(225, 4), null);
  assert.deepEqual(colorBands(4.7, 4), ['Vàng', 'Tím', 'Vàng kim', 'Vàng kim']);
});

test('parses Vietnamese and English decimal input', () => {
  assert.equal(parseAnswer('13,43'), 13.43);
  assert.equal(parseAnswer('13.43'), 13.43);
  assert.equal(parseAnswer('2.680'), 2680);
  assert.equal(parseAnswer(' 2680 '), 2680);
  assert.ok(Number.isNaN(parseAnswer('abc')));
  assert.ok(Number.isNaN(parseAnswer('')));
});

test('close accepts rounding error but rejects wrong answers', () => {
  assert.ok(close(38.76, 38.752));
  assert.ok(close(13.4, 13.433));
  assert.ok(!close(12, 13.43));
  assert.ok(!close(NaN, 1));
});

test('formats numbers the Vietnamese way', () => {
  assert.equal(fmt(2680), '2.680');
  assert.equal(fmt(13.4328), '13,43');
  assert.equal(fmt(12), '12');
  assert.equal(fmtOhm(1200), '1,2 kΩ');
  assert.equal(fmtOhm(330), '330 Ω');
});
