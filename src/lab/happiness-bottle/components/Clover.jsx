/**
 * 四叶草（可推广为任意叶数的）水草株。
 * 叶长按 —hb-water-h 比例缩放；n=4 时精确还原原版叶形。
 */
import { deriveLeafPalette } from '../utils/palette.js';
import styles from './Clover.module.css';

const DEFAULT_LEAF_COLOR = '#2cb62c';
const MAX_LEAVES = 10;

// 原版叶高/水高 = 16px/100px
const BASE_LEAF_RATIO = 0.16;

function leafRatio(n) {
  if (n <= 2) return BASE_LEAF_RATIO * 1.25;
  if (n <= 3) return BASE_LEAF_RATIO * 1.15;
  if (n === 4) return BASE_LEAF_RATIO;
  // n>4：按 (4/n)^0.7 收缩，视觉验证值 —— 保证 6/8/10 叶不挤成圆饼
  return BASE_LEAF_RATIO * Math.max(0.34, Math.pow(4 / n, 0.7));
}

// 确定性伪随机：株 index → -1..1，每次渲染稳定
function jitter(index) {
  return Math.abs(Math.sin(index * 999 + 7)) * 2 - 1;
}

export default function Clover({ index = 0, count = 1, leaves = 4, leafColors = [], swayDelay = 0 }) {
  const leafCount = Math.min(MAX_LEAVES, Math.max(2, Math.round(leaves)));

  const leafVars = {};
  for (let i = 0; i < leafCount; i += 1) {
    const hex = leafColors.length ? leafColors[i % leafColors.length] : DEFAULT_LEAF_COLOR;
    const { front, back } = deriveLeafPalette(hex);
    leafVars[`--hb-leaf-${i}-c`] = front;
    leafVars[`--hb-leaf-${i}-back-c`] = back;
  }

  const len = `calc(var(--hb-water-h) * ${leafRatio(leafCount)})`;
  const spread = count > 1 ? ((index + 1) / (count + 1)) * 100 + jitter(index) * 2 : 40 + jitter(index) * 2;

  return (
    <div
      className={styles.clover}
      style={{
        ...leafVars,
        '--hb-leaf-len': len,
        left: `${spread}%`,
        zIndex: index % 2 === 0 ? 1 : 0,
        animationDelay: `${swayDelay}s`,
      }}
    >
      <div className={styles.leaves}>
        {Array.from({ length: leafCount }, (_, i) => (
          <i
            key={i}
            className={styles.leave}
            style={{
              '--hb-leaf-rot': `${i * (360 / leafCount) - 90}deg`,
              '--hb-leaf-main': `var(--hb-leaf-${i}-c)`,
              '--hb-leaf-back': `var(--hb-leaf-${i}-back-c)`,
            }}
          />
        ))}
      </div>
      <i className={styles.branch} />
    </div>
  );
}
