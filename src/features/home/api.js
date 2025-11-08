import { fetcher } from '../../shared/lib/fetch';

export const booksApi = {
  getBooks: (page = 1, limit = 10) => 
    fetcher.get(`/api/books?page=${page}&limit=${limit}`)
};
