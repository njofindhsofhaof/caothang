(() => {
  'use strict';

  // Mốc theo số buổi (môn/ngày) đúng giờ trong tháng.
  const TIERS = [
    { min: 20, icon: '🏆', label: 'Huyền thoại', note: 'từ 20 buổi' },
    { min: 10, icon: '⚡', label: 'Bền bỉ', note: '10–19 buổi' },
    { min: 5, icon: '🔥', label: 'Đang cháy', note: '5–9 buổi' },
    { min: 1, icon: '✨', label: 'Khởi động', note: '1–4 buổi' },
  ];
  const VISIBLE_CHIPS = 24;

  const root = document.getElementById('leaderboard');
  if (!root) return;
  const month = root.dataset.month || '';
  const monthLabel = month ? `tháng ${Number(month.slice(5))}` : 'tháng này';

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  function chip(r) {
    const c = el('li', 'lb-chip');
    c.append(el('span', 'lb-name', r.name), el('span', 'lb-count', String(r.onTime)));
    c.title = `${r.name}: ${r.onTime} buổi đúng giờ`;
    return c;
  }

  function tierBlock(tier, rows) {
    const box = el('section', 'lb-tier');
    box.dataset.min = String(tier.min);
    const head = el('div', 'lb-tier-head');
    head.append(el('span', 'lb-icon', tier.icon), el('h3', null, tier.label), el('span', 'lb-note', `${tier.note} · ${rows.length} bạn`));
    const list = el('ul', 'lb-chips');
    rows.slice(0, VISIBLE_CHIPS).forEach((r) => list.append(chip(r)));
    box.append(head, list);
    if (rows.length > VISIBLE_CHIPS) {
      const more = el('button', 'lb-more', `+ ${rows.length - VISIBLE_CHIPS} bạn khác`);
      more.type = 'button';
      more.addEventListener('click', () => {
        rows.slice(VISIBLE_CHIPS).forEach((r) => list.append(chip(r)));
        more.remove();
      });
      box.append(more);
    }
    return box;
  }

  function render(data) {
    const body = root.querySelector('.lb-body');
    const sub = root.querySelector('.lb-sub');
    if (!data.list.length) {
      sub.textContent = `Chưa có buổi đúng giờ nào trong ${monthLabel}. Bạn sẽ là người đầu tiên?`;
      body.replaceChildren();
      return;
    }
    sub.textContent = `Xếp theo số buổi đi học đúng giờ trong ${monthLabel}. Càng nhiều buổi đúng giờ, rank càng cao.`;
    const blocks = TIERS.map((t, i) => {
      const upper = i ? TIERS[i - 1].min : Infinity;
      return [t, data.list.filter((r) => r.onTime >= t.min && r.onTime < upper)];
    }).filter(([, rows]) => rows.length).map(([t, rows]) => tierBlock(t, rows));
    const when = new Date(data.updatedAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
    body.replaceChildren(...blocks, el('p', 'lb-foot', `Cập nhật ${when} · tính theo từng môn mỗi ngày`));
  }

  fetch(`/api/leaderboard${month ? `?month=${encodeURIComponent(month)}` : ''}`)
    .then((r) => r.json())
    .then((data) => { if (!data.ok) throw new Error(); render(data); })
    .catch(() => { root.querySelector('.lb-sub').textContent = 'Chưa tải được bảng chuyên cần. Thử tải lại trang.'; });
})();
