import { useMemo } from 'react';
import { deriveWaterPalette } from '../utils/palette.js';
import styles from './HappinessBottle.module.css';

export default function HappinessBottle({
  size = 'md',
  waterColor = '#00ccff',
  clovers = [{ leaves: 4, leafColors: [] }], // Task 5 渲染
  jellyfish = true, // Task 6 渲染
  bubbles = true, // Task 6 渲染
}) {
  const waterPalette = useMemo(() => deriveWaterPalette(waterColor), [waterColor]);

  const styleVars = {
    '--hb-water-rgb': waterPalette.base,
    '--hb-water-deep-rgb': waterPalette.deep,
  };

  return (
    <div className={styles.root} data-size={size} role="img" aria-label="幸福瓶装饰" style={styleVars}>
      <div className={styles.top}>
        <div className={styles.mouth} />
        <i className={styles.highlight} />
      </div>
      <div className={styles.neck}>
        <i className={styles.highlight} />
      </div>
      <div className={styles.main}>
        <div className={styles.inner}>
          <div className={styles.water}>{/* 生物层（Task 5/6） */}</div>
        </div>
        <i className={styles.highlight} />
      </div>
    </div>
  );
}
