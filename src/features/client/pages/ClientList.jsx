// client/pages/ClientList.jsx

import React, { useState, useEffect } from 'react';
// 假设这些是你的共享组件
import Modal from '../../../shared/components/Modal'; 
import ModalCard from '../../../shared/components/ModalCard';
import EditClientForm from '../components/EditClientForm';
import ClientTable from '../components/ClientTable'; // 导入分离后的表格组件
import StatusMessage from '../../../shared/components/message/StatusMessage'; // 假设导入路径
import Pagination from '../../../shared/components/pagination/Pagination'; // 假设导入路径

// 导入 Custom Hook
import useClientData from '../hooks/useClientData'; 
// 假设这些是正确的样式导入路径
import { styles } from '../../../shared/css/components/styles.js';
import * as typegraphyStyles from '../../../shared/css/typography.module.css';



// 完整的客户端列表页面 (作为 export default)
const ClientList = () => {
    // 1. 调用 Custom Hook 获取所有逻辑和状态
    const {
        clients, currentPage, totalPages, loading, error, deleteStatus, 
        isModalOpen, editingClient, updateLoading, updateError,
        setCurrentPage, handleDeleteClient, handleEditClient, handleUpdateClient,
        setEditingClient, handleCloseModal
    } = useClientData(1, 5);
    
    // 2. 渲染 UI
    return (
        <div className={styles.formContainer}>
            <h2 className={typegraphyStyles.heading}>客户端列表</h2>
            <p className={typegraphyStyles.subheading}>在此查看所有已注册的 OAuth2 客户端。</p>

            {/* 删除操作的状态反馈 */}
            {deleteStatus.loading && <StatusMessage type="loading" message="删除中..." styles={styles} />}
            {deleteStatus.error && <StatusMessage type="error" message={deleteStatus.error} styles={styles} />}

            {/* 主要内容区域的条件渲染 */}
            {loading ? (
                <StatusMessage type="loading" message="加载中..." styles={styles} />
            ) : error ? (
                <StatusMessage type="error" message={error} styles={styles} />
            ) : clients.length === 0 ? (
                <StatusMessage type="empty" message="没有找到任何客户端。" styles={styles} />
            ) : (
                <>
                    {/* 客户端表格 */}
                    <ClientTable 
                        clients={clients} 
                        onDeleteClient={handleDeleteClient} 
                        onEditClient={handleEditClient}
                        styles={styles} // 传递样式 prop
                    />
                    
                    {/* 分页组件 */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        styles={styles} // 传递样式 prop
                    />
                </>
            )}
            
            {/* --- 编辑模态框 --- */}
            {isModalOpen && editingClient && (
                <Modal>
                    <ModalCard
                        onClose={handleCloseModal}
                        title={`修改客户端: ${editingClient.name}`}
                        actions={(
                            <>
                                {/* 更新错误/加载状态 */}
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
                        {/* 编辑表单：使用 setEditingClient 更新本地 state */}
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