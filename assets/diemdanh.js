(() => {
  'use strict';

  const STORE_MSSV = 'dd.mssv';
  const STORE_NAME = 'dd.name';
  const STORE_DEVICE = 'dd.device';
  const GPS_TIMEOUT_MS = 12_000;
  const GPS_SAMPLES = 3;
  const GPS_SAMPLE_GAP_MS = 1_200;
  const GPS_EXTRA_TIMEOUT_MS = 4_000;

  const $ = (id) => document.getElementById(id);
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* chế độ riêng tư: bỏ qua */ } },
    del(k) { try { localStorage.removeItem(k); } catch { /* bỏ qua */ } },
  };

  function deviceId() {
    let id = store.get(STORE_DEVICE);
    if (!id) {
      id = (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`);
      store.set(STORE_DEVICE, id);
    }
    return id;
  }

  const ICONS = { idle: '·', wait: '◌', ok: '✓', bad: '!' };
  function setStatus(state, title, msg = '') {
    $('statusCard').dataset.state = state;
    $('stampIcon').textContent = ICONS[state];
    $('statusTitle').textContent = title;
    $('statusMsg').textContent = msg;
  }

  async function api(path, body) {
    const res = await fetch(path, {
      method: body ? 'POST' : 'GET',
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
    let data;
    try { data = await res.json(); } catch { data = { ok: false, message: 'Mạng không ổn định. Hãy thử lại.' }; }
    return data;
  }

  function readOnce(timeout) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy, ts: p.timestamp }),
        reject,
        { enableHighAccuracy: true, timeout, maximumAge: 0 },
      );
    });
  }

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  // Lấy GPS càng sớm càng tốt, chạy song song với việc nhập MSSV.
  // Đọc vài lần cách nhau để máy chủ thấy vị trí có dao động tự nhiên hay bị ghim cố định.
  async function getPosition() {
    if (!navigator.geolocation) throw new Error('Trình duyệt không hỗ trợ định vị.');
    let first;
    try { first = await readOnce(GPS_TIMEOUT_MS); } catch (err) {
      throw new Error(err.code === 1
        ? 'Bạn đã chặn quyền vị trí. Vào cài đặt trình duyệt → Quyền trang web → Vị trí → Cho phép, rồi quét lại.'
        : 'Không lấy được vị trí. Hãy bật GPS / Dịch vụ định vị rồi thử lại.');
    }
    const samples = [first];
    for (let i = 1; i < GPS_SAMPLES; i++) {
      await wait(GPS_SAMPLE_GAP_MS);
      try { samples.push(await readOnce(GPS_EXTRA_TIMEOUT_MS)); } catch { break; } // lần đọc thêm hỏng thì dùng số đã có
    }
    const best = samples.reduce((a, b) => (b.accuracy < a.accuracy ? b : a));
    return { lat: best.lat, lng: best.lng, accuracy: best.accuracy, samples };
  }

  const params = new URLSearchParams(location.search);
  let sessionId = params.get('s');
  const qrToken = params.get('t');
  // Xoá mã khỏi thanh địa chỉ để tải lại / chia sẻ link không dùng lại được.
  if (sessionId) history.replaceState(null, '', location.pathname);

  const dev = deviceId();
  let ticketPromise = null;
  let positionPromise = null;
  let submitting = false;

  function showWho(mssv, name) {
    $('mssvForm').hidden = true;
    $('whoView').hidden = false;
    $('whoName').textContent = name;
    $('whoMssv').innerHTML = '';
    $('whoMssv').append(`MSSV ${mssv}`);
    const change = document.createElement('button');
    change.type = 'button';
    change.textContent = 'Không phải bạn?';
    change.addEventListener('click', () => {
      store.del(STORE_MSSV); store.del(STORE_NAME);
      $('whoView').hidden = true; $('mssvForm').hidden = false; $('mssvInput').focus();
    });
    $('whoMssv').append(change);
  }

  async function submit() {
    const mssv = store.get(STORE_MSSV);
    if (!mssv || submitting) return;
    submitting = true;
    $('retryBtn').hidden = true;
    $('checkinBtn').hidden = true;
    try {
      let proof = '';
      if (qrToken) {
        setStatus('wait', 'Đang kiểm tra mã QR…');
        const tk = await ticketPromise;
        if (!tk.ok) return fail(tk.message, tk.code === 'expired_qr' || tk.code === 'closed');
        proof = tk.ticket;
      } else {
        setStatus('wait', 'Đang kiểm tra buổi điểm danh…');
        const cur = await findSession();
        if (!cur) return;
      }
      positionPromise = positionPromise || getPosition();
      setStatus('wait', 'Đang lấy vị trí…', 'Giữ máy, chờ vài giây.');
      let pos;
      try { pos = await positionPromise; } catch (e) { positionPromise = null; return fail(e.message); }
      setStatus('wait', 'Đang gửi điểm danh…');
      const r = await api('/api/checkin', { s: sessionId, t: proof, mssv, deviceId: dev, ...pos });
      if (!r.ok) {
        if (r.code === 'low_accuracy' || r.code === 'no_gps' || r.code === 'too_far') positionPromise = null;
        return fail(r.message, r.code === 'expired_qr' || r.code === 'closed' || r.code === 'device_bound' || r.code === 'device_used' || r.code === 'unknown_mssv');
      }
      const time = new Date(r.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      const title = r.already ? 'Bạn đã điểm danh rồi' : (r.late ? 'Đã điểm danh (trễ)' : 'Điểm danh thành công');
      setStatus('ok', title, `${r.name} · lúc ${time}${r.late ? ' · ghi trễ' : ''}`);
      showTally(r.tally);
      showAlias(r.alias);
      if (navigator.vibrate) navigator.vibrate(60);
    } catch {
      fail('Mạng không ổn định. Hãy thử lại.');
    } finally {
      submitting = false;
    }
  }

  // Dòng "Tháng này: trễ x · vắng P y · vắng K z" dưới thông báo thành công.
  function showTally(t) {
    if (!t) return;
    const line = document.createElement('span');
    line.className = 'dd-tally';
    line.textContent = (t.late || t.P || t.K)
      ? `Tháng này: trễ ${t.late} · vắng có phép ${t.P} · vắng không phép ${t.K}`
      : 'Tháng này: chưa trễ, chưa vắng buổi nào.';
    if (t.K) line.dataset.warn = '1';
    $('statusMsg').append(line);
    if (t.streak > 0) $('statusMsg').append(streakCard(t.streak));
  }

  // Danh hiệu theo chuỗi đúng giờ. Icon: Fluent Emoji 3D (Microsoft, MIT) trong /assets/streak/.
  const STREAK_TIERS = [
    { min: 1, img: 'au-thu', name: 'Ấu thú' },
    { min: 5, img: 'tieu-thu', name: 'Tiểu thú' },
    { min: 10, img: 'manh-thu', name: 'Mãnh thú' },
    { min: 20, img: 'hung-thu', name: 'Hung thú' },
    { min: 30, img: 'linh-thu', name: 'Linh thú' },
    { min: 50, img: 'sieu-thu', name: 'Siêu thú', rank: 'super' },
    { min: 100, img: 'than-thu', name: 'Thần thú', rank: 'god' },
  ];

  // Thẻ chuỗi: icon danh hiệu + thanh tiến độ từ cấp hiện tại tới cấp kế tiếp (span vì nằm trong <p>).
  function streakCard(n) {
    const el = (cls, text) => {
      const e = document.createElement('span');
      e.className = cls;
      if (text != null) e.textContent = text;
      return e;
    };
    const icon = (t, cls) => {
      const img = document.createElement('img');
      img.className = cls;
      img.src = `/assets/streak/${t.img}.webp`;
      img.alt = '';
      img.decoding = 'async';
      return img;
    };
    const i = STREAK_TIERS.findLastIndex((t) => n >= t.min);
    const tier = STREAK_TIERS[i], up = STREAK_TIERS[i + 1];
    const prev = i === 0 ? 0 : tier.min;
    const card = el('dd-streak');
    if (tier.rank) card.dataset.rank = tier.rank;
    card.setAttribute('role', 'img');
    card.setAttribute('aria-label', `Danh hiệu ${tier.name}, chuỗi đúng giờ ${n} buổi liên tiếp. `
      + (up ? `Còn ${up.min - n} buổi lên ${up.name}.` : 'Đã đạt cấp cao nhất.'));

    const body = el('dd-streak-body');
    const head = el('dd-streak-head');
    head.append(el('dd-streak-name', tier.name));
    const count = el('dd-streak-count');
    count.append(el('dd-streak-num', String(n)), ' buổi đúng giờ liên tiếp');
    head.append(count);
    body.append(head);

    const track = el('dd-streak-track');
    const span = up ? up.min - prev : 1, done = up ? n - prev : 1;
    if (span <= 10) {
      for (let k = 0; k < span; k++) {
        const seg = el('dd-streak-seg');
        if (k < done) { seg.dataset.on = '1'; seg.style.animationDelay = `${160 + k * 70}ms`; }
        if (k === done - 1 && up) seg.dataset.last = '1';
        track.append(seg);
      }
    } else {
      track.dataset.bar = '1';
      const fill = el('dd-streak-fill');
      fill.style.setProperty('--p', (done / span).toFixed(3));
      track.append(fill);
    }
    body.append(track);

    const next = el('dd-streak-next');
    if (up) next.append(`Còn ${up.min - n} buổi lên `, icon(up, 'dd-streak-mini'), el('dd-streak-up', up.name));
    else next.append('Cấp cao nhất rồi, giữ vững nhé!');
    body.append(next);

    card.append(icon(tier, 'dd-streak-icon'), body);
    return card;
  }

  // Tên ẩn danh của chính bạn trên bảng Leo rank (bảng công khai không hiện tên thật).
  function showAlias(alias) {
    if (!alias) return;
    const line = document.createElement('span');
    line.className = 'dd-alias';
    line.append('Tên của bạn trên bảng Leo rank: ');
    const b = document.createElement('b');
    b.textContent = alias;
    line.append(b);
    $('statusMsg').append(line);
  }

  const fmt = (ms) => new Date(ms).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  // Chế độ khung giờ: hỏi máy chủ buổi nào đang mở.
  async function findSession() {
    const r = await api('/api/checkin');
    if (!r.ok) { fail(r.message || 'Mạng không ổn định.'); return null; }
    if (!r.active) {
      setStatus('idle', 'Chưa có buổi điểm danh nào đang mở',
        r.next ? `Buổi tiếp theo hôm nay: ${r.next.label || 'buổi học'} từ ${fmt(r.next.startsAt)} đến ${fmt(r.next.expiresAt)}.` : 'Khi đến giờ, mở lại trang này để điểm danh.');
      $('retryBtn').hidden = false;
      $('retryBtn').textContent = 'Kiểm tra lại';
      return null;
    }
    if (r.active.requireQr) {
      fail('Buổi này yêu cầu quét mã QR thầy đang chiếu trên màn hình.', true);
      return null;
    }
    sessionId = r.active.id;
    const where = r.active.placeName ? `${r.active.placeName} · ` : '';
    if (r.active.late) {
      setStatus('idle', 'Đã hết giờ điểm danh', `${where}vẫn điểm danh được đến ${fmt(r.active.lateUntil)} (hết tiết) nhưng sẽ bị ghi TRỄ.`);
    } else {
      setStatus('idle', `${r.active.label || 'Buổi học'} đang mở điểm danh`, `${where}đến ${fmt(r.active.expiresAt)}`);
    }
    return r.active;
  }

  function fail(message, final = false) {
    setStatus('bad', 'Chưa điểm danh được', message);
    $('retryBtn').hidden = final;
    $('retryBtn').textContent = 'Thử lại';
  }

  $('retryBtn').addEventListener('click', () => (qrToken || sessionId ? submit() : showReady()));
  $('checkinBtn').addEventListener('click', () => submit());

  // Chế độ khung giờ: hiện buổi đang mở + nút "Điểm danh"; GPS chỉ được xin khi bấm nút.
  async function showReady() {
    setStatus('wait', 'Đang kiểm tra buổi điểm danh…');
    $('retryBtn').hidden = true;
    const cur = await findSession();
    $('checkinBtn').hidden = !cur;
  }

  $('mssvForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const mssv = $('mssvInput').value.trim().replace(/^0+(?=\d)/, '');
    $('mssvMsg').textContent = '';
    if (!/^\d{6,12}$/.test(mssv)) { $('mssvMsg').textContent = 'MSSV gồm 6–12 chữ số.'; return; }
    const r = await api(`/api/roster?mssv=${encodeURIComponent(mssv)}`).catch(() => ({ ok: false, message: 'Mạng không ổn định.' }));
    if (!r.ok) { $('mssvMsg').textContent = r.message; return; }
    if (!confirm(`Bạn là ${r.name} (MSSV ${mssv})?`)) return;
    store.set(STORE_MSSV, mssv);
    store.set(STORE_NAME, r.name);
    showWho(mssv, r.name);
    if (qrToken) submit(); else showReady();
  });

  // Khởi động
  if (sessionId && qrToken) {
    ticketPromise = api('/api/checkin?ticket=1', { s: sessionId, t: qrToken, deviceId: dev })
      .catch(() => ({ ok: false, message: 'Mạng không ổn định. Hãy quét lại.' }));
  }
  if (qrToken) {
    positionPromise = getPosition();
    positionPromise.catch(() => {}); // lỗi được báo khi submit
  }
  const savedMssv = store.get(STORE_MSSV);
  if (savedMssv) {
    showWho(savedMssv, store.get(STORE_NAME) || '');
    if (qrToken) submit(); else showReady();
  } else {
    $('mssvForm').hidden = false;
    setStatus('idle', 'Nhập MSSV để điểm danh', 'Chỉ nhập lần đầu, lần sau mở trang là tự điểm danh.');
  }
})();
