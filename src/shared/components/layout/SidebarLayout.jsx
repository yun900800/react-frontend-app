import React,{useEffect} from 'react';
import * as styles from './SidebarLayout.module.css';
import { useSidebar } from '../context/SidebarContext';
const NO_SCROLL_CLASS = 'no-scroll';
const SidebarLayout = ({ sidebar, main, fullHeight = false}) => {
    const rootClass = fullHeight ? styles.fullViewport : styles.layout;
    const { isSidebarOpen, closeSidebar } = useSidebar();
    const sidebarClass = isSidebarOpen ? styles.sidebarOpen : '';
    useEffect(() => {
        const body = document.body;
        
        if (isSidebarOpen) {
            // 侧边栏打开时，添加 no-scroll 类
            body.classList.add(NO_SCROLL_CLASS);
        } else {
            // 侧边栏关闭时，移除 no-scroll 类
            body.classList.remove(NO_SCROLL_CLASS);
        }

        // 清理函数：组件卸载或状态变化时，确保类被移除
        // 这一步非常重要，防止组件卸载后 body 仍被禁用滚动
        return () => {
            body.classList.remove(NO_SCROLL_CLASS);
        };
    }, [isSidebarOpen]);
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