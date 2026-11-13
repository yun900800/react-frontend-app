import test from 'node:test';
import assert from 'node:assert/strict';
import { toDateTimeLocal, toPublishedAtIso } from './publishedAt.js';

test('empty and invalid values produce empty output', () => {
  assert.equal(toDateTimeLocal(''), '');
  assert.equal(toDateTimeLocal(null), '');
  assert.equal(toDateTimeLocal('not-a-date'), '');
  assert.equal(toPublishedAtIso(''), undefined);
  assert.equal(toPublishedAtIso('not-a-date'), undefined);
});

test('datetime-local values round-trip through ISO', () => {
  const local = '2026-12-01T09:30';

  assert.equal(toDateTimeLocal(local), local);
  assert.equal(toPublishedAtIso(local), new Date(local).toISOString());
});

test('ISO values are formatted for datetime-local inputs', () => {
  const date = new Date('2026-12-01T09:30:00.000Z');

  assert.match(toDateTimeLocal(date), /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  assert.equal(toDateTimeLocal(date), toDateTimeLocal(date.toISOString()));
});
