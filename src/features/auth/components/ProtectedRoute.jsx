// src/components/auth/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// 假设的认证 Hook
const useAuth = () => {
    const isAuthenticated = localStorage.getItem('token') ? true : false;
    return { isAuthenticated };
};

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    // 如果未登录，使用 <Navigate> 强制重定向到 /login 路径
    // replace={true} 确保登录页替换掉历史记录中的当前页
    return <Navigate to="/login" replace />;
  }
  
  // 如果已登录，使用 <Outlet> 渲染嵌套的子路由（如 HomePage, TestComponent）
  // 这里的 <Outlet> 相当于在 MainLayout 中占位，渲染子路由内容
  return <Outlet />;
}

export default ProtectedRoute;