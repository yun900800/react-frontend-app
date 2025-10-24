import React from 'react';
import { CSSTransition } from 'react-transition-group';
import styles from './FadeModal.module.css'; 

// 动画的持续时间，必须和 CSS 中的 transition 保持一致
const DURATION = 300; 

// Modal 组件 (要被 CSSTransition 包裹)
export const Modal = ({ show, onClose }) => {
    // 关键：nodeRef 用于引用 DOM 元素，帮助 CSSTransition 正确找到元素
    const nodeRef = React.useRef(null);
    
    return (
        // in={show} 控制 Modal 的挂载/卸载
        <CSSTransition
            in={show}
            timeout={DURATION} // 必须与 CSS 动画时间匹配
            classNames={{
                enter: styles['fade-enter'],
                enterActive: styles['fade-enter-active'],
                exit: styles['fade-exit'],
                exitActive: styles['fade-exit-active'],
            }}
            unmountOnExit // 卸载完成后，从 DOM 中移除元素
            nodeRef={nodeRef} // 必须传入 nodeRef
        >
            {/* Modal 的 DOM 结构，必须有一个 ref 属性 */}
            <div className={styles.modal} onClick={onClose} ref={nodeRef}>
                <div 
                    className={styles.content} 
                    // 阻止点击内容区域时关闭 Modal
                    onClick={(e) => e.stopPropagation()}
                >
                    <h3>模态框内容</h3>
                    <p>当 `show` 状态变为 false 时，组件会执行淡出动画后再被移除。</p>
                    <button onClick={onClose}>关闭</button>
                </div>
            </div>
        </CSSTransition>
    );
};