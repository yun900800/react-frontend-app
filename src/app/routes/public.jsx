import React from 'react';
import { Route } from 'react-router-dom';
import PortalLayout from '../../features/portal/layout/PortalLayout';
import PortalHomePage from '../../features/portal/pages/PortalHomePage';
import BookDetailPage from '../../features/portal/pages/BookDetailPage';
import TaxonomyIndexPage from '../../features/portal/pages/TaxonomyIndexPage';
import TaxonomyPage from '../../features/portal/pages/TaxonomyPage';
import AboutPage from '../../features/portal/pages/AboutPage';

/**
 * 公开门户路由：不需要登录即可访问
 * - /                      门户首页（书籍列表）
 * - /books/:id             书籍详情（经典评论）
 * - /categories[/:name]    分类索引 / 分类详情
 * - /tags[/:name]          标签索引 / 标签详情
 * - /series[/:name]        系列索引 / 系列详情
 * - /about                 关于
 */
export const publicRoutes = (
  <Route element={<PortalLayout />}>
    <Route index element={<PortalHomePage />} />
    <Route path="books/:bookId" element={<BookDetailPage />} />
    <Route path="categories" element={<TaxonomyIndexPage kind="categories" />} />
    <Route
      path="categories/:category"
      element={<TaxonomyPage kind="categories" />}
    />
    <Route path="tags" element={<TaxonomyIndexPage kind="tags" />} />
    <Route path="tags/:tag" element={<TaxonomyPage kind="tags" />} />
    <Route path="series" element={<TaxonomyIndexPage kind="series" />} />
    <Route
      path="series/:seriesName"
      element={<TaxonomyPage kind="series" />}
    />
    <Route path="about" element={<AboutPage />} />
  </Route>
);
