// src/pages/Pedidos_Listagem.tsx
import React, { useState, FormEvent } from 'react';
import Sidebar from '../components/organisms/Sidebar';
import PageHeader from '../components/molecules/PageHeader';
import SearchInput from '../components/atoms/SearchInput';
import PedidoTable from '../components/organisms/PedidoTable';
import { Pedido, PedidoEnvioStatus, PedidoFilters } from '../types/order';
import { pedidosService } from '../services/pedidos.service';
import { usePedidos } from '@/hooks/usePedidos';

export interface PedidoFormData extends Omit<Pedido, 'valorTotal' | 'subtotal' | 'frete'> {
  valorTotal: number | string;
  subtotal?: number | string;
  frete?: number | string;
  cliente?: string;
  enderecoTexto?: string;
  status: string;
}

export default function Pedidos_Listagem(): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // Hook para obter a lista real de pedidos
  const {
    pedidos,
    loading,
    error,
    refetch,
  } = usePedidos(1, 20, { busca: '' });

  const [formData, setFormData] = useState<PedidoFormData>({
    id: '',
    valorTotal: '',
    subtotal: '',
    frete: '',
    cliente: '',
    enderecoTexto: '',
    status: 'pending',
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
      const pedido: any = await pedidosService.buscar(id);
      const local: any = pedidos.find((p) => String(p.id) === String(id));
      const source = pedido || local;

      if (source) {
        const itens = source.produtos_do_pedido || source.items || [];

        // Calcular subtotal baseado na soma dos itens do pedido
        const calcSubtotal = itens.reduce((acc: number, item: any) => {
          const preco = Number(
            item.precoUnitario ??
            item.unitPrice ??
            item.unit_price ??
            item.produto?.preco ??
            item.produto?.preco_produto ??
            0
          );
          const qtd = Number(item.quantidade ?? item.quantity ?? 1);
          return acc + (preco * qtd);
        }, 0);

        const valorTotal = Number(source.valorTotal ?? source.totalAmount ?? source.total_amount ?? 0);
        const freteRecebido = Number(source.frete ?? source.shippingFee ?? source.shipping_fee ?? 0);
        const subtotal = Number(source.subtotal ?? (calcSubtotal > 0 ? calcSubtotal : valorTotal));
        const frete = freteRecebido > 0 ? freteRecebido : (valorTotal > subtotal ? valorTotal - subtotal : 0);

        // Nome do cliente
        const clienteNome =
          source.cliente ||
          local?.cliente ||
          (source.user ? `${source.user.first_name || ''} ${source.user.last_name || ''}`.trim() : '') ||
          `Cliente #${source.usuarioId || source.user_id || ''}`;

        // Endereço formatado completo
        const end = source.endereco || local?.endereco;
        let enderecoFormatado = '';
        if (typeof end === 'string') {
          enderecoFormatado = end;
        } else if (end?.texto) {
          enderecoFormatado = end.texto;
        } else if (end?.logradouro) {
          const partes = [
            `${end.logradouro}${end.numero ? `, ${end.numero}` : ''}`,
            end.complemento ? `(${end.complemento})` : '',
            end.bairro ? `- ${end.bairro}` : '',
            end.cidade && end.estado ? `- ${end.cidade}/${end.estado}` : (end.cidade || ''),
            end.cep ? `- CEP: ${end.cep}` : '',
          ].filter(Boolean);
          enderecoFormatado = partes.join(' ');
        } else if (source.shipping_street) {
          enderecoFormatado = `${source.shipping_street}, ${source.shipping_number || 'S/N'}${source.shipping_complement ? ` (${source.shipping_complement})` : ''} - ${source.shipping_neighborhood || ''}, ${source.shipping_city || ''}/${source.shipping_state || ''} - CEP: ${source.shipping_zip_code || ''}`;
        } else {
          enderecoFormatado = 'Endereço não informado';
        }

        const rawStatus = source.status || (source.statusEnvio === 'Enviado' ? 'shipped' : source.statusEnvio === 'Entregue' ? 'delivered' : source.statusEnvio === 'Cancelado' ? 'cancelled' : source.statusEnvio === 'Em Separação' ? 'preparing' : source.statusEnvio === 'Pago' ? 'paid' : 'pending');

        setFormData({
          id: source.id,
          valorTotal,
          subtotal,
          frete,
          cliente: clienteNome,
          enderecoTexto: enderecoFormatado,
          endereco: typeof end === 'object' ? end : undefined,
          status: rawStatus,
          statusCompra: source.statusCompra || 'Pendente',
          statusEnvio: source.statusEnvio || 'Pendente',
          dataPedido: source.dataPedido || source.orderDate || source.created_at || '',
          usuarioId: source.usuarioId || source.user_id || '',
          enderecoId: source.enderecoId || source.address_id || '',
          produtos_do_pedido: itens,
        });
        setIsEditing(true);
      }
    } catch (e) {
      console.error('Erro ao buscar detalhes do pedido via API, tentando da lista local:', e);
      // Fallback: se a rota individual falhar, usa os dados já carregados na lista
      const local: any = pedidos.find((p) => String(p.id) === String(id));
      if (local) {
        const itens = local.produtos_do_pedido || [];
        const calcSubtotal = itens.reduce((acc: number, item: any) => {
          const preco = Number(item.precoUnitario ?? item.unitPrice ?? item.produto?.preco ?? 0);
          const qtd = Number(item.quantidade ?? 1);
          return acc + (preco * qtd);
        }, 0);
        const valorTotal = Number(local.valorTotal || 0);
        const frete = Number(local.frete ?? local.shippingFee ?? 0);
        const subtotal = Number(local.subtotal ?? (calcSubtotal > 0 ? calcSubtotal : valorTotal));
        const freteFinal = frete > 0 ? frete : (valorTotal > subtotal ? valorTotal - subtotal : 0);
        const rawStatus = local.status || (local.statusEnvio === 'Enviado' ? 'shipped' : local.statusEnvio === 'Entregue' ? 'delivered' : local.statusEnvio === 'Cancelado' ? 'cancelled' : local.statusEnvio === 'Em Separação' ? 'preparing' : local.statusEnvio === 'Pago' ? 'paid' : 'pending');

        setFormData({
          id: local.id,
          valorTotal,
          subtotal,
          frete: freteFinal,
          cliente: local.cliente || `Cliente #${local.usuarioId}`,
          enderecoTexto: local.endereco?.texto || local.endereco?.logradouro || 'Endereço não informado',
          endereco: local.endereco,
          status: rawStatus,
          statusCompra: local.statusCompra,
          statusEnvio: local.statusEnvio,
          dataPedido: local.dataPedido,
          usuarioId: local.usuarioId,
          enderecoId: local.enderecoId,
          produtos_do_pedido: itens,
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
      setSaving(true);
      try {
        await pedidosService.atualizarStatus(editingId, formData.status);
        await refetch();
      } catch (e) {
        console.error('Erro ao atualizar status', e);
      } finally {
        setSaving(false);
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
                  {/* Grade Completa: Pedido, Cliente, Endereço, Frete e Valores */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {/* ID do Pedido */}
                    <div className="flex flex-col space-y-1 lg:col-span-2">
                      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        ID do Pedido
                      </label>
                      <input
                        type="text"
                        disabled
                        value={formData.id}
                        className="p-2.5 text-sm border border-slate-200 rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed font-mono"
                      />
                    </div>

                    {/* Nome do Cliente */}
                    <div className="flex flex-col space-y-1 lg:col-span-2">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Nome do Cliente</span>
                      </label>
                      <input
                        type="text"
                        disabled
                        value={formData.cliente || 'Cliente não identificado'}
                        className="p-2.5 text-sm border border-slate-200 rounded-lg bg-slate-100 text-slate-900 font-semibold cursor-not-allowed"
                      />
                    </div>

                    {/* Status Geral do Pedido (Unificado e Sincronizado) */}
                    <div className="flex flex-col space-y-1 lg:col-span-2">
                      <label className="text-xs font-semibold text-indigo-700 uppercase tracking-wider flex items-center justify-between">
                        <span>Status do Pedido</span>
                        <span className="text-[10px] text-indigo-600 font-normal lowercase">sincroniza cliente</span>
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({
                            ...formData,
                            status: val,
                            statusEnvio: val === 'shipped' ? 'Enviado' : val === 'delivered' ? 'Entregue' : val === 'preparing' ? 'Em Separação' : val === 'paid' ? 'Pago' : val === 'cancelled' ? 'Cancelado' : 'Pendente',
                            statusCompra: val === 'pending' ? 'Pendente' : val === 'cancelled' ? 'Cancelado' : 'Aprovado',
                          });
                        }}
                        className="p-2.5 text-sm border-2 border-indigo-500 bg-indigo-50/50 text-indigo-950 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer shadow-xs"
                      >
                        <option value="pending">⏳ Aguardando Pagamento (Pendente)</option>
                        <option value="paid">💳 Pagamento Aprovado (Pago)</option>
                        <option value="preparing">📦 Em Separação Logística</option>
                        <option value="shipped">🚚 Enviado / Em Trânsito</option>
                        <option value="delivered">✅ Entregue no Destino</option>
                        <option value="cancelled">❌ Cancelado</option>
                      </select>
                    </div>

                    {/* Endereço Completo de Entrega */}
                    <div className="flex flex-col space-y-1 sm:col-span-2 md:col-span-3 lg:col-span-6">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Endereço de Entrega</span>
                      </label>
                      <input
                        type="text"
                        disabled
                        value={formData.enderecoTexto || 'Endereço não informado'}
                        className="p-2.5 text-sm border border-slate-200 rounded-lg bg-slate-100 text-slate-800 cursor-not-allowed font-medium"
                      />
                    </div>

                    {/* Subtotal dos Itens */}
                    <div className="flex flex-col space-y-1 lg:col-span-2">
                      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Subtotal (Itens)
                      </label>
                      <input
                        type="text"
                        disabled
                        value={Number(formData.subtotal || 0).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                        className="p-2.5 text-sm border border-slate-200 rounded-lg bg-slate-100 text-slate-800 font-medium cursor-not-allowed"
                      />
                    </div>

                    {/* Valor do Frete */}
                    <div className="flex flex-col space-y-1 lg:col-span-2">
                      <label className="text-xs font-semibold text-indigo-700 uppercase tracking-wider flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1m-6 0a1 1 0 102 0m-2 0a1 1 0 112 0m8 0a1 1 0 102 0m-2 0a1 1 0 112 0" />
                          </svg>
                          Valor do Frete
                        </span>
                        <span className="text-[10px] text-indigo-600 font-semibold lowercase">incluso</span>
                      </label>
                      <input
                        type="text"
                        disabled
                        value={Number(formData.frete || 0).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                        className="p-2.5 text-sm border border-indigo-200 bg-indigo-50/60 text-indigo-900 font-semibold cursor-not-allowed"
                      />
                    </div>

                    {/* Valor Total */}
                    <div className="flex flex-col space-y-1 lg:col-span-2">
                      <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                        <span>Valor Total</span>
                        <span className="text-[10px] text-slate-500 font-normal">subtotal + frete</span>
                      </label>
                      <input
                        type="text"
                        disabled
                        value={Number(formData.valorTotal || 0).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                        className="p-2.5 text-sm border-2 border-slate-300 rounded-lg bg-slate-100 text-slate-950 font-bold cursor-not-allowed text-base"
                      />
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
                              const preco = item.precoUnitario ?? item.unitPrice ?? item.unit_price ?? precoBase;
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

                    {/* Resumo Financeiro Visual (Subtotal + Frete = Total) */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-3 shadow-2xs">
                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>A diferença entre o subtotal dos produtos e o valor total refere-se ao custo de frete.</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-5 justify-end">
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-slate-500 font-medium">Subtotal dos Itens</span>
                          <span className="text-sm font-semibold text-slate-800">
                            {Number(formData.subtotal || 0).toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </span>
                        </div>
                        <div className="text-slate-400 font-bold text-sm">+</div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-indigo-600 font-medium">
                            Frete
                          </span>
                          <span className="text-sm font-semibold text-indigo-600">
                            {Number(formData.frete || 0).toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </span>
                        </div>
                        <div className="text-slate-400 font-bold text-sm">=</div>
                        <div className="flex flex-col items-end bg-white px-3.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                          <span className="text-xs text-slate-500 font-medium">Valor Total</span>
                          <span className="text-base font-bold text-slate-900">
                            {Number(formData.valorTotal || 0).toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </span>
                        </div>
                      </div>
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
        disabled={saving}
        className={`px-5 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {saving ? 'Atualizando...' : 'Salvar Alterações'}
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
