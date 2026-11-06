import styles from './Jellyfish.module.css';

/** 水母：原版头/尾双层呼吸 + 游动动画，尺寸随 --hb-water-h 缩放。 */
export default function Jellyfish() {
  return (
    <div className={styles.jellyfish}>
      <div className={styles.head} />
      <div className={styles.tail}>
        <div className={styles.tailIn} />
      </div>
    </div>
  );
}
