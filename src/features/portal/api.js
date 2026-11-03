import { fetcher } from '../../shared/lib/fetch';

/**
 * 统一处理 fetcher 的 { data, error } 返回结构
 */
const unwrap = (result) => {
  if (result?.error) {
    const status = result.error.status || 500;
    const message =
      result.error.data?.error ||
      result.error.data?.message ||
      `API Error ${status}`;
    throw new Error(message);
  }
  return result?.data;
};

export const publicApi = {
  /**
   * 分页获取书籍列表（每本书内嵌 reviews）
   */
  async getBooks(page = 1, limit = 12) {
    return unwrap(await fetcher.get(`/api/public/books?page=${page}&limit=${limit}`));
  },

  /**
   * 获取单本书籍 + 评论
   */
  async getBook(bookId) {
    return unwrap(await fetcher.get(`/api/public/books/${bookId}`));
  },
};
