// App.jsx
import React from 'react';
import ResponsiveFlow from '../../../shared/components/layout/ResponsiveFlow.jsx';
import styles from '../../../shared/components/layout/ResponsiveFlow.module.css'; // 再次导入样式以获取子元素的类名

// 假设这是您的卡片组件样式
const cardStyles = { 
    padding: '20px', 
    border: '1px solid #ccc', 
    borderRadius: '8px', 
    backgroundColor: 'white',
    marginBottom: '0' // gap 已经处理了垂直间距
};

const ResponsiveFlowApp = () => {
    return (
        <div style={{ padding: '20px', backgroundColor: '#f4f4f9' }}>
            <h2>1. 响应式卡片列表 (高度不一，使用三列模板)</h2>
            <ResponsiveFlow>
                {/* 关键：给子元素应用 .item-3-col 布局类 */}
                <div className={`${styles['item-3-col']}`} style={{...cardStyles}}>卡片 A (短)</div>
                <div className={`${styles['item-3-col']}`} style={{...cardStyles}}>卡片 B (高)</div>
                <div className={`${styles['item-3-col']}`} style={{...cardStyles}}>卡片 C (中)卡片 C (中)卡片 C (中)卡片 C (中)卡片 C (中)卡片 C (中)卡片 C (中)卡片 C (中)卡片 C (中)卡片 C (中)卡片 C (中)</div>
                <div className={`${styles['item-3-col']}`} style={{...cardStyles}}>卡片 D (最短)</div>
                <div className={`${styles['item-3-col']}`} style={{...cardStyles}}>卡片 E (高)</div>
                <div className={`${styles['item-3-col']}`} style={{...cardStyles}}>卡片 F</div>
            </ResponsiveFlow>

            <h2 style={{marginTop: '40px'}}>2. 标签列表 (宽度自适应，使用 auto 模板)</h2>
            <ResponsiveFlow>
                 {/* 关键：给子元素应用 .item-auto 布局类 */}
                <span className={`${styles['item-auto']}`} style={{padding: '5px 10px', border: '1px solid blue', borderRadius: '5px'}}>通用组件</span>
                <span className={`${styles['item-auto']}`} style={{padding: '5px 10px', border: '1px solid blue', borderRadius: '5px'}}>Flexbox 布局</span>
                <span className={`${styles['item-auto']}`} style={{padding: '5px 10px', border: '1px solid blue', borderRadius: '5px'}}>内容流动性好</span>
                <span className={`${styles['item-auto']}`} style={{padding: '5px 10px', border: '1px solid blue', borderRadius: '5px'}}>响应式设计</span>
                <span className={`${styles['item-auto']}`} style={{padding: '5px 10px', border: '1px solid blue', borderRadius: '5px'}}>无严格列对齐</span>
            </ResponsiveFlow>
        </div>
    );
};

export default ResponsiveFlowApp;