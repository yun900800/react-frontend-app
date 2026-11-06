import styles from './Bubbles.module.css';

/** 气泡：两枚微扰漂浮 + 一枚上浮，颜色由水色变量派生。 */
export default function Bubbles() {
  return (
    <>
      <i className={`${styles.bubble} ${styles.bubble1}`} />
      <i className={`${styles.bubble} ${styles.bubble2}`} />
      <i className={`${styles.bubble} ${styles.bubble3}`} />
    </>
  );
}
