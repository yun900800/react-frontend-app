const pad = (value) => String(value).padStart(2, '0');

export function toDateTimeLocal(value) {
  if (value === undefined || value === null || value === '') return '';

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return [
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  ].join('T');
}

export function toPublishedAtIso(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return undefined;

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return undefined;

  return date.toISOString();
}
