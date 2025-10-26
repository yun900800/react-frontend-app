import React from 'react';
import FixedLayoutStructure from '../../../shared/components/layout/FixedLayoutStructure';
import { useSidebar, SidebarProvider } from '../../../shared/components/context/SidebarContext';
import ConnectedSidebarLayoutSlot from '../../../shared/components/layout/ConnectedSidebarLayoutSlot';
import SpacerLayout, {AutoMarginClassName} from '../../../shared/components/layout/SpacerLayout';
import Breadcrumb from '../../../shared/components/sidebar/Breadcrumb';
import {SquareMenu,X,Code} from 'lucide-react'
const Header = () => { 
    const { openSidebar, isSidebarOpen } = useSidebar();
    // 假设这是你的汉堡包按钮，它只在移动端显示
    return (
        <SpacerLayout gap='24px' >
            <a className={`button-primary`}
                style={{ display: 'flex', width:'36px', height:'36px', marginLeft: '16px' }}>
                    <Code style={{ width: 'var(--font-size-1)', height: 'auto' }}/>
            </a>
            <a 
                onClick={openSidebar} // **这是关键**
                className={`button-primary ${AutoMarginClassName}`}
                style={{ display: 'flex', width:'36px', height:'36px' }}
            > { isSidebarOpen ? <X style={{ width: 'var(--font-size-1)', height: 'auto' }}/> 
                : <SquareMenu style={{ width: 'var(--font-size-1)', height: 'auto' }}/>
            }
                
            </a>
        </SpacerLayout>
    );
};

const breadcrumbLinks = [
    { path: '/', label: 'home' },
    { path: '/responsive-layout', label: 'layout' },
    { path: '/clients', label: 'clients' },
    { path: '/flipbook', label: 'flipbook' },
    { path: '/page-book', label: 'pagebook' },
  ];
const FixedStructureApp = () => {
    return (
        <SidebarProvider> 
    <FixedLayoutStructure
    header={<Header/>}
    sidebar={<Breadcrumb links={breadcrumbLinks} />}
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
    headerHeight='54px'
    footerHeight='30px'
  />
  </SidebarProvider>); 
}

export default FixedStructureApp;