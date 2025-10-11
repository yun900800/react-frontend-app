// client/components/EditClientForm.jsx

import React from 'react';
// 假设这是你的共享样式路径
import * as styles from '../../../shared/css/components/_form.module.css';

const EditClientForm = ({ clientName, setClientName, redirectUris, setRedirectUris, grants, setGrants }) => {
    return (
        <form className={styles.form}>
            <div className={styles.formGroup}>
                <label className={styles.label}>客户端名称:</label>
                <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                    className={styles.input}
                />
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label}>重定向 URI (逗号分隔):</label>
                <input
                    type="text"
                    value={redirectUris}
                    onChange={(e) => setRedirectUris(e.target.value)}
                    required
                    className={styles.input}
                />
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label}>授权类型 (逗号分隔):</label>
                <input
                    type="text"
                    value={grants}
                    onChange={(e) => setGrants(e.target.value)}
                    required
                    className={styles.input}
                />
            </div>
        </form>
    );
};

export default EditClientForm;