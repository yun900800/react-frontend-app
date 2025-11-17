// src/hooks/useAutoDraft.js

import { useState, useEffect, useCallback } from 'react';

/**
 * 自动暂存/草稿功能的自定义 Hook。
 * 它将状态值自动保存到 localStorage，并在组件初始化时尝试恢复。
 * * @param {string} key 存储在 localStorage 中的唯一键名。
 * @param {any} initialValue 状态的初始值。
 * @param {number} delay 自动保存的防抖延迟时间（毫秒）。
 * @returns {[any, (newValue: any) => void, () => void]} [state, setState, clearDraft]
 */
export const useAutoDraft = (key, initialValue, delay = 1000) => {
    // 1. 初始化状态：优先从 localStorage 加载，否则使用初始值
    const [value, setValue] = useState(() => {
        try {
            const saved = localStorage.getItem(key);
            // 确保不是 null 或 undefined，并且能够被解析
            return saved ? JSON.parse(saved) : initialValue;
        } catch (error) {
            console.error(`Error loading draft for key "${key}":`, error);
            return initialValue;
        }
    });

    // 2. 自动保存到 localStorage (使用防抖)
    useEffect(() => {
        if (value === initialValue || value === undefined || value === null) {
            // 如果内容为空或恢复到初始值，则不进行保存
            return;
        }

        const handler = setTimeout(() => {
            try {
                // 保存数据
                localStorage.setItem(key, JSON.stringify(value));
                console.log(`Draft for key "${key}" saved.`);
            } catch (error) {
                console.error(`Error saving draft for key "${key}":`, error);
            }
        }, delay);

        // 清理函数：在下一次 useEffect 运行或组件卸载时清除计时器
        return () => {
            clearTimeout(handler);
        };
        
    }, [key, value, delay]);

    // 3. 清除草稿的函数 (用于提交成功后调用)
    const clearDraft = useCallback(() => {
        try {
            localStorage.removeItem(key);
            console.log(`Draft for key "${key}" cleared.`);
        } catch (error) {
            console.error(`Error clearing draft for key "${key}":`, error);
        }
        // 清空本地状态
        setValue(initialValue);
    }, [key, initialValue]);

    return [value, setValue, clearDraft];
};