// src/pages/Pedidos_Listagem.tsx
import React, { useState, FormEvent } from 'react';
import Sidebar from '../components/organisms/Sidebar';
import PageHeader from '../components/molecules/PageHeader';
import SearchInput from '../components/atoms/SearchInput';
import PedidoTable from '../components/organisms/PedidoTable';
import { Pedido, PedidoStatus, ItemPedido } from '../types/order';

export interface PedidoFormData extends Omit<Pedido, 'valorTotal'> {
  valorTotal: number | string;
}

export default function Pedidos_Listagem(): React.JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);

  // MOCK utilizando asserção de tipo (as ItemPedido[]) para evitar inconsistências com Product
  const [pedidos, setPedidos] = useState<Pedido[]>([
    {
      id: 1001,
      valorTotal: 599.9,
      status: 'Entregue',
      dataPedido: '2026-08-12T14:32:00',
      usuarioId: 12,
      enderecoId: 8,
      produtos_do_pedido: [
        {
          produto: { 
            id: 1, 
            nome: 'Atalaia Combat', 
            nome_produto: 'Atalaia Combat',
            categoria: 'Coturno', 
            categoria_produto: 'Coturno',
            preco: 599.9, 
            preco_produto: 599.9,
            estoque: 45, 
            quantidade_estoque: 45,
            status: 'Em Estoque' 
          } as any,
          quantidade: 1,
          precoUnitario: 599.9,
        },
      ],
    },
    {
      id: 1002,
      valorTotal: 1099.8,
      status: 'Enviado',
      dataPedido: '2026-09-01T09:15:00',
      usuarioId: 27,
      enderecoId: 19,
      produtos_do_pedido: [
        {
          produto: { 
            id: 2, 
            nome: 'Atalaia Montanha', 
            nome_produto: 'Atalaia Montanha',
            categoria: 'Coturno', 
            categoria_produto: 'Coturno',
            preco: 799.9, 
            preco_produto: 799.9,
            estoque: 32, 
            quantidade_estoque: 32,
            status: 'Em Estoque' 
          } as any,
          quantidade: 1,
          precoUnitario: 799.9,
        },
        {
          produto: { 
            id: 3, 
            nome: 'Acero Adventure', 
            nome_produto: 'Acero Adventure',
            categoria: 'Borzeguim', 
            categoria_produto: 'Borzeguim',
            preco: 299.9, 
            preco_produto: 299.9,
            estoque: 28, 
            quantidade_estoque: 28,
            status: 'Em Estoque' 
          } as any,
          quantidade: 1,
          precoUnitario: 299.9,
        },
      ],
    },
    {
      id: 1003,
      valorTotal: 800.8,
      status: 'Enviado',
      dataPedido: '2026-09-01T09:15:00',
      usuarioId: 27,
      enderecoId: 19,
      produtos_do_pedido: [
        {
          produto: { 
            id: 2, 
            nome: 'Atalaia Montanha', 
            nome_produto: 'Atalaia Montanha',
            categoria: 'Coturno', 
            categoria_produto: 'Coturno',
            preco: 799.9, 
            preco_produto: 799.9,
            estoque: 32, 
            quantidade_estoque: 32,
            status: 'Em Estoque' 
          } as any,
          quantidade: 1,
          precoUnitario: 799.9,
        },
        {
          produto: { 
            id: 3, 
            nome: 'Acero Adventure', 
            nome_produto: 'Acero Adventure',
            categoria: 'Borzeguim', 
            categoria_produto: 'Borzeguim',
            preco: 299.9, 
            preco_produto: 299.9,
            estoque: 28, 
            quantidade_estoque: 28,
            status: 'Em Estoque' 
          } as any,
          quantidade: 1,
          precoUnitario: 299.9,
        },
      ],
    },
    {
      id: 1004,
      valorTotal: 800.8,
      status: 'Enviado',
      dataPedido: '2026-09-01T09:15:00',
      usuarioId: 27,
      enderecoId: 19,
      produtos_do_pedido: [
        {
          produto: { 
            id: 2, 
            nome: 'Atalaia Montanha', 
            nome_produto: 'Atalaia Montanha',
            categoria: 'Coturno', 
            categoria_produto: 'Coturno',
            preco: 799.9, 
            preco_produto: 799.9,
            estoque: 32, 
            quantidade_estoque: 32,
            status: 'Em Estoque' 
          } as any,
          quantidade: 1,
          precoUnitario: 799.9,
        },
        {
          produto: { 
            id: 3, 
            nome: 'Acero Adventure', 
            nome_produto: 'Acero Adventure',
            categoria: 'Borzeguim', 
            categoria_produto: 'Borzeguim',
            preco: 299.9, 
            preco_produto: 299.9,
            estoque: 28, 
            quantidade_estoque: 28,
            status: 'Em Estoque' 
          } as any,
          quantidade: 1,
          precoUnitario: 299.9,
        },
      ],
    },
    {
      id: 1005,
      valorTotal: 800.8,
      status: 'Enviado',
      dataPedido: '2026-09-01T09:15:00',
      usuarioId: 27,
      enderecoId: 19,
      produtos_do_pedido: [
        {
          produto: { 
            id: 2, 
            nome: 'Atalaia Montanha', 
            nome_produto: 'Atalaia Montanha',
            categoria: 'Coturno', 
            categoria_produto: 'Coturno',
            preco: 799.9, 
            preco_produto: 799.9,
            estoque: 32, 
            quantidade_estoque: 32,
            status: 'Em Estoque' 
          } as any,
          quantidade: 1,
          precoUnitario: 799.9,
        },
        {
          produto: { 
            id: 3, 
            nome: 'Acero Adventure', 
            nome_produto: 'Acero Adventure',
            categoria: 'Borzeguim', 
            categoria_produto: 'Borzeguim',
            preco: 299.9, 
            preco_produto: 299.9,
            estoque: 28, 
            quantidade_estoque: 28,
            status: 'Em Estoque' 
          } as any,
          quantidade: 1,
          precoUnitario: 299.9,
        },
      ],
    },
    {
      id: 1006,
      valorTotal: 800.8,
      status: 'Enviado',
      dataPedido: '2026-09-01T09:15:00',
      usuarioId: 27,
      enderecoId: 19,
      produtos_do_pedido: [
        {
          produto: { 
            id: 2, 
            nome: 'Atalaia Montanha', 
            nome_produto: 'Atalaia Montanha',
            categoria: 'Coturno', 
            categoria_produto: 'Coturno',
            preco: 799.9, 
            preco_produto: 799.9,
            estoque: 32, 
            quantidade_estoque: 32,
            status: 'Em Estoque' 
          } as any,
          quantidade: 1,
          precoUnitario: 799.9,
        },
        {
          produto: { 
            id: 3, 
            nome: 'Acero Adventure', 
            nome_produto: 'Acero Adventure',
            categoria: 'Borzeguim', 
            categoria_produto: 'Borzeguim',
            preco: 299.9, 
            preco_produto: 299.9,
            estoque: 28, 
            quantidade_estoque: 28,
            status: 'Em Estoque' 
          } as any,
          quantidade: 1,
          precoUnitario: 299.9,
        },
      ],
    },
    {
      id: 1007,
      valorTotal: 800.8,
      status: 'Enviado',
      dataPedido: '2026-09-01T09:15:00',
      usuarioId: 27,
      enderecoId: 19,
      produtos_do_pedido: [
        {
          produto: { 
            id: 2, 
            nome: 'Atalaia Montanha', 
            nome_produto: 'Atalaia Montanha',
            categoria: 'Coturno', 
            categoria_produto: 'Coturno',
            preco: 799.9, 
            preco_produto: 799.9,
            estoque: 32, 
            quantidade_estoque: 32,
            status: 'Em Estoque' 
          } as any,
          quantidade: 1,
          precoUnitario: 799.9,
        },
        {
          produto: { 
            id: 3, 
            nome: 'Acero Adventure', 
            nome_produto: 'Acero Adventure',
            categoria: 'Borzeguim', 
            categoria_produto: 'Borzeguim',
            preco: 299.9, 
            preco_produto: 299.9,
            estoque: 28, 
            quantidade_estoque: 28,
            status: 'Em Estoque' 
          } as any,
          quantidade: 1,
          precoUnitario: 299.9,
        },
      ],
    },
  ]);

  const [formData, setFormData] = useState<PedidoFormData>({
    id: '',
    valorTotal: '',
    status: 'Pendente',
    dataPedido: '',
    usuarioId: '',
    enderecoId: '',
    produtos_do_pedido: [],
  });

  const handleEdit = (id: string | number): void => {
    const pedido = pedidos.find((p) => String(p.id) === String(id));
    if (pedido) {
      setFormData({
        id: pedido.id,
        valorTotal: pedido.valorTotal,
        status: pedido.status,
        dataPedido: pedido.dataPedido,
        usuarioId: pedido.usuarioId,
        enderecoId: pedido.enderecoId,
        produtos_do_pedido: pedido.produtos_do_pedido || [],
      });
      setEditingId(pedido.id);
      setIsEditing(true);
    }
  };

  const handleCloseForm = (): void => {
    setIsEditing(false);
    setEditingId(null);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (editingId !== null) {
      setPedidos((prevPedidos) =>
        prevPedidos.map((p) =>
          String(p.id) === String(editingId) ? { ...p, status: formData.status } : p
        )
      );
    }
    handleCloseForm();
  };

  const handleDelete = (id: string | number): void => {
    setPedidos((prev) =>
      prev.map((p) => (String(p.id) === String(id) ? { ...p, status: 'Cancelado' } : p))
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

          {isEditing ? (
            <div className="w-full bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-900">
                Detalhes do Pedido #{formData.id}
              </h2>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {/* ID do Pedido */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">
                      ID do Pedido
                    </label>
                    <input
                      type="text"
                      disabled
                      value={formData.id}
                      className="p-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed focus:outline-none"
                    />
                  </div>

                  {/* ID do Cliente */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">
                      ID do Cliente
                    </label>
                    <input
                      type="text"
                      disabled
                      value={formData.usuarioId}
                      className="p-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed focus:outline-none"
                    />
                  </div>

                  {/* ID do Endereço */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">
                      ID do Endereço de Entrega
                    </label>
                    <input
                      type="text"
                      disabled
                      value={formData.enderecoId}
                      className="p-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed focus:outline-none"
                    />
                  </div>

                  {/* Data do Pedido */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">
                      Data e Hora do Pedido
                    </label>
                    <input
                      type="text"
                      disabled
                      value={
                        formData.dataPedido
                          ? new Date(formData.dataPedido).toLocaleString('pt-BR')
                          : ''
                      }
                      className="p-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed focus:outline-none"
                    />
                  </div>

                  {/* Valor Total */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-600">
                      Valor Total (R$)
                    </label>
                    <input
                      type="text"
                      disabled
                      value={
                        typeof formData.valorTotal === 'number'
                          ? `R$ ${formData.valorTotal.toFixed(2).replace('.', ',')}`
                          : formData.valorTotal
                      }
                      className="p-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed focus:outline-none"
                    />
                  </div>

                  {/* Status do Pedido */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-slate-900">
                      Status do Pedido (Editável)
                    </label>
                    <select
                      className="p-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 bg-white font-medium"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as PedidoStatus,
                        })
                      }
                      required
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
                  <h3 className="text-md font-semibold text-slate-800 border-b border-slate-100 pb-2">
                    Produtos no Pedido
                  </h3>
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="min-w-full divide-y divide-slate-200 text-sm">
                      <thead className="bg-slate-50 text-slate-600 font-medium">
                        <tr>
                          <th className="px-4 py-2.5 text-left">Produto</th>
                          <th className="px-4 py-2.5 text-left">Categoria</th>
                          <th className="px-4 py-2.5 text-center">Quantidade</th>
                          <th className="px-4 py-2.5 text-right">Preço Unitário</th>
                          <th className="px-4 py-2.5 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                        {formData.produtos_do_pedido && formData.produtos_do_pedido.length > 0 ? (
                          (formData.produtos_do_pedido as any[]).map((item, index) => {
                            const prod = item.produto || {};
                            const nome = prod.nome_produto || prod.nome || 'Produto Sem Nome';
                            const categoria = prod.categoria_produto || prod.categoria || 'Geral';
                            const precoBase = prod.preco_produto ?? prod.preco ?? 0;
                            const preco = item.precoUnitario ?? precoBase;
                            const subtotal = preco * (item.quantidade || 1);

                            return (
                              <tr key={index} className="hover:bg-slate-50/50">
                                <td className="px-4 py-2.5 font-medium text-slate-900">
                                  {nome}
                                </td>
                                <td className="px-4 py-2.5 text-slate-500">
                                  {categoria}
                                </td>
                                <td className="px-4 py-2.5 text-center font-medium">
                                  {item.quantidade}
                                </td>
                                <td className="px-4 py-2.5 text-right">
                                  R$ {Number(preco).toFixed(2).replace('.', ',')}
                                </td>
                                <td className="px-4 py-2.5 text-right font-medium text-slate-900">
                                  R$ {Number(subtotal).toFixed(2).replace('.', ',')}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-4 py-3 text-center text-slate-400 italic">
                              Nenhum produto atrelado a este pedido.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                  >
                    Salvar Alterações
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </main>
    </div>
  );
}