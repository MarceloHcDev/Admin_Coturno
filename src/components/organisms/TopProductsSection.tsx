// src/components/organisms/TopProductsSection.tsx
import React from 'react';
import { ChartHeader } from '../molecules/Chartheader';
import { ProductRow } from '../molecules/ProductRow';

export interface TopProductItem {
  id: number;
  name: string;
  sales: number;
  revenue: string;
  rating: number;
}

export const TopProductsSection: React.FC = () => {
  // Dados extraídos com fidelidade cirúrgica a partir da imagem fornecida
  const productsData: TopProductItem[] = [
    { id: 1, name: 'Atalaia Combat', sales: 342, revenue: 'R$ 68.400', rating: 4.8 },
    { id: 2, name: 'Atalaia Montanha', sales: 298, revenue: 'R$ 59.600', rating: 4.9 },
    { id: 3, name: 'Acero Adventure', sales: 256, revenue: 'R$ 38.400', rating: 4.6 },
    { id: 4, name: 'MacBoot Montanha', sales: 234, revenue: 'R$ 35.100', rating: 4.7 },
    { id: 5, name: 'MacBoot Rider', sales: 198, revenue: 'R$ 23.760', rating: 4.5 },
  ];

  return (
    <div className="w-full bg-white rounded-xl border border-slate-300 shadow-sm mt-6 overflow-hidden">
      {/* Cabeçalho da Seção */}
      <div className="p-6 pb-4">
        <ChartHeader title="Top 5 Produtos Mais Vendidos" />
      </div>

      {/* Tabela Estruturada */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 tracking-wider bg-slate-50/30">
              <th className="py-3.5 pl-6 font-semibold">PRODUTO</th>
              <th className="py-3.5 font-semibold">VENDAS</th>
              <th className="py-3.5 font-semibold">RECEITA</th>
              <th className="py-3.5 pr-6 font-semibold">AVALIAÇÃO</th>
            </tr>
          </thead>
          <tbody>
            {productsData.map((product) => (
              <ProductRow
                key={product.id}
                name={product.name}
                sales={product.sales}
                revenue={product.revenue}
                rating={product.rating}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopProductsSection;