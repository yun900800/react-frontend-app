import { fetcher } from '../../shared/lib/fetch';
export const authApi = {
  login: (username, password) => fetcher.post('/api/auth/login', { email:username, password }),
  register: (username, password, email) => fetcher.post('/api/auth/register', { username, password, email }),
  logout: () => fetcher.post('/api/auth/logout'),
};