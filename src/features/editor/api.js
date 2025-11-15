import { fetcher } from '../../shared/lib/fetch';
export const booksApi = {
    searchBooks: (query) =>
    fetcher.get(`/api/books/search?keyword=${encodeURIComponent(query)}`),

    /**
   * 添加评论
   * @param {object} data { book_id, reviewer, chapter_title, content }
   */
  addReview: (data) =>
    fetcher.post('/api/reviews', data),

  /**
   * 根据书籍 ID 获取评论列表
   * @param {number} bookId
   */
  getReviews: (bookId) =>
    fetcher.get(`/api/reviews/${bookId}`)
}