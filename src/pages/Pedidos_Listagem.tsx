// src/pages/Pedidos_Listagem.tsx
import React, { useState, FormEvent } from 'react';
import Sidebar from '../components/organisms/Sidebar';
import PageHeader from '../components/molecules/PageHeader';
import SearchInput from '../components/atoms/SearchInput';
import PedidoTable from '../components/organisms/PedidoTable';
import { Pedido, PedidoEnvioStatus, PedidoFilters } from '../types/order';
import { pedidosService } from '../services/pedidos.service';
import { Pagination } from '../components/atoms/Pagination';
import { usePedidos } from '@/hooks/usePedidos';

export interface PedidoFormData extends Omit<Pedido, 'valorTotal'> {
  valorTotal: number | string;
}

export default function Pedidos_Listagem(): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);

  // Hook para obter a lista real de pedidos
  const {
    pedidos,
    loading,
    error,
    refetch,
    page,
    setPage,
    filters,
    setFilters,
    totalPages,
  } = usePedidos(1, 20, { busca: '' });

  const [formData, setFormData] = useState<PedidoFormData>({
    id: '',
    valorTotal: '',
    statusCompra: 'Pendente',
    statusEnvio: 'Pendente',
    dataPedido: '',
    usuarioId: '',
    enderecoId: '',
    produtos_do_pedido: [],
  });

  const handleEdit = async (id: string | number): Promise<void> => {
    try {
      const pedido = await pedidosService.buscar(id);
      setFormData({
        id: pedido.id,
        valorTotal: pedido.valorTotal,
        statusCompra: pedido.statusCompra,
        statusEnvio: pedido.statusEnvio,
        dataPedido: pedido.dataPedido,
        usuarioId: pedido.usuarioId,
        enderecoId: pedido.enderecoId,
        produtos_do_pedido: pedido.produtos_do_pedido,
      });
      setEditingId(pedido.id);
      setIsEditing(true);
    } catch (e) {
      console.error('Erro ao buscar pedido', e);
    }
  };

  const handleCloseForm = (): void => {
    setIsEditing(false);
    setEditingId(null);
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (editingId !== null) {
      try {
        await pedidosService.atualizarStatus(editingId, formData.statusEnvio);
        await refetch();
      } catch (e) {
        console.error('Erro ao atualizar status', e);
      }
    }
    handleCloseForm();
  };

  const handleDelete = async (id: string | number): Promise<void> => {
    try {
      await pedidosService.cancelar(id);
      await refetch();
    } catch (e) {
      console.error('Erro ao cancelar pedido', e);
    }
  };

  const filteredPedidos = pedidos.filter((pedido) => {
    const term = searchTerm.toLowerCase();
    return (
      String(pedido.id).toLowerCase().includes(term) ||
      pedido.statusEnvio.toLowerCase().includes(term) ||
      pedido.statusCompra.toLowerCase().includes(term) ||
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

          {/* Busca */}
          <div className="flex justify-between items-center mb-4">
            <SearchInput
              placeholder="Buscar por número, cliente ou status"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Estados de carregamento / erro */}
          {loading && <p className="text-center text-gray-600">Carregando pedidos…</p>}
          {error && <p className="text-center text-red-600">{error}</p>}

          {/* Paginação */}
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />

          {/* Tabela de Pedidos */}
          {filteredPedidos.length > 0 && (
            <PedidoTable
              pedidos={filteredPedidos}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          {/* Formulário de edição */}
          {isEditing && (
            <div className="w-full bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Detalhes do Pedido #{formData.id}</h2>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {/* ID do Pedido */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">ID do Pedido</label>
                    <input type="text" disabled value={formData.id} className="p-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed" />
                  </div>

                  {/* Status de Envio (editável) */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">Status de Envio</label>
                    <select
                      value={formData.statusEnvio}
                      onChange={(e) => setFormData({ ...formData, statusEnvio: e.target.value as PedidoEnvioStatus })}
                      className="p-2 border border-slate-200 rounded-lg"
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Enviado">Enviado</option>
                      <option value="Entregue">Entregue</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Salvar</button>
                  <button type="button" onClick={handleCloseForm} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">Cancelar</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
