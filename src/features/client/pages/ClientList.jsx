// client/pages/ClientList.jsx

import React, { useState, useEffect } from 'react';
// 假设这些是你的共享组件
import Modal from '../../../shared/components/Modal'; 
import ModalCard from '../../../shared/components/ModalCard';
import EditClientForm from '../components/EditClientForm';
// 假设这些是正确的样式导入路径
import { styles } from '../../../shared/css/components/styles.js';
import * as typegraphyStyles from '../../../shared/css/typography.module.css';
import { fetchClientsApi, deleteClientApi, updateClientApi } from '../api'; 

// 通用状态消息组件 (复制自 CreateClient.jsx，或应放在 shared/components)
const StatusMessage = ({ type, message }) => {
    const messageStyles = {
        loading: styles.loadingMessage,
        error: styles.errorMessage,
        empty: styles.emptyMessage,
    };
    return <div className={messageStyles[type]}>{message}</div>;
};

// 客户端列表的表格组件 (新增 ownerId 列)
const ClientTable = ({ clients, onDeleteClient,onEditClient  }) => (
  <div className={styles.tableContainer}>
    <table className={styles.table}>
      <thead>
        <tr className={styles.tableHeader}>
          <th className={styles.tableHeaderCell}>Client ID</th>
          <th className={styles.tableHeaderCell}>名称</th>
          <th className={styles.tableHeaderCell}>重定向 URI</th>
            <th className={styles.tableHeaderCell}>所有者 ID</th> {/* 新增 ownerId 列 */}
            <th className={styles.tableHeaderCell}>操作</th>
        </tr>
      </thead>
      <tbody className={styles.tableBody}>
        {clients.map((client) => (
          <tr key={client.id} className={styles.tableRow}>
            <td className={styles.tableCell}>{client.id}</td>
            <td className={styles.tableCell}>{client.name}</td>
            <td className={styles.tableCell}>
              {client.redirectUris?.split(',').map((uri, index) => (
                <div key={index}>{uri}</div>
              ))}
            </td>
            <td className={styles.tableCell}>{client.ownerId || 'N/A'}</td> {/* 展示 ownerId */}
            <td className={styles.tableCell}>
              <button
                className={`${styles.actionButton} ${styles.editButton} primary-button`}
                onClick={() => onEditClient(client)}
              >
                修改
              </button>
              <button
                className={`${styles.deleteButton} primary-button`}
                onClick={() => onDeleteClient(client.id)}
              >
                删除
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// 通用分页组件
const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className={styles.pagination}>
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className={`${styles.paginationButton} ${currentPage === 1 ? styles.disabledButton : ''}`}
    >
      上一页
    </button>
    <span className={styles.paginationStatus}>
      第 {currentPage} 页 / 共 {totalPages} 页
    </span>
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className={`${styles.paginationButton} ${currentPage === totalPages ? styles.disabledButton : ''}`}
    >
      下一页
    </button>
  </div>
);


// 完整的客户端列表页面 (作为 export default)
const ClientList = () => {
    // ... [state hooks 保持不变] ...
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null); 
    const [clients, setClients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [deleteStatus, setDeleteStatus] = useState({ loading: false, error: null });

    const [updateLoading, setUpdateLoading] = useState(false); 
    const [updateError, setUpdateError] = useState(null);

    const pageSize = 5;

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchClientsApi(currentPage, pageSize);
      setClients(result.clients);
      setTotalPages(Math.ceil(result.totalCount / pageSize));
    } catch (err) {
      console.error('Failed to fetch clients:', err);
      setError('无法加载客户端列表，请检查API服务是否可用。');
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [currentPage, pageSize]);

  const handleDeleteClient = async (clientId) => {
    if (!window.confirm('你确定要删除这个客户端吗？此操作不可逆。')) {
      return;
    }

    setDeleteStatus({ loading: true, error: null });

    try {
      await deleteClientApi(clientId);
      fetchClients(); 
      setDeleteStatus({ loading: false, error: null });
    } catch (err) {
      console.error('Failed to delete client:', err);
      setDeleteStatus({
        loading: false,
        error: `删除失败: ${err.response?.data?.error || err.message}`
      });
    }
  };

  const handleUpdateClient = async () => {
    if (!editingClient) return;
    setUpdateLoading(true);
    setUpdateError(null);
    try {
      await updateClientApi(editingClient); 
      fetchClients();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to update client:', err);
      setUpdateError(err.response?.data?.error || err.message || '更新失败');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleEditClient = (client) => {
    setEditingClient(client); 
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
    setUpdateError(null);
  }

  return (
    <div className={styles.formContainer}>
      <h1 className={typegraphyStyles.heading}>客户端列表</h1>
      <p className={typegraphyStyles.subheading}>在此查看所有已注册的 OAuth2 客户端。</p>

      {deleteStatus.loading && <StatusMessage type="loading" message="删除中..." />}
      {deleteStatus.error && <StatusMessage type="error" message={deleteStatus.error} />}

      {loading ? (
        <StatusMessage type="loading" message="加载中..." />
      ) : error ? (
        <StatusMessage type="error" message={error} />
      ) : clients.length === 0 ? (
        <StatusMessage type="empty" message="没有找到任何客户端。" />
      ) : (
        <>
          <ClientTable clients={clients} 
            onDeleteClient={handleDeleteClient} 
            onEditClient={handleEditClient} 
            />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
      
       {isModalOpen && editingClient && (
          <Modal >
            <ModalCard
              onClose={handleCloseModal}
              title={`修改客户端: ${editingClient.name}`}
              actions={(
                <>
                  {updateError && <div className={styles.errorMessage}>{updateError}</div>}
                  <button
                    type="button"
                    onClick={handleUpdateClient}
                    disabled={updateLoading}
                    className={`${styles.submitButton} primary-button ${updateLoading ? styles.submitButtonLoading : ''}`}
                  >
                    {updateLoading ? '保存中...' : '保存修改'}
                  </button>
                  <button type="button" className={`${styles.cancelButton} primary-button`} onClick={handleCloseModal}>
                    取消
                  </button>
                </>
              )}
            >
              <EditClientForm
                clientName={editingClient.name}
                setClientName={(name) => setEditingClient({...editingClient, name})}
                redirectUris={editingClient.redirectUris}
                setRedirectUris={(uris) => setEditingClient({...editingClient, redirectUris: uris})}
                grants={editingClient.grants}
                setGrants={(grants) => setEditingClient({...editingClient, grants})}
              />
            </ModalCard>
          </Modal>
        )}
    </div>
  );
};

export default ClientList;