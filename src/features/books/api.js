import { fetcher } from '../../shared/lib/fetch';

/**
 * 辅助函数：处理 fetcher 的返回结果
 * @param {object} result - fetcher 返回的 { data, error } 对象
 * @returns {object} - 成功时返回 data，失败时抛出错误
 */
const handleApiResult = (result) => {
    if (result.error) {
        // 抛出业务错误即可
        const status = result.error.status || 500;
        const message = result.error.data?.error || `API Error ${status}`;
        const err = new Error(message);
        err.response = { status, data: result.error.data };
        throw err;
    }
    return result.data;
};

export const booksApi = {
  async getBooks(page = 1, limit = 10) {
    const url = `/api/books?page=${page}&limit=${limit}`;
    return fetcher.get(url).then(handleApiResult);
  },

  getBookById: (id) => 
    fetcher.get(`/api/books/${id}`),

  createBook: (bookData) => 
    fetcher.post('/api/books', bookData),

  updateBook: (id, bookData) => {
    const { reviews, ...payload } = bookData; // 排除 reviews 字段
    return fetcher.put(`/api/books/${id}`, payload);
  },

  deleteBook: (id) => 
    fetcher.delete(`/api/books/${id}`)
};
