import { useEffect, useState } from 'react';
import { booksApi } from '../api';

export function useBooks() {
  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);

  const fetchBooks = async (pageNum = 1) => {
    setLoading(true);
    const res = await booksApi.getBooks(pageNum, limit);
    if (res.data) {
      setBooks(res.data.data);
      setTotal(res.data.total);
    }
    setLoading(false);
  };

  const addBook = async (book) => {
    const res = await booksApi.createBook(book);
    if (res.data) fetchBooks(page);
  };

  const updateBook = async (id, book) => {
    const res = await booksApi.updateBook(id, book);
    if (res.data) fetchBooks(page);
  };

  const deleteBook = async (id) => {
    const res = await booksApi.deleteBook(id);
    if (res.data || res.status === 200) fetchBooks(page);
  };

  useEffect(() => {
    fetchBooks(page);
  }, [page]);

  return { books, total, page, limit, setPage, addBook, updateBook, deleteBook, loading };
}
