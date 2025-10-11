// ModalCard.jsx
import React from 'react';
import * as styles from './ModalCard.module.css';

const ModalCard = ({ title, actions, children, onClose }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {/* 关闭按钮现在在这里，和标题在同一个 Flex 容器中 */}
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
      </div>
      <div className={styles.body}>
        {children}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
};

export default ModalCard;