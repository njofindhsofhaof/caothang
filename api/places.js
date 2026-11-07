import { randomBytes } from 'node:crypto';
import { redis, keys } from './_lib/redis.js';
import { teacherGate } from './_lib/store.js';
import { send, handler } from './_lib/http.js';
import { isValidCoord } from './_lib/geo.js';
import { pastLocations } from './_lib/past-places.js';

const MAX_PLACES = 30;
const PAST_SESSIONS_SCAN = 300;

// Các buổi đã bắt đầu gần đây nhất (đọc một lần bằng MGET).
async function recentSessions(now) {
  const ids = (await redis().zrange(keys.schedule, now, 0, { byScore: true, rev: true, offset: 0, count: PAST_SESSIONS_SCAN })) ?? [];
  if (!ids.length) return [];
  return (await redis().mget(...ids.map(keys.session))).filter(Boolean);
}

// Phòng học đã lưu vị trí — thầy đứng trong phòng, lưu một lần, dùng lại khi đặt lịch.
export default handler(async (req, res) => {
  const denied = await teacherGate(req);
  if (denied) return send(res, denied.status, { ok: false, message: denied.message });
  if (req.method === 'GET') {
    const map = (await redis().hgetall(keys.places)) ?? {};
    const places = Object.entries(map).map(([id, p]) => ({ id, ...p })).sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    if (req.query.past) return send(res, 200, { ok: true, places, past: pastLocations(await recentSessions(Date.now()), places) });
    return send(res, 200, { ok: true, places });
  }
  if (req.method === 'POST') {
    const b = req.body ?? {};
    const name = String(b.name ?? '').trim().slice(0, 40);
    const lat = Number(b.lat);
    const lng = Number(b.lng);
    if (!name) return send(res, 400, { ok: false, message: 'Hãy đặt tên phòng.' });
    if (!isValidCoord(lat, lng)) return send(res, 400, { ok: false, message: 'Vị trí không hợp lệ.' });
    if ((await redis().hlen(keys.places)) >= MAX_PLACES) return send(res, 400, { ok: false, message: 'Đã lưu quá nhiều phòng.' });
    const id = randomBytes(4).toString('hex');
    await redis().hset(keys.places, { [id]: { name, lat, lng, accuracy: Math.round(Number(b.accuracy) || 0) } });
    return send(res, 200, { ok: true, id });
  }
  if (req.method === 'DELETE') {
    await redis().hdel(keys.places, String(req.query.id ?? ''));
    return send(res, 200, { ok: true });
  }
  send(res, 405, { ok: false, message: 'Method not allowed' });
});
