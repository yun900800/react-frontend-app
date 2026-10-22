import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import s from './ThemeToggle.module.css';

const THEME_KEY = 'theme-preference';
const THEME_EVENT = 'themechange';

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function ThemeToggle({ style, className }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Keep multiple toggles in sync (top bar + mobile drawer).
  useEffect(() => {
    const sync = (event) => {
      const next = event.detail;
      setTheme(next === 'dark' || next === 'light' ? next : getInitialTheme());
    };

    window.addEventListener(THEME_EVENT, sync);
    return () => window.removeEventListener(THEME_EVENT, sync);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: next }));
  };

  const label = theme === 'light' ? '切换到深色主题' : '切换到浅色主题';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`${s.toggle} ${className || ''}`}
      style={style}
      aria-label={label}
      title={label}
    >
      {theme === 'light' ? (
        <Sun aria-hidden="true" />
      ) : (
        <Moon aria-hidden="true" />
      )}
    </button>
  );
}
