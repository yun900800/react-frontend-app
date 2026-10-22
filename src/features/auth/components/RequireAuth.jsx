import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Route-level auth guard for a single element.
 * `ProtectedRoute` is outlet-based; this one wraps children directly.
 */
export default function RequireAuth({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}
