import { test } from 'node:test';
import assert from 'node:assert/strict';
import { monthTally, subjectStreak, classLeaderboard } from '../api/_lib/tally.js';

// Buổi ngoài giờ học (19:00) nên không có khung trễ: lateUntil = expiresAt.
const at = (date, hm) => new Date(`${date}T${hm}:00+07:00`).getTime();
const sess = (id, date, label, hm = '19:00') => ({ id, date, label, startsAt: at(date, hm), expiresAt: at(date, hm) + 15 * 60_000 });
const NOW = at('2026-11-20', '23:00');

test('counts late, excused and unexcused per subject per day', () => {
  const sessions = [
    sess('a', '2026-11-03', 'Mạch'),
    sess('b', '2026-11-04', 'Mạch'),
    sess('c', '2026-11-04', 'Thực hành', '20:00'),
    sess('d', '2026-11-05', 'Mạch'),
    sess('e', '2026-11-06', 'Mạch'),
  ];
  const records = { a: { late: false }, b: { late: true } };
  const excuses = { '2026-11-05': 'P' };
  assert.deepEqual(monthTally({ sessions, records, excuses, now: NOW }), { late: 1, P: 1, K: 2 });
});

test('several sessions of the same subject on one day count once', () => {
  const sessions = [sess('a', '2026-11-03', 'Mạch'), sess('b', '2026-11-03', 'Mạch', '20:00')];
  assert.deepEqual(monthTally({ sessions, records: { b: { late: true } }, excuses: {}, now: NOW }), { late: 1, P: 0, K: 0 });
  assert.deepEqual(monthTally({ sessions, records: { a: { late: false }, b: { late: true } }, excuses: {}, now: NOW }), { late: 0, P: 0, K: 0 });
  assert.deepEqual(monthTally({ sessions, records: {}, excuses: {}, now: NOW }), { late: 0, P: 0, K: 1 });
});

test('a subject still open for check-in is not counted as absent', () => {
  const s = sess('a', '2026-11-20', 'Mạch', '22:50'); // còn mở lúc 23:00
  assert.deepEqual(monthTally({ sessions: [s], records: {}, excuses: {}, now: NOW }), { late: 0, P: 0, K: 0 });
  assert.deepEqual(monthTally({ sessions: [s], records: { a: { late: true } }, excuses: {}, now: NOW }), { late: 1, P: 0, K: 0 });
});

test('future sessions and empty labels are handled', () => {
  const sessions = [sess('a', '2026-11-25', 'Mạch'), { ...sess('b', '2026-11-03', ''), label: undefined }];
  assert.deepEqual(monthTally({ sessions, records: {}, excuses: {}, now: NOW }), { late: 0, P: 0, K: 1 });
});

test('streak counts on-time subjects back from the latest until a late or absence', () => {
  const sessions = [
    sess('a', '2026-11-02', 'Mạch'),
    sess('b', '2026-11-03', 'Mạch'),
    sess('c', '2026-11-04', 'Mạch'),
    sess('d', '2026-11-04', 'Thực hành', '20:00'),
  ];
  const records = { a: { late: false }, b: { late: true }, c: { late: false }, d: { late: false } };
  assert.deepEqual(subjectStreak({ sessions, records, now: NOW }), { count: 2, broken: true });
});

test('any absence, even excused, breaks the streak', () => {
  const sessions = [sess('a', '2026-11-02', 'Mạch'), sess('b', '2026-11-03', 'Mạch')];
  assert.deepEqual(subjectStreak({ sessions, records: { a: { late: false } }, now: NOW }), { count: 0, broken: true });
});

test('a perfect month is not broken so earlier months keep counting', () => {
  const sessions = [sess('a', '2026-11-02', 'Mạch'), sess('b', '2026-11-03', 'Mạch'), sess('c', '2026-11-25', 'Mạch')];
  assert.deepEqual(subjectStreak({ sessions, records: { a: { late: false }, b: { late: false } }, now: NOW }), { count: 2, broken: false });
});

test('a subject still open without a record neither counts nor breaks', () => {
  const sessions = [sess('a', '2026-11-19', 'Mạch'), sess('b', '2026-11-20', 'Mạch', '22:50')];
  assert.deepEqual(subjectStreak({ sessions, records: { a: { late: false } }, now: NOW }), { count: 1, broken: false });
});

test('classLeaderboard ranks by on-time subjects; late or absent days do not reset the count', () => {
  const sessions = ['01', '02', '03', '04'].map((d, i) => sess(`s${i}`, `2026-11-${d}`, 'Mạch'));
  const roster = [
    { mssv: '1', ho: 'Nguyễn', ten: 'An' },
    { mssv: '2', ho: 'Trần', ten: 'Bình' },
    { mssv: '3', ho: 'Lê', ten: 'Chi' },
  ];
  const ok = { late: false };
  const attendance = {
    s0: { 1: ok, 2: ok, 3: ok },
    s1: { 1: ok, 2: ok, 3: { late: true } },
    s2: { 1: ok, 2: ok, 3: ok },
    s3: { 1: ok, 3: ok },
  };
  assert.deepEqual(classLeaderboard({ sessions, attendance, roster, now: NOW }), [
    { name: 'Nguyễn An', onTime: 4 },
    { name: 'Lê Chi', onTime: 3 },
    { name: 'Trần Bình', onTime: 3 },
  ]);
  assert.deepEqual(classLeaderboard({ sessions, attendance: {}, roster, now: NOW }), []);
});
