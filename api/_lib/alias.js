// Biệt danh ẩn danh cho bảng công khai: mỗi chữ trong họ tên đổi thành một từ cùng chữ cái đầu
// (chữ đầu → con vật, chữ giữa → màu/tính từ, chữ cuối → thiên nhiên), vd. "Nguyễn Văn Anh" → "Nhím Vàng Ánh".
// Cố định theo họ tên và không trùng trong lớp. Tránh các từ hay dùng làm tên người.
// Biệt danh do lớp tự chọn nằm trong alias-fixed.js (khóa là mã băm họ tên) và được ưu tiên.

import { createHash } from 'node:crypto';
import { FIXED_ALIASES } from './alias-fixed.js';

const ANIMAL = {
  A: ['Ác'], B: ['Bướm', 'Báo', 'Bê', 'Bói', 'Bò'], C: ['Cá', 'Cò', 'Cú', 'Cáo', 'Cua', 'Chim'], D: ['Dê', 'Dế', 'Dơi', 'Đà'],
  E: ['Ếch', 'Én'], G: ['Gà', 'Gấu'], H: ['Hổ', 'Hươu', 'Hến', 'Hạc', 'Heo'], K: ['Kiến', 'Két', 'Khướu', 'Khỉ'],
  L: ['Lừa', 'Lửng', 'Lười', 'Lân', 'Lươn'], M: ['Mèo', 'Mực', 'Mòng'], N: ['Nhím', 'Nai', 'Ngựa', 'Nghé', 'Ngỗng', 'Nhạn', 'Ngao'], O: ['Ong', 'Ốc'], P: ['Phượng', 'Pug', 'Poodle', 'Piranha', 'Puma', 'Panda'],
  Q: ['Quạ'], R: ['Rắn', 'Rùa', 'Rồng'], S: ['Sóc', 'Sói', 'Sứa', 'Sẻ'], T: ['Thỏ', 'Tôm', 'Trâu', 'Tằm', 'Trăn'],
  U: ['Ưng'], V: ['Voi', 'Vịt', 'Vẹt', 'Vượn'], X: ['Xẻ'], Y: ['Yểng'],
};
// Chữ đầu (họ) luôn là con vật nếu chữ cái đó có con vật.
export const ANIMAL_WORDS = new Set(Object.values(ANIMAL).flat());
const COLOR = {
  A: ['Ấm', 'Ảo'], B: ['Bạc', 'Biếc', 'Bông'], C: ['Cam', 'Chàm'], D: ['Dịu', 'Đỏ', 'Đen'], E: ['Êm'], G: ['Gấm'],
  H: ['Hồng', 'Hường'], I: ['Im', 'Ít'], K: ['Kem', 'Khói'], L: ['Lam', 'Lục'], M: ['Mận', 'Mơ'], N: ['Nâu', 'Nhạt'],
  O: ['Óng'], P: ['Phấn'], Q: ['Quế'], R: ['Rêu'], S: ['Son', 'Sữa'], T: ['Tím', 'Trắng', 'Tươi'], U: ['Ửng'],
  V: ['Vàng', 'Vui'], X: ['Xám', 'Xanh'], Y: ['Yên'],
};
const NATURE = {
  A: ['Ánh'], B: ['Bão', 'Biển', 'Bụi'], C: ['Cát', 'Cỏ', 'Cầu'], D: ['Dâu', 'Dừa', 'Đá', 'Đào'], E: ['Êm'],
  G: ['Gió', 'Gạo'], H: ['Hạt', 'Hè', 'Hồ'], I: ['Ít', 'Im'], K: ['Kẹo', 'Khế'], L: ['Lá', 'Lúa', 'Lửa'],
  M: ['Mây', 'Mưa', 'Mầm'], N: ['Nắng', 'Núi', 'Nước'], O: ['Ổi'], P: ['Pháo'], Q: ['Quả', 'Quất'],
  R: ['Rừng', 'Ruộng'], S: ['Sao', 'Suối', 'Sông', 'Sương'], T: ['Trăng', 'Tuyết', 'Thông'], U: ['Ửng'],
  V: ['Vườn', 'Vỏ'], X: ['Xoài', 'Xuồng'], Y: ['Yếm'],
};
const ALL = [ANIMAL, COLOR, NATURE];
const MAX_TRIES = 40;

// Chữ cái gốc, bỏ dấu (Đ → D, Ư → U...), viết hoa.
export function baseLetter(word) {
  return String(word).trim().charAt(0).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/, 'D').toUpperCase();
}

// Khóa tra biệt danh cố định: băm họ tên đã bỏ dấu, viết thường, gộp khoảng trắng (repo công khai nên không lưu tên thật).
export function nameKey(fullName) {
  const plain = String(fullName).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd')
    .toLowerCase().replace(/\s+/g, ' ').trim().replace(/^ngyen /, 'nguyen '); // lỗi gõ "Ngyễn" hay gặp trong danh sách
  return createHash('sha256').update(`caothang-alias:${plain}`).digest('hex').slice(0, 16);
}

function hash(text) {
  let h = 2166136261;
  for (const ch of text) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; }
  return h;
}

function pick(real, position, last, seed) {
  const letter = baseLetter(real);
  const prefer = position === 0 ? ANIMAL : (last ? NATURE : COLOR);
  const pool = [prefer[letter], ...ALL.map((d) => d[letter])].filter(Boolean).flat();
  const options = [...new Set(pool)].filter((w) => w.toLowerCase() !== real.toLowerCase());
  if (!options.length) return letter;
  const first = (prefer[letter] ?? []).filter((w) => options.includes(w));
  const list = first.length ? first : options;
  return list[hash(seed) % list.length];
}

function aliasOf(fullName, salt) {
  const words = fullName.split(/\s+/).filter(Boolean);
  return words.map((w, i) => pick(w, i, i === words.length - 1 && i > 0, `${fullName}#${i}#${salt}`)).join(' ');
}

/**
 * Biệt danh cho cả lớp, không trùng nhau. Xét theo MSSV tăng dần để kết quả cố định.
 * Biệt danh cố định được ưu tiên; nếu hai bạn trùng biệt danh cố định thì MSSV nhỏ hơn giữ, bạn kia dùng biệt danh sinh tự động.
 * @param {{ mssv: string, ho?: string, ten?: string }[]} roster
 * @param {Map<string, string>} [fixed] nameKey(họ tên) → biệt danh
 * @returns {Map<string, string>} mssv → biệt danh
 */
export function aliasMap(roster, fixed = FIXED_ALIASES) {
  const used = new Set();
  const map = new Map();
  for (const s of [...roster].sort((a, b) => String(a.mssv).localeCompare(String(b.mssv)))) {
    const full = `${s.ho ?? ''} ${s.ten ?? ''}`.trim();
    const chosen = fixed.get(nameKey(full));
    if (chosen && !used.has(chosen)) {
      used.add(chosen);
      map.set(String(s.mssv), chosen);
      continue;
    }
    let alias = aliasOf(full, 0);
    for (let salt = 1; used.has(alias) && salt < MAX_TRIES; salt++) alias = aliasOf(full, salt);
    for (let n = 2; used.has(alias); n++) alias = `${aliasOf(full, 0)} ${n}`;
    used.add(alias);
    map.set(String(s.mssv), alias);
  }
  return map;
}
