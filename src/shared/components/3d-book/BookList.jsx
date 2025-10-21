import React, {useState} from "react";
import styles from './BookList.module.css';
import { Book } from "./Book.jsx";
export const BookList = ({ books }) => {
  // 1. 核心状态：管理当前哪本书处于打开 (View Inside) 状态
  // openedBookId: 对应所有 $books.data('opened') 的集合状态
  const [openedBookId, setOpenedBookId] = useState(null); 
  
  // 2. 核心状态：管理当前哪本书处于翻转 (Flip) 状态
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

  const booksCount = books.length;
  return (
    <ul id="bk-list" className={`${styles['bk-list']} clearfix`}>
      {books.map((book, index) => (
        <Book key={book.id}
          data={{ ...book, id: index + 1 }} // 确保 data.id 匹配 class 中的 book-1, book-2...
          isOpenedGlobally={openedBookId === book.id}
          isFlippedGlobally={flippedBookId === book.id}
          onOpen={handleOpenBook}
          onFlip={handleFlip}
          // 传递 zIndex 排名信息，以便计算 z-index
          booksCount={booksCount} />
      ))}
    </ul>
  );
};
