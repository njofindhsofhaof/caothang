// Thời khoá biểu buổi chiều: 6 tiết liền nhau, mỗi tiết 45 phút, bắt đầu 12:30 (giờ Việt Nam).
export const FIRST_PERIOD_MIN = 12 * 60 + 30;
export const PERIOD_MIN = 45;
export const PERIODS_PER_DAY = 6;

const MIN_MS = 60_000;
const DAY_MS = 86_400_000;
const VN_OFFSET_MS = 7 * 3_600_000; // Việt Nam không đổi giờ mùa hè

/** Tiết chứa thời điểm `ms`: { index (1..6), startsAt, endsAt } hoặc null nếu ngoài giờ học. */
export function periodAt(ms) {
  const sinceMidnight = (ms + VN_OFFSET_MS) % DAY_MS;
  const idx = Math.floor((sinceMidnight / MIN_MS - FIRST_PERIOD_MIN) / PERIOD_MIN);
  if (idx < 0 || idx >= PERIODS_PER_DAY) return null;
  const startsAt = ms - sinceMidnight + (FIRST_PERIOD_MIN + idx * PERIOD_MIN) * MIN_MS;
  return { index: idx + 1, startsAt, endsAt: startsAt + PERIOD_MIN * MIN_MS };
}

/**
 * Hạn điểm danh trễ: hết tiết chứa giờ kết thúc buổi. Buổi kết thúc đúng cuối tiết, hoặc ngoài giờ học,
 * thì không có khung trễ (trả về expiresAt).
 */
export function lateUntil(session) {
  const period = periodAt(session.expiresAt - 1);
  return period ? Math.max(session.expiresAt, period.endsAt) : session.expiresAt;
}
