// src/hooks/usePedidos.ts
import { useState, useEffect, useCallback } from "react";
import { pedidosService } from "../services/pedidos.service";
import { Pedido, PedidoFilters } from "../types/order";

/**
 * Hook customizado para listar, buscar e gerenciar pedidos.
 *
 * - `pedidos`: array de pedidos retornado pelo backend.
 * - `loading`: true enquanto a requisição está em andamento.
 * - `error`: mensagem de erro caso a chamada falhe.
 * - `refetch`: reexecuta a listagem (útil após atualizar ou cancelar).
 * - `page` / `setPage`: controle de paginação simples.
 */
export function usePedidos(initialPage = 1, perPage = 20, initialFilters?: PedidoFilters) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(initialPage);
  const [filters, setFilters] = useState<PedidoFilters | undefined>(initialFilters);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchPedidos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, meta } = await pedidosService.listar(page, perPage, filters);
      setPedidos(data);
      if (meta?.last_page) {
        setTotalPages(meta.last_page);
      } else {
        const total = meta?.total ?? data.length;
        setTotalPages(Math.max(1, Math.ceil(total / perPage)));
      }
    } catch (e: any) {
      setError(e?.message ?? "Erro ao carregar pedidos");
    } finally {
      setLoading(false);
    }
  }, [page, perPage, filters]);

  useEffect(() => {
    fetchPedidos();
  }, [fetchPedidos]);

  return {
    pedidos,
    loading,
    error,
    refetch: fetchPedidos,
    page,
    setPage,
    filters,
    setFilters,
    totalPages,
  };
}
