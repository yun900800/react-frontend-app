import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { BookBlock } from "../../books/components/BookReader/BookBlock";
import { sanitizeHtml } from "../../editor/utils/sanitizeHtml";
import { useMediaQuery } from "../../../shared/hooks/useMediaQuery";
import { buildReviewSpreads } from "../utils/buildReviewSpreads";
import { formatDate } from "../utils/formatDate";
import styles from "./ReviewBookOverlay.module.css";

const MOBILE_QUERY = "(max-width: 768px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const ANIMATION_STEP_MS = 500;

const isHexColor = (value) => /^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(value || "");

function CoverPage({ cover }) {
  const fallbackStyle = isHexColor(cover.fontColor)
    ? {
        background: `linear-gradient(155deg, ${cover.fontColor} 0%, ${cover.fontColor}55 130%)`,
      }
    : undefined;

  return (
    <div className={styles.coverPage} style={fallbackStyle}>
      {cover.coverUrl ? (
        <img src={cover.coverUrl} alt={cover.title} />
      ) : (
        <span className={styles.coverChar}>{cover.firstChar}</span>
      )}
    </div>
  );
}

function TitlePage({ cover }) {
  return (
    <div className={styles.titlePage}>
      <h2 className={styles.bookTitle}>{cover.title}</h2>
      <p className={styles.bookAuthor}>{cover.author}</p>
      {cover.preface ? (
        <blockquote className={styles.preface}>{cover.preface}</blockquote>
      ) : null}
    </div>
  );
}

function ReviewPage({ review }) {
  const safeContent = useMemo(
    () => (review ? sanitizeHtml(review.content) : ""),
    [review]
  );

  if (!review) {
    return <div className={`${styles.side} ${styles.blankPage}`} aria-hidden="true" />;
  }

  return (
    <div className={styles.side}>
      <header className={styles.reviewHeader}>
        <span className={styles.reviewer}>{review.reviewer || "匿名"}</span>
        {review.chapter_title ? (
          <span className={styles.chapter}>{review.chapter_title}</span>
        ) : null}
        {review.created_at ? (
          <time className={styles.date}>{formatDate(review.created_at)}</time>
        ) : null}
      </header>
      <div
        className={styles.reviewBody}
        tabIndex={0}
        // 评论由 Quill 生成，渲染前统一走白名单消毒
        dangerouslySetInnerHTML={{ __html: safeContent }}
      />
    </div>
  );
}

/**
 * 全屏书评翻书浮层。
 * 挂载即开始打开动画；关闭动画结束后才调用 onClose，父组件再卸载。
 */
export default function ReviewBookOverlay({ book, onClose }) {
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const prefersReducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  const canAnimate = !prefersReducedMotion;
  const step = canAnimate ? ANIMATION_STEP_MS : 0;

  const { cover, spreads } = useMemo(() => buildReviewSpreads(book), [book]);

  const [phase, setPhase] = useState("opening");
  const [bigBookState, setBigBookState] = useState("hidden");
  const [coverOpen, setCoverOpen] = useState(false);
  const [coverClosing, setCoverClosing] = useState(false);

  const phaseRef = useRef("opening");
  const closeRequestedRef = useRef(false);
  const timersRef = useRef([]);
  const closeButtonRef = useRef(null);
  const previouslyFocusedRef = useRef(null);
  const scrollYRef = useRef(0);
  const onCloseRef = useRef(onClose);
  // 打开时序只在挂载时决定一次，避免运行中切换减少动效导致挂载 effect 重跑
  const animateOnMountRef = useRef(canAnimate);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const startClose = useCallback(() => {
    if (phaseRef.current === "closing") return;

    phaseRef.current = "closing";
    setPhase("closing");
    setBigBookState("closing");

    const closeStep = canAnimate ? ANIMATION_STEP_MS : 0;

    timersRef.current.push(
      setTimeout(() => {
        setBigBookState("hidden");
        setCoverOpen(false);
        setCoverClosing(true);
      }, closeStep)
    );

    timersRef.current.push(
      setTimeout(() => {
        onCloseRef.current?.();
      }, closeStep * 2)
    );
  }, [canAnimate]);

  const requestClose = useCallback(() => {
    if (phaseRef.current === "closing") return;

    // 打开动画还没结束：先记下请求，进入 open 后立刻关闭
    if (phaseRef.current === "opening") {
      closeRequestedRef.current = true;
      return;
    }

    startClose();
  }, [startClose]);

  useEffect(() => {
    previouslyFocusedRef.current = document.activeElement;
    scrollYRef.current = window.scrollY;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const raf = requestAnimationFrame(() => setCoverOpen(true));
    const openStep = animateOnMountRef.current ? ANIMATION_STEP_MS : 0;

    timersRef.current.push(
      setTimeout(() => setBigBookState("open"), openStep)
    );
    timersRef.current.push(
      setTimeout(() => {
        phaseRef.current = "open";
        setPhase("open");
      }, openStep * 2)
    );

    closeButtonRef.current?.focus();

    return () => {
      cancelAnimationFrame(raf);
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      document.body.style.overflow = previousOverflow;
      window.scrollTo({ top: scrollYRef.current, behavior: "auto" });
      previouslyFocusedRef.current?.focus?.();
    };
    // 只在挂载/卸载时执行，动画时长取挂载时的快照
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase === "open" && closeRequestedRef.current) {
      closeRequestedRef.current = false;
      startClose();
    }
  }, [phase, startClose]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") requestClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [requestClose]);

  const pages = useMemo(
    () => [
      <div className={styles.spread} key="cover">
        <CoverPage cover={cover} />
        <TitlePage cover={cover} />
      </div>,
      ...spreads.map((spread, index) => (
        <div className={styles.spread} key={`spread-${index}`}>
          <ReviewPage review={spread.left} />
          <ReviewPage review={spread.right} />
        </div>
      )),
    ],
    [cover, spreads]
  );

  return createPortal(
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label={`${book.title || "书籍"} 书评`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <button
        ref={closeButtonRef}
        type="button"
        className={styles.closeButton}
        onClick={requestClose}
        aria-label="关闭"
      >
        <X size={20} />
      </button>

      <div
        className={styles.perspective}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) requestClose();
        }}
      >
        <div
          className={`${styles.book} ${coverOpen ? styles.bookOpen : ""} ${
            coverClosing ? styles.bookClosing : ""
          }`}
        >
          <div
            className={`${styles.cover} ${coverOpen ? styles.coverOpen : ""} ${
              coverClosing ? styles.coverClosing : ""
            }`}
          >
            <div className={styles.front}>
              {cover.coverUrl ? (
                <img src={cover.coverUrl} alt="" />
              ) : (
                <span className={styles.coverChar}>{cover.firstChar}</span>
              )}
            </div>
            <div className={styles.innerLeft} />
          </div>
          <div className={styles.innerRight} />
        </div>
      </div>

      {bigBookState !== "hidden" ? (
        <div
          className={`${styles.bigBook} ${
            bigBookState === "open" ? styles.bigBookShown : styles.bigBookClosing
          }`}
        >
          <div className={styles.bookBlockArea}>
            <BookBlock
              pages={pages}
              orientation={isMobile ? "horizontal" : "vertical"}
              width="100%"
              height="calc(100% - 62px)"
              maxWidth="100%"
            />
          </div>
        </div>
      ) : null}
    </div>,
    document.body
  );
}
