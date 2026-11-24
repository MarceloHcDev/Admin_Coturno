// src/components/organisms/ProductTable.tsx
import React, { useState } from "react";
import ProductTableHeader from "../molecules/ProductTableHeader";
import { EditButton, DeleteButton, BoxIcon } from "../atoms/Icons";

export interface Product {
  id: string | number;
  name: string;
  productType: string;
  terrainType?: string;
  brand: string;
  model: string;
  price: number | string;
  costPrice?: number | string;
  stock: number | string;
  sizes: string;
  grade?: Array<{ size: number; stock: number }>;
  color: string;
  active: "Ativo" | "Inativo" | string;
  description?: string;
  image?: string;
  images?: string[];
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
  onDelete,
}) => {
  const [hoveredProductId, setHoveredProductId] = useState<string | number | null>(null);

  return (
    <div className="w-full min-w-0 overflow-x-auto bg-white border border-slate-300 rounded-xl shadow-sm">
      <table className="w-full border-collapse align-middle">
        <ProductTableHeader />
        <tbody className="divide-y divide-slate-100 text-sm text-slate-800">
          {products.map((product, index) => {
            const isLastRow = index >= products.length - 2 && products.length > 3;
            return (
            <tr
              key={product.id}
              className="hover:bg-slate-50/50 transition-colors"
            >
              {/* Produto */}
              <td className="py-3 px-4 flex items-center gap-3 whitespace-nowrap">
                <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 shrink-0">
                  <BoxIcon className="w-5 h-5" />
                </div>
                <span className="font-medium text-slate-900">
                  {product.name}
                </span>
              </td>

              {/* Tipo do Produto */}
              <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                <div className="font-medium text-slate-900">{product.productType}</div>
                {product.terrainType && (
                  <div className="text-xs text-blue-600 font-medium">
                    {product.terrainType}
                  </div>
                )}
              </td>

              {/* Marca / Modelo */}
              <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                <div className="font-medium text-slate-900">
                  {product.brand}
                </div>
                <div className="text-xs text-slate-400">{product.model}</div>
              </td>

              {/* Preço */}
              <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">
                <div>
                  {Number(product.price || 0).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </div>
                {product.costPrice ? (
                  <div className="text-xs text-slate-400 font-normal">
                    Custo:{" "}
                    {Number(product.costPrice).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </div>
                ) : null}
              </td>

              {/* Estoque com Popover / Tooltip */}
              <td className="py-3 px-4 whitespace-nowrap">
                <div
                  className="relative inline-block"
                  onMouseEnter={() => setHoveredProductId(product.id)}
                  onMouseLeave={() => setHoveredProductId(null)}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setHoveredProductId((prev) =>
                        prev === product.id ? null : product.id
                      );
                    }}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-medium text-xs transition-all cursor-pointer ${
                      Number(product.stock) > 0
                        ? "bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-700 border-slate-200 hover:border-blue-300"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                    title="Passe o mouse ou clique para ver a grade de estoque"
                  >
                    <span className="font-semibold">{product.stock} un.</span>
                    <span className="text-[10px] text-slate-400 group-hover:text-blue-500">
                      ℹ️
                    </span>
                  </button>

                  {/* Popover / Tooltip Flutuante */}
                  {hoveredProductId === product.id && (
                    <div
                      className={`absolute left-0 z-50 w-64 p-3 bg-white rounded-xl shadow-xl border border-slate-200 text-left transition-all ${
                        isLastRow ? "bottom-full mb-2" : "top-full mt-2"
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-800">
                          Grade por Tamanho
                        </span>
                        <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          Total: {product.stock} un.
                        </span>
                      </div>

                      {product.grade && product.grade.length > 0 ? (
                        <div className="grid grid-cols-4 gap-1.5 pt-2.5">
                          {product.grade.map((item) => (
                            <div
                              key={item.size}
                              className={`flex flex-col items-center justify-center p-1.5 rounded-lg border text-center transition-colors ${
                                Number(item.stock) > 0
                                  ? "bg-slate-50 border-slate-200 text-slate-900"
                                  : "bg-slate-50/50 border-slate-100 text-slate-400 opacity-60"
                              }`}
                            >
                              <span className="text-[11px] font-bold">
                                Nº {item.size}
                              </span>
                              <span
                                className={`text-[10px] font-semibold ${
                                  Number(item.stock) > 0
                                    ? "text-blue-600"
                                    : "text-slate-400"
                                }`}
                              >
                                {item.stock} un.
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="pt-2 text-xs text-slate-500">
                          <p className="font-medium text-slate-700 mb-1">
                            Tamanhos cadastrados:
                          </p>
                          <p className="text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            {product.sizes || "Nenhum tamanho informado"}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </td>

              {/* Tamanhos */}
              <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                {product.sizes}
              </td>

              {/* Cor */}
              <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                {product.color}
              </td>

              {/* Status (Ativo / Inativo) */}
              <td className="py-3 px-4 whitespace-nowrap">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    product.active === "Ativo"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}
                >
                  {product.active}
                </span>
              </td>

              {/* Ações */}
              <td className="py-3 px-4 text-center whitespace-nowrap">
                <div className="flex items-center justify-center gap-2">
                  <EditButton onClick={() => onEdit(product.id)} />
                  {onDelete && (
                    <DeleteButton onClick={() => onDelete(product.id)} />
                  )}
                </div>
              </td>
            </tr>
          );
        })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
