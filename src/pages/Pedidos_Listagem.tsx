// src/pages/Pedidos_Listagem.tsx
import React, { useState } from 'react';
import Sidebar from '../components/organisms/Sidebar';
import PageHeader from '../components/molecules/PageHeader';
import SearchInput from '../components/atoms/SearchInput';
import PedidoTable from '../components/organisms/PedidoTable';
import { Pedido } from '../types/order';

export default function Pedidos_Listagem(): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [pedidos, setPedidos] = useState<Pedido[]>([
    { id: 1001, valorTotal: 599.9, status: 'Entregue', dataPedido: '2026-08-12T14:32:00', usuarioId: 12, enderecoId: 8 },
    { id: 1002, valorTotal: 1099.8, status: 'Enviado', dataPedido: '2026-09-01T09:15:00', usuarioId: 27, enderecoId: 19 },
    { id: 1004, valorTotal: 849.7, status: 'Pendente', dataPedido: '2026-09-14T11:02:00', usuarioId: 33, enderecoId: 21 },
    { id: 1005, valorTotal: 249.9, status: 'Cancelado', dataPedido: '2026-09-15T20:10:00', usuarioId: 12, enderecoId: 8 },
  ]);

  // TODO: substituir por navegação para uma página de detalhes/edição de status
  // do pedido assim que o fluxo correspondente for definido.
  const handleEdit = (id: string | number): void => {
    console.log('Ver detalhes do pedido:', id);
  };

  // Cancela o pedido (remoção lógica) em vez de excluí-lo permanentemente.
  const handleDelete = (id: string | number): void => {
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'Cancelado' } : p))
    );
  };

  const filteredPedidos = pedidos.filter((pedido) => {
    const term = searchTerm.toLowerCase();
    return (
      String(pedido.id).toLowerCase().includes(term) ||
      pedido.status.toLowerCase().includes(term) ||
      String(pedido.usuarioId).toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
      <Sidebar activePage="pedidos" />
      <main className="flex-1 min-w-0 pl-72 pt-8 pb-10 pr-4 lg:pr-8 xl:pr-12 2xl:pr-16">
        <div className="max-w-[1600px] mx-auto space-y-6 min-w-0">
          <PageHeader
            title="Listagem de Pedidos"
            subtitle="Acompanhe e gerencie os pedidos realizados pelos clientes"
            hideButton={true}
          />

          <div className="w-full bg-white rounded-xl mb-5 mt-7">
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por pedido, cliente ou status..."
            />
          </div>

          <PedidoTable
            pedidos={filteredPedidos}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </main>
    </div>
  );
}
