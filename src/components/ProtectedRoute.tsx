import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute(): React.JSX.Element {
  const token = localStorage.getItem('admin_token');

  // Se não houver token, manda para o /login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Se tiver token, renderiza a rota filha normalmente
  return <Outlet />;
}
