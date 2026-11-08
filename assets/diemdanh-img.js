// Ảnh tổng kết điểm danh một môn trong một ngày (PNG) — để gửi nhóm lớp / báo cáo.
(() => {
  'use strict';

  const W = 1080;
  const PAD = 64;
  const COL_GAP = 32;
  // Ảnh luôn nền sáng, không theo giao diện tối của trang.
  const C = {
    paper: '#FFFFFF', ink: '#14202B', soft: '#51626F', faint: '#5F6E79', line: '#D2DADE',
    ok: '#2E7D4F', okSoft: '#E3F1E8', late: '#9E5A25', lateSoft: '#F3EBDD',
    p: '#2F6690', pSoft: '#E2ECF3', k: '#B5412F', kSoft: '#F7E4E0',
  };
  const SERIF = '"Fraunces", Georgia, serif';
  const SANS = '"IBM Plex Sans", system-ui, sans-serif';
  const MONO = '"IBM Plex Mono", ui-monospace, monospace';
  const HEADER_H = 290;
  const STAT_H = 132;
  const NAME_LINE = 40;
  const SECTION_HEAD = 64;
  const SECTION_GAP = 28;
  const FOOTER_H = 60;

  function fit(ctx, text, maxW) {
    if (ctx.measureText(text).width <= maxW) return text;
    let t = text;
    while (t.length > 1 && ctx.measureText(`${t}…`).width > maxW) t = t.slice(0, -1);
    return `${t}…`;
  }

  const sectionHeight = (items) => SECTION_HEAD + Math.max(1, Math.ceil(items.length / 2)) * NAME_LINE + SECTION_GAP;

  function drawStat(ctx, x, y, w, [label, value, color, soft]) {
    ctx.fillStyle = soft;
    ctx.beginPath(); ctx.roundRect(x, y, w, STAT_H, 14); ctx.fill();
    ctx.fillStyle = color;
    ctx.font = `600 56px ${SERIF}`;
    ctx.fillText(value, x + 24, y + 72);
    ctx.font = `500 22px ${SANS}`;
    ctx.fillText(label, x + 24, y + 110);
  }

  // Danh sách tên chia 2 cột; giờ trễ (nếu có) tô màu ngay sau tên.
  function drawSection(ctx, y, title, items, color) {
    ctx.fillStyle = color;
    ctx.fillRect(PAD, y + 8, 6, 28);
    ctx.font = `600 28px ${SANS}`;
    ctx.fillText(`${title} (${items.length})`, PAD + 20, y + 32);
    ctx.font = `400 25px ${SANS}`;
    if (!items.length) {
      ctx.fillStyle = C.faint;
      ctx.fillText('Không có', PAD + 20, y + SECTION_HEAD + 24);
      return y + sectionHeight(items);
    }
    const colW = (W - PAD * 2 - COL_GAP) / 2;
    const half = Math.ceil(items.length / 2);
    items.forEach((it, i) => {
      const x = PAD + 20 + (i < half ? 0 : colW + COL_GAP);
      const rowY = y + SECTION_HEAD + (i % half) * NAME_LINE + 24;
      const extra = it.time ? ` · ${it.time}` : '';
      const name = fit(ctx, `${it.stt}. ${it.name}`, colW - 40 - ctx.measureText(extra).width);
      ctx.fillStyle = C.ink;
      ctx.fillText(name, x, rowY);
      if (extra) {
        ctx.fillStyle = color;
        ctx.fillText(extra, x + ctx.measureText(name).width, rowY);
      }
    });
    return y + sectionHeight(items);
  }

  /**
   * report: { subject, dateLabel, timeLabel, total, present, late: [{stt,name,time}], P: [{stt,name}], K: [{stt,name}] }
   */
  async function render(report) {
    await Promise.all([`600 56px ${SERIF}`, `400 25px ${SANS}`, `600 28px ${SANS}`, `500 20px ${MONO}`]
      .map((f) => document.fonts?.load(f).catch(() => null)));
    const height = HEADER_H + STAT_H + 56 + sectionHeight(report.K) + sectionHeight(report.P) + sectionHeight(report.late) + FOOTER_H;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = C.paper; ctx.fillRect(0, 0, W, height);
    ctx.fillStyle = C.ink; ctx.fillRect(0, 0, W, 10);

    ctx.fillStyle = C.soft;
    ctx.font = `500 20px ${MONO}`;
    ctx.fillText('ĐIỂM DANH · CĐ Đ, ĐT 26C · CAO THẮNG', PAD, 82);
    ctx.fillStyle = C.ink;
    ctx.font = `600 56px ${SERIF}`;
    ctx.fillText(fit(ctx, report.subject, W - PAD * 2), PAD, 162);
    ctx.fillStyle = C.soft;
    ctx.font = `400 28px ${SANS}`;
    ctx.fillText(`${report.dateLabel} · ${report.timeLabel} · sĩ số ${report.total}`, PAD, 212);
    ctx.fillStyle = C.line; ctx.fillRect(PAD, 252, W - PAD * 2, 2);

    const statW = (W - PAD * 2 - 3 * 20) / 4;
    [
      ['Có mặt', `${report.present}/${report.total}`, C.ok, C.okSoft],
      ['Đi trễ', String(report.late.length), C.late, C.lateSoft],
      ['Vắng có phép', String(report.P.length), C.p, C.pSoft],
      ['Vắng không phép', String(report.K.length), C.k, C.kSoft],
    ].forEach((stat, i) => drawStat(ctx, PAD + i * (statW + 20), HEADER_H, statW, stat));

    let y = HEADER_H + STAT_H + 56;
    y = drawSection(ctx, y, 'Vắng không phép', report.K, C.k);
    y = drawSection(ctx, y, 'Vắng có phép', report.P, C.p);
    drawSection(ctx, y, 'Đi trễ', report.late, C.late);

    ctx.fillStyle = C.faint;
    ctx.font = `500 18px ${MONO}`;
    ctx.fillText(`Xuất lúc ${new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })}`, PAD, height - 28);
    return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Trình duyệt không tạo được ảnh.'))), 'image/png'));
  }

  async function download(report, filename) {
    const blob = await render(report);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 10_000);
  }

  window.DDImage = { render, download };
})();
