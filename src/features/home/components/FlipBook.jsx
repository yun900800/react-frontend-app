// FlipBook.jsx
import React, { useRef, useState, useEffect, useMemo } from "react";
import HTMLFlipBook from "react-pageflip";
import { useDynamicPagination } from "../hooks/useDynamicPagination";
import { useResponsivePagination } from "../hooks/useResponsivePagination";
import { useMediaQuery } from "../../../shared/hooks/useMediaQuery";
import styles from "../pages/FlipPageApp.module.css";

/**
 * 根据设备类型选择分页策略（响应式 or 动态）
 */
function useResponsiveOrDynamicPagination(isMobile, paragraphs) {
  const responsive = useResponsivePagination(paragraphs, {
    baseWidth: 550,
    baseHeight: 733,
    fontSize: 16,
    lineHeight: 1.6,
    padding: 20,
  });

  const dynamic = useDynamicPagination(paragraphs, 700);
  const fallbackRef = useRef(null);

  return isMobile ? responsive : { pages: dynamic, containerRef: fallbackRef };
}

/**
 * 封面页组件
 */
const PageCover = React.forwardRef(({ children }, ref) => (
  <div
    className={`${styles.page} ${styles["page-cover"]}`}
    ref={ref}
    data-density="hard"
  >
    <div className={`${styles["page-content"]} ${styles["page-full"]}`}>
      {children}
    </div>
  </div>
));

/**
 * 普通内容页组件
 */
const Page = React.forwardRef(({ number, children }, ref) => (
  <div className={styles.page} ref={ref}>
    <div className={styles["page-content"]}>
      <h2 className={styles["page-header"]}>Page {number}</h2>
      <div className={styles["page-text"]}>{children}</div>
      <div className={styles["page-footer"]}>Page {number}</div>
    </div>
  </div>
));

/**
 * 主翻页书组件
 */
export function FlipBook({
  content,
  bookTitle = "BOOK TITLE",
  endTitle = "THE END",
  mode = "auto", // "auto" 或 "comment"
}) {
  const flipBook = useRef();
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const isMobile = useMediaQuery("(max-width: 767px)");

  // 拆分为段落或评论数组
  const paragraphs = useMemo(() => {
    if (Array.isArray(content)) return content; // 每条评论模式
    if (typeof content === "string") {
      return content
        .split(/\n+/)
        .map((p) => p.trim())
        .filter(Boolean);
    }
    return [];
  }, [content]);

  // 自动分页（仅 auto 模式生效）
  const { pages: autoPages, containerRef } =
    useResponsiveOrDynamicPagination(isMobile, paragraphs);

  // 根据 mode 选择最终页数组
  const finalPages = useMemo(() => {
    if (mode === "comment") {
      // 每条评论独立一页
      return paragraphs.map((comment) => [comment]);
    }
    // 自动分页
    return autoPages;
  }, [mode, paragraphs, autoPages]);

  // 构造最终渲染数据：封面 + 内容 + 封底
  const pagesForFlip = useMemo(() => {
    const arr = [];
    arr.push({ type: "cover", content: bookTitle });
    finalPages.forEach((paras, i) => {
      arr.push({ type: "content", content: paras, pageNumber: i + 1 });
    });
    arr.push({ type: "cover", content: endTitle });
    return arr;
  }, [finalPages, bookTitle, endTitle]);

  const onPage = (e) => setPageIndex(e.data);

  // 计算总页数
  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      try {
        const flip = flipBook.current?.pageFlip?.();
        if (flip && typeof flip.getPageCount === "function") {
          setTotalPage(flip.getPageCount());
        }
      } catch {}
    });
    return () => window.cancelAnimationFrame(id);
  }, [pagesForFlip]);

  const nextButtonClick = () => flipBook.current?.pageFlip()?.flipNext();
  const prevButtonClick = () => flipBook.current?.pageFlip()?.flipPrev();

  if (!pagesForFlip.length) return <div>Loading book...</div>;

  return (
    <div className={styles.container} ref={containerRef}>
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
        {pagesForFlip.map((p, idx) =>
          p.type === "cover" ? (
            <PageCover key={`cover-${idx}`}>{p.content}</PageCover>
          ) : (
            <Page key={`page-${idx}`} number={p.pageNumber}>
              {p.content.map((para, j) => (
                <div key={j} dangerouslySetInnerHTML={{ __html: para }} />
              ))}
            </Page>
          )
        )}
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
