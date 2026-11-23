/* Cổng sinh viên: nhập MSSV → xem điểm danh từng môn theo tháng (gọi /api/sinhvien).
   MSSV nhớ chung với trang Điểm danh (localStorage dd.mssv). Mọi dữ liệu chèn bằng textContent. */
(() => {
  'use strict';

  const STORE_MSSV = 'dd.mssv';
  const $ = (id) => document.getElementById(id);
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* chế độ riêng tư: bỏ qua */ } },
    del(k) { try { localStorage.removeItem(k); } catch { /* bỏ qua */ } },
  };

  function h(tag, attrs = {}, ...children) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') el.className = v;
      else el.setAttribute(k, v);
    }
    for (const c of children.flat()) if (c !== null && c !== undefined) el.append(c);
    return el;
  }

  const STATES = {
    ok: 'Đúng giờ',
    late: 'Trễ',
    P: 'Vắng có phép',
    K: 'Vắng không phép',
    open: 'Đang mở điểm danh',
  };

  const TILES = { ok: 'Đúng giờ', late: 'Trễ', P: 'Có phép', K: 'Không phép' };

  const vnMonth = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit' }).format(new Date()).slice(0, 7);
  const shiftMonth = (ym, d) => {
    const [y, m] = ym.split('-').map(Number);
    const t = new Date(Date.UTC(y, m - 1 + d, 1));
    return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, '0')}`;
  };
  const monthText = (ym) => `Tháng ${Number(ym.slice(5))}/${ym.slice(0, 4)}`;
  const dayText = (d) => new Date(`${d}T00:00:00`).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' });
  const timeText = (ms) => new Date(ms).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' });

  let mssv = store.get(STORE_MSSV) || '';
  let month = vnMonth();
  let loading = 0;

  function showForm(msg = '') {
    $('report').hidden = true;
    $('mssvForm').hidden = false;
    $('mssvMsg').textContent = msg;
    $('mssvInput').value = mssv;
    $('mssvInput').focus();
  }

  async function load() {
    const ticket = ++loading;
    $('reportMsg').textContent = 'Đang tải…';
    $('prevBtn').disabled = true; $('nextBtn').disabled = true;
    let r;
    try {
      const res = await fetch(`/api/sinhvien?mssv=${encodeURIComponent(mssv)}&month=${month}`);
      r = await res.json();
    } catch {
      r = { ok: false, message: 'Mạng không ổn định. Hãy thử lại.' };
    }
    if (ticket !== loading) return;
    $('prevBtn').disabled = false;
    $('nextBtn').disabled = month >= vnMonth();
    if (!r.ok) {
      if ($('report').hidden || /MSSV/.test(r.message || '')) return showForm(r.message);
      $('reportMsg').textContent = r.message || 'Không tải được.';
      return;
    }
    store.set(STORE_MSSV, mssv);
    render(r);
  }

  function render(r) {
    $('mssvForm').hidden = true;
    $('report').hidden = false;
    $('whoName').textContent = r.alias || 'Sinh viên';
    $('whoMssv').textContent = `MSSV ${mssv}`;
    $('monthLabel').textContent = monthText(r.month);

    const t = r.total;
    $('totalBox').replaceChildren(...[['ok', t.ok], ['late', t.late], ['P', t.P], ['K', t.K]].map(([s, n]) =>
      h('div', { class: 'sv-tile', 'data-s': s }, h('b', {}, String(n)), h('span', {}, TILES[s]))));
    $('reportMsg').textContent = r.subjects.length ? '' : 'Tháng này chưa có buổi điểm danh nào.';
    $('subjectList').replaceChildren(...r.subjects.map(subjectCard));
  }

  function subjectCard(g) {
    const done = g.ok + g.late + g.P + g.K;
    const streak = h('span', { class: 'sv-streak' }, g.streak > 0 ? `Chuỗi đúng giờ hiện tại: ${g.streak} buổi` : 'Chưa có chuỗi');
    if (!g.streak) streak.dataset.zero = '1';
    const counts = h('div', { class: 'sv-counts' },
      h('span', { class: 'sv-chip' }, `${done} buổi`),
      ...['ok', 'late', 'P', 'K'].filter((s) => g[s]).map((s) =>
        h('span', { class: 'sv-chip', 'data-s': s }, h('b', {}, String(g[s])), ` ${STATES[s].toLowerCase()}`)));
    // Cũ → mới, trái sang phải.
    const ordered = [...g.entries].reverse();
    const dots = h('div', { class: 'sv-dots', role: 'img', 'aria-label': ordered.map((e) => `${dayText(e.date)}: ${STATES[e.state]}`).join('; ') },
      ...ordered.map((e) => h('span', { class: 'sv-dot', 'data-s': e.state, title: `${dayText(e.date)} · ${STATES[e.state]}` })));
    const rows = h('ul', { class: 'sv-rows' }, ...g.entries.map((e) => h('li', {},
      h('span', { class: 'sv-dot', 'data-s': e.state }),
      h('span', {}, h('time', { datetime: e.date }, dayText(e.date)), ` · ${STATES[e.state]}`),
      h('small', {}, e.time ? (e.manual ? 'thầy ghi' : timeText(e.time)) : ''))));
    return h('article', { class: 'sv-subject' },
      h('div', { class: 'sv-head' }, h('h3', {}, g.name), streak),
      counts, dots,
      h('details', { class: 'sv-more' }, h('summary', {}, 'Xem từng buổi'), rows));
  }

  $('mssvForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = $('mssvInput').value.replace(/\D/g, '');
    if (!/^\d{6,12}$/.test(v)) { $('mssvMsg').textContent = 'MSSV gồm 6–12 chữ số.'; return; }
    mssv = v;
    month = vnMonth();
    $('mssvMsg').textContent = 'Đang tải…';
    load();
  });
  $('changeBtn').addEventListener('click', () => { store.del(STORE_MSSV); mssv = ''; showForm(); });
  $('prevBtn').addEventListener('click', () => { month = shiftMonth(month, -1); load(); });
  $('nextBtn').addEventListener('click', () => { if (month < vnMonth()) { month = shiftMonth(month, 1); load(); } });

  if (mssv) { $('report').hidden = false; $('whoMssv').textContent = `MSSV ${mssv}`; $('monthLabel').textContent = monthText(month); load(); }
  else showForm();
})();
