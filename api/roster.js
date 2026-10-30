import { redis, keys } from './_lib/redis.js';
import { send, handler, isTeacher, clientIp } from './_lib/http.js';
import { getRoster, isRateLimited } from './_lib/store.js';
import { normalizeMssv } from './_lib/checkin-rules.js';

const MSSV_RE = /^\d{6,12}$/;
const MAX_STUDENTS = 300;
const clean = (v) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, 60);

function parseRoster(list) {
  if (!Array.isArray(list) || list.length === 0 || list.length > MAX_STUDENTS) return null;
  const seen = new Set();
  const out = [];
  for (const row of list) {
    const mssv = normalizeMssv(row?.mssv);
    if (!MSSV_RE.test(mssv) || seen.has(mssv)) return null;
    seen.add(mssv);
    out.push({ stt: out.length + 1, mssv, ho: clean(row.ho), ten: clean(row.ten) });
  }
  return out;
}

export default handler(async (req, res) => {
  if (req.method === 'GET' && req.query.mssv) {
    // Sinh viên tra tên để xác nhận — chỉ trả họ tên của đúng MSSV đó.
    if (await isRateLimited(`lookup:${clientIp(req)}`, 30)) return send(res, 429, { ok: false, message: 'Thử quá nhiều lần. Đợi một phút.' });
    const want = normalizeMssv(req.query.mssv);
    const s = (await getRoster()).find((x) => normalizeMssv(x.mssv) === want);
    return s ? send(res, 200, { ok: true, name: `${s.ho} ${s.ten}`.trim() }) : send(res, 404, { ok: false, message: 'MSSV không có trong danh sách lớp.' });
  }
  if (!isTeacher(req)) return send(res, 401, { ok: false, message: 'Sai mã PIN giáo viên.' });
  if (req.method === 'GET') return send(res, 200, { ok: true, roster: await getRoster() });
  if (req.method === 'PUT') {
    const roster = parseRoster(req.body?.roster);
    if (!roster) return send(res, 400, { ok: false, message: 'Danh sách không hợp lệ (MSSV trống, trùng hoặc sai định dạng).' });
    await redis().set(keys.roster, roster);
    return send(res, 200, { ok: true, count: roster.length });
  }
  send(res, 405, { ok: false, message: 'Method not allowed' });
});
