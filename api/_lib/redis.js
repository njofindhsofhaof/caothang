import { Redis } from '@upstash/redis';

let client;

// Vercel Marketplace (Upstash) gắn KV_REST_API_*; tích hợp cũ dùng UPSTASH_REDIS_REST_*.
export function redis() {
  if (client) return client;
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error('Thiếu cấu hình Redis (KV_REST_API_URL / KV_REST_API_TOKEN).');
  client = new Redis({ url, token });
  return client;
}

export const keys = {
  roster: 'roster',
  schedule: 'sessions:schedule', // zset: id theo thời điểm bắt đầu
  places: 'places', // hash: placeId -> {name, lat, lng}
  session: (id) => `session:${id}`,
  monthSessions: (ym) => `sessions:${ym}`,
  att: (id) => `att:${id}`,
  deviceInSession: (id) => `devsess:${id}`,
  device: (deviceId) => `device:${deviceId}`,
  excuse: (date) => `excuse:${date}`,
  rate: (who) => `rl:${who}`,
};
