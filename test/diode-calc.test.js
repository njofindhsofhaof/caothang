import { test } from 'node:test';
import assert from 'node:assert/strict';

globalThis.window = globalThis;
await import('../assets/diode-calc.js');
await import('../assets/diode-data.js');
const { solve, design, nearestE12, nextE12 } = globalThis.DIODE_CALC;
const problems = globalThis.DIODE_PROBLEMS;
const byId = (id) => problems.find((p) => p.id === id);
const mA = (a) => Math.round(a * 1e5) / 100; // A -> mA, 2 chu so

test('VD1: one LED, R = 220 Ω (numbers from the notebook)', () => {
  const lv = byId(1).levels;
  const off = solve(lv, 1.5, 220);
  assert.equal(off.mode, 'off');
  assert.equal(off.iR, 0);
  assert.deepEqual(off.nodes, [1.5]);
  assert.equal(mA(solve(lv, 5, 220).iR), 13.64);
  assert.equal(mA(solve(lv, 9, 220).iR), 31.82);
  assert.deepEqual(solve(lv, 9, 220).nodes, [2]);
  assert.deepEqual([5, 9, 12].map((v) => design(lv, v, 0.01).r), [300, 700, 1000]);
});

test('VD2 and VD3: series diodes', () => {
  const vd2 = byId(2).levels;
  assert.equal(mA(solve(vd2, 5, 220).iR), 10.45);
  assert.equal(mA(solve(vd2, 9, 220).iR), 28.64);
  assert.deepEqual(solve(vd2, 9, 220).nodes, [2.7, 2]);
  assert.deepEqual([5, 9, 12].map((v) => design(vd2, v, 0.01).r), [230, 630, 930]);

  const vd3 = byId(3).levels;
  const off = solve(vd3, 5, 220);
  assert.equal(off.mode, 'off');
  assert.deepEqual(off.nodes, [5, 5, 5]);
  const on = solve(vd3, 9, 220);
  assert.equal(mA(on.iR), 15);
  assert.deepEqual(on.nodes, [5.7, 5, 3]);
  assert.equal(mA(on.id.D2), 15);
  assert.equal(mA(solve(vd3, 12, 220).iR), 28.64);
  assert.deepEqual([9, 12, 15].map((v) => design(vd3, v, 0.01).r), [330, 630, 930]);
});

test('VD5: a reverse-biased diode opens the series circuit', () => {
  const s = solve(byId(5).levels, 9, 220);
  assert.equal(s.mode, 'blocked');
  assert.equal(s.iR, 0);
  assert.deepEqual(s.nodes, [9, 9]);
  assert.deepEqual(solve(byId(6).levels, 12, 220).nodes, [12, 12, 12]);
});

test('VD6, VD7, VD8: parallel diodes clamp at the lowest threshold and share current', () => {
  const vd6 = solve(byId(7).levels, 9, 330);
  assert.equal(mA(vd6.iR), 19.09);
  assert.equal(mA(vd6.id.D1), 9.55);
  const d6 = design(byId(7).levels, 9, 0.015);
  assert.equal(d6.iR, 0.03);
  assert.equal(d6.r, 210);
  assert.equal(d6.nearest, 220);

  const vd7 = solve(byId(8).levels, 9, 330);
  assert.deepEqual(vd7.nodes, [2.2]);
  assert.equal(mA(vd7.iR), 20.61);
  assert.deepEqual(['D1', 'D2', 'D3', 'D4', 'D5', 'D6'].map((n) => mA(vd7.id[n])), [6.87, 0, 6.87, 0, 6.87, 0]);
  const d7 = design(byId(8).levels, 9, 0.01);
  assert.equal(Math.round(d7.r * 100) / 100, 226.67);
  assert.equal(d7.nearest, 220);

  const vd8 = solve(byId(10).levels, 12, 330);
  assert.deepEqual(vd8.nodes, [5.2, 3]);
  assert.equal(mA(vd8.iR), 20.61);
  assert.deepEqual(['D1', 'D2', 'D3', 'D4', 'D5', 'D6'].map((n) => mA(vd8.id[n])), [10.3, 0, 10.3, 10.3, 0, 10.3]);
  const d8 = design(byId(10).levels, 12, 0.01);
  assert.equal(d8.r, 340);
  assert.equal(d8.nearest, 330);
});

test('E12 helpers pick nearest and next-higher standard values', () => {
  assert.equal(nearestE12(210), 220);
  assert.equal(nearestE12(930), 1000);
  assert.equal(nearestE12(416.67), 390);
  assert.equal(nextE12(466.67), 470);
  assert.equal(nextE12(470), 470);
  assert.equal(nextE12(930), 1000);
  assert.equal(nextE12(9.5), 10);
});

test('every problem is well formed and every design case is solvable', () => {
  const ids = new Set();
  for (const p of problems) {
    assert.ok(!ids.has(p.id), `duplicate id ${p.id}`);
    ids.add(p.id);
    assert.ok(p.taps.some((t) => t.node === 0), `bài ${p.id} needs a tap at node 0`);
    p.taps.forEach((t) => assert.ok(t.node < p.levels.length));
    for (const v of p.analysis.vccs) {
      const s = solve(p.levels, v, p.analysis.r);
      assert.ok(Number.isFinite(s.iR) && s.iR >= 0);
    }
    if (p.design) for (const v of p.design.vccs) assert.ok(design(p.levels, v, p.design.ma / 1000).ok, `bài ${p.id} VCC ${v}`);
  }
});

test('Ge diode: series Ge + Si + LED and Ge // Si cluster', () => {
  const b12 = byId(12).levels;
  assert.equal(solve(b12, 2, 220).mode, 'off');
  const s = solve(b12, 9, 220);
  assert.ok(Math.abs(s.iR * 1000 - 27.27) < 0.01);
  assert.deepEqual(s.nodes.map((v) => Math.round(v * 100) / 100), [3, 2.7, 2]);
  assert.deepEqual([5, 9, 12].map((v) => Math.round(design(b12, v, 0.01).r)), [200, 600, 900]);
  const b13 = solve(byId(13).levels, 9, 220);
  assert.ok(Math.abs(b13.iR * 1000 - 30.45) < 0.01);
  assert.equal(b13.id.D2, 0);
  assert.ok(Math.abs(b13.id.D1 - b13.iR) < 1e-12);
  assert.ok(Math.abs(design(byId(13).levels, 9, 0.01).r - 670) < 1e-6);
});
