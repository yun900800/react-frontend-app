import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeColorStyle } from './sanitizeColorStyle.js';

test('keeps a safe rgb text color', () => {
  assert.equal(
    sanitizeColorStyle('color: rgb(0, 102, 204)'),
    'color: rgb(0, 102, 204)'
  );
});

test('keeps a safe hex text color', () => {
  assert.equal(sanitizeColorStyle('color: #0066cc'), 'color: #0066cc');
});

test('drops background colors and unrelated declarations', () => {
  assert.equal(
    sanitizeColorStyle(
      'background-color: rgb(255, 255, 255); color: #0066cc; position: fixed'
    ),
    'color: #0066cc'
  );
});

test('is case-insensitive for the color property', () => {
  assert.equal(
    sanitizeColorStyle('COLOR: RGB(0, 102, 204)'),
    'color: RGB(0, 102, 204)'
  );
});

test('rejects unsafe or unsupported color values', () => {
  for (const value of [
    'color: url(https://example.com/x)',
    'color: var(--brand)',
    'color: expression(alert(1))',
    'color: rgb(0, 102, 204) !important',
    'color: red',
  ]) {
    assert.equal(sanitizeColorStyle(value), '');
  }
});

test('returns an empty string when color is absent', () => {
  assert.equal(sanitizeColorStyle('font-weight: bold'), '');
  assert.equal(sanitizeColorStyle(''), '');
});
