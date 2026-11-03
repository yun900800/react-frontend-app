import { useEffect, useState } from 'react';
import { publicApi } from '../api';

export function useBookDetail(bookId) {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookId) {
      setLoading(false);
      setBook(null);
      return undefined;
    }

    let alive = true;
    setLoading(true);
    setError(null);
    setBook(null);

    publicApi
      .getBook(bookId)
      .then((data) => {
        if (!alive) return;
        setBook(data);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err?.message || '加载失败，请稍后重试');
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [bookId]);

  return { book, loading, error };
}
