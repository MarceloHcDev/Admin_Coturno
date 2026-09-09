export type ProductStatus = 'Em Estoque' | 'Baixo Estoque' | 'Esgotado';

export interface Product {
  id: string | number;
  name: string;
  category: string;
  model: string;
  color: string;
  price: number;
  stock: number;
  status: ProductStatus;
}