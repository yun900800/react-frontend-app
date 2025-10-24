import React, { useState, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styles from './StaggeredList.module.css';

// 假设的列表数据
const LIST_ITEMS = ['项目 A', '项目 B', '项目 C', '项目 D', '项目 E'];
const ANIMATION_DURATION = 300; // 必须匹配 CSS 中的 transition-duration
const STAGGER_DELAY = 80;     // 每个项目之间的延迟时间 (80ms)

// 用于 CSSTransition 的 Ref
// 注意：每个 CSSTransition 实例都需要一个唯一的 Ref
const itemRefs = LIST_ITEMS.map(() => React.createRef());

export function StaggeredList() {
    const [showList, setShowList] = useState(false);

    // 计算总延迟时间，用于 TransitionGroup 的 timeout
    const totalDelay = LIST_ITEMS.length * STAGGER_DELAY;
    const finalTimeout = ANIMATION_DURATION + totalDelay;
    
    // 整个列表容器的 Ref（用于 TransitionGroup，虽然 TransitionGroup 不强制要求）
    const listRef = useRef(null);

    return (
        <div style={{ padding: '20px' }}>
            <h2>级联飞入动画 (Staggered Entry)</h2>
            <button onClick={() => setShowList(!showList)}>
                {showList ? '隐藏列表' : '显示列表 (飞入)'}
            </button>
            
            <div ref={listRef} className={styles['list-container']}>
                {/* 关键：使用 TransitionGroup 包裹 CSSTransition 列表 */}
                {/* TransitionGroup 负责管理子组件的挂载/卸载，但它不会添加动画类名 */}
                <TransitionGroup component={null}>
                    {showList && 
                        LIST_ITEMS.map((item, index) => {
                            // 动态计算该项目的延迟
                            const delayStyle = {
                                transitionDelay: `${index * STAGGER_DELAY}ms`,
                            };
                            
                            // 确保为每个 CSSTransition 传入对应的 Ref
                            const nodeRef = itemRefs[index];
                            
                            return (
                                <CSSTransition
                                    key={item}
                                    timeout={finalTimeout} // 必须给一个足够长的 timeout
                                    classNames={{
                                        enter: styles['fly-enter'],
                                        enterActive: styles['fly-enter-active'],
                                        exit: styles['fly-exit'],
                                        exitActive: styles['fly-exit-active'],
                                    }}
                                    nodeRef={nodeRef}
                                >
                                    {/* 将动态计算的延迟样式应用到实际的 DOM 元素上 */}
                                    <div 
                                        ref={nodeRef} 
                                        className={styles.item} 
                                        style={delayStyle}
                                    >
                                        {item}
                                    </div>
                                </CSSTransition>
                            );
                        })}
                </TransitionGroup>
            </div>
            
            <p style={{ marginTop: '20px', fontSize: '14px' }}>
                **原理：** `CSSTransition` 负责应用 `fly-enter` 和 `fly-enter-active`。我们通过 React 动态计算并应用了 `transition-delay` 属性，使每个列表项的飞入时间错开，创造出惊艳的级联效果。
            </p>
        </div>
    );
}