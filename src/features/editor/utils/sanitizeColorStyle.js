const COLOR_VALUE =
  /^(?:#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|rgba?\(\s*[0-9]{1,3}%?\s*,\s*[0-9]{1,3}%?\s*,\s*[0-9]{1,3}%?(?:\s*,\s*(?:0|1|0?\.\d+|\d{1,3}%))?\s*\)|hsla?\(\s*[0-9]{1,3}(?:deg)?\s*,\s*[0-9]{1,3}%\s*,\s*[0-9]{1,3}%(?:\s*,\s*(?:0|1|0?\.\d+|\d{1,3}%))?\s*\))$/i;

/**
 * Keep only a safe text color from a Quill inline style string.
 *
 * The public flipbook intentionally does not support arbitrary inline CSS:
 * background colors, positioning, URLs and !important are dropped. Only
 * `color` with a hex/rgb/rgba/hsl/hsla value survives.
 */
export function sanitizeColorStyle(value) {
  if (typeof value !== 'string' || !value.trim()) return '';

  for (const declaration of value.split(';')) {
    const separator = declaration.indexOf(':');
    if (separator === -1) continue;

    const property = declaration.slice(0, separator).trim().toLowerCase();
    if (property !== 'color') continue;

    const color = declaration.slice(separator + 1).trim();
    if (COLOR_VALUE.test(color)) {
      return `color: ${color}`;
    }
  }

  return '';
}
