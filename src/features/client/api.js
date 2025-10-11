// client/api.js

// --- 替换 axios，使用自定义的 fetcher ---
import { fetcher } from '../../shared/lib/fetch';

// 基础 URL (BASE_URL 已经在 fetcher 内部定义，这里只需要相对路径)
const BASE_PATH = '/api/client';

// 由于 fetcher 已经封装了错误处理，我们只需要处理返回的 { data, error } 结构

/**
 * 辅助函数：处理 fetcher 的返回结果
 * @param {object} result - fetcher 返回的 { data, error } 对象
 * @returns {object} - 成功时返回 data，失败时抛出错误
 */
const handleApiResult = (result) => {
    if (result.status === 401) {
        console.warn("API Unauthorized (401)，正在跳转到登录页...");
            
        // a. 清除过期的 token
        localStorage.removeItem('token'); 
        
        // b. 执行跳转
        // ** 实际项目中请替换为你的路由跳转方法 **
        window.location.href = '/login'; 
        
        // c. 立即抛出错误或返回一个 Promise.reject，阻止后续业务代码执行
        // 抛出的错误可以被调用方（如果需要）捕获，但页面已经跳转。
        const authError = new Error("Authorization Required (401). Redirecting to login.");
        authError.response = { status: 401 };
        throw authError;
    }
    if (result.error) {
        // 将 fetcher 内部的错误信息转换为可抛出的 Error 对象
        const status = result.error.status || 500;
        
        const message = result.error.data?.error || result.error.message || `API Error with status ${status}`;
        
        // 创建一个包含状态码和数据的错误对象，方便前端捕获
        const error = new Error(message);
        error.response = { data: result.error.data, status: status };
        throw error;
    }
    return result.data;
};

/**
 * 注册新客户端
 */
export const createClientApi = async (clientData) => {
    const result = await fetcher.post(`${BASE_PATH}`, clientData);
    return handleApiResult(result);
};

/**
 * 获取分页的客户端列表
 */
export const fetchClientsApi = async (page, pageSize) => {
    const url = `${BASE_PATH}?page=${page}&pageSize=${pageSize}`;
    const result = await fetcher.get(url);
    return handleApiResult(result);
};

/**
 * 删除指定 ID 的客户端
 */
export const deleteClientApi = async (clientId) => {
    // 使用 fetcher.delete，并将 clientId 放在 body 中
    const result = await fetcher.delete(`${BASE_PATH}/${clientId}`, { clientId });
    return handleApiResult(result);
};

/**
 * 更新客户端信息
 */
export const updateClientApi = async (updateData) => {
    const result = await fetcher.put(`${BASE_PATH}/${updateData.id}`, updateData);
    return handleApiResult(result);
};