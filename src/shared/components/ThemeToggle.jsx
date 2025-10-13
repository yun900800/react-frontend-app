import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const THEME_KEY = 'theme-preference';

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'; // SSR fallback
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function ThemeToggle(props) {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getInitialTheme());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(THEME_KEY, theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  if (!mounted) return null; // 🚨 SSR 时不渲染，客户端首次挂载后再显示

  return (
    <a onClick={toggleTheme} className="button-primary" style={props.style}>
      {theme === 'light' ? (
        <Sun style={{ width: 'var(--font-size-1)', height: 'auto' }} />
      ) : (
        <Moon style={{ width: 'var(--font-size-1)', height: 'auto' }} />
      )}
    </a>
  );
}
