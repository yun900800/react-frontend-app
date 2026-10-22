import React, {useState,useEffect} from "react";
import styles from './FlipPage.module.css';
export const FlipPage = ({dir='next', currentPage, nextPage,
   readingDirection='ltr',
   direction='vertical', current, itemsCount, onEndFlip = () => {}})=>{
    const [pageClass, setPageClass] = useState('');
    const [overlayClass, setOverlayClass] = useState({left:'', middleFront:'', middleBack:'', right:''});
    let transitionDuration = 1000; // 动画持续时间，单位为毫秒
    if ( readingDirection === 'ltr' && (current === itemsCount-1 && dir === 'next' || current === 0 && dir === 'prev') ) {
      transitionDuration = 400;
    }
    if ( readingDirection === 'rtl' && (current === itemsCount-1 && dir === 'prev' || current === 0 && dir === 'next') ) {
      transitionDuration = 400;
    }
    const overlayDuration = transitionDuration / 2; // ms
    const shadowSides = 0.2;
    const shadowSlip = 0.1;
    const isBoundaryFlip =
  (readingDirection === 'ltr' && ((current === itemsCount-1 && dir === 'next') || (current === 0 && dir === 'prev'))) ||
  (readingDirection === 'rtl' && ((current === 0 && dir === 'next') || (current === itemsCount-1 && dir === 'prev')));

    useEffect(() => {
        const rAF = requestAnimationFrame(() => {
            // 3. 立即设置最终样式，触发CSS过渡
            const flipClass = dir === 'next' 
                ? (isBoundaryFlip ? 'bb-flip-next-end' : 'bb-flip-next') 
                : (isBoundaryFlip ? 'bb-flip-prev-end' : 'bb-flip-prev');
            
            setPageClass(flipClass);
            setOverlayClass({
              left: 'o-left-'+dir+'-finished',
              middleFront: 'o-middle-f-'+dir+'-finished',
              middleBack: 'o-middle-b-'+dir+'-finished',
              right: 'o-right-'+dir+'-finished',
            });
        });

        return () => cancelAnimationFrame(rAF);
    }, [dir, isBoundaryFlip]);



    const handleTransitionEnd = (event) => {
      // 确保我们只监听 transform 属性的过渡结束
      if (event.propertyName === 'transform') {
        onEndFlip();
      }
    };
    

  return (
    <>
      <div className={`${styles['bb-page']} ${styles['bb-page-'+direction]} `}
         style={{zIndex:102, transform: direction=== 'vertical' ? 'rotateY(180deg)' : 'rotateX(180deg)'}}>
        <div className={`${styles['bb-back']}`}>
          <div className={styles['bb-outer']}>
            <div className={`${styles['bb-content']}`}>
              <div className={styles['bb-inner']}>
                {dir === 'next' ? currentPage : nextPage}
              </div>
            </div>
            <div 
              className={`${styles['bb-overlay']} ${styles['o-left-'+dir]} ${(overlayClass.left && overlayClass.left !=='') ? styles[overlayClass.left] : '' }`}
              style={{
                '--overlay-duration': `${overlayDuration}ms`,
                '--shadow-sides': `${shadowSides}`,
              }}
              ></div>
          </div>
        </div>
      </div>
      <div onTransitionEnd={handleTransitionEnd}  
          className={
            `
            ${styles['bb-page']} 
            ${styles['bb-page-'+direction]} 
            ${styles[pageClass]} 
            ${dir === 'prev' ? styles['bb-flip-initial'] : ''}
            `
          } 
          style={{zIndex:103, '--transition-duration': `${transitionDuration}ms`}}>
        <div className={`${styles['bb-front']}`}>
          <div className={styles['bb-outer']}>
            <div className={`${styles['bb-content']}`}>
              <div className={styles['bb-inner']}>
                {dir === 'next' ? currentPage : nextPage}
              </div>
            </div>
            <div 
              className={`${styles['bb-flipoverlay']} ${styles['o-middle-f-'+dir]} ${(overlayClass.middleFront && overlayClass.middleFront !=='') ? styles[overlayClass.middleFront] : '' }`}
              style={{
                '--overlay-duration': `${overlayDuration}ms`,
                '--shadow-flip': `${shadowSlip}`,
              }}
              ></div>
          </div>
        </div>
        <div className={`${styles['bb-back']}`}>
          <div className={styles['bb-outer']}>
            <div className={`${styles['bb-content']}`}>
              <div className={styles['bb-inner']}>
                {dir === 'next' ? nextPage : currentPage}
              </div>
            </div>
            <div 
              className={`${styles['bb-flipoverlay']} ${styles['o-middle-b-'+dir]} ${(overlayClass.middleBack && overlayClass.middleBack !=='') ? styles[overlayClass.middleBack] : '' }`}
              style={{
                '--overlay-duration': `${overlayDuration}ms`,
                '--shadow-flip': `${shadowSlip}`,
              }}
              ></div>
          </div>
        </div>
      </div>

      <div className={`${styles['bb-page']} ${styles['bb-page-'+direction]}`} style={{zIndex:101}}>
        <div className={`${styles['bb-front']}`}>
          <div className={styles['bb-outer']}>
            <div className={`${styles['bb-content']}`}>
              <div className={styles['bb-inner']}>
                {dir === 'next' ? nextPage : currentPage}
              </div>
            </div>
            <div className={`${styles['bb-overlay']} ${styles['o-right-'+dir]} ${(overlayClass.right && overlayClass.right !=='') ? styles[overlayClass.right] : '' }`} 
              style={{
                '--overlay-duration': `${overlayDuration}ms`,
                '--shadow-sides': `${shadowSides}`,
              }}></div>
          </div>
        </div>
      </div>
    </>
  )
}