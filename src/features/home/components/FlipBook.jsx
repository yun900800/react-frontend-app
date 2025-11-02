// FlipBook.jsx
import React, { useRef, useState, useEffect, useMemo } from "react";
import HTMLFlipBook from "react-pageflip";
import { useDynamicPagination } from "../hooks/useDynamicPagination";
import { useResponsivePagination } from "../hooks/useResponsivePagination"; 
import { useMediaQuery } from "../../../shared/hooks/useMediaQuery";
import styles from "../pages/FlipPageApp.module.css";

function useResponsiveOrDynamicPagination(isMobile, paragraphs) {
  const responsive = useResponsivePagination(paragraphs, {
    baseWidth: 550,
    baseHeight: 733,
    fontSize: 16,
    lineHeight: 1.6,
    padding: 20,
  });

  const dynamic = useDynamicPagination(paragraphs, 700);

  // ❗ 始终调用一次 useRef
  const fallbackRef = useRef(null);

  // 根据条件选择结果
  return isMobile
    ? responsive
    : { pages: dynamic, containerRef: fallbackRef };
}

const PageCover = React.forwardRef(({ children }, ref) => (
  <div className={`${styles.page} ${styles["page-cover"]}`} ref={ref} data-density="hard">
    <div className={styles["page-content"]}>
      <h2>{children}</h2>
    </div>
  </div>
));

const Page = React.forwardRef(({ number, children }, ref) => (
  <div className={styles.page} ref={ref}>
    <div className={styles["page-content"]} id="measure-page-content">
      <h2 className={styles["page-header"]}>Page {number}</h2>
      <div className={styles["page-text"]}>{children}</div>
      <div className={styles["page-footer"]}>Page {number}</div>
    </div>
  </div>
));

export function FlipBook({ content, bookTitle = "BOOK TITLE", endTitle = "THE END" }) {
  const flipBook = useRef();
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const isMobile = useMediaQuery("(max-width: 767px)");

  // 将文本拆成段落（你也可以直接传 blocks 数组）
  const paragraphs = useMemo(
    () => (typeof content === "string" ? content.split(/\n+/).map(p => p.trim()).filter(Boolean) : (content || [])),
    [content]
  );
  const { pages, containerRef } = useResponsiveOrDynamicPagination(isMobile, paragraphs);
  
  // 构造要传给 HTMLFlipBook 的“页”组件数组：
  // 1. 单独的封面页
  // 2. 正文页（由 pagination 生成）
  // 3. 单独的封底页
  const pagesForFlip = useMemo(() => {
    const arr = [];

    // first cover (single page)
    arr.push({ type: "cover", content: bookTitle });

    // content pages
    pages.forEach((paras, i) => {
      arr.push({ type: "content", content: paras, pageNumber: i + 1 }); // pageNumber 表示正文顺序（不包含封面）
    });

    // end cover (single page)
    arr.push({ type: "cover", content: endTitle });

    return arr;
  }, [pages, bookTitle, endTitle]);

  const onPage = (e) => {
    // flip 回传的是当前左/右 page 索引（0-based）
    setPageIndex(e.data);
  };

  // 每当 pagesForFlip 改变，等待 flip 实例就绪后读取总页数
  useEffect(() => {
    // small delay to ensure HTMLFlipBook has (re)rendered internal pages
    const id = window.requestAnimationFrame(() => {
      try {
        const flip = flipBook.current?.pageFlip?.();
        if (flip && typeof flip.getPageCount === "function") {
          setTotalPage(flip.getPageCount());
        }
      } catch (err) {
        // ignore
      }
    });
    return () => window.cancelAnimationFrame(id);
  }, [pagesForFlip]);

  const nextButtonClick = () => flipBook.current?.pageFlip()?.flipNext();
  const prevButtonClick = () => flipBook.current?.pageFlip()?.flipPrev();

  if (!pagesForFlip.length) return <div>Loading book...</div>;

  return (
    <div className={styles.container} 
    ref={containerRef}
    >
      <HTMLFlipBook
        width={550}
        height={733}
        size="stretch"
        minWidth={315}
        maxWidth={1000}
        minHeight={400}
        maxHeight={1533}
        className={styles["demo-book"]}
        ref={flipBook}
        onFlip={onPage}
      >
        {pagesForFlip.map((p, idx) => {
          if (p.type === "cover") {
            // 封面单独一页
            return (
              <PageCover key={`cover-${idx}`}>
                {p.content}
              </PageCover>
            );
          } else {
            // 正文页，p.content 是该页的段落数组
            // pageNumber 用于页面内部显示（如果你想从 1 开始计正文页）
            return (
              <Page key={`page-${idx}`} number={p.pageNumber}>
                {p.content.map((para, j) => (
                  <p key={j}>{para}</p>
                ))}
              </Page>
            );
          }
        })}
      </HTMLFlipBook>

      <div className={styles.controls}>
        <button onClick={prevButtonClick}>◀ Prev</button>
        <span>
          {pageIndex + 1} / {totalPage}
        </span>
        <button onClick={nextButtonClick}>Next ▶</button>
      </div>
    </div>
  );
}



