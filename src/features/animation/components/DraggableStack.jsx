import React, { useState, useRef, useCallback } from 'react';
import { useSprings, useSpring, animated, to } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import styles from './DraggableStack.module.css';

// 卡片数据
const cards = [
    { id: 1, content: '卡片 1', background: '#ffe0b2' },
    { id: 2, content: '卡片 2', background: '#ffcc80' },
    { id: 3, content: '卡片 3', background: '#ffb74d' },
    { id: 4, content: '卡片 4', background: '#ffa726' },
    { id: 5, content: '卡片 5', background: '#ff9800' },
];

// 计算卡片堆叠时的位置、旋转和缩放
// `i` 是索引，`current` 是当前拖拽的卡片索引，`active` 是否正在拖拽
const fn = (order, active = false, current = -1, len = cards.length) => (i) => {
    const x = (i - order) * 10; // 堆叠时的 X 偏移
    const y = (i - order) * 10; // 堆叠时的 Y 偏移
    const scale = active && i === current ? 1.1 : 1; // 拖拽时放大
    const rot = active && i === current ? 0 : (i - order) * -5; // 拖拽时扶正，否则倾斜

    // 当卡片被拖拽到最前面时，它的 Z-index 最高
    const zIndex = active && i === current ? len : len - order;
    
    // 透明度，如果被拖拽出去了就变为 0
    const opacity = 1;

    return {
        x,
        y,
        scale,
        rot,
        zIndex,
        opacity,
        shadow: active && i === current ? 15 : 5, // 拖拽时阴影加深
        immediate: active && i === current // 拖拽卡片立即响应，其他卡片缓动
            ? (key) => key === 'zIndex'
            : false,
    };
};

export function DraggableStack() {
    // 跟踪卡片的原始排序
    const [order, setOrder] = useState(cards.map((_, i) => i)); 
    const springRefs = useRef([]); // 用于存储每个 spring 动画的引用
    
    // ==========================================================
    // useSprings: 为每个卡片创建一个独立的物理动画
    // ==========================================================
    const [springs, api] = useSprings(cards.length, (i) => ({
        x: fn(order)(i).x,
        y: fn(order)(i).y,
        scale: 1,
        rot: fn(order)(i).rot,
        zIndex: cards.length - i, // 初始 Z-index 堆叠
        shadow: 5,
        opacity: 1,
        from: {
            x: 0, y: 0, scale: 1, rot: 0, opacity: 0 // 初始从中心点淡入
        },
        config: { mass: 1, tension: 500, friction: 50 }, // 物理学配置
    }));

    // ==========================================================
    // useDrag: 实现拖拽手势
    // ==========================================================
    const bind = useDrag(
        ({ args: [originalIndex], active, movement: [mx, my], direction: [dx], velocity: [vx, vy], down }) => {
            
            // 找到被拖拽的卡片在当前 order 数组中的位置
            const currentOrderIndex = order.indexOf(originalIndex);
            
            // 计算新的位置
            let newX = active ? mx : 0;
            let newY = active ? my : 0;
            let newRot = active ? mx / 100 + (down ? 0 : dx * 20) : fn(order)(originalIndex).rot;
            let newScale = active ? 1.1 : 1;
            let newShadow = active ? 15 : 5;
            let newOpacity = 1;

            // 当松开手势，且速度够快时，让卡片飞出（模拟删除）
            if (!active && (Math.abs(vx) > 0.1 || Math.abs(vy) > 0.1)) {
                 // 飞出屏幕，并逐渐透明
                newX = (window.innerWidth + 200) * (dx > 0 ? 1 : -1); 
                newY = (window.innerHeight + 200) * (vy > 0 ? 1 : -1);
                newRot = newRot + dx * 200;
                newOpacity = 0;
            }

            api.start((i) => {
                if (i === originalIndex) {
                    // 这是被拖拽的卡片，直接跟随手势或飞出
                    return {
                        x: newX,
                        y: newY,
                        scale: newScale,
                        rot: newRot,
                        shadow: newShadow,
                        opacity: newOpacity,
                        zIndex: cards.length, // 拖拽时始终在最上面
                        immediate: (key) => key === 'zIndex' || active, // 拖拽时立即响应
                        onRest: () => {
                            // 如果卡片飞出，则将其从 order 中移除
                            if (newOpacity === 0) {
                                setOrder((prevOrder) => {
                                    const newOrder = prevOrder.filter(item => item !== originalIndex);
                                    // 重新计算其他卡片的位置
                                    api.start((j) => {
                                        const finalIndex = newOrder.indexOf(j);
                                        if (finalIndex !== -1) {
                                            return {
                                                x: fn(finalIndex, false, -1, newOrder.length)(finalIndex).x,
                                                y: fn(finalIndex, false, -1, newOrder.length)(finalIndex).y,
                                                rot: fn(finalIndex, false, -1, newOrder.length)(finalIndex).rot,
                                                zIndex: newOrder.length - finalIndex,
                                                shadow: 5,
                                                opacity: 1,
                                                immediate: false, // 其他卡片平滑移动
                                            };
                                        }
                                        return {}; // 已经移除的卡片不需要更新
                                    });
                                    return newOrder;
                                });
                            }
                        }
                    };
                } else {
                    // 其他卡片：如果当前有卡片被拖拽，则根据拖拽卡片的位置进行调整
                    // 这里我们保持简单，当拖拽卡片飞出后，其他卡片会重新排列
                    return {};
                }
            });
        },
        { eventOptions: { passive: false } } // 确保可以在移动设备上阻止默认行为
    );

    return (
        <div className={styles.container}>
            {springs.map(({ x, y, rot, scale, shadow, opacity, zIndex }, i) => (
                <animated.div
                    key={cards[i].id}
                    ref={(el) => (springRefs.current[i] = el)} // 存储 ref
                    className={styles['item-wrapper']}
                    style={{
                        zIndex: zIndex,
                        opacity: opacity,
                        // 使用 to() 结合多个动画值来创建复杂的 transform
                        transform: to(
                            [x, y, rot, scale],
                            (x, y, r, s) => `translate3d(${x}px, ${y}px, 0) rotateZ(${r}deg) scale(${s})`
                        ),
                        background: cards[i].background,
                        boxShadow: shadow.to((s) => `0 ${s}px ${s * 2}px rgba(0, 0, 0, 0.1)`),
                    }}
                    {...bind(i)} // 将拖拽手势绑定到每个卡片
                >
                    <h2>{cards[i].content}</h2>
                </animated.div>
            ))}
        </div>
    );
}

export function SimpleUseSpringExample() {
    const [isVisible, setIsVisible] = useState(false);

    // ==========================================================
    // useSpring 核心：根据 isVisible 状态定义两个目标样式
    // ==========================================================
    const springProps = useSpring({
        // 目标状态：如果 isVisible 为 true
        opacity: isVisible ? 1 : 0,           // 目标透明度
        x: isVisible ? 0 : -100,              // 目标 X 轴位置 (0 表示原位，-100 表示左移 100px)
        
        // 初始状态 (可选，但推荐用于清晰定义)
        from: { opacity: 0, x: -100 },
        
        // 物理学配置 (可选，默认配置已经很好)
        config: { mass: 1, tension: 280, friction: 30 },
    });

    return (
        <div style={{ padding: '20px' }}>
            <h2>UseSpring 基础示例：滑入淡出</h2>
            
            <button 
                onClick={() => setIsVisible(!isVisible)}
                style={{ marginBottom: '20px' }}
            >
                {isVisible ? '隐藏' : '显示'} 盒子
            </button>
            
            {/* 关键步骤：使用 animated.div 并将 props 传递给 style */}
            <animated.div
                style={{
                    width: 200,
                    height: 100,
                    background: '#66bb6a', // 绿色
                    borderRadius: 8,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    fontSize: '1.2em',
                    
                    // 1. 绑定透明度动画属性
                    opacity: springProps.opacity,
                    
                    // 2. 绑定 X 轴位移动画属性，使用 transform
                    transform: springProps.x.to(x => `translateX(${x}px)`), 
                    
                    // 注意：这里的 position: relative 或 absolute 是必要的，
                    // 以确保 translateX(x) 可以正确计算
                    position: 'relative', 
                }}
            >
                Hello Spring!
            </animated.div>
        </div>
    );
}