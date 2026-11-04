// src/SignUpForm.jsx
// 注册表单：强制邮箱验证码（purpose='register'），注册成功直接登录态
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as styles from '../pages/LoginPage.module.css';
import { authApi } from '../api';
import { translations } from '../model/i18n/translations';
import { useToast } from '../../../shared/components/Toast';
import { saveCurrentUser } from '../../../shared/lib/currentUser.js';

// 从你提供的文件中导入验证器
import {
    validateAccountNotEmpty,
    validatePasswordFormat,
    validateEmailFormat
} from '../../../shared/chain/validator.js';
import {
    runAsyncValidationChain
} from '../../../shared/chain/chain.js';

// 注册模式下的验证器数组
const userRegistrationValidators = [
    validateAccountNotEmpty,
    validatePasswordFormat,
    validateEmailFormat,
];

const { register, requestEmailCode } = authApi;
// ❗ 与后端 Honeypot 中间件保持一致的字段名
const HONEYPOT_FIELD_NAME = 'username_check';
// ❗ 另一个可选的蜜罐字段名
const HONEYPOT_FIELD_NAME_2 = 'confirm_email_address';

const CODE_RESEND_SECONDS = 60;

const SignUpForm = ({ toggleForm }) => {
    const currentLanguage = 'zh';
    const t = translations[currentLanguage].signUp;
    const c = translations[currentLanguage].emailCode;

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
            setCountdown((cd) => {
                if (cd <= 1 && timerRef.current) {
                    clearInterval(timerRef.current);
                    return 0;
                }
                return cd - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [countdown > 0]);

    // 发送注册验证码（register 用途）
    const handleSendCode = async () => {
        if (!email.trim()) {
            setError(c.emailRequired);
            return;
        }
        setError(null);
        setSending(true);
        try {
            const response = await requestEmailCode(email.trim(), 'register');
            if (response.error) {
                const errMsg = response.error.data?.message || response.error.message || '验证码发送失败';
                setError(errMsg);
                addToast(errMsg, 'error');
            } else {
                addToast('验证码已发送，请查收邮箱', 'success');
                setCountdown(CODE_RESEND_SECONDS);
                setCode('');
            }
        } catch (err) {
            setError(err.message || '验证码发送失败');
        } finally {
            setSending(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // 检查两次密码是否一致
            if (password !== confirmPassword) {
                setError('两次输入的密码不一致，请重新输入。');
                setLoading(false); // 停止加载状态
                return; // 阻止表单提交
            }

            // 验证码必填（后端强制，前端提前拦截）
            if (!/^\d{6}$/.test(code.trim())) {
                setError('请输入 6 位数字邮箱验证码。');
                setLoading(false);
                return;
            }

            // 执行验证链
            const userData = { account: username, password, email };
            await runAsyncValidationChain(userData, userRegistrationValidators);

            // 验证通过后，调用注册 API（带验证码）
            const response = await register(username, password, email, code.trim());
            if (response.error) {
                let errMsg = response.error.data?.message || response.error.message || '注册失败';
                errMsg += response.error.data?.details ? `: ${response.error.data.details}` : '';
                setError(errMsg);
                addToast(errMsg, 'error');
            } else {
                // 注册成功 → 后端直接返回 token，前端自动登录进工作台
                const token = response.data?.token;
                if (token) {
                    localStorage.setItem('token', token);
                    saveCurrentUser(response.data.user);
                    addToast('注册成功，欢迎加入！', 'success');
                    navigate('/workbench');
                } else {
                    addToast('注册成功！请登录。', 'success');
                    setUsername('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                    setCode('');
                    toggleForm();
                }
            }
        } catch (err) {
            // 捕获验证链或 API 抛出的错误
            setError(err.message || String(err) || '发生未知错误');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`${styles.user} ${styles.signupBx}`}>
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
                        type="text"
                        placeholder={t.emailPlaceholder}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {/* 邮箱验证码 + 发送按钮 同行 */}
                    <div className={styles.codeRow}>
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder={c.codePlaceholder}
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
                            {sending ? c.sending : countdown > 0 ? `${c.resend} ${countdown}s` : c.sendCode}
                        </button>
                    </div>
                    <input
                        type="password"
                        placeholder={t.createPasswordPlaceholder}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder={t.confirmPasswordPlaceholder}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    {/* 🤖 蜜罐字段实现 🤖 */}
                    {/* 使用 CSS 隐藏整个 div，阻止显示和屏幕阅读器读取 (aria-hidden) */}
                    <div style={{ display: 'none' }} aria-hidden="true">
                        {/* 蜜罐字段 1 - 对应后端中间件的 HONEYPOT_FIELD_NAME */}
                        <input
                            type="text"
                            name={HONEYPOT_FIELD_NAME}
                            tabIndex="-1"
                            autoComplete="off"
                        />
                        {/* 蜜罐字段 2 - 可选，增加复杂性 */}
                         <input
                            type="email"
                            name={HONEYPOT_FIELD_NAME_2}
                            tabIndex="-1"
                            autoComplete="off"
                        />
                    </div>
                    {/* 🤖 蜜罐字段实现结束 🤖 */}
                    {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
                    <input type="submit" value={loading ? '注册中...' : t.signUpButton} disabled={loading} />
                    <p className={styles.signup}>
                        {t.haveAccount}
                        <a href="#" onClick={(e) => { e.preventDefault(); toggleForm(); }}>{t.signInLink}</a>
                    </p>
                </form>
            </div>
            <div className={styles.imgBx}>
                <img src="https://res.cloudinary.com/dqmqakbd6/image/upload/v1755510699/user_uploads/ahglny17nyhrxr25qhks.jpg" alt="注册图片" />
            </div>
        </div>
    );
};

export default SignUpForm;
