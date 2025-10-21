import React, {useState} from "react";
import { BookPageContent } from "./BookPageContent.jsx";
import styles from './Book.module.css';
export const Book = ({ data , isOpenedGlobally, isFlippedGlobally, onOpen, onFlip }) => {
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    // 2. 状态映射到 CSS 类名
    // isOpenedGlobally 对应 $book.data('opened')，它由父组件 BookList 控制，以同步其他书的状态。
    let bookClasses = `${styles['bk-book']} ${styles[`book-${data.id}`]} ${styles['bk-bookdefault']}`;
    if (isFlippedGlobally) {
        // 对应 JS 中的 .addClass('bk-viewback')
        bookClasses = bookClasses.replace(` ${styles['bk-bookdefault']}`, '') + ` ${styles['bk-viewback']}`;
    }

    if (isOpenedGlobally) {
        // 对应 JS 中的 .addClass('bk-viewinside')
        bookClasses = bookClasses.replace(` ${styles['bk-bookdefault']}`, '') + ` ${styles['bk-viewinside']}`;
    }
    // 处理 "Flip" (bk-bookback) 按钮点击
    const handleFlipClick = () => {
        // 调用父组件的回调，处理兄弟组件的关闭逻辑
        onFlip(data.id); 
    };
    
    // 处理 "View inside" (bk-bookview) 按钮点击
    const handleViewClick = () => {
        // 调用父组件的回调，处理自身的开启和兄弟组件的关闭逻辑
        onOpen(data.id, isOpenedGlobally); 
        
        // 如果是关闭操作，重置当前页
        if (isOpenedGlobally) {
            setCurrentPageIndex(0);
        }
    };
    // 处理翻页导航
    const handlePageChange = (direction) => {
        let newIndex = currentPageIndex + direction;
        const totalPages = data.pages.length;

        if (newIndex >= 0 && newIndex < totalPages) {
        setCurrentPageIndex(newIndex);
        }
    };
    // if (isInsideView) {
    //     if (isFlipped) {
    //         bookClasses = bookClasses.replace(` ${styles['bk-viewback']}`, '');
    //     }
    //     // 假设内部视图的类名是 bk-view-inside
    //     bookClasses += ` ${styles['bk-viewinside']}`;
    // }
    const pages = data.pages || [];
    const totalPages = pages.length;
    return (
        <li>
            <div className={bookClasses}>
                
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
                            isCurrent={index === currentPageIndex} // 默认第一个页面是 current
                        />
                    ))}
                    {/* 翻页导航 (对应 JS 中的 $page.append(<nav>...)) */}
                    {totalPages > 1 && isOpenedGlobally && (
                        <nav>
                            <span 
                                className={styles['bk-page-prev']}
                                onClick={() => handlePageChange(-1)}
                                style={{ visibility: currentPageIndex > 0 ? 'visible' : 'hidden' }}
                            >
                                &lt;
                            </span>
                            <span 
                                className={styles['bk-page-next']}
                                onClick={() => handlePageChange(1)}
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

                {/* 侧面 bk-right, bk-left, bk-top, bk-bottom (可进一步抽象或保留) */}
                <div className={styles['bk-right']}></div>
                <div className={styles['bk-left']}>
                    <h2><span>{data.author}</span><span>{data.title}</span></h2>
                </div>
                <div className={styles['bk-top']}></div>
                <div className={styles['bk-bottom']}></div>
            </div>
            
            {/* 按钮和信息区 bk-info */}
            <div className={styles['bk-info']}>
                <button className={styles['bk-bookback']} onClick={handleFlipClick}>
                Flip
                </button>
                <button className={styles['bk-bookview']} onClick={handleViewClick}>
                View inside
                </button>
                <h3>
                <span>{data.author}</span>
                <span>{data.title}</span>
                </h3>
                <p>{data.infoSummary}</p>
            </div>
        </li>
    );
};