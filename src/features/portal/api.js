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
   * 可选按分类 / 标签 / 系列过滤。
   */
  async getBooks(page = 1, limit = 12, filters = {}) {
    const params = new URLSearchParams({ page, limit });
    if (filters.category) params.set('category', filters.category);
    if (filters.tag) params.set('tag', filters.tag);
    if (filters.series) params.set('series', filters.series);

    return unwrap(await fetcher.get(`/api/public/books?${params.toString()}`));
  },

  /**
   * 获取公开站点的分类 / 标签 / 系列及数量
   */
  async getTaxonomies() {
    return unwrap(await fetcher.get('/api/public/taxonomies'));
  },

  /**
   * 获取全站最新公开书评
   */
  async getLatestReviews(limit = 5) {
    return unwrap(await fetcher.get(`/api/public/reviews?limit=${limit}`));
  },

  /**
   * 获取单本书籍 + 评论
   */
  async getBook(bookId) {
    return unwrap(await fetcher.get(`/api/public/books/${bookId}`));
  },
};
