// src/components/molecules/PedidoTableHeader.tsx
import React from 'react';

export const PedidoTableHeader: React.FC = () => {
  return (
    <thead className="bg-slate-50 border-b border-slate-200">
      <tr>
        <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
          Pedido
        </th>
        <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
          Cliente
        </th>
        <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
          Endereço de Entrega
        </th>
        <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
          Valor Total
        </th>
        <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
          Data do Pedido
        </th>
        <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
          Status
        </th>
        <th scope="col" className="py-3 px-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
          Detalhes/Ações
        </th>
      </tr>
    </thead>
  );
};

export default PedidoTableHeader;
