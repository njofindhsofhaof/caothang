import { test } from 'node:test';
import assert from 'node:assert/strict';
import { audit, readAudit, AUDIT_MAX } from '../api/_lib/audit.js';

function fakeDb() {
  let list = [];
  return {
    lpush: async (k, v) => { list.unshift(JSON.parse(JSON.stringify(v))); return list.length; },
    ltrim: async (k, a, b) => { list = list.slice(a, b + 1); return 'OK'; },
    lrange: async (k, a, b) => list.slice(a, b + 1),
  };
}
const req = { headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8', 'user-agent': 'Mozilla/5.0 (iPhone)' }, socket: {} };

test('audit records newest first with time, IP and device', async () => {
  const db = fakeDb();
  await audit(req, { action: 'excuse', mssv: '123456', value: 'P' }, db);
  await audit(req, { action: 'present', mssv: '123456' }, db);
  const log = await readAudit(10, db);
  assert.deepEqual(log.map((e) => e.action), ['present', 'excuse']);
  assert.equal(log[1].ip, '1.2.3.4');
  assert.match(log[1].ua, /iPhone/);
  assert.ok(Number.isFinite(log[0].at));
});

test('audit failures never throw into the main action', async () => {
  const db = { lpush: async () => { throw new Error('down'); }, ltrim: async () => 'OK' };
  const orig = console.error; console.error = () => {};
  await assert.doesNotReject(audit(req, { action: 'x' }, db));
  console.error = orig;
});

test('the log is capped', async () => {
  assert.ok(AUDIT_MAX >= 1000);
});
