// BookDetail.jsx
import React from 'react';
import { BookPageContent } from "./BookPageContent.jsx"; // 假设 BookPageContent 存在
import gridStyles from './Book.module.css';
import shelfStyles from './Book-Shelf.module.css';
import imageDefault from '../../../assets/resources/3d-book-images/1.png';

export const BookDetail = ({ 
    data, 
    isOpened,           // 最终 opened 状态 (bk-viewinside)
    isOutside,          // bk-outside 状态 (仅 Shelf 模式使用)
    isFlipped,          // Flipped 状态 (bk-viewback)
    currentPageIndex, 
    handlePageChange, 
    viewMode='grid',
    onTransitionEnd,  
}) => {
    let styles = viewMode === 'grid' ? gridStyles : shelfStyles; 

    let id = 0;
    if (data.id > 3 ) {
        id = 'default';
    } else {
        id = data.id;
    }
    // 核心逻辑：结合所有状态来生成最终的 CSS 类
    let bookClasses = `${styles['bk-book']} ${styles[`book-${id}`]}`;
    
    // Grid Mode Default:
    if (viewMode === 'grid' && !isOpened && !isFlipped) {
        bookClasses += ` ${styles['bk-bookdefault']}`;
    }
    
    if (isFlipped) {
        bookClasses += ` ${styles['bk-viewback']}`;
    }
    
    // Shelf 模式动画序列：bk-outside 和 bk-viewinside 类互不干扰，由上层 state 控制时序
    if (isOutside) {
        bookClasses += ` ${styles['bk-outside']}`;
    }
    if (isOpened) {
        bookClasses += ` ${styles['bk-viewinside']}`;
    }

    const pages = data.pages || [];
    const totalPages = pages.length;
    
    // 关键：触发 onTransitionEnd 事件
    const handleBookTransitionEnd = (e) => {
        // 确保只响应 .bk-book 元素上的过渡结束事件 (防止子元素过渡冒泡)
        if (e.target === e.currentTarget && onTransitionEnd) {
            onTransitionEnd(data.id);
        }
    };
    
    return (
        <div className={bookClasses}
            onTransitionEnd={viewMode === 'shelf' ? handleBookTransitionEnd : undefined}
            style={{
                ...(data.coverColor ? { '--bk-cover-color': data.coverColor } : {}),
                '--cover-image': `url(${data.cover_url || imageDefault})`
                }}
            >
            
            {/* 封面 bk-front */}
            <div className={styles['bk-front']}>
                <div className={styles['bk-cover-back']}>{data.coverBackText || '背面内容'}</div>
                <div className={styles['bk-cover']}>
                    <h2>
                    <span>{data.author}</span>
                    <span>{data.title}</span>
                    </h2>
                </div>
            </div>
            
            {/* 书页 bk-page */}
            <div className={styles['bk-page']}>
                {pages.map((page, index) => (
                    <BookPageContent 
                        key={page.id} 
                        content={page.content} 
                        isCurrent={index === currentPageIndex}
                    />
                ))}
                
                {/* 翻页导航 */}
                {totalPages > 1 && isOpened && (
                    <nav>
                        <span 
                            className={styles['bk-page-prev']}
                            onClick={(e) => {
                                handlePageChange(-1);
                                e.stopPropagation(); // 防止事件冒泡
                            }}
                            style={{ visibility: currentPageIndex > 0 ? 'visible' : 'hidden' }}
                        >
                            &lt;
                        </span>
                        <span 
                            className={styles['bk-page-next']}
                            onClick={(e) => {
                                handlePageChange(1);
                                e.stopPropagation(); // 防止事件冒泡
                            }}
                            style={{ visibility: currentPageIndex < totalPages - 1 ? 'visible' : 'hidden' }}
                        >
                            &gt;
                        </span>
                    </nav>
                )}
            </div>
            
            {/* 书背 bk-back */}
            <div className={styles['bk-back']}>
                {data.backCoverImage && <img src={data.backCoverImage} alt="cat"/>}
                <p>{data.backCoverSummary}</p>
            </div>

            {/* 侧面 */}
            <div className={styles['bk-right']}></div>
            <div className={styles['bk-left']}>
                <h2><span>{data.author}</span><span>{data.title}</span></h2>
            </div>
            <div className={styles['bk-top']}></div>
            <div className={styles['bk-bottom']}></div>
        </div>
    );
};