import { redis, keys } from './_lib/redis.js';
import { send, handler, clientIp } from './_lib/http.js';
import { isRateLimited } from './_lib/store.js';
import { mailer, fromAddress, siteUrl, subscribeSecret } from './_lib/mailer.js';
import { normalizeEmail, verifyEmailToken, actionUrl, buildConfirmEmail, resultPage } from './_lib/subscribe.js';

const MAX_SUBSCRIBERS = 2000;
const MAX_CONFIRM_PER_DAY = 100; // giu tai khoan Gmail gui thu khong bi khoa vi spam

function page(res, status, title, message) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(status).send(resultPage(title, message, siteUrl()));
}

// POST {email}: gửi email xác nhận (double opt-in) — chưa thêm vào danh sách cho tới khi bấm link.
async function requestSubscribe(req, res) {
  if (req.body?.website) return send(res, 200, { ok: true }); // honeypot: bot điền ô ẩn
  if (await isRateLimited(`sub:${clientIp(req)}`, 5, 600)) {
    return send(res, 429, { ok: false, message: 'Bạn thử quá nhiều lần. Đợi vài phút rồi thử lại.' });
  }
  const email = normalizeEmail(req.body?.email);
  if (!email) return send(res, 400, { ok: false, message: 'Email không hợp lệ.' });
  if (await redis().sismember(keys.subscribers, email)) {
    return send(res, 200, { ok: true, already: true, message: 'Email này đã đăng ký rồi.' });
  }
  if (await isRateLimited(`subto:${email}`, 1, 3600)) {
    return send(res, 200, { ok: true, message: 'Email xác nhận đã được gửi tới địa chỉ này. Kiểm tra hộp thư (cả mục Spam), hoặc thử lại sau 1 giờ.' });
  }
  if (await isRateLimited('sub:all', MAX_CONFIRM_PER_DAY, 86_400)) {
    return send(res, 429, { ok: false, message: 'Hôm nay trang đã gửi quá nhiều email xác nhận. Thử lại vào ngày mai.' });
  }
  if ((await redis().scard(keys.subscribers)) >= MAX_SUBSCRIBERS) {
    return send(res, 503, { ok: false, message: 'Danh sách đã đầy. Liên hệ lớp để được hỗ trợ.' });
  }
  const mail = buildConfirmEmail({ siteUrl: siteUrl(), confirmUrl: actionUrl(siteUrl(), subscribeSecret(), 'confirm', email) });
  await mailer().sendMail({ from: fromAddress(), to: email, ...mail });
  send(res, 200, { ok: true, message: 'Đã gửi email xác nhận. Mở hộp thư (cả mục Spam/Quảng cáo) và bấm link để hoàn tất.' });
}

// GET ?action=confirm|unsub&email&t — link trong email. POST ?action=unsub — nút "Huỷ đăng ký" một chạm của Gmail.
async function handleLink(req, res) {
  const { action, t } = req.query;
  const email = normalizeEmail(req.query.email);
  const purpose = action === 'confirm' ? 'confirm' : 'unsub';
  if (!email || !verifyEmailToken(subscribeSecret(), purpose, email, t)) {
    return page(res, 400, 'Link không hợp lệ', 'Link đã bị sửa hoặc không đúng. Thử đăng ký lại từ trang chủ.');
  }
  if (action === 'confirm') {
    await redis().sadd(keys.subscribers, email);
    return page(res, 200, 'Đăng ký thành công', `Từ giờ ${email} sẽ nhận email mỗi khi trang lớp có bài mới.`);
  }
  await redis().srem(keys.subscribers, email);
  if (req.method === 'POST') return send(res, 200, { ok: true });
  page(res, 200, 'Đã huỷ nhận email', `${email} sẽ không nhận email bài mới nữa.`);
}

export default handler(async (req, res) => {
  const { action } = req.query;
  if (req.method === 'GET' && (action === 'confirm' || action === 'unsub')) return handleLink(req, res);
  if (req.method === 'POST' && action === 'unsub') return handleLink(req, res);
  if (req.method === 'POST') return requestSubscribe(req, res);
  send(res, 405, { ok: false, message: 'Method not allowed' });
});
