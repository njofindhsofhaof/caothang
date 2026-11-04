import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pastLocations } from '../api/_lib/past-places.js';

const here = (startsAt, lat, lng, extra = {}) => ({ startsAt, lat, lng, placeId: '', placeName: 'Vị trí hiện tại', label: '', ...extra });

test('merges sessions within a few metres into one location, newest first', () => {
  const spots = pastLocations([
    here(1, 10.8500, 106.7700, { label: 'Sáng thứ Hai' }),
    here(3, 10.85005, 106.77003, { label: 'Sáng thứ Tư' }),
    here(2, 10.8600, 106.7800),
  ]);
  assert.equal(spots.length, 2);
  assert.deepEqual(spots[0], { lat: 10.85005, lng: 106.77003, lastAt: 3, label: 'Sáng thứ Tư', count: 2 });
  assert.equal(spots[1].count, 1);
});

test('ignores sessions that used a saved room or have no coordinates', () => {
  const spots = pastLocations([
    here(1, 10.85, 106.77, { placeId: 'abcd1234', placeName: 'F4.2' }),
    here(2, NaN, 106.77),
    null,
  ]);
  assert.deepEqual(spots, []);
});

test('hides locations already saved as a room', () => {
  const spots = pastLocations([here(1, 10.85, 106.77), here(2, 10.86, 106.78)], [{ name: 'F4.2', lat: 10.85001, lng: 106.77001 }]);
  assert.equal(spots.length, 1);
  assert.equal(spots[0].lat, 10.86);
});
