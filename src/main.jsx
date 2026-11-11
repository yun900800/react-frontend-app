import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // 简单的全局 CSS
import { ToastProvider } from './shared/components/Toast.jsx';

// Build marker: changing this string invalidates the hashed entry bundle.
document.documentElement.dataset.build = 'm0-2026-11-10';

const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes('React Router Future Flag Warning')) return;
  originalWarn(...args);
};

const rootElement = document.getElementById('root');
const app = (
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>
);

// Prerendered HTML is a crawler-friendly snapshot. React takes over with the
// same initial data and replaces it on the client; it is not hydrated because
// the snapshot is produced by a browser, not by renderToString.
ReactDOM.createRoot(rootElement).render(app);