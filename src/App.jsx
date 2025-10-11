// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './shared/components/layout/MainLayout';
import TestComponent from './components/TestComponent';
import LoginPage from './features/auth/pages/LoginPage';
import HomePage from './features/home/pages/HomePage'; 
import ClientPages from './features/client/pages/ClientPages';
import ProtectedRoute from './features/auth/components/ProtectedRoute';

function App() {
  return (
    <Router>
        <Routes>
          {/* 1. 独立的登录路由：它不会有导航栏 */}
          <Route path="/login" element={<LoginPage />} />

          {/* 2. 布局路由：所有嵌套的子路由都会渲染在 MainLayout 内部的 <Outlet /> 位置 */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainLayout />}>
              {/* 默认首页，使用 index 属性 */}
              <Route index element={<HomePage />} /> 
              
              {/* 其他需要布局的页面 */}
              <Route path="test" element={<TestComponent />} />
              <Route path="clients" element={<ClientPages />} />
            </Route>
          </Route>

          {/* 3. 可选：404 Not Found 路由 */}
          <Route path="*" element={<h2>404 页面未找到</h2>} />
        </Routes>
    </Router>
  );
}

export default App;