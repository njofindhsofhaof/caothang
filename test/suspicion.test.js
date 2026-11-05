import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseSamples, checkinFlags, withDuplicateFlags } from '../api/_lib/suspicion.js';

const session = { lat: 10.7725, lng: 106.6980, radius: 50 };
const at = (lat, lng, accuracy, ts) => ({ lat, lng, accuracy, ts });
const input = (patch = {}) => ({ lat: 10.77262, lng: 106.69811, accuracy: 14.8, samples: [], ...patch });

test('parseSamples drops invalid entries and caps the count', () => {
  const raw = [at(10.7, 106.6, 5, 1), { lat: 'x' }, null, ...Array.from({ length: 8 }, (_, i) => at(10.7, 106.6, 5, i + 2))];
  assert.equal(parseSamples(raw).length, 3); // 5 mẫu đầu, bỏ 2 mẫu hỏng
  assert.deepEqual(parseSamples('nope'), []);
});

test('normal jittering GPS raises no flags', () => {
  const samples = [at(10.77262, 106.69811, 14.8, 1), at(10.77264, 106.69809, 12.1, 2), at(10.77261, 106.69812, 11.6, 3)];
  assert.deepEqual(checkinFlags(input({ samples }), session), []);
});

test('flags a pinned location that never moves across fresh readings', () => {
  const samples = [1, 2, 3].map((ts) => at(10.77262, 106.69811, 5, ts));
  assert.deepEqual(checkinFlags(input({ accuracy: 5, samples }), session), ['static']);
});

test('ignores identical readings that share a timestamp (browser cache)', () => {
  const samples = [1, 1, 1].map((ts) => at(10.77262, 106.69811, 5, ts));
  assert.deepEqual(checkinFlags(input({ accuracy: 5, samples }), session), []);
});

test('ignores identical coarse Wi-Fi fixes', () => {
  const samples = [1, 2, 3].map((ts) => at(10.77262, 106.69811, 35, ts));
  assert.deepEqual(checkinFlags(input({ accuracy: 35, samples }), session), []);
});

test('flags suspiciously precise accuracy', () => {
  assert.deepEqual(checkinFlags(input({ accuracy: 1 }), session), ['precise']);
  assert.deepEqual(checkinFlags(input({ accuracy: 3.5 }), session), []);
});

test('flags a pin dropped exactly on the class centre', () => {
  assert.deepEqual(checkinFlags(input({ lat: session.lat, lng: session.lng }), session), ['center']);
});

test('withDuplicateFlags links students sharing exact coordinates and strips raw coords', () => {
  const out = withDuplicateFlags([
    { mssv: 'a', lat: 10.772601, lng: 106.698102 },
    { mssv: 'b', lat: 10.772601, lng: 106.698102 },
    { mssv: 'c', lat: 10.772655, lng: 106.698140 },
    { mssv: 'd', manual: true },
  ]);
  assert.deepEqual(out, [{ mssv: 'a', dupWith: ['b'] }, { mssv: 'b', dupWith: ['a'] }, { mssv: 'c' }, { mssv: 'd', manual: true }]);
});
