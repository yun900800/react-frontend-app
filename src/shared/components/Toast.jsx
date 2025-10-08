import React, { useState, useEffect, useContext, createContext } from 'react';
import ReactDOM from 'react-dom';
import * as styles from './Toast.module.css';

// 只有在客户端才获取 Portal 挂载点，避免 SSR 报错
let toastRoot;
if (typeof window !== 'undefined') {
  toastRoot = document.getElementById('toast-root');
}

// 创建 Context
const ToastContext = createContext();

// 提供 Toast 功能的 Hook
export const useToast = () => useContext(ToastContext);

/**
 * ToastProvider: 提供 ToastContext 的组件
 * 负责管理所有 Toast 的状态和生命周期
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // 确保这段代码只在客户端执行
    setIsClient(true);
  }, []);

  const addToast = (message, type = 'info', duration = 3000) => {
    if (!isClient) return; // 如果是服务端渲染，则不执行任何操作

    const id = Date.now();
    const newToast = { id, message, type, duration };
    setToasts(prevToasts => [...prevToasts, newToast]);
  };

  const removeToast = (id) => {
    if (!isClient) return;

    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {/* 只有在客户端且 toastRoot 存在时才渲染 Portal */}
      {isClient && toastRoot && (
        ReactDOM.createPortal(<ToastContainer toasts={toasts} removeToast={removeToast} />, toastRoot)
      )}
    </ToastContext.Provider>
  );
};

// ... ToastContainer 和 Toast 组件的代码保持不变 ...

/**
 * ToastContainer: 负责渲染所有 Toast 的容器
 */
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className={styles.toastContainer}>
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
};

/**
 * Toast: 单个 Toast 消息组件
 * 负责自动关闭和动画效果
 */
const Toast = ({ toast, removeToast }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, toast.duration - 300);

    return () => clearTimeout(timer);
  }, [toast.duration]);

  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(() => {
        removeToast(toast.id);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isVisible, removeToast, toast.id]);

  return (
    <div className={`${styles.toast} ${styles[toast.type]} ${isVisible ? styles.enter : styles.exit}`}>
      {toast.message}
    </div>
  );
};