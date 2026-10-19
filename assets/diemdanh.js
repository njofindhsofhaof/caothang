(() => {
  'use strict';

  const STORE_MSSV = 'dd.mssv';
  const STORE_NAME = 'dd.name';
  const STORE_DEVICE = 'dd.device';
  const GPS_TIMEOUT_MS = 12_000;

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

  // Lấy GPS càng sớm càng tốt, chạy song song với việc nhập MSSV.
  function getPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error('Trình duyệt không hỗ trợ định vị.'));
      navigator.geolocation.getCurrentPosition(
        (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy }),
        (err) => reject(new Error(err.code === 1
          ? 'Bạn đã chặn quyền vị trí. Vào cài đặt trình duyệt → Quyền trang web → Vị trí → Cho phép, rồi quét lại.'
          : 'Không lấy được vị trí. Hãy bật GPS / Dịch vụ định vị rồi thử lại.')),
        { enableHighAccuracy: true, timeout: GPS_TIMEOUT_MS, maximumAge: 0 },
      );
    });
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
    try {
      let proof = '';
      if (qrToken) {
        setStatus('wait', 'Đang kiểm tra mã QR…');
        const tk = await ticketPromise;
        if (!tk.ok) return fail(tk.message, tk.code === 'expired_qr' || tk.code === 'closed');
        proof = tk.ticket;
      } else {
        setStatus('wait', 'Đang tìm buổi điểm danh…');
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
      setStatus('ok', r.already ? 'Bạn đã điểm danh rồi' : 'Điểm danh thành công', `${r.name} · lúc ${time}`);
      if (navigator.vibrate) navigator.vibrate(60);
    } catch {
      fail('Mạng không ổn định. Hãy thử lại.');
    } finally {
      submitting = false;
    }
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
    setStatus('wait', `${r.active.label || 'Buổi học'} · ${r.active.placeName || ''}`, `Mở đến ${fmt(r.active.expiresAt)}`);
    return r.active;
  }

  function fail(message, final = false) {
    setStatus('bad', 'Chưa điểm danh được', message);
    $('retryBtn').hidden = final;
    $('retryBtn').textContent = 'Thử lại';
  }

  $('retryBtn').addEventListener('click', () => submit());

  $('mssvForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const mssv = $('mssvInput').value.trim();
    $('mssvMsg').textContent = '';
    if (!/^\d{6,12}$/.test(mssv)) { $('mssvMsg').textContent = 'MSSV gồm 6–12 chữ số.'; return; }
    const r = await api(`/api/roster?mssv=${encodeURIComponent(mssv)}`).catch(() => ({ ok: false, message: 'Mạng không ổn định.' }));
    if (!r.ok) { $('mssvMsg').textContent = r.message; return; }
    if (!confirm(`Bạn là ${r.name} (MSSV ${mssv})?`)) return;
    store.set(STORE_MSSV, mssv);
    store.set(STORE_NAME, r.name);
    showWho(mssv, r.name);
    submit();
  });

  // Khởi động
  if (sessionId && qrToken) {
    ticketPromise = api('/api/checkin?ticket=1', { s: sessionId, t: qrToken, deviceId: dev })
      .catch(() => ({ ok: false, message: 'Mạng không ổn định. Hãy quét lại.' }));
  }
  if (store.get(STORE_MSSV) || qrToken) {
    positionPromise = getPosition();
    positionPromise.catch(() => {}); // lỗi được báo khi submit
  }
  const savedMssv = store.get(STORE_MSSV);
  if (savedMssv) {
    showWho(savedMssv, store.get(STORE_NAME) || '');
    submit();
  } else {
    $('mssvForm').hidden = false;
    setStatus('idle', 'Nhập MSSV để điểm danh', 'Chỉ nhập lần đầu, lần sau mở trang là tự điểm danh.');
  }
})();
