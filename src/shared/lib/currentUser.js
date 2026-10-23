/**
 * 当前登录用户信息。
 *
 * 登录接口会返回 { id, email }，但旧版本前端只保存了 token。
 * 这里做了两层兼容：
 *   1. 优先读 localStorage 中的 auth-user；
 *   2. 没有时尝试解析 JWT 的 payload（至少能拿到 userId）。
 */

const USER_KEY = 'auth-user';

const decodeJwtPayload = (token) => {
  try {
    const part = token.split('.')[1];
    if (!part) return null;

    const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '='
    );
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const saveCurrentUser = (user) => {
  if (!user || typeof user !== 'object') return;
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // localStorage 不可用时静默失败
  }
};

export const clearCurrentUser = () => {
  try {
    localStorage.removeItem(USER_KEY);
  } catch {
    // 忽略
  }
};

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch {
    // 数据损坏时继续走 JWT 兜底
  }

  const token = localStorage.getItem('token');
  const payload = token ? decodeJwtPayload(token) : null;
  if (payload?.userId) {
    return { id: payload.userId };
  }

  return null;
};

/** 用于评论的 reviewer 字段：优先用户名，其次邮箱 */
export const getReviewerName = () => {
  const user = getCurrentUser();
  if (!user) return '匿名';
  return user.username || user.email || `用户${user.id ?? ''}`;
};
