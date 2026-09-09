export type StatusEstoque = 'Em Estoque' | 'Baixo Estoque' | 'Esgotado';
export type TipoUsuario = 'Administrador' | 'VIP' | 'Cliente';

export interface Produto {
  id: number;
  nome: string;
  sku: string;
  categoria: string;
  modelo: string;
  cor: string;
  preco: number;
  estoque: number;
  status: StatusEstoque;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: TipoUsuario;
  status: 'Ativo' | 'Inativo';
  dataCadastro: string;
}

export interface LogEvento {
  id: number;
  usuario: string;
  acao: string;
  modulo: string;
  dataHora: string;
  ip: string;
  tipoStatus: 'Sucesso' | 'Alerta' | 'Erro';
}


export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onActionClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  hideButton?: boolean;
  buttonClassName?: string;
}

export interface MetricCardData {
  id: string | number;
  title: string;
  value: string | number;
  percentageChange?: number;
  isPositive?: boolean;
}

export interface LogEvent {
  id: string | number;
  usuario: string;
  acao: string;
  dataHora: string;
  detalhes?: string;
}

// Novos tipos para a Gestão de Imagens da Loja Virtual
export interface StoreImageSection {
  id: string;
  title: string;
  description: string;
  currentImageUrl?: string;
  recommendedSize?: string;
}