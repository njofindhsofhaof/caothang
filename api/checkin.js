import { redis, keys } from './_lib/redis.js';
import { send, handler, clientIp, requireSecret, vnDate } from './_lib/http.js';
import { getSession, getRoster, isRateLimited, getActiveSession, listSessions, isActive } from './_lib/store.js';
import { verifyToken, verifyTicket, makeTicket } from './_lib/token.js';
import { parseCheckinBody, evaluateCheckin } from './_lib/checkin-rules.js';

const DEVICE_BIND_TTL_S = 400 * 86_400;

async function issueTicket(req, res) {
  const b = req.body ?? {};
  const sessionId = String(b.s ?? '');
  const deviceId = String(b.deviceId ?? '');
  if (!/^[A-Za-z0-9-]{16,64}$/.test(deviceId)) return send(res, 400, { ok: false, code: 'bad_device', message: 'Thiết bị không hợp lệ. Hãy tải lại trang.' });
  if (await isRateLimited(`ip:${clientIp(req)}`, 60)) return send(res, 429, { ok: false, code: 'rate', message: 'Thử quá nhiều lần. Đợi một phút rồi thử lại.' });
  const now = Date.now();
  const session = await getSession(sessionId);
  if (!isActive(session, now)) return send(res, 400, { ok: false, code: 'closed', message: 'Buổi điểm danh chưa mở hoặc đã kết thúc.' });
  const secret = requireSecret('QR_SECRET');
  if (!verifyToken(secret, sessionId, String(b.t ?? ''), now)) {
    return send(res, 400, { ok: false, code: 'expired_qr', message: 'Mã QR đã hết hạn (mã đổi mỗi 10 giây). Hãy quét lại mã đang chiếu.' });
  }
  send(res, 200, { ok: true, ticket: makeTicket(secret, sessionId, deviceId, now) });
}

// GET công khai: buổi đang mở (không lộ toạ độ), hoặc buổi kế tiếp trong hôm nay.
async function current(res) {
  const now = Date.now();
  const pub = (s) => s && ({ id: s.id, label: s.label, placeName: s.placeName, startsAt: s.startsAt, expiresAt: s.expiresAt, requireQr: s.requireQr });
  const active = await getActiveSession(now);
  if (active) return send(res, 200, { ok: true, now, active: pub(active) });
  const next = (await listSessions(now, now + 86_400_000)).find((s) => !s.closed && s.date === vnDate(now));
  send(res, 200, { ok: true, now, active: null, next: pub(next) ?? null });
}

export default handler(async (req, res) => {
  if (req.method === 'GET') return current(res);
  if (req.method !== 'POST') return send(res, 405, { ok: false, message: 'Method not allowed' });

  // Bước 1: trang vừa mở bằng QR → đổi token 10 giây lấy vé 90 giây cho máy này.
  if (req.query.ticket) return issueTicket(req, res);

  const { input, error } = parseCheckinBody(req.body);
  if (error) return send(res, 400, error);

  if (await isRateLimited(`ip:${clientIp(req)}`, 60) || await isRateLimited(`dev:${input.deviceId}`)) {
    return send(res, 429, { ok: false, code: 'rate', message: 'Thử quá nhiều lần. Đợi một phút rồi thử lại.' });
  }

  const now = Date.now();
  const [session, roster, existing, deviceMssvInSession, boundMssv] = await Promise.all([
    getSession(input.sessionId),
    getRoster(),
    redis().hget(keys.att(input.sessionId), input.mssv),
    redis().hget(keys.deviceInSession(input.sessionId), input.deviceId),
    redis().get(keys.device(input.deviceId)),
  ]);
  const student = roster.find((s) => s.mssv === input.mssv) ?? null;
  const secret = requireSecret('QR_SECRET');
  const tokenOk = !session?.requireQr
    || verifyTicket(secret, input.sessionId, input.deviceId, input.token, now)
    || verifyToken(secret, input.sessionId, input.token, now);

  const result = evaluateCheckin(input, {
    session, now, tokenOk, student, existing, deviceMssvInSession, boundMssv: boundMssv ? String(boundMssv) : null,
  });
  if (!result.ok) return send(res, 400, result);

  const name = `${student.ho} ${student.ten}`.trim();
  if (result.already) return send(res, 200, { ok: true, already: true, name, time: result.record.time });

  // Chiếm chỗ máy trong phiên trước (HSETNX) để hai MSSV gửi đồng thời từ một máy không cùng lọt.
  const claimed = await redis().hsetnx(keys.deviceInSession(input.sessionId), input.deviceId, input.mssv);
  if (!claimed) {
    const owner = await redis().hget(keys.deviceInSession(input.sessionId), input.deviceId);
    if (String(owner) !== input.mssv) return send(res, 400, { ok: false, code: 'device_used', message: 'Máy này đã điểm danh cho một bạn khác trong buổi này.' });
  }
  await Promise.all([
    redis().hsetnx(keys.att(input.sessionId), input.mssv, result.record),
    redis().set(keys.device(input.deviceId), input.mssv, { ex: DEVICE_BIND_TTL_S, nx: true }),
  ]);
  send(res, 200, { ok: true, already: false, name, time: result.record.time, distance: result.record.distance });
});
