import { haversineMeters, isValidCoord } from './geo.js';

export const MAX_ACCURACY_M = 150;
const MSSV_RE = /^\d{6,12}$/;
const DEVICE_RE = /^[A-Za-z0-9-]{16,64}$/;

const fail = (code, message) => ({ ok: false, code, message });
const toNum = (v) => (v === null || v === undefined || v === '' ? NaN : Number(v));

// Kiểm tra định dạng dữ liệu sinh viên gửi lên.
export function parseCheckinBody(body) {
  const b = body && typeof body === 'object' ? body : {};
  const input = {
    sessionId: String(b.s ?? ''),
    token: String(b.t ?? ''),
    mssv: String(b.mssv ?? '').trim(),
    deviceId: String(b.deviceId ?? ''),
    lat: toNum(b.lat),
    lng: toNum(b.lng),
    accuracy: toNum(b.accuracy),
  };
  if (!input.sessionId) return { error: fail('closed', 'Hiện không có buổi điểm danh nào đang mở.') };
  if (!MSSV_RE.test(input.mssv)) return { error: fail('bad_mssv', 'MSSV không đúng định dạng.') };
  if (!DEVICE_RE.test(input.deviceId)) return { error: fail('bad_device', 'Thiết bị không hợp lệ. Hãy tải lại trang.') };
  if (!isValidCoord(input.lat, input.lng) || !Number.isFinite(input.accuracy)) {
    return { error: fail('no_gps', 'Không lấy được vị trí. Hãy bật định vị (GPS) và cho phép trình duyệt truy cập vị trí.') };
  }
  return { input };
}

/**
 * Áp dụng luật điểm danh trên trạng thái đã đọc từ Redis. Hàm thuần — không I/O.
 * tokenOk: true nếu phiên không yêu cầu QR, hoặc token/vé QR hợp lệ.
 * state: { session, now, tokenOk, student, existing, deviceMssvInSession, boundMssv }
 */
export function evaluateCheckin(input, state) {
  const { session, now, tokenOk, student, existing, deviceMssvInSession, boundMssv } = state;
  if (!session || session.closed || now > session.expiresAt) {
    return fail('closed', 'Buổi điểm danh đã kết thúc hoặc không tồn tại.');
  }
  if (now < session.startsAt) return fail('not_yet', 'Chưa đến giờ điểm danh.');
  if (!tokenOk) return fail('expired_qr', 'Mã QR đã hết hạn (mã đổi mỗi 10 giây). Hãy quét lại mã đang chiếu.');
  if (!student) return fail('unknown_mssv', 'MSSV không có trong danh sách lớp.');
  if (boundMssv && boundMssv !== input.mssv) {
    return fail('device_bound', `Máy này đã được dùng cho MSSV ${boundMssv}. Mỗi máy chỉ điểm danh cho một sinh viên.`);
  }
  if (deviceMssvInSession && deviceMssvInSession !== input.mssv) {
    return fail('device_used', 'Máy này đã điểm danh cho một bạn khác trong buổi này.');
  }
  if (existing) return { ok: true, already: true, record: existing, student };
  if (input.accuracy > MAX_ACCURACY_M) {
    return fail('low_accuracy', `GPS chưa chính xác (sai số ${Math.round(input.accuracy)} m). Hãy bật vị trí chính xác, ra gần cửa sổ rồi thử lại.`);
  }
  const distance = haversineMeters(session.lat, session.lng, input.lat, input.lng);
  if (distance > session.radius) {
    return fail('too_far', `Bạn đang cách lớp khoảng ${Math.round(distance)} m (cho phép ${session.radius} m).`);
  }
  return {
    ok: true,
    already: false,
    student,
    record: { mssv: input.mssv, time: now, distance: Math.round(distance), accuracy: Math.round(input.accuracy), deviceId: input.deviceId },
  };
}
