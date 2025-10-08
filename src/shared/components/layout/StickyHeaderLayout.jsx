import React from "react";
import * as styles from './StickyHeaderLayout.module.css'
const StickyHeaderLayout = ({header,children, contentClassName, headerClassName})=>{
    return (
        <>
            <header className={`${styles['sticky_header']} ${headerClassName || ''}`}>
                {header}
            </header>
            <main className={`${styles['content']} ${contentClassName || ''}`}>
                {children}
            </main>
        </>
    )
}

export default StickyHeaderLayout;