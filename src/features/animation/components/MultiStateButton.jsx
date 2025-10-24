import React, { useState } from 'react';
import styles from './MultiStateButton.module.css'; // 导入与上文相同的 CSS (只是文件名不同)

// 定义所有的状态
const STATES = {
    INITIAL: 'initial',  // 初始状态 (默认)
    OPEN: 'is-open',     // 菜单打开状态
    WARNING: 'is-warning'// 警告状态
};

function MultiStateButton() {
    // 1. 使用 State 来管理当前的状态名称
    const [currentState, setCurrentState] = useState(STATES.INITIAL);

    // 2. 定义状态切换逻辑
    const handleToggle = () => {
        let nextState;
        
        switch (currentState) {
            case STATES.INITIAL:
                nextState = STATES.OPEN;
                break;
            case STATES.OPEN:
                nextState = STATES.WARNING;
                break;
            case STATES.WARNING:
                nextState = STATES.INITIAL;
                break;
            default:
                nextState = STATES.INITIAL;
        }
        
        setCurrentState(nextState);
    };

    // 3. 动态计算 className
    // 基础类名是 'menu-button'
    // 只有非 INITIAL 状态才需要添加对应的状态类名
    const buttonClassName = `${styles['menu-button']} ${currentState !== STATES.INITIAL ? styles[currentState] : ''}`;

    return (
        <div>
            <p>当前状态: **{currentState}**</p>
            
            {/* 按钮容器，点击时切换状态 */}
            <div className={buttonClassName} onClick={handleToggle}>
                <div className={`${styles['line']} ${styles['line-1']}`}></div>
                <div className={`${styles['line']} ${styles['line-2']}`}></div>
                <div className={`${styles['line']} ${styles['line-3']}`}></div>
            </div>

            <p>{`点击按钮可在 Initial -> Open -> Warning 之间切换`}</p>
        </div>
    );
}

export default MultiStateButton;