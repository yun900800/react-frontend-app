import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Link,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import LoginPage from './features/auth/pages/LoginPage';
import ErrorBoundary from './shared/components/ErrorBoundary.jsx';
import { productRoutes } from './app/routes/product.jsx';
import { labRoutes } from './app/routes/lab.jsx';
import { publicRoutes } from './app/routes/public.jsx';

const PageFallback = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      color: 'var(--lux-text-muted)',
    }}
  >
    <p>加载中...</p>
  </div>
);

function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '12px',
      }}
    >
      <h2 style={{ margin: 0 }}>404 页面未找到</h2>
      <Link to="/workbench">返回工作台</Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            {publicRoutes}
            {productRoutes}
            {labRoutes}

            {/* Legacy lab URLs: keep old bookmarks working. */}
            <Route
              path="/responsive-layout"
              element={<Navigate to="/lab/layouts/responsive" replace />}
            />
            <Route
              path="/fixed-app"
              element={<Navigate to="/lab/layouts/fixed" replace />}
            />
            <Route path="/shelf" element={<Navigate to="/lab/layouts/shelf" replace />} />
            <Route
              path="/page-book"
              element={<Navigate to="/lab/layouts/page-book" replace />}
            />
            <Route
              path="/flipbook"
              element={<Navigate to="/lab/layouts/flipbook" replace />}
            />
            <Route
              path="/full-bleed"
              element={<Navigate to="/lab/layouts/full-bleed" replace />}
            />
            <Route path="/animation" element={<Navigate to="/lab/motion" replace />} />
            <Route
              path="/smart-menu"
              element={<Navigate to="/lab/motion/smart-menu" replace />}
            />
            <Route
              path="/test"
              element={<Navigate to="/lab/tools/api-debug" replace />}
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
