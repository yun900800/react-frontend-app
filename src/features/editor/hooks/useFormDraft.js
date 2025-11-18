import { useState, useEffect, useCallback, useRef } from 'react';
import debounce from 'lodash/debounce'; // 引入 lodash 的 debounce 函数

// --- 辅助函数：从 localStorage 加载草稿 ---
const loadDraft = (key) => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return undefined; // 返回 undefined 表示没有草稿
    }
    // 注意：从 JSON 字符串反序列化回对象
    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Error loading draft from localStorage:", error);
    return undefined;
  }
};

// --- 辅助函数：将草稿保存到 localStorage ---
const saveDraft = (key, state) => {
  try {
    // 注意：将对象序列化为 JSON 字符串
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (error) {
    console.error("Error saving draft to localStorage:", error);
  }
};


/**
 * 自动草稿 Hook，用于管理表单的多个字段状态。
 *
 * @param {string | null} draftKey 唯一的草稿键，如果为 null 则禁用自动保存/加载。
 * @param {Object} initialState 包含所有表单字段的初始状态对象。
 * @param {number} delay 保存操作的防抖延迟时间（毫秒）。
 * @returns {Object} 包含 formState, setFormState, handleInputChange, clearDraft 的对象。
 */
export const useFormDraft = (draftKey, initialState, delay = 500) => {
  
  // 1. 从 localStorage 加载草稿，如果存在，就作为初始状态
  const initialData = draftKey ? loadDraft(draftKey) : undefined;
  // 如果有草稿，使用草稿，否则使用传入的 initialState
  const [formState, setFormState] = useState(initialData ?? initialState);
  
  // 保存初始状态的引用，用于重置
  const initialStateRef = useRef(initialState);


  // 2. 定义防抖的保存函数
  // 必须使用 useCallback 确保 debounce 只创建一次，并依赖 draftKey
  const debouncedSave = useCallback(
    debounce((key, state) => {
      if (key) { // 只有在 key 存在时才保存
        saveDraft(key, state);
        console.log(`[FormDraft] 自动保存表单草稿：${key}`);
      }
    }, delay),
    [delay]
  );

  // 3. 核心 useEffect: 监听 formState 变化并触发防抖保存
  useEffect(() => {
    // 只有在 draftKey 存在时才进行保存
    if (draftKey) {
      debouncedSave(draftKey, formState);
    }
    // 清理函数：在组件卸载或 draftKey/delay 变化时，取消任何待处理的保存
    return () => {
      debouncedSave.cancel();
    };
  }, [formState, draftKey, debouncedSave]);
  
  
  // 4. 清除草稿函数
  const clearDraft = useCallback(() => {
    if (draftKey) {
      localStorage.removeItem(draftKey);
      console.log(`[FormDraft] 已清除草稿：${draftKey}`);
    }
    // 同时重置本地状态为原始初始值
    setFormState(initialStateRef.current);
  }, [draftKey]);


  // 5. 方便的输入处理函数
  // 用于 <input>, <textarea> 等元素，通过 e.target.name 来更新对应字段
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    // 处理 checkbox 和普通输入框
    const newValue = type === 'checkbox' ? checked : value;

    setFormState(prevState => ({
      ...prevState,
      [name]: newValue,
    }));
  }, []);
  
  
  // 6. 监听 draftKey 变化，加载新草稿或重置
  useEffect(() => {
    if (draftKey) {
        // 如果 draftKey 发生变化，尝试加载新的草稿
        const newDraft = loadDraft(draftKey);
        // 使用新的草稿或初始状态来更新 formState
        setFormState(newDraft ?? initialStateRef.current);
    } else {
        // 如果 draftKey 为 null (例如没有选择书籍)，则重置为初始状态
        setFormState(initialStateRef.current);
    }
    // 注意：我们只依赖 draftKey
  }, [draftKey]); 


  return {
    formState,
    setFormState, // 供复杂更新使用
    handleInputChange, // 供普通 input 元素使用
    clearDraft,
  };
};