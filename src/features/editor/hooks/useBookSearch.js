import { useState, useEffect, useRef } from "react";
import { booksApi } from "../api.js";

export const useBookSearch = (query) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!query || query.trim() === "") {
      setResults([]);
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await booksApi.searchBooks(query);
        setResults(res || []); // 假设后端返回数组
      } catch (err) {
        console.error("搜索书籍出错:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }, 300); // 防抖 300ms

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  return { results, loading, error };
};
