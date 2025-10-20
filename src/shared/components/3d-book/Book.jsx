import React, {useState} from "react";
import { BookPageContent } from "./BookPageContent.jsx";
import styles from './Book.module.css';
export const Book = ({ data }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isInsideView, setIsInsideView] = useState(false);
    let bookClasses = `${styles['bk-book']} ${styles[`book-${data.id}`]} ${styles['bk-bookdefault']}`;
    if (isFlipped) {
        // 对应 JS 中的 .addClass('bk-viewback')
        bookClasses = bookClasses.replace(` ${styles['bk-bookdefault']}`, '') + ` ${styles['bk-viewback']}`;
    }
    if (isInsideView) {
        // 假设内部视图的类名是 bk-view-inside
        bookClasses += ` ${styles['bk-viewinside']}`;
    }
    const pages = data.pages || [];
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
                        isCurrent={index === 0} // 默认第一个页面是 current
                    />
                ))}
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
                <button className={styles['bk-bookback']} onClick={() => setIsFlipped(!isFlipped)}>
                Flip
                </button>
                <button className={styles['bk-bookview']} onClick={() => setIsInsideView(!isInsideView)}>
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