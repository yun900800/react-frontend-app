import React, { useState, useEffect, useCallback } from 'react';
import { useSpring, animated } from '@react-spring/web';
import styles from './NewsTicker.module.css';

// 假设的新闻数据
const ORIGINAL_NEWS_ITEMS = [
    "🔥 震惊！React v19 发布日期再次提前！",
    "📚 前端性能优化：掌握 GPU 加速的秘密。",
    "💡 TypeScript 5.5 引入了新的条件类型优化。",
    "🎉 使用 react-spring 轻松实现复杂的物理动画。",
];

// 核心技巧：创建包含克隆的第一条新闻的完整列表 (N + 1)
const NEWS_ITEMS = [...ORIGINAL_NEWS_ITEMS, ORIGINAL_NEWS_ITEMS[0]];

// 每条新闻的高度
const ITEM_HEIGHT = 60;
// 动画的总时长（每条新闻滚动所需时间）
const DURATION_PER_ITEM = 3000; 

// 动画的总时长：从第一条滚动到克隆的第一条所需的时间
const TOTAL_DURATION = DURATION_PER_ITEM * ORIGINAL_NEWS_ITEMS.length;

// 最终的位移距离：从 0px 滚动到 -(N * ITEM_HEIGHT)
const TOTAL_DISTANCE = ORIGINAL_NEWS_ITEMS.length * ITEM_HEIGHT;


export function NewsTickerInfinite() {
    // ==========================================================
    // 核心逻辑：使用 useSpring 和 loop: true
    // ==========================================================
    const [props, api] = useSpring(() => ({ 
        y: 0, 
        config: { duration: TOTAL_DURATION }, // 动画时长
        loop: true, // 关键：设置为无限循环
        
        // 定义动画过程：从顶部 (y: 0) 滚动到列表末尾 (y: -TOTAL_DISTANCE)
        from: { y: 0 },
        to: { y: -TOTAL_DISTANCE },
    }), []);
    

    // ==========================================================
    // 扩展功能：鼠标悬停暂停 (使用 API 控制)
    // ==========================================================
    const handleMouseEnter = () => {
        // 暂停动画：api.pause()
        api.pause();
    };

    const handleMouseLeave = () => {
        // 恢复动画：api.resume()
        api.resume();
    };


    return (
        <div 
            style={{ padding: '20px' }}
        >
            <h2>React-Spring 无限循环跑马灯 (Loop 模式)</h2>
            <div 
                className={styles.tickerContainer} 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}
            >
                {/* 动画内容：将所有新闻项包裹在一个 animated.div 中 */}
                <animated.div
                    className={styles.contentWrapper}
                    style={{
                        // 核心：绑定 y 值到 translateY
                        transform: props.y.to(y => `translateY(${y}px)`),
                        willChange: 'transform', 
                    }}
                >
                    {/* 渲染 N+1 条新闻，实现平滑的无限滚动 */}
                    {NEWS_ITEMS.map((item, i) => (
                        <div 
                            key={`news-${i}`} 
                            className={styles.newsItem}
                            // 确保每条新闻的高度正确应用
                            style={{ height: `${ITEM_HEIGHT}px` }}
                        >
                            {/* 区分第一条新闻和克隆的第一条新闻 */}
                            {i === ORIGINAL_NEWS_ITEMS.length ? `[循环开始] ${item}` : item}
                        </div>
                    ))}
                </animated.div>
            </div>
            <p style={{marginTop: '10px', fontSize: '12px'}}>
                **无限循环原理：** `useSpring` 从 `y: 0` 动画到 `y: -${TOTAL_DISTANCE}` (克隆项的位置)。当 `loop: true` 时，`react-spring` 会在动画结束后**立即且瞬间**将 `y` 值重置回 `0`，因为克隆项和第一项的样式和内容一致，用户看不到瞬移。
            </p>
        </div>
    );
}