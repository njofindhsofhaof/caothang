import nodemailer from 'nodemailer';
import { requireSecret } from './http.js';

let transport;

// Gửi qua SMTP (mặc định Gmail + App Password) — không cần tên miền riêng.
export function mailer() {
  if (transport) return transport;
  const port = Number(process.env.SMTP_PORT || 465);
  transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    pool: true,
    maxConnections: 3,
    auth: { user: requireSecret('SMTP_USER'), pass: requireSecret('SMTP_PASS') },
  });
  return transport;
}

export function fromAddress() {
  return process.env.MAIL_FROM || `"DDT26C Cao Thắng" <${requireSecret('SMTP_USER')}>`;
}

export const siteUrl = () => (process.env.SITE_URL || 'https://caothang-gray.vercel.app').replace(/\/+$/, '');

// Khoá ký link xác nhận/huỷ; dùng lại QR_SECRET nếu chưa đặt khoá riêng.
export const subscribeSecret = () => process.env.SUBSCRIBE_SECRET || requireSecret('QR_SECRET');
