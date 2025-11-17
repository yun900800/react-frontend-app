// shared/lib/fetch.js
const BASE_URL = 'https://bayh.pp.ua'; // 可选，如 '/api'
// const BASE_URL = "http://localhost:5002"; // 本地调试时使用本地后端地址
// const BASE_URL = "http://192.168.5.228:5002"; // 本地调试时使用本地后端地址
const DEFAULT_TIMEOUT = 5000; // 默认超时时间 5 秒

// ----------------------------------------------------
// 1. 超时功能封装
// ----------------------------------------------------
const withTimeout = (promise, timeoutMs) => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Request timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise
      .then((result) => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
};

const handleResponse = async (res) => {
  const contentType = res.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await res.json() : await res.text();
  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    // 返回一个永远 pending 的 Promise，避免后续代码执行
    return new Promise(() => {});
  }
  if (!res.ok) {
    return { error: { status: res.status, data } };
  }

  return { data };
};

const request = async (method, url, body, { headers = {}, timeout = DEFAULT_TIMEOUT } = {}) => {
  try {
    const requestHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };
    const token = localStorage.getItem('token');

    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    let requestBody;
    const isBodyMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase());

    if (isBodyMethod && body) {
      const contentType = requestHeaders['Content-Type'];
      console.log('请求头信息是Content-Type:', contentType);

      if (contentType === 'application/x-www-form-urlencoded') {
        requestBody = new URLSearchParams(body).toString();
      } else if (contentType === 'multipart/form-data') {
        requestBody = body;
      } else {
        requestBody = JSON.stringify(body);
      }
    }

    const options = {
      method,
      headers: requestHeaders,
      credentials: 'include',
    };

    // 只有当请求需要 body 并且 requestBody 存在时，才添加到 options
    if (requestBody) {
      options.body = requestBody;
    }

    // 2. 将 fetch 请求包装在 withTimeout 中
    const responsePromise = fetch(BASE_URL + url, options);
    const response = await withTimeout(responsePromise, timeout);
    
    return await handleResponse(response);
  } catch (err) {
    return { error: { message: err.message, isTimeout: err.message.includes('timed out') } };
  }
};

// ----------------------------------------------------
// 3. 封装后的 API
// ----------------------------------------------------
export const fetcher = {
  get: (url, config = {}) => request('GET', url, null, config),
  post: (url, body, config = {}) => request('POST', url, body, config),
  put: (url, body, config = {}) => request('PUT', url, body, config),
  delete: (url, body, config = {}) => request('DELETE', url, body, config),
};