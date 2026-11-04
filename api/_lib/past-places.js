import { haversineMeters, isValidCoord } from './geo.js';

// Hai lần GPS trong cùng phòng lệch nhau vài chục mét — gộp lại thành một vị trí.
export const SAME_SPOT_M = 30;

/**
 * Các vị trí khác nhau của những buổi tạo bằng "Vị trí hiện tại" (placeId rỗng). Hàm thuần.
 * Bỏ các vị trí đã nằm gần một phòng đã lưu. Mới nhất trước.
 */
export function pastLocations(sessions, places = []) {
  const spots = [];
  const recentFirst = sessions
    .filter((s) => s && !s.placeId && isValidCoord(s.lat, s.lng))
    .sort((a, b) => b.startsAt - a.startsAt);
  for (const s of recentFirst) {
    const spot = spots.find((p) => haversineMeters(p.lat, p.lng, s.lat, s.lng) <= SAME_SPOT_M);
    if (spot) spot.count += 1;
    else spots.push({ lat: s.lat, lng: s.lng, lastAt: s.startsAt, label: s.label || '', count: 1 });
  }
  return spots.filter((spot) => !places.some((p) => haversineMeters(p.lat, p.lng, spot.lat, spot.lng) <= SAME_SPOT_M));
}
