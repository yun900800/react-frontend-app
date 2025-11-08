import { fetcher } from '../../shared/lib/fetch';

export const booksApi = {
  getBooks: (page = 1, limit = 10) => 
    fetcher.get(`/api/books?page=${page}&limit=${limit}`),

  getBookById: (id) => 
    fetcher.get(`/api/books/${id}`),

  createBook: (bookData) => 
    fetcher.post('/api/books', bookData),

  updateBook: (id, bookData) => 
    fetcher.put(`/api/books/${id}`, bookData),

  deleteBook: (id) => 
    fetcher.delete(`/api/books/${id}`)
};
