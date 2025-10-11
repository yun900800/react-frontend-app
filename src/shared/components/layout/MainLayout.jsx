// src/layouts/MainLayout.jsx

import React from 'react';
import { Link, Outlet,useNavigate } from 'react-router-dom';
import StickyHeaderLayout from './StickyHeaderLayout';
import * as styles from './MainLayout.module.css'; // 引入样式文件
import ThemeToggle from '../ThemeToggle.jsx';
import { LogOut } from 'lucide-react';

function MainLayout() {
  // 引入 useNavigate Hook 用于编程导航
  const navigate = useNavigate();

  // 退出登录处理函数
  const handleLogout = () => {
    // 1. 清除客户端存储的身份凭证
    // 假设 Token 存储在 localStorage 的 'token' 键中
    localStorage.removeItem('token');

    // [可选的安全步骤]: 如果使用了 Refresh Token，这里应该调用后端 API 进行作废 (Revoke)
    // fetch('/api/auth/logout', { method: 'POST' }); 

    // 2. 跳转到登录页面
    navigate('/login');
  };

  // 1. 定义头部内容组件 (Header Content)
  const headerContent = (
    <nav style={{ display: 'flex', alignItems: 'center' ,color: 'oklch(var(--color-foreground))' }}>
      {/* 导航链接 */}
      <Link to="/" style={{ marginRight: '15px', textDecoration: 'none'}}>
        🏠 首页
      </Link>
      <Link to="/clients" style={{ marginRight: '15px', textDecoration: 'none' }}>
        🏠 客户端
      </Link>
      <Link to="/test" style={{ textDecoration: 'none',  }}>
        📊 接口
      </Link>
      <button 
        onClick={handleLogout}
        className='button-primary'
        style={{ margin: '0 4px', display: 'flex' }}
      >
        <LogOut onClick={handleLogout} style={{ width: 'var(--font-size-1)', height: 'auto' }}/>
      </button>
      <ThemeToggle style={{ margin: '0 4px', display: 'flex' }} />
    </nav>
  );
  
  return (
    <div className={styles['main_content_wrapper']}>
      <StickyHeaderLayout 
        header={headerContent} // 将头部内容传入 header 属性
        // 可以添加额外的类名来定制样式，例如给内容区域添加最大宽度
        contentClassName={styles['main_content_custom']} 
        headerClassName={styles['main_header_custom']} // 可选：如果你想覆盖或增加头部样式
      >
        {/* 3. Outlet 作为子组件传入 (children) */}
        {/* Outlet 将渲染匹配的子路由内容 */}
        <Outlet /> 
      </StickyHeaderLayout>
    </div>
  );
}

export default MainLayout;