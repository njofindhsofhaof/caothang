import { randomBytes } from 'node:crypto';
import { redis, keys } from './_lib/redis.js';
import { send, handler, isTeacher, requireSecret, vnDate } from './_lib/http.js';
import { getSession, getActiveSession, getAttendance, getRoster, listSessions, isActive, MAX_SESSION_MS } from './_lib/store.js';
import { isValidCoord } from './_lib/geo.js';
import { makeToken, windowAt, msUntilNextWindow } from './_lib/token.js';

const DEFAULT_RADIUS_M = 100;
const MIN_RADIUS_M = 30;
const MAX_RADIUS_M = 500;
const MAX_REPEAT_WEEKS = 20;
const WEEK_MS = 7 * 86_400_000;
const KEEP_S = 400 * 86_400;

const clamp = (v, lo, hi, dflt) => (Number.isFinite(v) ? Math.min(hi, Math.max(lo, v)) : dflt);
const newId = () => randomBytes(6).toString('base64url');
const fail = (res, message, status = 400) => send(res, status, { ok: false, message });

// GET: phiên đang mở (+ token QR, danh sách) và lịch sắp tới.
async function status(req, res) {
  const now = Date.now();
  const [active, upcoming, roster] = await Promise.all([
    getActiveSession(now),
    listSessions(now, now + 60 * 86_400_000),
    getRoster(),
  ]);
  const body = { ok: true, now, total: roster.length, active, upcoming: upcoming.filter((s) => !s.closed && s.startsAt > now) };
  if (active) {
    body.records = (await getAttendance(active.id)).map(({ deviceId, ...r }) => r);
    if (active.requireQr) {
      body.token = makeToken(requireSecret('QR_SECRET'), active.id, windowAt(now));
      body.nextInMs = msUntilNextWindow(now);
    }
  }
  send(res, 200, body);
}

async function resolvePlace(b) {
  if (b.placeId) {
    const place = await redis().hget(keys.places, String(b.placeId));
    if (!place) return { error: 'Không tìm thấy phòng đã lưu.' };
    return { place: { ...place, id: String(b.placeId) } };
  }
  const lat = Number(b.lat);
  const lng = Number(b.lng);
  if (!isValidCoord(lat, lng)) return { error: 'Chưa có vị trí lớp học. Chọn phòng đã lưu hoặc dùng vị trí hiện tại.' };
  return { place: { id: '', name: 'Vị trí hiện tại', lat, lng } };
}

// POST: tạo phiên. startsAt/endsAt (ms); thiếu startsAt = mở ngay. repeatWeeks: lặp hàng tuần.
async function create(req, res) {
  const b = req.body ?? {};
  const now = Date.now();
  const startsAt = Number.isFinite(Number(b.startsAt)) && b.startsAt ? Number(b.startsAt) : now;
  const endsAt = Number(b.endsAt) || (startsAt + 15 * 60_000);
  if (endsAt <= startsAt) return fail(res, 'Giờ kết thúc phải sau giờ bắt đầu.');
  if (endsAt - startsAt > MAX_SESSION_MS) return fail(res, 'Một khung giờ tối đa 4 tiếng.');
  if (endsAt < now) return fail(res, 'Khung giờ này đã qua.');
  const { place, error } = await resolvePlace(b);
  if (error) return fail(res, error);

  const weeks = clamp(Math.floor(Number(b.repeatWeeks)), 1, MAX_REPEAT_WEEKS, 1);
  const created = [];
  for (let i = 0; i < weeks; i += 1) {
    const s = {
      id: newId(),
      label: String(b.label ?? '').slice(0, 60),
      date: vnDate(startsAt + i * WEEK_MS),
      startsAt: startsAt + i * WEEK_MS,
      expiresAt: endsAt + i * WEEK_MS,
      placeId: place.id,
      placeName: place.name,
      lat: place.lat,
      lng: place.lng,
      radius: clamp(Number(b.radius), MIN_RADIUS_M, MAX_RADIUS_M, DEFAULT_RADIUS_M),
      requireQr: Boolean(b.requireQr),
      closed: false,
      createdAt: now,
    };
    created.push(s);
  }
  await Promise.all(created.flatMap((s) => [
    redis().set(keys.session(s.id), s, { ex: KEEP_S + Math.ceil((s.startsAt - now) / 1000) }),
    redis().zadd(keys.schedule, { score: s.startsAt, member: s.id }),
    redis().sadd(keys.monthSessions(s.date.slice(0, 7)), s.id),
  ]));
  send(res, 200, { ok: true, sessions: created });
}

// PATCH: đóng sớm / bật-tắt QR. DELETE ?id=: xoá phiên chưa diễn ra.
async function update(req, res) {
  const b = req.body ?? {};
  const s = await getSession(String(b.id ?? ''));
  if (!s) return fail(res, 'Không tìm thấy phiên.', 404);
  const now = Date.now();
  const next = { ...s };
  if (b.action === 'close') { next.closed = true; next.expiresAt = Math.min(s.expiresAt, now); }
  else if (b.action === 'qr') next.requireQr = Boolean(b.value);
  else if (b.action === 'extend') next.expiresAt = Math.min(s.startsAt + MAX_SESSION_MS, Math.max(s.expiresAt, now) + 5 * 60_000);
  else return fail(res, 'Thao tác không hợp lệ.');
  await redis().set(keys.session(s.id), next, { keepTtl: true });
  send(res, 200, { ok: true, session: next, active: isActive(next, now) });
}

async function remove(req, res) {
  const s = await getSession(String(req.query.id ?? ''));
  if (!s) return fail(res, 'Không tìm thấy phiên.', 404);
  if ((await getAttendance(s.id)).length) return fail(res, 'Phiên đã có người điểm danh, không xoá được. Hãy dùng "Đóng".');
  await Promise.all([
    redis().del(keys.session(s.id)),
    redis().zrem(keys.schedule, s.id),
    redis().srem(keys.monthSessions(s.date.slice(0, 7)), s.id),
  ]);
  send(res, 200, { ok: true });
}

export default handler(async (req, res) => {
  if (!isTeacher(req)) return fail(res, 'Sai mã PIN giáo viên.', 401);
  if (req.method === 'GET') return status(req, res);
  if (req.method === 'POST') return create(req, res);
  if (req.method === 'PATCH') return update(req, res);
  if (req.method === 'DELETE') return remove(req, res);
  fail(res, 'Method not allowed', 405);
});
