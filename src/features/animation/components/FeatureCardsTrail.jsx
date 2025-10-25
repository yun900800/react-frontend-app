import React, { useState, useEffect } from 'react';
import { useTrail, animated } from '@react-spring/web';
import styles from './FeatureCard.module.css';

// 假设的产品功能数据
const FEATURES = [
    { title: "高性能渲染", desc: "利用 GPU 加速，确保 60 FPS 的流畅体验。" },
    { title: "物理学反馈", desc: "基于弹簧的动画，让交互更真实自然。" },
    { title: "声明式 API", desc: "极简的 Hook 驱动，轻松管理复杂动画。" },
    { title: "跨平台兼容", desc: "在 Web 和原生环境都能保持一致的动画表现。" },
    { title: "内置手势支持", desc: "无需额外处理，轻松实现拖拽、缩放。" },
    { title: "优雅的序列化", desc: "自动处理元素的级联和错位动画。" },
];

// 动画配置
const TRAIL_CONFIG = {
    // 物理学配置：提供弹性和阻尼感
    mass: 1, 
    tension: 200, 
    friction: 20,
    // delay: 100, // 整体动画开始前的延迟
};

export function FeatureCardsTrail() {
    // 使用一个状态来模拟组件进入视口
    const [isVisible, setIsVisible] = useState(false);

    // 假设组件已进入视口 (在实际项目中，这里会用 Intersection Observer)
    useEffect(() => {
        // 延时启动，模拟加载或滚动触发
        const timer = setTimeout(() => setIsVisible(true), 500);
        return () => clearTimeout(timer);
    }, []);

    // ==========================================================
    // useTrail 核心：管理一个动画序列
    // ==========================================================
    const trail = useTrail(FEATURES.length, {
        // 目标状态 (isVisible = true)
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 50, // 从底部上移 50px 到原位 0px
        
        // 初始状态 (isVisible = false)
        from: { opacity: 0, y: 50 },
        
        // 配置：包含物理学和延迟
        config: TRAIL_CONFIG,
        
        // 关键：trail 属性定义了每个元素之间动画启动的延迟
        // 延迟 150ms 启动下一个元素的动画
        delay: isVisible ? 150 : 0, 
    });

    return (
        <div className={styles.section}>
            <h1>🎉 我们的核心功能 (useTrail 演示)</h1>
            
            <div className={styles.grid}>
                {/* 遍历 useTrail 返回的动画属性数组 */}
                {trail.map((props, index) => (
                    <animated.div
                        key={FEATURES[index].title}
                        className={styles.card}
                        style={{
                            // 绑定 opacity
                            opacity: props.opacity,
                            // 绑定 y 值到 transform: translateY
                            transform: props.y.to(y => `translateY(${y}px)`),
                        }}
                    >
                        <h3>{FEATURES[index].title}</h3>
                        <p>{FEATURES[index].desc}</p>
                    </animated.div>
                ))}
            </div>
        </div>
    );
}