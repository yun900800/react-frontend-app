// src/components/ContentWrapper/ContentWrapper.jsx

import React from 'react';
import styles from './ContentWrapper.module.css';

/**
 * 一个用于包裹页面或内容区块的容器组件。
 * 它负责应用最大宽度、居中以及两侧的 padding。
 * * @param {object} props
 * @param {React.ReactNode} props.children - 要渲染的子内容
 * @param {string} [props.className] - 额外的 CSS 类名
 * @param {object} [props.style] - 额外的内联样式
 */
function ContentWrapper({ children, className, style }) {
  // 结合默认类名和传入的额外类名
  const combinedClassName = `${styles.wrapper} ${className || ''}`;

  return (
    <div className={combinedClassName} style={style}>
      {children}
    </div>
  );
}

export default ContentWrapper;