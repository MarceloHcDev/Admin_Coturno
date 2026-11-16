import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { api } from "../services/api";

export default function ProtectedRoute(): React.JSX.Element {
  const token = localStorage.getItem("admin_token");
  const [isValidating, setIsValidating] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(Boolean(token));
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      setIsValidating(false);
      setIsAuthenticated(false);
      return;
    }

    // Valida o token contra a API para garantir que a sessão continua ativa
    api
      .get("/auth/me")
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("admin_token");
          setIsAuthenticated(false);
        }
      })
      .finally(() => {
        setIsValidating(false);
      });
  }, [token, location.pathname]);

  if (!token || !isAuthenticated) {
    if (isValidating) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
          <div className="w-8 h-8 border-3 border-slate-300 border-t-black rounded-full animate-spin mb-3" />
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Validando sessão...
          </p>
        </div>
      );
    }
    return <Navigate to="/login?session_expired=1" replace />;
  }

  if (isValidating) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-8 h-8 border-3 border-slate-300 border-t-black rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          Carregando painel...
        </p>
      </div>
    );
  }

  return <Outlet />;
}
