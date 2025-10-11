// client/pages/CreateClient.jsx

import React, { useState } from 'react';
import { createClientApi } from '../api'; 
// 假设这些是正确的样式导入路径
import { styles } from '../../../shared/css/components/styles.js';
import * as typegraphyStyles from '../../../shared/css/typography.module.css';
import * as utilStyles from '../../../shared/css/_utils.module.css';

// 通用状态消息组件
const StatusMessage = ({ type, message }) => {
    const messageStyles = {
        loading: styles.loadingMessage,
        error: styles.errorMessage,
        empty: styles.emptyMessage,
    };
    return <div className={messageStyles[type]}>{message}</div>;
};

// 注册客户端的表单组件
const CreateClientForm = ({ onSubmit, loading }) => {
    const [clientName, setClientName] = useState('');
    const [redirectUris, setRedirectUris] = useState('');
    const [grants, setGrants] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // 将逗号分隔的字符串转换为正确的格式
        const urisArray = redirectUris.split(',').map(uri => uri.trim()).filter(uri => uri);
        const grantsArray = grants.split(',').map(grant => grant.trim()).filter(grant => grant);
        const clientData = {
            name: clientName,
            redirectUris: urisArray.join(), // 后端希望是逗号分隔的字符串
            grants: grantsArray.join(),     // 后端希望是逗号分隔的字符串
        };
        onSubmit(clientData);
    };

    return (
        <div className={styles.formContainer}>
            <h1 className={typegraphyStyles.heading}>注册新的 OAuth2 客户端</h1>
            <p className={typegraphyStyles.subheading}>请填写客户端信息，以获取 Client ID 和 Client Secret。</p>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="clientName" className={styles.label}>客户端名称:</label>
                    <input
                        id="clientName"
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="redirectUris" className={styles.label}>重定向 URI (逗号分隔):</label>
                    <input
                        id="redirectUris"
                        type="text"
                        value={redirectUris}
                        onChange={(e) => setRedirectUris(e.target.value)}
                        required
                        placeholder="例如: http://localhost:3006/callback"
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="grants" className={styles.label}>授权类型 (逗号分隔):</label>
                    <input
                        id="grants"
                        type="text"
                        value={grants}
                        onChange={(e) => setGrants(e.target.value)}
                        required
                        placeholder="例如: authorization_code, password"
                        className={styles.input}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`${styles.submitButton} primary-button ${loading ? styles.submitButtonLoading : ''}`}
                >
                    {loading ? '注册中...' : '注册客户端'}
                </button>
            </form>
        </div>
    );
};

// 客户端创建成功或失败的结果展示组件
const ClientResult = ({ response, error }) => {
    if (response) {
        return (
            <div className={styles.successMessage}>
                <h3 className={utilStyles.bold}>客户端创建成功！</h3>
                <p><strong>Client ID:</strong> {response.clientId}</p>
                <p><strong>Client Secret:</strong> {response.clientSecret}</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className={styles.errorMessage}>
                <h3 className={utilStyles.bold}>注册失败</h3>
                {/* 确保能正确显示错误信息，无论是字符串还是对象 */}
                <p>{typeof error === 'object' ? JSON.stringify(error) : error}</p>
            </div>
        );
    }
    return null;
};

// 完整的注册客户端页面 (作为 export default)
const CreateClient = () => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleClientSubmit = async (clientData) => {
        setResponse(null);
        setError(null);
        setLoading(true);

        try {
            const result = await createClientApi(clientData);
            setResponse(result);
        } catch (err) {
            console.error('API Error:', err);
            // 捕获 API 层抛出的错误，获取 response.data 中的详情
            setError(err.response ? err.response.data : { error: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <CreateClientForm onSubmit={handleClientSubmit} loading={loading} />
            <ClientResult response={response} error={error} />
        </>
    );
};

export default CreateClient;