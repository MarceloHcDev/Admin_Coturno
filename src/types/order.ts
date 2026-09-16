// src/types/order.ts

export type PedidoStatus =
  | 'Pendente'
  | 'Enviado'
  | 'Entregue'
  | 'Cancelado';

export interface Pedido {
  id: string | number;
  valorTotal: number;
  status: PedidoStatus;
  dataPedido: string;
  usuarioId: string | number;
  enderecoId: string | number;
}

export interface PedidoFilters {
  busca: string;
  status?: PedidoStatus;
}
