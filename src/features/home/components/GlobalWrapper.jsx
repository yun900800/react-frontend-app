import React from 'react';
import styles from  './GlobalWrapper.module.css'; 

const GlobalWrapper = ({ children, maxWidth = '1440px' }) => {
  return (
    <div 
      className={styles["global-wrapper"]}
      style={{ '--global-max-width': maxWidth }}
    >
      {children}
    </div>
  );
};

export default GlobalWrapper;