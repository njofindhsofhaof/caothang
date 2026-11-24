import { test } from 'node:test';
import assert from 'node:assert/strict';

globalThis.window = globalThis;
await import('../assets/zener-calc.js');
await import('../assets/zener-data.js');
const { zenerPoint, vsRange, rlRange } = globalThis.ZENER_CALC;
const problems = globalThis.ZENER_PROBLEMS;
const r2 = (x) => Math.round(x * 100) / 100;
const Z91 = { vz: 9.1, izmin: 0.002, izmax: 0.035 };

test('Zener form 1 (notebook): V_S 15 V, R_S 150, R_L 1k', () => {
  const r = zenerPoint({ ...Z91, vs: 15, rs: 150, rl: 1000 });
  assert.equal(r2(r.is * 1000), 39.33);
  assert.equal(r2(r.irl * 1000), 9.1);
  assert.equal(r2(r.iz * 1000), 30.23);
  assert.equal(r2(r.pz), 0.28);
  assert.equal(r.ok, true);
});

test('Zener form 2 (notebook): 10,765 V <= V_S <= 15,715 V', () => {
  const r = vsRange({ ...Z91, rs: 150, rl: 1000 });
  assert.equal(Math.round(r.lo * 1000) / 1000, 10.765);
  assert.equal(Math.round(r.hi * 1000) / 1000, 15.715);
});

test('Zener form 3 (notebook): 243,77 <= R_L <= 2101,6 ohm', () => {
  const r = rlRange({ ...Z91, vs: 15, rs: 150 });
  assert.equal(r2(r.is * 1000), 39.33);
  assert.equal(r2(r.lo), 243.77);
  assert.equal(Math.round(r.hi), 2102);
  assert.equal(rlRange({ ...Z91, vs: 12, rs: 150 }).hi, Infinity);
});

test('problem data is well-formed and every Zener problem regulates', () => {
  assert.deepEqual(problems.map((p) => p.id), [1, 2, 3, 4, 5, 6]);
  problems.filter((p) => p.type === 'z1').forEach((p) => {
    assert.equal(zenerPoint({ ...p.zener, vs: p.vs, rs: p.rs, rl: p.rl }).ok, true, 'bai ' + p.id);
  });
  problems.filter((p) => p.type === 'z3').forEach((p) => {
    const r = rlRange({ ...p.zener, vs: p.vs, rs: p.rs });
    assert.ok(r.lo > 0 && r.hi > r.lo && isFinite(r.hi), 'bai ' + p.id);
  });
});
