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
    if (result.error) {
        // 抛出业务错误即可
        const status = result.error.status || 500;
        const message = result.error.data?.error || `API Error ${status}`;
        const err = new Error(message);
        err.response = { status, data: result.error.data };
        throw err;
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