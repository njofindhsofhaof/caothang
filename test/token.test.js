import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeToken, verifyToken, WINDOW_MS } from '../api/_lib/token.js';

const SECRET = 'test-secret';
const T0 = 1_760_000_000_000;

test('accepts token from the current window', () => {
  const tok = makeToken(SECRET, 'abc', Math.floor(T0 / WINDOW_MS));
  assert.equal(verifyToken(SECRET, 'abc', tok, T0), true);
});

test('accepts token from the previous window', () => {
  const tok = makeToken(SECRET, 'abc', Math.floor(T0 / WINDOW_MS));
  assert.equal(verifyToken(SECRET, 'abc', tok, T0 + WINDOW_MS), true);
});

test('rejects token two windows old', () => {
  const tok = makeToken(SECRET, 'abc', Math.floor(T0 / WINDOW_MS));
  assert.equal(verifyToken(SECRET, 'abc', tok, T0 + 2 * WINDOW_MS), false);
});

test('rejects token for another session or secret', () => {
  const w = Math.floor(T0 / WINDOW_MS);
  assert.equal(verifyToken(SECRET, 'xyz', makeToken(SECRET, 'abc', w), T0), false);
  assert.equal(verifyToken(SECRET, 'abc', makeToken('other', 'abc', w), T0), false);
  assert.equal(verifyToken(SECRET, 'abc', 'short', T0), false);
});

import { makeTicket, verifyTicket, TICKET_MS } from '../api/_lib/token.js';

test('ticket is valid for its device until expiry', () => {
  const tk = makeTicket(SECRET, 'abc', 'dev1', T0);
  assert.equal(verifyTicket(SECRET, 'abc', 'dev1', tk, T0 + TICKET_MS - 1), true);
  assert.equal(verifyTicket(SECRET, 'abc', 'dev1', tk, T0 + TICKET_MS + 1), false);
});

test('ticket is rejected for another device, session or forged expiry', () => {
  const tk = makeTicket(SECRET, 'abc', 'dev1', T0);
  assert.equal(verifyTicket(SECRET, 'abc', 'dev2', tk, T0), false);
  assert.equal(verifyTicket(SECRET, 'xyz', 'dev1', tk, T0), false);
  const [, sig] = tk.split('.');
  assert.equal(verifyTicket(SECRET, 'abc', 'dev1', `${T0 + 10 * TICKET_MS}.${sig}`, T0), false);
});
