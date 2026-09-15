// src/components/organisms/ProductTable.tsx
import React from 'react';
import ProductTableHeader from '../molecules/ProductTableHeader';
import { EditButton, DeleteButton, BoxIcon } from '../atoms/Icons';

export interface Product {
  id: string | number;
  name: string;
  productType: string;
  brand: string;
  model: string;
  price: number | string;
  stock: number | string;
  sizes: string;
  color: string;
  active: 'Ativo' | 'Inativo' | string;
}

export interface ProductTableProps {
  /** Array contendo os produtos a serem exibidos */
  products: Product[];
  /** Callback acionado ao clicar no botão de edição de um produto */
  onEdit: (id: string | number) => void;
  /** Callback opcional acionado ao clicar no botão de exclusão */
  onDelete?: (id: string | number) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ 
  products, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="w-full min-w-0 overflow-x-auto bg-white border border-slate-300 rounded-xl shadow-sm">
      <table className="w-full border-collapse align-middle">
        <ProductTableHeader />
        <tbody className="divide-y divide-slate-100 text-sm text-slate-800">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
              {/* Produto */}
              <td className="py-3 px-4 flex items-center gap-3 whitespace-nowrap">
                <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 shrink-0">
                  <BoxIcon className="w-5 h-5" />
                </div>
                <span className="font-medium text-slate-900">{product.name}</span>
              </td>
              
              {/* Tipo do Produto */}
              <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{product.productType}</td>
              
              {/* Marca / Modelo */}
              <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                <div className="font-medium text-slate-900">{product.brand}</div>
                <div className="text-xs text-slate-400">{product.model}</div>
              </td>

              {/* Preço */}
              <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">
                {Number(product.price || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </td>
              
              {/* Estoque */}
              <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{product.stock}</td>
              
              {/* Tamanhos */}
              <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{product.sizes}</td>
              
              {/* Cor */}
              <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{product.color}</td>

              {/* Status (Ativo / Inativo) */}
              <td className="py-3 px-4 whitespace-nowrap">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  product.active === 'Ativo' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {product.active}
                </span>
              </td>
              
              {/* Ações */}
              <td className="py-3 px-4 text-center whitespace-nowrap">
                <div className="flex items-center justify-center gap-2">
                  <EditButton onClick={() => onEdit(product.id)} />
                  {onDelete && <DeleteButton onClick={() => onDelete(product.id)} />}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;