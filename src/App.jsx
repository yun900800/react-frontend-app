// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route,Navigate  } from 'react-router-dom';
import MainLayout from './shared/components/layout/MainLayout';
import TestComponent from './components/TestComponent';
import LoginPage from './features/auth/pages/LoginPage';
import HomePage from './features/home/pages/HomePage'; 
import AiPages from './features/ai/pages/AiPages';
import ClientPages from './features/client/pages/ClientPages';
import CreateClient from './features/client/pages/CreateClient';
import ClientList from './features/client/pages/ClientList';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import ResponsiveFlowApp from './features/home/pages/ResponsiveFlowApp';
import FixedStructureApp from './features/home/pages/FixedStructureApp';
import { FullPageApp } from './features/home/pages/FullPageApp';
import { FlipPageApp } from './features/home/pages/FlipPageApp';

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
              <Route path="ai" element={<AiPages />} /> 
              
              {/* 其他需要布局的页面 */}
              <Route path="test" element={<TestComponent />} />
              <Route path="clients" element={<ClientPages />}>
                {/* /clients/list 渲染 ClientList */}
                <Route path="list" element={<ClientList />} /> 
                {/* /clients/create 渲染 CreateClient */}
                <Route path="create" element={<CreateClient />} /> 
                
                {/* 默认子路由：当访问 /clients 时，自动重定向到 /clients/list */}
                <Route index element={<Navigate to="list" replace />} /> 
              </Route>
            </Route>
            <Route path="/responsive-layout" element={<ResponsiveFlowApp />} />
            <Route path="/fixed-app" element={<FixedStructureApp />} />
            <Route path="/shelf" element={<FullPageApp />} />
            <Route path="/flipbook" element={<FlipPageApp />} />
          </Route>
          
          {/* 3. 可选：404 Not Found 路由 */}
          <Route path="*" element={<h2>404 页面未找到</h2>} />
        </Routes>
    </Router>
  );
}

export default App;