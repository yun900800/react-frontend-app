import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import styles from "./BookReviewEditor.module.css";
import { BookSelector } from "./BookSelector";
import { useBookReview  } from "../hooks/useBookReview.js";
// 引入新的 Hook
import { useAutoDraft } from "../hooks/useAutoDraft.js"; // 假设路径正确
import { useToast } from '../../../shared/components/Toast'; 

// --- 辅助函数：生成唯一的草稿键 ---
const getDraftKey = (bookId) => `review_draft_book_${bookId}`;

const ReviewCard = ({ review }) => {
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
        dangerouslySetInnerHTML={{ __html: review.content }}
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
  const addToast = useToast();
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
        reviewer: "jim",
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

  console.log("当前评论列表：", reviews);

  return (
    <div className={styles.editorContainer}>
      <h1 className={styles.title}>评论编辑</h1>
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
        value={content}
        onChange={handleContentChange}
        placeholder="写下你的评论、引文或感悟..."
        className={styles.quillEditor}
      />

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
  );
};

