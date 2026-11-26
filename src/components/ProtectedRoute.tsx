
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { api } from "../services/api";

export default function ProtectedRoute(): React.JSX.Element {
  const token = localStorage.getItem("admin_token");
  const expiresAt = localStorage.getItem("admin_token_expires_at");

  const isTimeExpired = Boolean(
    expiresAt && new Date(expiresAt).getTime() <= Date.now()
  );

  const [isValidating, setIsValidating] = useState(
    Boolean(token) && !isTimeExpired
  );

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [validationError, setValidationError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function validateSession() {
      if (!token || isTimeExpired) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_token_expires_at");

        setIsAuthenticated(false);
        setIsValidating(false);
        return;
      }

      try {
        await api.get("/auth/me");

        if (isMounted) {
          setIsAuthenticated(true);
          setValidationError(false);
        }
      } catch (error: unknown) {
        if (!isMounted) return;

        if (
          axios.isAxiosError(error) &&
          error.response?.status === 401
        ) {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_token_expires_at");

          setIsAuthenticated(false);
          return;
        }

        // Erros 403, 500 e falhas de conexão não removem o token.
        console.error("Erro ao validar sessão:", error);

        setValidationError(true);
      } finally {
        if (isMounted) {
          setIsValidating(false);
        }
      }
    }

    validateSession();

    return () => {
      isMounted = false;
    };
  }, [token, isTimeExpired]);

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

  if (!token || isTimeExpired || (!isAuthenticated && !validationError)) {
    return <Navigate to="/login?session_expired=1" replace />;
  }

  if (validationError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-sm text-slate-600 mb-4">
          Não foi possível validar sua sessão. Verifique sua conexão ou tente novamente.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-black text-white rounded-md"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return <Outlet />;
}
