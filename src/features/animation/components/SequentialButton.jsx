import React, { useState ,useRef,useCallback } from 'react';
import { motion , useAnimation  } from "framer-motion";
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

export const SequentialButtonMotion = () => {
  const [isOpen, setIsOpen] = useState(false); // true = open, false = closed
  const [isAnimating, setIsAnimating] = useState(false);

  // 每条线的控制器
  const line1Controls = useAnimation();
  const line2Controls = useAnimation();
  const line3Controls = useAnimation();

  // 打开动画
  const openSequence = async () => {
    setIsAnimating(true);
    await Promise.all([
      line1Controls.start({ y: 0, rotate: 45, scaleX: 1, scaleY: 1, backgroundColor: "#333" }),
      line2Controls.start({ opacity: 0 }),
      line3Controls.start({ y: 0, rotate: -45, scaleX: 1, scaleY: 1, backgroundColor: "#333" }),
    ]);
    setIsAnimating(false);
  };

  // 关闭动画：X → warning → 汉堡
  const closeSequence = async () => {
    setIsAnimating(true);

    // 1. Warning (感叹号)
    await Promise.all([
      line1Controls.start({ y: -5, scaleY: 4, scaleX: 0.1, backgroundColor: "orange" }),
      line2Controls.start({ opacity: 0 }),
      line3Controls.start({ y: 20, scaleX: 0.1, backgroundColor: "orange" }),
    ]);

    // 2. 延迟一小段时间，模拟 warning 动画持续
    await new Promise((res) => setTimeout(res, 300));

    // 3. 回到初始汉堡状态
    await Promise.all([
      line1Controls.start({ y: -13, rotate: 0, scaleX: 1, scaleY: 1, backgroundColor: "#333" }),
      line2Controls.start({ opacity: 1 }),
      line3Controls.start({ y: 13, rotate: 0, scaleX: 1, scaleY: 1, backgroundColor: "#333" }),
    ]);

    setIsAnimating(false);
  };

  const handleToggle = async () => {
    if (isAnimating) return; // 避免动画中点击打断
    if (!isOpen) {
      setIsOpen(true);
      await openSequence();
    } else {
      await closeSequence();
      setIsOpen(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 60 }}>
      <p>菜单状态: {isOpen ? "已打开" : "已关闭"}</p>

      <motion.div
        className={styles["menu-button"]}
        onClick={handleToggle}
        style={{ cursor: "pointer" }}
      >
        <motion.div
          className={`${styles.line} ${styles["line-1"]}`}
          animate={line1Controls}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
        <motion.div
          className={`${styles.line} ${styles["line-2"]}`}
          animate={line2Controls}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
        <motion.div
          className={`${styles.line} ${styles["line-3"]}`}
          animate={line3Controls}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      </motion.div>

      <p>关闭时会先变成感叹号，再平滑回到汉堡状态。</p>
    </div>
  );
};

export const SequentialButtonKeyframes = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayState, setDisplayState] = useState(DISPLAY_STATES.INITIAL);

  const handleAnimationEnd = (event) => {
    // 监听最后一条线动画结束即可
    if (event.animationName.includes('line-3-sequence')) {
      setDisplayState(DISPLAY_STATES.INITIAL);
    }
  };

  const handleToggle = () => {
    const nextIsOpen = !isOpen;
    setIsOpen(nextIsOpen);

    if (displayState === DISPLAY_STATES.CLOSING) {
      setDisplayState(nextIsOpen ? DISPLAY_STATES.OPEN : DISPLAY_STATES.INITIAL);
      return;
    }

    if (nextIsOpen) {
      setDisplayState(DISPLAY_STATES.OPEN);
    } else {
      // ✅ 修复关键：强制浏览器认为动画属性被移除
      setDisplayState(DISPLAY_STATES.INITIAL);
      void document.body.offsetHeight; // ⚡ 强制 reflow，触发动画重播
      setDisplayState(DISPLAY_STATES.CLOSING);
    }
  };

  const buttonClassName = `${styles['menu-button']} ${styles[displayState]}`;

  return (
    <div>
      <p>菜单状态: {isOpen ? '已打开' : '已关闭'}</p>
      <p>显示状态: **{displayState}**</p>

      <div className={buttonClassName} onClick={handleToggle}>
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