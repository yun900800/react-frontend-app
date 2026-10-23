import { usePagination } from '../../../shared/hooks/usePagination';
import { booksApi } from '../api';

/**
 * 统一处理 fetcher 的 { data, error } 返回结构：
 * - 有 error 时抛出，交给调用方展示提示
 * - 无 error 时返回 data（删除接口 204 时 data 可能为空）
 */
const unwrap = (result) => {
  if (result?.error) {
    const status = result.error.status || 500;
    const message = result.error.data?.error || `API Error ${status}`;
    throw new Error(message);
  }
  return result?.data;
};

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
    const data = unwrap(await booksApi.createBook(book));
    await refresh();
    return data;
  };

  // ------------------------------
  // 更新书籍
  // ------------------------------
  const updateBook = async (id, book) => {
    const data = unwrap(await booksApi.updateBook(id, book));
    await refresh();
    return data;
  };

  // ------------------------------
  // 删除书籍
  // ------------------------------
  const deleteBook = async (id) => {
    unwrap(await booksApi.deleteBook(id));
    await refresh();
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
