import { redis, keys } from './_lib/redis.js';
import { send, handler, isTeacher, DATE_RE, MONTH_RE } from './_lib/http.js';
import { getSession, getAttendance } from './_lib/store.js';

const EXCUSE_VALUES = new Set(['P', 'K']);

// Dữ liệu cả tháng: các phiên, ai có mặt, ai có phép — để trang giáo viên dựng bảng và xuất Excel.
async function month(ym) {
  const ids = (await redis().smembers(keys.monthSessions(ym))) ?? [];
  const now = Date.now();
  // Chỉ tính các buổi đã bắt đầu — buổi đặt lịch trong tương lai chưa ai vắng.
  const sessions = (await Promise.all(ids.map(getSession))).filter((s) => s && s.startsAt <= now).sort((a, b) => a.startsAt - b.startsAt);
  const records = await Promise.all(sessions.map((s) => getAttendance(s.id)));
  const dates = [...new Set(sessions.map((s) => s.date))];
  const excuses = await Promise.all(dates.map(async (d) => [d, (await redis().hgetall(keys.excuse(d))) ?? {}]));
  return {
    sessions: sessions.map((s, i) => ({ ...s, records: records[i].map(({ deviceId, ...r }) => r) })),
    excuses: Object.fromEntries(excuses),
  };
}

async function patch(body) {
  const { action, sessionId, mssv, date, value } = body ?? {};
  if (typeof mssv !== 'string' || !/^\d{6,12}$/.test(mssv)) return { status: 400, message: 'MSSV không hợp lệ.' };
  if (action === 'present' || action === 'unpresent') {
    if (!(await getSession(sessionId))) return { status: 404, message: 'Không tìm thấy phiên.' };
    if (action === 'present') await redis().hsetnx(keys.att(sessionId), mssv, { mssv, time: Date.now(), manual: true });
    else await redis().hdel(keys.att(sessionId), mssv);
    return { status: 200 };
  }
  if (action === 'excuse') {
    if (!DATE_RE.test(String(date))) return { status: 400, message: 'Ngày không hợp lệ.' };
    if (EXCUSE_VALUES.has(value)) await redis().hset(keys.excuse(date), { [mssv]: value });
    else await redis().hdel(keys.excuse(date), mssv);
    return { status: 200 };
  }
  return { status: 400, message: 'Thao tác không hợp lệ.' };
}

export default handler(async (req, res) => {
  if (!isTeacher(req)) return send(res, 401, { ok: false, message: 'Sai mã PIN giáo viên.' });
  if (req.method === 'GET') {
    const ym = String(req.query.month ?? '');
    if (!MONTH_RE.test(ym)) return send(res, 400, { ok: false, message: 'Tháng không hợp lệ (YYYY-MM).' });
    return send(res, 200, { ok: true, ...(await month(ym)) });
  }
  if (req.method === 'POST') {
    const r = await patch(req.body);
    return send(res, r.status, r.status === 200 ? { ok: true } : { ok: false, message: r.message });
  }
  send(res, 405, { ok: false, message: 'Method not allowed' });
});
