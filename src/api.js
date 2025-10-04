// src/api.js

// 替换为你的 WebHostMost 上的后端服务域名 (例如: https://api.yourdomain.com)
// 确保它与你后端 Express 中的 /api 路由匹配
const BASE_URL = 'https://your-main-domain.com/api'; 

/**
 * 封装获取测试数据的请求
 * @returns {Promise<Object>}
 */
export async function fetchTestData() {
  const endpoint = `${BASE_URL}/test`; // 假设后端有一个 /api/test 接口
  
  console.log(`Sending request to: ${endpoint}`);

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      // 如果你的后端需要身份验证（Cookie），credentials 必须是 'include'
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching test data:", error);
    throw error; 
  }
}