// BookInfo.jsx
import React from 'react';
import styles from './Book.module.css';

export const BookInfo = ({ data, onFlip, onOpen }) => {
    
    // 逻辑：处理 "Flip" 按钮点击
    const handleFlipClick = () => {
        // 直接调用父组件（Book）传入的 onFlip，它将处理 BookList 的状态
        onFlip(data.id); 
    };
    
    // 逻辑：处理 "View inside" 按钮点击
    const handleViewClick = () => {
        // 调用父组件（Book）传入的 onOpen/handleViewClick，它包含了开启/关闭和重置页码的逻辑
        onOpen(); 
    };

    return (
        <div className={styles['bk-info']}>
            {/* Flip 按钮 */}
            <button className={styles['bk-bookback']} onClick={handleFlipClick}>
                Flip
            </button>
            {/* View inside 按钮 */}
            <button className={styles['bk-bookview']} onClick={handleViewClick}>
                View inside
            </button>
            
            <h3>
                <span>{data.author}</span>
                <span>{data.title}</span>
            </h3>
            <p>{data.infoSummary}</p>
        </div>
    );
};