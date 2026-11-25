import { redis, keys } from './redis.js';

// Nhật ký thao tác của giáo viên (sửa điểm danh, lịch, danh sách lớp...), mới nhất trước.
// Giữ AUDIT_MAX dòng gần nhất. Lỗi ghi nhật ký không được làm hỏng thao tác chính.
export const AUDIT_MAX = 5000;

// Máy thực hiện: IP + trình duyệt rút gọn, để phân biệt khi nhiều người dùng chung PIN.
export function actorOf(req) {
  const fwd = req?.headers?.['x-forwarded-for'];
  const ip = (typeof fwd === 'string' ? fwd.split(',')[0] : req?.socket?.remoteAddress || '').trim();
  const ua = String(req?.headers?.['user-agent'] ?? '').slice(0, 200);
  return { ip, ua };
}

export async function audit(req, entry, db = redis()) {
  try {
    await db.lpush(keys.audit, { at: Date.now(), ...actorOf(req), ...entry });
    await db.ltrim(keys.audit, 0, AUDIT_MAX - 1);
  } catch (err) {
    console.error('[audit]', err);
  }
}

export async function readAudit(limit = 300, db = redis()) {
  const n = Math.min(Math.max(Number(limit) || 300, 1), AUDIT_MAX);
  return (await db.lrange(keys.audit, 0, n - 1)) ?? [];
}
