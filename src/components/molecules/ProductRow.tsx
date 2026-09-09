// src/components/molecules/ProductRow.tsx
import React from 'react';
import { BoxIcon, StarIcon } from '../atoms/Icons';

export interface ProductRowProps {
  /** Nome do produto */
  name: string;
  /** Quantidade de vendas (ex: "1.240" ou "1240 un") */
  sales: string | number;
  /** Receita gerada (ex: "R$ 45.900") */
  revenue: string;
  /** Avaliação/Nota do produto (ex: 4.8) */
  rating: number;
}

export const ProductRow: React.FC<ProductRowProps> = ({ 
  name, 
  sales, 
  revenue, 
  rating 
}) => {
  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
      {/* Coluna do Produto */}
      <td className="py-4.5 pl-6 flex items-center gap-3">
        <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
          <BoxIcon />
        </div>
        <span className="font-semibold text-slate-900 text-sm">{name}</span>
      </td>
      
      {/* Coluna de Vendas */}
      <td className="py-4.5 text-sm text-slate-700 font-medium">
        {sales}
      </td>
      
      {/* Coluna de Receita */}
      <td className="py-4.5 text-sm text-slate-700 font-medium">
        {revenue}
      </td>
      
      {/* Coluna de Avaliação */}
      <td className="py-4.5 pr-6">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
          <StarIcon />
          <span>{rating.toFixed(1)}</span>
        </div>
      </td>
    </tr>
  );
};