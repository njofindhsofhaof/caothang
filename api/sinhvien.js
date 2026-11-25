import { send, handler, clientIp, vnDate, MONTH_RE } from './_lib/http.js';
import { getRoster, isRateLimited } from './_lib/store.js';
import { normalizeMssv } from './_lib/checkin-rules.js';
import { aliasMap } from './_lib/alias.js';
import { loadStudentReport } from './_lib/tally.js';
import { upcomingExams } from './_lib/exams.js';

// Trang cá nhân sinh viên: nhập MSSV là xem được điểm danh từng môn của mình.
// Không cần mật khẩu nên chỉ trả biệt danh (như bảng Leo rank), không trả họ tên thật.
export default handler(async (req, res) => {
  if (req.method !== 'GET') return send(res, 405, { ok: false, message: 'Method not allowed' });
  if (await isRateLimited(`sv:${clientIp(req)}`, 30)) return send(res, 429, { ok: false, message: 'Tra quá nhiều lần. Đợi một phút rồi thử lại.' });

  const mssv = normalizeMssv(req.query.mssv);
  if (!/^\d{6,12}$/.test(mssv)) return send(res, 400, { ok: false, message: 'MSSV gồm 6–12 chữ số.' });
  const now = Date.now();
  const nowYm = vnDate(now).slice(0, 7);
  const month = String(req.query.month ?? nowYm);
  if (!MONTH_RE.test(month) || month > nowYm) return send(res, 400, { ok: false, message: 'Tháng không hợp lệ.' });

  const roster = await getRoster();
  if (!roster.some((s) => String(s.mssv) === mssv)) return send(res, 404, { ok: false, message: 'MSSV này không có trong danh sách lớp.' });
  const alias = aliasMap(roster).get(mssv);
  const report = await loadStudentReport(month, mssv, now, nowYm);
  send(res, 200, { ok: true, alias, month, ...report, exams: upcomingExams(vnDate(now)) });
});
