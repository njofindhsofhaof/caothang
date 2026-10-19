import { test } from 'node:test';
import assert from 'node:assert/strict';
import { haversineMeters, isValidCoord } from '../api/_lib/geo.js';

test('zero distance for the same point', () => {
  assert.equal(haversineMeters(10.77, 106.7, 10.77, 106.7), 0);
});

test('about 111 m per 0.001 degree latitude', () => {
  const d = haversineMeters(10.77, 106.7, 10.771, 106.7);
  assert.ok(d > 110 && d < 112, `got ${d}`);
});

test('validates coordinates', () => {
  assert.equal(isValidCoord(10.7, 106.7), true);
  assert.equal(isValidCoord(NaN, 106.7), false);
  assert.equal(isValidCoord(91, 0), false);
});
