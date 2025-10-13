import React from 'react';
import FixedLayoutStructure from '../../../shared/components/layout/FixedLayoutStructure';
import { useSidebar, SidebarProvider } from '../../../shared/components/context/SidebarContext';
import ConnectedSidebarLayoutSlot from '../../../shared/components/layout/ConnectedSidebarLayoutSlot';

const Header = () => { 
    const { openSidebar } = useSidebar();
    // 假设这是你的汉堡包按钮，它只在移动端显示
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>this is the header</span>
            
            {/* 2. 将 onMenuClick prop 绑定到原生 DOM 元素的 onClick 事件 */}
            {/* 当按钮被点击时，onMenuClick（即 openSidebar 函数）被调用 */}
            <button 
                onClick={openSidebar} // **这是关键**
                className="primary-button" 
            >
                ☰
            </button>
        </div>
    );
};
const FixedStructureApp = () => {
    return (
        <SidebarProvider> 
    <FixedLayoutStructure
    header={<Header/>}
    sidebar={<div>this is the sidebar</div>}
    content={<div>
        <p>this is the content</p>
        <p>this is the content</p>
        <p>this is the content</p>
        <p>this is the content</p><p>this is the content</p>
        <p>this is the content</p><p>this is the content</p>
        <p>this is the content</p><p>this is the content</p>
        <p>this is the content</p><p>this is the content</p>
        <p>this is the content</p><p>this is the content</p>
        <p>this is the content</p><p>this is the content</p>
        <p>this is the content</p><p>this is the content</p>
        <p>this is the content</p><p>this is the content</p>
        <p>this is the content</p><p>this is the content</p>
        <p>this is the content</p><p>this is the content</p>
        <p>this is the content</p><p>this is the content</p>
        <p>this is the content</p><p>this is the content</p>
        <p>this is the content</p><p>this is the content</p>
        <p>this is the content</p><p>this is the content</p>
        <p>this is the content</p>
        <p>this is the content</p>
        <p>this is the content</p><p>this is the content</p>
        <p>this is the content</p><p>this is the content</p>
        <p>this is the content</p><p>this is the content</p>
        <p>this is the content</p>
        </div>}
    footer={<div>this is the footer</div>}
    SidebarLayoutSlot={ConnectedSidebarLayoutSlot}
  />
  </SidebarProvider>); 
}

export default FixedStructureApp;