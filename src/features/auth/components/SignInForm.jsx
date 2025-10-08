// src/SignInForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as styles from '../pages/LoginPage.module.css';
import { authApi } from '../api';
import { translations } from '../model/i18n/translations';

const { login } = authApi;

const SignInForm = ({ toggleForm }) => {
    // 假设我们有一个变量来存储当前语言，例如 'zh' 或 'en'
    const currentLanguage = 'en'; 
    const t = translations[currentLanguage].signIn;

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await login(username, password);

            if (response.error) {
                setError(response.error.data?.message || response.error.message || t.loginFailed);
            } else {
                const token = response.data.token;
                if (token) {
                    // 在客户端执行动态导入和cookie设置
                    if (typeof window !== 'undefined') {
                        // const Cookies = require('js-cookie');
                        // Cookies.set('auth_token', token, { expires: 7, path: '/' });
                    }
                    localStorage.setItem('token', token);
                    console.log('登录成功，跳转到首页');
                    // 这里的跳转是客户端的路由跳转
                    navigate('/');
                } else {
                    setError(t.tokenError);
                }
            }
        } catch (err) {
            setError(err.message || t.networkError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`${styles.user} ${styles.signinBx}`}>
            <div className={styles.imgBx}>
                <img src="https://res.cloudinary.com/dqmqakbd6/image/upload/v1755510388/user_uploads/azh2mwf4tcifcnihwpch.jpg" alt="登录图片" />
            </div>
            <div className={styles.formBx}>
                <form onSubmit={handleSubmit}>
                    <h2>{t.title}</h2>
                    <input
                        type="text"
                        placeholder={t.usernamePlaceholder}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder={t.passwordPlaceholder}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
                    <input type="submit" value={loading ? "登录中..." : t.loginButton} disabled={loading} />
                    <p className={styles.signup}>
                        {t.noAccount}<a href="#" onClick={toggleForm}>{t.signUpLink}</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignInForm;