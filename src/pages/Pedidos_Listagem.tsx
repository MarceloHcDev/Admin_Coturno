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
  const [editLoading, setEditLoading] = useState<boolean>(false);

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
    setEditingId(id);
    setEditLoading(true);
    try {
      // Tenta buscar pelo endpoint específico de detalhes
      const pedido = await pedidosService.buscar(id);
      if (pedido) {
        setFormData({
          id: pedido.id,
          valorTotal: pedido.valorTotal,
          statusCompra: pedido.statusCompra,
          statusEnvio: pedido.statusEnvio,
          dataPedido: pedido.dataPedido,
          usuarioId: pedido.usuarioId,
          enderecoId: pedido.enderecoId,
          produtos_do_pedido: pedido.produtos_do_pedido || [],
        });
        setIsEditing(true);
      }
    } catch (e) {
      console.error('Erro ao buscar detalhes do pedido via API, tentando da lista local:', e);
      // Fallback: se a rota individual falhar, usa os dados já carregados na lista
      const local = pedidos.find((p) => String(p.id) === String(id));
      if (local) {
        setFormData({
          id: local.id,
          valorTotal: local.valorTotal,
          statusCompra: local.statusCompra,
          statusEnvio: local.statusEnvio,
          dataPedido: local.dataPedido,
          usuarioId: local.usuarioId,
          enderecoId: local.enderecoId,
          produtos_do_pedido: local.produtos_do_pedido || [],
        });
        setIsEditing(true);
      }
    } finally {
      setEditLoading(false);
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
      (pedido.statusEnvio && pedido.statusEnvio.toLowerCase().includes(term)) ||
      (pedido.statusCompra && pedido.statusCompra.toLowerCase().includes(term)) ||
      (pedido.cliente && pedido.cliente.toLowerCase().includes(term)) ||
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

          {/* Modal / Formulário de edição flutuante / pop-up */}
          {isEditing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
              <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col overflow-hidden">
                {/* Cabeçalho do Modal */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Detalhes do Pedido #{formData.id}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Atualize o status de entrega e visualize os itens do pedido
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Conteúdo do Modal */}
                <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {/* ID do Pedido */}
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        ID do Pedido
                      </label>
                      <input
                        type="text"
                        disabled
                        value={formData.id}
                        className="p-2.5 text-sm border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
                      />
                    </div>

                    {/* Status de Pagamento */}
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Status de Pagamento
                      </label>
                      <input
                        type="text"
                        disabled
                        value={formData.statusCompra}
                        className="p-2.5 text-sm border border-slate-200 rounded-lg bg-slate-100 text-slate-700 cursor-not-allowed font-medium"
                      />
                    </div>

                    {/* Valor Total */}
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Valor Total
                      </label>
                      <input
                        type="text"
                        disabled
                        value={Number(formData.valorTotal || 0).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                        className="p-2.5 text-sm border border-slate-200 rounded-lg bg-slate-100 text-slate-900 font-semibold cursor-not-allowed"
                      />
                    </div>

                    {/* Status de Envio (editável) */}
                    <div className="flex flex-col space-y-1">
                      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Status de Envio
                      </label>
                      <select
                        value={formData.statusEnvio}
                        onChange={(e) =>
                          setFormData({ ...formData, statusEnvio: e.target.value as PedidoEnvioStatus })
                        }
                        className="p-2.5 text-sm border border-indigo-200 bg-indigo-50/30 text-indigo-900 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="Pendente">Pendente</option>
                        <option value="Enviado">Enviado</option>
                        <option value="Entregue">Entregue</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    </div>
                  </div>

                  {/* Exibição dos Produtos do Pedido */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center justify-between">
                      <span>Produtos no Pedido</span>
                      <span className="text-xs font-normal text-slate-500">
                        {formData.produtos_do_pedido?.length || 0} item(ns)
                      </span>
                    </h3>
                    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                      <table className="min-w-full divide-y divide-slate-200 text-sm">
                        <thead className="bg-slate-50 text-slate-600 font-semibold text-xs uppercase tracking-wider">
                          <tr>
                            <th className="px-4 py-3 text-left">Produto</th>
                            <th className="px-4 py-3 text-left">Categoria</th>
                            <th className="px-4 py-3 text-center">Quantidade</th>
                            <th className="px-4 py-3 text-right">Preço Unitário</th>
                            <th className="px-4 py-3 text-right">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                          {formData.produtos_do_pedido && formData.produtos_do_pedido.length > 0 ? (
                            (formData.produtos_do_pedido as any[]).map((item, index) => {
                              const prod = item.produto || {};
                              const nome = prod.nome_produto || prod.nome || prod.model || 'Produto';
                              const categoria = prod.categoria_produto || prod.categoria || 'Geral';
                              const precoBase = prod.preco_produto ?? prod.preco ?? 0;
                              const preco = item.precoUnitario ?? item.unitPrice ?? precoBase;
                              const subtotal = preco * (item.quantidade || item.quantity || 1);

                              return (
                                <tr key={index} className="hover:bg-slate-50/50">
                                  <td className="px-4 py-3 font-medium text-slate-900">{nome}</td>
                                  <td className="px-4 py-3 text-slate-500">{categoria}</td>
                                  <td className="px-4 py-3 text-center font-medium">
                                    {item.quantidade || item.quantity || 1}
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    {Number(preco).toLocaleString('pt-BR', {
                                      style: 'currency',
                                      currency: 'BRL',
                                    })}
                                  </td>
                                  <td className="px-4 py-3 text-right font-medium text-slate-900">
                                    {Number(subtotal).toLocaleString('pt-BR', {
                                      style: 'currency',
                                      currency: 'BRL',
                                    })}
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={5} className="px-4 py-6 text-center text-slate-400 italic">
                                Nenhum produto atrelado a este pedido.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Rodapé do Modal */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleCloseForm}
                      className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                    >
                      Salvar Alterações
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Busca */}
          <div className="flex justify-between items-center mb-4">
            <SearchInput
              placeholder="Buscar por número, cliente ou status"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Estados de carregamento / erro */}
          {loading && <p className="text-center text-gray-600 py-4">Carregando pedidos…</p>}
          {error && <p className="text-center text-red-600 py-4">{error}</p>}

          {/* Tabela de Pedidos */}
          {!loading && filteredPedidos.length > 0 && (
            <PedidoTable
              pedidos={filteredPedidos}
              onEdit={handleEdit}
              onDelete={handleDelete}
              editingId={editingId}
              editLoading={editLoading}
            />
          )}

          {/* Paginação */}

        </div>
      </main>
    </div>
  );
}
