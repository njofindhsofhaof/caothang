import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseTemplate, MAX_BASE64_CHARS } from '../api/template.js';

test('accepts a base64 file and keeps its name', () => {
  const r = parseTemplate({ name: 'BangDiemDanh.xlsx', data: Buffer.from('PK\u0003\u0004').toString('base64') });
  assert.equal(r.template.name, 'BangDiemDanh.xlsx');
});

test('rejects empty, non-base64 or oversized data', () => {
  assert.ok(parseTemplate({ data: '' }).error);
  assert.ok(parseTemplate({ data: '<script>' }).error);
  assert.ok(parseTemplate({ data: 'A'.repeat(MAX_BASE64_CHARS + 4) }).error);
});
