
import React, { useEffect, useState } from "react";

import { api } from "../services/api";

import Sidebar from "../components/organisms/Sidebar";
import { MetricsGrid } from "../components/organisms/MetricsGrid";
import { ChartsSection } from "../components/organisms/ChartsSection";
import { TopProductsSection } from "../components/organisms/TopProductsSection";

import type {
  DashboardData,
  DashboardResponse,
} from "../types/adminDashboard";

export default function Home_admin(): React.JSX.Element {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;

    async function carregarDashboard() {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get<DashboardResponse>(
          "/admin/dashboard",
        );

        if (response.data.status !== "success") {
          throw new Error("Resposta inválida do servidor.");
        }

        if (ativo) {
          setDashboard(response.data.data);
        }
      } catch (err: unknown) {
        console.error("Erro ao carregar dashboard:", err);

        if (ativo) {
          setError("Não foi possível carregar os dados do dashboard.");
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    carregarDashboard();

    return () => {
      ativo = false;
    };
  }, []);

  return (
    <div className="flex min-h-screen w-full pe-10 pt-10 bg-slate-50 text-slate-900 antialiased">
      <Sidebar />

      <main className="pl-72 pb-10 flex-1 overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-barlow font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>

          <p className="text-xs text-slate-500 font-medium mt-1">
            Indicadores e informações da loja
          </p>
        </header>

        {loading && (
          <div className="py-12 text-center text-sm text-slate-500">
            Carregando informações do dashboard...
          </div>
        )}

        {!loading && error && (
          <div
            role="alert"
            className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
          >
            {error}
          </div>
        )}

        {!loading && !error && dashboard && (
          <div className="space-y-8">
            <MetricsGrid metrics={dashboard.metrics} />

            <ChartsSection
              vendasMensais={dashboard.vendasMensais}
              categorias={dashboard.categorias}
            />

            <TopProductsSection produtos={dashboard.topProdutos} />

          </div>
        )}
      </main>
    </div>
  );
}
