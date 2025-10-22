import React, {useState, useCallback} from "react";
import GridStyles from './BookList.module.css';
import shelfStyles from './BookList-Shelf.module.css';
import { Book } from "./Book.jsx";
export const BookList = ({ books, viewMode='grid' }) => {
  // 1. 核心状态：管理当前哪本书处于打开 (View Inside) 状态
  // openedBookId: 对应所有 $books.data('opened') 的集合状态
  const [openedBookId, setOpenedBookId] = useState(null); 

  // 2. 当前处于 bk-outside 状态的书 ID (Step 1 动画)
  const [outsideBookId, setOutsideBookId] = useState(null); 

  // 3. 目标要打开的新书 ID (用于 closeCurrent() 后的缓存)
  const [nextOpenBookId, setNextOpenBookId] = useState(null);

  // 关键修正: 引入 isClosing 状态来阻断错误的重开逻辑
    const [isClosing, setIsClosing] = useState(false);
  
  // 4. 核心状态：管理当前哪本书处于翻转 (Flip) 状态
  // flippedBookId: 对应所有 $books.data('flip') 的集合状态
  const [flippedBookId, setFlippedBookId] = useState(null); 
  
  // 3. 处理 View Inside (打开/关闭)
  const handleOpenBook = (id, isCurrentlyOpen) => {
      if (isCurrentlyOpen) {
          // 关闭操作 (对应 $book.data({ opened: false }).removeClass('bk-viewinside').addClass('bk-bookdefault'))
          setOpenedBookId(null);
      } else {
          // 打开操作 (对应 $other.data('opened', false).removeClass('bk-viewinside') + $book.data({ opened: true }).addClass('bk-viewinside'))
          // 也会隐式地处理 $other.parent().css('z-index', 0)
          setOpenedBookId(id);
          // 当打开内部视图时，JS 原本会强制关闭翻转状态
          setFlippedBookId(null);
      }
  };

  // 4. 处理 Flip (翻转)
  const handleFlip = (id) => {
    // 对应 $bookview.removeClass('bk-active')
    setOpenedBookId(null); 
    
    // 切换翻转状态 (对应 $book.data({ opened: false, flip: !flip }))
    setFlippedBookId(prevId => (prevId === id ? null : id));
  };

  // Shelf 模式的点击事件 (模拟 books2.js 的互斥和 Step 1 触发)
    const handleShelfClick = useCallback((id) => {
        if (openedBookId === id) {
            // 1. 关闭当前书 (Step 1 Close)
            setIsClosing(true); // <-- 标记开始关闭，阻止 handleTransitionEnd 误判
            setOpenedBookId(null); 
            setNextOpenBookId(null); 
        } else {
            // 2. 尝试打开新书
            if (openedBookId !== null) {
                // 互斥关闭：先关闭旧书
                setIsClosing(true); // <-- 标记开始关闭
                setOpenedBookId(null); 
                setNextOpenBookId(id); 
            } else {
                // 简单开启
                setIsClosing(false); // 确保在开启时标志为 false
                setOutsideBookId(id); 
            }
        }
    }, [openedBookId]);

    // 动画序列控制 (已修正)
    const handleTransitionEnd = useCallback((id) => {
        if (viewMode !== 'shelf') return;

        // A. OPENING Step 1 完成: bk-outside 动画完成
        // 关键修正: 只有当 isClosing 为 false 时，才允许开启逻辑执行
        if (id === outsideBookId && openedBookId !== id && !isClosing) { 
            // Step 1 Open (bk-outside) finished, start Step 2 Open (bk-viewinside)
            setOpenedBookId(id);        
        } 
        
        // B. CLOSING Step 1/2 完成
        // 这一步捕获了 bk-viewinside 移除完成 或 bk-outside 移除完成
        else if (id === outsideBookId) {
            
            // 检查是否在关闭中，并且 openedBookId 已经设置为 null (即 Step 1 Close 动画完成)
            if (openedBookId === null) { 
                
                setIsClosing(false); // <-- 关闭的第一步完成，解除阻断标志

                if (nextOpenBookId !== null) {
                    // 互斥关闭完成：Old book finished Step 1 Close. Start New Book Step 1 Open.
                    setOutsideBookId(nextOpenBookId); 
                    setNextOpenBookId(null);
                } else {
                    // 完整关闭完成：Book finished Step 1 Close. Start Step 2 Close (bk-outside removal).
                    setOutsideBookId(null); 
                }
            }
        }

    }, [openedBookId, outsideBookId, nextOpenBookId, viewMode, isClosing]); // 确保 isClosing 参与依赖项

  const booksCount = books.length;
  let styles = viewMode === 'shelf' ? shelfStyles : GridStyles;
  return (
    <>
    <ul id="bk-list" className={`${styles['bk-list']} clearfix`}>
      {books.map((book, index) => (
        <Book key={index}
          data={{ ...book, id: book.id }} // 保持原始 ID
            index={index} // 传递索引用于 z-index
            booksCount={booksCount}
            
            // Shelf 模式状态 (New)
            isShelfOpened={openedBookId === book.id}        // 控制 bk-viewinside
            isShelfOutside={outsideBookId === book.id || openedBookId === book.id} // 控制 bk-outside
            onShelfClick={handleShelfClick}
            onTransitionEnd={handleTransitionEnd}

            // Grid 模式状态 (Existing)
            isOpenedGlobally={openedBookId === book.id}
            isFlippedGlobally={flippedBookId === book.id}
            onOpen={handleOpenBook}
            onFlip={handleFlip}
            viewMode={viewMode} />
      ))}
    </ul>
    { viewMode === 'shelf' && <div className={shelfStyles['book-shelf']}></div> }
    </>
  );
};
