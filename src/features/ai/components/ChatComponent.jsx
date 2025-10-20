import React, { useState, useCallback,useEffect } from 'react';
import styles from './ChatComponent.module.css';
import { aiApi } from '../api';

const ChatComponent = () => {
    const [ReactMarkdown, setReactMarkdown] = useState(null);
    // 用户的输入消息
    const [message, setMessage] = useState('');
    // AI的回复
    const [aiResponse, setAiResponse] = useState(null);
    // 加载状态，用于禁用按钮和显示加载提示
    const [isLoading, setIsLoading] = useState(false);
    // 错误信息
    const [error, setError] = useState(null);

    /**
     * 处理 AI 聊天请求的函数
     */
    const handleSendMessage = useCallback(async (e) => {
        // 阻止表单默认提交行为
        e.preventDefault(); 

        if (!message.trim()) {
            setError('Please enter a message.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setAiResponse(null); // 清除旧的回复

        try {
            const response = await aiApi.chat(message);
            const {content} = response.data;
            // 成功获取到 AI 回复
            setAiResponse(content);
            // 成功后清空输入框
            setMessage('');

        } catch (err) {
            console.error('Fetch Error:', err);
            // 显示用户友好的错误信息
            setError(`Failed to get response: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [message]); // 依赖 message 状态

    useEffect(() => {
        import("react-markdown").then((mod) => {
            setReactMarkdown(() => mod.default);  
        });
    }, [message]); 

    return (
        <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>AI 聊天接口测试</h2>
            
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="问一个问题..."
                    disabled={isLoading}
                    style={{ flexGrow: 1, padding: '10px', maxWidth: '77%', borderRadius: '4px', border: '1px solid #ddd' }}
                />
                <button 
                    type="submit" 
                    disabled={isLoading || !message.trim()}
                    style={{ padding: '10px 15px', borderRadius: '4px', fontSize: '14px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}
                >
                    {isLoading ? '发送中...' : '发送'}
                </button>
            </form>

            {/* 状态显示区域 */}
            {isLoading && (
                <p style={{ color: '#007bff' }}>等待 AI 回复...</p>
            )}

            {error && (
                <div style={{ color: 'red', padding: '10px', border: '1px solid red', borderRadius: '4px', backgroundColor: '#ffe6e6' }}>
                    **错误：** {error}
                </div>
            )}

            {aiResponse && (
                <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #4CAF50', 
                borderRadius: '4px', backgroundColor: '#e8f5e9'}}>
                    **AI 回复:**
                    {ReactMarkdown ? (
                    <ReactMarkdown>{aiResponse}</ReactMarkdown>
                  ) : (
                    // 如果 ReactMarkdown 未加载，显示纯文本
                    <p style={{ whiteSpace: 'pre-wrap', margin: '5px 0 0 0' }}>{aiResponse}</p>
                  )}
                </div>
            )}
        </div>
    );
};

export default ChatComponent;