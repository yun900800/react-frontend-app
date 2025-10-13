import React from 'react';
import * as styles from './SidebarLayout.module.css';
import { useSidebar } from '../context/SidebarContext';
const SidebarLayout = ({ sidebar, main, fullHeight = false}) => {
    const rootClass = fullHeight ? styles.fullViewport : styles.layout;
    const { isSidebarOpen, closeSidebar } = useSidebar();
    const sidebarClass = isSidebarOpen ? styles.sidebarOpen : '';
    return (
        <div className={rootClass}>
        {/* 3. 手机端遮罩层：只有菜单打开时显示 */}
        {isSidebarOpen && (
            <div 
                className={styles.backdrop} 
                onClick={closeSidebar} // 点击遮罩层关闭菜单
            />
        )}

        {/* 4. 侧边栏：添加控制 transform 的类名 */}
        <aside 
            className={`${styles.sidebar} ${sidebarClass}`}
        >
            {sidebar}
        </aside>
        <main className={styles.main}>
            {main}
        </main>
        </div>
    );
}

export default SidebarLayout;