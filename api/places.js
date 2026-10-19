import { randomBytes } from 'node:crypto';
import { redis, keys } from './_lib/redis.js';
import { send, handler, isTeacher } from './_lib/http.js';
import { isValidCoord } from './_lib/geo.js';

const MAX_PLACES = 30;

// Phòng học đã lưu vị trí — thầy đứng trong phòng, lưu một lần, dùng lại khi đặt lịch.
export default handler(async (req, res) => {
  if (!isTeacher(req)) return send(res, 401, { ok: false, message: 'Sai mã PIN giáo viên.' });
  if (req.method === 'GET') {
    const map = (await redis().hgetall(keys.places)) ?? {};
    const places = Object.entries(map).map(([id, p]) => ({ id, ...p })).sort((a, b) => a.name.localeCompare(b.name, 'vi'));
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
