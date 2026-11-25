import { redis } from './redis.js';
import { actorOf } from './audit.js';
import { vnDate, DATE_RE } from './http.js';
import '../../assets/subjects.js';

// Nhật ký từng lượt sinh viên bấm Điểm danh (thành công, trễ, "đã điểm danh rồi" và cả các lần bị từ chối),
// theo ngày, mới nhất trước. Để đối chiếu khi sinh viên nói đã điểm danh mà bảng ghi vắng.
// Chỉ lưu khoảng cách và sai số GPS, không lưu toạ độ.
export const CHECKIN_LOG_MAX = 3000; // mỗi ngày
const KEEP_S = 400 * 86_400;
const logKey = (date) => `checkinlog:${date}`;
const subjectName = globalThis.DDSubjects.subjectName;

/**
 * Một dòng nhật ký từ kết quả điểm danh.
 * result: { ok: false, code, message, distance? } | { ok: true, already, record }
 */
export function attemptEntry({ input, session, result, now, redirectedFrom = null }) {
  const outcome = !result.ok ? result.code : result.already ? 'already' : result.record?.late ? 'late' : 'ok';
  const distance = result.ok ? result.record?.distance : result.distance;
  return {
    at: now,
    date: session?.date ?? vnDate(now),
    mssv: input.mssv,
    sessionId: String(session?.id ?? input.sessionId ?? '').slice(0, 64), // id do trang gửi lên: cắt ngắn
    subject: session ? subjectName(session) : '',
    result: outcome,
    ...(result.ok ? {} : { message: result.message }),
    ...(Number.isFinite(distance) ? { distance: Math.round(distance) } : {}),
    ...(Number.isFinite(input.accuracy) ? { accuracy: Math.round(input.accuracy) } : {}),
    ...(redirectedFrom ? { redirectedFrom } : {}),
  };
}

export async function logCheckin(req, entry, db = redis()) {
  try {
    const key = logKey(entry.date);
    await db.lpush(key, { ...entry, ...actorOf(req) });
    await db.ltrim(key, 0, CHECKIN_LOG_MAX - 1);
    await db.expire(key, KEEP_S);
  } catch (err) {
    console.error('[checkin-log]', err);
  }
}

export async function readCheckinLog(date, db = redis()) {
  if (!DATE_RE.test(String(date))) throw new Error('Ngày không hợp lệ.');
  return (await db.lrange(logKey(date), 0, CHECKIN_LOG_MAX - 1)) ?? [];
}
