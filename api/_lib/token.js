import { createHmac, timingSafeEqual } from 'node:crypto';

export const WINDOW_MS = 10_000;
const TOKEN_LEN = 12;

export function windowAt(now) {
  return Math.floor(now / WINDOW_MS);
}

export function makeToken(secret, sessionId, window) {
  return createHmac('sha256', secret)
    .update(`${sessionId}:${window}`)
    .digest('base64url')
    .slice(0, TOKEN_LEN);
}

function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

// Chấp nhận khung hiện tại và khung liền trước (bù thời gian quét + mạng chậm).
export function verifyToken(secret, sessionId, token, now) {
  if (typeof token !== 'string' || token.length !== TOKEN_LEN) return false;
  const w = windowAt(now);
  return [w, w - 1].some((win) => safeEqual(makeToken(secret, sessionId, win), token));
}

export function msUntilNextWindow(now) {
  return WINDOW_MS - (now % WINDOW_MS);
}

export const TICKET_MS = 90_000;

const ticketSig = (secret, sessionId, deviceId, exp) =>
  createHmac('sha256', secret).update(`ticket:${sessionId}:${deviceId}:${exp}`).digest('base64url').slice(0, 22);

// Vé ngắn hạn cấp khi trang vừa mở bằng QR còn hạn, gắn với máy — đủ thời gian nhập MSSV và chờ GPS.
export function makeTicket(secret, sessionId, deviceId, now) {
  const exp = now + TICKET_MS;
  return `${exp}.${ticketSig(secret, sessionId, deviceId, exp)}`;
}

export function verifyTicket(secret, sessionId, deviceId, ticket, now) {
  const [expStr, sig] = String(ticket ?? '').split('.');
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || !sig || now > exp || exp - now > TICKET_MS) return false;
  return safeEqual(ticketSig(secret, sessionId, deviceId, exp), sig);
}
