import React, { lazy } from 'react';
import { Navigate, Route } from 'react-router-dom';
import ProtectedRoute from '../../features/auth/components/ProtectedRoute';
import ProductLayout from '../ProductLayout';

const HomePage = lazy(() => import('../../features/home/pages/HomePage'));
const ClientPages = lazy(() => import('../../features/client/pages/ClientPages'));
const ClientList = lazy(() => import('../../features/client/pages/ClientList'));
const CreateClient = lazy(() => import('../../features/client/pages/CreateClient'));
const BooksPage = lazy(() => import('../../features/books/pages/BooksPage'));
const BookEditorPages = lazy(() => import('../../features/editor/pages/BookEditorPages'));
const AiPages = lazy(() => import('../../features/ai/pages/AiPages'));
const CalendarPage = lazy(() => import('../../features/home/pages/CalendarPage'));

export const productRoutes = (
  <Route element={<ProtectedRoute />}>
    <Route element={<ProductLayout />}>
      <Route index element={<HomePage />} />

      <Route path="clients" element={<ClientPages />}>
        <Route path="list" element={<ClientList />} />
        <Route path="create" element={<CreateClient />} />
        <Route index element={<Navigate to="list" replace />} />
      </Route>

      <Route path="books" element={<BooksPage />} />
      <Route path="editor" element={<BookEditorPages />} />
      <Route path="ai" element={<AiPages />} />
      <Route path="calendar" element={<CalendarPage />} />
    </Route>
  </Route>
);
