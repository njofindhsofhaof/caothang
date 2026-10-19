// Đọc / điền mẫu "BẢNG ĐIỂM DANH" trực tiếp trên XML của file .xlsx (giữ nguyên định dạng gốc).
// Cần JSZip (window.JSZip).
(() => {
  'use strict';

  const NS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
  const DAY_RE = /^\d+$/;

  const colToNum = (col) => [...col].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0);
  const splitRef = (ref) => { const m = /^([A-Z]+)(\d+)$/.exec(ref); return { col: m[1], row: Number(m[2]) }; };
  const norm = (s) => String(s ?? '').normalize('NFC').replace(/\s+/g, ' ').trim();

  async function openBook(file) {
    const zip = await window.JSZip.loadAsync(file);
    const sheetPath = Object.keys(zip.files).filter((p) => /^xl\/worksheets\/sheet\d*\.xml$/.test(p)).sort()[0];
    if (!sheetPath) throw new Error('File không có trang tính.');
    const parser = new DOMParser();
    const sheetDoc = parser.parseFromString(await zip.file(sheetPath).async('string'), 'application/xml');
    const ssFile = zip.file('xl/sharedStrings.xml');
    const strings = ssFile
      ? [...parser.parseFromString(await ssFile.async('string'), 'application/xml').getElementsByTagNameNS(NS, 'si')]
        .map((si) => [...si.getElementsByTagNameNS(NS, 't')].map((t) => t.textContent).join(''))
      : [];
    return { zip, sheetPath, sheetDoc, strings };
  }

  function cellText(cell, strings) {
    const t = cell.getAttribute('t');
    if (t === 'inlineStr') return [...cell.getElementsByTagNameNS(NS, 't')].map((x) => x.textContent).join('');
    const v = cell.getElementsByTagNameNS(NS, 'v')[0];
    if (!v) return '';
    return t === 's' ? (strings[Number(v.textContent)] ?? '') : v.textContent;
  }

  // Lưới ô theo dòng: rows[r] = Map(col -> {el, text})
  function grid(book) {
    const rows = new Map();
    for (const el of book.sheetDoc.getElementsByTagNameNS(NS, 'c')) {
      const { col, row } = splitRef(el.getAttribute('r'));
      if (!rows.has(row)) rows.set(row, new Map());
      rows.get(row).set(col, { el, text: norm(cellText(el, book.strings)) });
    }
    return rows;
  }

  // Tìm bố cục mẫu: dòng tiêu đề (có MSSV), dòng số ngày 1..31, các cột tên, CP/KP.
  function layout(rows) {
    let headerRow; let mssvCol; let nameCol;
    for (const [r, cells] of rows) {
      for (const [col, c] of cells) {
        if (c.text.toUpperCase() === 'MSSV') { headerRow = r; mssvCol = col; }
        if (/^HỌ TÊN/i.test(c.text)) nameCol = col;
      }
      if (headerRow) break;
    }
    if (!headerRow) throw new Error('Không tìm thấy cột "MSSV" trong file.');
    let dayRow; const dayCols = {}; let cpCol; let kpCol;
    for (const r of [headerRow, headerRow + 1, headerRow + 2]) {
      const cells = rows.get(r) ?? new Map();
      const days = [...cells].filter(([, c]) => DAY_RE.test(c.text) && Number(c.text) >= 1 && Number(c.text) <= 31);
      if (days.length >= 28) {
        dayRow = r;
        for (const [col, c] of days) dayCols[Number(c.text)] = col;
        for (const [col, c] of cells) { if (c.text === 'CP') cpCol = col; if (c.text === 'KP') kpCol = col; }
        break;
      }
    }
    if (!dayRow) throw new Error('Không tìm thấy dòng số ngày (1–31).');
    return { headerRow, dayRow, mssvCol, nameCol, dayCols, cpCol, kpCol };
  }

  function studentRows(rows, lay) {
    const out = [];
    for (const [r, cells] of [...rows].sort((a, b) => a[0] - b[0])) {
      if (r <= lay.dayRow) continue;
      const mssv = cells.get(lay.mssvCol)?.text ?? '';
      if (!/^\d{6,12}$/.test(mssv)) continue;
      // Họ lót ở ô gộp bắt đầu tại cột tên; tên nằm ở ô có chữ kế tiếp trước cột ngày 1.
      const firstDay = colToNum(lay.dayCols[1]);
      const texts = [...cells].filter(([col, c]) => c.text && colToNum(col) > colToNum(lay.mssvCol) && colToNum(col) < firstDay)
        .sort((a, b) => colToNum(a[0]) - colToNum(b[0])).map(([, c]) => c.text);
      out.push({ row: r, mssv, ho: texts.slice(0, -1).join(' ') || '', ten: texts.at(-1) ?? '' });
    }
    return out;
  }

  async function readRoster(file) {
    const book = await openBook(file);
    const rows = grid(book);
    const students = studentRows(rows, layout(rows));
    if (!students.length) throw new Error('Không đọc được sinh viên nào trong file.');
    return students.map(({ mssv, ho, ten }) => ({ mssv, ho, ten }));
  }

  function setInline(el, value) {
    const doc = el.ownerDocument;
    while (el.firstChild) el.removeChild(el.firstChild);
    if (value === '' || value === null || value === undefined) { el.removeAttribute('t'); return; }
    if (typeof value === 'number') {
      el.setAttribute('t', 'n');
      const v = doc.createElementNS(NS, 'v'); v.textContent = String(value); el.appendChild(v);
      return;
    }
    el.setAttribute('t', 'inlineStr');
    const is = doc.createElementNS(NS, 'is'); const t = doc.createElementNS(NS, 't');
    t.textContent = value; is.appendChild(t); el.appendChild(is);
  }

  // Ghi giá trị vào ô; tạo ô mới (đúng thứ tự cột) nếu dòng chưa có ô đó.
  function writeCell(book, rows, col, row, value) {
    const existing = rows.get(row)?.get(col);
    if (existing) { setInline(existing.el, value); return; }
    const rowEl = [...book.sheetDoc.getElementsByTagNameNS(NS, 'row')].find((x) => Number(x.getAttribute('r')) === row);
    if (!rowEl) return;
    const el = book.sheetDoc.createElementNS(NS, 'c');
    el.setAttribute('r', `${col}${row}`);
    const after = [...rowEl.getElementsByTagNameNS(NS, 'c')].find((c) => colToNum(splitRef(c.getAttribute('r')).col) > colToNum(col));
    rowEl.insertBefore(el, after ?? null);
    setInline(el, value);
  }

  function replaceLabel(book, rows, pattern, text) {
    for (const cells of rows.values()) for (const c of cells.values()) if (pattern.test(c.text)) setInline(c.el, text);
  }

  /**
   * marks: { [mssv]: { [day]: 'K' | 'P' } }  — chỉ ghi ngày vắng.
   * opts: { month: 1-12, signDate: Date }
   */
  async function fillTemplate(file, marks, opts) {
    const book = await openBook(file);
    const rows = grid(book);
    const lay = layout(rows);
    const students = studentRows(rows, lay);
    let totalP = 0; let totalK = 0;
    for (const s of students) {
      const m = marks[s.mssv] ?? {};
      let p = 0; let k = 0;
      for (const [day, col] of Object.entries(lay.dayCols)) {
        const v = m[day] ?? '';
        if (v === 'P') p += 1; else if (v === 'K') k += 1;
        writeCell(book, rows, col, s.row, v);
      }
      if (lay.cpCol) writeCell(book, rows, lay.cpCol, s.row, p || '');
      if (lay.kpCol) writeCell(book, rows, lay.kpCol, s.row, k || '');
      totalP += p; totalK += k;
    }
    replaceLabel(book, rows, /^TỔNG CỘNG \d+ NGÀY NGHỈ/i, `TỔNG CỘNG ${totalP + totalK} NGÀY NGHỈ.`);
    replaceLabel(book, rows, /^CÓ PHÉP:/i, `CÓ PHÉP: ${totalP}`);
    replaceLabel(book, rows, /^KHÔNG PHÉP:/i, `KHÔNG PHÉP: ${totalK}`);
    if (opts.signDate) {
      const d = opts.signDate; const pad = (n) => String(n).padStart(2, '0');
      replaceLabel(book, rows, /^Ngày \d+ tháng \d+ năm \d+/i, `Ngày ${pad(d.getDate())} tháng ${pad(d.getMonth() + 1)} năm ${d.getFullYear()}`);
    }
    // Ô tháng: ô có số nằm bên phải nhãn "THÁNG:"
    for (const [r, cells] of rows) {
      const label = [...cells].find(([, c]) => /^THÁNG:?$/i.test(c.text));
      if (!label) continue;
      const right = [...cells].filter(([col, c]) => colToNum(col) > colToNum(label[0]) && c.text).sort((a, b) => colToNum(a[0]) - colToNum(b[0]))[0];
      if (right) writeCell(book, rows, right[0], r, opts.month);
    }
    book.zip.file(book.sheetPath, new XMLSerializer().serializeToString(book.sheetDoc));
    return book.zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  window.DDXlsx = { readRoster, fillTemplate };
})();
