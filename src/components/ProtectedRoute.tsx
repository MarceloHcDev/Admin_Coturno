
import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { api } from "../services/api";

export default function ProtectedRoute(): React.JSX.Element {
  const token = localStorage.getItem("admin_token");
  const expiresAt = localStorage.getItem("admin_token_expires_at");

  const location = useLocation();

  const isTimeExpired = Boolean(
    expiresAt && new Date(expiresAt).getTime() <= Date.now()
  );

  const [isValidating, setIsValidating] = useState(
    Boolean(token) && !isTimeExpired
  );

  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

      setIsValidating(true);

      try {
        await api("/auth/me");

        if (isMounted) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        if (isMounted) {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_token_expires_at");
          setIsAuthenticated(false);
        }
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
  }, [token, isTimeExpired, location.pathname]);

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

  if (!token || isTimeExpired || !isAuthenticated) {
    return <Navigate to="/login?session_expired=1" replace />;
  }

  return <Outlet />;
}
