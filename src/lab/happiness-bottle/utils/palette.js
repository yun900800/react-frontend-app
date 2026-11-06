/**
 * 幸福瓶调色工具：hex → 瓶内水/叶所需的 RGB 三联串。
 * 返回 'r,g,b' 形式，专供 CSS 变量 `rgba(var(--hb-water-rgb), a)` 消费。
 */

const HEX_SHORT = /^#[0-9a-fA-F]{3}$/;
const HEX_LONG = /^#[0-9a-fA-F]{6}$/;

export function rgbToTriplet(hex) {
  return triplet(hexToRgb(hex));
}

function hexToRgb(hex) {
  if (typeof hex !== 'string' || (!HEX_LONG.test(hex) && !HEX_SHORT.test(hex))) {
    throw new Error(`invalid color: ${hex}`);
  }
  const raw = hex.slice(1);
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw;
  const int = parseInt(full, 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

function triplet({ r, g, b }) {
  return `${r},${g},${b}`;
}

export function deriveWaterPalette(hex) {
  const base = hexToRgb(hex);
  // 系数拟合自原版：#00ccff → #00add8（即 rgb 0,204,255 → 0,173,216）
  const deep = shade(base, 0.847, 1.0);
  return { base: triplet(base), deep: triplet(deep) };
}

export function deriveLeafPalette(hex) {
  const front = hexToRgb(hex);
  // 系数拟合自原版：#2cb62c → #219b21（即 rgb 44,182,44 → 33,155,33）
  const back = shade(front, 0.8318, 1.0628);
  return { front: triplet(front), back: triplet(back) };
}

function shade({ r, g, b }, lFactor, sFactor) {
  const { h, s, l } = rgbToHsl(r / 255, g / 255, b / 255);
  const s2 = Math.min(1, s * sFactor);
  const l2 = Math.min(1, Math.max(0, l * lFactor));
  return hslToRgb(h, s2, l2);
}

function rgbToHsl(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d) % 6;
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
    if (h < 0) h += 1;
  }
  return { h, s, l };
}

function hslToRgb(h, s, l) {
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const to255 = (t) => Math.round(hue2rgb(p, q, t) * 255);
  return {
    r: to255(h + 1 / 3),
    g: to255(h),
    b: to255(h - 1 / 3),
  };
}

function hue2rgb(p, q, t) {
  const x = t < 0 ? t + 1 : t > 1 ? t - 1 : t;
  if (6 * x < 1) return p + (q - p) * 6 * x;
  if (2 * x < 1) return q;
  if (3 * x < 2) return p + (q - p) * (2 / 3 - x) * 6;
  return p;
}
