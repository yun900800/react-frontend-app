import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Menu,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';
import s from './AppShell.module.css';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function useFocusTrap(open, containerRef, onClose) {
  useEffect(() => {
    if (!open) return undefined;

    const previous = document.activeElement;
    const container = containerRef.current;
    const getFocusable = () => Array.from(container?.querySelectorAll(FOCUSABLE_SELECTOR) || []);

    getFocusable()[0]?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.classList.add('no-scroll');

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('no-scroll');
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [open, containerRef, onClose]);
}

function Brand({ brand, onNavigate, compact = false }) {
  const Icon = brand.icon;

  return (
    <Link
      to={brand.to}
      className={`${s.brand} ${compact ? s.brandCompact : ''}`}
      onClick={onNavigate}
    >
      {Icon ? <Icon className={s.brandIcon} aria-hidden="true" /> : null}
      <span className={s.brandLabel}>{brand.label}</span>
    </Link>
  );
}

function NavItem({ item, onNavigate, compact = false }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      title={compact ? item.label : undefined}
      className={({ isActive }) => `${s.navItem} ${isActive ? s.navItemActive : ''}`}
    >
      {Icon ? <Icon className={s.navIcon} aria-hidden="true" /> : null}
      <span className={s.navLabel}>{item.label}</span>
    </NavLink>
  );
}

function NavGroups({ groups, onNavigate, compact = false }) {
  return groups.map((group) => (
    <div className={s.group} key={group.id}>
      {group.label ? <div className={s.groupLabel}>{group.label}</div> : null}
      {group.items.map((item) => (
        <NavItem key={item.id} item={item} onNavigate={onNavigate} compact={compact} />
      ))}
    </div>
  ));
}

function Breadcrumbs({ items }) {
  return (
    <ol className={s.breadcrumbs}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <li key={`${item.label}-${index}`}>
            {item.to && !isLast ? (
              <Link to={item.to}>{item.label}</Link>
            ) : (
              <span className={isLast ? s.current : undefined}>{item.label}</span>
            )}
            {!isLast ? <span className={s.separator}>/</span> : null}
          </li>
        );
      })}
    </ol>
  );
}

/**
 * AppShell is the single navigation shell for both product and lab.
 * It hides breakpoint logic, drawer state, focus handling and active states
 * behind a small interface: nav config + page metadata + children.
 */
export default function AppShell({
  brand,
  groups,
  footerItems = [],
  mobilePrimary = [],
  mobileSecondary = [],
  breadcrumbs = [],
  title = '',
  actions = null,
  fullBleed = false,
  contentClassName = '',
  children,
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const drawerRef = useRef(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('nav.collapsed') === '1';
    } catch {
      return false;
    }
  });

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);

  useFocusTrap(drawerOpen, drawerRef, closeDrawer);

  useEffect(() => {
    try {
      localStorage.setItem('nav.collapsed', collapsed ? '1' : '0');
    } catch {
      // Storage can be unavailable in private mode; the shell still works.
    }
  }, [collapsed]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const goBack = () => {
    const parent = breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2] : null;
    navigate(parent?.to || brand.to || '/');
  };

  const hasBottomNav = mobilePrimary.length > 0;
  const knownTargets = new Set([
    ...groups.flatMap((group) => group.items.map((item) => item.to)),
    ...footerItems.map((item) => item.to),
  ]);
  const extraMobileItems = mobileSecondary.filter((item) => !knownTargets.has(item.to));

  return (
    <div className={`${s.shell} ${collapsed ? s.collapsed : ''}`}>
      <a className={s.skipLink} href="#main-content">
        跳到主内容
      </a>

      <aside className={s.sidebar} aria-label="主导航">
        <Brand brand={brand} />

        <nav className={s.nav}>
          <NavGroups groups={groups} compact={collapsed} />
        </nav>

        <div className={s.sidebarFooter}>
          {footerItems.map((item) => (
            <NavItem key={item.id} item={item} compact={collapsed} />
          ))}
          <button
            type="button"
            className={s.collapseButton}
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? '展开侧边栏' : '收起侧边栏'}
          >
            {collapsed ? (
              <PanelLeftOpen className={s.navIcon} aria-hidden="true" />
            ) : (
              <PanelLeftClose className={s.navIcon} aria-hidden="true" />
            )}
            <span className={s.navLabel}>收起</span>
          </button>
        </div>
      </aside>

      <div className={s.main}>
        <header className={s.topbar}>
          <div className={s.desktopTopbar}>
            <Breadcrumbs items={breadcrumbs} />
            <div className={s.actions}>
              <ThemeToggle />
              {actions}
            </div>
          </div>

          <div className={s.mobileTopbar}>
            {breadcrumbs.length > 1 ? (
              <button type="button" className={s.iconButton} onClick={goBack} aria-label="返回">
                <ChevronLeft aria-hidden="true" />
              </button>
            ) : (
              <span className={s.iconSpacer} aria-hidden="true" />
            )}
            <span className={s.mobileTitle}>{title}</span>
            <button
              type="button"
              className={s.iconButton}
              onClick={openDrawer}
              aria-label="打开导航菜单"
              aria-expanded={drawerOpen}
            >
              <Menu aria-hidden="true" />
            </button>
          </div>
        </header>

        <main
          id="main-content"
          className={`${s.content} ${fullBleed ? s.fullBleed : ''} ${contentClassName}`}
        >
          {children}
        </main>
      </div>

      {hasBottomNav ? (
        <nav className={s.bottomNav} aria-label="底部导航">
          {mobilePrimary.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `${s.tabItem} ${isActive ? s.tabActive : ''}`
                }
              >
                {Icon ? <Icon aria-hidden="true" /> : null}
                <span>{item.label}</span>
              </NavLink>
            );
          })}
          <button
            type="button"
            className={s.tabItem}
            onClick={openDrawer}
            aria-label="更多功能"
            aria-expanded={drawerOpen}
          >
            <MoreHorizontal aria-hidden="true" />
            <span>更多</span>
          </button>
        </nav>
      ) : null}

      {drawerOpen ? (
        <div className={s.drawerLayer}>
          <div className={s.backdrop} onClick={closeDrawer} aria-hidden="true" />
          <div
            className={s.drawer}
            role="dialog"
            aria-modal="true"
            aria-label="导航菜单"
            ref={drawerRef}
          >
            <div className={s.drawerHeader}>
              <Brand brand={brand} onNavigate={closeDrawer} />
              <button
                type="button"
                className={s.iconButton}
                onClick={closeDrawer}
                aria-label="关闭导航菜单"
              >
                <X aria-hidden="true" />
              </button>
            </div>

            <nav className={s.drawerNav}>
              <NavGroups groups={groups} onNavigate={closeDrawer} />

              {extraMobileItems.length > 0 ? (
                <div className={s.group}>
                  <div className={s.groupLabel}>更多</div>
                  {extraMobileItems.map((item) => (
                    <NavItem key={item.id} item={item} onNavigate={closeDrawer} />
                  ))}
                </div>
              ) : null}
            </nav>

            <div className={s.drawerFooter}>
              <ThemeToggle />
              {actions}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
