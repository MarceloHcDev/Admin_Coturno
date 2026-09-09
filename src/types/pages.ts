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