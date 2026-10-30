import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCheckinBody, evaluateCheckin } from '../api/_lib/checkin-rules.js';

const NOW = 1_760_000_000_000;
const session = { id: 's1', startsAt: NOW - 60_000, lat: 10.7725, lng: 106.6980, radius: 100, expiresAt: NOW + 60_000, closed: false };
const student = { mssv: '100000001', ho: 'Nguyen Van', ten: 'A' };
const body = { s: 's1', t: 'abcdefghijkl', mssv: '100000001', deviceId: 'dev-1234567890abcdef', lat: 10.7726, lng: 106.6981, accuracy: 20 };
const base = { session, now: NOW, tokenOk: true, student, existing: null, deviceMssvInSession: null, boundMssv: null };

const run = (bodyPatch = {}, statePatch = {}) => {
  const { input, error } = parseCheckinBody({ ...body, ...bodyPatch });
  return error ?? evaluateCheckin(input, { ...base, ...statePatch });
};

test('accepts a valid nearby check-in', () => {
  const r = run();
  assert.equal(r.ok, true);
  assert.equal(r.already, false);
  assert.equal(r.record.mssv, '100000001');
  assert.ok(r.record.distance < 100);
});

test('rejects missing GPS', () => assert.equal(run({ lat: null }).code, 'no_gps'));
test('strips leading zeros from MSSV', () => assert.equal(run({ mssv: '0100000001' }).ok, true));
test('rejects bad MSSV format', () => assert.equal(run({ mssv: 'abc' }).code, 'bad_mssv'));
test('rejects closed session', () => assert.equal(run({}, { session: { ...session, closed: true } }).code, 'closed'));
test('rejects expired session', () => assert.equal(run({}, { now: NOW + 120_000 }).code, 'closed'));
test('rejects expired QR', () => assert.equal(run({}, { tokenOk: false }).code, 'expired_qr'));
test('rejects unknown student', () => assert.equal(run({}, { student: null }).code, 'unknown_mssv'));
test('rejects device bound to another MSSV', () => assert.equal(run({}, { boundMssv: '100000002' }).code, 'device_bound'));
test('rejects device already used in session', () => assert.equal(run({}, { deviceMssvInSession: '100000002' }).code, 'device_used'));
test('rejects low accuracy', () => assert.equal(run({ accuracy: 400 }).code, 'low_accuracy'));
test('rejects far away', () => assert.equal(run({ lat: 10.78 }).code, 'too_far'));

test('returns already for repeat check-in', () => {
  const existing = { mssv: '100000001', time: NOW - 5000 };
  const r = run({}, { existing });
  assert.equal(r.ok, true);
  assert.equal(r.already, true);
});

test('rejects before the window starts', () => assert.equal(run({}, { session: { ...session, startsAt: NOW + 1000 } }).code, 'not_yet'));
test('accepts without QR token when session does not require it', () => assert.equal(run({ t: '' }).ok, true));
