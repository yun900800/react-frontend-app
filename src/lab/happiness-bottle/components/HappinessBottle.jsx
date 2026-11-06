/**
 * 幸福瓶：纯 CSS 玻璃瓶（复刻 yun900800/bottle 原型）。
 * 尺寸三档（sm/md/lg）+ <768 断点整体 ×0.85；水与生物由后续层填充。
 */
import styles from './HappinessBottle.module.css';

export default function HappinessBottle({
  size = 'md',
  waterColor = '#00ccff', // Task 4 接线
  clovers = [{ leaves: 4, leafColors: [] }], // Task 5 渲染
  jellyfish = true, // Task 6 渲染
  bubbles = true, // Task 6 渲染
}) {
  return (
    <div className={styles.root} data-size={size} role="img" aria-label="幸福瓶装饰">
      <div className={styles.top}>
        <div className={styles.mouth} />
        <i className={styles.highlight} />
      </div>
      <div className={styles.neck}>
        <i className={styles.highlight} />
      </div>
      <div className={styles.main}>
        <div className={styles.inner}>{/* water 层（Task 4） */}</div>
        <i className={styles.highlight} />
      </div>
    </div>
  );
}
