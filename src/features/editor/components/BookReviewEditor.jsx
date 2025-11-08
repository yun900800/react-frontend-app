// src/components/BookReviewEditor.jsx
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import styles from "./BookReviewEditor.module.css";

export const BookReviewEditor = () => {
  const [bookTitle, setBookTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [chapterTitle, setChapterTitle] = useState("");
  const [content, setContent] = useState("");
  const [savedReviews, setSavedReviews] = useState([]);

  // 从 localStorage 加载数据
  useEffect(() => {
    const data = localStorage.getItem("bookReviews");
    if (data) setSavedReviews(JSON.parse(data));
  }, []);

  const handleSave = () => {
    console.log('handleSave');
    if (!bookTitle || !chapterTitle || !content) {
      alert("请填写完整内容！");
      return;
    }

    const newReview = {
      id: Date.now(),
      bookTitle,
      author,
      chapterTitle,
      content,
      createdAt: new Date().toLocaleString(),
    };
    console.log('newReview',newReview);

    const updatedReviews = [...savedReviews, newReview];
    setSavedReviews(updatedReviews);
    localStorage.setItem("bookReviews", JSON.stringify(updatedReviews));

    setChapterTitle("");
    setContent("");
    alert("保存成功！");
  };

  return (
    <div className={styles.editorContainer}>
      <h1 className={styles.title}>📚 经典书籍评论编辑器</h1>

      <div className={styles.metaFields}>
        <input
          type="text"
          placeholder="书名"
          value={bookTitle}
          onChange={(e) => setBookTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="作者"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
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
        <button onClick={handleSave}>💾 保存评论</button>
      </div>

      <hr />

      <div className={styles.previewSection}>
        <h2>📝 已保存的评论</h2>
        {savedReviews.length === 0 && <p>暂无评论内容。</p>}
        {savedReviews.map((r) => (
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
