// src/services/pedidos.service.ts
import { api } from "./api";
import { Pedido, PedidoFilters } from "../types/order";

/**
 * Serviço de comunicação com a API de pedidos.
 * Utiliza o cliente Axios configurado em src/services/api.ts que já inclui
 * o token de autenticação e tratamento de headers.
 */
export const pedidosService = {
  /**
   * Lista pedidos com paginação e filtros opcionais.
   * O backend aceita query params: page, per_page, busca, status.
   */
  listar: async (page = 1, perPage = 20, filtros?: PedidoFilters) => {
    const params: any = { page, per_page: perPage };
    if (filtros?.busca) params.busca = filtros.busca;
    if (filtros?.status) params.status = filtros.status;
    const response = await api.get<{ data: Pedido[]; meta: any }>("/pedidos", { params });
    return response.data;
  },

  /** Busca detalhes de um pedido pelo ID público (hashid). */
  buscar: async (id: string | number) => {
    const response = await api.get<{ data: Pedido }>(`/pedidos/${id}`);
    return response.data.data;
  },

  /** Atualiza o status logístico do pedido (endpoint PATCH admin). */
  atualizarStatus: async (id: string | number, novoStatus: string) => {
    try {
      const response = await api.patch<{ data: Pedido }>(`/admin/pedidos/${id}/status`, {
        status: novoStatus,
      });
      return response.data.data;
    } catch (err: any) {
      if (err.response?.status === 404 || err.response?.status === 405) {
        const response = await api.put<{ data: Pedido }>(`/pedidos/${id}`, {
          status: novoStatus,
        });
        return response.data.data;
      }
      throw err;
    }
  },

  /** Cancelamento de pedido (regra de negócio implementada no backend). */
  cancelar: async (id: string | number) => {
    const response = await api.delete<{ data: Pedido }>(`/admin/pedidos/${id}`);
    return response.data.data;
  },
};
