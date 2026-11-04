// src/SignInForm.jsx
// 登录表单：密码登录 / 邮箱验证码登录 双 Tab
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as styles from '../pages/LoginPage.module.css';
import { authApi } from '../api';
import { translations } from '../model/i18n/translations';
import { saveCurrentUser } from '../../../shared/lib/currentUser.js';
import { useToast } from '../../../shared/components/Toast';

const { login, loginByCode, requestEmailCode } = authApi;

const CODE_RESEND_SECONDS = 60;

const SignInForm = ({ toggleForm }) => {
    const currentLanguage = 'zh';
    const t = translations[currentLanguage].signIn;

    const [tab, setTab] = useState('password'); // 'password' | 'code'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const addToast = useToast();
    const navigate = useNavigate();
    const timerRef = useRef(null);

    // 验证码发送倒计时
    useEffect(() => {
        if (countdown <= 0) return undefined;
        timerRef.current = setInterval(() => {
            setCountdown((c) => {
                if (c <= 1 && timerRef.current) {
                    clearInterval(timerRef.current);
                    return 0;
                }
                return c - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [countdown > 0]);

    // 登录成功统一处理：保存 token/用户 → 跳转工作台
    const applyLogin = (response) => {
        if (response.error) {
            setError(response.error.data?.message || response.error.message || '登录失败');
            return;
        }
        const token = response.data?.token;
        if (!token) {
            setError('未获取到登录凭证');
            return;
        }
        localStorage.setItem('token', token);
        saveCurrentUser(response.data.user);
        navigate('/workbench');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            applyLogin(await login(email, password));
        } catch (err) {
            setError(err.message || '网络异常，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    // 发送验证码（login 用途）
    const handleSendCode = async () => {
        if (!email.trim()) {
            setError(t.emailRequired);
            return;
        }
        setError(null);
        setSending(true);
        try {
            const response = await requestEmailCode(email.trim(), 'login');
            if (response.error) {
                setError(response.error.data?.message || response.error.message || '验证码发送失败');
            } else {
                addToast(t.codeHint, 'success');
                setCountdown(CODE_RESEND_SECONDS);
                setCode('');
            }
        } catch (err) {
            setError(err.message || '验证码发送失败');
        } finally {
            setSending(false);
        }
    };

    // 验证码登录提交
    const handleCodeSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            applyLogin(await loginByCode(email.trim(), code.trim()));
        } catch (err) {
            setError(err.message || '网络异常，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    const renderForm = () => (
        <form onSubmit={tab === 'password' ? handleSubmit : handleCodeSubmit}>
            <h2>{t.title}</h2>

            {/* 登录方式切换 Tab */}
            <div className={styles.authTabs}>
                <button
                    type="button"
                    className={`${styles.authTab} ${tab === 'password' ? styles.authTabActive : ''}`}
                    onClick={() => { setTab('password'); setError(null); }}
                >
                    {t.tabs.password}
                </button>
                <button
                    type="button"
                    className={`${styles.authTab} ${tab === 'code' ? styles.authTabActive : ''}`}
                    onClick={() => { setTab('code'); setError(null); }}
                >
                    {t.tabs.code}
                </button>
            </div>

            <input
                type="text"
                placeholder={t.usernamePlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            {tab === 'password' ? (
                <input
                    type="password"
                    placeholder={t.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            ) : (
                <>
                    {/* 验证码输入 + 发送按钮 同行 */}
                    <div className={styles.codeRow}>
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder={t.codePlaceholder}
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                            required
                        />
                        <button
                            type="button"
                            className={styles.sendCodeBtn}
                            onClick={handleSendCode}
                            disabled={sending || countdown > 0}
                        >
                            {sending ? t.sending : countdown > 0 ? `${t.resend} ${countdown}s` : t.sendCode}
                        </button>
                    </div>
                    <p className={styles.formHint}>{t.codeHint}</p>
                </>
            )}

            {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
            <input
                type="submit"
                value={loading ? '登录中...' : t.loginButton}
                disabled={loading}
            />
            <p className={styles.signup}>
                {t.noAccount}
                <a href="#" onClick={(e) => { e.preventDefault(); toggleForm(); }}>{t.signUpLink}</a>
            </p>
        </form>
    );

    return (
        <div className={`${styles.user} ${styles.signinBx}`}>
            <div className={styles.imgBx}>
                <img src="https://res.cloudinary.com/dqmqakbd6/image/upload/v1755510388/user_uploads/azh2mwf4tcifcnihwpch.jpg" alt="登录图片" />
            </div>
            <div className={styles.formBx}>{renderForm()}</div>
        </div>
    );
};

export default SignInForm;
