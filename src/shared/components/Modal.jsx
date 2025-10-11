// Modal.jsx
import React from 'react';
import * as styles from './Modal.module.css';

const Modal = ({ children, innerStyles}) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} style={innerStyles}>
        {children}
        </div>
    </div>
  );
};

export default Modal;