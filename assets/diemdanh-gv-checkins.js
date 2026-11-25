/* Tab "Lượt điểm danh" (trang giáo viên): mọi lần sinh viên bấm Điểm danh trong một ngày, kể cả lần bị từ chối.
   Dùng để đối chiếu khi sinh viên nói đã điểm danh mà bảng ghi vắng, và cho có mặt các bạn ngồi trong lớp
   mà GPS điện thoại báo lệch. Hàm dùng chung (h, api, danh sách lớp…) lấy từ window.DDGv (diemdanh-gv.js). */
(() => {
  const $ = (id) => document.getElementById(id);
  const VN_DATE = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' });
  const GPS_FAILS = new Set(['too_far', 'low_accuracy', 'no_gps']);
  const RESULT = {
    ok: ['Thành công', 'ok'],
    late: ['Thành công (trễ)', 'late'],
    already: ['Đã điểm danh trước đó', 'ok'],
    too_far: ['Ngoài phạm vi lớp', 'bad'],
    low_accuracy: ['GPS chưa chính xác', 'bad'],
    no_gps: ['Không lấy được GPS', 'bad'],
    closed: ['Không có buổi đang mở', 'bad'],
    not_yet: ['Chưa đến giờ', 'bad'],
    expired_qr: ['Mã QR hết hạn', 'bad'],
    unknown_mssv: ['MSSV không có trong lớp', 'bad'],
    device_bound: ['Máy đã dùng cho MSSV khác', 'bad'],
    device_used: ['Máy đã điểm danh cho bạn khác', 'bad'],
  };
  const labelOf = (code) => RESULT[code] ?? [code, 'bad'];
  const succeeded = (code) => code === 'ok' || code === 'late' || code === 'already';

  let data = [];
  let loadedDate = '';

  function gv() { return window.DDGv; }

  function studentOf(mssv) {
    return gv().getRoster().find((s) => String(s.mssv) === String(mssv));
  }

  // Bạn có bấm mà không có lượt nào thành công trong ngày: cần thầy xem lại.
  function needsReview(log) {
    const byMssv = new Map();
    for (const e of log) byMssv.set(e.mssv, [...(byMssv.get(e.mssv) ?? []), e]);
    return [...byMssv.entries()].filter(([, list]) => !list.some((e) => succeeded(e.result))).map(([mssv, list]) => ({ mssv, list }));
  }

  async function markPresent(e, btn) {
    const st = studentOf(e.mssv);
    const who = st ? gv().fullName(st) : `MSSV ${e.mssv}`;
    if (!confirm(`Cho ${who} có mặt môn ${e.subject || 'buổi này'}?\nLượt bấm lúc ${gv().fmtTime(e.at)} bị từ chối: ${e.message ?? labelOf(e.result)[0]}`)) return;
    btn.disabled = true;
    const r = await gv().api('/api/attendance', { method: 'POST', body: { action: 'present', sessionId: e.sessionId, mssv: e.mssv } });
    if (!r.ok) { alert(r.message); btn.disabled = false; return; }
    btn.textContent = 'Đã cho có mặt';
  }

  function row(e) {
    const { h, fmtTime, fullName, deviceText } = gv();
    const st = studentOf(e.mssv);
    const [label, tone] = labelOf(e.result);
    const gps = [Number.isFinite(e.distance) ? `cách ${e.distance} m` : '', Number.isFinite(e.accuracy) ? `GPS ±${e.accuracy} m` : ''].filter(Boolean).join(' · ');
    const canApprove = GPS_FAILS.has(e.result) && e.sessionId;
    return h('li', { class: tone === 'bad' ? 'gv-try-bad' : '' },
      h('time', { datetime: new Date(e.at).toISOString() }, fmtTime(e.at)),
      h('span', {},
        h('b', {}, st ? `${st.stt}. ${fullName(st)}` : `MSSV ${e.mssv}`), ' · ', e.subject || 'không rõ môn', ' · ',
        h('span', { class: `gv-try-tag ${tone}` }, label),
        e.redirectedFrom ? ' · tự chuyển sang môn đang mở' : ''),
      h('small', {}, [gps, e.message && tone === 'bad' ? e.message.split('. Nếu bạn')[0] : '', deviceText(e.ua)].filter(Boolean).join(' · ')),
      canApprove ? h('button', { class: 'gv-mini', type: 'button', onclick: (ev) => markPresent(e, ev.currentTarget) }, 'Cho có mặt') : null,
    );
  }

  function render() {
    const { h, fullName } = gv();
    const q = $('tryFilter').value.trim().toLowerCase();
    const onlyBad = $('tryOnlyBad').checked;
    const rows = data.filter((e) => {
      if (onlyBad && succeeded(e.result)) return false;
      if (!q) return true;
      const st = studentOf(e.mssv);
      return `${e.mssv} ${st ? fullName(st) : ''} ${e.subject}`.toLowerCase().includes(q);
    });
    const review = needsReview(data);
    $('tryReview').replaceChildren(...(review.length ? [
      h('p', { class: 'dd-label m-k' }, `Bấm điểm danh nhưng không lượt nào thành công (${review.length})`),
      h('p', { class: 'gv-names' }, review.map(({ mssv, list }) => {
        const st = studentOf(mssv);
        return `${st ? `${st.stt}. ${fullName(st)}` : `MSSV ${mssv}`} (${list.length} lần, ${labelOf(list[0].result)[0].toLowerCase()})`;
      }).join(' · ')),
    ] : []));
    $('tryMsg').textContent = data.length ? `${rows.length}/${data.length} lượt.` : 'Ngày này chưa có lượt điểm danh nào được ghi (nhật ký có từ 25/11/2026).';
    $('tryList').replaceChildren(...rows.map(row));
  }

  async function load() {
    if (!gv()) return;
    if (!$('tryDate').value) $('tryDate').value = VN_DATE.format(new Date());
    const date = $('tryDate').value;
    $('tryMsg').textContent = 'Đang tải…';
    const r = await gv().api(`/api/attendance?checkins=${date}`);
    if (!r.ok) { $('tryMsg').textContent = r.message; return; }
    data = r.log;
    loadedDate = date;
    render();
  }

  $('tryDate').addEventListener('change', load);
  $('tryReload').addEventListener('click', load);
  $('tryFilter').addEventListener('input', () => loadedDate && render());
  $('tryOnlyBad').addEventListener('change', () => loadedDate && render());

  window.DDGvCheckins = { load, needsReview };
})();
