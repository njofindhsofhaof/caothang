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
    if (tab === 'thang') { loadMonth(); renderTemplateInfo(); }
    if (tab === 'lop') renderRosterTable();
  }
  window.addEventListener('hashchange', route);

  /* ---------- Phòng đã lưu ---------- */
  async function loadPlaces() {
    const r = await api('/api/places?past=1');
    places = r.ok ? r.places : [];
    renderPast(r.ok ? r.past ?? [] : []);
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

  /* ---------- Vị trí các buổi trước ---------- */
  const fmtCoord = (spot) => `${spot.lat.toFixed(5)}, ${spot.lng.toFixed(5)}`;

  function renderPast(spots) {
    $('pastBlock').hidden = !spots.length;
    $('pastList').replaceChildren(...spots.map((spot) => {
      const li = h('li', {},
        h('span', { class: 'who' },
          h('b', {}, spot.label || fmtCoord(spot)),
          h('small', {}, `${spot.label ? `${fmtCoord(spot)} · ` : ''}${spot.count} buổi · gần nhất ${fmtDay(spot.lastAt)}`)),
        h('button', { class: 'gv-mini', type: 'button', onclick: () => li.replaceWith(pastSaveForm(spot, li)) }, 'Lưu thành phòng'),
      );
      return li;
    }));
  }

  function pastSaveForm(spot, row) {
    const input = h('input', { maxlength: '40', placeholder: 'Tên phòng, VD: F4.2', required: '', 'aria-label': `Tên phòng cho vị trí ${fmtCoord(spot)}` });
    const form = h('form', { class: 'gv-place-form', onsubmit: async (e) => {
      e.preventDefault();
      $('placeMsg').textContent = 'Đang lưu…';
      const r = await api('/api/places', { method: 'POST', body: { name: input.value, lat: spot.lat, lng: spot.lng } });
      if (!r.ok) { $('placeMsg').textContent = r.message; return; }
      $('placeMsg').textContent = `Đã lưu phòng "${input.value.trim()}".`;
      await loadPlaces();
      $('placeSelect').value = r.id;
    } },
      input,
      h('button', { class: 'gv-mini', type: 'submit' }, 'Lưu'),
      h('button', { class: 'gv-mini', type: 'button', onclick: () => li.replaceWith(row) }, 'Huỷ'),
    );
    const li = h('li', { class: 'gv-past-edit' }, form);
    queueMicrotask(() => input.focus());
    return li;
  }

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
    const edge = r.now < s.expiresAt ? s.expiresAt : s.lateUntil;
    pollTimer = setTimeout(refreshLive, Math.min(delay, Math.max(500, edge - r.now + 500)));
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
    const minsLeft = (until) => Math.max(0, Math.ceil((until - Date.now()) / 60_000));
    $('countdown').textContent = session.late
      ? `Hết giờ ${fmtTime(session.expiresAt)} · đang nhận điểm danh TRỄ đến ${fmtTime(session.lateUntil)} (còn ${minsLeft(session.lateUntil)} phút)`
      : `${fmtTime(session.startsAt)}–${fmtTime(session.expiresAt)} · còn ${minsLeft(session.expiresAt)} phút${session.lateUntil > session.expiresAt ? ` · trễ đến ${fmtTime(session.lateUntil)}` : ''}`;

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
        h('span', { class: `tag${rec.late ? ' late' : ''}` }, rec.manual ? `${fmtTime(rec.time)} · tay` : `${rec.late ? `trễ ${lateMinutes(session, rec)}' · ` : ''}${fmtTime(rec.time)} · ${rec.distance} m`),
      );
    }));
  }

  const lateMinutes = (session, rec) => Math.max(1, Math.ceil((rec.time - session.expiresAt) / 60_000));

  async function patchLive(action, value) {
    if (!liveSession) return;
    const r = await api('/api/session', { method: 'PATCH', body: { id: liveSession.id, action, value } });
    if (!r.ok) alert(r.message);
    refreshLive();
  }

  $('qrBtn').addEventListener('click', () => patchLive('qr', !liveSession?.requireQr));
  $('extendBtn').addEventListener('click', () => patchLive('extend'));
  $('closeBtn').addEventListener('click', () => {
    if (!confirm('Đóng điểm danh ngay? Sinh viên sẽ không điểm danh được nữa, kể cả điểm danh trễ.')) return;
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

  // Trạng thái theo ngày: 'ok' (đúng giờ ở ít nhất 1 buổi) | 'T' (chỉ có mặt trễ) | 'P' | 'K'
  function dayStatus(date) {
    const sessions = monthData.sessions.filter((s) => s.date === date);
    const records = sessions.flatMap((s) => s.records);
    const onTime = new Set(records.filter((x) => !x.late).map((x) => x.mssv));
    const late = new Set(records.filter((x) => x.late).map((x) => x.mssv));
    const excuses = monthData.excuses[date] ?? {};
    return (mssv) => {
      if (onTime.has(mssv)) return 'ok';
      if (late.has(mssv)) return 'T';
      return excuses[mssv] === 'P' ? 'P' : 'K';
    };
  }

  // Giờ điểm danh trễ (sớm nhất trong ngày) để hiện khi rê chuột vào ô "T".
  function lateTime(date, mssv) {
    const times = monthData.sessions.filter((s) => s.date === date)
      .flatMap((s) => s.records.filter((x) => x.mssv === mssv && x.late).map((x) => x.time));
    return times.length ? fmtTime(Math.min(...times)) : '';
  }

  const classDates = () => [...new Set(monthData.sessions.map((s) => s.date))].sort();

  function renderMonth() {
    const dates = classDates();
    const table = $('monthTable');
    if (!dates.length) {
      table.replaceChildren(h('tbody', {}, h('tr', {}, h('td', {}, 'Tháng này chưa có buổi điểm danh nào.'))));
      $('daySummary').replaceChildren(h('tbody', {}, h('tr', {}, h('td', {}, 'Chưa có ngày nào có điểm danh.'))));
      $('dayDetail').hidden = true;
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
        const when = st === 'T' ? lateTime(d, s.mssv) : '';
        const label = st === 'ok' ? '✓' : (st === 'T' ? `T ${when}` : st);
        return h('td', {}, h('button', {
          class: `gv-cell ${st.toLowerCase()}`, type: 'button', 'aria-label': `${fullName(s)} ngày ${d}: ${st === 'T' ? `trễ lúc ${when}` : label}`,
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
    renderDaySummary(dates);
  }

  let openDay = null;

  // Mỗi ngày có điểm danh: số có mặt / vắng có phép / vắng không phép; bấm "Xem" để thấy ai vắng.
  function renderDaySummary(dates) {
    const rows = dates.map((d) => {
      const st = dayStatus(d);
      const sessions = monthData.sessions.filter((s) => s.date === d);
      const by = { ok: [], T: [], P: [], K: [] };
      for (const s of roster) by[st(s.mssv)].push(s);
      return { d, sessions, by };
    }).reverse();
    const pct = (n) => (roster.length ? Math.round((n / roster.length) * 100) : 0);
    $('daySummary').replaceChildren(
      h('thead', {}, h('tr', {},
        h('th', { class: 'name' }, 'Ngày'), h('th', {}, 'Buổi'), h('th', {}, 'Có mặt'), h('th', {}, 'Trễ'),
        h('th', {}, 'Vắng P'), h('th', {}, 'Vắng K'), h('th', {}, 'Tỉ lệ'), h('th', {}, ''))),
      h('tbody', {}, rows.map(({ d, sessions, by }) => h('tr', {},
        h('td', { class: 'name' }, new Date(`${d}T00:00:00`).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' })),
        h('td', { class: 'mono' }, sessions.map((s) => s.label || fmtTime(s.startsAt)).join(', ')),
        h('td', { class: 'm-ok' }, String(by.ok.length + by.T.length)),
        h('td', { class: 'm-t' }, String(by.T.length)),
        h('td', { class: 'm-p' }, String(by.P.length)),
        h('td', { class: 'm-k' }, String(by.K.length)),
        h('td', { class: 'mono' }, `${pct(by.ok.length + by.T.length)}%`),
        h('td', { class: 'gv-actions' },
          h('button', { class: 'gv-mini', type: 'button', onclick: () => showDay(d, by) }, openDay === d ? 'Ẩn' : 'Xem vắng'),
          subjectsOf(sessions).map(([subject, group], _, all) => h('button', {
            class: 'gv-mini', type: 'button', 'aria-label': `Tải ảnh tổng kết ${subject} ngày ${d}`,
            onclick: (e) => downloadSubjectImage(d, subject, group, e.currentTarget),
          }, all.length > 1 ? `Ảnh · ${subject}` : 'Tải ảnh')),
        ),
      ))),
    );
    if (openDay) {
      const row = rows.find((r) => r.d === openDay);
      if (row) showDay(openDay, row.by, true); else $('dayDetail').hidden = true;
    }
  }

  /* ---------- Ảnh tổng kết theo môn ---------- */
  const subjectName = (s) => s.label?.trim() || 'Buổi học';

  // Các môn trong ngày (theo tên buổi), giữ thứ tự giờ học.
  function subjectsOf(sessions) {
    const groups = new Map();
    for (const s of [...sessions].sort((a, b) => a.startsAt - b.startsAt)) {
      const key = subjectName(s);
      groups.set(key, [...(groups.get(key) ?? []), s]);
    }
    return [...groups];
  }

  // Có mặt đúng giờ / trễ tính riêng cho môn; vắng P/K theo phép của cả ngày.
  function subjectReport(d, subject, sessions) {
    const records = sessions.flatMap((s) => s.records);
    const onTime = new Set(records.filter((x) => !x.late).map((x) => x.mssv));
    const lateAt = new Map();
    for (const x of records.filter((r) => r.late)) lateAt.set(x.mssv, Math.min(lateAt.get(x.mssv) ?? Infinity, x.time));
    const excuses = monthData.excuses[d] ?? {};
    const report = { late: [], P: [], K: [] };
    for (const s of roster) {
      const item = { stt: s.stt, name: fullName(s) };
      if (onTime.has(s.mssv)) continue;
      if (lateAt.has(s.mssv)) report.late.push({ ...item, time: fmtTime(lateAt.get(s.mssv)) });
      else report[excuses[s.mssv] === 'P' ? 'P' : 'K'].push(item);
    }
    const start = Math.min(...sessions.map((s) => s.startsAt));
    const end = Math.max(...sessions.map((s) => s.expiresAt));
    return {
      ...report,
      subject,
      dateLabel: new Date(`${d}T00:00:00`).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' }),
      timeLabel: `${fmtTime(start)}–${fmtTime(end)}`,
      total: roster.length,
      present: roster.length - report.P.length - report.K.length,
    };
  }

  const fileSlug = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'buoi-hoc';

  async function downloadSubjectImage(d, subject, sessions, btn) {
    btn.disabled = true;
    try {
      await window.DDImage.download(subjectReport(d, subject, sessions), `DiemDanh_${d}_${fileSlug(subject)}.png`);
    } catch (err) {
      alert(`Không tạo được ảnh: ${err.message}`);
    } finally {
      btn.disabled = false;
    }
  }

  function showDay(d, by, keep = false) {
    if (!keep && openDay === d) { openDay = null; $('dayDetail').hidden = true; renderDaySummary(classDates()); return; }
    openDay = d;
    const list = (title, arr, cls) => h('div', {},
      h('p', { class: `dd-label ${cls}` }, `${title} (${arr.length})`),
      h('p', { class: 'gv-names' }, arr.length ? arr.map((s) => `${s.stt}. ${fullName(s)}`).join(' · ') : '—'));
    $('dayDetail').replaceChildren(
      h('p', { class: 'gv-day-title' }, `Ngày ${d.slice(8)}/${d.slice(5, 7)}`),
      list('Đi trễ', by.T.map((s) => ({ ...s, ten: `${s.ten} (${lateTime(d, s.mssv)})` })), 'm-t'),
      list('Vắng không phép', by.K, 'm-k'),
      list('Vắng có phép', by.P, 'm-p'),
    );
    $('dayDetail').hidden = false;
    if (!keep) renderDaySummary(classDates());
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

  /* ---------- File mẫu Excel: lưu trên máy chủ, dùng chung cho mọi máy ---------- */
  const toBase64 = async (blob) => {
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let bin = '';
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  };
  const fromBase64 = (data, name) => new File([Uint8Array.from(atob(data), (c) => c.charCodeAt(0))], name);

  // Bản cũ chỉ giữ file trong trình duyệt (IndexedDB) — đọc ra để đưa lên máy chủ một lần.
  function legacyLocalTemplate() {
    return new Promise((resolve) => {
      try {
        const req = indexedDB.open('dd-template', 1);
        req.onupgradeneeded = () => req.result.createObjectStore('files');
        req.onerror = () => resolve(null);
        req.onsuccess = () => {
          const get = req.result.transaction('files', 'readonly').objectStore('files').get('template');
          get.onsuccess = () => resolve(get.result ?? null);
          get.onerror = () => resolve(null);
        };
      } catch { resolve(null); }
    });
  }

  const templateStore = {
    async get() {
      const r = await api('/api/template');
      if (r.ok && r.template) return fromBase64(r.template.data, r.template.name);
      const local = await legacyLocalTemplate();
      if (local) await templateStore.set(local);
      return local;
    },
    async set(file) {
      const r = await api('/api/template', { method: 'PUT', body: { name: file.name, data: await toBase64(file) } });
      if (!r.ok) throw new Error(r.message);
    },
  };

  async function renderTemplateInfo() {
    const file = await templateStore.get();
    $('templateInfo').textContent = file ? `File mẫu: ${file.name}.` : 'Chưa có file mẫu — chọn một lần, máy nào cũng dùng được.';
  }

  async function rememberTemplate(file) {
    try {
      await templateStore.set(file);
      renderTemplateInfo();
    } catch (err) {
      $('exportMsg').textContent = `Không lưu được file mẫu: ${err.message}`;
    }
  }

  $('templateInput').addEventListener('change', (e) => { if (e.target.files[0]) rememberTemplate(e.target.files[0]); });

  $('exportBtn').addEventListener('click', async () => {
    const file = $('templateInput').files[0] ?? await templateStore.get();
    if (!file) { $('exportMsg').textContent = 'Chưa có file mẫu. Bấm "Chọn file mẫu" và chọn file Excel BẢNG ĐIỂM DANH trống của trường.'; return; }
    if (!monthData) await loadMonth();
    $('exportMsg').textContent = 'Đang tạo file…';
    try {
      const marks = {};
      for (const d of classDates()) {
        const st = dayStatus(d);
        const day = String(Number(d.slice(8)));
        for (const s of roster) {
          const v = st(s.mssv);
          // Trễ vẫn tính là có mặt — mẫu Excel chỉ ghi P/K.
          if (v === 'P' || v === 'K') (marks[s.mssv] ??= {})[day] = v;
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
      await rememberTemplate(file);
      $('rosterMsg').textContent = `Đã lưu ${r.count} sinh viên. File này cũng được lưu làm mẫu xuất Excel.`;
    } catch (err) {
      $('rosterMsg').textContent = `Lỗi: ${err.message}`;
    } finally {
      e.target.value = '';
    }
  });

  function renderRosterTable() {
    $('rosterTable').replaceChildren(
      h('thead', {}, h('tr', {}, h('th', {}, 'STT'), h('th', {}, 'MSSV'), h('th', { class: 'name' }, 'Họ tên'), h('th', {}, ''))),
      h('tbody', {}, roster.map((s) => h('tr', {},
        h('td', { class: 'mono' }, String(s.stt)), h('td', { class: 'mono' }, s.mssv), h('td', { class: 'name' }, fullName(s)),
        h('td', {}, h('button', { class: 'gv-mini', type: 'button', 'aria-label': `Xoá ${fullName(s)} khỏi lớp`, onclick: () => removeStudent(s) }, 'Xoá')),
      ))),
    );
  }

  async function removeStudent(s) {
    if (!confirm(`Xoá ${fullName(s)} (MSSV ${s.mssv}) khỏi danh sách lớp? Điểm danh cũ của bạn này vẫn được giữ.`)) return;
    const r = await api(`/api/roster?mssv=${encodeURIComponent(s.mssv)}`, { method: 'DELETE' });
    if (!r.ok) { $('rosterMsg').textContent = r.message; return; }
    const fresh = await api('/api/roster');
    roster = (fresh.roster ?? []).sort(byStt);
    renderRosterInfo();
    renderRosterTable();
    $('rosterMsg').textContent = `Đã xoá ${fullName(s)}. Lớp còn ${r.count} sinh viên.`;
  }

  /* ---------- Khởi động ---------- */
  if (pin.get()) start(); else showLogin();
})();
