import { redis, keys } from './_lib/redis.js';
import { handler, vnDate, MONTH_RE } from './_lib/http.js';
import { getSession, getRoster } from './_lib/store.js';
import { classLeaderboard } from './_lib/tally.js';
import { aliasMap } from './_lib/alias.js';

const CACHE_S = 300; // CDN giữ 5 phút để trang Hoạt động không gọi Redis mỗi lượt xem

// Công khai, không cần PIN: chỉ trả biệt danh ẩn danh + số buổi đúng giờ (không tên thật, không MSSV).
// Xếp hạng theo từng tháng (?month=YYYY-MM): chỉ tính buổi trong tháng đó, sang tháng mới là reset.
export default handler(async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ ok: false, message: 'Method not allowed' });
  const now = Date.now();
  const month = String(req.query.month ?? vnDate(now).slice(0, 7));
  if (!MONTH_RE.test(month)) return res.status(400).json({ ok: false, message: 'Tháng không hợp lệ (YYYY-MM).' });

  const ids = ((await redis().smembers(keys.monthSessions(month))) ?? []).filter(Boolean);
  const [roster, sessions] = await Promise.all([getRoster(), Promise.all(ids.map(getSession))]);
  const valid = sessions.filter(Boolean);
  const att = await Promise.all(valid.map((s) => redis().hgetall(keys.att(s.id))));
  const attendance = Object.fromEntries(valid.map((s, i) => [s.id, att[i] ?? {}]));

  const aliases = aliasMap(roster);
  const list = classLeaderboard({ sessions: valid, attendance, roster, now, nameOf: (s) => aliases.get(String(s.mssv)) });
  res.setHeader('Cache-Control', `public, s-maxage=${CACHE_S}, stale-while-revalidate=${CACHE_S * 2}`);
  res.status(200).json({ ok: true, month, updatedAt: now, classSize: roster.length, list });
});
