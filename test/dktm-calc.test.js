import { test } from 'node:test';
import assert from 'node:assert/strict';

globalThis.window = globalThis;
await import('../assets/mln-calc.js');
await import('../assets/bp3-calc.js');
await import('../assets/dktm-calc.js');
await import('../assets/dktm-data.js');
const { system, cramer, linear, solveCircuit, solveThreePhase } = globalThis.DKTM_CALC;
const exams = Object.fromEntries(globalThis.DKTM_EXAMS.map((e) => [e.de, e]));

const near = (got, want, tol = 1e-9) => assert.ok(Math.abs(got - want) <= tol, `${got} != ${want}`);

test('plan adds up to 42 minutes of work and 10 points', () => {
  const plan = globalThis.DKTM_PLAN;
  assert.equal(plan.reduce((a, p) => a + p.min, 0), 42);
  assert.equal(plan.reduce((a, p) => a + p.pts, 0), 10);
});

test('đề 1, 3 use mesh currents; đề 2, 4 use nodal voltages', () => {
  assert.deepEqual([1, 2, 3, 4].map((d) => exams[d].b1.method), ['mesh', 'nodal', 'mesh', 'nodal']);
});

test('every part of each bài sums to 5 points', () => {
  for (const e of globalThis.DKTM_EXAMS) {
    near(solveCircuit(e.b1).groups.reduce((a, g) => a + g.pts, 0), 5);
    near(solveThreePhase(e.b2).groups.reduce((a, g) => a + g.pts, 0), 5);
  }
});

test('đề 1 mesh: I_m1 = 2 A, I_m2 = −2 A, branch currents 2, 2, 4 A, 88 W', () => {
  const s = solveCircuit(exams[1].b1);
  near(s.x[0], 2);
  near(s.x[1], -2);
  for (const [k, v] of Object.entries({ I_1: 2, I_2: 2, I_3: 4 })) near(s.cur[k], v, 1e-9);
  near(s.pSrc, 88);
  near(s.pLoad, 88);
});

test('đề 3 mesh: I_m1 = 6 A, I_m2 = 4 A, P = 168 W', () => {
  const s = solveCircuit(exams[3].b1);
  near(s.x[0], 6);
  near(s.x[1], 4);
  for (const [k, v] of Object.entries({ I_1: 6, I_2: 2, I_3: 4 })) near(s.cur[k], v, 1e-9);
  near(s.pSrc, 168);
  near(s.pLoad, 168);
});

test('đề 2 nodal: V_A = 10 V, V_B = 12 V, currents 3, 8, 2, 5, 6 A, 280 W', () => {
  const s = solveCircuit(exams[2].b1);
  near(s.x[0], 10);
  near(s.x[1], 12);
  for (const [k, v] of Object.entries({ I_1: 3, I_2: 8, I_3: 2, I_4: 5, I_5: 6 })) near(s.cur[k], v, 1e-9);
  near(s.pSrc, 280);
  near(s.pLoad, 280);
});

test('đề 4 nodal with current source: V_A = 16 V, V_B = 14 V, 430 W', () => {
  const s = solveCircuit(exams[4].b1);
  near(s.x[0], 16);
  near(s.x[1], 14);
  for (const [k, v] of Object.entries({ I_1: 10, I_2: 8, I_3: 2, I_4: 7 })) near(s.cur[k], v, 1e-9);
  near(s.pSrc, 430);
  near(s.pLoad, 430);
});

test('Cramer agrees with MLN_CALC for every Chương 3 circuit', () => {
  for (const e of globalThis.DKTM_EXAMS) {
    const p = e.b1;
    const ref = globalThis.MLN_CALC.solve(p);
    const x = cramer(p, system(p)).x;
    const want = p.method === 'mesh' ? ref.im : ref.v;
    near(x[0], want[0], 1e-9);
    near(x[1], want[1], 1e-9);
  }
});

test('written equations match the matrix (đề 1 and đề 2)', () => {
  const mesh = solveCircuit(exams[1].b1).groups[0].lines;
  assert.ok(mesh.some((l) => l.includes('(R_1 + R_3)·I_m1 − R_3·I_m2 = E_1') && l.endsWith('9I_m1 − 3I_m2 = 24   (1)')));
  assert.ok(mesh.some((l) => l.includes('= −E_2') && l.endsWith('−3I_m1 + 7I_m2 = −20   (2)')));
  const nodal = solveCircuit(exams[2].b1).groups[0].lines;
  assert.ok(nodal.some((l) => l.includes('(1/R_1 + 1/R_3 + 1/R_4)·V_A') && l.endsWith('1,6V_A − V_B = 4   (1)')));
  assert.ok(nodal.some((l) => l.endsWith('−V_A + 2,5V_B = 20   (2)')));
});

test('linear() drops zero terms and unit coefficients', () => {
  const p = { method: 'nodal', nodes: ['A', 'B'] };
  assert.equal(linear(p, [1, -1]), 'V_A − V_B');
  assert.equal(linear(p, [0, 2.5]), '2,5V_B');
  assert.equal(linear(p, [0, 0]), '0');
});

test('cramer() refuses systems that are not 2×2', () => {
  assert.throws(() => cramer({ method: 'mesh' }, { n: 3 }));
});

test('three-phase answers: Y 6+j8, Δ 12+j16, Y 16+j12, Δ 30+j40', () => {
  const want = {
    1: { Ip: 380 / Math.sqrt(3) / 10, P: 8664, altP: 25992 },
    2: { Ip: 19, P: 12996, altP: 4332 },
    3: { Ip: 380 / Math.sqrt(3) / 20, P: 5776, altP: 17328 },
    4: { Ip: 7.6, P: 5198.4, altP: 1732.8 }
  };
  for (const [d, w] of Object.entries(want)) {
    const r = solveThreePhase(exams[d].b2);
    near(r.s.Ip, w.Ip, 1e-9);
    near(r.s.P, w.P, 1e-6);
    near(r.alt.P, w.altP, 1e-6);
    near(r.alt.P > r.s.P ? r.alt.P / r.s.P : r.s.P / r.alt.P, 3, 1e-9);
  }
});

test('solution text never shows NaN or undefined', () => {
  for (const e of globalThis.DKTM_EXAMS) {
    for (const s of [solveCircuit(e.b1), solveThreePhase(e.b2)]) {
      const all = s.groups.flatMap((g) => g.lines).concat(s.answer).join('\n');
      assert.doesNotMatch(all, /NaN|undefined|Infinity/);
    }
  }
});
