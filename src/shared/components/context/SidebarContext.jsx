// SidebarContext.js
import React, { createContext, useState, useContext } from 'react';

// 1. 创建 Context
const SidebarContext = createContext();

// 2. 创建 Provider 组件
export const SidebarProvider = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const contextValue = {
        isSidebarOpen,
        openSidebar: () => setIsSidebarOpen(true),
        closeSidebar: () => setIsSidebarOpen(false),
        toggleSidebar: () => setIsSidebarOpen(prev => !prev),
    };

    return (
        <SidebarContext.Provider value={contextValue}>
            {children}
        </SidebarContext.Provider>
    );
};

// 3. 创建 Custom Hook，方便在任何地方使用
export const useSidebar = () => {
    return useContext(SidebarContext);
};