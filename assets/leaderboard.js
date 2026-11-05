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

  function row(r) {
    const li = el('li', 'lb-row');
    if (r.rank <= PODIUM) li.dataset.podium = String(r.rank);
    li.append(el('span', 'lb-rank', String(r.rank)), el('span', 'lb-name', r.name), el('span', 'lb-count', `${r.onTime} buổi`));
    li.title = `${r.name}: ${r.onTime} buổi đúng giờ`;
    return li;
  }

  function rankList(rows) {
    const list = el('ol', 'lb-list');
    rows.slice(0, VISIBLE_ROWS).forEach((r) => list.append(row(r)));
    if (rows.length <= VISIBLE_ROWS) return [list];
    const more = el('button', 'lb-more', `+ ${rows.length - VISIBLE_ROWS} bạn khác`);
    more.type = 'button';
    more.addEventListener('click', () => {
      rows.slice(VISIBLE_ROWS).forEach((r) => list.append(row(r)));
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
