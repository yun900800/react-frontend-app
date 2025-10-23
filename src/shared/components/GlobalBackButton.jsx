// GlobalBackButton.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRouteHistory } from './context/RouteHistoryProvider.jsx';
import { SquareChevronLeft } from 'lucide-react';

const GlobalBackButton = () => {
  const navigate = useNavigate();
  const historyStack = useRouteHistory(); // 获取历史栈

  // 历史栈中至少需要两个条目（上一个和当前）才能回退到应用内的前一个页面
  // [..., previousEntry, currentEntry]
  const canGoBack = historyStack.length > 1;
  
  // 获取上一个路径对象
  const previousEntry = canGoBack ? historyStack[historyStack.length - 2] : null;
  const previousPath = previousEntry ? previousEntry.path : null;

  const handleGoBack = () => {
    if (canGoBack) {
      // 使用 React Router 的导航回退功能，它会自动处理到正确的上一个 key
      navigate(-1);
    } else {
      // 无法回退时，导航到首页并替换历史记录
      navigate('/', { replace: true });
    }
  };

  // ... 样式保持不变

  const buttonStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1000,
    padding: '4px 8px',
    backgroundColor: canGoBack ? 'oklch(var(--color-primary))' : 'var(--color-border-input)',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: canGoBack ? 'pointer' : 'not-allowed',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  };

  return (
    <a 
    style={buttonStyle} 
      onClick={handleGoBack}>
        <SquareChevronLeft  style={{  display: 'flex',width: 'var(--font-size-1)', height: 'auto' }}/>
    </a>
  );
};

export default GlobalBackButton;