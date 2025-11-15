import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import styles from "./BookReviewEditor.module.css";
import { BookSelector } from "./BookSelector";
import { useBookReview  } from "../hooks/useBookReview.js";

export const BookReviewEditor = () => {
  const { reviews, addReview, loadReviews } = useBookReview();

  const [book, setBook] = useState(null);
  const [chapterTitle, setChapterTitle] = useState("");
  const [content, setContent] = useState("");

  // ⭐ 当用户选择书籍时，自动加载该书籍的评论
  useEffect(() => {
    if (book?.id) {
      loadReviews(book.id);
    }
  }, [book]);

  const handleSave = async () => {
    if (!book) return alert("请选择书籍！");

    await addReview({
      book_id: book.id,
      reviewer: "jim",
      chapter_title: chapterTitle,
      content
    });

    setChapterTitle("");
    setContent("");
    alert("提交成功！");
  };

  return (
    <div className={styles.editorContainer}>
      <h1 className={styles.title}>📚 经典书籍评论编辑器</h1>
      <div className={styles.metaFields}>
      {/* 选择书籍 */}
      <BookSelector
        value={book?.title || ""}
        onSelect={(b) => setBook(b)}
      />

      <input
        type="text"
        placeholder="章节标题"
        value={chapterTitle}
        onChange={(e) => setChapterTitle(e.target.value)}
      />
      </div>

      <ReactQuill
        value={content}
        onChange={setContent}
        placeholder="写下你的评论、引文或感悟..."
        className={styles.quillEditor}
      />

      <div className={styles.actions}>
        <button onClick={handleSave}>💾 保存评论（提交到服务器）</button>
      </div>
      <hr />
      <div className={styles.previewSection}>
        <h2>📝 已保存的评论</h2>
        {reviews.length === 0 && <p>暂无评论内容。</p>}
        {reviews.map((r) => (
          <div key={r.id} className={styles.reviewCard}>
            <h3>{r.bookTitle} - {r.chapterTitle}</h3>
            <p><strong>作者：</strong>{r.author || "佚名"}</p>
            <div
              className={styles.reviewContent}
              dangerouslySetInnerHTML={{ __html: r.content }}
            />
            <p className={styles.time}>创建于：{r.createdAt}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

