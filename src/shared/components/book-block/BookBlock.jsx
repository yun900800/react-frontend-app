import React, { useState, useRef } from "react";
import styles from "./BookBlock.module.css";
import navStyles from './nav.module.css';
import { FlipPage } from "./FlipPage";

export function BookBlock({ pages, orientation='vertical', direction='ltr',
     width='400px', height='300px', maxWidth='800px' }) {
    const [current,setCurrent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [flipDirection, setFlipDirection] = useState('next');

    // 存储目标页码的 Ref
    const targetPageRef = useRef(0);

    const touchStart = useRef(0);
    const touchEnd = useRef(0);

    const handleTouchStart = (e) => {
      touchStart.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
      touchEnd.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      const delta = touchEnd.current - touchStart.current;
      const threshold = 50; // 滑动距离阈值
      if (Math.abs(delta) < threshold) return;

      if (delta < 0) {
        _navigate('next');
      } else {
        _navigate('prev');
      }
    };
    const itemsCount = pages.length;

    /**
     * 【重构部分 1】: 计算目标页码的纯函数
     * @param {string} dir - 导航请求 ('next', 'prev', 'first', 'last')
     * @param {number} itemsCount - 总页数
     * @param {number} currentPage - 当前页码
     * @param {string} readingDirection - 阅读方向 ('ltr' or 'rtl')
     * @returns {number} 目标页码 (0 到 itemsCount - 1)
     */
    const calculateTargetPage = (dir, itemsCount, currentPage, readingDirection) => {
        let target = currentPage;

        if (dir === 'first') {
            return 0;
        }
        if (dir === 'last') {
            return itemsCount - 1;
        }

        // 确定翻页的有效增量，考虑到阅读方向
        let delta = 0;
        if (dir === 'next') {
            // LTR: +1, RTL: -1
            delta = readingDirection === 'ltr' ? 1 : -1;
        } else if (dir === 'prev') {
            // LTR: -1, RTL: +1
            delta = readingDirection === 'ltr' ? -1 : 1;
        }
        
        target = currentPage + delta;

        // 边界处理：防止越界
        if (target < 0) {
            return 0; // 停留在第一页
        }
        if (target >= itemsCount) {
            return itemsCount - 1; // 停留在最后一页
        }

        return target;
    };
    

    const callback = () =>{
        if (targetPageRef.current !== current) {
             setCurrent(targetPageRef.current);
        }
    };

    const _navigate = (dir,page) =>{
        if (isAnimating) return;
        // 1. 计算目标页码
        let targetPage = calculateTargetPage(dir, itemsCount, current, direction);
        if (page !== undefined) {
            targetPage = page;
        }
        // 2. 检查是否需要翻页（目标页与当前页不同）
        if (targetPage !== current) {
            
            // 3. 存储目标页码并启动动画
            targetPageRef.current = targetPage; // 存储目标页码
            setIsAnimating(true);
            setFlipDirection(dir);  
        } else {
            // 如果目标页与当前页相同（即在边界处点击 Next/Prev）
            // 仍然触发边界动画（较短的抖动效果）
            const isBoundary = (dir === 'next' && current === itemsCount - 1) || (dir === 'prev' && current === 0);
            if (isBoundary) {
                targetPageRef.current = targetPage; // 即使没变，也存储当前页
                setIsAnimating(true);
                setFlipDirection(dir); 
            }
        } 
    }
    return (
        <>
        <div id="bb-bookblock"  
          className={`${styles['bb-bookblock']} ${styles['bb-'+orientation]}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            '--bb-bookblock-width': width,
            '--bb-bookblock-height': height,
            '--bb-bookblock-max-width': maxWidth,
            maxWidth: width + 'px',
            aspectRatio: `${width / height}`,
          }}
          >
          <div className={`${isAnimating ? styles.hide : styles.show }`}>
            {
                pages.map((item,index)=>{
                  return <div key={index} className={`${styles['bb-item']} ${current===index ? styles.show : styles.hide }`}>{item}</div>  
                })
            }
          </div>
            {
              isAnimating && 
                <FlipPage dir={flipDirection} 
                  currentPage={pages[current]} 
                  // nextPage={pages[
                  //       flipDirection === 'next' ? (current + 1) % itemsCount : (flipDirection === 'prev' ? (current - 1 + itemsCount) % itemsCount : ( flipDirection ==='first' ? 0 : itemsCount - 1))
                  // ]} 
                  nextPage={pages[targetPageRef.current]}
                  direction={orientation} 
                  onEndFlip={()=>{
                    setIsAnimating(false);
                    callback();
                  }} 
                  current={current}
                  itemsCount={itemsCount}
                />
            }
        </div>
        
        <nav className={navStyles.nav}>
            <a id="bb-nav-first" href="#" className="bb-custom-icon bb-custom-icon-first" onClick={()=>{
                _navigate('prev',0)
            }}>First page</a>
            <a id="bb-nav-prev" href="#" className="bb-custom-icon bb-custom-icon-arrow-left" onClick={()=>{
                _navigate('prev')
            }}>Previous</a>
            <a id="bb-nav-next" href="#" className="bb-custom-icon bb-custom-icon-arrow-right"onClick={()=>{
                _navigate('next')
            }}>Next</a>
            <a id="bb-nav-last" href="#" className="bb-custom-icon bb-custom-icon-last" onClick={()=>{
                _navigate('next',itemsCount - 1)
            }}>Last page</a>
        </nav>
        </>
    )
}


