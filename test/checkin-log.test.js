import { test } from 'node:test';
import assert from 'node:assert/strict';
import { logCheckin, readCheckinLog, attemptEntry, CHECKIN_LOG_MAX } from '../api/_lib/checkin-log.js';

function fakeDb() {
  const lists = new Map();
  const ttl = new Map();
  return {
    lists, ttl,
    lpush: async (k, v) => { const l = lists.get(k) ?? []; l.unshift(JSON.parse(JSON.stringify(v))); lists.set(k, l); return l.length; },
    ltrim: async (k, a, b) => { lists.set(k, (lists.get(k) ?? []).slice(a, b + 1)); return 'OK'; },
    lrange: async (k, a, b) => (lists.get(k) ?? []).slice(a, b + 1),
    expire: async (k, s) => { ttl.set(k, s); return 1; },
  };
}
const req = { headers: { 'x-forwarded-for': '1.2.3.4', 'user-agent': 'Mozilla/5.0 (iPhone) Zalo' }, socket: {} };
const session = { id: 'S1', label: 'LT mạch', date: '2026-11-25', startsAt: 1, expiresAt: 2 };
const input = { mssv: '123456789', sessionId: 'S1', accuracy: 35.4, deviceId: 'dev-1234567890abcdef' };

test('a rejected check-in is logged by date with reason, distance and GPS accuracy', async () => {
  const db = fakeDb();
  const fail = { ok: false, code: 'too_far', message: 'Bạn đang cách lớp khoảng 1107 m (cho phép 100 m).', distance: 1107 };
  await logCheckin(req, attemptEntry({ input, session, result: fail, now: Date.UTC(2026, 10, 25, 5, 30) }), db);
  const [e] = await readCheckinLog('2026-11-25', db);
  assert.equal(e.mssv, '123456789');
  assert.equal(e.result, 'too_far');
  assert.equal(e.subject, 'Lý thuyết mạch');
  assert.equal(e.distance, 1107);
  assert.equal(e.accuracy, 35);
  assert.equal(e.ip, '1.2.3.4');
  assert.match(e.ua, /Zalo/);
  assert.ok(!('lat' in e) && !('lng' in e), 'raw coordinates are not stored');
});

test('success, late and already are distinguished, and a redirect remembers the page-chosen session', async () => {
  const db = fakeDb();
  const now = Date.UTC(2026, 10, 25, 5, 30);
  await logCheckin(req, attemptEntry({ input, session, now, result: { ok: true, already: false, record: { distance: 20 } } }), db);
  await logCheckin(req, attemptEntry({ input, session, now, result: { ok: true, already: false, record: { distance: 20, late: true } } }), db);
  await logCheckin(req, attemptEntry({ input, session, now, result: { ok: true, already: true, record: {} }, redirectedFrom: 'S0' }), db);
  const log = await readCheckinLog('2026-11-25', db);
  assert.deepEqual(log.map((e) => e.result), ['already', 'late', 'ok']);
  assert.equal(log[0].redirectedFrom, 'S0');
});

test('the log key expires and is capped per day', async () => {
  const db = fakeDb();
  await logCheckin(req, attemptEntry({ input, session, now: Date.UTC(2026, 10, 25, 5), result: { ok: false, code: 'closed' } }), db);
  const [key] = [...db.lists.keys()];
  assert.match(key, /2026-11-25/);
  assert.ok(db.ttl.get(key) > 86_400 * 30);
  assert.ok(CHECKIN_LOG_MAX >= 1000);
});

test('logging failures never break the check-in', async () => {
  const db = { lpush: async () => { throw new Error('down'); } };
  const orig = console.error; console.error = () => {};
  await assert.doesNotReject(logCheckin(req, { date: '2026-11-25', mssv: '1' }, db));
  console.error = orig;
});

test('an attempt with no session uses today in Vietnam time', () => {
  const e = attemptEntry({ input, session: null, now: Date.UTC(2026, 10, 25, 18), result: { ok: false, code: 'closed' } });
  assert.equal(e.date, '2026-11-26');
  assert.equal(e.subject, '');
});

test('an oversized session id sent by the page is cut short in the log', () => {
  const e = attemptEntry({ input: { ...input, sessionId: 'x'.repeat(100_000) }, session: null, now: 1, result: { ok: false, code: 'no_gps', message: 'm' } });
  assert.equal(e.sessionId.length, 64);
});

test('readCheckinLog rejects malformed dates', async () => {
  await assert.rejects(readCheckinLog('25/11', fakeDb()));
});
