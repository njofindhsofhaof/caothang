import { haversineMeters, isValidCoord } from './geo.js';

// Gắn cờ "nghi vấn" cho lượt điểm danh — chỉ đánh dấu cho giáo viên xem, không chặn.
// Web không đọc được cờ mock location, nên dựa vào dấu vết thường gặp của app fake GPS:
// ghim một điểm cố định (không dao động), sai số đẹp bất thường, trùng tâm lớp hoặc trùng nhau.

export const MAX_SAMPLES = 5;
export const STATIC_MIN_SAMPLES = 3;
// GPS Wi-Fi/mạng (sai số lớn) có thể trả về y hệt nhau một cách hợp lệ — chỉ xét khi máy báo GPS rất chính xác.
export const STATIC_MAX_ACCURACY_M = 20;
export const TOO_PRECISE_M = 3;
export const CENTER_EPSILON_M = 1;
const COORD_DECIMALS = 6; // ~0,1 m

export const roundCoord = (v) => Number(v.toFixed(COORD_DECIMALS));

// Các lần đọc GPS phía trình duyệt gửi kèm; bỏ mẫu hỏng, giới hạn số lượng.
export function parseSamples(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.slice(0, MAX_SAMPLES)
    .map((s) => ({ lat: Number(s?.lat), lng: Number(s?.lng), accuracy: Number(s?.accuracy), ts: Number(s?.ts) }))
    .filter((s) => isValidCoord(s.lat, s.lng) && Number.isFinite(s.accuracy) && Number.isFinite(s.ts));
}

// Nhiều lần đọc khác thời điểm mà toạ độ + sai số y hệt nhau → vị trí bị ghim.
// Các mẫu trùng timestamp là trình duyệt trả lại bản cũ, không tính.
function isStatic(samples) {
  const fresh = [...new Map(samples.map((s) => [s.ts, s])).values()];
  if (fresh.length < STATIC_MIN_SAMPLES) return false;
  const [first] = fresh;
  if (first.accuracy > STATIC_MAX_ACCURACY_M) return false;
  return fresh.every((s) => s.lat === first.lat && s.lng === first.lng && s.accuracy === first.accuracy);
}

/** Cờ tính được ngay lúc điểm danh. Trả về mảng mã cờ (rỗng nếu bình thường). */
export function checkinFlags(input, session) {
  const flags = [];
  if (isStatic(input.samples ?? [])) flags.push('static');
  if (input.accuracy <= TOO_PRECISE_M) flags.push('precise');
  if (haversineMeters(session.lat, session.lng, input.lat, input.lng) < CENTER_EPSILON_M) flags.push('center');
  return flags;
}

/**
 * Cờ "trùng toạ độ" chỉ biết khi có cả lớp, nên tính lúc trả danh sách cho giáo viên.
 * Trả về bản sao các bản ghi: thêm dupWith (MSSV trùng) và bỏ toạ độ thô.
 */
export function withDuplicateFlags(records) {
  const byCoord = new Map();
  for (const r of records) {
    if (!Number.isFinite(r.lat) || !Number.isFinite(r.lng)) continue;
    const k = `${r.lat},${r.lng}`;
    byCoord.set(k, [...(byCoord.get(k) ?? []), r.mssv]);
  }
  return records.map(({ lat, lng, ...r }) => {
    const group = Number.isFinite(lat) && Number.isFinite(lng) ? byCoord.get(`${lat},${lng}`) : null;
    const dupWith = group ? group.filter((m) => m !== r.mssv) : [];
    return dupWith.length ? { ...r, dupWith } : r;
  });
}
