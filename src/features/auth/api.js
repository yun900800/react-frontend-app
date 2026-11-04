import { fetcher } from '../../shared/lib/fetch';
// 认证类接口的 401 属于业务校验失败（密码/验证码错误），关闭全局登出跳转
const authRequestConfig = { skipAuthRedirect: true };

export const authApi = {
  login: (username, password) => fetcher.post('/api/auth/login', { email:username, password }, authRequestConfig),
  register: (username, password, email, code) => fetcher.post('/api/auth/register', { username, password, email, code }, authRequestConfig),
  logout: () => fetcher.post('/api/auth/logout'),
  /** 发送邮箱验证码 purpose: 'register' | 'login' */
  requestEmailCode: (email, purpose) => fetcher.post('/api/auth/email/request-code', { email, purpose }, authRequestConfig),
  /** 邮箱验证码登录（成功返回与密码登录一致的 token/user） */
  loginByCode: (email, code) => fetcher.post('/api/auth/login/code', { email, code }, authRequestConfig),
};
