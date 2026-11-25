import { test } from 'node:test';
import assert from 'node:assert/strict';

globalThis.window = globalThis;
await import('../assets/dkt-calc.js');
await import('../assets/dkt-data.js');
await import('../assets/bjt-calc.js');
await import('../assets/zener-calc.js');
await import('../assets/diode-calc.js');
await import('../assets/phanap-calc.js');
const { rect, readBands } = globalThis.DKT_CALC;
const exams = globalThis.DKT_EXAMS;
const plan = globalThis.DKT_PLAN;
const r2 = (x) => Math.round(x * 100) / 100;

test('plan adds up to 43 working minutes and 10 points', () => {
  assert.equal(plan.reduce((a, p) => a + p.min, 0), 43);
  assert.equal(r2(plan.reduce((a, p) => a + p.pts, 0)), 10);
});

test('positive half-wave: 12 V rms, 1 kΩ (worked example in Chapter 3)', () => {
  const r = rect({ pol: '+', vrms: 12, r: 1000 });
  assert.equal(r.vm, 16.97);
  assert.equal(r2(r.vop), 16.27);
  assert.equal(r.vdc, 5.17);
  assert.equal(r2(r.idc * 1000), 5.17);
});

test('negative half-wave flips the sign of the output', () => {
  const r = rect({ pol: '-', vrms: 9, r: 470 });
  assert.equal(r.vm, 12.73);
  assert.equal(r2(r.vop), -12.03);
  assert.equal(r.vdc, -3.83);
  assert.ok(r.idc < 0);
});

test('reads 4-band and 5-band colour codes with tolerance range', () => {
  assert.deepEqual(
    readBands(['Vàng', 'Tím', 'Đỏ', 'Vàng kim']),
    { digits: [4, 7], exp: 2, ohm: 4700, tol: 5, min: 4465, max: 4935 }
  );
  const r5 = readBands(['Đỏ', 'Đỏ', 'Đen', 'Nâu', 'Nâu']);
  assert.equal(r5.ohm, 2200);
  assert.equal(r5.tol, 1);
  assert.equal(readBands(['Vàng', 'Tím', 'Vàng kim', 'Vàng kim']).ohm, 4.7);
});

test('rejects malformed colour codes', () => {
  assert.equal(readBands(['Vàng', 'Tím', 'Đỏ']), null);
  assert.equal(readBands(['Hồng', 'Tím', 'Đỏ', 'Vàng kim']), null);
  assert.equal(readBands(['Vàng', 'Tím', 'Đỏ', 'Cam']), null);
});

test('every exam has valid parts and one active plus one saturated BJT case', () => {
  for (const e of exams) {
    assert.ok(readBands(e.parts.bands4) && e.parts.bands4.length === 4, `de ${e.de} bands4`);
    assert.ok(readBands(e.parts.bands5) && e.parts.bands5.length === 5, `de ${e.de} bands5`);
    const modes = e.bjt.vbb.map((vbb) => globalThis.BJT_CALC.qPoint({ ...e.bjt, vbb }).mode);
    assert.deepEqual(modes, ['active', 'sat'], `de ${e.de} bjt`);
    const z = globalThis.ZENER_CALC.zenerPoint({ ...e.zener.zener, vs: e.zener.vs, rs: e.zener.rs, rl: e.zener.rl });
    assert.ok(z.iz > 0 && z.pz <= e.zener.zener.vz * e.zener.zener.izmax, `de ${e.de} zener`);
    const s = globalThis.PA_CALC.solve(e.res);
    assert.ok(Math.abs(s.stages.reduce((a, t) => a + t.v, 0) - e.res.vcc) < 1e-9, `de ${e.de} K2`);
  }
});

test('exam rectifiers alternate positive and negative half-wave', () => {
  assert.deepEqual(exams.map((e) => e.rect.pol), ['+', '-', '+', '-']);
});

test('exam diode circuits cover series, combined, parallel and blocked cases', () => {
  const modes = exams.map((e) => globalThis.DIODE_CALC.solve(e.diode.levels, e.diode.vcc, e.diode.r));
  assert.equal(r2(modes[0].iR * 1000), 19.09);
  assert.equal(r2(modes[1].iR * 1000), 10.6);
  assert.equal(modes[1].id.D3, 0);
  assert.equal(r2(modes[2].id.D2 * 1000), 10);
  assert.equal(modes[2].id.D1, 0);
  assert.equal(modes[3].mode, 'blocked');
  assert.deepEqual(modes[3].nodes, [10, 10]);
});
