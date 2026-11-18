import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { api } from "../services/api";

export default function ProtectedRoute(): React.JSX.Element {
  const token = localStorage.getItem("admin_token");
  const expiresAt = localStorage.getItem("admin_token_expires_at");

  // 1. Verificação instantânea (0ms): checa se a data de expiração do token já venceu
  const isTimeExpired = Boolean(
    expiresAt && new Date(expiresAt).getTime() <= Date.now(),
  );

  const [isValidating, setIsValidating] = useState<boolean>(
    Boolean(token) && !isTimeExpired,
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    Boolean(token) && !isTimeExpired,
  );
  const location = useLocation();

  useEffect(() => {
    if (!token || isTimeExpired) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_token_expires_at");
      setIsValidating(false);
      setIsAuthenticated(false);
      return;
    }

    // 2. Validação ativa no backend (/auth/me) para garantir que o token não foi revogado
    api
      .get("/auth/me")
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_token_expires_at");
          setIsAuthenticated(false);
        }
      })
      .finally(() => {
        setIsValidating(false);
      });
  }, [token, isTimeExpired, location.pathname]);

  if (!token || isTimeExpired || !isAuthenticated) {
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
