// src/SignUpForm.js
import React, { useState } from 'react';
import * as styles from '../pages/LoginPage.module.css';
import { authApi } from '../api';
import { translations } from '../model/i18n/translations';  
import { useToast } from '../../../shared/components/Toast'; 

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

const { register } = authApi;
// ❗ 与后端 Honeypot 中间件保持一致的字段名
const HONEYPOT_FIELD_NAME = 'username_check'; 
// ❗ 另一个可选的蜜罐字段名
const HONEYPOT_FIELD_NAME_2 = 'confirm_email_address';

const SignUpForm = ({ toggleForm }) => {
    // 假设我们有一个变量来存储当前语言，例如 'zh' 或 'en'
    const currentLanguage = 'en'; 
    const t = translations[currentLanguage].signUp;

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const addToast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // 检查两次密码是否一致
            if (password !== confirmPassword) {
                setError("两次输入的密码不一致，请重新输入。");
                setLoading(false); // 停止加载状态
                return; // 阻止表单提交
            }

            // 执行验证链
            const userData = { account: username, password, email };
            await runAsyncValidationChain(userData, userRegistrationValidators);

            // 验证通过后，调用注册 API
            const response = await register(username, password, email);
            console.log('注册接口响应：', response);
            if (response.error) {
                let errMsg = response.error.data?.message || response.error.message || "注册失败";
                errMsg += response.error.data?.details ? `: ${response.error.data.details}` : '';
                setError(errMsg);
                addToast(errMsg, 'error');
            } else {
                addToast('注册成功！','success');
                console.log('注册成功！');
                // 注册成功后，清空表单并切换到登录模式
                setUsername('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                toggleForm();
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
                    <input type="submit" value={loading ? "注册中..." : t.signUpButton} disabled={loading} />
                    <p className={styles.signup}>
                        {t.haveAccount}<a href="#" onClick={toggleForm}>{t.signInLink}</a>
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