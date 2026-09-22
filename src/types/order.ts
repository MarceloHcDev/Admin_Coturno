// src/types/order.ts
import { Product } from './product';

export type PedidoCompraStatus =
  | 'Pendente'
  | 'Aprovado'
  | 'Processando'
  | 'Recusado'
  | 'Reembolsado'
  | 'Em_contestação'
  | 'Cancelado';

export type PedidoEnvioStatus =
  | 'Pendente'
  | 'Enviado'
  | 'Entregue'
  | 'Cancelado';

export interface ItemPedido {
  produto: Product;
  quantidade: number;
  precoUnitario?: number;
}

export interface Pedido {
  id: string | number;
  valorTotal: number;
  statusCompra: PedidoCompraStatus;
  statusEnvio: PedidoEnvioStatus;
  dataPedido: string;
  usuarioId: string | number;
  enderecoId: string | number;
  produtos_do_pedido: ItemPedido[];
}

export interface PedidoFilters {
  busca: string;
  status?: PedidoEnvioStatus;
}