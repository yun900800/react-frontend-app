// client/hooks/useClientData.js

import { useState, useEffect, useCallback } from 'react';
import { fetchClientsApi, deleteClientApi, updateClientApi } from '../api';

const useClientData = (initialPage = 1, pageSize = 5) => {
    // 列表状态
    const [clients, setClients] = useState([]);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 删除状态
    const [deleteStatus, setDeleteStatus] = useState({ loading: false, error: null });

    // 编辑模态框和更新状态
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null); 
    const [updateLoading, setUpdateLoading] = useState(false); 
    const [updateError, setUpdateError] = useState(null);

    // --- 数据获取函数 (可复用) ---
    const fetchClients = useCallback(async (page) => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchClientsApi(page, pageSize);
            console.log('Fetched clients:', result);
            setClients(result.clients);
            setTotalPages(Math.ceil(result.totalCount / pageSize));
            setCurrentPage(page); // 确保状态与请求页码同步
        } catch (err) {
            console.error('Failed to fetch clients:', err);
            setError('无法加载客户端列表，请检查API服务是否可用。');
            setClients([]);
        } finally {
            setLoading(false);
        }
    }, [pageSize]);
    
    // --- 生命周期/副作用 ---
    useEffect(() => {
        fetchClients(currentPage);
    }, [currentPage, fetchClients]);

    // --- 操作函数 ---
    
    const handleDeleteClient = async (clientId) => {
        if (!window.confirm('你确定要删除这个客户端吗？此操作不可逆。')) {
            return;
        }

        setDeleteStatus({ loading: true, error: null });

        try {
            await deleteClientApi(clientId);
            // 删除成功后，重新加载当前页数据
            fetchClients(currentPage); 
            setDeleteStatus({ loading: false, error: null });
        } catch (err) {
            console.error('Failed to delete client:', err);
            setDeleteStatus({
                loading: false,
                error: `删除失败: ${err.response?.data?.error || err.message}`
            });
        }
    };
    
    const handleEditClient = (client) => {
        setEditingClient(client); 
        setIsModalOpen(true);
    };

    const handleUpdateClient = async () => {
        if (!editingClient) return;
        setUpdateLoading(true);
        setUpdateError(null);
        try {
            await updateClientApi(editingClient); 
            fetchClients(currentPage); // 更新成功后，刷新列表
            handleCloseModal();
        } catch (err) {
            console.error('Failed to update client:', err);
            setUpdateError(err.response?.data?.error || err.message || '更新失败');
        } finally {
            setUpdateLoading(false);
        }
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingClient(null);
        setUpdateError(null);
    }
    
    return {
        // 状态
        clients, currentPage, totalPages, loading, error, deleteStatus, 
        isModalOpen, editingClient, updateLoading, updateError,
        
        // 操作
        setCurrentPage, handleDeleteClient, handleEditClient, handleUpdateClient,
        setEditingClient, handleCloseModal
    };
};

export default useClientData;