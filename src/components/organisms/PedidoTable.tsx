// src/components/organisms/PedidoTable.tsx
import React from 'react';
import PedidoTableHeader from '../molecules/PedidoTableHeader';
import { EditButton, DeleteButton, BoxIcon } from '../atoms/Icons';
import { Pedido, PedidoStatus } from '../../types/order';

export interface PedidoTableProps {
  /** Array contendo os pedidos a serem exibidos */
  pedidos: Pedido[];
  /** Callback acionado ao clicar no botão de edição/detalhes de um pedido */
  onEdit: (id: string | number) => void;
  /** Callback opcional acionado ao clicar no botão de exclusão/cancelamento */
  onDelete?: (id: string | number) => void;
}

const statusStyles: Record<PedidoStatus, string> = {
  Pendente: 'bg-amber-50 text-amber-700 border border-amber-200',
  Enviado: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  Entregue: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Cancelado: 'bg-rose-50 text-rose-700 border border-rose-200',
};

export const PedidoTable: React.FC<PedidoTableProps> = ({
  pedidos,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="w-full min-w-0 overflow-x-auto bg-white border border-slate-300 rounded-xl shadow-sm">
      <table className="w-full border-collapse align-middle">
        <PedidoTableHeader />
        <tbody className="divide-y divide-slate-100 text-sm text-slate-800">
          {pedidos.map((pedido) => (
            <tr key={pedido.id} className="hover:bg-slate-50/50 transition-colors">
              {/* Pedido */}
              <td className="py-3 px-4 flex items-center gap-3 whitespace-nowrap">
                <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 shrink-0">
                  <BoxIcon className="w-5 h-5" />
                </div>
                <span className="font-medium text-slate-900">#{pedido.id}</span>
              </td>

              {/* Cliente (usuario_id) */}
              <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                Cliente #{pedido.usuarioId}
              </td>

              {/* Endereço de Entrega (endereco_id) */}
              <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                Endereço #{pedido.enderecoId}
              </td>

              {/* Valor Total */}
              <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">
                {Number(pedido.valorTotal || 0).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </td>

              {/* Data do Pedido */}
              <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                {new Date(pedido.dataPedido).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </td>

              {/* Status */}
              <td className="py-3 px-4 whitespace-nowrap">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[pedido.status as PedidoStatus] ?? 'bg-slate-50 text-slate-700 border border-slate-200'}`}
                >
                  {pedido.status}
                </span>
              </td>

              {/* Ações */}
              <td className="py-3 px-4 text-center whitespace-nowrap">
                <div className="flex items-center justify-center gap-2">
                  <EditButton onClick={() => onEdit(pedido.id)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PedidoTable;
