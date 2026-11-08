import { createHmac, timingSafeEqual } from 'node:crypto';
import vm from 'node:vm';

// Logic thuần cho tính năng "Nhận bài mới qua email" — không đụng Redis/SMTP để test được.

const EMAIL_RE = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[a-z]{2,}$/i;
const MAX_EMAIL_LEN = 254;

export function normalizeEmail(raw) {
  const e = String(raw ?? '').trim().toLowerCase();
  return e.length <= MAX_EMAIL_LEN && EMAIL_RE.test(e) ? e : null;
}

const sign = (secret, purpose, email) =>
  createHmac('sha256', secret).update(`sub:${purpose}:${email}`).digest('base64url').slice(0, 24);

// purpose: "confirm" (link xác nhận đăng ký) | "unsub" (link huỷ trong mỗi email).
export function makeEmailToken(secret, purpose, email) {
  return sign(secret, purpose, email);
}

export function verifyEmailToken(secret, purpose, email, token) {
  if (typeof token !== 'string' || !email) return false;
  const a = Buffer.from(sign(secret, purpose, email));
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function actionUrl(siteUrl, secret, action, email) {
  const purpose = action === 'confirm' ? 'confirm' : 'unsub';
  const q = new URLSearchParams({ action, email, t: makeEmailToken(secret, purpose, email) });
  return `${siteUrl}/api/subscribe?${q}`;
}

// assets/posts.js là script trình duyệt gán window.CT_POSTS — chạy trong sandbox để lấy mảng bài.
export function parsePosts(source) {
  const sandbox = { window: {} };
  vm.runInNewContext(source, sandbox, { timeout: 1000 });
  const list = sandbox.window.CT_POSTS;
  if (!Array.isArray(list)) throw new Error('posts.js không có window.CT_POSTS');
  return JSON.parse(JSON.stringify(list));
}

const SECTION_LABELS = {
  ontap: 'Ôn tập', duan: 'Dự án', hoctap: 'Học tập',
  hoatdong: 'Hoạt động', event: 'Bài viết',
};

// Bài được báo = bài lên bảng "Bài mới" ở trang chủ.
// Gắn thêm "subject" (tên môn = tiêu đề trang cha, vd. Lý Thuyết Mạch) và "category" (vd. "Ôn tập · Lý Thuyết Mạch").
export function notifiablePosts(posts) {
  const titleByHref = new Map(posts.filter((p) => p && p.href).map((p) => [p.href, p.title]));
  return posts
    .filter((p) => p && p.href && p.title && !p.hideFromNews)
    .map((p) => {
      const subject = (p.parent && titleByHref.get(p.parent)) || undefined;
      const section = SECTION_LABELS[p.section];
      const category = [section, subject].filter(Boolean).join(' · ') || undefined;
      return { ...p, subject, category };
    });
}

export function pickNewPosts(posts, notifiedHrefs) {
  const seen = new Set(notifiedHrefs);
  return notifiablePosts(posts)
    .filter((p) => !seen.has(p.href))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function absoluteHref(siteUrl, href) {
  return /^https?:\/\//.test(href) ? href : `${siteUrl}${href.startsWith('/') ? '' : '/'}${href}`;
}

const escapeHtml = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function formatDate(iso) {
  const p = String(iso ?? '').split('-');
  return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : String(iso ?? '');
}

const SITE_NAME = 'DDT26C Cao Thắng';

function shell(bodyHtml, footerHtml) {
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0;background:#EDF0F0;font-family:Arial,Helvetica,sans-serif;color:#14202B">
<div style="max-width:560px;margin:0 auto;padding:24px 16px">
<div style="background:#fff;border:1px solid #D2DADE;border-radius:10px;padding:22px 22px 8px">
<p style="margin:0 0 14px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#5F6E79">${SITE_NAME}</p>
${bodyHtml}
</div>
<p style="font-size:12px;color:#5F6E79;line-height:1.5;margin:14px 4px 0">${footerHtml}</p>
</div></body></html>`;
}

export function buildPostsEmail(posts, { siteUrl, unsubUrl }) {
  const first = posts[0];
  const tag = first.subject ? ` [${first.subject}]` : '';
  const subject = posts.length === 1 ? `Bài mới${tag}: ${first.title}` : `${posts.length} bài mới trên trang lớp ${SITE_NAME}`;
  const items = posts
    .map((p) => {
      const url = absoluteHref(siteUrl, p.href);
      const desc = p.desc ? `<p style="margin:4px 0 0;font-size:14px;color:#51626F">${escapeHtml(p.desc)}</p>` : '';
      const cat = p.category
        ? `<p style="margin:0 0 4px;font-size:12px;font-weight:bold;letter-spacing:.04em;text-transform:uppercase;color:#3A7D6B">${escapeHtml(p.category)}</p>`
        : '';
      return `<div style="border-top:1px solid #D2DADE;padding:14px 0">${cat}
<a href="${escapeHtml(url)}" style="font-size:17px;font-weight:bold;color:#2F6690;text-decoration:none">${escapeHtml(p.title)}</a>${desc}
<p style="margin:6px 0 0;font-size:12px;color:#5F6E79">${escapeHtml(formatDate(p.date))}</p></div>`;
    })
    .join('');
  const html = shell(
    `<h1 style="font-size:20px;margin:0 0 12px">${posts.length === 1 ? 'Có bài mới' : `Có ${posts.length} bài mới`}</h1>${items}`,
    `Bạn nhận email này vì đã đăng ký nhận bài mới tại <a href="${escapeHtml(siteUrl)}" style="color:#51626F">${escapeHtml(siteUrl)}</a>.<br><a href="${escapeHtml(unsubUrl)}" style="color:#51626F">Huỷ nhận email</a>`
  );
  const text = [
    posts.length === 1 ? 'Có bài mới:' : `Có ${posts.length} bài mới:`,
    '',
    ...posts.map((p) => `- ${p.category ? `[${p.category}] ` : ''}${p.title} (${formatDate(p.date)})\n  ${absoluteHref(siteUrl, p.href)}`),
    '',
    `Huỷ nhận email: ${unsubUrl}`,
  ].join('\n');
  return { subject, html, text };
}

export function buildConfirmEmail({ siteUrl, confirmUrl }) {
  const subject = `Xác nhận nhận bài mới từ ${SITE_NAME}`;
  const html = shell(
    `<h1 style="font-size:20px;margin:0 0 12px">Xác nhận đăng ký</h1>
<p style="font-size:14px;margin:0 0 18px">Bấm nút dưới đây để nhận email mỗi khi trang lớp có bài mới.</p>
<p style="margin:0 0 18px"><a href="${escapeHtml(confirmUrl)}" style="display:inline-block;background:#2F6690;color:#fff;text-decoration:none;padding:11px 18px;border-radius:7px;font-weight:bold">Xác nhận đăng ký</a></p>`,
    `Nếu bạn không đăng ký tại ${escapeHtml(siteUrl)}, cứ bỏ qua email này.`
  );
  const text = `Bấm link sau để xác nhận nhận bài mới từ ${SITE_NAME}:\n${confirmUrl}\n\nNếu bạn không đăng ký, cứ bỏ qua email này.`;
  return { subject, html, text };
}

// Trang HTML ngắn hiển thị sau khi bấm link xác nhận / huỷ trong email.
export function resultPage(title, message, siteUrl) {
  return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title><link rel="stylesheet" href="/assets/site.css"></head>
<body><div class="wrap"><header><h1>${escapeHtml(title)}</h1></header>
<p>${escapeHtml(message)}</p><p><a href="${escapeHtml(siteUrl)}/">← Về trang chủ</a></p></div></body></html>`;
}
