// src/shared/components/ErrorBoundary.jsx
import React from 'react';

/**
 * 错误边界组件：捕获子树中的渲染异常，提供降级 UI，避免整个应用白屏崩溃。
 * 正常渲染时行为与无包裹完全一致，仅在捕获异常时显示 fallback。
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] 捕获到渲染异常:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            padding: '40px',
            textAlign: 'center',
            gap: '16px',
          }}
        >
          <h2 style={{ margin: 0 }}>页面出现异常</h2>
          <p style={{ margin: 0, color: '#888' }}>
            {this.state.error?.message || '发生未知错误，请尝试重新加载。'}
          </p>
          <button
            type="button"
            className="primary-button"
            onClick={this.handleReload}
          >
            重新加载
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;