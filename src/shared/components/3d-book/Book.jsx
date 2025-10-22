// Book.jsx
import React, { useState } from "react";
// 引入新的抽象组件
import { BookDetail } from "./BookDetail"; 
import { BookInfo } from "./BookInfo";

export const Book = ({ 
    data, 
    index, // New Prop for z-index
    booksCount, // New Prop for z-index
    isOpenedGlobally, 
    isFlippedGlobally, 
    onOpen, onFlip, 
    viewMode='grid',
    
    // Shelf 模式的新 Prop
    isShelfOpened, 
    isShelfOutside, // <-- 传入的 prop，现在同时包含了打开和外部状态
    onShelfClick, 
    onTransitionEnd
}) => {
    // 1. 状态管理：控制当前翻到的页码
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    // 2. 逻辑：处理翻页导航
    const handlePageChange = (direction) => {
        let newIndex = currentPageIndex + direction;
        const totalPages = data.pages ? data.pages.length : 0;

        if (newIndex >= 0 && newIndex < totalPages) {
            setCurrentPageIndex(newIndex);
        }
    };
    
    // 3. 逻辑：处理 "View inside" 按钮点击 (包含父组件的 onOpen 逻辑)
    // 必须保留在这里，因为它需要重置当前组件的 state (currentPageIndex)
    const handleViewClick = () => {
        // 调用父组件的回调，处理自身的开启/关闭和兄弟组件的关闭逻辑
        onOpen(data.id, isOpenedGlobally); 
        
        // 如果是执行关闭操作，重置当前页到第一页
        if (isOpenedGlobally) {
            setCurrentPageIndex(0);
        }
    };

    // 2. Z-Index 计算 (来自 books2.js)
    let stackVal = 0;
    if (viewMode === 'shelf') {
        if (index < booksCount / 2) {
            stackVal = index;
        } else {
            stackVal = booksCount - 1 - index;
        }
    }
    // 最终 Z-Index：打开时最大 (booksCount)，否则是 stackVal
    const finalZIndex = isShelfOpened ? booksCount : stackVal;

    // 3. Click Handler (Shelf 模式点击整个 <li>，Grid 模式点击按钮)
    const clickHandler = viewMode === 'shelf' 
    ? () => onShelfClick(data.id) 
    : undefined;

    return (
        <li style={{ zIndex: finalZIndex }} onClick={clickHandler}>
            {/* 负责 3D 渲染和书页内容 */}
            <BookDetail 
                data={data}
                // 动态选择状态：Shelf 模式使用 isShelfOpened/isShelfOutside，Grid 模式使用 isOpenedGlobally
                // 关键修改：传递 isOutside 和 isOpened
                isOpened={isShelfOpened}        // 控制 bk-viewinside
                isOutside={isShelfOutside}
                
                isFlipped={isFlippedGlobally}
                currentPageIndex={currentPageIndex}
                handlePageChange={handlePageChange}
                viewMode={viewMode}
                
                // 传递动画事件回调 (仅 Shelf 模式需要)
                onTransitionEnd={viewMode === 'shelf' ? onTransitionEnd : undefined}
            />
            
            {/* 负责按钮和信息展示 */}
            { viewMode === 'grid' && <BookInfo 
                data={data}
                onFlip={onFlip}         // 传入父组件的 onFlip 回调
                onOpen={handleViewClick} // 传入包含重置逻辑的 handleViewClick
                isOpenedGlobally={isOpenedGlobally}
            /> }
            
        </li>
    );
};