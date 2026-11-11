import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import ThemeToggle from '../../../shared/components/ThemeToggle';
import styles from './PortalLayout.module.css';

export default function PortalLayout() {
  // Keep the first render deterministic for prerendered HTML; the token check
  // runs after the first render so logged-in users still see the workbench link.
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(Boolean(localStorage.getItem('token')));
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.brand}>
            <span className={styles.brandIcon}>
              <BookOpen size={18} strokeWidth={2} />
            </span>
            书评集
          </Link>

          <nav className={styles.actions} aria-label="门户导航">
            <ThemeToggle />
            {hasToken ? (
              <Link to="/workbench" className={`${styles.link} ${styles.ghostLink}`}>
                工作台
              </Link>
            ) : (
              <Link to="/login" className={`${styles.link} ${styles.primaryLink}`}>
                登录
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        书评集 · 用书评记录每一次阅读
      </footer>
    </div>
  );
}
