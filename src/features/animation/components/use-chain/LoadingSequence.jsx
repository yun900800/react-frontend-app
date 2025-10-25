import React, { useRef, useEffect } from 'react';
import { useSpring, useTrail, useChain, animated } from '@react-spring/web';
import styles from './LoadingSequence.module.css';

const MENU_ITEMS = ['首页', '产品', '关于', '联系'];

export function LoadingSequence() {
    // 1. Logo 动画 (放大、旋转和透明度，使其更具视觉冲击力)
    const [logoSpring, logoSpringApi] = useSpring(() => ({
        // 增强初始状态：从完全隐藏、缩小且大幅度旋转开始
        from: { scale: 0, rot: -180, opacity: 0 }, 
        // 调整弹簧配置，让动画效果更明显
        config: { mass: 1.5, tension: 250, friction: 20 },
        // immediate: true,
    }));

    // 2. Title 动画 (淡入)
    const [titleSpring, titleSpringApi] = useSpring(() => ({
        from: { opacity: 0 },
        config: { duration: 1500 },
        // immediate: true, 
    }));

    // 3. Menu 动画 (级联飞入)
    const [menuTrail, menuTrailApi] = useTrail(MENU_ITEMS.length, () => ({
        from: { opacity: 0, x: 50 },
        config: { mass: 1, tension: 200, friction: 15 },
        // immediate: true, 
    }));

    // ==========================================================
    // 核心：使用 useEffect 和 async/await 进行手动链式调用
    // ==========================================================
    useEffect(() => {
        const runChain = async () => {
            // 步骤 1: 启动 Logo 动画 (等待完成)
            await logoSpringApi.start({ 
                // 目标状态：放大到1，旋转归零，完全显示
                to: { scale: 1, rot: 0, opacity: 1 } 
            });

            // 步骤 2: 启动 Title 动画 (等待完成)
            await titleSpringApi.start({ to: { opacity: 1 } });

            // 步骤 3: 启动 Menu 级联动画 (无需等待，在后台完成级联)
            menuTrailApi.start({ 
                to: { opacity: 1, x: 0 }, 
                delay: 50 
            });
        };

        runChain();
    }, [logoSpringApi, titleSpringApi, menuTrailApi]); 

    return (
        <div className={styles.container}>
            {/* 注入全局样式，确保 CSS 变量不会干扰 */}
            <style jsx="true">{`
                h1, div { margin: 0; }
                body { margin: 0; }
            `}</style>
            
            {/* A. 渲染 Logo */}
            <animated.div
                className={styles.logoBox}
                style={{
                    opacity: logoSpring.opacity,
                    // 保持 to() 链式调用，处理 scale 和 rotate
                    // ⚡️ 修复: 使用 animated.to 辅助函数正确组合 scale 和 rotate
                    // 修复：直接将 scale 和 rot 属性传入 style，让 react-spring 自动组合 transform
                    scale: logoSpring.scale,
                    rotate: logoSpring.rot.to(r => `${r}deg`),
                }}
            />
            
            {/* B. 渲染 Title */}
            <animated.h1
                className={styles.title}
                style={{ ...titleSpring }}
            >
                Spring App
            </animated.h1>

            {/* C. 渲染 Menu */}
            <div className={styles.menu}>
                {menuTrail.map((props, index) => (
                    <animated.div
                        key={MENU_ITEMS[index]}
                        className={styles.menuItem}
                        style={{
                            opacity: props.opacity,
                            transform: props.x.to(x => `translateX(${x}px)`),
                        }}
                    >
                        {MENU_ITEMS[index]}
                    </animated.div>
                ))}
            </div>
        </div>
    );
}