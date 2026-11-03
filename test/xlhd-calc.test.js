import { test } from 'node:test';
import assert from 'node:assert/strict';

globalThis.window = globalThis;
await import('../assets/xlhd-calc.js');
await import('../assets/xlhd-data.js');
const { solve, abs, arg, impedance, fmtRect, fmtPolar, f2, num } = globalThis.XL_CALC;
const byId = Object.fromEntries(globalThis.XL_PROBLEMS.map((p) => [p.id, p]));

const near = (got, want, tol = 0.006) => assert.ok(Math.abs(got - want) <= tol, `${got} != ${want}`);
const phasor = (z, mag, deg) => { near(abs(z), mag); near(arg(z), deg, 0.01); };

test('bài 1: two balanced branches give a purely resistive source (½·U·I*)', () => {
  const s = solve(byId[1]);
  phasor(s.current, 100, 0);
  phasor(s.branchI[0], 70.7107, 45);
  phasor(s.branchI[1], 70.7107, -45);
  phasor(s.voltages.V_12, 100, -90);
  near(s.power.re, 5000);
  near(s.power.im, 0);
});

test('bài 2: current source splits between RL and RC branches', () => {
  const s = solve(byId[2]);
  phasor(s.vSource, 13.1306, 66.80);
  phasor(s.branchI[0], 1.8570, 21.80);
  phasor(s.branchI[1], 4.6424, 111.80);
  phasor(s.voltages.V_x, 9.2848, 21.80);
  near(s.power.re, 30.1724);
  near(s.power.im, -12.9310);
});

test('bài 3: series resistor feeding L // RC', () => {
  const s = solve(byId[3]);
  near(s.zTotal.re, 11.6667);
  near(s.zTotal.im, -3.3333);
  phasor(s.current, 4.1208, 15.95);
  phasor(s.branchI[0], 3.0715, -100.62);
  phasor(s.branchI[1], 6.1430, 42.51);
  near(s.power.re, 99.0566);
  near(s.power.im, -28.3019);
});

test('bài 4: 1 H and 1/4 F at ω = 2 become j2 and −j2; power uses ½·Um·Im*', () => {
  const p = byId[4];
  assert.deepEqual(impedance(p.series[0], 2), { re: 0, im: 2 });
  assert.deepEqual(impedance(p.branches[1].elems[0], 2), { re: 0, im: -2 });
  const s = solve(p);
  phasor(s.current, 1.4142, -8.13);
  phasor(s.branchI[0], 1, -53.13);
  phasor(s.branchI[1], 1, 36.87);
  phasor(s.voltages.U_c, 2, -53.13);
  near(s.power.re, 7);
  near(s.power.im, 1);
});

test('power balance: source P equals the sum of R·|I|² in every problem', () => {
  for (const p of globalThis.XL_PROBLEMS) {
    const s = solve(p);
    const k = 0.5;
    const series = (p.series || []).filter((e) => e.kind === 'R').reduce((a, e) => a + e.value * abs(s.current) ** 2, 0);
    const branches = p.branches.reduce((a, b, i) => a + b.elems.filter((e) => e.kind === 'R')
      .reduce((x, e) => x + e.value * abs(s.branchI[i]) ** 2, 0), 0);
    near(s.power.re, k * (series + branches), 1e-6);
  }
});

test('exact radicals and integers stay exact; other values round to 2 decimals', () => {
  assert.equal(num(Math.SQRT2), '√2');
  assert.equal(num(50 * Math.SQRT2), '50√2');
  assert.equal(num(-5 * Math.SQRT2), '−5√2');
  assert.equal(num((10 / 3) * Math.sqrt(5)), '10√5/3');
  assert.equal(num(100), '100');
  assert.equal(num(13.1306), '13,13');
  assert.equal(num(1.4), '1,4');
  assert.equal(num(-0.2), '−0,2');
  assert.equal(fmtPolar({ re: 50, im: 50 }), '50√2∠45°');
});

test('formatting uses comma decimals and a real minus sign', () => {
  assert.equal(f2(-0.001), '0,00');
  assert.equal(f2(-3.456), '−3,46');
  assert.equal(fmtRect({ re: 3.9623, im: -1.1321 }), '3,96 − j1,13');
  assert.equal(fmtRect({ re: 0, im: -3.02 }), '−j3,02');
  assert.equal(fmtRect({ re: 1, im: -1 }), '1 − j1');
  assert.equal(fmtPolar({ re: 0, im: -100 }), '100∠−90°');
});
