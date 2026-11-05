import { redis, keys } from './redis.js';
import { getSession } from './store.js';
import { lateUntil } from './periods.js';

const subjectOf = (s) => s.label?.trim() || 'Buổi học';
const STREAK_MAX_MONTHS = 12; // đếm chuỗi ngược tối đa 12 tháng

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
 * Chuỗi môn đúng giờ liên tiếp tính từ môn gần nhất; trễ hoặc vắng (kể cả có phép) làm đứt chuỗi.
 * `broken: false` nghĩa là chưa gặp chỗ đứt, cần đếm tiếp sang tháng trước.
 * @returns {{ count: number, broken: boolean }}
 */
export function subjectStreak({ sessions, records, now }) {
  let count = 0;
  for (const list of subjectGroups(sessions, now)) {
    const st = groupState(list, records, now);
    if (st === 'ok') count += 1;
    else if (st !== 'open') return { count, broken: true };
  }
  return { count, broken: false };
}

async function loadMonth(ym, mssv) {
  const ids = (await redis().smembers(keys.monthSessions(ym))) ?? [];
  const sessions = (await Promise.all(ids.map(getSession))).filter(Boolean);
  const recs = await Promise.all(sessions.map((s) => redis().hget(keys.att(s.id), mssv)));
  return { sessions, records: Object.fromEntries(sessions.map((s, i) => [s.id, recs[i]]).filter(([, r]) => r)) };
}

const prevMonth = (ym) => {
  const [y, m] = ym.split('-').map(Number);
  return m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, '0')}`;
};

// Thống kê tháng `ym` của một MSSV + chuỗi đúng giờ (đếm ngược qua các tháng trước nếu chưa đứt).
export async function loadCheckinStats(ym, mssv, now) {
  const month = await loadMonth(ym, mssv);
  const dates = [...new Set(month.sessions.map((s) => s.date))];
  const ex = await Promise.all(dates.map((d) => redis().hget(keys.excuse(d), mssv)));
  const excuses = Object.fromEntries(dates.map((d, i) => [d, ex[i]]).filter(([, v]) => v));
  const tally = monthTally({ ...month, excuses, now });

  let streak = subjectStreak({ ...month, now });
  let total = streak.count;
  let cursor = ym;
  for (let i = 1; i < STREAK_MAX_MONTHS && !streak.broken; i++) {
    cursor = prevMonth(cursor);
    streak = subjectStreak({ ...(await loadMonth(cursor, mssv)), now });
    total += streak.count;
  }
  return { ...tally, streak: total };
}
