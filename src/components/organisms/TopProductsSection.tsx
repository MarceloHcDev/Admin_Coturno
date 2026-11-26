
import React from "react";
import type { TopProduto } from "../../types/adminDashboard";

interface TopProductsSectionProps {
  produtos: TopProduto[];
}

export function TopProductsSection({
  produtos,
}: TopProductsSectionProps): React.JSX.Element {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-base font-bold text-slate-800 mb-1">
        Produtos em destaque
      </h2>

      <p className="text-xs text-slate-400 mb-6">
        Produtos retornados pelo painel administrativo
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-400 border-b">
              <th className="pb-3">Produto</th>
              <th className="pb-3">Vendas</th>
              <th className="pb-3">Receita estimada</th>
            </tr>
          </thead>

          <tbody>
            {produtos.length > 0 ? (
              produtos.map((produto) => (
                <tr
                  key={produto.id}
                  className="border-b border-slate-100"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={produto.image || produto.foto}
                        alt={produto.name}
                        className="w-12 h-12 rounded-lg object-cover bg-slate-100"
                      />

                      <span className="font-semibold text-slate-700">
                        {produto.name}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 text-slate-600">
                    {produto.sales}
                  </td>

                  <td className="py-4 font-medium text-slate-700">
                    {produto.revenue}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="py-8 text-center text-slate-400"
                >
                  Nenhum produto disponível.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
