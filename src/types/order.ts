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
  | 'Em Separação'
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
  status: string;
  valorTotal: number;
  subtotal?: number;
  frete?: number;
  shippingFee?: number;
  statusCompra: PedidoCompraStatus;
  statusEnvio: PedidoEnvioStatus | string;
  dataPedido: string;
  usuarioId: string | number;
  enderecoId: string | number;
  cliente?: string;
  /** Endereço formatado */
  endereco?: {
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    texto?: string;
  };
  produtos_do_pedido: ItemPedido[];
}

export interface PedidoFilters {
  busca: string;
  status?: PedidoEnvioStatus;
}