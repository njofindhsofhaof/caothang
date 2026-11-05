import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { timingSafeEqual } from 'node:crypto';
import { redis, keys } from './_lib/redis.js';
import { send, handler } from './_lib/http.js';
import { mailer, fromAddress, siteUrl, subscribeSecret } from './_lib/mailer.js';
import { parsePosts, notifiablePosts, pickNewPosts, buildPostsEmail, actionUrl } from './_lib/subscribe.js';

// Vercel Cron gọi kèm "Authorization: Bearer $CRON_SECRET"; gọi tay sau khi đăng bài cũng dùng header này.
function authorized(req) {
  const secret = process.env.CRON_SECRET;
  const given = req.headers.authorization;
  if (!secret || typeof given !== 'string') return false;
  const a = Buffer.from(`Bearer ${secret}`);
  const b = Buffer.from(given);
  return a.length === b.length && timingSafeEqual(a, b);
}

async function loadPosts() {
  const src = await readFile(path.join(process.cwd(), 'assets/posts.js'), 'utf8');
  return parsePosts(src);
}

async function sendToAll(subscribers, newPosts) {
  const base = siteUrl();
  const secret = subscribeSecret();
  const results = await Promise.allSettled(
    subscribers.map((email) => {
      const unsubUrl = actionUrl(base, secret, 'unsub', email);
      const mail = buildPostsEmail(newPosts, { siteUrl: base, unsubUrl });
      return mailer().sendMail({
        from: fromAddress(),
        to: email,
        ...mail,
        headers: { 'List-Unsubscribe': `<${unsubUrl}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
      });
    })
  );
  const failed = results.filter((r) => r.status === 'rejected');
  failed.forEach((r) => console.error('[notify] gửi lỗi:', r.reason?.message));
  return { sent: results.length - failed.length, failed: failed.length };
}

export default handler(async (req, res) => {
  if (!authorized(req)) return send(res, 401, { ok: false, message: 'Unauthorized' });
  const posts = await loadPosts();
  const db = redis();

  // Lần chạy đầu: đánh dấu mọi bài hiện có là đã báo, để không gửi lại cả kho bài cũ.
  if ((await db.scard(keys.notifySent)) === 0) {
    const hrefs = notifiablePosts(posts).map((p) => p.href);
    if (hrefs.length) await db.sadd(keys.notifySent, ...hrefs);
    return send(res, 200, { ok: true, seeded: hrefs.length });
  }

  const newPosts = pickNewPosts(posts, await db.smembers(keys.notifySent));
  if (newPosts.length === 0) return send(res, 200, { ok: true, newPosts: 0 });

  // Đánh dấu trước khi gửi: lỡ hàm bị ngắt giữa chừng thì cũng không gửi trùng ở lần sau.
  await db.sadd(keys.notifySent, ...newPosts.map((p) => p.href));
  const subscribers = await db.smembers(keys.subscribers);
  const stats = subscribers.length ? await sendToAll(subscribers, newPosts) : { sent: 0, failed: 0 };
  send(res, 200, { ok: true, newPosts: newPosts.map((p) => p.title), ...stats });
});
