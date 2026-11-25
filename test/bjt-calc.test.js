import { test } from 'node:test';
import assert from 'node:assert/strict';

globalThis.window = globalThis;
await import('../assets/bjt-calc.js');
await import('../assets/bjt-data.js');
const { qPoint, loadLine, designActive, designSat, satRb, e12Nearest, e12Below } = globalThis.BJT_CALC;
const problems = globalThis.BJT_PROBLEMS;
const r1 = (x) => Math.round(x * 10) / 10;
const r2 = (x) => Math.round(x * 100) / 100;
const mA = (a) => r2(a * 1000);

test('E12 helpers pick nearest and safe-lower standard values', () => {
  assert.equal(e12Nearest(50), 47);
  assert.equal(e12Nearest(283.3), 270);
  assert.equal(e12Nearest(49333), 47000);
  assert.equal(e12Nearest(25), 27);
  assert.equal(e12Below(5700), 5600);
  assert.equal(e12Below(10000), 10000);
});

const EX1 = { vcc: 9, rb: 39000, rc: 470, re: 150, beta: 100 };

test('chapter example 1: DCLL and Q1/Q2/Q3', () => {
  assert.equal(r1(loadLine(EX1).icmax * 1000), 14.5);
  const q1 = qPoint({ ...EX1, vbb: 0 });
  assert.deepEqual([q1.mode, q1.ic, q1.vce], ['cut', 0, 9]);
  const q2 = qPoint({ ...EX1, vbb: 5 });
  assert.equal(q2.mode, 'active');
  assert.equal(Math.round(q2.ic * 1000), 8);
  assert.equal(Math.round(q2.vce), 4);
  const q3 = qPoint({ ...EX1, vbb: 9 });
  assert.equal(q3.mode, 'sat');
  assert.equal(r1(q3.ic * 1000), 14.5);
  assert.equal(q3.vce, 0.2);
});

test('chapter example 1 with R_E = 0: steeper line, Q(11 mA; 3,8 V) and Q(19,1 mA; 0,2 V)', () => {
  const c = { ...EX1, re: 0 };
  assert.equal(r1(loadLine(c).icmax * 1000), 19.1);
  const qb = qPoint({ ...c, vbb: 5 });
  assert.equal(qb.mode, 'active');
  assert.equal(Math.round(qb.ic * 1000), 11);
  assert.equal(r1(qb.vce), 3.8);
  assert.equal(qPoint({ ...c, vbb: 9 }).mode, 'sat');
});

test('chapter example 2a: 50 -> 47, 283,3 -> 270, 49,33 k -> 47 k', () => {
  const r = designActive({ vcc: 9, ic: 0.018, vce: 3, beta: 120, ve: 0.9 });
  assert.equal(r2(r.re), 50);
  assert.equal(r1(r.rc), 283.3);
  assert.equal(mA(r.ib), 0.15);
  assert.equal(r2(r.rb / 1000), 49.33);
  assert.deepEqual(r.std, { re: 47, rc: 270, rb: 47000 });
});

test('chapter example 2b: R_E 25, R_B 5,4 k, R_C 195', () => {
  const r = designSat({ vcc: 9, icmax: 0.04, beta: 60, k: 2, ve: 1 });
  assert.equal(r2(r.re), 25);
  assert.equal(mA(r.ib), 1.33);
  assert.equal(r1(r.rb / 1000), 5.4);
  assert.equal(r2(r.rc), 195);
});

test('chapter example 3: 28,12 mA, 0,94 mA, 5,7 k -> 5,6 k', () => {
  const r = satRb({ vcc: 9, rc: 220, re: 100, beta: 60, k: 2 });
  assert.equal(mA(r.icmax), 28.13);
  assert.equal(mA(r.ib), 0.94);
  assert.equal(r1(r.rb / 1000), 5.7);
  assert.equal(r.std.rb, 5600);
});

test('problem data: ids 1-6 and each Dạng 1 problem covers cut, active and sat', () => {
  assert.deepEqual(problems.map((p) => p.id), [1, 2, 3, 4, 5, 6]);
  problems.filter((p) => p.type === 'q').forEach((p) => {
    const modes = p.vbb.map((vbb) => qPoint({ ...p, vbb }).mode);
    assert.deepEqual(modes, ['cut', 'active', 'sat'], 'bai ' + p.id);
  });
  assert.equal(problems.find((p) => p.id === 2).re, 0);
});

test('problem 1: I_Cmax 13,04 mA; Q2(9,98 mA; 2,82 V); Q3 bão hoà', () => {
  const p = problems[0];
  assert.equal(mA(loadLine(p).icmax), 13.04);
  const q2 = qPoint({ ...p, vbb: 5 });
  assert.equal(mA(q2.ib), 0.1);
  assert.equal(mA(q2.ic), 9.98);
  assert.equal(r2(q2.vce), 2.82);
  assert.equal(mA(qPoint({ ...p, vbb: 12 }).ic), 13.04);
});

test('problem 2 (R_E = 0): I_Cmax 17,65 mA; Q2(10 mA; 5,2 V); V_BB 9 V bão hoà', () => {
  const p = problems[1];
  assert.equal(mA(loadLine(p).icmax), 17.65);
  const q2 = qPoint({ ...p, vbb: 5 });
  assert.equal(mA(q2.ic), 10);
  assert.equal(r2(q2.vce), 5.2);
  const q3 = qPoint({ ...p, vbb: 9 });
  assert.equal(mA(q3.bib), 19.3);
  assert.equal(q3.mode, 'sat');
});

test('problems 3-4 (khuếch đại) give clean values and E12 picks', () => {
  const a = designActive(problems[2]);
  assert.deepEqual([r2(a.re), r2(a.rc), mA(a.ib), r2(a.rb / 1000)], [120, 480, 0.1, 101]);
  assert.deepEqual(a.std, { re: 120, rc: 470, rb: 100000 });
  const b = designActive(problems[3]);
  assert.deepEqual([r2(b.re), r2(b.rc), mA(b.ib), r2(b.rb / 1000)], [250, 1416.67, 0.04, 320]);
  assert.deepEqual(b.std, { re: 270, rc: 1500, rb: 330000 });
  assert.equal(problems[3].vce, problems[3].vcc / 3);
  assert.equal(problems[2].vce, problems[2].vcc / 2);
});

test('problems 5-6 (bão hoà)', () => {
  const s = designSat(problems[4]);
  assert.deepEqual([r2(s.re), mA(s.ib), r2(s.rb), r2(s.rc)], [22, 2, 5050, 214]);
  assert.deepEqual(s.std, { re: 22, rb: 4700, rc: 220 });
  const t = satRb(problems[5]);
  assert.deepEqual([mA(t.icmax), mA(t.ib), r2(t.ve)], [27.91, 0.84, 2.79]);
  assert.equal(r2(t.rb / 1000), 10.04);
  assert.equal(t.std.rb, 10000);
});
