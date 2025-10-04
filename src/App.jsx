// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TestComponent from './components/TestComponent';

function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
        <nav style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
          <Link to="/" style={{ marginRight: '15px', textDecoration: 'none' }}>🏠 首页</Link>
          <Link to="/test" style={{ textDecoration: 'none' }}>📊 API 接口测试</Link>
        </nav>
        
        <main style={{ marginTop: '20px' }}>
          <Routes>
            <Route path="/" element={<h2>欢迎使用前端测试应用</h2>} />
            <Route path="/test" element={<TestComponent />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;