import React, { useState, useEffect, useRef, useMemo } from "react";
import ReactQuill from "react-quill-new";
import { Maximize2, Minimize2 } from "lucide-react";
import "react-quill-new/dist/quill.snow.css";
import styles from "./BookReviewEditor.module.css";
import { BookSelector } from "./BookSelector";
import { useBookReview  } from "../hooks/useBookReview.js";
import { sanitizeHtml } from "../utils/sanitizeHtml.js";
import { getReviewerName } from "../../../shared/lib/currentUser.js";
// 引入新的 Hook
import { useAutoDraft } from "../hooks/useAutoDraft.js"; // 假设路径正确
import { useToast } from '../../../shared/components/Toast'; 

// --- 辅助函数：生成唯一的草稿键 ---
const getDraftKey = (bookId) => `review_draft_book_${bookId}`;

// --- Quill 配置：必须放在组件外，避免每次渲染重建工具栏 ---
const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link"],
    ["clean"],
  ],
  history: { delay: 800, maxStack: 100, userOnly: true },
};

// 白名单格式：粘贴进来的无关样式（字体、图片、内联样式）会被自动丢弃
const QUILL_FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "blockquote",
  "code-block",
  "link",
];

// 工具栏中文提示：Quill 默认只有英文 aria-label，这里在挂载后统一补上
const TOOLBAR_LABELS = [
  ["button.ql-bold", "加粗（Ctrl+B）"],
  ["button.ql-italic", "斜体（Ctrl+I）"],
  ["button.ql-underline", "下划线（Ctrl+U）"],
  ["button.ql-strike", "删除线"],
  ["button.ql-blockquote", "引用"],
  ["button.ql-code-block", "代码块"],
  ["button.ql-link", "插入链接"],
  ["button.ql-clean", "清除格式"],
  ['button.ql-list[value="ordered"]', "有序列表"],
  ['button.ql-list[value="bullet"]', "无序列表"],
];

const PICKER_LABELS = [
  [".ql-picker.ql-header", "标题级别"],
  [".ql-picker.ql-color", "文字颜色"],
  [".ql-picker.ql-background", "背景色"],
];

const ReviewCard = ({ review }) => {
  const safeContent = useMemo(
    () => sanitizeHtml(review.content),
    [review.content]
  );

  // 1. 定义格式化函数
  const formatTime = (isoString) => {
    if (!isoString) return '时间未知';
    
    // 使用 Intl.DateTimeFormat 进行本地化格式化
    // 选项：显示年份、月份、日期和时间（小时/分钟）
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // 使用24小时制
    };
    
    // 注意：默认会使用运行环境（用户浏览器）的 locale
    return new Date(isoString).toLocaleDateString(undefined, options);
  };
  return (
    <div key={review.id} className={styles.reviewCard}>
      <h3>{review.bookTitle} - {review.chapter_title}</h3>
      <p><strong>作者：</strong>{review.reviewer || "佚名"}</p>
      <div
        className={styles.reviewContent}
        dangerouslySetInnerHTML={{ __html: safeContent }}
      />
      <p className={styles.time}>创建于：{formatTime(review.created_at)}</p>
    </div>
  );
} 

export const BookReviewEditor = () => {
  const { reviews, addReview, loadReviews , isLoading, error} = useBookReview();

  const [book, setBook] = useState(null);
  // *** 关键修改 1: 将 book 相关的草稿键放在 useEffect 中处理 ***
  // 我们需要一个状态来存储当前正在使用的草稿键，以便 useAutoDraft 能够正确工作
  const [draftKey, setDraftKey] = useState(null);

  // *** 关键修改 2: 使用 useAutoDraft 替代原来的 useState ***
  // 注意：我们使用 null 作为初始值，确保在没有 draftKey 时不触发保存
  const [chapterTitle, setChapterTitle, clearTitleDraft] = useAutoDraft(
      draftKey ? `${draftKey}_title` : 'temp_title', 
      "", // 默认初始值
      500
  );
  const [content, setContent, clearContentDraft] = useAutoDraft(
      draftKey ? `${draftKey}_content` : 'temp_content', 
      "", // 默认初始值
      500
  );

  const [isSaving, setIsSaving] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const quillRef = useRef(null);
  const containerRef = useRef(null);
  const addToast = useToast();
  const reviewerName = useMemo(() => getReviewerName(), []);

  // 给 Quill 工具栏补充中文提示（title + aria-label）
  useEffect(() => {
    const toolbar = containerRef.current?.querySelector('.ql-toolbar');
    if (!toolbar) return;

    TOOLBAR_LABELS.forEach(([selector, label]) => {
      toolbar.querySelectorAll(selector).forEach((element) => {
        element.setAttribute('title', label);
        element.setAttribute('aria-label', label);
      });
    });

    PICKER_LABELS.forEach(([selector, label]) => {
      const picker = toolbar.querySelector(selector);
      if (!picker) return;

      picker.setAttribute('title', label);
      const trigger = picker.querySelector('.ql-picker-label');
      trigger?.setAttribute('title', label);
      trigger?.setAttribute('aria-label', label);
    });
  }, []);
  // ⭐ 当用户选择书籍时，更新草稿键并加载该书籍的评论
  useEffect(() => {
    if (book?.id) {
      loadReviews(book.id);
      // 更新 draftKey，让 useAutoDraft 知道新的存储位置
      setDraftKey(getDraftKey(book.id));
    } else {
        setDraftKey(null);
    }
  }, [book, loadReviews]);

  const handleSave = async () => {
    if (!book) {
      addToast('请选择书籍！', 'warning');
      return;
    }
    const emptyQuillContent = "<p><br></p>";
    // 检查内容是否为空，或仅包含空白字符/Quill空内容
    if (!content.trim() || content === emptyQuillContent) {
      addToast('评论内容不能为空！', 'warning');
      return; 
    }

    setIsSaving(true); // 开始保存

    try {
      await addReview({
        book_id: book.id,
        reviewer: reviewerName,
        chapter_title: chapterTitle.trim() || "无章节标题", // 保证至少有一个值
        content
      });

      // 成功后清空状态
      setChapterTitle("");
      setContent("");
      // 2. ✅ 提交成功：清空两个草稿和本地状态 (Hook 内部会自动清空状态)
      clearTitleDraft();
      clearContentDraft();
      addToast('提交成功！','success');
    } catch (e) {
      addToast('保存失败！','error');
    } finally {
      setIsSaving(false); // 结束保存
    }
  };

  const handleContentChange = (newContent) => {
      // 定义 Quill 的空内容字符串
      const emptyQuillContent = "<p><br></p>";

      // 检查内容是否等于空内容或空白的纯文本（例如只剩下空格）
      if (newContent === emptyQuillContent || newContent.trim() === '') {
          // 如果是空内容，设置状态为真正的空字符串
          setContent("");
      } else {
          // 否则，设置实际内容
          setContent(newContent);
      }
  };

  // 字数统计：直接从 HTML 计算，避免 Quill 受控更新时序导致首次渲染统计为 0
  useEffect(() => {
    if (!content) {
      setCharCount(0);
      return;
    }

    try {
      const text = new DOMParser().parseFromString(content, 'text/html').body
        .textContent;
      setCharCount((text || '').replace(/\s+/g, ' ').trim().length);
    } catch {
      setCharCount(0);
    }
  }, [content]);

  // 专注模式：Esc 退出 + 锁定背景滚动
  useEffect(() => {
    if (!isFocusMode) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsFocusMode(false);
        if (document.fullscreenElement) {
          document.exitFullscreen?.().catch(() => {});
        }
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isFocusMode]);

  // 用户通过浏览器自带方式退出原生全屏时，同步退出专注模式
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFocusMode(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleFocus = async () => {
    if (isFocusMode) {
      setIsFocusMode(false);
      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen();
        } catch {
          // 忽略：CSS 覆盖层已经退出
        }
      }
      return;
    }

    setIsFocusMode(true);

    // 原生全屏是加分项：被浏览器拒绝时，CSS 覆盖层仍然可用
    try {
      await containerRef.current?.requestFullscreen?.();
    } catch {
      // 忽略
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.editorContainer} ${isFocusMode ? styles.focusMode : ''}`}
    >
      <div className={styles.focusInner}>
        <div className={styles.header}>
          <h1 className={styles.title}>评论编辑</h1>
          <button
            type="button"
            className={styles.focusToggle}
            onClick={handleToggleFocus}
            aria-pressed={isFocusMode}
            title={isFocusMode ? '退出专注模式（Esc）' : '进入专注模式'}
          >
            {isFocusMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            <span>{isFocusMode ? '退出专注' : '专注模式'}</span>
          </button>
        </div>
        <div className={styles.metaFields}>
        {/* 选择书籍 */}
          <BookSelector
            value={book?.title || ""}
            onSelect={(b) => setBook(b)}
          />
          <div style={{display: 'flex', alignItems: 'center'}}>
          <input
            type="text"
            placeholder="章节标题"
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
          />
          </div>
        </div>

        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={handleContentChange}
          modules={QUILL_MODULES}
          formats={QUILL_FORMATS}
          placeholder="写下你的评论、引文或感悟..."
          className={styles.quillEditor}
        />

        <div className={styles.editorFooter}>
          <span>{charCount} 字 · {reviewerName}</span>
          <span>{book ? `正在编辑：${book.title}` : '请先选择书籍'}</span>
        </div>

        <div className={styles.actions}>
          <button onClick={handleSave} disabled={!book || isSaving}>
            {isSaving ? "⏳ 正在保存..." : "💾 保存评论"}
          </button>
        </div>
        <hr />
        {/* 8. 在 JSX 中展示加载和错误状态 */}
        <div className={styles.previewSection}> 
          <h2>📝 已保存的评论</h2>
          
          {/* 加载、错误、空状态逻辑 */}
          {isLoading && <p>📚 正在加载评论...</p>}
          {error && <p className={styles.error}>加载失败：{error.message || "未知错误"}</p>}

          {/* 只有在不加载、没有错误且评论为空时，才显示“暂无内容” */}
          {!isLoading && !error && reviews.length === 0 && (
            <p>请选择一本书籍，或者暂无评论内容。</p>
          )}

          {/* 渲染评论列表 */}
          {!isLoading && !error && reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      </div>
    </div>
  );
};

