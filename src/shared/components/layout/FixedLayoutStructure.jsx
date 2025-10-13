import React from 'react'; // 引入 useState Hook
import * as styles from './FixedLayoutStructure.module.css';

const FixedLayoutStructure = ({
    header,
    sidebar,
    content,
    footer,
    // 关键：新增一个 prop，用于接收 sidebar 的渲染逻辑
    SidebarLayoutSlot
}) => {
    return (
        <div className={styles.layout}>
            
            {/* 头部区域：使用注入了控制函数的 Header */}
            <div className={styles.header}>
                {header}
            </div>
            
            {/* 内容区域：Flex容器 */}
            <div className={styles.contentContainer}>
                {/* 侧边栏：传递状态和关闭函数 */}
                <SidebarLayoutSlot
                    sidebar={sidebar}
                    main={content} 
                />
            </div>
            
            {/* 底部区域 */}
            <div className={styles.footer}>
                {footer}
            </div>
        </div>
    );
};

export default FixedLayoutStructure;