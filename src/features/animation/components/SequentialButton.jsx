import React, { useState ,useRef,useCallback } from 'react';
import styles from  './SequentialButton.module.css'; 

// 定义状态常量
const DISPLAY_STATES = {
    INITIAL: 'initial',
    OPEN: 'is-open',
    WARNING: 'is-warning',
    CLOSING: 'is-closing'
};

// 动画持续时间（需要与 CSS 中的 transition-duration 匹配）
const WARNING_ANIMATION_DURATION = 500; // 500毫秒

function SequentialButton() {
    // 菜单的实际业务状态：是否打开
    const [isOpen, setIsOpen] = useState(false);
    
    // 菜单的显示/动画状态：决定应用哪个 CSS 类
    const [displayState, setDisplayState] = useState(DISPLAY_STATES.INITIAL);

    const handleToggle = () => {
        const nextIsOpen = !isOpen;
        setIsOpen(nextIsOpen); // 切换业务状态

        if (nextIsOpen) {
            // =========================
            // 场景 1: 菜单打开 (Initial -> Open)
            // =========================
            
            // 直接进入 OPEN 状态，CSS transition 会平滑过渡
            setDisplayState(DISPLAY_STATES.OPEN);

        } else {
            // =========================
            // 场景 2: 菜单关闭 (Open -> Warning -> Initial)
            // =========================

            // 1. 立即切换到 WARNING 状态，触发警告动画
            setDisplayState(DISPLAY_STATES.WARNING);

            // 2. 设置定时器，等待 WARNING 动画播放完毕
            setTimeout(() => {
                // 3. 切换回 INITIAL 状态 (关闭)
                setDisplayState(DISPLAY_STATES.INITIAL);
            }, WARNING_ANIMATION_DURATION); 
            // 注意：这个时间要大于 CSS 警告状态的过渡时间
        }
    };

    // 动态计算 className
    const buttonClassName = `${styles['menu-button']} ${styles[displayState]}`;

    return (
        <div>
            <p>菜单状态: {isOpen ? '已打开' : '已关闭'}</p>
            <p>显示状态: **{displayState}**</p>
            
            {/* 按钮容器，点击时切换状态 */}
            <div className={buttonClassName} onClick={handleToggle}>
                <div className={`${styles['line']} ${styles['line-1']}`}></div>
                <div className={`${styles['line']} ${styles['line-2']}`}></div>
                <div className={`${styles['line']} ${styles['line-3']}`}></div>
            </div>
            
            <p>关闭时会先变成 **!** 号 0.5 秒</p>
        </div>
    );
}


export const SequentialButtonEvent = () => {
    // 菜单的实际业务状态：是否打开
    const [isOpen, setIsOpen] = useState(false);
    // 菜单的显示/动画状态
    const [displayState, setDisplayState] = useState(DISPLAY_STATES.INITIAL);
    
    // **核心改动：将事件监听器移到子元素上**
    const handleLineTransitionEnd = (event) => {
        if (event.propertyName !== 'transform') {
            return;
        }
        // 关键检查 1: 确保事件是由我们关心的状态（WARNING）过渡触发
        if (displayState !== DISPLAY_STATES.WARNING) {
            // 如果不是 WARNING 状态结束，忽略
            return;
        }
        
        // 关键检查 2 (可选): 确保是 line-1 自身的过渡结束，而不是其内部属性的过渡
        // 通常 event.propertyName 可以用来检查是哪个 CSS 属性结束了过渡

        console.log('Transition ended for state:', displayState);
        
        // 切换回 INITIAL 状态 (关闭)
        setDisplayState(DISPLAY_STATES.INITIAL);
    };

    const handleToggle = () => {
        const nextIsOpen = !isOpen;
        setIsOpen(nextIsOpen);

        // 如果菜单当前处于 WARNING 状态，且用户再次点击，我们应该中断它
        if (displayState === DISPLAY_STATES.WARNING) {
            // 直接切换到目标状态，防止状态机卡住
            if (nextIsOpen) {
                setDisplayState(DISPLAY_STATES.OPEN); // 强制打开
            } else {
                setDisplayState(DISPLAY_STATES.INITIAL); // 强制关闭
            }
            return;
        }

        if (nextIsOpen) {
            // 打开：直接进入 OPEN 状态
            setDisplayState(DISPLAY_STATES.OPEN);

        } else {
            // 关闭：进入 WARNING 状态，依赖 line-1 的 onTransitionEnd 来完成最后一步
            setDisplayState(DISPLAY_STATES.WARNING);
        }
    };

    // 动态计算 className
    const buttonClassName = `${styles['menu-button']} ${styles[displayState]}`;

    return (
        <div>
            <p>菜单状态: {isOpen ? '已打开' : '已关闭'}</p>
            <p>显示状态: **{displayState}**</p>
            
            <div 
                className={buttonClassName} 
                onClick={handleToggle}
            >
                {/* 关键改动：将 onTransitionEnd 放在实际过渡的元素上 */}
                <div 
                    className={`${styles['line']} ${styles['line-1']}`}
                    onTransitionEnd={handleLineTransitionEnd} // <--- 监听 line-1
                ></div>
                
                <div className={`${styles['line']} ${styles['line-2']}`}></div>
                <div className={`${styles['line']} ${styles['line-3']}`}></div>
            </div>
            
            <p>关闭时会先变成 **!** 号，时间由 CSS 决定。</p>
        </div>
    );
}

export const SequentialButtonKeyframes = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [displayState, setDisplayState] = useState(DISPLAY_STATES.INITIAL);

    // 监听 Keyframe 动画结束
    const handleAnimationEnd = (event) => {
        // 关键检查 1: 确保事件是由我们关心的动画（CLOSING）触发的
        if (displayState !== DISPLAY_STATES.CLOSING) return;
        
        // 关键检查 2: 确保是整个 closing-sequence 动画结束
        // 注意：这里的 'closing-sequence' 必须和 CSS Keyframes 的名称保持一致
        if (event.animationName !== 'closing-sequence') return;

        console.log('Keyframe Animation Finished: Switching to INITIAL');
        
        // Keyframe 动画结束，切换回 INITIAL 状态
        setDisplayState(DISPLAY_STATES.INITIAL);
    };

    const handleToggle = () => {
        const nextIsOpen = !isOpen;
        setIsOpen(nextIsOpen);

        // 如果当前处于 CLOSING 状态，再次点击应该中断动画并立即切换
        if (displayState === DISPLAY_STATES.CLOSING) {
            // 强制切换到 OPEN 或 INITIAL，并清除动画类
            setDisplayState(nextIsOpen ? DISPLAY_STATES.OPEN : DISPLAY_STATES.INITIAL);
            return;
        }

        if (nextIsOpen) {
            // 打开：直接进入 OPEN 状态 (平滑过渡)
            setDisplayState(DISPLAY_STATES.OPEN);

        } else {
            // 关闭：进入 CLOSING 状态，触发 Keyframes 序列
            setDisplayState(DISPLAY_STATES.CLOSING);
        }
    };

    // 动态计算 className
    const buttonClassName = `${styles['menu-button']} ${styles[displayState]}`;

    return (
        <div>
            <p>菜单状态: {isOpen ? '已打开' : '已关闭'}</p>
            <p>显示状态: **{displayState}**</p>
            
            <div 
                className={buttonClassName} 
                onClick={handleToggle}
            >
                {/* 监听 Keyframes 动画结束的事件：onAnimationEnd */}
                <div 
                    className={`${styles['line']} ${styles['line-1']}`}
                    onAnimationEnd={handleAnimationEnd} 
                ></div>
                
                <div className={`${styles['line']} ${styles['line-2']}`}></div>
                <div className={`${styles['line']} ${styles['line-3']}`}></div>
            </div>
            
            <p>{`关闭时序列: 打开 -> 警告 -> 微笑 (Keyframe) -> 关闭 (State)`}</p>
        </div>
    );
};


export default SequentialButton;