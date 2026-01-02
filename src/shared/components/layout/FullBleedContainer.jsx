// ContentLayout.jsx

import React from 'react';
import styles from  './FullBleedContainer.module.css'; // 导入 CSS 文件

const FullBleedContainerLayout = ({ children, maxWidth = '42rem' }) => {
  // 可以通过 CSS Variables 将 max-width 作为 prop 传入，增加灵活性
  return (
    <div 
      className={styles.wrapper} 
      style={{ '--content-max-width': maxWidth }}
    >
      {children}
    </div>
  );
};

export default FullBleedContainerLayout;