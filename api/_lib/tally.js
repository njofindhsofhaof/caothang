import { redis, keys } from './redis.js';
import { getSession } from './store.js';
import { lateUntil } from './periods.js';
import '../../assets/subjects.js'; // đặt globalThis.DDSubjects, dùng chung với trang giáo viên

// Tên môn chuẩn: gộp các tên buổi viết lệch (vd. "LT Mạch") về một môn.
export const subjectOf = globalThis.DDSubjects.subjectName;
const STREAK_MAX_MONTHS = 12; // đếm chuỗi ngược tối đa 12 tháng
const RECENT_MARKS = 7; // số buổi gần nhất hiện thành tia sét

// Gom các buổi đã bắt đầu thành "môn trong ngày", mới nhất trước.
function subjectGroups(sessions, now) {
  const groups = new Map();
  for (const s of sessions) {
    if (s.startsAt > now) continue;
    const key = `${s.date}|${subjectOf(s)}`;
    groups.set(key, [...(groups.get(key) ?? []), s]);
  }
  const first = (list) => Math.min(...list.map((s) => s.startsAt));
  return [...groups.values()].sort((a, b) => first(b) - first(a));
}

// 'ok' | 'late' | 'open' (còn nhận điểm danh, chưa có bản ghi) | 'absent'
function groupState(list, records, now) {
  const recs = list.map((s) => records[s.id]).filter(Boolean);
  if (recs.some((r) => !r.late)) return 'ok';
  if (recs.length) return 'late';
  return list.some((s) => now <= lateUntil(s)) ? 'open' : 'absent';
}

/**
 * Đếm trễ / vắng của một sinh viên, giống bảng tháng trang giáo viên:
 * mỗi môn trong một ngày là một lần; phép P/K theo cả ngày.
 * @param {{ sessions: object[], records: Record<string, {late?: boolean}>, excuses: Record<string, string>, now: number }} input
 * @returns {{ late: number, P: number, K: number }}
 */
export function monthTally({ sessions, records, excuses, now }) {
  const tally = { late: 0, P: 0, K: 0 };
  for (const list of subjectGroups(sessions, now)) {
    const st = groupState(list, records, now);
    if (st === 'late') tally.late += 1;
    if (st === 'absent') tally[excuses[list[0].date] === 'P' ? 'P' : 'K'] += 1;
  }
  return tally;
}

/**
 * Chuỗi buổi đúng giờ liên tiếp của một môn, tính từ buổi gần nhất; trễ hoặc vắng (kể cả có phép) làm đứt chuỗi.
 * Mỗi môn có chuỗi riêng: nghỉ môn khác trong ngày không làm đứt chuỗi môn này.
 * Không truyền `subject` thì tính chung mọi môn.
 * `broken: false` nghĩa là chưa gặp chỗ đứt, cần đếm tiếp sang tháng trước.
 * @param {{ sessions: object[], records: Record<string, {late?: boolean}>, now: number, subject?: string }} input
 * @returns {{ count: number, broken: boolean }}
 */
export function subjectStreak({ sessions, records, now, subject }) {
  const want = subject && subjectOf({ label: subject });
  const picked = want ? sessions.filter((s) => subjectOf(s) === want) : sessions;
  let count = 0;
  for (const list of subjectGroups(picked, now)) {
    const st = groupState(list, records, now);
    if (st === 'ok') count += 1;
    else if (st !== 'open') return { count, broken: true };
  }
  return { count, broken: false };
}

/**
 * Các buổi đã khép của một môn, mới nhất trước: true = đúng giờ, false = trễ hoặc vắng.
 * Buổi còn mở mà chưa có bản ghi thì bỏ qua.
 * @param {{ sessions: object[], records: Record<string, {late?: boolean}>, now: number, subject: string }} input
 * @returns {boolean[]}
 */
export function subjectMarks({ sessions, records, now, subject }) {
  const want = subjectOf({ label: subject });
  const picked = sessions.filter((s) => subjectOf(s) === want);
  return subjectGroups(picked, now)
    .map((list) => groupState(list, records, now))
    .filter((st) => st !== 'open')
    .map((st) => st === 'ok');
}

/**
 * Bảng chuyên cần công khai: xếp theo số buổi (môn/ngày) đúng giờ; chỉ hiện ai có ít nhất 1 buổi, không lộ MSSV.
 * @param {{ sessions: object[], attendance: Record<string, Record<string, {late?: boolean}>>, roster: object[], now: number }} input
 * @returns {{ name: string, onTime: number }[]}
 */
export function classLeaderboard({ sessions, attendance, roster, now, nameOf = (st) => `${st.ho ?? ''} ${st.ten ?? ''}`.trim() }) {
  const groups = subjectGroups(sessions, now);
  return roster.map((st) => {
    const records = Object.fromEntries(sessions.map((s) => [s.id, attendance[s.id]?.[st.mssv]]).filter(([, r]) => r));
    return {
      name: nameOf(st),
      onTime: groups.filter((list) => groupState(list, records, now) === 'ok').length,
    };
  })
    .filter((r) => r.onTime > 0)
    .sort((a, b) => b.onTime - a.onTime || a.name.localeCompare(b.name, 'vi'));
}

async function loadMonth(ym, mssv) {
  const ids = (await redis().smembers(keys.monthSessions(ym))) ?? [];
  const sessions = (await Promise.all(ids.map(getSession))).filter(Boolean);
  const recs = await Promise.all(sessions.map((s) => redis().hget(keys.att(s.id), mssv)));
  return { sessions, records: Object.fromEntries(sessions.map((s, i) => [s.id, recs[i]]).filter(([, r]) => r)) };
}

export const prevMonth = (ym) => {
  const [y, m] = ym.split('-').map(Number);
  return m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, '0')}`;
};

// Thống kê tháng `ym` của một MSSV + chuỗi đúng giờ của môn `subject` (đếm ngược qua các tháng trước nếu chưa đứt).
export async function loadCheckinStats(ym, mssv, now, subject) {
  const month = await loadMonth(ym, mssv);
  const dates = [...new Set(month.sessions.map((s) => s.date))];
  const ex = await Promise.all(dates.map((d) => redis().hget(keys.excuse(d), mssv)));
  const excuses = Object.fromEntries(dates.map((d, i) => [d, ex[i]]).filter(([, v]) => v));
  const tally = monthTally({ ...month, excuses, now });

  let streak = subjectStreak({ ...month, now, subject });
  let total = streak.count;
  let recent = subjectMarks({ ...month, now, subject });
  let cursor = ym;
  for (let i = 1; i < STREAK_MAX_MONTHS && (!streak.broken || recent.length < RECENT_MARKS); i++) {
    cursor = prevMonth(cursor);
    const prev = await loadMonth(cursor, mssv);
    if (!streak.broken) {
      streak = subjectStreak({ ...prev, now, subject });
      total += streak.count;
    }
    recent = [...recent, ...subjectMarks({ ...prev, now, subject })];
  }
  // Cũ → mới để hiện từ trái sang phải.
  return { ...tally, streak: total, subject, recent: recent.slice(0, RECENT_MARKS).reverse() };
}

/* ---------- Trang cá nhân sinh viên (/sinhvien) ---------- */

/**
 * Từng "môn trong ngày" của một sinh viên, mới nhất trước.
 * state: 'ok' đúng giờ · 'late' trễ · 'P' / 'K' vắng có / không phép · 'open' còn nhận điểm danh.
 * @returns {{ date: string, subject: string, state: string, time: number|null, manual: boolean }[]}
 */
export function studentEntries({ sessions, records, excuses = {}, now }) {
  return subjectGroups(sessions, now).map((list) => {
    const st = groupState(list, records, now);
    const recs = list.map((s) => records[s.id]).filter(Boolean);
    const counted = st === 'ok' ? recs.filter((r) => !r.late) : recs;
    const times = counted.map((r) => r.time).filter(Number.isFinite);
    const date = list[0].date;
    return {
      date,
      subject: subjectOf(list[0]),
      state: st === 'absent' ? (excuses[date] === 'P' ? 'P' : 'K') : st,
      time: times.length ? Math.min(...times) : null,
      manual: counted.length > 0 && counted.every((r) => r.manual),
    };
  });
}

/**
 * Chuỗi đúng giờ hiện tại của từng môn, từ các entries đã xếp mới nhất trước (có thể nối nhiều tháng).
 * Trả { streaks, done }: done = các môn đã gặp chỗ đứt (không cần xét tháng cũ hơn).
 */
export function subjectStreaks(entries, streaks = new Map(), done = new Set()) {
  for (const e of entries) {
    if (e.state === 'open' || done.has(e.subject)) continue;
    if (e.state === 'ok') streaks.set(e.subject, (streaks.get(e.subject) ?? 0) + 1);
    else { done.add(e.subject); if (!streaks.has(e.subject)) streaks.set(e.subject, 0); }
  }
  return { streaks, done };
}

/**
 * Gom entries của một tháng theo môn: số buổi đúng giờ / trễ / P / K và danh sách buổi.
 * Môn trong danh sách chuẩn (assets/subjects.js) đứng trước theo đúng thứ tự đó.
 */
export function groupBySubject(entries, streaks = new Map()) {
  const order = globalThis.DDSubjects.SUBJECTS;
  const map = new Map();
  for (const e of entries) {
    const g = map.get(e.subject) ?? { name: e.subject, ok: 0, late: 0, P: 0, K: 0, entries: [] };
    if (e.state in g) g[e.state] += 1;
    g.entries.push(e);
    map.set(e.subject, g);
  }
  const rank = (n) => (order.includes(n) ? order.indexOf(n) : order.length);
  return [...map.values()]
    .map((g) => ({ ...g, streak: streaks.get(g.name) ?? 0 }))
    .sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name, 'vi'));
}

async function loadMonthWithExcuses(ym, mssv) {
  const month = await loadMonth(ym, mssv);
  const dates = [...new Set(month.sessions.map((s) => s.date))];
  const ex = await Promise.all(dates.map((d) => redis().hget(keys.excuse(d), mssv)));
  return { ...month, excuses: Object.fromEntries(dates.map((d, i) => [d, ex[i]]).filter(([, v]) => v)) };
}

// Báo cáo tháng `ym` của một MSSV + chuỗi hiện tại từng môn (tính từ tháng `nowYm` ngược về trước).
export async function loadStudentReport(ym, mssv, now, nowYm) {
  const cache = new Map();
  const get = (m) => {
    if (!cache.has(m)) cache.set(m, loadMonthWithExcuses(m, mssv));
    return cache.get(m);
  };

  const month = await get(ym);
  const entries = studentEntries({ ...month, now });

  // Chuỗi: lùi từng tháng tới khi mọi môn đã gặp chỗ đứt, hoặc gặp 2 tháng liền không có buổi nào.
  const state = { streaks: new Map(), done: new Set() };
  const wanted = new Set(entries.map((e) => e.subject));
  let cursor = nowYm;
  let empty = 0;
  for (let i = 0; i < STREAK_MAX_MONTHS; i++) {
    const m = await get(cursor);
    const list = studentEntries({ ...m, now });
    subjectStreaks(list, state.streaks, state.done);
    list.forEach((e) => wanted.add(e.subject));
    empty = list.length ? 0 : empty + 1;
    if (empty >= 2 || (wanted.size && [...wanted].every((s) => state.done.has(s)))) break;
    cursor = prevMonth(cursor);
  }

  const subjects = groupBySubject(entries, state.streaks);
  const total = subjects.reduce((t, g) => ({ ok: t.ok + g.ok, late: t.late + g.late, P: t.P + g.P, K: t.K + g.K }), { ok: 0, late: 0, P: 0, K: 0 });
  return { total, subjects };
}
