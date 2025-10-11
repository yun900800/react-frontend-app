// client/pages/ClientPages.jsx

import React, { useState } from 'react';
import ClientList from './ClientList'; 
import CreateClient from './CreateClient';
// 假设这是你的共享样式路径
import { styles } from '../../../shared/css/components/styles.js';

// 主应用组件，包含导航和内容区域
const ClientPages = () => {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <div className={styles.container}>
      {/* 顶部导航栏 */}
      <div className={styles.navbar}>
        <button
          onClick={() => setActiveTab('create')}
          className={`${styles.tabButton} ${activeTab === 'create' ? styles.activeTab : ''}`}
        >
          注册客户端
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`${styles.tabButton} ${activeTab === 'list' ? styles.activeTab : ''}`}
        >
          客户端列表
        </button>
      </div>

      {/* 内容区域，根据 activeTab 渲染不同组件 */}
      <div className={styles.contentArea}>
        {activeTab === 'create' ? <CreateClient /> : <ClientList />}
      </div>
    </div>
  );
};

export default ClientPages;