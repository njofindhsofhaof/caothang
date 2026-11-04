import { redis, keys } from './_lib/redis.js';
import { send, handler, isTeacher } from './_lib/http.js';

// File mẫu ~vài chục KB; chặn trên để vừa giới hạn một bản ghi Redis.
export const MAX_BASE64_CHARS = 1_000_000;
const BASE64_RE = /^[A-Za-z0-9+/]+={0,2}$/;

export function parseTemplate(body) {
  const name = String(body?.name ?? '').trim().slice(0, 100) || 'mau-diem-danh.xlsx';
  const data = String(body?.data ?? '');
  if (!data || !BASE64_RE.test(data)) return { error: 'File mẫu không hợp lệ.' };
  if (data.length > MAX_BASE64_CHARS) return { error: 'File mẫu quá lớn (tối đa khoảng 700 KB).' };
  return { template: { name, data, savedAt: Date.now() } };
}

// File mẫu Excel dùng chung cho mọi máy của giáo viên.
export default handler(async (req, res) => {
  if (!isTeacher(req)) return send(res, 401, { ok: false, message: 'Sai mã PIN giáo viên.' });
  if (req.method === 'GET') return send(res, 200, { ok: true, template: (await redis().get(keys.template)) ?? null });
  if (req.method === 'PUT') {
    const { template, error } = parseTemplate(req.body);
    if (error) return send(res, 400, { ok: false, message: error });
    await redis().set(keys.template, template);
    return send(res, 200, { ok: true, name: template.name });
  }
  send(res, 405, { ok: false, message: 'Method not allowed' });
});
