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

  // Lịch kiểm tra do /api/sinhvien trả về, chỉ khi MSSV có trong danh sách lớp (danh sách ở api/_lib/exams.js).
  let exams = [];

  const vnMonth = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit' }).format(new Date()).slice(0, 7);
  const shiftMonth = (ym, d) => {
    const [y, m] = ym.split('-').map(Number);
    const t = new Date(Date.UTC(y, m - 1 + d, 1));
    return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, '0')}`;
  };
  const monthText = (ym) => `Tháng ${Number(ym.slice(5))}/${ym.slice(0, 4)}`;
  const dayText = (d) => new Date(`${d}T00:00:00`).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' });
  const timeText = (ms) => new Date(ms).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' });

  const vnToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date());
  const DAY_MS = 86_400_000;
  const daysUntil = (d) => Math.round((Date.parse(`${d}T00:00:00Z`) - Date.parse(`${vnToday()}T00:00:00Z`)) / DAY_MS);
  const whenText = (d) => {
    const n = daysUntil(d);
    return n === 0 ? 'Hôm nay' : n === 1 ? 'Ngày mai' : `Còn ${n} ngày`;
  };
  const weekdayText = (d) => new Date(`${d}T00:00:00`).toLocaleDateString('vi-VN', { weekday: 'long' });
  const upcomingExams = () => exams.filter((e) => daysUntil(e.date) >= 0);

  // Link ôn tập: bài con (trong assets/posts.js) của các trang trong exam.review; đề ôn kiểm tra lên đầu.
  function reviewLinks(exam) {
    const posts = window.CT_POSTS ?? [];
    const pages = new Set(exam.review ?? []);
    return posts.filter((p) => pages.has(p.parent) && p.href.startsWith('/'))
      .map((p) => ({ p, rank: /kiểm tra/i.test(p.title) ? 0 : p.section === 'ontap' ? 1 : 2 }))
      .sort((a, b) => a.rank - b.rank || (a.p.order ?? 99) - (b.p.order ?? 99) || a.p.title.localeCompare(b.p.title, 'vi'))
      .map(({ p }) => h('a', { class: 'sv-review-link', href: p.href, 'data-kind': /kiểm tra/i.test(p.title) ? 'exam' : p.section }, p.title));
  }

  function renderExams() {
    const list = upcomingExams();
    $('examBox').hidden = !list.length;
    $('examList').replaceChildren(...list.map((e) => h('li', { class: 'sv-exam', 'data-soon': daysUntil(e.date) <= 2 ? '1' : '0' },
      h('time', { class: 'sv-exam-date', datetime: e.date },
        h('b', {}, `${e.date.slice(8)}/${e.date.slice(5, 7)}`), h('span', {}, weekdayText(e.date))),
      h('span', { class: 'sv-exam-what' }, h('b', {}, e.subject), h('span', {}, e.kind)),
      h('span', { class: 'sv-exam-left' }, whenText(e.date)),
      (() => {
        const links = reviewLinks(e);
        return links.length ? h('details', { class: 'sv-review' }, h('summary', {}, `Ôn tập ${e.subject} (${links.length} bài)`), h('div', { class: 'sv-review-links' }, ...links)) : null;
      })())));
  }

  let mssv = store.get(STORE_MSSV) || '';
  let month = vnMonth();
  let loading = 0;

  function showForm(msg = '') {
    $('report').hidden = true;
    exams = [];
    renderExams();
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
    exams = Array.isArray(r.exams) ? r.exams : [];
    renderExams();
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
      h('small', {}, e.time ? (e.manual ? 'Cán bộ lớp ghi' : timeText(e.time)) : ''))));
    const exam = upcomingExams().find((e) => e.subject === g.name);
    return h('article', { class: 'sv-subject' },
      h('div', { class: 'sv-head' }, h('h3', {}, g.name), streak),
      exam ? h('p', { class: 'sv-exam-tag' }, `${exam.kind} · ${weekdayText(exam.date)} ${dayText(exam.date).split(', ').pop()} · ${whenText(exam.date).toLowerCase()}`) : null,
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
