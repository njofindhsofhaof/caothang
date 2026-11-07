import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hashPin, verifyPinHash, checkNewPin } from '../api/_lib/pin.js';
import { teacherGate } from '../api/_lib/store.js';

function fakeDb(initial = {}) {
  const m = new Map(Object.entries(initial));
  return {
    get: async (k) => m.get(k) ?? null,
    incr: async (k) => { m.set(k, (m.get(k) ?? 0) + 1); return m.get(k); },
    expire: async () => 1,
  };
}
const req = (pin) => ({ headers: { 'x-teacher-pin': pin, 'x-forwarded-for': '9.9.9.9' }, socket: {} });

test('hashPin stores no plain text and verifies only the same PIN', () => {
  const h = hashPin('lopDDT26c2026');
  assert.ok(h.startsWith('scrypt$'));
  assert.ok(!h.includes('lopDDT26c2026'));
  assert.ok(verifyPinHash('lopDDT26c2026', h));
  assert.ok(!verifyPinHash('lopDDT26c2027', h));
  assert.notEqual(hashPin('lopDDT26c2026'), h); // salt ngau nhien
});

test('verifyPinHash rejects malformed stored values', () => {
  assert.equal(verifyPinHash('x', 'plain-text'), false);
  assert.equal(verifyPinHash('x', 'scrypt$abc'), false);
  assert.equal(verifyPinHash(undefined, hashPin('abc1234567')), false);
});

test('checkNewPin enforces length, letters + digits and difference', () => {
  assert.match(checkNewPin('abc123', 'old'), /ít nhất 10/);
  assert.match(checkNewPin('abcdefghijk', 'old'), /chữ và số/);
  assert.match(checkNewPin('12345678901', 'old'), /chữ và số/);
  assert.match(checkNewPin(' abc1234567', 'old'), /khoảng trắng/);
  assert.match(checkNewPin('abc1234567', 'abc1234567'), /khác PIN/);
  assert.equal(checkNewPin('abc1234567', 'old'), null);
});

test('after a PIN change, the stored PIN works and the Vercel PIN no longer does', async () => {
  process.env.TEACHER_PIN = 'vercel-pin-1';
  const db = fakeDb({ 'teacher:pin': hashPin('newPin2026ab') });
  assert.equal(await teacherGate(req('newPin2026ab'), db), null);
  assert.equal((await teacherGate(req('vercel-pin-1'), db)).status, 401);
});

test('without a stored PIN, the Vercel PIN is used', async () => {
  process.env.TEACHER_PIN = 'vercel-pin-1';
  assert.equal(await teacherGate(req('vercel-pin-1'), fakeDb()), null);
});
