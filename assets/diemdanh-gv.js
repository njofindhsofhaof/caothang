(() => {
  'use strict';

  const PIN_KEY = 'dd.pin';
  const POLL_MS = 5_000;
  const IDLE_POLL_MS = 30_000;
  const GPS_TIMEOUT_MS = 15_000;
  const QUICK_MINUTES = 15;
  const STUDENT_URL = `${location.origin}/diemdanh`;

  const $ = (id) => document.getElementById(id);
  const pin = {
    get() { try { return sessionStorage.getItem(PIN_KEY) || ''; } catch { return ''; } },
    set(v) { try { sessionStorage.setItem(PIN_KEY, v); } catch { /* bỏ qua */ } },
  };

  // Tạo phần tử DOM an toàn (chỉ textContent, không innerHTML với dữ liệu).
  function h(tag, attrs = {}, ...children) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') el.className = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v);
    }
    for (const c of children.flat()) if (c !== null && c !== undefined) el.append(c);
    return el;
  }

  async function api(path, { method = 'GET', body } = {}) {
    const res = await fetch(path, {
      method,
      headers: { 'x-teacher-pin': pin.get(), ...(body ? { 'Content-Type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    let data;
    try { data = await res.json(); } catch { data = { ok: false, message: 'Máy chủ không phản hồi.' }; }
    if (res.status === 401) showLogin(data.message);
    return data;
  }

  const pad = (n) => String(n).padStart(2, '0');
  const fmtTime = (ms) => new Date(ms).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const fmtDay = (ms) => new Date(ms).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' });
  const fullName = (s) => `${s.ho} ${s.ten}`.trim();
  const byStt = (a, b) => a.stt - b.stt;

  function getPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error('Trình duyệt không hỗ trợ định vị.'));
      navigator.geolocation.getCurrentPosition(
        (p) => resolve(p.coords),
        (err) => reject(new Error(err.code === 1 ? 'Hãy cho phép trang dùng vị trí của máy.' : 'Không lấy được vị trí. Bật GPS / Wi-Fi rồi thử lại.')),
        { enableHighAccuracy: true, timeout: GPS_TIMEOUT_MS, maximumAge: 0 },
      );
    });
  }

  function drawQr(box, text) {
    const qr = window.qrcode(0, 'M');
    qr.addData(text);
    qr.make();
    // SVG do thư viện sinh từ URL của chính site — không chứa dữ liệu người dùng.
    box.innerHTML = qr.createSvgTag({ cellSize: 8, margin: 2, scalable: true });
  }

  let roster = [];
  let places = [];

  /* ---------- Đăng nhập ---------- */
  function showLogin(msg = '') {
    $('app').hidden = true;
    $('loginForm').hidden = false;
    $('loginMsg').textContent = msg;
    stopLive();
  }

  $('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    pin.set($('pinInput').value.trim());
    await start();
  });

  async function start() {
    const r = await api('/api/roster');
    if (!r.ok) return;
    roster = r.roster.sort(byStt);
    $('loginForm').hidden = true;
    $('app').hidden = false;
    renderRosterInfo();
    initPlanForm();
    await loadPlaces();
    route();
  }

  function renderRosterInfo() {
    $('rosterInfo').textContent = roster.length ? `CĐ Đ, ĐT 26C · ${roster.length} sinh viên` : 'Chưa có danh sách lớp';
  }

  /* ---------- Tabs ---------- */
  function route() {
    const tab = location.hash.slice(1) || (roster.length ? 'phien' : 'lop');
    for (const a of document.querySelectorAll('[data-tab]')) {
      if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    }
    for (const p of document.querySelectorAll('[data-panel]')) p.hidden = p.dataset.panel !== tab;
    if (tab === 'phien') refreshLive(); else stopLive();
    if (tab === 'thang') loadMonth();
    if (tab === 'lop') renderRosterTable();
  }
  window.addEventListener('hashchange', route);

  /* ---------- Phòng đã lưu ---------- */
  async function loadPlaces() {
    const r = await api('/api/places');
    places = r.ok ? r.places : [];
    const keep = $('placeSelect').value;
    $('placeSelect').replaceChildren(
      ...places.map((p) => h('option', { value: p.id }, p.name)),
      h('option', { value: '' }, 'Vị trí hiện tại của máy thầy'),
    );
    if (keep && places.some((p) => p.id === keep)) $('placeSelect').value = keep;
    $('placeList').replaceChildren(...(places.length ? places.map((p) => h('li', {},
      h('span', { class: 'who' }, h('b', {}, p.name), h('small', {}, p.accuracy ? `sai số khi lưu ±${p.accuracy} m` : '')),
      h('button', { class: 'gv-mini', type: 'button', onclick: () => deletePlace(p) }, 'Xoá'),
    )) : [h('li', {}, h('span', { class: 'gv-note' }, 'Chưa lưu phòng nào.'))]));
  }

  $('placeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    $('placeMsg').textContent = 'Đang lấy vị trí…';
    try {
      const c = await getPosition();
      const r = await api('/api/places', { method: 'POST', body: { name: $('placeName').value, lat: c.latitude, lng: c.longitude, accuracy: c.accuracy } });
      if (!r.ok) throw new Error(r.message);
      $('placeName').value = '';
      $('placeMsg').textContent = c.accuracy > 100 ? `Đã lưu, nhưng sai số ${Math.round(c.accuracy)} m — nên lưu lại khi GPS ổn định hơn.` : 'Đã lưu.';
      await loadPlaces();
      $('placeSelect').value = r.id;
    } catch (err) {
      $('placeMsg').textContent = err.message;
    }
  });

  async function deletePlace(p) {
    if (!confirm(`Xoá phòng "${p.name}"? Các lịch đã đặt vẫn giữ vị trí cũ.`)) return;
    await api(`/api/places?id=${encodeURIComponent(p.id)}`, { method: 'DELETE' });
    loadPlaces();
  }

  /* ---------- Đặt lịch ---------- */
  function initPlanForm() {
    const now = new Date();
    $('dateInput').value = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    $('fromInput').value = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const later = new Date(now.getTime() + QUICK_MINUTES * 60_000);
    $('toInput').value = `${pad(later.getHours())}:${pad(later.getMinutes())}`;
    $('shareUrl').textContent = STUDENT_URL;
    drawQr($('shareQr'), STUDENT_URL);
  }

  $('copyBtn').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(STUDENT_URL); $('copyBtn').textContent = 'Đã sao chép'; } catch { prompt('Sao chép link:', STUDENT_URL); }
    setTimeout(() => { $('copyBtn').textContent = 'Sao chép link'; }, 2000);
  });

  // Giờ nhập trên máy thầy (giờ Việt Nam) → mốc thời gian.
  const toMs = (date, time) => new Date(`${date}T${time}:00`).getTime();

  async function placeBody() {
    const placeId = $('placeSelect').value;
    if (placeId) return { placeId };
    $('openMsg').textContent = 'Đang lấy vị trí máy thầy…';
    const c = await getPosition();
    return { lat: c.latitude, lng: c.longitude };
  }

  async function createSessions(times, repeatWeeks) {
    if (!roster.length) { $('openMsg').textContent = 'Hãy tải danh sách lớp trước (tab Danh sách lớp).'; return; }
    $('planBtn').disabled = true; $('nowBtn').disabled = true;
    try {
      const r = await api('/api/session', {
        method: 'POST',
        body: {
          ...(await placeBody()), ...times, repeatWeeks,
          label: $('labelInput').value, radius: Number($('radiusInput').value), requireQr: $('qrInput').checked,
        },
      });
      if (!r.ok) throw new Error(r.message);
      const first = r.sessions[0];
      $('openMsg').textContent = r.sessions.length > 1
        ? `Đã đặt ${r.sessions.length} buổi, bắt đầu ${fmtDay(first.startsAt)} ${fmtTime(first.startsAt)}–${fmtTime(first.expiresAt)}.`
        : `Đã đặt: ${fmtDay(first.startsAt)} ${fmtTime(first.startsAt)}–${fmtTime(first.expiresAt)}.`;
      await refreshLive();
    } catch (err) {
      $('openMsg').textContent = err.message;
    } finally {
      $('planBtn').disabled = false; $('nowBtn').disabled = false;
    }
  }

  $('openForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const date = $('dateInput').value;
    const startsAt = toMs(date, $('fromInput').value);
    const endsAt = toMs(date, $('toInput').value);
    createSessions({ startsAt, endsAt }, Number($('repeatInput').value));
  });

  $('nowBtn').addEventListener('click', () => {
    const now = Date.now();
    createSessions({ startsAt: now, endsAt: now + QUICK_MINUTES * 60_000 }, 1);
  });

  async function deleteSession(s) {
    if (!confirm(`Xoá lịch ${fmtDay(s.startsAt)} ${fmtTime(s.startsAt)}?`)) return;
    const r = await api(`/api/session?id=${encodeURIComponent(s.id)}`, { method: 'DELETE' });
    if (!r.ok) alert(r.message);
    refreshLive();
  }

  function renderUpcoming(list) {
    $('upcomingList').replaceChildren(...(list.length ? list.slice(0, 20).map((s) => h('li', {},
      h('span', { class: 'who' },
        h('b', {}, s.label || 'Buổi học'),
        h('small', {}, `${fmtDay(s.startsAt)} · ${fmtTime(s.startsAt)}–${fmtTime(s.expiresAt)} · ${s.placeName}${s.requireQr ? ' · QR' : ''}`)),
      h('button', { class: 'gv-mini', type: 'button', onclick: () => deleteSession(s) }, 'Xoá'),
    )) : [h('li', {}, h('span', { class: 'gv-note' }, 'Chưa có lịch nào.'))]));
  }

  /* ---------- Buổi đang mở ---------- */
  let pollTimer = null;
  let lastToken = '';

  function stopLive() { clearTimeout(pollTimer); pollTimer = null; }

  async function refreshLive() {
    stopLive();
    let r;
    try { r = await api('/api/session'); } catch { r = { ok: false }; }
    if (!r.ok) { pollTimer = setTimeout(refreshLive, POLL_MS); return; }
    renderUpcoming(r.upcoming);
    const s = r.active;
    $('livePanel').hidden = !s;
    if (!s) {
      lastToken = '';
      // Không có buổi đang mở: hỏi lại khi buổi kế tiếp sắp bắt đầu.
      const next = r.upcoming[0];
      const wait = next ? Math.min(IDLE_POLL_MS, Math.max(1000, next.startsAt - r.now + 500)) : IDLE_POLL_MS;
      pollTimer = setTimeout(refreshLive, wait);
      return;
    }
    renderLive(s, r.records);
    $('qrWrap').hidden = !s.requireQr;
    $('fullBtn').hidden = !s.requireQr;
    $('stage').classList.toggle('no-qr', !s.requireQr);
    $('qrBtn').textContent = s.requireQr ? 'Tắt QR (cho tự điểm danh)' : 'Chiếu QR tại lớp';
    let delay = POLL_MS;
    if (s.requireQr) {
      renderQr(s.id, r.token, r.nextInMs);
      // Lấy token mới ngay khi khung 10 giây đổi; giữa chừng cập nhật danh sách.
      delay = r.nextInMs > POLL_MS ? r.nextInMs - POLL_MS : r.nextInMs + 150;
    }
    pollTimer = setTimeout(refreshLive, Math.min(delay, Math.max(500, s.expiresAt - r.now + 500)));
  }

  function renderQr(sessionId, token, nextInMs) {
    if (token === lastToken) return;
    lastToken = token;
    drawQr($('qrBox'), `${STUDENT_URL}?s=${encodeURIComponent(sessionId)}&t=${encodeURIComponent(token)}`);
    const bar = $('tickBar');
    bar.classList.remove('run');
    void bar.offsetWidth; // khởi động lại animation
    bar.style.animationDuration = `${nextInMs}ms`;
    bar.classList.add('run');
  }

  let liveSession = null;

  function renderLive(session, records) {
    liveSession = session;
    const present = new Map(records.map((x) => [x.mssv, x]));
    $('countNow').textContent = String(present.size);
    $('countTotal').textContent = String(roster.length);
    $('sessionMeta').textContent = `${session.label || 'Buổi học'} · ${session.placeName} · bán kính ${session.radius} m`;
    $('countdown').textContent = `${fmtTime(session.startsAt)}–${fmtTime(session.expiresAt)} · còn ${Math.max(0, Math.ceil((session.expiresAt - Date.now()) / 60_000))} phút`;

    const absent = roster.filter((s) => !present.has(s.mssv));
    $('absentCount').textContent = String(absent.length);
    $('absentList').replaceChildren(...absent.map((s) => h('li', {},
      h('span', { class: 'who' }, h('b', {}, fullName(s)), h('small', {}, s.mssv)),
      h('button', { class: 'gv-mini', type: 'button', onclick: () => markPresent(session.id, s.mssv) }, 'Có mặt'),
    )));
    const presentRows = roster.filter((s) => present.has(s.mssv))
      .sort((a, b) => present.get(b.mssv).time - present.get(a.mssv).time);
    $('presentList').replaceChildren(...presentRows.map((s) => {
      const rec = present.get(s.mssv);
      return h('li', {},
        h('span', { class: 'who' }, h('b', {}, fullName(s)), h('small', {}, s.mssv)),
        h('span', { class: 'tag' }, rec.manual ? `${fmtTime(rec.time)} · tay` : `${fmtTime(rec.time)} · ${rec.distance} m`),
      );
    }));
  }

  async function patchLive(action, value) {
    if (!liveSession) return;
    const r = await api('/api/session', { method: 'PATCH', body: { id: liveSession.id, action, value } });
    if (!r.ok) alert(r.message);
    refreshLive();
  }

  $('qrBtn').addEventListener('click', () => patchLive('qr', !liveSession?.requireQr));
  $('extendBtn').addEventListener('click', () => patchLive('extend'));
  $('closeBtn').addEventListener('click', () => {
    if (!confirm('Đóng điểm danh ngay? Sinh viên sẽ không điểm danh được nữa.')) return;
    if (document.fullscreenElement) document.exitFullscreen();
    patchLive('close');
  });
  $('fullBtn').addEventListener('click', () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else $('stage').requestFullscreen?.();
  });

  async function markPresent(sessionId, mssv) {
    const r = await api('/api/attendance', { method: 'POST', body: { action: 'present', sessionId, mssv } });
    if (!r.ok) alert(r.message);
    refreshLive();
  }

  /* ---------- Bảng tháng ---------- */
  let monthData = null;

  const today = new Date();
  $('monthInput').value = `${today.getFullYear()}-${pad(today.getMonth() + 1)}`;
  $('monthInput').addEventListener('change', loadMonth);

  async function loadMonth() {
    const ym = $('monthInput').value;
    if (!ym) return;
    const r = await api(`/api/attendance?month=${ym}`);
    if (!r.ok) { $('exportMsg').textContent = r.message; return; }
    monthData = r;
    renderMonth();
  }

  // Trạng thái theo ngày: 'ok' (có mặt ở ít nhất 1 buổi) | 'P' | 'K'
  function dayStatus(date) {
    const sessions = monthData.sessions.filter((s) => s.date === date);
    const present = new Set(sessions.flatMap((s) => s.records.map((x) => x.mssv)));
    const excuses = monthData.excuses[date] ?? {};
    return (mssv) => (present.has(mssv) ? 'ok' : (excuses[mssv] === 'P' ? 'P' : 'K'));
  }

  const classDates = () => [...new Set(monthData.sessions.map((s) => s.date))].sort();

  function renderMonth() {
    const dates = classDates();
    const table = $('monthTable');
    if (!dates.length) {
      table.replaceChildren(h('tbody', {}, h('tr', {}, h('td', {}, 'Tháng này chưa có buổi điểm danh nào.'))));
      return;
    }
    const status = Object.fromEntries(dates.map((d) => [d, dayStatus(d)]));
    const head = h('thead', {}, h('tr', {},
      h('th', { class: 'name' }, 'Sinh viên'),
      dates.map((d) => h('th', { title: d }, d.slice(8))),
      h('th', {}, 'P'), h('th', {}, 'K'),
    ));
    const body = h('tbody', {}, roster.map((s) => {
      let p = 0; let k = 0;
      const cells = dates.map((d) => {
        const st = status[d](s.mssv);
        if (st === 'P') p += 1;
        if (st === 'K') k += 1;
        const label = st === 'ok' ? '✓' : st;
        return h('td', {}, h('button', {
          class: `gv-cell ${st.toLowerCase()}`, type: 'button', 'aria-label': `${fullName(s)} ngày ${d}: ${label}`,
          onclick: () => cycleCell(s.mssv, d, st),
        }, label));
      });
      return h('tr', {},
        h('td', { class: 'name' }, `${s.stt}. ${fullName(s)}`),
        cells,
        h('td', { class: 'mono' }, p ? String(p) : ''),
        h('td', { class: 'mono' }, k ? String(k) : ''),
      );
    }));
    table.replaceChildren(head, body);
  }

  // K → P → ✓ (đánh dấu tay) → K
  async function cycleCell(mssv, date, st) {
    const sessions = monthData.sessions.filter((s) => s.date === date);
    let calls;
    if (st === 'K') calls = [{ action: 'excuse', mssv, date, value: 'P' }];
    else if (st === 'P') calls = [{ action: 'excuse', mssv, date, value: '' }, { action: 'present', mssv, sessionId: sessions.at(-1).id }];
    else calls = sessions.filter((s) => s.records.some((x) => x.mssv === mssv)).map((s) => ({ action: 'unpresent', mssv, sessionId: s.id }));
    for (const body of calls) {
      const r = await api('/api/attendance', { method: 'POST', body });
      if (!r.ok) { alert(r.message); break; }
    }
    loadMonth();
  }

  $('exportBtn').addEventListener('click', async () => {
    const file = $('templateInput').files[0];
    if (!file) { $('exportMsg').textContent = 'Hãy chọn file mẫu gốc (.xlsx) trước.'; return; }
    if (!monthData) await loadMonth();
    $('exportMsg').textContent = 'Đang tạo file…';
    try {
      const marks = {};
      for (const d of classDates()) {
        const st = dayStatus(d);
        const day = String(Number(d.slice(8)));
        for (const s of roster) {
          const v = st(s.mssv);
          if (v !== 'ok') (marks[s.mssv] ??= {})[day] = v;
        }
      }
      const [y, m] = $('monthInput').value.split('-').map(Number);
      const blob = await window.DDXlsx.fillTemplate(file, marks, { month: m, signDate: new Date() });
      const a = h('a', { href: URL.createObjectURL(blob), download: `DiemDanh_CDDDT26C_T${pad(m)}-${y}.xlsx` });
      document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 10_000);
      $('exportMsg').textContent = 'Đã xuất file.';
    } catch (err) {
      console.error(err);
      $('exportMsg').textContent = `Không xuất được: ${err.message}`;
    }
  });

  /* ---------- Danh sách lớp ---------- */
  $('rosterInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    $('rosterMsg').textContent = 'Đang đọc file…';
    try {
      const list = await window.DDXlsx.readRoster(file);
      if (!confirm(`Đọc được ${list.length} sinh viên. Lưu danh sách này (thay danh sách cũ)?`)) { $('rosterMsg').textContent = ''; return; }
      const r = await api('/api/roster', { method: 'PUT', body: { roster: list } });
      if (!r.ok) throw new Error(r.message);
      const fresh = await api('/api/roster');
      roster = (fresh.roster ?? []).sort(byStt);
      renderRosterInfo();
      renderRosterTable();
      $('rosterMsg').textContent = `Đã lưu ${r.count} sinh viên.`;
    } catch (err) {
      $('rosterMsg').textContent = `Lỗi: ${err.message}`;
    } finally {
      e.target.value = '';
    }
  });

  function renderRosterTable() {
    $('rosterTable').replaceChildren(
      h('thead', {}, h('tr', {}, h('th', {}, 'STT'), h('th', {}, 'MSSV'), h('th', { class: 'name' }, 'Họ tên'))),
      h('tbody', {}, roster.map((s) => h('tr', {}, h('td', { class: 'mono' }, String(s.stt)), h('td', { class: 'mono' }, s.mssv), h('td', { class: 'name' }, fullName(s))))),
    );
  }

  /* ---------- Khởi động ---------- */
  if (pin.get()) start(); else showLogin();
})();
