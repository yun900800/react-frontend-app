import React from 'react';
import SidebarLayout from './SidebarLayout'; // 引入纯组件
import { useSidebar } from '../context/SidebarContext'; // 引入 Context Hook

// 这个组件就是你的“中介”，它不纯粹，但它是封装了 Hook 的地方。
const SidebarConnectedLayout = ({ sidebar, main }) => {
    // 1. 从 Context 获取所有需要的数据和方法
    const { isSidebarOpen, closeSidebar } = useSidebar(); 

    // 2. 将 Context 的值映射为 SidebarLayout 的纯 Props
    return (
        <SidebarLayout
            sidebar={sidebar}
            main={main}
            isSidebarOpen={isSidebarOpen} // 映射状态
            onClose={closeSidebar}       // 映射方法
        />
    );
};

export default SidebarConnectedLayout;