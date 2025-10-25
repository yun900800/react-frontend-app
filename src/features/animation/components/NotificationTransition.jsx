import React, { useState, useCallback } from 'react';
import { useTransition, animated } from '@react-spring/web';
import styles from './NotificationList.module.css';

// 全局计数器，用于生成唯一的ID
let notificationId = 0;

// 定义通知组件（纯JS）
export function NotificationTransition() {
    const [notifications, setNotifications] = useState([]);
    
    // ==========================================================
    // 列表操作函数
    // ==========================================================
    
    // 添加通知
    const addNotification = useCallback((type, message) => {
        const newNotification = { 
            id: ++notificationId, 
            message,
            type, // 'success' 或 'error'
        };
        // 添加到列表的开头（新通知通常在顶部）
        setNotifications(prev => [newNotification, ...prev]);
    }, []);

    // 移除通知
    const removeNotification = useCallback((id) => {
        // useTransition 的核心：我们只需要更新状态，它会自动触发离场动画
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    // ==========================================================
    // useTransition 核心：管理列表的进场、更新和离场
    // ==========================================================
    const transitions = useTransition(notifications, {
        // 关键：useTransition 必须传入一个 key 属性
        keys: item => item.id, 
        
        // 1. from: 进场前的状态 (在右侧)
        from: { opacity: 0, x: 300, height: 0, padding: 0, marginBottom: 0 },
        
        // 2. enter: 进场后的状态 (回到原位)
        enter: item => async (next) => {
            // 确保 height 和 padding 在 x 轴动画开始前立即设置
            await next({ height: 50, padding: 15, marginBottom: 10, opacity: 1 });
            // 然后进行 x 轴的平滑滑入动画
            await next({ x: 0 });
        },
        
        // 3. leave: 离场动画 (先滑出，再收缩高度)
        leave: [
            // 3a. 第一步：向右侧滑出并淡出
            { opacity: 0, x: 300 },
            // 3b. 第二步：收缩高度
            { height: 0, padding: 0, marginBottom: 0 },
        ],
        
        // 4. update: 列表更新时其他元素的动画（未被移除的元素平滑向上移动）
        update: { x: 0 }, 
        
        // 5. 配置：使用更具弹性的物理学配置
        config: { mass: 1, tension: 280, friction: 30 },
    });

    return (
        <div style={{ padding: '20px' }}>
            <h2>UseTransition 示例：通知卡片列表增删 (纯 JS)</h2>
            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => addNotification('success', `新通知 ${notificationId + 1} 已成功添加!`)}>
                    添加成功通知
                </button>
                <button onClick={() => addNotification('error', `警告：操作失败，请重试`)} style={{ marginLeft: '10px' }}>
                    添加错误通知
                </button>
            </div>

            <div className={styles.container}>
                {/* 遍历 useTransition 返回的动画数组 */}
                {transitions((style, item) => {
                    // 根据类型设置左侧边框颜色
                    const borderColor = item.type === 'success' ? '#4CAF50' : '#f44336';
                    
                    return (
                        // 关键：使用 animated.div，并应用 style
                        <animated.div
                            key={item.id} // 确保 key 传递给 animated.div
                            className={styles.notification}
                            style={{
                                // 将 x 属性绑定到 transform
                                transform: style.x.to(x => `translateX(${x}px)`),
                                
                                // 设置通知的颜色
                                borderLeft: `5px solid ${borderColor}`,
                                
                                // 必须将 style 中的其他动画属性展开，以便 react-spring 控制
                                height: style.height,
                                padding: style.padding,
                                marginBottom: style.marginBottom,
                                opacity: style.opacity,
                            }}
                        >
                            <span>{item.message}</span>
                            <button 
                                className={styles.closeButton} 
                                onClick={() => removeNotification(item.id)}
                            >
                                &times;
                            </button>
                        </animated.div>
                    );
                })}
            </div>
        </div>
    );
}