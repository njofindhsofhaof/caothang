import { redis, keys } from './_lib/redis.js';
import { send, handler, DATE_RE, MONTH_RE } from './_lib/http.js';
import { getSession, getAttendance, teacherGate } from './_lib/store.js';
import { withDuplicateFlags } from './_lib/suspicion.js';
import { audit, readAudit } from './_lib/audit.js';
import '../assets/subjects.js';

const subjectName = globalThis.DDSubjects.subjectName;
// Thông tin buổi ghi kèm nhật ký (môn, ngày, giờ) để đọc được cả khi buổi bị đổi tên sau này.
const sessionInfo = (s) => ({ sessionId: s.id, date: s.date, subject: subjectName(s), startsAt: s.startsAt, expiresAt: s.expiresAt });

const EXCUSE_VALUES = new Set(['P', 'K']);

// Dữ liệu cả tháng: các phiên, ai có mặt, ai có phép — để trang giáo viên dựng bảng và xuất Excel.
async function month(ym) {
  const ids = (await redis().smembers(keys.monthSessions(ym))) ?? [];
  const now = Date.now();
  // Chỉ tính các buổi đã bắt đầu — buổi đặt lịch trong tương lai chưa ai vắng.
  const sessions = (await Promise.all(ids.map(getSession))).filter((s) => s && s.startsAt <= now).sort((a, b) => a.startsAt - b.startsAt);
  const records = await Promise.all(sessions.map((s) => getAttendance(s.id)));
  const removed = await Promise.all(sessions.map(async (s) => Object.values((await redis().hgetall(keys.attRemoved(s.id))) ?? {})));
  const dates = [...new Set(sessions.map((s) => s.date))];
  const excuses = await Promise.all(dates.map(async (d) => [d, (await redis().hgetall(keys.excuse(d))) ?? {}]));
  return {
    sessions: sessions.map((s, i) => ({
      ...s,
      records: withDuplicateFlags(records[i].map(({ deviceId, ...r }) => r)),
      removed: removed[i].map(({ deviceId, lat, lng, ...r }) => r),
    })),
    excuses: Object.fromEntries(excuses),
  };
}

// Bỏ có mặt. Bản ghi sinh viên tự điểm danh (GPS) chỉ bỏ khi trang gửi force (thầy đã xác nhận),
// và luôn được cất sang att:removed để khôi phục được nếu lỡ tay.
export async function unpresent(sessionId, mssv, force, db = redis()) {
  const rec = await db.hget(keys.att(sessionId), mssv);
  if (!rec) return { status: 200 };
  if (!rec.manual && !force) return { status: 409, message: 'Bạn này đã tự điểm danh bằng GPS. Cần xác nhận trước khi bỏ.' };
  if (!rec.manual) await db.hset(keys.attRemoved(sessionId), { [mssv]: { ...rec, removedAt: Date.now() } });
  await db.hdel(keys.att(sessionId), mssv);
  return { status: 200 };
}

// Đổi trễ → đúng giờ: ghi đè bản ghi (giữ giờ, vị trí, thiết bị), đánh dấu lateCleared để biết thầy đã đổi.
export async function markOnTime(sessionId, mssv, db = redis()) {
  const rec = await db.hget(keys.att(sessionId), mssv);
  if (!rec) return { status: 404, message: 'Bạn này chưa có điểm danh ở buổi này.' };
  if (!rec.late) return { status: 200 };
  const { late, ...rest } = rec;
  await db.hset(keys.att(sessionId), { [mssv]: { ...rest, lateCleared: Date.now() } });
  return { status: 200 };
}

export async function restore(sessionId, mssv, db = redis()) {
  const rec = await db.hget(keys.attRemoved(sessionId), mssv);
  if (!rec) return { status: 404, message: 'Không có bản ghi đã bỏ để khôi phục.' };
  const { removedAt, ...record } = rec;
  await db.hset(keys.att(sessionId), { [mssv]: record });
  await db.hdel(keys.attRemoved(sessionId), mssv);
  return { status: 200 };
}

async function patch(body, req) {
  const { action, sessionId, mssv, date, value } = body ?? {};
  if (typeof mssv !== 'string' || !/^\d{6,12}$/.test(mssv)) return { status: 400, message: 'MSSV không hợp lệ.' };
  if (action === 'present' || action === 'unpresent' || action === 'restore' || action === 'onTime') {
    const session = await getSession(sessionId);
    if (!session) return { status: 404, message: 'Không tìm thấy phiên.' };
    const before = await redis().hget(keys.att(sessionId), mssv);
    const r = await patchRecord(action, sessionId, mssv, body);
    if (r.status === 200) await audit(req, { action, mssv, ...sessionInfo(session), before: before ?? null });
    return r;
  }
  if (action === 'excuse') {
    if (!DATE_RE.test(String(date))) return { status: 400, message: 'Ngày không hợp lệ.' };
    const before = await redis().hget(keys.excuse(date), mssv);
    if (EXCUSE_VALUES.has(value)) await redis().hset(keys.excuse(date), { [mssv]: value });
    else await redis().hdel(keys.excuse(date), mssv);
    await audit(req, { action, mssv, date, value: EXCUSE_VALUES.has(value) ? value : '', before: before ?? '' });
    return { status: 200 };
  }
  return { status: 400, message: 'Thao tác không hợp lệ.' };
}

async function patchRecord(action, sessionId, mssv, body) {
  if (action === 'present') {
    await redis().hsetnx(keys.att(sessionId), mssv, { mssv, time: Date.now(), manual: true });
    return { status: 200 };
  }
  if (action === 'restore') return restore(sessionId, mssv);
  if (action === 'onTime') return markOnTime(sessionId, mssv);
  return unpresent(sessionId, mssv, body.force === true);
}

// Bỏ cả một ngày (vd. ngày chạy thử) khỏi thống kê tháng; dữ liệu điểm danh vẫn còn.
async function dropDay(date, req) {
  if (!DATE_RE.test(String(date))) return { status: 400, message: 'Ngày không hợp lệ.' };
  const ym = date.slice(0, 7);
  const ids = (await redis().smembers(keys.monthSessions(ym))) ?? [];
  const sessions = await Promise.all(ids.map(getSession));
  const drop = ids.filter((id, i) => sessions[i]?.date === date);
  if (!drop.length) return { status: 404, message: 'Ngày này không có buổi nào.' };
  await redis().sadd(keys.droppedSessions(ym), ...drop);
  await redis().srem(keys.monthSessions(ym), ...drop);
  await audit(req, { action: 'dropDay', date, count: drop.length, subjects: [...new Set(sessions.filter(Boolean).filter((s) => s.date === date).map(subjectName))] });
  return { status: 200 };
}

export default handler(async (req, res) => {
  const denied = await teacherGate(req);
  if (denied) return send(res, denied.status, { ok: false, message: denied.message });
  if (req.method === 'GET' && req.query.audit) return send(res, 200, { ok: true, log: await readAudit(req.query.limit) });
  if (req.method === 'GET') {
    const ym = String(req.query.month ?? '');
    if (!MONTH_RE.test(ym)) return send(res, 400, { ok: false, message: 'Tháng không hợp lệ (YYYY-MM).' });
    return send(res, 200, { ok: true, ...(await month(ym)) });
  }
  if (req.method === 'POST') {
    const r = req.body?.action === 'dropDay' ? await dropDay(req.body.date, req) : await patch(req.body, req);
    return send(res, r.status, r.status === 200 ? { ok: true } : { ok: false, message: r.message });
  }
  send(res, 405, { ok: false, message: 'Method not allowed' });
});
