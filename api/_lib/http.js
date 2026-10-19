import { timingSafeEqual } from 'node:crypto';

export function send(res, status, data) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(status).json(data);
}

export function requireSecret(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Thiếu biến môi trường ${name}.`);
  return v;
}

export function isTeacher(req) {
  const pin = process.env.TEACHER_PIN;
  const given = req.headers['x-teacher-pin'];
  if (!pin || typeof given !== 'string') return false;
  const a = Buffer.from(pin);
  const b = Buffer.from(given);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  return (typeof fwd === 'string' ? fwd.split(',')[0] : req.socket?.remoteAddress || 'unknown').trim();
}

const VN_DATE = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' });

// YYYY-MM-DD theo giờ Việt Nam.
export function vnDate(ms) {
  return VN_DATE.format(new Date(ms));
}

export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export const MONTH_RE = /^\d{4}-\d{2}$/;

// Bọc handler: bắt lỗi chung, không lộ chi tiết nội bộ ra ngoài.
export function handler(fn) {
  return async (req, res) => {
    try {
      await fn(req, res);
    } catch (err) {
      console.error('[api]', req.method, req.url, err);
      send(res, 500, { ok: false, message: 'Lỗi máy chủ. Vui lòng thử lại sau ít phút.' });
    }
  };
}
