import React, { useState, useRef, useMemo } from 'react';
import { CSSTransition, TransitionGroup, Transition } from 'react-transition-group';
import styles from './StaggeredList.module.css';

// 假设的列表数据
const LIST_ITEMS = ['项目 A', '项目 B', '项目 C', '项目 D', '项目 E'];
const CHILD_DURATION = 300;     // 子项动画时长
const STAGGER_DELAY = 80;       // 子项级联延迟
const CONTAINER_DURATION = 500; // 容器展开/收缩的总时长 (要长于子项动画)

// 用于 CSSTransition 的 Ref 数组
const itemRefs = LIST_ITEMS.map(() => React.createRef());

export function ExpandedList() {
    const [showList, setShowList] = useState(false);
    
    // 用于获取和操作容器 DOM 的 Ref
    const listRef = useRef(null);
    
    // 计算子项动画的总时长，用于 TransitionGroup 的 timeout
    const totalChildAnimationTime = useMemo(() => {
        return CHILD_DURATION + LIST_ITEMS.length * STAGGER_DELAY;
    }, []);

    // ==========================================================
    // JS 动画核心：使用 Transition 组件的 Hook 来操作 DOM 样式
    // ==========================================================
    
    // 1. 进入前 (Entering): 容器开始展开前
    const onEnter = () => {
        const node = listRef.current; // <--- 关键修正点：总是从 Ref 中获取节点
        if (!node) return; // 安全检查

        // 确保动画从收缩状态开始
        node.style.height = '0';
        node.style.opacity = '0';
        node.style.transform = 'scaleY(0.9)';
    };

    // 2. 进入激活 (Entering): 容器开始展开
    const onEntering = () => {
        const node = listRef.current; // <--- 关键修正点：总是从 Ref 中获取节点
        if (!node) return; // 安全检查

        // 强制浏览器计算并获取自然的滚动高度 (这是内容完全展开时的高度)
        const scrollHeight = node.scrollHeight;
        
        // 设置目标样式，触发 CSS Transition
        node.style.height = `${scrollHeight}px`;
        node.style.opacity = '1';
        node.style.transform = 'scaleY(1)';

        // 应用过渡属性
        node.style.transition = `
            height ${CONTAINER_DURATION}ms ease-in-out,
            opacity ${CONTAINER_DURATION}ms ease-in-out,
            transform ${CONTAINER_DURATION}ms ease-in-out
        `;
    };
    
    // 3. 进入结束 (Entered): 容器展开动画完成
    const onEntered = () => {
        const node = listRef.current; // <--- 关键修正点：总是从 Ref 中获取节点
        if (!node) return;
        // 清除高度，让容器恢复到自然高度 ('auto')，避免因内容变化导致滚动条问题
        node.style.height = 'auto';
        node.style.transition = ''; // 清除 transition 属性
    };

    // 4. 退出前 (Exiting): 容器开始收缩前
    const onExit = () => {
        const node = listRef.current; // <--- 关键修正点：总是从 Ref 中获取节点
        if (!node) return;
        // 确保从当前实际高度开始收缩，而不是 'auto'
        node.style.height = `${node.scrollHeight}px`;
        node.style.transition = `
            height ${CONTAINER_DURATION}ms ease-in-out,
            opacity ${CONTAINER_DURATION}ms ease-in-out,
            transform ${CONTAINER_DURATION}ms ease-in-out
        `;
    };

    // 5. 退出激活 (Exiting): 容器开始收缩
    const onExiting = () => {
        const node = listRef.current; // <--- 关键修正点：总是从 Ref 中获取节点
        if (!node) return;
        // 目标样式：收缩到 0，执行缩放动画
        node.style.height = '0';
        node.style.opacity = '0';
        node.style.transform = 'scaleY(0.9)'; 
    };

    // 6. 退出结束 (Exited): 容器收缩动画完成
    const onExited = () => {
        // 动画完成后，Transition 已经将节点从 DOM 移除 (如果 unmountOnExit 为 true)
        const node = listRef.current; // <--- 关键修正点：总是从 Ref 中获取节点
        if (!node) return;
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>容器展开/收缩 + 子项级联飞入</h2>
            <button onClick={() => setShowList(!showList)}>
                {showList ? '收起列表' : '展开列表'}
            </button>

            {/* 关键：使用 Transition 组件控制容器的动画 */}
            <Transition 
                in={showList} 
                timeout={CONTAINER_DURATION} 
                onEnter={onEnter}
                onEntering={onEntering}
                onEntered={onEntered}
                onExit={onExit}
                onExiting={onExiting}
                onExited={onExited}
                unmountOnExit
                nodeRef={listRef} // 传递容器的 Ref
            >
                {/* 整个列表容器的 DOM 结构，附带 Ref */}
                <div ref={listRef} className={styles['list-container']}>
                    
                    {/* 嵌套 TransitionGroup 实现子项的级联动画 */}
                    <TransitionGroup component={null}>
                        {/* 无论 showList 状态如何，我们只在父容器被渲染时渲染子项 */}
                        {LIST_ITEMS.map((item, index) => {
                            const delayStyle = {
                                // 只有在进入时才使用延迟，退出时立即开始
                                transitionDelay: showList ? `${index * STAGGER_DELAY}ms` : '0ms', 
                            };
                            
                            const nodeRef = itemRefs[index];
                            
                            return (
                                <CSSTransition
                                    key={item}
                                    // 子项动画的 timeout 必须长于其自身的延迟
                                    timeout={CHILD_DURATION + (LIST_ITEMS.length - 1 - index) * STAGGER_DELAY} 
                                    classNames={{
                                        enter: styles['fly-enter'],
                                        enterActive: styles['fly-enter-active'],
                                        exit: styles['fly-exit'],
                                        exitActive: styles['fly-exit-active'],
                                    }}
                                    nodeRef={nodeRef}
                                >
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
            </Transition>
            
            <p style={{ marginTop: '20px', fontSize: '14px' }}>
                **惊艳点：** 外部 `Transition` 负责在 JS 中计算高度，实现平滑的展开/收缩和缩放动画；内部 `TransitionGroup` 负责触发子项的级联飞入动画。两种动画同步进行，视觉效果非常流畅且专业。
            </p>
        </div>
    );
}