// ResponsiveFlow.jsx
import React from 'react';
import styles from './ResponsiveFlow.module.css'; // 导入 CSS Modules 样式

/**
 * ResponsiveFlow 组件：
 * 一个通用的、响应式、自动换行的 Flexbox 容器。
 * 它适用于排列内容高度不一（非严格对齐）的卡片、标签或项目列表。
 *
 * @param {ReactNode} children - 任何要以响应式流动网格排列的 React 元素。
 */
const ResponsiveFlow = ({ children }) => {
    return (
        // 使用 CSS Modules 的 styles.layout 类
        <section className={styles.layout}>
            {/* 直接渲染 children。子元素需要自己定义宽度类（如 item-3-col） */}
            {children}
        </section>
    );
};

export default ResponsiveFlow;