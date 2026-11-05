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

test('stores rounded coords and no flags for a normal check-in', () => {
  const r = run();
  assert.equal(r.record.lat, 10.7726);
  assert.equal(r.record.flags, undefined);
});

test('flags (but still accepts) a pinned location', () => {
  const samples = [1, 2, 3].map((ts) => ({ lat: 10.7726, lng: 106.6981, accuracy: 2, ts }));
  const r = run({ accuracy: 2, samples });
  assert.equal(r.ok, true);
  assert.deepEqual(r.record.flags, ['static', 'precise']);
});

test('rejects missing GPS',() => assert.equal(run({ lat: null }).code, 'no_gps'));
test('strips leading zeros from MSSV', () => assert.equal(run({ mssv: '0100000001' }).ok, true));
test('rejects bad MSSV format', () => assert.equal(run({ mssv: 'abc' }).code, 'bad_mssv'));
test('rejects closed session', () => assert.equal(run({}, { session: { ...session, closed: true } }).code, 'closed'));
// NOW rơi vào tiết 5 (15:53 giờ VN) nên phải qua hết tiết mới bị từ chối.
test('rejects expired session', () => assert.equal(run({}, { now: NOW + 2 * 3_600_000 }).code, 'closed'));
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

// Buổi 12:30–12:45 (giờ VN): trễ được nhận đến hết tiết 1 lúc 13:15.
const vn = (hhmm) => Date.parse(`2026-11-04T${hhmm}:00+07:00`);
const lateSession = { ...session, startsAt: vn('12:30'), expiresAt: vn('12:45') };

test('accepts on time without the late flag', () => {
  const r = run({}, { session: lateSession, now: vn('12:40') });
  assert.equal(r.ok, true);
  assert.equal(r.record.late, undefined);
});

test('accepts after the session ends but within the period, marked late with its time', () => {
  const r = run({}, { session: lateSession, now: vn('12:58') });
  assert.equal(r.ok, true);
  assert.equal(r.record.late, true);
  assert.equal(r.record.time, vn('12:58'));
});

test('rejects once the period is over', () => assert.equal(run({}, { session: lateSession, now: vn('13:16') }).code, 'closed'));
test('rejects late check-in after the teacher closes the session', () => {
  assert.equal(run({}, { session: { ...lateSession, closed: true }, now: vn('12:58') }).code, 'closed');
});
