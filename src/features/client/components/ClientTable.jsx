// client/components/ClientTable.jsx (消除 DOM 嵌套警告的清晰版本)

import React from 'react';

// 注意：这里假设 styles 通过 props 传入，或直接导入
// 为了简洁，我们假设 styles 是可用的
const ClientTable = ({ clients, onDeleteClient, onEditClient, styles }) => (
    <div className={styles.tableContainer}>
        <table className={styles.table}>
            <thead>
                <tr className={styles.tableHeader}>
                    <th className={styles.tableHeaderCell}>Client ID</th>
                    <th className={styles.tableHeaderCell}>名称</th>
                    <th className={styles.tableHeaderCell}>重定向 URI</th>
                    <th className={styles.tableHeaderCell}>所有者 ID</th>
                    <th className={styles.tableHeaderCell}>操作</th>
                </tr>
            </thead>
            <tbody className={styles.tableBody}>
                {clients.map((client) => (
                    // 确保 <tr> 内部只有 <td> 元素，没有多余的换行和空格
                    <tr key={client.id} className={styles.tableRow}>
                        <td className={styles.tableCell}>{client.id}</td>
                        <td className={styles.tableCell}>{client.name}</td>
                        <td className={styles.tableCell}>
                            {/* 确保这里的 map 返回的是 <div>，而不是在 <td> 和 map 之间有换行 */}
                            {client.redirectUris?.split(',').map((uri, index) => (
                                <div key={index}>{uri}</div>
                            ))}
                        </td>
                        <td className={styles.tableCell}>{client.ownerId || 'N/A'}</td>
                        <td className={styles.tableCell}>
                            <button
                                className={`${styles.actionButton} ${styles.editButton} primary-button`}
                                onClick={() => onEditClient(client)}
                            >修改</button>
                            <button
                                className={`${styles.deleteButton} primary-button`}
                                onClick={() => onDeleteClient(client.id)}
                            >删除</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default ClientTable; // 如果这是单独文件