(() => {
  'use strict';

  const VISIBLE_ROWS = 30;
  const PODIUM = 3;

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

  // Nhiều buổi đúng giờ trước, bằng nhau thì theo tên; bằng số buổi thì cùng hạng, hạng liền nhau (1, 1, 2, 3...).
  function withRanks(list) {
    const sorted = [...list].sort((a, b) => b.onTime - a.onTime || a.name.localeCompare(b.name, 'vi'));
    let rank = 0;
    return sorted.map((r, i) => {
      if (i === 0 || sorted[i - 1].onTime !== r.onTime) rank += 1;
      return { ...r, rank };
    });
  }

  // Màu ô số buổi theo bậc: số cao nhất xanh lá, mỗi số thấp hơn chuyển dần sang xanh dương → vàng → đỏ (số thấp nhất).
  // Trộn RGB giữa các mốc (không đi theo vòng màu, để xanh dương → vàng không vòng qua xanh lá).
  const STOPS = [[30, 158, 87], [47, 111, 214], [227, 180, 22], [214, 64, 58]]; // xanh lá, xanh dương, vàng, đỏ
  function countColor(onTime, levels) {
    const i = levels.indexOf(onTime);
    const t = (levels.length > 1 ? i / (levels.length - 1) : 0) * (STOPS.length - 1);
    const seg = Math.min(STOPS.length - 2, Math.floor(t));
    const [r, g, b] = STOPS[seg].map((v, k) => Math.round(v + (STOPS[seg + 1][k] - v) * (t - seg)));
    const light = 0.299 * r + 0.587 * g + 0.114 * b > 150; // nền sáng (vàng) thì chữ tối
    return { bg: `rgb(${r} ${g} ${b})`, fg: light ? '#2b2100' : '#fff' };
  }

  function row(r, levels) {
    const li = el('li', 'lb-row');
    if (r.rank <= PODIUM) li.dataset.podium = String(r.rank);
    const count = el('span', 'lb-count', `${r.onTime} buổi`);
    const c = countColor(r.onTime, levels);
    count.style.background = c.bg;
    count.style.color = c.fg;
    li.append(el('span', 'lb-rank', String(r.rank)), el('span', 'lb-name', r.name), count);
    li.title = `${r.name}: ${r.onTime} buổi đúng giờ`;
    return li;
  }

  function rankList(rows) {
    const list = el('ol', 'lb-list');
    const levels = [...new Set(rows.map((r) => r.onTime))].sort((a, b) => b - a);
    rows.slice(0, VISIBLE_ROWS).forEach((r) => list.append(row(r, levels)));
    if (rows.length <= VISIBLE_ROWS) return [list];
    const more = el('button', 'lb-more', `+ ${rows.length - VISIBLE_ROWS} bạn khác`);
    more.type = 'button';
    more.addEventListener('click', () => {
      rows.slice(VISIBLE_ROWS).forEach((r) => list.append(row(r, levels)));
      more.remove();
    });
    return [list, more];
  }

  function render(data) {
    const body = root.querySelector('.lb-body');
    const sub = root.querySelector('.lb-sub');
    if (!data.list.length) {
      sub.textContent = `Chưa có buổi đúng giờ nào trong ${monthLabel}. Bạn sẽ là người đầu tiên?`;
      body.replaceChildren();
      return;
    }
    sub.textContent = `Xếp theo số buổi đi học đúng giờ trong ${monthLabel}; bằng nhau thì theo tên.`;
    const blocks = rankList(withRanks(data.list));
    const when = new Date(data.updatedAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
    body.replaceChildren(...blocks, el('p', 'lb-foot', `Cập nhật ${when} · tính theo từng môn mỗi ngày`));
  }

  fetch(`/api/leaderboard${month ? `?month=${encodeURIComponent(month)}` : ''}`)
    .then((r) => r.json())
    .then((data) => { if (!data.ok) throw new Error(); render(data); })
    .catch(() => { root.querySelector('.lb-sub').textContent = 'Chưa tải được bảng chuyên cần. Thử tải lại trang.'; });
})();
