import { test } from 'node:test';
import assert from 'node:assert/strict';

globalThis.window = globalThis;
await import('../assets/bp3-calc.js');
await import('../assets/bp3-data.js');
const { solve, answers, steps, generate, num, parseNumber, matches, UNITS, KINDS } = globalThis.BP3_CALC;
const byId = Object.fromEntries(globalThis.BP3_PROBLEMS.map((p) => [p.id, p]));

const near = (got, want, tol = 0.01) => assert.ok(Math.abs(got - want) <= tol, `${got} != ${want}`);

test('Y load (VD3): U_p = U_d/√3, I_d = I_p = 8,78 A, cosφ = 0,8', () => {
  const s = solve(byId[1]);
  near(s.Up, 219.39);
  near(s.Zp, 25);
  near(s.Ip, 8.78);
  near(s.Id, s.Ip, 1e-9);
  near(s.cos, 0.8, 1e-9);
  near(s.P, 4620.8, 0.1);
  near(s.Q, 3465.6, 0.1);
  near(s.S, Math.hypot(s.P, s.Q), 1e-6);
});

test('notebook answers with rounded I_p still pass the 1% tolerance', () => {
  const a1 = answers(byId[1]);
  assert.ok(matches(4625, a1.P) && matches(3469, a1.Q) && matches(5779, a1.S));
  const a3 = answers(byId[3]);
  assert.ok(matches(25.3, a3.I_p) && matches(43.88, a3.I_d));
  assert.ok(matches(17282, a3.P) && matches(23043, a3.Q) && matches(28803, a3.S) && matches(0.6, a3['cosφ']));
  const a2 = answers(byId[2]);
  assert.ok(matches(220, a2.U_p) && matches(22, a2.I_p) && matches(11616, a2.P) && matches(8712, a2.Q) && matches(14520, a2.S));
});

test('Δ load (VD4): U_p = U_d, I_d = √3·I_p', () => {
  const s = solve(byId[3]);
  near(s.Up, 380, 1e-9);
  near(s.Zp, 15);
  near(s.Ip, 25.33);
  near(s.Id, Math.sqrt(3) * s.Ip, 1e-9);
  near(s.cos, 0.6, 1e-9);
});

test('pure resistive Δ: I_p = 38 A, I_d = 38√3 A, Q = 0', () => {
  const s = solve(byId[4]);
  near(s.Ip, 38, 1e-9);
  near(s.Id, 38 * Math.sqrt(3), 1e-9);
  near(s.Q, 0, 1e-9);
  near(s.cos, 1, 1e-9);
  near(s.P, 3 * 10 * 38 * 38, 1e-6);
});

test('Y with line impedance adds R_d, X_d directly', () => {
  const s = solve(byId[5]);
  near(s.Zt, 20, 1e-9);
  near(s.Id, 380 / (Math.sqrt(3) * 20), 1e-9);
  near(s.Ip, s.Id, 1e-9);
  near(s.Up, s.Ip * Math.hypot(11, 14), 1e-9);
  assert.ok(s.Up < 380 / Math.sqrt(3));
});

test('Δ with line impedance divides only the load by 3', () => {
  const s = solve(byId[6]);
  near(s.Zt, 20, 1e-9);
  near(s.Id, 380 / (Math.sqrt(3) * 20), 1e-9);
  near(s.Ip, s.Id / Math.sqrt(3), 1e-9);
  near(s.P, 3 * 33 * s.Ip ** 2, 1e-6);
});

test('source given as U_p (Y): U_d = √3·U_p', () => {
  const s = solve({ conn: 'Y', Up: 220, R: 6, X: 8 });
  near(s.Ud, 220 * Math.sqrt(3), 1e-9);
  near(s.Up, 220, 1e-9);
  near(s.Ip, 22, 1e-9);
});

test('answers follows the ask order and every key has a unit', () => {
  for (const p of globalThis.BP3_PROBLEMS) {
    assert.deepEqual(Object.keys(answers(p)), p.ask);
    p.ask.forEach((k) => assert.ok(k in UNITS, k));
  }
});

test('steps: 3 steps, no NaN, "chia 3" only for Δ with line', () => {
  const st = steps(byId[6]);
  assert.equal(st.length, 3);
  assert.ok(st[1].lines.some((l) => l.includes('chia 3')));
  assert.ok(!steps(byId[5])[1].lines.some((l) => l.includes('chia 3')));
  for (const p of globalThis.BP3_PROBLEMS) {
    assert.ok(steps(p).flatMap((s) => s.lines).every((l) => !l.includes('NaN')));
  }
});

test('generate produces solvable problems of the requested kind, deterministic with a seeded rng', () => {
  const seeded = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  for (const kind of KINDS) {
    for (let i = 1; i <= 20; i++) {
      const p = generate(seeded(i), kind);
      assert.equal(p.conn, kind[0]);
      assert.equal(!!p.Rd, kind.length > 1);
      Object.values(answers(p)).forEach((v) => assert.ok(Number.isFinite(v) && v > 0));
      assert.ok(p.text.includes('Tính'));
    }
  }
  assert.deepEqual(generate(seeded(7)), generate(seeded(7)));
});

test('num, parseNumber and matches', () => {
  assert.equal(num(8.7757), '8,78');
  assert.equal(num(-0.001), '0');
  assert.equal(parseNumber('8,78'), 8.78);
  assert.equal(parseNumber('4625 W'), 4625);
  assert.equal(parseNumber('3469VAr'), 3469);
  assert.equal(parseNumber('−2'), -2);
  assert.equal(parseNumber('13/3'), 13 / 3);
  assert.ok(Number.isNaN(parseNumber('abc')));
  assert.ok(Number.isNaN(parseNumber('1/0')));
  assert.ok(matches(0.8, 0.8));
  assert.ok(!matches(0.82, 0.8));
  assert.ok(!matches(4700, 4620.8));
  assert.ok(!matches(NaN, 1));
});
