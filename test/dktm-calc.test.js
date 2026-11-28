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

test('đề 1, 3 use 3-mesh circuits; đề 2, 4 use nodal voltages with only nodes A, B', () => {
  assert.deepEqual([1, 2, 3, 4].map((d) => exams[d].b1.method), ['mesh', 'nodal', 'mesh', 'nodal']);
  assert.equal(exams[1].b1.loops, 3);
  assert.equal(exams[3].b1.loops, 3);
  assert.deepEqual(exams[2].b1.nodes, ['A', 'B']);
  assert.deepEqual(exams[4].b1.nodes, ['A', 'B']);
});

test('nodal exams need source transformation; đề 3 and đề 4 have a current source', () => {
  assert.ok(exams[2].b1.vbranches.length >= 2);
  assert.ok(exams[4].b1.vbranches.length >= 2);
  assert.equal(exams[3].b1.isources.length, 1);
  assert.equal(exams[4].b1.isources.length, 1);
});

test('every part of each bài sums to 5 points', () => {
  for (const e of globalThis.DKTM_EXAMS) {
    near(solveCircuit(e.b1).groups.reduce((a, g) => a + g.pts, 0), 5);
    near(solveThreePhase(e.b2).groups.reduce((a, g) => a + g.pts, 0), 5);
  }
});

const checkCircuit = (de, x, cur, p) => {
  const s = solveCircuit(exams[de].b1);
  x.forEach((v, k) => near(s.x[k], v, 1e-9));
  for (const [k, v] of Object.entries(cur)) near(s.cur[k], v, 1e-9);
  near(s.pSrc, p, 1e-9);
  near(s.pLoad, p, 1e-9);
};

test('đề 1 three meshes: I_m = 8, 2, −1 A, branches 8, 6, 2, 3, 1 A, 340 W', () => {
  checkCircuit(1, [8, 2, -1], { I_1: 8, I_2: 6, I_3: 2, I_4: 3, I_5: 1 }, 340);
});

test('đề 3 mesh with current source: I_m3 = J, two unknowns 10, 8 A, U_J = 16 V, 736 W', () => {
  const p = exams[3].b1;
  const sys = system(p);
  assert.deepEqual(sys.free, [0, 1]);
  checkCircuit(3, [10, 8], { I_1: 10, I_2: 2, I_3: 8, I_4: 4, I_5: 4 }, 736);
  near(globalThis.MLN_CALC.solve(p).uJ.J, 16);
  const d = solveCircuit(p).groups[3].lines.join('\n');
  assert.match(d, /U_J = R_4\(I_m3 − I_m2\) \+ R_5·I_m3 = 2 × \(4 − 8\) \+ 6 × 4 = 16 V/);
});

test('đề 2 two nodes, two source transformations: V_A = 10 V, V_B = 12 V, 280 W', () => {
  checkCircuit(2, [10, 12], { I_1: 3, I_2: 8, I_3: 2, I_4: 5, I_5: 6 }, 280);
});

test('đề 4 two nodes, transformations and J: V_A = 16 V, V_B = 8 V, 380 W', () => {
  checkCircuit(4, [16, 8], { I_1: 5, I_2: 6, I_3: 2, I_4: 8, I_5: 8 }, 380);
});

test('Cramer agrees with MLN_CALC for every Chương 3 circuit', () => {
  for (const e of globalThis.DKTM_EXAMS) {
    const p = e.b1;
    const ref = globalThis.MLN_CALC.solve(p);
    const { x, free } = cramer(p, system(p));
    const want = p.method === 'mesh' ? ref.im : ref.v;
    free.forEach((i, k) => near(x[k], want[i], 1e-9));
  }
});

test('written equations match the matrix (đề 1, đề 2, đề 3)', () => {
  const mesh = solveCircuit(exams[1].b1).groups[0].lines;
  assert.ok(mesh.some((l) => l.includes('(R_2 + R_3 + R_4)·I_m2 − R_2·I_m1 − R_4·I_m3 = 0') && l.endsWith('−4I_m1 + 13I_m2 − 6I_m3 = 0   (2)')));
  assert.ok(mesh.some((l) => l.includes('= −E_2') && l.endsWith('−6I_m2 + 8I_m3 = −20   (3)')));
  const nodal = solveCircuit(exams[2].b1).groups[0].lines;
  assert.ok(nodal.some((l) => l.includes('(1/R_1 + 1/R_3 + 1/R_4)·V_A') && l.endsWith('1,6V_A − V_B = 4   (1)')));
  assert.ok(nodal.some((l) => l.endsWith('−V_A + 2,5V_B = 20   (2)')));
  const withJn = solveCircuit(exams[4].b1).groups[0].lines;
  assert.ok(withJn.some((l) => l.includes('= E_1/R_1 + J') && l.endsWith('V_A − 0,25V_B = 14   (1)')));
  const withJ = solveCircuit(exams[3].b1).groups[0].lines;
  assert.ok(withJ.some((l) => l.includes('I_m3 = J = 4 A')));
  assert.ok(withJ.some((l) => l.endsWith('−4I_m1 + 9I_m2 = 32   (2)')));
  assert.ok(!withJ.some((l) => l.startsWith('Mắt 3:')));
});

test('determinants divide to exact answers (đề 1 3×3, đề 4 2×2)', () => {
  const b1 = solveCircuit(exams[1].b1).groups[1].lines.join('\n');
  assert.match(b1, /I_m1 = Δ_1\/Δ = 2240\/280 = 8 A/);
  const b4 = solveCircuit(exams[4].b1).groups[1].lines.join('\n');
  assert.match(b4, /Δ = 1 × 1,75 − \(−0,25\) × \(−0,25\) = 1,6875/);
  assert.match(b4, /V_A = Δ_1\/Δ = 27\/1,6875 = 16 V/);
});

test('linear() drops zero terms and unit coefficients', () => {
  const p = { method: 'nodal', nodes: ['A', 'B'] };
  assert.equal(linear(p, [1, -1]), 'V_A − V_B');
  assert.equal(linear(p, [0, 2.5]), '2,5V_B');
  assert.equal(linear(p, [0, 0]), '0');
});

test('cramer() refuses systems that are not 2×2 or 3×3', () => {
  assert.throws(() => cramer({ method: 'mesh' }, { free: [0] }));
  assert.throws(() => cramer({ method: 'mesh' }, { free: [0, 1, 2, 3] }));
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

test('nodal exams with source transformation have a redrawn circuit whose current sources match E/R', () => {
  const sub = (s) => s.replace(/[₀-₉]/g, (c) => String(c.charCodeAt(0) - 0x2080));
  for (const de of [2, 4]) {
    const p = exams[de].b1;
    assert.ok(Array.isArray(p.drawT) && p.sizeT, `đề ${de} thiếu hình sau biến đổi`);
    const labels = p.drawT.filter((c) => c[0] === 'i').map((c) => sub(c[4]));
    p.vbranches.forEach((v, k) => {
      const name = `J${k + 1}`;
      assert.ok(labels.includes(`${name} = ${v.value / v.r} A`), `đề ${de}: thiếu nguồn ${name} = ${v.value / v.r} A`);
      assert.ok(!p.drawT.some((c) => c[0] === 'v'), `đề ${de}: hình sau biến đổi vẫn còn nguồn áp`);
    });
    for (const j of p.isources || []) assert.ok(labels.some((l) => l.startsWith(`${j.sym} = ${j.value} A`)));
    const setup = solveCircuit(p).groups[0].lines.join('\n');
    assert.match(setup, /Vẽ lại mạch sau khi biến đổi/);
    assert.match(setup, /nguồn dòng J_1 = E_1\/R_1/);
  }
});

test('nodal solutions name the ground node C and start with "Gọi V_A, V_B, V_C … V_C = 0"', () => {
  for (const de of [2, 4]) {
    const p = exams[de].b1;
    const first = solveCircuit(p).groups[0].lines[0];
    assert.equal(first, 'Gọi V_A, V_B, V_C là điện thế tại các nút A, B, C. Chọn nút C làm nút gốc ⇒ V_C = 0. Ẩn còn lại là V_A, V_B.');
    for (const d of [p.draw, p.drawT]) {
      const names = d.filter((c) => c[0] === 'n').map((c) => c[3]);
      assert.ok(names.includes('C'), `đề ${de}: hình thiếu tên nút C`);
      assert.ok(!names.some((n) => /gốc/.test(n)), `đề ${de}: hình còn chữ "gốc"`);
    }
  }
});

test('đề 2 finds I_1, I_2 with K1 after the Ohm currents', () => {
  const c = solveCircuit(exams[2].b1).groups[2].lines;
  const at = (re) => c.findIndex((l) => re.test(l));
  assert.ok(c.includes('K1 tại nút A (tổng dòng vào = tổng dòng ra): I_1 + I_3 = I_4 ⇒ I_1 = I_4 − I_3 = 5 − 2 = 3 A'));
  assert.ok(c.includes('K1 tại nút B (tổng dòng vào = tổng dòng ra): I_2 = I_3 + I_5 ⇒ I_2 = I_3 + I_5 = 2 + 6 = 8 A'));
  assert.ok(at(/^I_3 = /) < at(/^K1 tại nút A/) && at(/^I_5 = /) < at(/^K1 tại nút B/));
  assert.ok(!c.some((l) => /\(E_1 − V_A\)/.test(l)));
});

test('every nodal exam with voltage branches finds their currents with K1 (đề 4 has J at node A)', () => {
  for (const de of [2, 4]) assert.equal(exams[de].b1.k1, true, `đề ${de} chưa dùng K1`);
  const c = solveCircuit(exams[4].b1).groups[2].lines.join('\n');
  assert.match(c, /K1 tại nút B .*: I_2 \+ I_3 = I_5 ⇒ I_2 = I_5 − I_3 = 8 − 2 = 6 A/);
  assert.match(c, /K1 tại nút A .*: I_1 \+ J = I_3 \+ I_4 ⇒ I_1 = I_3 \+ I_4 − J = 2 \+ 8 − 5 = 5 A/);
});
