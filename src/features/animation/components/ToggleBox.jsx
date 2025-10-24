import React, { useState } from 'react';
import styles from './ToggleBox.module.css'; // 导入样式文件

// React 函数式组件
function ToggleBox() {
    // 1. 使用 useState 来管理一个布尔状态，表示方块是否处于“移动”状态
    const [isMoved, setIsMoved] = useState(false);

    // 2. 定义一个处理点击的函数，用于切换状态
    const handleToggle = () => {
        // 切换 isMoved 的值
        setIsMoved(!isMoved);
    };

    // 3. 根据状态计算要应用的 CSS 类名字符串
    // 如果 isMoved 为 true，则类名是 "box move"
    // 如果 isMoved 为 false，则类名是 "box"
    const boxClassName = isMoved ? `${styles.box} ${styles.move}` : styles.box;

    return (
        <div>
            {/* 按钮点击时，调用 handleToggle，从而改变 state */}
            <button onClick={handleToggle}>
                {isMoved ? '还原动画' : '切换动画'}
            </button>
            
            {/* 声明式：根据 state 决定的 boxClassName 来渲染组件 */}
            {/* 注意在 React 中使用 className 代替 class */}
            <div className={boxClassName}></div>
        </div>
    );
}

export default ToggleBox;