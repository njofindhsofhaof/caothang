import { redis, keys } from './_lib/redis.js';
import { send, handler, clientIp, requireSecret, vnDate } from './_lib/http.js';
import { getSession, getRoster, isRateLimited, getActiveSession, listSessions, isOpen, MAX_SESSION_MS } from './_lib/store.js';
import { verifyToken, verifyTicket, makeTicket } from './_lib/token.js';
import { parseCheckinBody, evaluateCheckin, normalizeMssv, otherOpenSessions } from './_lib/checkin-rules.js';
import { loadCheckinStats, subjectOf } from './_lib/tally.js';
import { aliasMap } from './_lib/alias.js';
import { logCheckin, attemptEntry } from './_lib/checkin-log.js';

const DEVICE_BIND_TTL_S = 400 * 86_400;

// Số lần trễ/vắng trong tháng để báo cho sinh viên; lỗi thì bỏ qua, không chặn điểm danh.
async function safeTally(session, mssv, now) {
  try { return await loadCheckinStats(session.date.slice(0, 7), mssv, now, subjectOf(session)); } catch { return null; }
}

async function issueTicket(req, res) {
  const b = req.body ?? {};
  const sessionId = String(b.s ?? '');
  const deviceId = String(b.deviceId ?? '');
  if (!/^[A-Za-z0-9-]{16,64}$/.test(deviceId)) return send(res, 400, { ok: false, code: 'bad_device', message: 'Thiết bị không hợp lệ. Hãy tải lại trang.' });
  if (await isRateLimited(`ip:${clientIp(req)}`, 60)) return send(res, 429, { ok: false, code: 'rate', message: 'Thử quá nhiều lần. Đợi một phút rồi thử lại.' });
  const now = Date.now();
  const session = await getSession(sessionId);
  if (!isOpen(session, now)) return send(res, 400, { ok: false, code: 'closed', message: 'Buổi điểm danh chưa mở hoặc đã kết thúc.' });
  const secret = requireSecret('QR_SECRET');
  if (!verifyToken(secret, sessionId, String(b.t ?? ''), now)) {
    return send(res, 400, { ok: false, code: 'expired_qr', message: 'Mã QR đã hết hạn (mã đổi mỗi 10 giây). Hãy quét lại mã đang chiếu.' });
  }
  send(res, 200, { ok: true, ticket: makeTicket(secret, sessionId, deviceId, now) });
}

// GET công khai: buổi đang mở (không lộ toạ độ), hoặc buổi kế tiếp trong hôm nay.
async function current(res) {
  const now = Date.now();
  const pub = (s) => s && ({ id: s.id, label: s.label, placeName: s.placeName, startsAt: s.startsAt, expiresAt: s.expiresAt, lateUntil: s.lateUntil, late: s.late, requireQr: s.requireQr });
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
  if (error) {
    // Ghi cả lượt hỏng (vd. không có GPS) nếu biết là ai, để đối chiếu khi sinh viên nói đã bấm điểm danh.
    if (/^\d{6,12}$/.test(input?.mssv ?? '')) await logCheckin(req, attemptEntry({ input, session: null, result: error, now: Date.now() }));
    return send(res, 400, error);
  }

  if (await isRateLimited(`ip:${clientIp(req)}`, 60) || await isRateLimited(`dev:${input.deviceId}`)) {
    return send(res, 429, { ok: false, code: 'rate', message: 'Thử quá nhiều lần. Đợi một phút rồi thử lại.' });
  }

  const now = Date.now();
  let [session, roster, existing, deviceMssvInSession, boundMssv] = await Promise.all([
    getSession(input.sessionId),
    getRoster(),
    redis().hget(keys.att(input.sessionId), input.mssv),
    redis().hget(keys.deviceInSession(input.sessionId), input.deviceId),
    redis().get(keys.device(input.deviceId)),
  ]);
  const chosenId = input.sessionId; // buổi trang chọn, trước khi đổi sang buổi khác bên dưới
  // Đã điểm danh buổi này mà đang có buổi môn khác cũng mở → ghi vào buổi đó thay vì báo "đã điểm danh rồi".
  if (existing && session) {
    const others = otherOpenSessions(await listSessions(now - MAX_SESSION_MS, now), session, now, subjectOf);
    for (const other of others) {
      if (await redis().hget(keys.att(other.id), input.mssv)) continue;
      session = other;
      input.sessionId = other.id;
      existing = null;
      deviceMssvInSession = await redis().hget(keys.deviceInSession(other.id), input.deviceId);
      break;
    }
  }
  const student = roster.find((s) => normalizeMssv(s.mssv) === input.mssv) ?? null;
  const secret = requireSecret('QR_SECRET');
  const tokenOk = !session?.requireQr
    || verifyTicket(secret, input.sessionId, input.deviceId, input.token, now)
    || verifyToken(secret, input.sessionId, input.token, now);

  const result = evaluateCheckin(input, {
    session, now, tokenOk, student, existing, deviceMssvInSession, boundMssv: boundMssv ? String(boundMssv) : null,
  });
  const log = (r) => logCheckin(req, attemptEntry({ input, session, result: r, now, redirectedFrom: input.sessionId !== chosenId ? chosenId : null }));
  if (!result.ok) {
    await log(result);
    return send(res, 400, result);
  }

  const name = `${student.ho} ${student.ten}`.trim();
  const alias = aliasMap(roster).get(input.mssv) ?? null; // tên ẩn danh của bạn này trên bảng Leo rank
  const subject = subjectOf(session);
  if (result.already) {
    await log(result);
    // Báo rõ môn đã điểm danh và môn kế tiếp trong ngày (nếu có) để sinh viên biết cần quay lại.
    const next = (await listSessions(now, now + 12 * 3_600_000)).find((s) => !s.closed && s.date === session.date && s.id !== session.id);
    return send(res, 200, {
      ok: true, already: true, name, subject, time: result.record.time, late: Boolean(result.record.late), alias,
      next: next ? { subject: subjectOf(next), startsAt: next.startsAt } : null,
      tally: await safeTally(session, input.mssv, now),
    });
  }

  // Chiếm chỗ máy trong phiên trước (HSETNX) để hai MSSV gửi đồng thời từ một máy không cùng lọt.
  const claimed = await redis().hsetnx(keys.deviceInSession(input.sessionId), input.deviceId, input.mssv);
  if (!claimed) {
    const owner = await redis().hget(keys.deviceInSession(input.sessionId), input.deviceId);
    if (String(owner) !== input.mssv) {
      const used = { ok: false, code: 'device_used', message: 'Máy này đã điểm danh cho một bạn khác trong buổi này.' };
      await log(used);
      return send(res, 400, used);
    }
  }
  await Promise.all([
    redis().hsetnx(keys.att(input.sessionId), input.mssv, result.record),
    redis().set(keys.device(input.deviceId), input.mssv, { ex: DEVICE_BIND_TTL_S, nx: true }),
  ]);
  await log(result);
  send(res, 200, {
    ok: true, already: false, name, subject, time: result.record.time, distance: result.record.distance, late: Boolean(result.record.late),
    alias, tally: await safeTally(session, input.mssv, now),
  });
});
