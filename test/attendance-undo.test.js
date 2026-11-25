import { test } from 'node:test';
import assert from 'node:assert/strict';
import { unpresent, restore, markOnTime } from '../api/attendance.js';

function fakeDb() {
  const m = new Map();
  const hash = (k) => { if (!m.has(k)) m.set(k, new Map()); return m.get(k); };
  return {
    m,
    hget: async (k, f) => m.get(k)?.get(f) ?? null,
    hset: async (k, obj) => { for (const [f, v] of Object.entries(obj)) hash(k).set(f, v); return 1; },
    hdel: async (k, f) => (m.get(k)?.delete(f) ? 1 : 0),
  };
}

test('a GPS check-in is not removed without confirmation', async () => {
  const db = fakeDb();
  await db.hset('att:s1', { 123456: { mssv: '123456', time: 1, late: true } });
  const r = await unpresent('s1', '123456', false, db);
  assert.equal(r.status, 409);
  assert.ok(await db.hget('att:s1', '123456'));
});

test('a confirmed removal keeps a copy and can be restored', async () => {
  const db = fakeDb();
  const rec = { mssv: '123456', time: 1, late: true, distance: 12 };
  await db.hset('att:s1', { 123456: rec });
  assert.equal((await unpresent('s1', '123456', true, db)).status, 200);
  assert.equal(await db.hget('att:s1', '123456'), null);
  assert.equal((await db.hget('att:removed:s1', '123456')).distance, 12);
  assert.equal((await restore('s1', '123456', db)).status, 200);
  assert.deepEqual(await db.hget('att:s1', '123456'), rec);
  assert.equal(await db.hget('att:removed:s1', '123456'), null);
});

test('manual marks are removed directly without a copy', async () => {
  const db = fakeDb();
  await db.hset('att:s1', { 123456: { mssv: '123456', time: 1, manual: true } });
  assert.equal((await unpresent('s1', '123456', false, db)).status, 200);
  assert.equal(await db.hget('att:s1', '123456'), null);
  assert.equal(await db.hget('att:removed:s1', '123456'), null);
  assert.equal((await restore('s1', '123456', db)).status, 404);
});

test('late → on time overwrites the record and keeps GPS data', async () => {
  const db = fakeDb();
  await db.hset('att:s1', { 123456: { mssv: '123456', time: 5, late: true, distance: 12 } });
  assert.equal((await markOnTime('s1', '123456', db)).status, 200);
  const rec = await db.hget('att:s1', '123456');
  assert.equal(rec.late, undefined);
  assert.equal(rec.time, 5);
  assert.equal(rec.distance, 12);
  assert.ok(rec.lateCleared);
  assert.equal(await db.hget('att:removed:s1', '123456'), null);
  assert.equal((await markOnTime('s1', '999999', db)).status, 404);
});
