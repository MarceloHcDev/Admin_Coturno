
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

            {/* Pedidos por status */}
            {/* <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="font-bold text-slate-800 mb-4">
                Pedidos por status
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                {Object.entries(dashboard.pedidosPorStatus).map(
                  ([status, quantidade]) => (
                    <div
                      key={status}
                      className="rounded-xl bg-slate-50 p-4"
                    >
                      <p className="text-xs text-slate-500 capitalize">
                        {status.replace(/_/g, " ")}
                      </p>

                      <p className="text-2xl font-bold text-slate-800 mt-2">
                        {quantidade}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </section> */}

            {/* Estoque crítico */}
            {/* <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-slate-800">
                    Estoque crítico
                  </h2>

                  <p className="text-xs text-slate-500 mt-1">
                    Produtos com menos de 5 unidades por tamanho
                  </p>
                </div>

                <span className="text-sm font-bold text-red-600">
                  {dashboard.estoqueCritico.totalCriticos} ocorrências
                </span>
              </div>

              {dashboard.estoqueCritico.itens.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-slate-400 border-b">
                        <th className="py-3">Produto</th>
                        <th className="py-3">Tamanho</th>
                        <th className="py-3">Quantidade</th>
                      </tr>
                    </thead>

                    <tbody>
                      {dashboard.estoqueCritico.itens.map((item, index) => (
                        <tr
                          key={`${item.produtoId}-${item.tamanho}-${index}`}
                          className="border-b border-slate-100"
                        >
                          <td className="py-3 font-medium text-slate-700">
                            {item.nome}
                          </td>

                          <td className="py-3 text-slate-500">
                            {item.tamanho}
                          </td>

                          <td className="py-3">
                            <span className="text-red-600 font-bold">
                              {item.quantidade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  Nenhum produto com estoque crítico.
                </p>
              )}
            </section> */}
          </div>
        )}
      </main>
    </div>
  );
}
