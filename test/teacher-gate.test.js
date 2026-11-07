import { test } from 'node:test';
import assert from 'node:assert/strict';
import { teacherGate } from '../api/_lib/store.js';

function fakeDb() {
  const m = new Map();
  return {
    get: async (k) => m.get(k) ?? null,
    incr: async (k) => { m.set(k, (m.get(k) ?? 0) + 1); return m.get(k); },
    expire: async () => 1,
  };
}
const req = (pin, ip = '1.2.3.4') => ({ headers: { 'x-teacher-pin': pin, 'x-forwarded-for': ip }, socket: {} });

test('accepts the correct PIN', async () => {
  process.env.TEACHER_PIN = 'correct-pin-123';
  assert.equal(await teacherGate(req('correct-pin-123'), fakeDb()), null);
});

test('rejects a wrong PIN with 401', async () => {
  process.env.TEACHER_PIN = 'correct-pin-123';
  const r = await teacherGate(req('wrong'), fakeDb());
  assert.equal(r.status, 401);
});

test('locks an IP after 8 wrong PINs, even if the next guess is right', async () => {
  process.env.TEACHER_PIN = 'correct-pin-123';
  const db = fakeDb();
  for (let i = 0; i < 8; i += 1) assert.equal((await teacherGate(req('guess' + i), db)).status, 401);
  assert.equal((await teacherGate(req('correct-pin-123'), db)).status, 429);
  // IP khác không bị ảnh hưởng.
  assert.equal(await teacherGate(req('correct-pin-123', '5.6.7.8'), db), null);
});
