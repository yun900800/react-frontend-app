import { useEffect, useState } from 'react';
import { publicApi } from '../api';

const normalizeBookKey = (value) => String(value ?? '').trim().toLowerCase();

const matchesBookKey = (book, key) => {
  if (!book) return false;
  const normalizedKey = normalizeBookKey(key);
  return (
    String(book.id) === normalizedKey ||
    normalizeBookKey(book.slug) === normalizedKey
  );
};

export function useBookDetail(bookId, initialBook = null) {
  const [book, setBook] = useState(initialBook);
  const [loading, setLoading] = useState(!initialBook);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookId) {
      setLoading(false);
      setBook(null);
      return undefined;
    }

    // The prerender pass already fetched this book. Use that payload instead
    // of immediately replacing the prerendered content with a loading state.
    if (initialBook && matchesBookKey(initialBook, bookId)) {
      setBook(initialBook);
      setLoading(false);
      setError(null);
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
  }, [bookId, initialBook]);

  // Avoid briefly showing the previous book while a client-side navigation is
  // fetching the next one.
  const isStaleBook = Boolean(book) && !matchesBookKey(book, bookId);

  return {
    book: isStaleBook ? null : book,
    loading: loading || isStaleBook,
    error,
  };
}
