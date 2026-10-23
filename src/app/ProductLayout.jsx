import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { House, LogOut } from 'lucide-react';
import AppShell from '../shared/ui/navigation/AppShell';
import {
  getProductBreadcrumbs,
  getProductTitle,
  productFooterItems,
  productGroups,
  productMobilePrimary,
  productMobileSecondary,
} from './navigation';
import { clearCurrentUser } from '../shared/lib/currentUser.js';

export default function ProductLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    clearCurrentUser();
    navigate('/login', { replace: true });
  };

  const actions = (
    <button type="button" onClick={handleLogout} aria-label="退出登录">
      <LogOut aria-hidden="true" />
      <span>退出</span>
    </button>
  );

  return (
    <AppShell
      brand={{ label: '投标工作台', to: '/', icon: House }}
      groups={productGroups}
      footerItems={productFooterItems}
      mobilePrimary={productMobilePrimary}
      mobileSecondary={productMobileSecondary}
      breadcrumbs={getProductBreadcrumbs(pathname)}
      title={getProductTitle(pathname)}
      actions={actions}
    >
      <Outlet />
    </AppShell>
  );
}
