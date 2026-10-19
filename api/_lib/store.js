import { redis, keys } from './redis.js';

export async function getRoster() {
  const list = await redis().get(keys.roster);
  return Array.isArray(list) ? list : [];
}

export async function getSession(id) {
  if (!id) return null;
  return (await redis().get(keys.session(id))) ?? null;
}

export const MAX_SESSION_MS = 4 * 3_600_000;

export const isActive = (s, now) => Boolean(s) && !s.closed && now >= s.startsAt && now <= s.expiresAt;

// Các phiên bắt đầu trong khoảng [from, to] (theo lịch).
export async function listSessions(from, to) {
  const ids = (await redis().zrange(keys.schedule, from, to, { byScore: true })) ?? [];
  const list = await Promise.all(ids.map(getSession));
  return list.filter(Boolean).sort((a, b) => a.startsAt - b.startsAt);
}

// Phiên đang mở lúc `now` (nếu trùng giờ, lấy phiên bắt đầu muộn nhất).
export async function getActiveSession(now) {
  const list = await listSessions(now - MAX_SESSION_MS, now);
  return list.filter((s) => isActive(s, now)).at(-1) ?? null;
}

export async function getAttendance(id) {
  const map = (await redis().hgetall(keys.att(id))) ?? {};
  return Object.values(map);
}

// Giới hạn số lần thử: trả về true nếu vượt quá `limit` lần trong `windowSec` giây.
export async function isRateLimited(who, limit = 20, windowSec = 60) {
  const key = keys.rate(who);
  const n = await redis().incr(key);
  if (n === 1) await redis().expire(key, windowSec);
  return n > limit;
}
