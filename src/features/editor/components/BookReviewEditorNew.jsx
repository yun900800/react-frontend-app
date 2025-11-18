import React, { useState, useEffect, useCallback } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import styles from "./BookReviewEditor.module.css";
import { BookSelector } from "./BookSelector";
import { useBookReview } from "../hooks/useBookReview.js";
// 引入新的 Form 草稿 Hook
import { useFormDraft } from "../hooks/useFormDraft.js"; // 假设路径正确
import { useToast } from '../../../shared/components/Toast'; 

// --- 辅助函数：生成唯一的草稿键 ---
const getDraftKey = (bookId) => `review_draft_book_${bookId}`;

const ReviewCard = ({ review }) => {
  // 定义格式化函数
  const formatTime = (isoString) => {
    if (!isoString) return '时间未知';
    
    // 使用 Intl.DateTimeFormat 进行本地化格式化
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // 使用24小时制
    };
    
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
  const [draftKey, setDraftKey] = useState(null);

  // ⭐ 关键修改 1: 使用 useFormDraft 统一管理表单状态
  const { 
    formState, 
    setFormState, // 供非标准输入 (如 ReactQuill) 使用
    handleInputChange, // 供标准输入使用
    clearDraft // 供提交成功后清空草稿使用
  } = useFormDraft(
    draftKey, // 动态草稿键
    { chapterTitle: "", content: "" }, // 初始状态对象
    500
  );

  // 解构出当前的状态值
  const { chapterTitle, content } = formState;

  const [isSaving, setIsSaving] = useState(false);
  const addToast = useToast();

  // ⭐ 关键修改 2: 处理 BookSelector 选择的函数
  const handleBookSelect = useCallback((selectedBook) => {
    setBook(selectedBook);
    
    // 切换书籍时，清空当前评论表单内容，准备新的评论
    setFormState({ chapterTitle: "", content: "" });
    
    // 如果需要，也可以在此处调用 clearDraft(); 来清除旧书籍的草稿
    // 但通常切换书籍后，新的 draftKey 会自动加载新草稿（或默认值），所以不是必需的
  }, [setFormState]); 
  
  // ⭐ 当用户选择书籍时，更新草稿键并加载该书籍的评论
  useEffect(() => {
    if (book?.id) {
      loadReviews(book.id);
      // 更新 draftKey，让 useFormDraft 知道新的存储位置
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
        chapter_title: chapterTitle.trim() || "无章节标题", 
        content
      });

      // 成功后清空状态和草稿
      clearDraft(); 
      addToast('提交成功！','success');
    } catch (e) {
      addToast('保存失败！','error');
    } finally {
      setIsSaving(false); // 结束保存
    }
  };

  const handleContentChange = (newContent) => {
      const emptyQuillContent = "<p><br></p>";
      let valueToSet = newContent;

      if (newContent === emptyQuillContent || newContent.trim() === '') {
          valueToSet = "";
      } 
      
      // ⭐ 关键修改 3: 使用 setFormState 更新 content 字段
      setFormState(prevState => ({
        ...prevState,
        content: valueToSet,
      }));
  };

  console.log("当前评论列表：", reviews);

  return (
    <div className={styles.editorContainer}>
      <h1 className={styles.title}>评论编辑</h1>
      <div className={styles.metaFields}>
      {/* 选择书籍 */}
        <BookSelector
          value={book?.title || ""}
          // ⭐ 关键修改 4: 绑定到新的 handleBookSelect
          onSelect={handleBookSelect}
        />
        <div style={{display: 'flex', alignItems: 'center'}}>
        <input
          type="text"
          name="chapterTitle" // 必须设置 name 属性
          placeholder="章节标题"
          value={chapterTitle}
          // ⭐ 关键修改 5: 绑定到 useFormDraft 的 handleInputChange
          onChange={handleInputChange} 
        />
        </div>
      </div>

      <ReactQuill
        value={content}
        // 使用自定义的 change handler
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