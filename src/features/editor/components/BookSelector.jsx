import React, { useState } from "react";
import { useBookSearch } from "../hooks/useBookSearch";
import styles from "./BookSelector.module.css";

export const BookSelector = ({ value, onSelect }) => {
  const [query, setQuery] = useState(value || "");
  const [showDropdown, setShowDropdown] = useState(false);
  const { results, loading } = useBookSearch(query);

  const handleSelect = (book) => {
    onSelect(book);
    setQuery(book.title);
    setShowDropdown(false);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setShowDropdown(true); // ✅ 输入时显示下拉
  };

  const handleBlur = () => {
    // 延迟隐藏，防止点击选项时立刻关闭
    setTimeout(() => setShowDropdown(false), 200);
  };

  return (
    <div className={styles.selector}>
      <input
        type="text"
        placeholder="搜索书名..."
        value={query}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)} // ✅ 聚焦时显示
        onBlur={handleBlur}
      />

      {loading && <div className={styles.loading}>加载中...</div>}

      {showDropdown && results?.data?.length > 0 && (
        <ul className={styles.dropdown}>
          {results.data.map((book) => (
            <li key={book.id} onClick={() => handleSelect(book)}>
              <strong>{book.title}</strong> — {book.author || "佚名"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
