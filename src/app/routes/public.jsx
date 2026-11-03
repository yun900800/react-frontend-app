import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import PortalLayout from '../../features/portal/layout/PortalLayout';

/**
 * 公开门户路由：不需要登录即可访问
 * - /            门户首页（书籍列表）
 * - /books/:id   书籍详情（经典评论）
 */
const PortalHomePage = lazy(() => import('../../features/portal/pages/PortalHomePage'));
const BookDetailPage = lazy(() => import('../../features/portal/pages/BookDetailPage'));

export const publicRoutes = (
  <Route element={<PortalLayout />}>
    <Route index element={<PortalHomePage />} />
    <Route path="books/:bookId" element={<BookDetailPage />} />
  </Route>
);
