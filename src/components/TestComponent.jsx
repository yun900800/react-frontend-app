// src/components/TestComponent.jsx
import React, { useState, useEffect } from 'react';
import { fetchTestData } from '../api';

const TestComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchTestData()
      .then(result => {
        setData(result);
        setError(null);
      })
      .catch(err => {
        console.error("Fetch failed:", err);
        setError(`请求失败: ${err.message}. 检查网络和后端服务是否运行。`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>正在连接后端服务...</div>;
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h3>后端接口测试结果</h3>
      {error ? (
        <p style={{ color: 'white', backgroundColor: '#dc3545', padding: '10px', borderRadius: '3px' }}>
          <strong>错误:</strong> {error}
        </p>
      ) : (
        <>
          <p style={{ color: '#28a745', fontWeight: 'bold' }}>✅ 请求成功！后端返回数据如下:</p>
          <pre style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '5px',
              overflowX: 'auto' 
          }}>
              {JSON.stringify(data, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
};

export default TestComponent;