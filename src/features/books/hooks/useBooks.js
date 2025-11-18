import { usePagination } from '../../../shared/hooks/usePagination';
import { booksApi } from '../api';

export function useBooks(initialPage = 1, limit = 10) {

  // ------------------------------
  // 使用 usePagination 处理分页
  // ------------------------------
  const {
    data: books,
    total,
    page,
    setPage,
    loading,
    error,
    refresh, // 刷新当前页
  } = usePagination(booksApi.getBooks, initialPage, limit);


  // ------------------------------
  // 添加书籍
  // ------------------------------
  const addBook = async (book) => {
    const res = await booksApi.createBook(book);
    if (res.data) await refresh();  // 刷新当前页
  };


  // ------------------------------
  // 更新书籍
  // ------------------------------
  const updateBook = async (id, book) => {
    const res = await booksApi.updateBook(id, book);
    if (res.data) await refresh();
  };


  // ------------------------------
  // 删除书籍
  // ------------------------------
  const deleteBook = async (id) => {
    const res = await booksApi.deleteBook(id);
    if (res.data || res.status === 200) await refresh();
  };


  // ------------------------------
  // 保持原返回结构不变
  // ------------------------------
  return {
    books,
    total,
    page,
    limit,
    setPage,
    loading,
    error,

    addBook,
    updateBook,
    deleteBook,
  };
}
