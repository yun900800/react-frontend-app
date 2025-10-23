// RouteHistoryProvider.jsx (改进版)
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// 1. 创建 Context
const RouteHistoryContext = createContext([]);

// 2. 创建自定义 Hook 供组件使用
export const useRouteHistory = () => {
  return useContext(RouteHistoryContext);
};

// 3. 历史记录 Provider
export const RouteHistoryProvider = ({ children }) => {
  const location = useLocation();
  const navigationType = useNavigationType(); // PUSH, POP, REPLACE
  
  // 存储包含 location 完整对象（特别是 key）的历史栈
  const [historyStack, setHistoryStack] = useState([]);

  useEffect(() => {
    // 完整路径，包括查询参数
    const fullPath = location.pathname + location.search + location.hash;
    const currentEntry = { 
        key: location.key, 
        path: fullPath 
    };
    
    setHistoryStack(prevStack => {
      // 栈顶元素
      const lastEntry = prevStack[prevStack.length - 1];

      if (navigationType === 'POP') {
        // POP 操作：用户点击浏览器后退/前进按钮，或者调用 navigate(-1)。
        // 此时，我们需要在栈中找到与当前 location.key 匹配的条目。
        const index = prevStack.findIndex(entry => entry.key === location.key);
        
        if (index !== -1) {
          // 找到了，说明我们正在回退/前进到历史栈的某个位置。
          // 裁剪掉 index 之后的所有条目，使栈与当前位置同步。
          return prevStack.slice(0, index + 1);
        }
        
        // 如果没找到（可能发生在首次加载，或外部导航），则像 PUSH 一样处理。
        
      } 
      
      // PUSH 或 REPLACE
      if (navigationType === 'PUSH') {
        // PUSH 操作：新页面导航。直接添加到栈顶。
        // 避免重复添加（例如，组件重新渲染，但路由没有发生 PUSH/REPLACE）
        if (!lastEntry || lastEntry.key !== currentEntry.key) {
           return [...prevStack, currentEntry];
        }
      } else if (navigationType === 'REPLACE') {
        // REPLACE 操作：替换当前历史记录。替换栈顶元素。
        if (prevStack.length > 0) {
          const newStack = [...prevStack];
          newStack[newStack.length - 1] = currentEntry;
          return newStack;
        } else {
          // 如果栈为空，直接添加
          return [currentEntry];
        }
      }
      
      // 默认情况（如首次加载或不需要改变栈），返回原栈
      return prevStack.length === 0 ? [currentEntry] : prevStack;
    });
    
  // 依赖项只包括 location，因为 location 的变化已经包含了 navigationType 的信息
  }, [location]); 

  return (
    <RouteHistoryContext.Provider value={historyStack}>
      {children}
    </RouteHistoryContext.Provider>
  );
};