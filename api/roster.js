import { redis, keys } from './_lib/redis.js';
import { send, handler, clientIp } from './_lib/http.js';
import { getRoster, isRateLimited, teacherGate } from './_lib/store.js';
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

// Tên rút gọn cho bước xác nhận MSSV công khai: "Nguyễn Thế" + "Anh" → "N. T. Anh".
// Đủ để sinh viên nhận ra mình, nhưng không cho người ngoài dò ra họ tên đầy đủ của cả lớp.
export function shortName(ho, ten) {
  const initials = String(ho ?? '').split(/\s+/).filter(Boolean).map((w) => `${w.charAt(0).toUpperCase()}.`);
  return [...initials, String(ten ?? '').trim()].filter(Boolean).join(' ');
}

// Bỏ một MSSV và đánh lại STT liên tục.
export function removeStudent(roster, mssv) {
  return roster.filter((s) => normalizeMssv(s.mssv) !== mssv).map((s, i) => ({ ...s, stt: i + 1 }));
}

export default handler(async (req, res) => {
  if (req.method === 'GET' && req.query.mssv) {
    // Sinh viên tra tên để xác nhận — chỉ trả tên rút gọn của đúng MSSV đó.
    if (await isRateLimited(`lookup:${clientIp(req)}`, 30)) return send(res, 429, { ok: false, message: 'Thử quá nhiều lần. Đợi một phút.' });
    const want = normalizeMssv(req.query.mssv);
    const s = (await getRoster()).find((x) => normalizeMssv(x.mssv) === want);
    return s ? send(res, 200, { ok: true, name: shortName(s.ho, s.ten) }) : send(res, 404, { ok: false, message: 'MSSV không có trong danh sách lớp.' });
  }
  const denied = await teacherGate(req);
  if (denied) return send(res, denied.status, { ok: false, message: denied.message });
  if (req.method === 'GET') return send(res, 200, { ok: true, roster: await getRoster() });
  if (req.method === 'PUT') {
    const roster = parseRoster(req.body?.roster);
    if (!roster) return send(res, 400, { ok: false, message: 'Danh sách không hợp lệ (MSSV trống, trùng hoặc sai định dạng).' });
    await redis().set(keys.roster, roster);
    return send(res, 200, { ok: true, count: roster.length });
  }
  if (req.method === 'DELETE') {
    // Xoá một sinh viên khỏi lớp; điểm danh cũ của bạn đó vẫn giữ trong các buổi đã qua.
    const want = normalizeMssv(req.query.mssv);
    const before = await getRoster();
    const after = removeStudent(before, want);
    if (after.length === before.length) return send(res, 404, { ok: false, message: 'MSSV không có trong danh sách lớp.' });
    await redis().set(keys.roster, after);
    return send(res, 200, { ok: true, count: after.length });
  }
  send(res, 405, { ok: false, message: 'Method not allowed' });
});
