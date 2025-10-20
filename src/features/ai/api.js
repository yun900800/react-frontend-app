import { fetcher } from '../../shared/lib/fetch';
export const aiApi = {
  chat: (message, model) => fetcher.post('/api/ai/chat', { message, model },{ timeout: 15000 }),
};