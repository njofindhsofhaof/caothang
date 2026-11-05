import { test } from 'node:test';
import assert from 'node:assert/strict';

globalThis.window = globalThis;
await import('../assets/dld-calc.js');
await import('../assets/dld-data.js');
const C = globalThis.DLD_CALC;

const near = (got, want, tol) => assert.ok(Math.abs(got - want) <= tol, `${got} != ${want}`);

test('shunt riêng rẽ matches ví dụ 1.17', () => {
  const r = C.shuntSeparate(1000, 50e-6, [1e-3, 10e-3, 100e-3]);
  near(r[0], 52.63, 0.005);
  near(r[1], 5.025, 0.001);
  near(r[2], 0.5, 0.001);
});

test('shunt vạn năng matches ví dụ 1.18', () => {
  const r = C.shuntUniversal(1000, 50e-6, [1e-3, 10e-3, 100e-3]);
  near(r.rsh, 52.63, 0.005);
  near(r.r12, 5.263, 0.001);
  near(r.r1, 0.526, 0.001);
  near(r.r2, 4.737, 0.001);
  near(r.r3, 47.367, 0.002);
});

test('shunt vạn năng satisfies every switch position', () => {
  const Rg = 2000, Igm = 100e-6, I = [1e-3, 10e-3, 100e-3];
  const { r1, r2, r3 } = C.shuntUniversal(Rg, Igm, I);
  const full = (sh, meter) => Igm * (meter + sh) / sh;
  near(full(r1 + r2 + r3, Rg), I[0], 1e-12);
  near(full(r1 + r2, Rg + r3), I[1], 1e-12);
  near(full(r1, Rg + r2 + r3), I[2], 1e-12);
});

test('điện trở phụ riêng rẽ matches ví dụ 1.27', () => {
  const r = C.multSeparate(1700, 50e-6, [10, 50, 100]);
  near(r[0], 198300, 0.01);
  near(r[1], 998300, 0.01);
  near(r[2], 1998300, 0.01);
});

test('điện trở phụ vạn năng matches ví dụ 1.28', () => {
  const r = C.multUniversal(1700, 50e-6, [10, 50, 100]);
  near(r[0], 198300, 0.01);
  near(r[1], 800000, 0.01);
  near(r[2], 1000000, 0.01);
});

test('formatters use Vietnamese decimals and SI prefixes', () => {
  assert.equal(C.fmtOhm(52.6315789), '52,63 Ω');
  assert.equal(C.fmtOhm(198300), '198,3 kΩ');
  assert.equal(C.fmtOhm(1998300), '1,998 MΩ');
  assert.equal(C.fmtOhm(1000000), '1 MΩ');
  assert.equal(C.fmtA(50e-6), '50 µA');
  assert.equal(C.fmtA(0.2), '200 mA');
  assert.equal(C.fmtA(1), '1 A');
  assert.equal(C.fmtV(2.5), '2,5 V');
});

test('every đề has 3 rising ranges above the meter limit and positive answers', () => {
  const sets = globalThis.DLD_SETS;
  assert.equal(sets.filter((s) => s.kind === 'shunt').length, 3);
  assert.equal(sets.filter((s) => s.kind === 'mult').length, 3);
  for (const s of sets) {
    for (const part of [s.a, s.b]) {
      assert.equal(part.ranges.length, 3);
      for (let k = 1; k < 3; k++) assert.ok(part.ranges[k] > part.ranges[k - 1], `${s.id} ranges must rise`);
      const vals = s.kind === 'shunt'
        ? (part === s.a ? C.shuntSeparate(s.rg, s.igm, part.ranges) : Object.values(C.shuntUniversal(s.rg, s.igm, part.ranges)))
        : (part === s.a ? C.multSeparate(s.rg, s.igm, part.ranges) : C.multUniversal(s.rg, s.igm, part.ranges));
      vals.forEach((v) => assert.ok(v > 0, `${s.id} gives non-positive resistor`));
    }
  }
});
