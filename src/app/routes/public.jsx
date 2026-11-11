import React from 'react';
import { Route } from 'react-router-dom';
import PortalLayout from '../../features/portal/layout/PortalLayout';
import PortalHomePage from '../../features/portal/pages/PortalHomePage';
import BookDetailPage from '../../features/portal/pages/BookDetailPage';

/**
 * 公开门户路由：不需要登录即可访问
 * - /            门户首页（书籍列表）
 * - /books/:id   书籍详情（经典评论）
 */
export const publicRoutes = (
  <Route element={<PortalLayout />}>
    <Route index element={<PortalHomePage />} />
    <Route path="books/:bookId" element={<BookDetailPage />} />
  </Route>
);
