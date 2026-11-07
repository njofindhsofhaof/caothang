import { redis, keys } from './_lib/redis.js';
import { send, handler } from './_lib/http.js';
import { teacherGate } from './_lib/store.js';
import { hashPin, checkNewPin } from './_lib/pin.js';

// POST {newPin}: doi PIN giao vien. PIN hien tai gui trong header x-teacher-pin nhu cac API khac
// (di qua teacherGate nen cung bi khoa 15 phut sau 8 lan sai). Sau khi doi, TEACHER_PIN tren Vercel het tac dung.
export default handler(async (req, res) => {
  if (req.method !== 'POST') return send(res, 405, { ok: false, message: 'Method not allowed' });
  const denied = await teacherGate(req);
  if (denied) return send(res, denied.status, { ok: false, message: denied.message });
  const error = checkNewPin(req.body?.newPin, req.headers['x-teacher-pin']);
  if (error) return send(res, 400, { ok: false, message: error });
  await redis().set(keys.teacherPin, hashPin(req.body.newPin));
  send(res, 200, { ok: true, message: 'Đã đổi PIN. Các máy khác cần nhập PIN mới.' });
});
