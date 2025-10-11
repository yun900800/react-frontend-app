import React from 'react';
// 导入 NavLink 和 Outlet
import { NavLink, Outlet } from 'react-router-dom'; 

// 假设这是你的共享样式路径
import { styles } from '../../../shared/css/components/styles.js';

// ClientPages 现在是客户端模块的布局组件
const ClientPages = () => {

  // 使用 NavLink 来创建可导航的按钮
  const TabButton = ({ to, label }) => (
    <NavLink
      // to 属性使用相对路径。例如，当当前路径是 /clients，to="create" 就会是 /clients/create
      to={to}
      // NavLink 接收一个函数，用于根据 isActive 状态动态设置 className
      className={({ isActive }) => 
        `${styles.tabButton} primary-button ${isActive ? styles.activeTab : ''}`
      }
    >
      {label}
    </NavLink>
  );

  return (
    <div className={styles.container}>
      {/* 顶部导航栏 */}
      <div className={styles.navbar}>
        {/* NavLink 自动处理点击事件和高亮状态 */}
        <TabButton 
          to="create" // 相对路径，对应 /clients/create
          label="注册客户端" 
        />
        <TabButton 
          to="list" // 相对路径，对应 /clients/list
          label="客户端列表" 
        />
      </div>

      {/* 内容区域，由 <Outlet /> 渲染匹配到的子路由组件 */}
      <div className={styles.contentArea}>
        <Outlet />
      </div>
    </div>
  );
};

export default ClientPages;