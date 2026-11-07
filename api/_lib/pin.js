import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

// PIN giao vien doi tren trang duoc luu dang bam scrypt: "scrypt$<salt>$<hash>" (base64url).
export const MIN_PIN_LEN = 10;
export const MAX_PIN_LEN = 64;
const KEY_LEN = 32;
const SCRYPT_OPTS = { N: 16384, r: 8, p: 1 };

export function hashPin(pin) {
  const salt = randomBytes(16);
  const hash = scryptSync(String(pin), salt, KEY_LEN, SCRYPT_OPTS);
  return `scrypt$${salt.toString('base64url')}$${hash.toString('base64url')}`;
}

export function verifyPinHash(pin, stored) {
  if (typeof pin !== 'string' || typeof stored !== 'string') return false;
  const [algo, saltB64, hashB64] = stored.split('$');
  if (algo !== 'scrypt' || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, 'base64url');
  if (expected.length !== KEY_LEN) return false;
  const got = scryptSync(pin, Buffer.from(saltB64, 'base64url'), KEY_LEN, SCRYPT_OPTS);
  return timingSafeEqual(got, expected);
}

// Tra ve thong bao loi neu PIN moi khong hop le, null neu dung.
export function checkNewPin(newPin, currentPin) {
  if (typeof newPin !== 'string') return 'PIN mới không hợp lệ.';
  if (newPin !== newPin.trim()) return 'PIN mới không được có khoảng trắng ở đầu hoặc cuối.';
  if (newPin.length < MIN_PIN_LEN) return `PIN mới cần ít nhất ${MIN_PIN_LEN} ký tự.`;
  if (newPin.length > MAX_PIN_LEN) return `PIN mới tối đa ${MAX_PIN_LEN} ký tự.`;
  if (!/[A-Za-z]/.test(newPin) || !/\d/.test(newPin)) return 'PIN mới cần có cả chữ và số.';
  if (newPin === currentPin) return 'PIN mới phải khác PIN hiện tại.';
  return null;
}
