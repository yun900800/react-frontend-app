import React from 'react';
import SidebarLayout from './SidebarLayout'; // 引入纯组件
import { useSidebar } from '../context/SidebarContext'; // 引入 Context Hook

// -----------------------------------------------------------------
// A. 定义 Sidebar Layout 的连接逻辑 (Render Prop)
// -----------------------------------------------------------------
const ConnectedSidebarLayoutSlot = ({ sidebar, main }) => {
    // 1. 在这里使用 Hook，这是 Context 的出口
    const { isSidebarOpen, closeSidebar } = useSidebar(); 
    
    // 2. 渲染纯粹的 SidebarLayout 组件
    return (
        <SidebarLayout
            sidebar={sidebar}
            main={main}
            isSidebarOpen={isSidebarOpen}
            onClose={closeSidebar}
        />
    );
};
export default ConnectedSidebarLayoutSlot;
