import HappinessBottle from './components/HappinessBottle.jsx';
import styles from './HappinessBottleLab.module.css';

/**
 * 幸福瓶实验：主舞台 + 实时控制面板 + 预设陈列（骨架，后续任务填充）。
 */
export default function HappinessBottleLab() {
  return (
    <div className={styles.lab}>
      <h1 className={styles.title}>幸福瓶</h1>
      <div className={styles.stage}>
        <HappinessBottle />
      </div>
    </div>
  );
}
