// client/hooks/useClientData.js

import { useState, useEffect, useCallback } from 'react';
import { fetchClientsApi, deleteClientApi, updateClientApi } from '../api';
import { usePagination } from '../../../shared/hooks/usePagination';

const useClientData = (initialPage = 1, pageSize = 5) => {
    // ------------------------------
    // 1) 用 usePagination 接管分页
    // ------------------------------
    const {
        data: clients,
        total,
        page: currentPage,
        setPage: setCurrentPage,
        loading,
        error,
        refresh
    } = usePagination(fetchClientsApi, initialPage, pageSize);

    const totalPages = Math.ceil(total / pageSize);


    // ------------------------------
    // 2) 删除状态
    // ------------------------------
    const [deleteStatus, setDeleteStatus] = useState({
        loading: false,
        error: null,
    });


    // ------------------------------
    // 3) 编辑模态框与更新状态
    // ------------------------------
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState(null);


    // ------------------------------
    // 4) 删除客户端
    // ------------------------------
    const handleDeleteClient = async (clientId) => {
        if (!window.confirm('你确定要删除这个客户端吗？此操作不可逆。')) {
            return;
        }

        setDeleteStatus({ loading: true, error: null });

        try {
            await deleteClientApi(clientId);

            // 删除成功，刷新当前页
            await refresh();

            setDeleteStatus({ loading: false, error: null });
        } catch (err) {
            console.error('Failed to delete client:', err);
            setDeleteStatus({
                loading: false,
                error: err.response?.data?.error || err.message,
            });
        }
    };


    // ------------------------------
    // 5) 打开编辑模态框
    // ------------------------------
    const handleEditClient = (client) => {
        setEditingClient(client);
        setIsModalOpen(true);
    };


    // ------------------------------
    // 6) 更新客户端
    // ------------------------------
    const handleUpdateClient = async () => {
        if (!editingClient) return;

        setUpdateLoading(true);
        setUpdateError(null);

        try {
            await updateClientApi(editingClient);

            // 更新成功 → 刷新列表
            await refresh();

            handleCloseModal();
        } catch (err) {
            console.error('Failed to update client:', err);
            setUpdateError(err.response?.data?.error || err.message);
        } finally {
            setUpdateLoading(false);
        }
    };


    // ------------------------------
    // 7) 关闭模态框
    // ------------------------------
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingClient(null);
        setUpdateError(null);
    };


    // ------------------------------
    // 8) 保持所有返回字段不变
    // ------------------------------
    return {
        clients,
        currentPage,
        totalPages,
        loading,
        error,

        deleteStatus,
        isModalOpen,
        editingClient,
        updateLoading,
        updateError,

        setCurrentPage,
        handleDeleteClient,
        handleEditClient,
        handleUpdateClient,
        setEditingClient,
        handleCloseModal,
    };
};

export default useClientData;